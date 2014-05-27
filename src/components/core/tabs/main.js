/**
 * @class Tabs
 * @constructor
 *
 * @param {Object} [options] Configuration object
 */
// TODO: complete yuidoc

/*****************************************************************************
 *
 *  Tabs
 *
 *  Options (defaults)
 *      - url: url to fetch data from
 *      - data: if no url is provided
 *      - selected: the item that's selected on initialize
 *      - instanceName - enables custom events (in case of multiple tabs on one page)
 *      - preselect - either true (for url) or position / title  (see preselector for more information)
 *      - skin - string of class to add to the components element (e.g. 'overlay')
 *      - preselector:
 *          - url: defines if actions are going to be checked against current URL and preselected (current URL mus be provided by data.url) - preselector itself is not going to be taken into account in this case
 *          - position: compares items position against whats defined in options.preselect
 *          - title: compares items title against whats defined in options.preselect
 *      - forceReload - defines if tabs are forcing page to reload
 *      - forceSelect - forces tabs to select first item, if no selected item has been found
 *  Provides Events
 *      - husky.tabs.<<instanceName>>.getSelected [callback(item)] - returns item with callback
 *  Triggers Events
 *      - husky.tabs.<<instanceName>>.item.select [item] - triggered when item was clicked
 *      - husky.tabs.<<instanceName>>.initialized [selectedItem]- triggered when tabs have been initialized
 *
 *  Data options
 *      - items
 *          - forceReload: overwrites default-setting for certain item
 * *
 *****************************************************************************/

