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

    // auto configure husky path... if not set yet...
    if (!require.s.contexts._.config.paths.husky) {
        require.config({
            paths: {
                husky: module.id.replace(/\/husky$/, '')
            }
        });
    }

    // app default config
    var defaults = {
        debug: false,
        sources: {
            default: './husky_components'
        }
    };

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
            baseSandbox = Object.create(base);

        /**
         * @property config
         * @type {Object}
         */
        this.config = base.util.defaults(config || {}, defaults);

        /**
         * @property ref
         * @type {String}
         */
        this.ref = base.util.uniqueId('husky_');

        /**
         * @property logger
         * @type {Logger}
         */
        this.logger = new Logger(this.ref);

        /**
         * The application `core` property is just a namespace
         * used by the extensions to add new features.
         *
         * @property core
         * @type {Object}
         */
        this.core = Object.create(base);

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
        this.sandbox = baseSandbox;

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
        this.use = function(ref) {
            extensionManager.add({ ref: ref, context: this });
            return this;
        };

        /**
         * @method start
         * @return {Promise}
         */
        this.start = function() {




            // Return the extension manager init promise that allows us
            // to keep track of the loading process ...
            return extensionManager.init();
        };

        // enable logger, if debug mode is enabled
        if (!!config.debug) {
            this.logger.enable();
        }

        this.use('husky/extensions/mediator');
        this.use('husky/extensions/components');

        return this;
    }

    return Husky;
});
