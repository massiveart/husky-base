require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();
        var app,
            view, pagination,
            _;

        app = new husky({ debug: true });
        _ = app.sandbox.util._;

        app.start([
                {
                    name: 'datagrid',
                    options: {
                        url: 'http://husky.lo:7878/admin/api/datagrid',
                        paginationOptions: {
                            dropdown: {
                                pageSize: 4
                            }
                        },
                        viewOptions: {
                            table: {
                                selectItem: {
                                    type: 'checkbox'
                                },
                                className: "myClass",
                                removeRow: true,
                                editable: true,
                                validation: true,
                                addRowTop: true,
                                //fullWidth: true, // uncomment for full-width mode
                                contentContainer: '#contentContainer'
                            },
                            thumbnail: {
                            }
                        },
                        sortable: true,
                        searchInstanceName: 'test',
                        columnOptionsInstanceName: '',
                        el: '#datagrid',
                        matchings: [
                            {
                                content: 'Content 1',
                                width: "25%",
                                id: "content1",
                                editable: true,
                                type: 'title',
                                validation: {
                                    required: true
                                }
                            },
                            {
                                content: 'Content 2',
                                width: "25%",
                                id: "content2",
                                editable: false,
                                type: 'bytes',
                                validation: {
                                    required: true
                                }
                            },
                            {
                                content: 'Content 3',
                                width: "25%",
                                id: "content3",
                                type: 'thumbnails'
                            },
                            {
                                content: 'Date',
                                width: "25%",
                                id: 'date',
                                type: 'date'
                            }
                        ]
                    }
                },
                {
                    name: 'datagrid',
                    options: {
                        url: 'http://husky.lo:7878/admin/api/datagrid',
                        paginationOptions: {
                            dropdown: {
                                pageSize: 4
                            }
                        },
                        view: 'thumbnail',
                        viewOptions: {
                            thumbnail: {
                                large: true
                            }
                        },
                        sortable: true,
                        searchInstanceName: 'test',
                        columnOptionsInstanceName: '',
                        el: '#datagrid2',
                        instanceName: 'grid2',
                        matchings: [
                            {
                                content: 'Content 1',
                                width: "25%",
                                id: "content1",
                                editable: true,
                                type: 'title',
                                validation: {
                                    required: true
                                }
                            },
                            {
                                content: 'Content 2',
                                width: "25%",
                                id: "content2",
                                editable: false,
                                type: 'bytes',
                                validation: {
                                    required: true
                                }
                            },
                            {
                                content: 'Content 3',
                                width: "25%",
                                id: "content3",
                                type: 'thumbnails'
                            },
                            {
                                content: 'Date',
                                width: "25%",
                                id: 'date',
                                type: 'date'
                            }
                        ]
                    }
                },
                {
                    name: 'toolbar',
                    options: {
                        el: '#toolbar',
                        instanceName: 'test',
                        hasSearch: true,
                        groups: [
                            {
                                id: '1',
                                align: 'right'
                            },
                            {
                                id: '0',
                                align: 'right'
                            }
                        ],
                        data: [
                            {
                                id: 'add',
                                icon: 'plus-circle',
                                class: 'highlight',
                                group: '0',
                                callback: function () {
                                    app.sandbox.emit('husky.datagrid.record.add', { id: "", content1: "", content2: "", content3: "" });
                                }.bind(this)
                            },
                            {
                                id: 'delete',
                                icon: 'trash-o',
                                group: '1',
                                callback: function () {
                                    app.sandbox.emit('sulu.list-toolbar.delete');
                                }.bind(this)
                            },
                            {
                                id: 'settings',
                                icon: 'gear',
                                group: '1',
                                items: [
                                    {
                                        title: 'import',
                                        disabled: true
                                    },
                                    {
                                        title: 'export',
                                        disabled: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]).then(function () {
            app.logger.log('Husky started...');

            $('#add-row').on('click', function () {
                app.sandbox.emit('husky.datagrid.record.add', { id: "", content1: "", content2: "", content3: "" });
            });

            $('#add-records').on('click', function () {
                app.sandbox.emit('husky.datagrid.records.add', [
                    {id: 5000, content1: 'Added record 1', content2: 'something new', content3: {alt: "lorempixel", thumb: "http://placehold.it/170x170"}},
                    {id: 5001, content1: 'Added record 2', content2: 'something new', content3: {alt: "lorempixel", thumb: "http://placehold.it/170x170"}, selected: true},
                    {id: 5002, content1: 'Added record 3', content2: 'something new', content3: {alt: "lorempixel", thumb: "http://placehold.it/170x170"}, selected: true},
                    {id: 5003, content1: 'Added record 4', content2: 'something new', content3: {alt: "lorempixel", thumb: "http://placehold.it/170x170"}}
                ]);
            });

            $('#update-url').on('click', function () {
                app.sandbox.emit('husky.datagrid.url.update', { search: null, content1: "fdsa" });
            });

            app.sandbox.on('husky.datagrid.row.removed', function (item) {
                app.logger.log('remove: ' + item);
            });

            app.sandbox.on('husky.datagrid.row.remove-click', function (event, item) {
                app.logger.log('remove-clicked: ' + item);

                window.alert('DELETE AFTER OK');

                if (typeof item === 'number') {
                    app.sandbox.emit('husky.datagrid.row.remove', item);
                } else {
                    app.sandbox.emit('husky.datagrid.row.remove', event);
                }
            });

            app.sandbox.on('husky.datagrid.item.select', function (item) {
                app.logger.log('Husky.Ui.DataGrid item select: ' + item);
            });

            app.sandbox.on('husky.datagrid.item.deselect', function (item) {
                app.logger.log('Husky.Ui.DataGrid item deselect: ' + item);
            });

            app.sandbox.on('husky.datagrid.item.click', function (item) {
                app.logger.log('Husky.Ui.DataGrid item click: ' + item);
            });


            $('#get-selected').on('click', function () {
                app.sandbox.emit('husky.datagrid.items.get-selected', function (selected) {
                    console.log(selected);
                });
            });

            app.sandbox.on('husky.datagrid.items.selected', function (event) {
                app.logger.log('Husky.Ui.DataGrid items selected ' + event);
            });

            $('#update').on('click', function () {
                app.sandbox.emit('husky.datagrid.update');
            });

            $('#save').on('click', function () {
                app.sandbox.emit('husky.datagrid.data.save');
            });

            view = 'thumbnail';
            $('#change-view').on('click', function () {
                var large = (Math.random() < 0.5) ? true : false;
                app.sandbox.emit('husky.datagrid.view.change', view, {large: large});
                view = (view === 'thumbnail') ? 'table' : 'thumbnail';
            });

            pagination = 'showall';
            $('#change-pagination').on('click', function () {
                app.sandbox.emit('husky.datagrid.pagination.change', pagination);
                pagination = (pagination === 'dropdown') ? 'showall' : 'dropdown';
            });

            app.sandbox.dom.on('#change-columns', 'click', function () {
                app.sandbox.emit('husky.column-options.saved',
                    [
                        {
                            id: 'content1',
                            translation: 'Content 1',
                            disabled: false,
                            editable: true,
                            validation: {
                                unique: true,
                                required: true
                            }
                        },
                        {"id": "content2", "translation": "Content 2", "disabled": false},
                        {"id": "content3", "translation": "Content 3", "disabled": false, "width": "100px"},
                        {"id": "content4", "translation": "Content 4", "disabled": false, "width": "500px"}
                    ]
                );
            });

        });
    }


    /*
     * This zone starts a timer at the start of each task,
     * and stops it at the end. It accumulates the total run
     * time internally, exposing it via `zone.time()`
     */
    var profilingZone = (function () {
        var time = 0,
        // use the high-res timer if available
            timer = performance ?
                performance.now.bind(performance) :
                Date.now.bind(Date);
        return {
            beforeTask: function () {
                this.start = timer();
            },
            afterTask: function () {
                time += timer() - this.start;
            },
            time: function () {
                return Math.floor(time * 100) / 100 + 'ms';
            },
            reset: function () {
                time = 0;
            }
        };
    }());


    /*
     * Bootstrap the app
     */
    zone.fork(profilingZone).run(main);

});