define(function() {

    'use strict';

    var defaults = {
            url: null,
            data: [],
            instanceName: '',
            preselect: true,
            preselector: 'url',
            forceReload: false,
            callback: null,
            forceSelect: true,
            skin: ''
        },

        /**
         * enable tabs
         * @event husky.tabs.activate
         */
            ACTIVATE = function () {
            return this.createEventName('activate');
        },

        /**
         * disable tabs
         * @event husky.tabs.deactivate
         */
            DEACTIVATE = function () {
            return this.createEventName('deactivate');
        },

        /**
         * used to show a certain item
         * @event husky.tabs.item.show
         * @param {String} id Id of item to show
         */
            ITEM_SHOW = function () {
            return this.createEventName('item.show');
        },

        /**
         * used to hide a certain item
         * @event husky.tabs.item.hide
         * @param {String} id Id of item to hide
         */
            ITEM_HIDE = function () {
            return this.createEventName('item.hide');
        },

        /**
         * used to select a certain item
         * @event husky.tabs.item.select
         * @param {String} id Id of item to enable
         */
            ITEM_SELECT = function () {
            return this.createEventName('item.select');
        },

        /**
         * used to get selected items
         * @event husky.tabs.item.getSelected
         */
            GET_SELECTED = function () {
            return this.createEventName('getSelected');
        },

        /**
         * triggered when component was initialized
         * @event husky.tabs.initialized
         */
            INITIALIZED = function () {
            return this.createEventName('initialized');
        },

        selectItem = function(event) {
            event.preventDefault();
            if (this.active === true && this.sandbox.dom.hasClass(event.currentTarget, 'is-selected') !== true) {
                var item = this.items[this.sandbox.dom.data(event.currentTarget, 'id')];

                this.sandbox.dom.removeClass(this.sandbox.dom.find('.is-selected', this.$el), 'is-selected');
                this.sandbox.dom.addClass(event.currentTarget, 'is-selected');

                // callback
                if (item.hasOwnProperty('callback') && typeof item.callback === 'function') {
                    item.callback.call(this, item);
                } else if (!!this.options.callback && typeof this.options.callback === 'function') {
                    this.options.callback.call(this, item);
                } else {
                    triggerSelectEvent.call(this, item);
                }
            } else {
                return false;
            }
        },

        triggerSelectEvent = function(item) {

            item.forceReload = (item.forceReload && typeof item.forceReload !== "undefined") ? item.forceReload : this.options.forceReload;
            this.sandbox.emit(ITEM_SELECT.call(this), item);
        },

        showItem = function(item) {
            this.sandbox.dom.show(this.domItems[item]);
        },

        hideItem = function(item) {
            this.sandbox.dom.hide(this.domItems[item]);
        },

        bindDOMEvents = function() {
            this.sandbox.dom.on(this.$el, 'click', selectItem.bind(this), 'li');
        },

        bindCustomEvents = function() {
            this.sandbox.on(GET_SELECTED.call(this), function(callback) {
                var selection = this.sandbox.dom.find('.is-selected', this.options.el);
                callback.call(this.items[this.sandbox.dom.data(selection, 'id')]);
            }.bind(this));

            this.sandbox.on(ACTIVATE.call(this), this.activate.bind(this));

            this.sandbox.on(DEACTIVATE.call(this), this.deactivate.bind(this));

            this.sandbox.on(ITEM_SHOW.call(this), showItem.bind(this));

            this.sandbox.on(ITEM_HIDE.call(this), hideItem.bind(this));
        };

    return {

        view: true,

        initialize: function() {
            this.options = this.sandbox.util.extend(true, {}, defaults, this.options);
            this.$el = this.sandbox.dom.$(this.options.el);
            this.active = true;

            this.items = [];
            this.domItems = {};

            // load data and call render
            if (!!this.options.url) {
                this.sandbox.util.load(this.options.url)
                    .then(this.render.bind(this))
                    .fail(function(data) {
                        this.sandbox.logger.log('data could not be loaded:', data);
                    }.bind(this));
            } else if (!!this.options.data) {
                this.render((this.options.data));
            } else {
                this.sandbox.logger.log('no data provided for tabs!');
            }

            bindDOMEvents.call(this);

            bindCustomEvents.call(this);
        },

        createEventName: function(ending) {
            var instanceName = this.options.instanceName ? this.options.instanceName + '.' : '';
            return 'husky.tabs.' + instanceName + ending;
        },

        /**
         * Sets the min-width of an item to its width in selected state
         * (to avoid bumping)
         * @param $item
         */
        setMinWidth: function($item) {
            this.sandbox.dom.addClass($item, 'is-selected');
            this.sandbox.dom.css($item, {
                'min-width': this.sandbox.dom.outerWidth($item) + 'px'
            });
            this.sandbox.dom.removeClass($item, 'is-selected');
        },

        deactivate: function() {
            this.active = false;
            this.sandbox.dom.addClass(this.sandbox.dom.find('.tabs-container', this.$el), 'deactivated');
        },

        activate: function() {
            this.active = true;
            this.sandbox.dom.removeClass(this.sandbox.dom.find('.tabs-container', this.$el), 'deactivated');
        },

        generateIds: function(data) {
            if (!data.id) {
                data.id = this.getRandId();
            }
            this.sandbox.util.foreach(data.items, function(item) {
                if (!item.id) {
                    item.id = this.getRandId();
                }
            }.bind(this));
            return data;
        },

        getRandId: function() {
            return Math.floor((Math.random()*1677721500000000)).toString(16);
        },

        render: function(data) {
            data = this.generateIds(data);

            var $element = this.sandbox.dom.createElement('<div class="tabs-container"></div>'),
                $list = this.sandbox.dom.createElement('<ul/>'),
                selectedItem = null,
                $item = null;

            //add skin class
            this.sandbox.dom.addClass($element, this.options.skin);

            this.sandbox.dom.append(this.$el, $element);
            this.sandbox.dom.append($element, $list);

            this.items = [];
            this.domItems = {}

            this.sandbox.util.foreach(data.items, function(item, index) {
                this.items[item.id] = item;
                $item = this.sandbox.dom.createElement(
                    '<li data-id="' + item.id + '"><a href="#">' + this.sandbox.translate(item.title) + '</a></li>'
                );
                this.sandbox.dom.append($list, $item);

                if (!!item.disabled && item.disabled.toString() === 'true') {
                    this.sandbox.dom.hide($item);
                }

                // set min-width of element
                this.setMinWidth($item);

                // check if item got selected
                if (!!this.options.preselect) {
                    if ((this.options.preselector === 'url' && !!data.url && data.url === item.action) ||
                        (this.options.preselector === 'position' && (index+1).toString() === this.options.preselect.toString()) ||
                        (this.options.preselector === 'title' && item.title === this.options.preselect))
                    {
                        this.sandbox.dom.addClass($item, 'is-selected');
                        selectedItem = item;
                    }
                }
                this.domItems[item.id] = $item;

            }.bind(this));

            // force selection of first element
            if (!selectedItem && this.options.forceSelect) {
                selectedItem = this.options.data[0];
                this.sandbox.dom.addClass(this.sandbox.dom.find('li',$list).eq(0),'is-selected');
            }

            // initialization finished
            this.sandbox.emit(INITIALIZED.call(this), selectedItem);
        }
    };

});