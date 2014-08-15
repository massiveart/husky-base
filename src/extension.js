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
define(['./base', './logger'], function(base, Logger) {

    'use strict';

    var deferred = base.data.deferred,
        when = base.data.when,
        logger = new Logger('Extensions').enable(),
        noop = function() {
            // no Operation
        };

    /**
     * @class ExtensionManager
     * @constructor
     */
    function ExtensionManager() {

        /**
         * @property initStatus
         * @type {Deferred}
         */
        this.initStatus = deferred();

        this.initStarted = false;
        this.extensions = [];

        return this;
    }

    /**
     * @method add
     * @param {Object} extension
     * @return {ExtensionManager}
     * @chainable
     */
    ExtensionManager.prototype.add = function(extension) {

        if (base.util.include(this.extensions, extension)) {
            var msg = extension.ref.toString() + ' is already registered.';
            msg += ' Extensions can only be added once.';
            throw new Error(msg);
        }

        if (this.initStarted) {
            throw new Error('Init extensions already called');
        }

        this.extensions.push(extension);
        return this;
    };

    /**
     * @method onReady
     * @param {Function} fn
     * @return {ExtensionManager}
     * @chainable
     */
    ExtensionManager.prototype.onReady = function(fn) {
        this.initStatus.then(fn);
        return this;
    };

    /**
     * @method onFailure
     * @param {Function} fn
     * @return {ExtensionManager}
     * @chainable
     */
    ExtensionManager.prototype.onFailure = function(fn) {
        this.initStatus.fail(fn);
        return this;
    };

    /**
     * @method init
     * @return {Promise}
     */
    ExtensionManager.prototype.init = function() {

        if (this.initStarted) {
            throw new Error('Init extensions already called');
        }

        this.initStarted = true;

        // make a deep copy of the extensions
        var extensions = base.util.compact(this.extensions.slice(0)),
            initialized = [],
            initStatus = this.initStatus;

        // Enforce sequential loading of extensions.
        // The `initStatus` promise resolves to the
        // actually resolved and loaded extensions.
        (function sequentialInit(extensionDefinition) {

            if (extensionDefinition) {
                var extension = initExtension(extensionDefinition);
                initialized.push(extension);

                // successfully initialized extension
                extension.done(function() {
                    sequentialInit(extensions.shift());
                });

                // loading extension failed
                extension.fail(function(err) {

                    if (!err) {
                        err = 'Unknown error while loading an extension';
                    }

                    if (!(err instanceof Error)) {
                        err = new Error(err);
                    }

                    initStatus.reject(err);
                });
            } else if (extensions.length === 0) {
                when.apply(undefined, initialized).done(function() {
                    initStatus.resolve(Array.prototype.slice.call(arguments));
                });
            }
        })(extensions.shift());

        return initStatus.promise();
    };

    /*!
     * Actual extension loading.
     *
     * The sequence is:
     *
     * - resolves the extension reference
     * - register and requires its dependencies if any
     * - init the extension
     *
     * This method also returns a promise that allows
     * to keep track of the app loading sequence.
     *
     * If the extension provides a `afterAppStart` method,
     * the promise will resolve to that function that
     * will be called at the end of the app loading sequence.
     *
     * @param {String|Object|Function} extensionDefinition The reference and context of the extension
     */
    function initExtension(extensionDefinition) {
        var req, dfd = deferred(),
            ref = extensionDefinition.ref,
            context = extensionDefinition.context;

        // require extension now
        req = requireExtension(ref, context);
        req.fail(dfd.reject);
        req.done(function(extension) {

            // The extension did not return anything,
            // but probably already did what it had to do.
            if (!extension) {
                return dfd.resolve();
            } else {
                // Else let's initialize it ...
                // If extension is a function, call it
                // else if extension has a init method, call it
                var initialization = when(getFn(extension, extension.initialize)(context));

                initialization.done(function() {
                    dfd.resolve(extension);
                });

                initialization.fail(dfd.reject);
            }
        });

        return dfd.promise();
    }

    /*!
     * Extension resolution before actual loading.
     * If `extension` is a String, it is considered as a reference
     * to an AMD module that has to be loaded.
     *
     * This method returns a promise that resolves to the actual extension,
     * With all its dependencies already required' too.
     *
     * @param {String|Object|Function} extension The reference of the extension
     * @param {Object} context The thing this extension is supposed to extend
     */
    function requireExtension(extension, context) {
        var dfd = deferred(),

            resolve = function(extension) {
                extension = getVal(extension, context);
                if (extension && extension.require && extension.require.paths) {
                    var dependencies = Object.keys(extension.require.paths) || [];
                    require.config(extension.require);

                    // require extension dependencies
                    require(dependencies, function() {
                        dfd.resolve(extension);
                    }, reject);
                } else {
                    dfd.resolve(extension);
                }
            },

            reject = function(err) {
                logger.error('Error loading extension:', extension, err);
                dfd.reject(err);
            };

        if (typeof extension === 'string') {
            require([extension], resolve, reject);
        } else {
            resolve(extension);
        }

        return dfd;
    }

    /*!
     * Helper function that returns the first function found among its arguments.
     * If no function if found, it return a noop (empty function).
     *
     * @return {Function}
     */
    function getFn() {
        var funcs = Array.prototype.slice.call(arguments),
            fn, i, len;

        for (i = 0, len = funcs.length; i < len; i++) {
            fn = funcs[i];
            if (typeof(fn) === 'function') {
                return fn;
            }
        }

        return noop;
    }

    /*!
     * If the value of the first argument is a function then invoke
     * it with the rest of the args, otherwise, return it.
     */
    function getVal(val) {
        if (typeof val === 'function') {
            return val.apply(undefined, Array.prototype.slice.call(arguments, 1));
        } else {
            return val;
        }
    }

    return ExtensionManager;
});
