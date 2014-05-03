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
            app.sandbox.on('event.test', function() {
                app.logger.log('listener called');
            });
            app.sandbox.emit('event.test');

            app.sandbox.emit(['husky', 'sandbox', 'stop'], app.sandbox);

            app.sandbox.emit('event.test');

            app.sandbox.emit(['husky', 'sandbox', 'pause'], app.sandbox);

            app.logger.log('Bootstrapping the application took ' + zone.time() + ' of CPU time');
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
