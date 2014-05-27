/**
 * @class DataGrid
 * @constructor
 *
 * @param {Object} [options] Configuration object
 * @param {Object} [options.data] if no url is provided (some functionality like search & sort will not work)
 * @param {String} [options.defaultMeasureUnit=px] the unit that should be taken
 * @param {Boolean|String} [options.pagination=dropdown] name of the pagination to use. If false no pagination will be initialized
 * @param {String} [options.view='table'] name of the view to use
 * @param {Object} [options.paginationOptions] Configuration Object for the pagination
 * @param {Object} [options.viewOptions] Configuration Object for the view
 * @param {Boolean} [options.sortable] Defines if records are sortable
 * @param {String} [options.searchInstanceName=null] if set, a listener will be set for the corresponding search events
 * @param {String} [options.columnOptionsInstanceName=null] if set, a listener will be set for listening for column changes
 * @param {String} [options.url] url to fetch data from
 * @param {String} [options.instanceName] name of the datagrid instance
 *
 * @param {Array} [options.matchings] configuration array of columns if fieldsData isn't set
 * @param {String} [options.matchings.content] column title
 * @param {String} [options.matchings.width] width of column (used by the table view)
 * @param {String} [options.matchings.class] css class of the column
 * @param {String} [options.matchings.type] type of the column. Used to manipulate its content (e.g. 'date')
 * @param {String} [options.matchings.attribute] mapping information to data (if not set it will just iterate through attributes)
 */
