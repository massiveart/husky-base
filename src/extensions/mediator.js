/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) MASSIVE ART WebServices <webservices@massiveart.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 *
 * @module husky/extensions
 */
define('husky/extensions/mediator', function() {

    'use strict';

    return function(app) {

        // mediator default config
        var defaults = {
                wildcard: true,
                delimiter: '.',
                newListener: true,
                maxListeners: 20
            },

            attachListener = function(listenerType) {
                return function(name, listener, context) {

                    if (typeof listener !== 'function' || typeof name !== 'string') {
                        throw new Error('Invalid arguments passed to sandbox.' + listenerType);
                    }

                    context = context || this;

                    var callback = function() {
                        var args = Array.prototype.slice.call(arguments);

                        try {
                            listener.apply(context, args);
                        } catch (e) {
                            app.logger.error('Error caught in listener "' + name +
                                '", called with arguments: ', args, '\nError:', e.message, e, args);
                        }
                    };

                    this.events = this.events || [];
                    this.events.push({ name: name, listener: listener, callback: callback });

                    app.core.mediator[listenerType](name, callback);
                };
            };

        // extension definition

        return {

            name: 'mediator',

            require: {
                paths: {
                    eventemitter: 'bower_components/eventemitter2/lib/eventemitter2'
                }
            },

            initialize: function(app) {
                var EventEmitter = require('eventemitter'),
                    mediator;

                app.config.mediator = app.core.util.defaults(app.config.mediator || {}, defaults);
                mediator = new EventEmitter(app.config.mediator);
                app.core.mediator = mediator;


                /**
                 * @class Sandbox
                 */

                // extending the default sandbox

                /**
                 * @method on
                 * @param {String} name
                 * @param {Function} listener
                 */
                app.sandbox.on = attachListener('on');

                /**
                 * @method once
                 * @param {String} name
                 * @param {Function} listener
                 */
                app.sandbox.once = attachListener('once');

                /**
                 * @method off
                 * @param {String} name
                 * @param {Function} listener
                 */
                app.sandbox.off = function(name, listener) {

                    if (!this.events) { return; }

                    this.events = app.core.util.reject(this.events, function(event) {
                        var match = (event.name === name && event.listener === listener);

                        if (match) {
                            mediator.off(name, event.callback);
                        }

                        return match;
                    });
                };

                /**
                 * @method emit
                 * @param {String} name
                 * @param {Object} payload
                 */
                app.sandbox.emit = function() {

                    var debug = app.config.debug,
                        eventLogData;

                    if (debug === true || (!!debug.enable &&
                        (debug.components.length === 0 || debug.components.indexOf('husky:mediator') !== -1))) {
                        eventLogData = Array.prototype.slice.call(arguments);
                        eventLogData.unshift('Event emitted');
                        app.logger.log.apply(app.logger, eventLogData);
                    }

                    mediator.emit.apply(mediator, arguments);
                };

                /**
                 * @method stopListening
                 */
                app.sandbox.stopListening = function() {

                    if (!this.events) { return; }

                    app.core.util.each(this.events, function(event) {
                        mediator.off(event.name, event.callback);
                    });
                };

                // default event listener

                mediator.on(['husky', 'sandbox', 'stop'], function(sandbox) {
                    sandbox.stopListening();
                });

                mediator.on(['husky', 'sandbox', 'pause'], function(sandbox) {
                    // TODO Implement pause event listening
                    app.logger.warn('ATTENTION: Sandbox pause not implemented!', sandbox);
                });

                mediator.on(['husky', 'sandbox', 'continue'], function(sandbox) {
                    // TODO Implement continue event listening
                    app.logger.warn('ATTENTION: Sandbox continue not implemented!', sandbox);
                });
            }
        };
    };

});
