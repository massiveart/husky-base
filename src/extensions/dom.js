/**
 * see https://github.com/farhadi/html5sortable for documentation
 */

(function() {

    'use strict';

    require.config({
        paths: {
            html5sortable: 'bower_components/html5sortable/jquery.sortable'
        },
        shim: {
            jquery: { exports: '$' },
            html5sortable: {deps: ['jquery'], exports: 'jQuery.fn.sortable'}
        }
    });


    define(['html5sortable'], function() {

        return {
            name: 'html5sortable',

            initialize: function(app) {
                app.core.dom.sortable = function(selector, options) {
                    return $(selector).sortable(options);
                };
            }
        };
    });
})();
