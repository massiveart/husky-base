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
                    name: 'matrix@crm',
                    options: {
                        el: '#container',
                        captions: {
                            all: 'Select all',
                            none: 'Select none',
                            general: 'Assets',
                            type: 'Section',
                            horizontal: 'Permissions',
                            vertical: ['Videos', 'Documents', 'Images']
                        },
                        values: {
                            vertical: ['sulu.assets.videos', 'sulu.assets.documents', 'sulu.assets.images'],
                            horizontal: ['plus', 'edit', 'search', 'times', 'gear', 'check', 'building'],
                            titles: ['add', 'edit', 'search', 'remove', 'settings', 'circle-ok', 'building']
                        },
                        data: [
                            [false, false, true, false, false, true, false],
                            [true, false, true, false, false, false, false],
                            [false, true, true, false, true, false, true]
                        ]
                    }
                }
            ]);

            $('#set-all').on('click', function () {
                app.sandbox.emit('husky.matrix.set-all');
            });

            $('#unset-all').on('click', function () {
                app.sandbox.emit('husky.matrix.unset-all');
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
