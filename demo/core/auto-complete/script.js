require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();
        
        var app = husky({
                debug: true
            }),
            _ = app.sandbox.util._;


        app.start([
                {
                    name: 'auto-complete',
                    options: {
                        el: '#autocomplete1',
                        instanceName: 'I1',
                        prefetchUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        remoteUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        suggestionImg: 'tag',
                        localData: [
                            {id: 89, name: 'Albanien'},
                            {id: 77, name: 'Altach'},
                            {id: 899, name: 'Andelsbuch'}
                        ]
                    }
                },
                {
                    name: 'auto-complete',
                    options: {
                        el: '#autocomplete2',
                        instanceName: 'I2',
                        prefetchUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        remoteUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        suggestionImg: 'tag',
                        localData: [
                            {id: 81, name: 'Brüssel'},
                            {id: 71, name: 'Bern'},
                            {id: 891, name: 'Berlin'}
                        ]
                    }
                },
                {
                    name: 'auto-complete',
                    options: {
                        el: '#autocomplete3',
                        instanceName: 'I3',
                        prefetchUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        remoteUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        suggestionImg: 'tag',
                        noNewValues: true,
                        localData: [
                            {id: 89, name: 'Albanien'},
                            {id: 77, name: 'Altach'},
                            {id: 899, name: 'Andelsbuch'}
                        ]
                    }
                },
                {
                    name: 'auto-complete',
                    options: {
                        el: '#autocomplete4',
                        instanceName: 'I4',
                        prefetchUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        remoteUrl: 'http://husky.lo:7878/admin/api/autocomplete',
                        suggestionImg: 'tag',
                        excludes: [
                            {id: 89, name: null},
                            {id: null, name: 'Frankreich'}
                        ],
                        localData: [
                            {id: 89, name: 'Albanien'},
                            {id: 77, name: 'Altach'},
                            {id: 899, name: 'Andelsbuch'}
                        ]
                    }
                }
            ]).then(function () {
            app.logger.log('Husky started...');
        });

        $('#dynamicExlude').on('click', function () {
            app.sandbox.emit('husky.auto-complete.I1.set-excludes', ['Altach']);
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
