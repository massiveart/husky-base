require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();

        var app = husky({ debug: true}),
            _ = app.sandbox.util._;

        app.start([{
                name: 'label',
                options: {
                    el: '#errorLabel',
                    type: 'ERROR',
                    description: 'This is a neat error-label',
                    closeCallback: function() {
                        console.log('You closed a husky-error-label');
                    }
                }
            },
                {
                    name: 'label',
                    options: {
                        el: '#successLabel',
                        type: 'SUCCESS',
                        description: 'This is a neat success-label'
                    }
                },
                {
                    name: 'label',
                    options: {
                        el: '#warningLabel',
                        type: 'WARNING',
                        description: 'This is a neat warning-label'
                    }
                }
            ]).then(function() {
            app.logger.log('Husky started...');
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
