require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();

        var app = husky({ debug: true }),
            _ = app.sandbox.util._;

        app.start([{
                name: 'auto-complete-list',
                options: {
                    instanceName: 'I1',
                    el: '.list-wrapper',
                    label: 'Tags',
                    suggestionsUrl: '',
                    itemsUrl: '',
                    remoteUrl: 'http://husky.lo:7878/admin/api/autocompletelist',
                    autoCompleteIcon: 'tag',
                    items: ['Tag1', 'Tag2', 'Tag3', 'Tag4'],
                    suggestions: ["Sugg1", "Sugg2", "Sugg3", "Sugg4"],
                    suggestionsHeadline: 'Recent Tags',
                    noNewTags: true,
                    localData: [{id: null, name: 'Tag A'}, {id: null, name: 'Tag B'}, {id: null, name: 'Tag C'}, {id: null, name: 'Tag D'}]
                }
            }, {
                name: 'auto-complete-list',
                options: {
                    instanceName: 'I2',
                    el: '.list-wrapper2',
                    label: 'Links',
                    suggestionsUrl: '',
                    itemsUrl: '',
                    remoteUrl: 'http://husky.lo:7878/admin/api/autocompletelist',
                    items: ['Link1', 'Link2', 'Link3', 'Link4'],
                    autoCompleteIcon: 'tag',
                    suggestions: ["SuggA", "SuggB", "SuggC", "SuggD"],
                    suggestionsHeadline: 'Popular Links',
                    localData: [{id: null, name: 'Link A'}, {id: null, name: 'Link B'}, {id: null, name: 'Link C'}, {id: null, name: 'Link D'}]
                }
            }]).then(function() {
            app.logger.log('Husky started...');
            setTimeout(function() {
                app.sandbox.emit('husky.auto-complete-list.I1.set-tags', ['Set1', 'Set2', 'Set3']);
            }, 3000);
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
