/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) Thomas Schedler <thomas@chirimoya.at>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 *
 * @module husky/router
 */
define('husky/extensions/router', function() {

    'use strict';

    // extension definition

    return {

        name: 'router',

        require: {
            paths: {
                backbone: 'bower_components/backbone/backbone'
            }
        },

        initialize: function(app) {
            var core = app.core,
                sandbox = app.sandbox,

                Backbone = require('backbone');

            core.router = core.router || {};

            core.router.Router = Backbone.Router;
            core.router.History = Backbone.History;
            core.router.history = Backbone.history;


            /**
             * @class Sandbox
             */

            sandbox.router = sandbox.router || {};

            sandbox.router.routes = [];

            sandbox.router.Router = function(options) {
                return core.router.Router.extend(options);
            };

            sandbox.router.history = core.router.history;

        },

        afterAppStart: function(app) {
            app.sandbox.util.delay(function() {
                if (!app.core.router.History.started) {
                    app.core.router.history.start();
                }
            }, 100);
        }
    };
});
