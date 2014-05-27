require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();
        var app = husky({ debug: true }),
            _ = app.sandbox.util._;

        app.start().then(function () {
            app.logger.log('Husky started...');


            app.sandbox.start([
                {
                    name: 'dropdown',
                    options: {
                        el: '#dd1',
                        trigger: '.drop-down-trigger',
                        setParentDropDown: true,
                        instanceName: 'dialog1',
                        alignment: 'left',
                        data: [
                            {
                                'id': 1,
                                'name': 'Private'
                            },
                            {
                                'id': '2',
                                'name': 'Mobile'
                            },
                            {
                                'divider': true
                            },
                            {
                                'id': 3,
                                'name': 'Work',
                                callback: function () {
                                    alert('work clicked');
                                }
                            }
                        ]
                    }
                }
            ]);

            app.sandbox.on('husky.dropdown.dialog1.item.click', function (item) {
                console.log("drop-down 2: click item: " + item);
                $('#type-name1').text(item.name);
                $('#type-name1').data('id', item.id);
            });


            app.sandbox.start([
                {
                    name: 'dropdown',
                    options: {
                        el: '#dd2',
                        url: 'http://husky.lo:7878/admin/api/dropdown',
                        trigger: '.drop-down-trigger',
                        setParentDropDown: true,
                        excludeItems: [
                            {id: 1},
                            {id: 2}
                        ],
                        instanceName: 'dialog2'
                    }
                }
            ]);

            app.sandbox.on('husky.dropdown.dialog2.item.click', function (item) {
                console.log("drop-down 1: click item: " + item);
                $('#type-name2').text(item.name);
                $('#type-name2').data('id', item.id);
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
