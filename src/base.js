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
(function() {
    'use strict';

    if (window.jQuery) {
        define('jquery', function() {
            return window.jQuery;
        });
    } else {
        require.config({
            paths: {
                jquery: 'bower_components/jquery/dist/jquery'
            },
            shim: {
                jquery: { exports: '$' }
            }
        });
    }

    if (window._) {
        define('lodash', [], function() {
            return window._;
        });
    } else {
        require.config({
            paths: {
                lodash: 'bower_components/lodash/dist/lodash'
            },
            shim: {
                lodash: { exports: '_' }
            }
        });
    }

    define(['lodash', 'jquery'], function(_, $) {

        /**
         * @class base
         * @static
         */
        var base = {};

        base.dom = {
            /**
             * @method dom.find
             */
            find: function(selector, context) {
                context = context || document;
                return $(context).find(selector);
            },

            /**
             * @method dom.data
             */
            data: function(selector, attribute) {
                return $(selector).data(attribute);
            }
        };

        base.data = {
            /**
             * @method data.deferred
             */
            deferred: $.Deferred,

            /**
             * @method data.when
             */
            when: $.when
        };

        base.util = {
            /**
             * @method util.defaults
             */
            defaults: _.defaults,

            /**
             * @method util.each
             */
            each: $.each,

            /**
             * @method util.extend
             */
            extend: $.extend,

            /**
             * @method util.uniq
             */
            uniq: _.uniq,

            /**
             * @method util.uniqueId
             */
            uniqueId: _.uniqueId,

            /**
             * @method util.decamelize
             */
            decamelize: function(camelCase, delimiter) {
                delimiter = (delimiter === undefined) ? '_' : delimiter;
                return camelCase.replace(/([A-Z])/g, delimiter + '$1').toLowerCase();
            }
        };

        base.events = {
            listen: function(context, events, selector, fn) {
                return $(context).on(events, selector, fn);
            },
            bindAll: function() {
                return _.bindAll.apply(this, arguments);
            }
        };

        return base;

    });

})();
