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
define(function() {

    'use strict';

    var noop = function() {
            // no Operation
        },
        console = window.console || {};

    /**
     * @class Logger
     * @param {String} name Name of Logger instance
     * @constructor
     */
    function Logger(name) {

        /**
         * @property name
         * @type {String}
         */
        this.name = name;

        /**
         * @property enabled
         * @type {Boolean}
         */
        this.enabled = false;

        this.logWriter = noop;
        this.warnWriter = noop;
        this.errorWriter = noop;

        return this;
    }

    /**
     * @method isEnabled
     * @return {Boolean}
     * @chainable
     */
    Logger.prototype.isEnabled = function() {
        return this.enabled;
    };

    /**
     * @method setName
     * @param {String} name Name of Logger instance
     */
    Logger.prototype.setName = function(name) {
        this.name = name;
    };

    /**
     * @method enable
     * @return {Logger}
     * @chainable
     */
    Logger.prototype.enable = function() {
        this.logWriter = (console.log || noop);
        this.warnWriter = (console.warn || this.logWriter);
        this.errorWriter = (console.error || this.logWriter);
        this.enabled = true;
        return this;
    };

    Logger.prototype.write = function(output, args) {
        var parameters = Array.prototype.slice.call(args);
        parameters.unshift(this.name + ':');
        output.apply(console, parameters);
    };

    /**
     * Writes a log message into the browser's console (if present).
     * @method log
     * @param {*} message*
     */
    Logger.prototype.log = function() {
        this.write(this.logWriter, arguments);
    };

    /**
     * Writes a warning into the browser's console (if present).
     * @method warn
     * @param {*} warning*
     */
    Logger.prototype.warn = function() {
        this.write(this.warnWriter, arguments);
    };

    /**
     * Writes an error into the browser's console (if present).
     * @method error
     * @param {*} error*
     */
    Logger.prototype.error = function() {
        this.write(this.errorWriter, arguments);
    };

    return Logger;
});
