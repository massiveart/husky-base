/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) MASSIVE ART WebServices <webservices@massiveart.com>
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

            window: window,

            $window: $(window),

            document: document,

            $document: $(document),

            $: $,

            /**
             * @method dom.createElement
             */
            createElement: function (selector, props) {
                props = props || {};
                return $(selector, props);
            },

            /**
             * @method dom.html
             */
            html: function (selector, content) {
                if (typeof content !== 'undefined') {
                    return $(selector).html(content);
                }
                return $(selector).html();
            },

            /**
             * @method dom.parseHTML
             */
            parseHTML: function (data) {
                return $.parseHTML(data);
            },

            /**
             * @method dom.each
             */
            each: function (selector, callback) {
                $(selector).each(callback);
            },

            /**
             * @method dom.append
             */
            append: function (selector, element) {
                return $(selector).append(element);
            },

            /**
             * @method dom.prepend
             */
            prepend: function (selector, element) {
                return $(selector).prepend(element);
            },

            /**
             * @method dom.before
             */
            before: function (selector, element) {
                return $(selector).before(element);
            },

            /**
             * @method dom.after
             */
            after: function (selector, element) {
                return $(selector).after(element);
            },

            /**
             * @method dom.css
             */
            css: function (selector, style, value) {
                if (typeof value !== 'undefined') {
                    return $(selector).css(style, value);
                } else {
                    return $(selector).css(style);
                }
            },

            /**
             * @method dom.addClass
             */
            addClass: function (selector, classes) {
                return $(selector).addClass(classes);
            },

            /**
             * @method dom.removeClass
             */
            removeClass: function (selector, classes) {
                if (!classes) {
                    return $(selector).removeClass();
                }
                return $(selector).removeClass(classes);
            },

            /**
             * @method dom.hasClass
             */
            hasClass: function (selector, classes) {
                return $(selector).hasClass(classes);
            },

            /**
             * @method dom.prependClass
             */
            prependClass: function (selector, classes) {
                var $el = $(selector),
                    oldClasses = $el.attr('class');

                /* prepend class */
                classes = classes + ' ' + oldClasses;
                $el.attr('class', classes);
            },

            /**
             * @method dom.width
             */
            width: function (selector, value) {
                if (typeof value !== 'undefined') {
                    return $(selector).width(value);
                } else {
                    return $(selector).width();
                }
            },

            /**
             * @method dom.height
             */
            height: function (selector, value) {
                if (typeof value === 'undefined') {
                    return $(selector).height();
                }
                return $(selector).height(value);
            },

            /**
             * @method dom.outerHeight
             */
            outerHeight: function (selector, includeMargin) {
                if (typeof includeMargin === 'undefined') {
                    return $(selector).outerHeight();
                } else {
                    return $(selector).outerHeight(includeMargin);
                }
            },

            /**
             * @method dom.outerWidth
             */
            outerWidth: function (selector, includeMargin) {
                if (typeof includeMargin === 'undefined') {
                    return $(selector).outerWidth();
                } else {
                    return $(selector).outerWidth(includeMargin);
                }
            },

            /**
             * @method dom.offset
             */
            offset: function (selector, attributes) {
                if (attributes) {
                    return $(selector).offset(attributes);
                } else {
                    return $(selector).offset();
                }

            },

            /**
             * @method dom.position
             */
            position: function (selector) {
                return $(selector).position();
            },

            /**
             * @method dom.remove
             */
            remove: function (context, selector) {
                return $(context).remove(selector);
            },

            /**
             * @method dom.detach
             */
            detach: function (context, selector) {
                return $(context).detach(selector);
            },

            /**
             * @method dom.attr
             */
            attr: function (selector, attributeName, value) {
                if (!value && value !== '') {
                    attributeName = attributeName || {};
                    return $(selector).attr(attributeName);
                } else {
                    return $(selector).attr(attributeName, value);
                }
            },

            /**
             * @method dom.removeAttr
             */
            removeAttr: function (selector, attributeName) {
                return $(selector).removeAttr(attributeName);
            },

            /**
             * @method dom.is
             */
            is: function (selector, type) {
                return $(selector).is(type);
            },

            /**
             * @method dom.isArray
             */
            isArray: function (selector) {
                return $.isArray(selector);
            },

            /**
             * @method dom.data
             */
            data: function (selector, key, value) {
                if (!!value || value === '') {
                    return $(selector).data(key, value);
                } else {
                    return $(selector).data(key);
                }
            },

            /**
             * @method dom.onReady
             */
            onReady: function (callback) {
                $(window).on('load', callback);
            },

            /**
             * @method dom.val
             */
            val: function (selector, value) {
                if (!!value || value === '') {
                    return $(selector).val(value);
                } else {
                    return $(selector).val();
                }
            },

            /**
             * @method dom.clearVal
             */
            clearVal: function (selector) {
                return $(selector).val('');
            },

            /**
             * @method dom.blur
             */
            blur: function (selector) {
                return $(selector).blur();
            },

            /**
             * @method dom.on
             */
            on: function (selector, event, callback, filter) {
                if (!!filter) {
                    $(selector).on(event, filter, callback);
                } else {
                    $(selector).on(event, callback);
                }
            },

            /**
             * @method dom.one
             */
            one: function (selector, event, callback, filter) {
                if (!!filter) {
                    $(selector).one(event, filter, callback);
                } else {
                    $(selector).one(event, callback);
                }
            },

            /**
             * @method dom.off
             */
            off: function (selector, event, filter, handler) {
                $(selector).off(event, filter, handler);
            },

            /**
             * @method dom.trigger
             */
            trigger: function (selector, eventType, params) {
                $(selector).trigger(eventType, params);
            },

            /**
             * @method dom.select
             */
            select: function (selector, handler) {
                if (!!handler) {
                    return $(selector).select(handler);
                } else {
                    return $(selector).select();
                }
            },

            /**
             * @method dom.toggleClass
             */
            toggleClass: function (selector, className) {
                $(selector).toggleClass(className);
            },

            /**
             * @method dom.parent
             */
            parent: function (selector, filter) {
                return $(selector).parent(filter);
            },

            /**
             * @method dom.parents
             */
            parents: function (selector, filter) {
                return $(selector).parents(filter);
            },

            /**
             * @method dom.children
             */
            children: function (selector, filter) {
                return $(selector).children(filter);
            },

            /**
             * @method dom.next
             */
            next: function (selector, filter) {
                return $(selector).next(filter);
            },

            /**
             * @method dom.prev
             */
            prev: function (selector, filter) {
                return $(selector).prev(filter);
            },

            /**
             * @method dom.closest
             */
            closest: function (selector, filter) {
                return $(selector).closest(filter);
            },

            /**
             * @method dom.clone
             */
            clone: function (selector) {
                return $(selector).clone();
            },

            /**
             * @method dom.text
             */
            text: function (selector, value) {
                if (!!value) {
                    return $(selector).text(value);
                } else {
                    return $(selector).text();
                }
            },

            /**
             * @method dom.prop
             */
            prop: function (selector, propertyName, value) {
                if (value !== undefined) {
                    return $(selector).prop(propertyName, value);
                } else {
                    return $(selector).prop(propertyName);
                }
            },

            /**
             * @method dom.mouseleave
             */
            mouseleave: function (selector, handler) {
                $(selector).mouseleave(handler);
            },

            /**
             * @method dom.stopPropagation
             */
            stopPropagation: function (event) {
                event.stopPropagation();
            },

            /**
             * @method dom.stop
             */
            stop: function (selector) {
                $(selector).stop();
            },

            /**
             * @method dom.preventDefault
             */
            preventDefault: function (event) {
                event.preventDefault();
            },

            /**
             * @method dom.hide
             */
            hide: function (selector) {
                return $(selector).hide();
            },

            /**
             * @method dom.show
             */
            show: function (selector) {
                return $(selector).show();
            },

            /**
             * @method dom.map
             */
            map: function (selector, callback) {
                return $(selector).map(callback);
            },

            /**
             * @method dom.get
             */
            get: function (selector, index) {
                return $(selector).get(index);
            },

            /**
             * @method dom.toggle
             */
            toggle: function (selector) {
                return $(selector).toggle();
            },

            /**
             * @method dom.sortable
             */
            sortable: function(selector, options) {
                return $(selector).sortable(options);
            },

            /**
             * @method dom.index
             */
            index: function (selector, filter) {
                if (!!filter) {
                    return $(selector).index(filter);
                } else {
                    return $(selector).index();
                }
            },

            /**
             * @method dom.keypress
             */
            keypress: function (selector, callback) {
                $(selector).keypress(callback);
            },

            /**
             * @method dom.insertAt
             */
            insertAt: function (index, selector, $container, $item) {
                if (index === 0) {
                    prepend($container, $item);
                } else {
                    var $before = find(selector + ':nth-child(' + index + ')', $container);
                    after($before, $item);
                }
            },

            /**
             * @method dom.scrollToTop
             */
            scrollToTop: function (itemSelector) {
                $(window).scrollTop($(itemSelector).offset().top);
            },

            /**
             * @method dom.scrollTop
             */
            scrollTop: function (selector, position) {
                if (typeof position !== 'undefined') {
                    return $(selector).scrollTop(position);
                } else {
                    return $(selector).scrollTop();
                }
            },

            /**
             * @method dom.scrollLeft
             */
            scrollLeft: function (selector, value) {
                if (typeof value !== 'undefined') {
                    return $(selector).scrollLeft(value);
                } else {
                    return $(selector).scrollLeft();
                }
            },

            /**
             * @method dom.scrollAnimate
             */
            scrollAnimate: function (position, selector) {
                if (!!selector) {
                    $(selector).animate({
                        scrollTop: position
                    }, 500);
                } else {
                    $('html, body').animate({
                        scrollTop: position
                    }, 500);
                }
            },

            /**
             * @method dom.slideUp
             */
            slideUp: function (selector, duration, complete) {
                $(selector).slideUp(duration, complete);
            },

            /**
             * @method dom.slideDown
             */
            slideDown: function (selector, duration, complete) {
                $(selector).slideDown(duration, complete);
            },

            /**
             * @method dom.last
             */
            last: function (selector) {
                return $(selector).last();
            },

            /**
             * @method dom.fadeIn
             */
            fadeIn: function (selector, duration, complete) {
                $(selector).fadeIn(duration, complete);
            },

            /**
             * @method dom.fadeTo
             */
            fadeTo: function (selector, duration, opacity, complete) {
                $(selector).fadeTo(duration, opacity, complete);
            },

            /**
             * @method dom.fadeOut
             */
            fadeOut: function (selector, duration, complete) {
                $(selector).fadeOut(duration, complete);
            },

            /**
             * @method dom.when
             */
            when: function (deffereds) {
                return $.when(deffereds);
            },

            /**
             * @method dom.unbind
             */
            unbind: function (selector, eventType) {
                $(selector).unbind(eventType);
            },

            /**
             * @method dom.focus
             */
            focus: function (selector) {
                $(selector).focus();
            },

            /**
             * @method dom.click
             */
            click: function (selector) {
                $(selector).click();
            },

            /**
             * @method dom.animate
             */
            animate: function (selector, properties, options) {
                $(selector).animate(properties, options);
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
             * @method util.defer
             */
            defer: _.defer,

            /**
             * @method util.each
             */
            each: _.each,

            /**
             * @method util.extend
             */
            extend: $.extend,

            /**
             * @method util.has
             */
            has: _.has,

            /**
             * @method util.include
             */
            include: _.include,

            /**
             * @method util.ajax
             */
            ajax: $.ajax,

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
            uniq: _.uniq,

            /**
             * @method util.uniqueId
             */
            uniqueId: _.uniqueId,

            /**
             * @method util.map
             */
            map: _.map,

            /**
             * @method util.decamelize
             */
            decamelize: function(camelCase, delimiter) {
                delimiter = (delimiter === undefined) ? '_' : delimiter;
                return camelCase.replace(/([A-Z])/g, delimiter + '$1').toLowerCase();
            },

            /**
             * for comparing arrays and objects
             * @method util.compare
             */
            compare: function (a, b) {
                if (typeof a === 'object' && typeof b === 'object') {
                    return JSON.stringify(a) === JSON.stringify(b);
                }
            },

            /**
             * Crockford's better typeof
             * @method util.typeOf
             */
            typeOf: function (value) {
                var s = typeof value;
                if (s === 'object') {
                    if (value) {
                        if (value instanceof Array) {
                            s = 'array';
                        }
                    } else {
                        s = 'null';
                    }
                }
                return s;
            },

            /**
             * cool guy loop implementation of foreach: http://jsperf.com/loops3/2
             * @method util.foreach
             */
            foreach: function (array, callbackValue) {
                if (array.length && array.length > 0) {
                    for (var i = -1, length = array.length; ++i < length;) {
                        callbackValue(array[i], i);
                    }
                }
            },

            /**
             * @method util.contains
             */
            contains: function (list, value) {
                return _.contains(list, value);
            },

            /**
             * @method util.delay
             */
            delay: function (delay, callback) {
                return _.delay(delay, callback);
            },

            /**
             * @method util.template
             */
            template: _.template
    };

        return base;

    });

})();
