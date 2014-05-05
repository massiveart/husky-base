/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) Thomas Schedler <thomas@chirimoya.at>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 *
 * @module husky/extensions
 */
define('husky/extensions/components', function() {

    'use strict';


    return function(app) {

        var core = app.core,

            componentDefaults = {},
            registeredComponents = {},
            componentsCallbacks = {},

            noop = function() {
                // no Operation
            },

            extend;

        core.Components = core.Components || {};

        /*!
         * Borrowed from Backbone.JS
         * Helper function to correctly set up the prototype chain, for subclasses.
         * Similar to `goog.inherits`, but uses a hash of prototype properties and
         * class properties to be extended.
         */
        extend = function(protoProps, staticProps) {
            var parent = this,
                child, Surrogate;

            // The constructor function for the new subclass is either defined by you
            // (the 'constructor' property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && core.util.has(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function() {
                    return parent.apply(this, arguments);
                };
            }

            // Add static properties to the constructor function, if supplied.
            core.util.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            Surrogate = function() {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate();

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) {
                core.util.extend(child.prototype, protoProps);
            }

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        };

        /*!
         * Actually registering the callbacks in the registry.
         */
        function registerComponentCallback(callbackName, fn) {
            componentsCallbacks[callbackName] = componentsCallbacks[callbackName] || [];
            componentsCallbacks[callbackName].push(fn);
        }

        /*!
         * Invoke callback for given component, function and stage.
         */
        function invokeCallbacks(stage, fnName, context, args) {
            var callbacks = componentsCallbacks[stage + ':' + fnName] || [],
                dfds = [];

            core.util.each(callbacks, function(callback) {
                if (typeof callback === 'function') {
                    dfds.push(callback.apply(context, args));
                }
            });

            return core.data.when.apply(undefined, dfds).promise();
        }

        /*!
         * Invoke function with before and after
         * callbacks of the given component.
         */
        function invokeWithCallbacks(fn, context) {
            var fnName, before, result,
                dfd = app.core.data.deferred(),
                args = [].slice.call(arguments, 2);

            if (typeof fn === 'string') {
                fnName = fn;
                fn = context[fnName] || noop;
            } else if (typeof fn.name === 'string') {
                fnName = fn.name;
                fn = fn.fn || noop;
            } else {
                throw new Error('Error invoking `Component` with callbacks: ', context.options.name, '. First argument should be either the name of a function or of the form : { name: "fnName", fn: function() { ... } }');
            }

            before = invokeCallbacks('before', fnName, context, args);
            before.then(function() {
                result = fn.apply(context, args);
                return result;
            }).then(function() {
                invokeCallbacks('after', fnName, context, args).then(function() {
                    dfd.resolve(result);
                }, dfd.reject);
            }).fail(function(err) {
                app.logger.error('Error in `Component` ' + context.options.name + ' ' + fnName + ' callback', err);
                dfd.reject(err);
            });

            return dfd.promise();
        }

        /*!
         * Parses the component's options from its element's data attributes.
         */
        function parseComponentOptions(el, namespace, opts) {
            var data = core.dom.data(el),
                options = core.util.clone(opts || {}),
                name = null;
            options.el = el;
            options.require = {};

            // Here we go through all the data attributes of the element to build the options object
            core.util.each(data, function(value, key) {
                key = key.replace(new RegExp('^' + namespace), '');
                key = key.charAt(0).toLowerCase() + key.slice(1);
                if (key !== 'component') {
                    options[key] = value;
                } else {
                    name = value;
                }
            });

            return buildComponentOptions(name, options);
        }

        /*!
         * Parses the component's options from its element's data attributes.
         */
        function buildComponentOptions(name, options) {
            var ref = name.split('@'),
                componentName = core.util.decamelize(ref[0]),
                componentSource = ref[1] || 'husky',
                componentsPath = app.config.sources[componentSource] || './components';

            // Register the component as a requirejs package...
            options.name = componentName;
            options.ref = componentName + '@' + componentSource;
            options.baseUrl = componentsPath + '/' + componentName;
            options.require = options.require || {};
            options.require.packages = options.require.packages || [];
            options.require.packages.push({ name: options.ref, location: options.baseUrl });
            return options;
        }

        /**
         * @class  Component
         * @constructor
         * @param {Object} options The options to init the component.
         */
        function Component(options) {

            var opts = core.util.clone(options);

            /**
             * @property options
             * @type {Object}
             */
            this.options = core.util.defaults(opts || {}, componentDefaults);

            /**
             * @property ref
             * @type {String}
             */
            this.ref = opts.ref;

            /**
             * @property $el
             * @type {Object}
             */
            this.$el = core.dom.find(opts.el);

            this.invokeWithCallbacks('initialize', this.options);
            return this;
        }

        /**
         * Method called on Components initialization.
         *
         * @method initialize
         * @param {Object} options Options Object passed on Component initialization
         */
        Component.prototype.initialize = noop;

        /**
         * A helper function to render markup and recursively start nested components.
         *
         * @method html
         * @param {String} markup The markup to render in the component's root el
         * @return {Component}
         * @chainable
         */
        Component.prototype.html = function(markup) {
            var el = this.$el;
            el.html(markup);
            core.util.defer(function() {
                this.sandbox.start(el, { reset: true });
            }.bind(this));
            return this;
        };

        /**
         * A helper function to find matching elements within the Component's root element.
         *
         * @method  $find
         * @param  {Selector|Object} selector CSS selector or jQuery object.
         * @return {Object}
         */
        Component.prototype.$find = function(selector) {
            return this.$el.find(selector);
        };

        /**
         * Invoke method with components registered before and after callbacks.
         *
         * @method  invokeWithCallbacks
         * @param  {String} methodName the name of the method to invoke with callbacks
         * @return {Promise} a Promise that will resolve to the return value of the original function invoked.
         */
        Component.prototype.invokeWithCallbacks = function(methodName) {
            return invokeWithCallbacks.apply(undefined, [methodName, this].concat([].slice.call(arguments, 1)));
        };

        /**
         * @method extend
         * @static
         */
        Component.extend = extend;

        /**
         * @method load
         * @static
         * @param {String} name The name of the Component to load
         * @param {Object} options The options to pass to the new component instance.
         * @return {Promise} A Promise that resolves to the loaded component instance.
         */
        Component.load = function(name, options) {
            // TODO: Make it more simple / or break it down
            // in several functions...
            // it's too big !

            var dfd = core.data.deferred(),
                ComponentConstructor,
                ref = options.ref,
                el = options.el,
                opts = core.util.clone(options);

            opts.ref = core.util.uniqueId(ref + '+');

            app.logger.log('Start loading component:', name);

            dfd.fail(function(err) {
                app.logger.error('Error loading component:', name, err);
            });

            // apply requirejs map / package configuration before the actual loading.
            require.config(opts.require);

            // Here, we require the component's package definition
            require([ref], function(componentDefinition) {

                if (!componentDefinition) {
                    return dfd.reject('Component ' + ref + ' definition is empty!');
                }

                try {

                    // Ok, the component has already been loaded once, we should already have it in the registry
                    if (registeredComponents[ref]) {
                        ComponentConstructor = registeredComponents[ref];
                    } else {

                        if (componentDefinition.type) {
                            // If `type` is defined, we use a constructor provided by an extension ? ex. Backbone.
                            ComponentConstructor = core.Components[componentDefinition.type];
                        } else {
                            // Otherwise, we use the stock Component constructor.
                            ComponentConstructor = Component;
                        }

                        if (!ComponentConstructor) {
                            throw new Error('Can\'t find component of type "' + componentDefinition.type + '", did you forget to include the extension that provides it ?');
                        }

                        if (core.util.isObject(componentDefinition)) {
                            ComponentConstructor = registeredComponents[ref] = ComponentConstructor.extend(componentDefinition);
                        }
                    }

                    var sandbox = app.sandboxes.create(opts.ref, { el: el }),
                        ext = {}, newComponent, initialized;

                    sandbox.logger.setName('Component "' + name + '" (' + sandbox.logger.name + ')');

                    // Here we inject the sandbox in the component's prototype...
                    ext.sandbox = sandbox;

                    // If the Component is just defined as a function, we use it as its `initialize` method.
                    if (core.util.isFunction(componentDefinition)) {
                        ext.initialize = componentDefinition;
                    }

                    ComponentConstructor = ComponentConstructor.extend(ext);

                    newComponent = new ComponentConstructor(opts);

                    // Sandbox owns its el and vice-versa
                    newComponent.$el.data('__sandbox_ref__', sandbox.ref);

                    initialized = core.data.when(newComponent);

                    initialized.then(function(ret) {
                        dfd.resolve(ret);
                    });

                    initialized.fail(function(err) {
                        dfd.reject(err);
                    });

                    return initialized;
                } catch (err) {
                    app.logger.error(err.message);
                    dfd.reject(err);
                }
            }, function(err) {
                dfd.reject(err);
            });

            return dfd.promise();
        };

        /**
         * Returns a list of components.
         * If the first argument is a String, it is considered as a DomNode reference
         * We then parse its content to find husky-components inside of it.
         *
         * @method parseList
         * @static
         * @param  {Array|String} components A list of components or a reference to a root dom node
         * @return {Array} A list of component with their options
         */
        Component.parseList = function(components) {
            var list = [], selector, appNamespace;

            if (Array.isArray(components)) {
                core.util.map(components, function(component) {
                    var options = buildComponentOptions(component.name, component.options);
                    list.push({ name: component.name, options: options });
                });
            } else if (components && core.dom.find(components)) {
                appNamespace = app.config.namespace;

                selector = ['[data-husky-component]'];

                if (appNamespace) {
                    selector.push('[data-' + appNamespace + '-component]');
                }

                selector = selector.join(',');
                core.dom.find(selector, components || 'body').each(function() {
                    var ns = 'husky', options;
                    if (appNamespace && (this.getAttribute('data-' + appNamespace + '-component'))) {
                        ns = appNamespace;
                    }
                    options = parseComponentOptions(this, ns);
                    list.push({ name: options.name, options: options });
                });
            }
            return list;
        };

        /**
         * Actual start method for a list of components.
         *
         * @method startAll
         * @static
         * @param  {Array|String} components `Component.parseList`
         * @return {Promise} A promise that resolves to a list of started components.
         */
        Component.startAll = function(components) {
            var componentsList = Component.parseList(components),
                list = [], loadedComponents;
            core.util.each(componentsList, function(component) {
                var ret = Component.load(component.name, component.options);
                list.push(ret);
            });
            loadedComponents = core.data.when.apply(undefined, list);
            return loadedComponents.promise();
        };

        // extension definition

        return {

            name: 'components',

            require: {
                paths: {
                    text: 'bower_components/requirejs-text/text'
                }
            },

            initialize: function(app) {

                // Components 'classes' registry...
                app.core.Components.Base = Component;


                /**
                 * @class Husky
                 */

                /**
                 * Registers a function that will be executed before the associated
                 * Component method is called.
                 *
                 * Once registered, every time a component method will be called with the
                 * `invokeWithCallbacks` method the registered callbacks will execute accordingly.
                 *
                 * The callback functions can return a promise if required in order to
                 * postpone the execution of the called function up to when the all
                 * registered callbacks results are resolved.
                 *
                 * The arguments passed to the callbacks are the same than those which
                 * with the component will be called. The scope of the callback is
                 * the component instance itself, as per the component method.
                 *
                 * @method components.before
                 * @param {String} methodName eg. 'initialize', 'remove'
                 * @param {Function} fn Actual function to run
                 */
                app.components.before = function(methodName, fn) {
                    var callbackName = 'before:' + methodName;
                    registerComponentCallback(callbackName, fn);
                };

                /**
                 * Same as components.before, but executed after the method invocation.
                 *
                 * @method components.after
                 * @param {[type]} methodName eg. 'initialize', 'remove'
                 * @param {Function} fn Actual function to run
                 */
                app.components.after = function(methodName, fn) {
                    var callbackName = 'after:' + methodName;
                    registerComponentCallback(callbackName, fn);
                };

                /**
                 * Register a Component Type (experimental).
                 * Components type ca be used to encapsulate many custom components behaviours.
                 * They will be then used while declaring your components as follows:
                 *
                 * @example
                 *  define({
                 *      type: 'myComponentType',
                 *      // component declaration...
                 *  });
                 *
                 * @method components.addType
                 * @param {String} type A string that will identify the component type.
                 * @param {Function} def A constructor the this component type
                 * @return {Husky} The Husky app instance
                 * @chainable
                 */
                app.components.addType = function(type, def) {
                    if (app.core.Components[type]) {
                        throw new Error('Component type ' + type + ' already defined');
                    }
                    app.core.Components[type] = Component.extend(def);
                    return app;
                };

                /**
                 * @class Sandbox
                 */

                /**
                 * Start method.
                 * This method takes either an Array of Components to start or or DOM Selector to
                 * target the element that will be parsed to look for Components to start.
                 *
                 * @method  start
                 * @param {Array|Selector} list Array of Components to start or parent node.
                 * @param {Object} options Available options: `reset` : if true, all current children
                 *                         will be stopped before start.
                 */
                app.sandbox.start = function(list, options) {
                    var children = this.children || [];
                    app.core.mediator.emit(['husky', 'sandbox', 'start'], this);

                    if (options && options.reset) {
                        core.util.invoke(this._children || [], 'stop');
                        children = [];
                    }

                    Component.startAll(list).done(function() {
                        var components = Array.prototype.slice.call(arguments);
                        _.each(components, function(component) {
                            component.sandbox.component = component;
                            component.sandbox.parent = this;
                            children.push(component.sandbox);
                        });
                        this.children = children;
                    }.bind(this));

                    return this;
                };
            },

            /**
             * When all of an application's extensions are finally loaded, the 'extensions'
             * afterAppStart methods are then called.
             *
             * @method components.afterAppStart
             * @param {Object} app A Husky application object
             */
            afterAppStart: function(app) {
                if (app.config.components !== false && app.startOptions.components !== false) {
                    var el;
                    if (Array.isArray(app.startOptions.components)) {
                        el = core.dom.find('body');
                    } else {
                        el = core.dom.find(app.startOptions.components);
                    }
                    app.core.appSandbox = app.sandboxes.create(app.ref, { el: el });
                    app.core.appSandbox.start(app.startOptions.components);
                }
            }
        };
    };

});
