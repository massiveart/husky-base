require.config({
    baseUrl: '../'
});

require(['src/husky'], function(husky) {

    'use strict';

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

    }, function() {
        app.logger.log(arguments);
    });

});
