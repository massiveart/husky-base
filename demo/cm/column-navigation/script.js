require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();

        var app,
            _;

        app = new husky({ debug: true });
        _ = app.sandbox.util._;

        app.start([
                {
                    name: 'column-navigation@cm',
                    options: {
                        el: '#column-navigation',
                        url: 'http://husky.lo:7878/admin/api/columnnavigation?children=1.2.3.1',
                        selected: '1.2.3.1',
                        noPageDescription: 'No Pages'

                    }
                }
            ]).then(function () {
            app.logger.log('Husky started...');

            app.sandbox.on('husky.column-navigation.selected', function (item) {
                app.logger.log('husky.column-navigation.selected item selected');
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
