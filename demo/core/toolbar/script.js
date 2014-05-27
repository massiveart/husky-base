require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();

        var app = husky({debug: true}),
            _ = app.sandbox.util._,

            testData = [
                {
                    'id': '1',
                    'icon': 'plus-circle',
                    'disabledIcon': 'gear',
                    'iconSize': 'large',
                    'class': 'highlight',
                    'position': 1,
                    'callback': function () {
                        console.log("user-add was clicked!");
                        app.sandbox.emit('husky.toolbar.contact.item.loading', '1');

                        setTimeout(function () {
                            app.sandbox.emit('husky.toolbar.contact.item.disable', '1');
                        }, 2000)

                    }.bind(this)
                },
                {
                    'id': 'edit',
                    'icon': 'gear',
                    'iconSize': 'large',
                    'disabledIcon': 'plus-circle',
                    'title': '',
                    'group': 2,
                    'position': 2,
                    'items': [
                        {
                            'title': 'Refresh',
                            'callback': function () {
                                console.log("refresh was clicked");
                            }
                        },
                        {
                            'title': 'no refresh',
                            'callback': function () {
                                console.log("no refresh was clicked");
                            }
                        }
                    ]
                },
                {
                    'id': 'state',
                    'icon': 'husky-publish',
                    'group': 2,
                    'title': 'Publish',
                    'position': 2,
                    'type': 'select'
                },
                {
                    'icon': 'cloud-upload',
                    'title': 'Import',
                    'group': 1,
                    'position': 2,
                    'id': 'import',
                    'callback': function () {
                        app.sandbox.emit('husky.toolbar.contact.item.disable', 'import', false);
                        console.log("import was clicked");
                    }
                },
                {
                    'icon': 'cloud-download',
                    'title': 'Work',
                    'group': 1,
                    'hidden': true,
                    'position': 3
                },
                {
                    'icon': 'gear',
                    'title': 'Something else',
                    'group': 1,
                    'hideTitle': true,
                    'position': 4
                },
                {
                    'icon': 'globe',
                    'group': 2,
                    'position': 1
                },
                {
                    'icon': 'cloud-download',
                    'title': 'Export',
                    'group': 1,
                    'position': 5,
                    'itemsOption': {
                        'titleAttribute': 'title',
                        'idAttribute': 'id',
                        'translate': true,
                        'languageNamespace': 'toolbar.',
                        'callback': function (item) {
                            console.log(item, 'This is a test callback');
                        }
                    }
                },
                {
                    id: 'search',
                    hasSearch: true,
                    'group': 3
                }
            ],

            stateItems = [
                {
                    'id': 'publish',
                    'title': 'Publish',
                    'icon': 'husky-publish',
                    'callback': function () {
                        console.log("publish it");
                    }
                },
                {
                    'id': 'unpublish',
                    'icon': 'husky-unpublish',
                    'title': 'Unpublish',
                    'callback': function () {
                        console.log("unpublish it");
                    }
                },
                {
                    'id': 'test',
                    'icon': 'husky-test',
                    'title': 'Test',
                    'callback': function () {
                        console.log("set Test-state");
                    }
                }
            ],

            collapsed = false;


        app.start().then(function () {
            app.logger.log('Husky started...');

            app.sandbox.on('husky.toolbar.contact.initialized', function () {
                app.sandbox.emit('husky.toolbar.contact.items.set', 'state', stateItems, 1);
                setTimeout(function () {
                    app.sandbox.emit('husky.toolbar.contact.items.set', 'state', [], 1);
                    app.sandbox.emit('husky.toolbar.contact.items.set', 'state', stateItems, 1);
                }, 500);
            });

            app.sandbox.start([
                {
                    name: 'toolbar',
                    options: {
                        el: '#toolbar2',
                        instanceName: 'contact',
                        groups: [
                            {
                                id: 1,
                                align: 'left'
                            },
                            {
                                id: 2,
                                align: 'left'
                            },
                            {
                                id: 3,
                                align: 'right'
                            }
                        ],
                        data: testData
                    }
                },
                {
                    name: 'toolbar',
                    options: {
                        el: '#toolbar3',
                        instanceName: 'contact1',
                        hasSearch: true,
                        searchAlign: 'left',
                        showTitleAsTooltip: true,
                        groups: [
                            {
                                id: 1,
                                align: 'left'
                            }
                        ],
                        data: [
                            {
                                icon: 'plus-circle',
                                class: 'highlight',
                                title: 'add',
                                group: 1,
                                items: [
                                    {title: 'action 1'},
                                    {title: 'action 2'}
                                ]
                            },
                            {
                                icon: 'trash-o',
                                group: 1,
                                title: 'delete',
                                disabled: true
                            },
                            {
                                icon: 'asterisk',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'cloud-upload',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'cloud-download',
                                group: 1
                            },
                            {
                                icon: 'gear',
                                group: 1,
                                items: [
                                    {title: 'action 1', disabled: true},
                                    {title: 'action 2', disabled: true},
                                    {title: 'action 3'}
                                ]
                            }
                        ]
                    }
                },
                {
                    name: 'toolbar',
                    options: {
                        el: '#toolbar4',
                        instanceName: 'contact2',
                        small: true,
                        groups: [
                            {
                                id: 1,
                                align: 'left'
                            },
                            {
                                id: 2,
                                align: 'left'
                            }
                        ],
                        data: [
                            {
                                icon: 'plus-circle',
                                class: 'highlight',
                                group: 1,
                                id: 'loadit',
                                callback: function () {
                                    app.sandbox.emit('husky.toolbar.contact2.item.loading', 'loadit');

                                    setTimeout(function () {
                                        app.sandbox.emit('husky.toolbar.contact2.item.disable', 'loadit');
                                    }, 2000)
                                }
                            },
                            {
                                icon: 'trash-o',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'asterisk',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'cloud-upload',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'cloud-download',
                                title: 'export',
                                group: 1
                            },
                            {
                                icon: 'gear',
                                group: 1
                            }
                        ]
                    }
                },
                {
                    name: 'toolbar',
                    options: {
                        el: '#toolbar5',
                        instanceName: 'contact3',
                        skin: 'blueish',
                        groups: [
                            {
                                id: 1,
                                align: 'left'
                            },
                            {
                                id: 2,
                                align: 'right'
                            }
                        ],
                        data: [
                            {
                                icon: 'floppy-o',
                                class: 'highlight',
                                group: 1,
                                id: 'loadit',
                                callback: function () {
                                    app.sandbox.emit('husky.toolbar.contact3.item.loading', 'loadit');

                                    setTimeout(function () {
                                        app.sandbox.emit('husky.toolbar.contact3.item.disable', 'loadit', true);
                                    }, 2000)
                                }
                            },
                            {
                                icon: 'pencil',
                                group: 1,
                                title: 'Overview',
                                type: 'select',
                                items: [
                                    {title: 'Overview'},
                                    {title: 'Landing'}
                                ]
                            },
                            {
                                icon: 'gear',
                                group: 1,
                                items: [
                                    {title: 'do something'}
                                ]
                            },
                            {
                                'id': 'state',
                                'icon': 'husky-publish',
                                'group': 1,
                                'title': 'Publish',
                                'type': 'select',
                                items: stateItems
                            },
                            {
                                'id': 'locale',
                                title: 'DE',
                                type: 'select',
                                group: 2,
                                class: 'highlight-white',
                                items: [
                                    {title: 'EN'},
                                    {title: 'EN_US'},
                                    {title: 'DE_AT'}
                                ]
                            }
                        ]
                    }
                },
                {
                    name: 'toolbar',
                    options: {
                        el: '#toolbar6',
                        instanceName: 'contact6',
                        hasSearch: true,
                        searchAlign: 'right',
                        skin: 'blueish',
                        groups: [
                            {
                                id: 1,
                                align: 'left'
                            }
                        ],
                        data: [
                            {
                                icon: 'plus-circle',
                                class: 'highlight-white',
                                group: 1
                            },
                            {
                                icon: 'trash-o',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'asterisk',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'cloud-upload',
                                group: 1,
                                disabled: true
                            },
                            {
                                icon: 'cloud-download',
                                group: 1
                            },
                            {
                                icon: 'gear',
                                group: 1
                            }
                        ]
                    }
                },
            ]);

            $('#disable').on('click', function () {
                app.sandbox.emit('husky.toolbar.contact.item.disable', '1');
                app.sandbox.emit('husky.toolbar.contact.item.disable', 'edit');

                app.sandbox.emit('husky.toolbar.contact.get-buttons-width', function (width) {
                    console.log(width, $('.toolbar-nav').width());
                })
            });

            $('#enable').on('click', function () {
                app.sandbox.emit('husky.toolbar.contact.item.enable', '1');
                app.sandbox.emit('husky.toolbar.contact.item.enable', 'edit');

                app.sandbox.emit('husky.toolbar.contact.item.show', '5');
            });

            $('#changeItem').on('click', function () {
                app.sandbox.emit('husky.toolbar.contact.item.change', 'state', 2);
            });

            $('#collapse').on('click', function () {
                if (collapsed === false) {
                    app.sandbox.emit('husky.toolbar.contact.collapse');
                    collapsed = true;
                } else {
                    app.sandbox.emit('husky.toolbar.contact.expand');
                    collapsed = false;
                }
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
