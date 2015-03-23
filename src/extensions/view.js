/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) Thomas Schedler <thomas@chirimoya.at>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 *
 * @module husky/view
 */
define('husky/extensions/view', function() {

    'use strict';

    require.config({
        jsx: {
            fileExtension: '.jsx'
        }
    });

    var React;

    // extension definition

    return {

        name: 'view',

        require: {
            paths: {
                react: 'bower_components/react/react',
                JSXTransformer: 'bower_components/jsx-requirejs-plugin/js/JSXTransformer',
                jsx: 'bower_components/jsx-requirejs-plugin/js/jsx'
            }
        },

        initialize: function(app) {
            window.React = React = require('react');

            define('view', function() {
                return React;
            });

            app.components.before('remove', function() {
                if (this && this.view && this.$el.length > 0) {
                    React.unmountComponentAtNode(this.$el[0]);
                }
            });
        }

    };
});
