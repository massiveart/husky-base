require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();

        var app = husky({debug: true}),
            _ = app.sandbox.util._;

        app.start().then(function () {
            app.logger.log('Husky started...');

            var collapse = function (force, event) {
                if (!!event) {
                    event.preventDefault();
                }
                var namespace = 'husky.navigation.',
                    postfix = !this.collapsed ? 'collapse' : 'uncollapse',
                    label = this.collapsed ? 'collapse' : 'uncollapse',
                    eventName = namespace + postfix;
                this.collapsed = !this.collapsed;
                app.sandbox.dom.html('#collapse', label + ' navigation');
                app.sandbox.emit(eventName, force ? true : false);
            }.bind(this);

            app.sandbox.on('husky.navigation.collapsed', function () {
                this.collapsed = true;
            }, this);
            app.sandbox.on('husky.navigation.uncollapsed', function () {
                this.collapsed = false;
            }, this);

            app.sandbox.dom.on('#collapse', 'click', collapse.bind(this, true));
            app.sandbox.dom.on('#force', 'click', collapse.bind(this, true));

            app.sandbox.dom.on('#show', 'click', function () {
                app.sandbox.emit('husky.navigation.show');
            }.bind(this));

            app.sandbox.dom.on('#hide', 'click', function () {
                app.sandbox.emit('husky.navigation.hide');
            }.bind(this));

            app.sandbox.dom.on('#select', 'click', function () {
                app.sandbox.emit('husky.navigation.select-item', 'media\/movies\/edit::1893884\/content');
                app.sandbox.emit('husky.navigation.footer.set', {
                    userName: 'Marcel Moosbrugger'
                })
            }.bind(this));
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
