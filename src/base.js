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
        define('underscore', [], function() {
            return window._;
        });
    } else {
        require.config({
            paths: {
                underscore: 'bower_components/underscore/underscore'
            },
            shim: {
                underscore: { exports: '_' }
            }
        });
    }

    define(['underscore', 'jquery'], function(_, $) {

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
             * @method util.clone
             */
            clone: _.clone,

            /**
             * @method util.compact
             */
            compact: _.compact,

            /**
             * @method util.defaults
             */
            defaults: _.defaults,

            /**
             * @method util.delay
             */
            delay: _.delay,

            /**
             * @method util.defer
             */
            defer: _.defer,

            /**
             * @method util.each
             */
            each: _.forEach,

            /**
             * @method util.extend
             */
            extend: _.extend,

            /**
             * @method util.pick
             */
            pick: _.pick,

            /**
             * @method util.has
             */
            has: _.has,

            /**
             * @method util.include
             */
            include: _.include,

            /**
             * @method util.invoke
             */
            invoke: _.invoke,

            /**
             * @method util.isFunction
             */
            isFunction: _.isFunction,

            /**
             * @method util.isObject
             */
            isObject: _.isObject,

            /**
             * @method util.reject
             */
            reject: _.reject,

            /**
             * @method util.uniq
             */
            uniq: _.unique,

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

        return base;

    });

})();
