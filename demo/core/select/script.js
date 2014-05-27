require.config({
    baseUrl: '../../../',
    paths: {
        "form": "bower_components/husky-validation/dist/validation",
        "type/husky-select": "src/components/select/select-type"
    }
});

require(['src/husky', 'form'], function (husky, Form) {

    'use strict';


    function main() {
        zone.reset();
        var app = husky({debug: true}),
            _ = app.sandbox.util._,
            form = new Form($('#mylittleform')),
            state7 = 0;

        app.start([
                {
                    name: 'select',
                    options: {
                        el: '#ddms',
                        instanceName: 'ddms',
                        multipleSelect: true,
                        defaultLabel: 'Please choose ...',
                        data: ['Deutsch', 'English', 'Spanish', 'Italienisch'],
                        preSelectedElements: ['Deutsch', 'English', 'Italienisch']
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms2',
                        instanceName: 'ddms2',
                        multipleSelect: true,
                        defaultLabel: 'Please choose ...',
                        valueName: 'name',
                        data: [
                            {id: 0, name: 'Deutsch'},
                            {id: 1, name: 'English'},
                            {id: 2, name: 'Spanish'},
                            {id: 3, name: 'Italienisch'}
                        ],
                        preSelectedElements: [1, 2, 3]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms3',
                        instanceName: 'ddms3',
                        defaultLabel: 'Please choose ...',
                        value: 'name',
                        multipleSelect: true,
                        data: ['Deutsch', 'English', 'Spanish', 'divider', 'Italienisch']
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms4',
                        instanceName: 'ddms4',
                        multipleSelect: true,
                        defaultLabel: 'Please choose ...',
                        valueName: 'name',
                        data: [
                            {id: 0, name: 'Deutsch'},
                            {id: 1, name: 'English'},
                            {id: 2, name: 'Spanish'},
                            {id: 3, name: 'Italienisch'}
                        ]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms5',
                        instanceName: 'ddms5',
                        defaultLabel: 'This one is single select.. try it',
                        valueName: 'category',
                        multipleSelect: false,
                        emitValues: true,
                        preSelectedElements: [0],
                        data: [
                            {id: 0, category: 'Deutsch'},
                            {id: 1, category: 'English'},
                            {id: 2, category: 'Spanish'},
                            {id: 3, category: 'Italienisch'},
                            {divider: true},
                            {
                                category: 'Add new',
                                updateLabel: false,
                                callback: function () {
                                    console.log("called function");
                                }
                            }
                        ]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms6',
                        instanceName: 'ddms6',
                        multipleSelect: false,
                        defaultLabel: 'with deselect..',
                        valueName: 'name',
                        deselectField: '',
                        small: true,
                        data: [
                            {id: 0, name: 'Deutsch'},
                            {id: 1, name: 'English'},
                            {id: 2, name: 'Spanish'},
                            {id: 3, name: 'Italienisch'}
                        ]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms7',
                        instanceName: 'ddms7',
                        defaultLabel: 'I am disabled',
                        valueName: 'name',
                        multipleSelect: true,
                        disabled: true,
                        data: [
                            {id: 0, name: 'Deutsch'},
                            {id: 1, name: 'English'},
                            {id: 2, name: 'Spanish'},
                            {id: 3, name: 'Italienisch'}
                        ]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms8',
                        instanceName: 'ddms8',
                        defaultLabel: 'I have disabled items',
                        valueName: 'name',
                        preSelectedElements: [null],
                        data: [
                            {id: null, name: 'Deselect with null item'},
                            {id: 0, name: 'Deutsch', disabled: true},
                            {id: 1, name: 'English'},
                            {id: 2, name: 'Spanish', disabled: true},
                            {id: 3, name: 'Italienisch'}
                        ]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms10',
                        instanceName: 'ddms10',
                        defaultLabel: 'I stick to the bottom',
                        valueName: 'name',
                        preSelectedElements: [null],
                        data: [
                            {id: 0, name: 'Deutsch', disabled: true},
                            {id: 1, name: 'English'},
                            {id: 2, name: 'Spanish', disabled: true},
                            {id: 3, name: 'Italienisch'}
                        ]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#ddms9',
                        instanceName: 'ddms9',
                        data: ['EN_EN', 'EN_US', 'DE_DE', 'DE_AT'],
                        preSelectedElements: ['EN_EN'],
                        style: 'big'
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#actionSelect',
                        defaultLabel: 'Action select',
                        instanceName: 'actionSelect',
                        fixedLabel: true,
                        style: 'action',
                        icon: 'plus-circle',
                        repeatSelect: true,
                        noItemsCallback: function () {
                            alert('no items. default callback called')
                        }, // pass no data to the component to see this option in action
                        data: [
                            {
                                name: 'Action 1',
                                callback: function () {
                                    alert('action 1')
                                }
                            },
                            {
                                name: 'Action 2',
                                callback: function () {
                                    alert('action 2')
                                }
                            },
                            {
                                name: 'Action 3',
                                callback: function () {
                                    alert('action 3')
                                }
                            },
                            {
                                name: 'Action 4',
                                callback: function () {
                                    alert('action 4')
                                }
                            }
                        ]
                    }
                },
                {
                    name: 'select',
                    options: {
                        el: '#actionSelectSingle',
                        defaultLabel: 'Action select',
                        instanceName: 'actionSelect',
                        fixedLabel: true,
                        style: 'action',
                        icon: 'circle-plus',
                        repeatSelect: true,
                        noItemsCallback: function () {
                            alert('no items. default callback called')
                        }, // pass no data to the component to see this option in action
                        data: []
                    }
                }
            ]).then(function () {

            app.sandbox.on('husky.select.ddms.deselected.item', function (item) {
                console.log("drop-down multiple select ddms: deselected item: " + item);
            });

            app.sandbox.on('husky.select.ddms.selected.item', function (item) {
                console.log("drop-down multiple select ddms: selected item: " + item);
            });

            app.sandbox.dom.on('#show', 'click', function (event) {
                app.sandbox.dom.stopPropagation(event);
                app.sandbox.emit('husky.select.ddms.show');
            });

            app.sandbox.dom.on('#hide', 'click', function (event) {
                app.sandbox.dom.stopPropagation(event);
                app.sandbox.emit('husky.select.ddms.hide');
            });

            app.sandbox.dom.on('#toggle', 'click', function (event) {
                app.sandbox.dom.stopPropagation(event);
                app.sandbox.emit('husky.select.ddms.toggle');
            });

            app.sandbox.dom.on('#get', 'click', function (event) {
                app.sandbox.emit('husky.select.ddms.get-checked', function (selected) {
                    console.log('selected items', selected);
                });
            });


            app.sandbox.on('husky.select.ddms2.deselected.item', function (item) {
                console.log("drop-down multiple select ddms2: deselected item: " + item);
            });

            app.sandbox.on('husky.select.ddms2.selected.item', function (item) {
                console.log("drop-down multiple select ddms2: selected item: " + item);
            });

            $('#toggleState').on('click', function () {
                if (state7 === 0) {
                    app.sandbox.emit('husky.select.ddms7.enable');
                    state7 = 1;
                } else {
                    app.sandbox.emit('husky.select.ddms7.disable');
                    state7 = 0;
                }
            });

            $('#update').on('click', function () {

                var data = [
                    {id: 0, category: 'Deutsch 1'},
                    {id: 1, category: 'English 1'},
                    {id: 2, category: 'Spanish 1'},
                    {id: 3, category: 'Italienisch 1'},
                    {divider: true},
                    {
                        category: 'Add new 1',
                        updateLabel: false,
                        callback: function () {
                            console.log("called function");
                        }
                    }
                ];

                app.sandbox.emit('husky.select.ddms5.update', data, [1500]);
                console.log('updated dropdown 5');
            });

            $('#changeData5').on('click', function () {
                $('#ddms5').data({
                    'selection': '3',
                    'selection-values': 'Italienisch'
                }).trigger('data-changed');
            });

            $('#setDataDDMS5').on('click', function () {
                console.log('started setdata');

                form.initialized.then(function () {
                    form.mapper.setData({
                        dropdown: {
                            id: 3,
                            category: "Italienisch"
                        }
                    }).then(
                        function () {
                            console.log('resolved setdata');
                        }
                    );
                });
            });


            $('#getDataDDMS5').on('click', function () {
                console.log(form.mapper.getData());
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
