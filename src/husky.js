/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) Thomas Schedler <thomas@chirimoya.at>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 *
 * @module husky
 */
define(['module', './base', './extension', './logger'], function(module, base, ExtensionManager, Logger) {

    'use strict';

    // app default config
    var huskyPath = module.id.replace(/\/husky$/, ''),
        defaults = {
            debug: false,
            sources: {
                husky: huskyPath + '/components'
            }
        };

    // auto configure husky path... if not set yet...
    if (!require.s.contexts._.config.paths.husky) {
        require.config({
            paths: {
                husky: huskyPath
            }
        });
    }

    /**
     * @class Husky
     * @param {Object} [config] Configuration object
     * @param {Boolean} [config.debug] Enable debug mode
     * @return {Husky} The Husky app instance
     * @constructor
     */
    function Husky(config) {

        if (!(this instanceof Husky)) {
            return new Husky(config);
        }

        // private
        var extensionManager = new ExtensionManager(),
            baseSandbox = Object.create(base),
            appSandboxes = {},
            app = this;

        /**
         * @property config
         * @type {Object}
         */
        app.config = base.util.defaults(config || {}, defaults);

        /**
         * @property ref
         * @type {String}
         */
        app.ref = base.util.uniqueId('husky_');

        /**
         * @property logger
         * @type {Logger}
         */
        app.logger = new Logger(app.ref);

        /**
         * The application `core` property is just a namespace
         * used by the extensions to add new features.
         *
         * @property core
         * @type {Object}
         */
        app.core = Object.create(base);

        /**
         * Sandboxes are a way to implement the facade pattern on top of the features provided by `core`.
         *
         * The `sandbox` property of an Husky application is just an Object that will be used
         * as a blueprint, once the app is started, to create new instances
         * of sandboxed environments for the components.
         *
         * @property sandbox
         * @type {Object}
         */
        app.sandbox = baseSandbox;

        /**
         * Namespace for sanboxes related methods.
         *
         * @property sandboxes
         * @type {Object}
         */
        app.sandboxes = {};

        /**
         * Creates a brand new sandbox, using the App's `sandbox` object as a prototype.
         *
         * @method sandboxes.create
         * @param {String} [ref] The Sandbox unique ref
         * @param {Object} [options] An object to that directly extends the Sandbox
         * @return {Sandbox}
         */
        app.sandboxes.create = function(ref, options) {

            // Making sure we have a unique ref
            ref = ref || _.uniqueId('sandbox-');
            if (appSandboxes[ref]) {
                throw new Error('Sandbox with ref ' + ref + ' already exists.');
            }

            // Create a brand new sandbox based on the baseSandbox
            var sandbox = Object.create(baseSandbox),
                debug = config.debug;

            // Give it a ref
            sandbox.ref = ref || _.uniqueId('sandbox-');

            // Attach a Logger
            sandbox.logger = new Logger(sandbox.ref);

            // Register it in the app's sandboxes registry
            appSandboxes[sandbox.ref] = sandbox;

            if (debug === true || (debug.enable && (debug.components.length === 0 || debug.components.indexOf(ref) !== -1))) {
                sandbox.logger.enable();
            }

            // Extend if we have some options
            app.core.util.extend(sandbox, options || {});

            return sandbox;
        };

        /**
         * Get a sandbox by reference.
         *
         * @method sandboxes.get
         * @param  {String} ref  the Sandbox ref to retreive
         * @return {Sandbox}
         */
        app.sandboxes.get = function(ref) {
            return appSandboxes[ref];
        };

        /**
         * Namespace for components related methods.
         *
         * @property components
         * @type {Object}
         */
        app.components = {};

        /**
         * Adds a new source for components.
         * A Component source is an endpoint (basically a URL)
         * that is the root of a component repository.
         *
         * @method  components.addSource
         * @param {String} name The name of the source.
         * @param {String} baseUrl The base url for those components.
         * @return {Husky} The Husky app instance
         * @chainable
         */
        app.components.addSource = function(name, baseUrl) {
            if (config.sources[name]) {
                throw new Error('Components source "' + name + '" is already registered');
            }
            config.sources[name] = baseUrl;
            return app;
        };

        /**
         * Tells the app to load the given extension.
         * Husky extensions are loaded into the app during init.
         *
         * They are responsible for:
         *  - resolving & loading external dependencies via requirejs
         *  - they have direct access to the app internals
         *  - they are here to add new features to the app that are made
         *    available through the sandboxes to the components
         *
         * This method can only be called before the App is actually started.
         * Note that the App is started when its `start` method is called.
         *
         * @method use
         * @param  {String | Object | Function} ref The reference of the extension
         * @return {Husky} The Husky app instance
         * @chainable
         */
        app.use = function(ref) {
            extensionManager.add({ ref: ref, context: app});
            return app;
        };

        /**
         * @method start
         * @return {Promise}
         */
        app.start = function(options) {

            if (app.started) {
                app.logger.error('Husky already started!');
                return extensionManager.initStatus.promise();
            }

            app.logger.log('Starting Husky');

            var startOptions = options || {};

            // Support for different types of options (string, DOM Selector or Object)
            if (typeof options === 'string') {
                startOptions = { components: app.core.dom.find(options) };
            } else if (Array.isArray(options)) {
                startOptions = { components: options };
            } else if (startOptions.components === undefined) {
                startOptions.components = app.core.dom.find(app.config.components || 'body');
            }

            extensionManager.onReady(function(exts) {
                // Then we call all the `afterAppStart` provided by the extensions
                base.util.each(exts, function(ext) {
                    if (ext && typeof(ext.afterAppStart) === 'function') {
                        ext.afterAppStart(app);
                    }
                });
            });

            // If there was an error in the boot sequence we
            // reject every body and perform a cleanup
            extensionManager.onFailure(function() {
                app.logger.error('Error initializing app:', app.config.name, arguments);
                app.stop();
            });

            app.startOptions = startOptions;
            app.started = true;

            // Return the extension manager init promise that allows us
            // to keep track of the loading process ...
            return extensionManager.init();
        };

        /**
         * Stops the application and unregister its loaded dependencies.
         *
         * @method stop
         * @return {void}
         */
        app.stop = function() {
            // TODO: We ne to actually do some cleanup here.
            app.started = false;
        };

        /**
         * @class Sandbox
         */

        /**
         * Stop method for a Sandbox.
         * If no arguments provided, the sandbox itself and all its children are stopped.
         * If a DOM Selector is provided, all matching children will be stopped.
         *
         * @method stop
         * @param  {undefined|String} selector DOM Selector
         */
        app.sandbox.stop = function(selector) {
            if (selector) {
                app.core.dom.find(selector, this.el).each(function(i, el) {
                    var ref = app.core.dom.find(el).data('__sandbox_ref__');
                    stopSandbox(ref);
                });
            } else {
                stopSandbox(this);
            }
        };

        function stopSandbox(sandbox) {
            if (typeof sandbox === 'string') {
                sandbox = app.sandboxes.get(sandbox);
            }
            if (sandbox) {
                var event = ['husky', 'sandbox', 'stop'].join(app.config.mediator.delimiter);
                _.invoke(sandbox._children, 'stop');
                app.core.mediator.emit(event, sandbox);
                if (sandbox._component) {
                    sandbox._component.invokeWithCallbacks('remove');
                }
                sandbox.stopped = true;
                sandbox.el && app.core.dom.find(sandbox.el).remove();
                appSandboxes[sandbox.ref] = null;
                delete appSandboxes[sandbox.ref]; // do we need to actually call `delete` ?
                return sandbox;
            }
        }

        // enable logger, if debug mode is enabled
        if (!!config.debug) {
            app.logger.enable();
        }

        app.use('husky/extensions/mediator');
        app.use('husky/extensions/components');
        app.use('husky/extensions/mvc');

        return app;
    }

    return Husky;
});
