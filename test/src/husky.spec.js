define(['husky/husky'], function(husky) {

    'use strict';

    var app;

    describe('Husky', function() {

        it('application start', function(done) {
            app = husky({ debug: true });

            var promise = app.start();

            expect(promise.then).toBeDefined();

            promise.then(function() {
                app.logger.log('Husky started ...');
                done();
            });
        });
    });

});
