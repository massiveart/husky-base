require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();
        var app = husky({ debug: true }),
            _ = app.sandbox.util._,
            state7 = 0;

        app.start([
                {
                    name: 'dependent-select',
                    options: {
                        el: '#dependent-container',
                        instanceName: 'ddms',
                        defaultLabels: ['Please choose a field', 'please choose a type'],
                        value: 'name',
//                            preselect: '0',
                        selectOptions: [
                            {},
                            {
                                deselectField: 'none'
//                                    preSelectedElements: ['0']
                            }
                        ],
                        data: [
                            {
                                id: '0',
                                name: 'phone',
                                items: [
                                    {
                                        id: '0',
                                        name: 'office'
                                    },
                                    {
                                        id: '1',
                                        name: 'handy'
                                    }
                                ]
                            },
                            {
                                id: '1',
                                name: 'emails',
                                items: [
                                    {
                                        id: '0',
                                        name: 'private@'
                                    },
                                    {
                                        id: '1',
                                        name: '@ffice'
                                    }
                                ]
                            }

                        ],
                        container: ['#select1', '#select2']
                    }
                }
            ]).then(function () {

            app.sandbox.on('husky.select.ddms.deselected.item', function (item) {
                console.log("drop-down multiple select ddms: deselected item: " + item);
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
