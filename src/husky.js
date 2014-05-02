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
     * @constructor
     */
    function Husky(config) {

        if (!(this instanceof Husky)) {
            return new Husky(config);
        }

        /**
         * @property config
         * @type {Object}
         */
        this.config = config || {};
        base.util.defaults(this.config, defaults);

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

        // enable logger, if debug mode is enabled
        if (!!config.debug) {
            this.logger.enable();
        }

    }

    return Husky;
});
