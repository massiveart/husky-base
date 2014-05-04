define(['husky/husky'], function(husky) {

    'use strict';

    var app;

    describe('Husky', function() {

        xit('version check', function() {
            app = husky({ debug: true });

            expect(app.version).toBe('0.1.0');
        });

        it('application start', function() {
            app = husky({ debug: true });

            var promise = app.start();

            expect(promise.then).toBeDefined();

            promise.then(function() {
                app.logger.log('Husky started...');
            });
        });
    });

});
