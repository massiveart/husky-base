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
        });

        $('#toggle').on('click', function () {
            var checked = $('#toggler1').data('checked');
            if (checked === 'checked') {
                app.sandbox.emit('husky.toggler.toggler1.change', false);
            } else {
                app.sandbox.emit('husky.toggler.toggler1.change', true);
            }
        }.bind(this));

        $('#data').on('click', function () {
            console.log('The toggle-button is checked?', $('#toggler1').data());
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