(function() {

    'use strict';

    define([
        'src/components/datagrid/decorators/table-view',
        'src/components/datagrid/decorators/thumbnail-view',
        'src/components/datagrid/decorators/dropdown-pagination',
        'src/components/datagrid/decorators/showall-pagination'
    ], function(decoratorTableView, thumbnailView, decoratorDropdownPagination, showallPagination) {

        /**
         *    Default values for options
         */
        var defaults = {
                view: 'table',
                viewOptions: {
                    table: {},
                    thumbnail: {}
                },
                pagination: 'dropdown',
                paginationOptions: {
                    dropdown: {}
                },
                sortable: true,
                matchings: [],
                url: null,
                data: null,
                instanceName: '',
                searchInstanceName: null,
                columnOptionsInstanceName: null,
                defaultMeasureUnit: 'px'
            },

            types = {
                DATE: 'date',
                THUMBNAILS: 'thumbnails',
                TITLE: 'title',
                BYTES: 'bytes'
            },

            decorators = {
                views: {
                    table: decoratorTableView,
                    thumbnail: thumbnailView
                },
                paginations: {
                    dropdown: decoratorDropdownPagination,
                    showall: showallPagination
                }
            },

            namespace = 'husky.datagrid.',

        /* TRIGGERS EVENTS */

            /**
             * raised when the the current page changes
             * @event husky.datagrid.page.change
             */
                PAGE_CHANGE = function () {
                return this.createEventName('page.change');
            },

            /**
             * raised when the data is updated
             * @event husky.datagrid.updated
             */
                UPDATED = function () {
                return this.createEventName('updated');
            },

            /**
             * raised when item is deselected
             * @event husky.datagrid.item.deselect
             * @param {String} id of deselected item
             */
                ITEM_DESELECT = function () {
                return this.createEventName('item.deselect');
            },

            /**
             * raised when selection of items changes
             * @event husky.datagrid.number.selections
             */
                NUMBER_SELECTIONS = function () {
                return this.createEventName('number.selections');
            },

            /**
             * raised when item is selected
             * @event husky.datagrid.item.select
             * @param {String} if of selected item
             */
                ITEM_SELECT = function () {
                return this.createEventName('item.select');
            },

            /**
             * raised when all items get deselected via the header checkbox
             * @event husky.datagrid.all.deselect
             */
                ALL_DESELECT = function () {
                return this.createEventName('all.deselect');
            },

            /**
             * raised when all items get deselected via the header checkbox
             * @event husky.datagrid.all.select
             * @param {Array} ids of all items that have been clicked
             */
                ALL_SELECT = function () {
                return this.createEventName('all.select');
            },

            /**
             * raised when data was saved
             * @event husky.datagrid.data.saved
             * @param {Object} data returned
             */
                DATA_SAVED = function () {
                return this.createEventName('updated');
            },

            /**
             * raised when save of data failed
             * @event husky.datagrid.data.save.failed
             * @param {String} text status
             * @param {String} error thrown
             *
             */
                DATA_SAVE_FAILED = function () {
                return this.createEventName('data.save.failed');
            },

            /**
             * raised when editable table is changed
             * @event husky.datagrid.data.save
             */
                DATA_CHANGED = function () {
                return this.createEventName('data.changed');
            },


        /* PROVIDED EVENTS */

            /**
             * raised when husky.datagrid.data.get is triggered
             * @event husky.datagrid.data.provide
             */
                DATA_PROVIDE = function () {
                return this.createEventName('data.provide');
            },

            /**
             * listens on and changes the view of the datagrid
             * @event husky.datagrid.view.change
             * @param {String} viewId The identifier of the view
             * @param {Object} Options to merge with the current view options
             */
                CHANGE_VIEW = function () {
                return this.createEventName('view.change');
            },

            /**
             * listens on and changes the pagination of the datagrid
             * @event husky.datagrid.pagination.change
             * @param {String} paginationId The identifier of the pagination
             */
                CHANGE_PAGINATION = function () {
                return this.createEventName('pagination.change');
            },

            /**
             * used to add a data record
             * @event husky.datagrid.record.add
             * @param {Object} the data of the new record
             */
                RECORD_ADD = function () {
                return this.createEventName('record.add');
            },

            /**
             * used to add a data record
             * @event husky.datagrid.record.add
             * @param {Object} the data of the new record
             */
                RECORDS_ADD = function () {
                return this.createEventName('records.add');
            },

            /**
             * used to remove a data-record
             * @event husky.datagrid.record.remove
             * @param {String} id of the record to be removed
             */
                RECORD_REMOVE = function () {
                return this.createEventName('record.remove');
            },

            /**
             * used to trigger an update of the data
             * @event husky.datagrid.update
             */
                UPDATE = function () {
                return this.createEventName('update');
            },

            /**
             * used to filter data by search
             * @event husky.datagrid.data.filter
             * @param {String} searchField
             * @param {String} searchString
             */
                DATA_SEARCH = function () {
                return this.createEventName('data.search');
            },

            /**
             * raised when data is sorted
             * @event husky.datagrid.data.sort
             */
                DATA_SORT = function () {
                return this.createEventName('data.sort');
            },

            /**
             * used to filter data by updating an url parameter
             * @event husky.datagrid.url.update
             * @param {Object} url parameter : key
             */
                URL_UPDATE = function () {
                return this.createEventName('url.update');
            },

            /**
             * triggers husky.datagrid.data.provide
             * @event husky.datagrid.data.get
             */
                DATA_GET = function () {
                return this.createEventName('data.get');
            },

            /**
             * triggers husky.datagrid.items.selected event, which returns all selected item ids
             * @event husky.datagrid.items.get-selected
             * @param  {Function} callback function receives array of selected items
             */
                ITEMS_GET_SELECTED = function () {
                return this.createEventName('items.get-selected');
            },


        /**
         * Private Methods
         * --------------------------------------------------------------------
         */

            /**
             * function updates an url by a given parameter name and value and returns it. The parameter is either added or updated.
             * If value is not set, the parameter will be removed from url
             * @param {String} url Url string to be updated
             * @param {String} paramName Parameter which should be added / updated / removed
             * @param {String|Null} paramValue Value of the parameter. If not set, parameter will be removed from url
             * @returns {String} updated url
             */
            setGetParameter = function(url, paramName, paramValue) {
                if (url.indexOf(paramName + "=") >= 0) {
                    var prefix = url.substring(0, url.indexOf(paramName + "=")),
                        suffix = url.substring(url.indexOf(paramName + "="));
                    suffix = suffix.substring(suffix.indexOf('=') + 1);
                    suffix = (suffix.indexOf('&') >= 0) ? suffix.substring(suffix.indexOf('&')) : '';
                    if (!!paramValue) {
                        url = prefix + paramName + '=' + paramValue + suffix;
                    } else {
                        if (url.substr(url.indexOf(paramName + '=') - 1, 1) === '&') {
                            url = url.substring(0, prefix.length - 1) + suffix;
                        } else {
                            url = prefix + suffix.substring(1, suffix.length);
                        }
                    }
                }
                else if (!!paramValue) {
                    if (url.indexOf("?") < 0) {
                        url += "?" + paramName + "=" + paramValue;
                    }
                    else {
                        url += "&" + paramName + "=" + paramValue;
                    }
                }
                return url;
            },

            /**
             * Takes bytes and returns a more readable string
             * @param bytes {Number}
             * @returns {string}
             */
            parseBytes = function(bytes) {
                if (bytes === 0) {
                    return '0 Byte';
                }
                var k = 1000,
                sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            },

            /**
             * Brings a date into the right format
             * @param date {String} the date to parse
             * @returns {String}
             */
            parseDate = function(date) {
                var parsedDate = this.sandbox.date.format(date);
                if (parsedDate !== null) {
                    return parsedDate;
                }
                return date;
            },

            /**
             * Takes an array of thumbnails and returns an object with url and and alt
             * @param thumbnails {Array} array of thumbnails
             * @param format {String} the format of the thumbnail
             * @returns {Object} with url and alt property
             */
            parseThumbnails = function(thumbnails, format) {
                var thumbnail = {
                    url: null,
                    alt: null
                };
                if (!!thumbnails[format]) {
                    thumbnail.url = thumbnails[format].url;
                    thumbnail.alt = thumbnails[format].alt;
                }
                return thumbnail;
            };

        return {

            /**
             * Creates the eventnames
             * @param postfix {String} event name to append
             */
            createEventName: function (postfix) {
                return namespace + ((!!this.options.instanceName) ? this.options.instanceName + '.' : '') + postfix;
            },

            /**
             * Initialize the datagrid component
             */
            initialize: function() {
                this.sandbox.logger.log('initialized datagrid');

                // extend default options and set variables
                this.options = this.sandbox.util.extend(true, {}, defaults, this.options);


                this.matchings = [];
                this.requestFields = [];
                this.filterMatchings(this.options.matchings);

                // make a copy of the decorators for each datagrid instance
                // if you directly access the decorators variable the datagrid-context in the decorators will be overwritten
                this.decorators = this.sandbox.util.extend(true, {}, decorators);

                this.types = types;

                this.gridViews = {};
                this.viewId = this.options.view;

                this.paginations = {};
                this.paginationId = this.options.pagination;

                this.$loader = null;

                // append datagrid to html element
                this.$element = this.sandbox.dom.$('<div class="husky-datagrid"/>');
                this.elId = this.sandbox.dom.attr(this.$el, 'id');
                this.$el.append(this.$element);

                this.sort = {
                    attribute: null,
                    direction: null
                };

                this.initRender();

                // Should only be be called once
                this.bindCustomEvents();
            },

            /**
             * Gets the data either via the url or the array
             */
            getData: function() {
                var url;

                if (!!this.options.url) {
                    url = this.options.url;

                    this.sandbox.logger.log('load data from url');
                    if (this.requestFields.length > 0) {
                        url += (url.indexOf('?') === -1) ? '?' : '&';
                        url += 'fields=' + this.requestFields.join(',');
                    }
                    this.load({ url: url});

                } else if (!!this.options.data.items) {

                    this.sandbox.logger.log('load data from array');
                    this.data = this.options.data;

                    this.gridViews[this.viewId].render(this.data, this.$element);
                    if (!!this.paginations[this.paginationId]) {
                        this.paginations[this.paginationId].render(this.data, this.$element);
                    }
                }
            },

            /**
             * Takes an array of matchings and filters disabled matchings out of it
             * Moreover it constructs the array of fields which should be requested from a server
             * The filtered matchings are available in this.matchings
             * The request-fields are available in this.requestFields
             *
             * @param {Array} matchings array with matchings
             */
            filterMatchings: function(matchings) {
                var matchingObject;
                this.matchings = [];
                this.requestFields = [];

                this.sandbox.util.foreach(matchings, function(matching) {
                    matchingObject = {};

                    // only add matching if it's not disabled
                    if ((matching.disabled !== 'true' && matching.disabled !== true)) {

                        // build up the matching with the keys of the passed matching
                        for (var key in matching) {
                            if (key === 'translation') {
                                matchingObject.content = this.sandbox.translate(matching.translation);
                            } else if (key === 'id') {
                                matchingObject.attribute = matching.id;
                            } else {
                                matchingObject[key] = matching[key];
                            }
                        }
                        // push the constructed matching to the global matchings array
                        this.matchings.push(matchingObject);
                        this.requestFields.push(matching.id);
                    } else if (matching.id === 'id') {
                        this.requestFields.push(matching.id);
                    }
                    // always load the id (never ever even think about not loading the id)
                }.bind(this));
            },

            /**
             * Renders the data of the datagrid
             */
            render: function() {
                this.gridViews[this.viewId].render(this.data, this.$element);
                if (!!this.paginations[this.paginationId]) {
                    this.paginations[this.paginationId].render(this.data, this.$element);
                }
            },

            /**
             * Destroys the view and the pagination
             */
            destroy: function() {
                if (this.gridViews[this.viewId].rendered === true) {
                    this.gridViews[this.viewId].destroy();
                    if (!!this.paginations[this.paginationId]) {
                        this.paginations[this.paginationId].destroy();
                    }
                }
            },

            /**
             * Loads contents via ajax
             * @param params url
             */
            load: function(params) {
                this.currentUrl = params.url;

                this.loading();
                this.destroy();

                this.sandbox.util.load(this.getUrl(params), params.data)
                    .then(function(response) {
                        this.stopLoading();
                        this.parseData(response);
                        this.render();
                        if (!!params.success && typeof params.success === 'function') {
                            params.success(response);
                        }
                    }.bind(this))
                    .fail(function(status, error) {
                        this.sandbox.logger.error(status, error);
                    }.bind(this));
            },

            /**
             * Displays a loading icon
             */
            loading: function() {
                if (this.sandbox.dom.is(this.$element, ':visible')) {
                    this.sandbox.dom.height(this.$element, this.sandbox.dom.outerHeight(this.$element));
                    this.sandbox.dom.width(this.$element, this.sandbox.dom.outerWidth(this.$element));
                }

                this.sandbox.dom.addClass(this.$element, 'loading');

                if (!this.$loader) {
                    this.$loader = this.sandbox.dom.createElement('<div class="datagrid-loader"/>');
                    this.sandbox.dom.hide(this.$loader);
                    this.sandbox.dom.append(this.$element, this.$loader);

                    this.sandbox.start([
                        {
                            name: 'loader',
                            options: {
                                el: this.$loader,
                                size: '100px',
                                color: '#cccccc'
                            }
                        }
                    ]);
                }

                this.sandbox.dom.show(this.$loader);
            },

            /**
             * Hides the loading icon
             */
            stopLoading: function() {
                this.sandbox.dom.hide(this.$loader);
                this.sandbox.dom.removeClass(this.$element, 'loading');

                this.sandbox.dom.height(this.$element, '');
                this.sandbox.dom.width(this.$element, '');
                return this.$element;
            },

            /**
             * Gets the view and a load to get data and render it
             */
            initRender: function() {
                this.bindDOMEvents();
                this.getPaginationDecorator(this.paginationId);
                this.getViewDecorator(this.viewId);
                this.getData();
            },

            /**
             * Takes a data object and sets it to the global data-property
             * @param data {Object} data property
             */
            parseData: function(data) {
                this.data = {};
                this.data.links = data._links;
                this.data.embedded = data._embedded;
                this.data.total = data.total;
                this.data.numberOfAll = data.numberOfAll;
                this.data.page = data.page;
                this.data.pages = data.pages;
                this.data.pageSize = data.pageSize;
            },

            /**
             * Gets the view and starts the rendering of the data
             * @param viewId {String} the identifier of the decorator
             */
            getViewDecorator: function(viewId) {
                // TODO: dynamically load a decorator from external source if local decorator doesn't exist
                this.viewId = viewId;

                // if view is not already loaded, load it
                if (!this.gridViews[this.viewId]) {
                    this.gridViews[this.viewId] = this.decorators.views[this.viewId];
                    var isViewValid = this.isViewValid(this.gridViews[this.viewId]);

                    if (isViewValid === true) {
                        // merge view options with passed ones
                        this.gridViews[this.viewId].initialize(this, this.options.viewOptions[this.viewId]);
                    } else {
                        this.sandbox.logger.log('Error: View does not meet the configured requirements. See the documentation');
                    }
                }
            },

            /**
             * Validates a given view
             * @param view {Object} the view to validate
             * @returns {boolean} returns true if the view is usable
             */
            isViewValid: function(view) {
                var bool = true;
                if (typeof view.initialize === 'undefined' ||
                    typeof view.render === 'undefined' ||
                    typeof view.destroy === 'undefined') {
                    bool = false;
                }
                return bool;
            },

            /**
             * Gets the Pagination and initializes it
             * @param {String} paginationId the identifier of the pagination
             */
            getPaginationDecorator: function(paginationId) {
                // todo: dynamically load a decorator if local decorator doesn't exist
                if (!!paginationId) {
                    this.paginationId = paginationId;

                    // load the pagination if not already loaded
                    if (!this.paginations[this.paginationId]) {
                        this.paginations[this.paginationId] = this.decorators.paginations[this.paginationId];
                        var paginationIsValid = this.isPaginationValid(this.paginations[this.paginationId]);
                        if (paginationIsValid === true) {
                            this.paginations[this.paginationId].initialize(this, this.options.paginationOptions[this.paginationId]);
                        } else {
                            this.sandbox.logger.log('Error: Pagination does not meet the configured requirements. See the documentation');
                        }
                    }
                }
            },

            /**
             * Changes the view of the datagrid
             * @param view {String} identifier of the new view to use
             * @param options {Object} an object with options to merge with the current view options for the view
             */
            changeView: function(view, options) {
                // only change if view or if options are passed (could be passed to the same view)
                if (view !== this.viewId || !!options) {
                    this.destroy();
                    this.getViewDecorator(view);
                    this.extendViewOptions(options);
                    this.render();
                }
            },

            /**
             * Changes the pagination of the datagrid
             * @param pagination {String} identifier of the new pagination to use
             */
            changePagination: function(pagination) {
                if (pagination !== this.paginationId) {
                    this.destroy();
                    this.getPaginationDecorator(pagination);
                    this.render();
                }
            },

            /**
             * Takes an object with options and passes them to the view,
             * so the view can extend its current ones with them
             * @param options {Object} mew options
             */
            extendViewOptions: function(options) {
                if (!!options && !!this.gridViews[this.viewId].extendOptions) {
                    this.gridViews[this.viewId].extendOptions(options);
                }
            },

            /**
             * Validates a given pagination
             * @param pagination {Object} the pagination to validate
             * @returns {boolean} returns true if the pagination is usable
             */
            isPaginationValid: function(pagination) {
                var bool = true;
                if (typeof pagination.initialize === 'undefined' ||
                    typeof pagination.render === 'undefined' ||
                    typeof pagination.getPageSize === 'undefined' ||
                    typeof pagination.destroy === 'undefined') {
                    bool = false;
                }
                return bool;
            },

            /**
             * Returns url with page size and page param at the end
             * @param params
             * @returns {string}
             */
            getUrl: function(params) {
                if (!!this.data && !!this.data.links) {
                    return params.url;
                }

                var delimiter = '?', url = params.url;
                if (!!this.options.pagination && !!this.paginations[this.paginationId].getPageSize()) {
                    if (params.url.indexOf('?') !== -1) {
                        delimiter = '&';
                    }
                    url = params.url + delimiter + 'pageSize=' + this.paginations[this.paginationId].getPageSize();
                    if (params.page > 1) {
                        url += '&page=' + params.page;
                    }
                }

                return url;
            },

            /**
             * returns number and unit
             * @param numberUnit
             * @returns {{number: Number, unit: *}}
             */
            getNumberAndUnit: function(numberUnit) {
                numberUnit = String(numberUnit);
                var regex = numberUnit.match(/(\d+)\s*(.*)/);
                // no unit , set default
                if (!regex[2]) {
                    regex[2] = this.options.defaultMeasureUnit;
                }
                return {number: parseInt(regex[1], 10), unit: regex[2]};
            },

            /**
             * Manipulates the content of a cell with a process realted to the columns type
             * @param content {String} the content of the cell
             * @param type {String} the columns type
             * @param argument {Number|String} argument to pass to the processor
             * @returns {String} the manipulated content
             */
            manipulateContent: function(content, type, argument) {
                if (type === types.DATE) {
                    content = parseDate.call(this, content, argument);
                } else if (type === types.BYTES) {
                    content = parseBytes.call(this, content, argument);
                } else if (type === types.THUMBNAILS) {
                    content = parseThumbnails.call(this, content, argument)
                }
                return content;
            },

            /**
             * Reset the sorting properties
             */
            resetSortingOptions: function() {
                this.sort.attribute = null;
                this.sort.direction = null;
            },

            /**
             * Binds Dom-related events
             */
            bindDOMEvents: function() {
                this.sandbox.dom.on(this.sandbox.dom.$window, 'resize', this.windowResizeListener.bind(this));
            },

            /**
             * Bind custom-related events
             */
            bindCustomEvents: function() {
                this.sandbox.on('husky.navigation.size.changed', this.windowResizeListener.bind(this));

                // listen for private events
                this.sandbox.on(UPDATE.call(this), this.updateGrid.bind(this));

                // provide the datagrid-data via event
                this.sandbox.on(DATA_GET.call(this), this.provideData.bind(this));

                // filter data
                this.sandbox.on(DATA_SEARCH.call(this), this.searchGrid.bind(this));

                // filter data
                this.sandbox.on(URL_UPDATE.call(this), this.updateUrl.bind(this));

                // changes the view of the datagrid
                this.sandbox.on(CHANGE_VIEW.call(this), this.changeView.bind(this));

                // changes the view of the datagrid
                this.sandbox.on(CHANGE_PAGINATION.call(this), this.changePagination.bind(this));

                // trigger selectedItems
                this.sandbox.on(ITEMS_GET_SELECTED.call(this), function(callback) {
                    callback(this.getSelectedItemIds());
                }.bind(this));

                // add a single data record
                this.sandbox.on(RECORD_ADD.call(this), this.addRecordHandler.bind(this));
                // add multiple data records
                this.sandbox.on(RECORDS_ADD.call(this), this.addRecordsHandler.bind(this));

                // remove a data record
                this.sandbox.on(RECORD_REMOVE.call(this), this.removeRecordHandler.bind(this));

                this.startColumnOptionsListener();
                this.startSearchListener();
            },

            /**
             * Listens on search events to trigger a grid search
             */
            startSearchListener: function() {
                if (this.options.searchInstanceName !== null) {
                    var searchInstanceName = '.' + this.options.searchInstanceName;
                    this.sandbox.on('husky.search' + searchInstanceName, this.searchGrid.bind(this));
                    this.sandbox.on('husky.search' + searchInstanceName + '.reset', this.searchGrid.bind(this, ''));
                }
            },

            /**
             * Starts a listener on column options to trigger a grid filter
             */
            startColumnOptionsListener: function() {
                // listen to events from column options
                if (this.options.columnOptionsInstanceName !== null) {
                    var columnOptionsInstanceName = (this.options.columnOptionsInstanceName !== '') ? '.' + this.options.columnOptionsInstanceName : '';
                    this.sandbox.on('husky.column-options' + columnOptionsInstanceName + '.saved', this.filterGrid.bind(this));
                }
            },

            /**
             * Returns url without params
             */
            getUrlWithoutParams: function() {
                var url = this.data.links.self;

                if (url.indexOf('?') !== -1) {
                    return url.substring(0, url.indexOf('?'));
                }

                return url;
            },

            /**
             * Returns the index of a data record for a given id
             * @param id {Number|String} the id to search for
             * @returns {Number|String} the index of the found record
             */
            getRecordIndexById: function(id) {
                for (var i = -1, length = this.data.embedded.length; ++i < length;) {
                    if (this.data.embedded[i].id === id) {
                        return i;
                    }
                }
                return null;
            },

            /**
             * Provides data of the list to the caller
             */
            provideData: function() {
                this.sandbox.emit(DATA_PROVIDE.call(this), this.data);
            },

            /**
             * calls the funciton of the view responsible for the responsiveness
             */
            windowResizeListener: function() {
                if (!!this.gridViews[this.viewId].onResize) {
                    this.gridViews[this.viewId].onResize();
                }
            },

            /**
             * Handles the record add event
             */
            addRecordHandler: function(recordData) {
                if (!!this.gridViews[this.viewId].addRecord) {
                    if (!!recordData.id) {
                        this.pushRecords([recordData]);
                    }
                    this.gridViews[this.viewId].addRecord(recordData);
                    this.sandbox.emit(NUMBER_SELECTIONS.call(this), this.getSelectedItemIds().length);
                }
            },

            /**
             * Handles the event for adding multiple records
             * to a view
             * @param records {Array} array with new records to add
             */
            addRecordsHandler: function(records) {
                if (!!this.gridViews[this.viewId].addRecord) {
                    this.sandbox.util.foreach(records, function(record) {
                        if (!!record.id) {
                            this.pushRecords([record]);
                        }
                        this.gridViews[this.viewId].addRecord(record);
                    }.bind(this));
                    this.sandbox.emit(NUMBER_SELECTIONS.call(this), this.getSelectedItemIds().length);
                }
            },

            /**
             * Handles the row remove event
             */
            removeRecordHandler: function(recordId) {
                if (!!this.gridViews[this.viewId].removeRecord) {
                    this.gridViews[this.viewId].removeRecord(recordId);
                    this.sandbox.emit(NUMBER_SELECTIONS.call(this), this.getSelectedItemIds().length);
                }
            },

            /**
             * Methods for data manipulation
             * --------------------------------------------------------------------
             */

            /**
             * Sets all data records unselected
             */
            deselectAllItems: function() {
                for (var i = -1, length = this.data.embedded.length; ++i < length;) {
                    this.data.embedded[i].selected = false;
                }
                // emit events with selected data
                this.sandbox.emit(ALL_DESELECT.call(this));
                this.sandbox.emit(NUMBER_SELECTIONS.call(this), 0);
            },

            /**
             * Sets all data records selected
             */
            selectAllItems: function() {
                var ids = [], i, length;
                for (i = -1, length = this.data.embedded.length; ++i < length;) {
                    this.data.embedded[i].selected = true;
                    ids.push(this.data.embedded[i].id);
                }
                // emit events with selected data
                this.sandbox.emit(ALL_SELECT.call(this), ids);
                this.sandbox.emit(NUMBER_SELECTIONS.call(this), this.data.embedded.length);
            },

            /**
             * Returns the ids of all selected items
             * @return {Array} array with all ids
             */
            getSelectedItemIds: function() {
                var ids = [], i, length;
                for (i = -1, length = this.data.embedded.length; ++i < length;) {
                    if (this.data.embedded[i].selected === true) {
                        ids.push(this.data.embedded[i].id);
                    }
                }
                return ids;
            },

            /**
             * Sets all data records with their ids contained in the passed one selected and
             * deselects all data records not contained.
             * @param items {Array} array with all items that should be selected
             */
            setSelectedItems: function(items) {
                var count = 0, i, length;
                for (i = -1, length = this.data.embedded.length; ++i < length;) {
                    if (items.indexOf(this.data.embedded[i].id) !== -1) {
                        this.data.embedded[i].selected = true;
                        count++;
                    } else {
                        this.data.embedded[i].selected = false;
                    }
                }
                this.sandbox.emit(NUMBER_SELECTIONS.call(this), count);
            },

            /**
             * Returns true if an item with a given id is selected
             * @param id {Number|String} id of the item
             * @returns {Boolean} returns true if item is selected
             */
            itemIsSelected: function(id) {
                for (var i = -1, length = this.data.embedded.length; ++i < length;) {
                    if (this.data.embedded[i].id === id) {
                        return this.data.embedded[i].selected;
                    }
                }
                return false;
            },

            /**
             * Sets a data record with a given id selected
             * @param id {String|Number} id of the item
             * @return {Boolean} true of operation was successfull
             */
            setItemSelected: function(id) {
                var itemIndex = this.getRecordIndexById(id);
                if (itemIndex !== null) {
                    this.data.embedded[itemIndex].selected = true;
                    // emit events with selected data
                    this.sandbox.emit(ITEM_SELECT.call(this), id);
                    this.sandbox.emit(NUMBER_SELECTIONS.call(this), this.getSelectedItemIds().length);
                    return true;
                }
                return false;
            },

            /**
             * Sets a data record with a given id unselected
             * @param id
             * @return {Boolean} true of operation was succesfull
             */
            setItemUnselected: function(id) {
                var itemIndex = this.getRecordIndexById(id);
                if (itemIndex !== null) {
                    this.data.embedded[itemIndex].selected = false;
                    // emit events with selected data
                    this.sandbox.emit(ITEM_DESELECT.call(this), id);
                    this.sandbox.emit(NUMBER_SELECTIONS.call(this), this.getSelectedItemIds().length);
                    return true;
                }
                return false;
            },

            /**
             * updates the current url by given parameter object
             * @param {Object} parameters Object key is used as parameter name, value as parameter value
             */
            updateUrl: function(parameters) {
                var url, key;

                url = this.currentUrl;

                for (key in parameters) {
                    url = setGetParameter.call(this, url, key, parameters[key]);
                }

                this.load({
                    url: url,
                    success: function() {
                        this.sandbox.emit(UPDATED.call(this));
                    }.bind(this)
                });
            },

            /**
             * Takes a record and overrides the one with the same id
             * @param record {Object} new record to set. Needs at leas an id property
             * @returns {boolean} true if record got successfully overridden
             */
            updateRecord: function(record) {
                for (var i = -1, length = this.data.embedded.length; ++i < length;) {
                    if (record.id === this.data.embedded[i].id) {
                        this.data.embedded[i] = record;
                        return true;
                    }
                }
                return false;
            },

            /**
             * Deletes a record with a given id
             * @param recordId {Number|String} the id of the record to delete
             * @returns {boolean} true if record got successfully deleted
             */
            removeRecord: function(recordId) {
                for (var i = -1, length = this.data.embedded.length; ++i < length;) {
                    if (recordId === this.data.embedded[i].id) {
                        this.data.embedded.splice(i, 1);
                        this.data.numberOfAll--;
                        this.data.total--;
                        if (!!this.paginations[this.paginationId]) {
                            this.paginations[this.paginationId].rerender();
                        }
                        return true;
                    }
                }
                return false;
            },

            /**
             * Takes an array of records and pushes them to the global array
             * @param records {Array} records to push
             */
            pushRecords: function(records) {
                for (var i = -1, length = records.length; ++i < length;) {
                    this.data.embedded.push(records[i]);
                    this.data.numberOfAll++;
                    this.data.total++;
                }
                if (!!this.paginations[this.paginationId]) {
                    this.paginations[this.paginationId].rerender();
                }
            },

            /**
             * Takes an array of records and unshifts them to the global array
             * @param records {Array} records to push
             */
            unshiftRecords: function(records) {
                for (var i = -1, length = records.length; ++i < length;) {
                    this.data.embedded.unshift(records[i]);
                    this.data.numberOfAll++;
                    this.data.total++;
                    if (!!this.paginations[this.paginationId]) {
                        this.paginations[this.paginationId].rerender();
                    }
                }
            },

            /**
             * Called when the current page should change
             * Emits husky.datagrid.updated event on success
             * @param uri {String} Url to load the new data from
             * @param page {Number} the page to change to
             * @param pageSize {Number} new page size. Has to be set if no Uri is passed
             */
            changePage: function(uri, page, pageSize) {
                var url, uriTemplate;

                // if a url is passed load the data from this url
                if (!!uri) {
                    url = uri;

                    // else generate an own uri
                } else {
                    // return if no page is passed or passed invalidly
                    if (!page || page > this.data.pages || page < 1) {
                        this.sandbox.logger.log("invalid page number or reached start/end!");
                        return;
                    }
                    // if no pageSize is passed keep current pageSize
                    if (!pageSize) {
                        pageSize = this.data.pageSize;
                    }

                    // generate uri for loading
                    uriTemplate = this.sandbox.uritemplate.parse(this.data.links.pagination);
                    url = this.sandbox.uritemplate.expand(uriTemplate, {page: page, pageSize: pageSize});
                }

                this.sandbox.emit(PAGE_CHANGE.call(this), url);
                this.load({url: url,
                    success: function() {
                        this.sandbox.emit(UPDATED.call(this), 'changed page');
                    }.bind(this)});
            },

            /**
             * Updates data in datagrid
             * Called when husky.datagrid.update event emitted
             * Emits husky.datagrid.updated event on success
             */
            updateGrid: function() {
                this.resetSortingOptions();

                this.load({
                    url: this.data.links.self,
                    success: function() {
                        this.sandbox.emit(UPDATED.call(this));
                    }.bind(this)
                });
            },


            /**
             * Filters fields out of the data passed to the view
             * So its possible to hide fields/columns
             * Note that the also the arrangement of fields/columns can be changed and the view can react to it
             * @param {Array} matchings
             */
            filterGrid: function(matchings) {
                var uriTemplate, url;

                this.filterMatchings(matchings);

                uriTemplate = this.sandbox.uritemplate.parse(this.data.links.filter);
                url = this.sandbox.uritemplate.expand(uriTemplate, {fieldsList: this.requestFields.join(',')});

                this.load({
                    url: url,
                    success: function() {
                        this.sandbox.emit(UPDATED.call(this));
                    }.bind(this)
                });
            },

            /**
             * Constructs the url to get sorted data and sets the request for it
             * @param attribute {String} The attribute to sort by
             * @param direction {String} the sort method to use 'asc' or 'desc'
             */
            sortGrid: function(attribute, direction) {
                if (this.options.sortable === true) {
                    var template, url;

                    // if passed attribute is sortable
                    if (!!attribute && !!this.data.links.sortable[attribute]) {

                        this.sort.attribute = attribute;
                        this.sort.direction = direction;

                        template = this.sandbox.uritemplate.parse(this.data.links.sortable[attribute]);
                        url = this.sandbox.uritemplate.expand(template, {sortOrder: direction});

                        this.sandbox.emit(DATA_SORT.call(this));

                        this.load({
                            url: url,
                            success: function() {
                                this.sandbox.emit(UPDATED.call(this));
                            }.bind(this)
                        });
                    }
                }
            },

            /**
             * triggers an api search
             * @param {String} searchString The String that will be searched
             * @param {String|Array} searchFields Fields that will be included into the search
             */
            searchGrid: function(searchString, searchFields) {
                var template, url;

                template = this.sandbox.uritemplate.parse(this.data.links.find);
                url = this.sandbox.uritemplate.expand(template, {searchString: searchString, searchFields: searchFields});

                this.load({
                    url: url,
                    success: function() {
                        this.sandbox.emit(UPDATED.call(this));
                    }.bind(this)
                });
            },

            /**
             * Takes a data-record and sends it to a url
             * @param data {Object} the data object to save
             * @param url {String} Url to send the data to
             * @param success {Function} callback to call after saving
             * @param fail {Function} callback to call if saving has failed
             * @param unshift {Boolean} If true newly added records will be unshifted instead of pushed
             */
            saveGrid: function(data, url, success, fail, unshift) {
                var method = 'POST',
                    isNewRecord = true;

                if (!!data.id) {
                    method = 'PUT';
                    isNewRecord = false;
                    url = url + '/' + data.id;
                }

                this.sandbox.emit(DATA_CHANGED.call(this));

                this.sandbox.util.save(url, method, data)
                    .then(function(data, textStatus) {
                        this.sandbox.emit(DATA_SAVED.call(this), data, textStatus);

                        if (typeof success === 'function') {
                            success(data, textStatus);
                        }

                        // update the global data array
                        if (isNewRecord === false) {
                            this.updateRecord(data);
                        } else if (unshift === true) {
                            this.unshiftRecords([data]);
                        } else {
                            this.pushRecords([data]);
                        }
                    }.bind(this))
                    .fail(function(jqXHR, textStatus, error) {
                        this.sandbox.emit(DATA_SAVE_FAILED.call(this), textStatus, error);

                        if (typeof fail === 'function') {
                            fail(jqXHR, textStatus, error);
                        }

                    }.bind(this));
            }
        };
    });
})();
