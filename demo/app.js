require.config({
    baseUrl: '../'
});

require(['src/husky'], function(husky) {

    'use strict';

    var app = husky({ debug: { enable: true } });
    app.logger.log(app);
});
