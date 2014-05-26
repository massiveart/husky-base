require.config({
    baseUrl: '../'
});

require(['src/husky'], function(husky) {

    'use strict';


    function main() {
        zone.reset();

        var app = husky({ debug: true });
        app.start().then(function() {
            app.logger.log(app);
            app.logger.log('Bootstrapping the application took ' + zone.time() + ' of CPU time.');

            app.sandbox.start([
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
                                contentContainer: '#content'
                            },
                            thumbnail: {
                            }
                        },
                        sortable: true,
                        searchInstanceName: 'test',
                        columnOptionsInstanceName: '',
                        el: '#my-datagrid',
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
                    name: 'toolbar@husky',
                    options: {
                        el: '#my-toolbar',
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
                                callback: function() {
                                    app.sandbox.emit('husky.datagrid.record.add', { id: "", content1: "", content2: "", content3: "" });
                                }.bind(this)
                            },
                            {
                                id: 'delete',
                                icon: 'trash-o',
                                group: '1',
                                callback: function() {
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
            ]);

        }, function() {
            app.logger.log(arguments);
        });
    }


    /*
     * This zone starts a timer at the start of each task,
     * and stops it at the end. It accumulates the total run
     * time internally, exposing it via `zone.time()`
     */
    var profilingZone = (function() {
        var time = 0,
            // use the high-res timer if available
            timer = performance ?
                performance.now.bind(performance) :
                Date.now.bind(Date);
        return {
            beforeTask: function() {
                this.start = timer();
            },
            afterTask: function() {
                time += timer() - this.start;
            },
            time: function() {
                return Math.floor(time * 100) / 100 + 'ms';
            },
            reset: function() {
                time = 0;
            }
        };
    }());


    /*
     * Bootstrap the app
     */
    zone.fork(profilingZone).run(main);

});
