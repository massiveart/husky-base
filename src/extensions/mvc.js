/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) Thomas Schedler <thomas@chirimoya.at>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 *
 * @module husky/extensions
 */
define('husky/extensions/mvc', function() {

    'use strict';

    var views = {};

    // extension definition

    return {

        name: 'mvc',

        require: {
            paths: {
                'backbone': 'bower_components/backbone/backbone',
                'ractive': 'bower_components/ractive/ractive',
                'ractive-backbone': 'bower_components/ractive-backbone/ractive-adaptors-backbone'
            }
        },

        initialize: function(app) {
            var core = app.core,
                sandbox = app.sandbox,

                Ractive = require('ractive'),
                Backbone = require('backbone');

            core.mvc = core.mvc || {};

            core.mvc.Model = Backbone.Model;
            core.mvc.Collection = Backbone.Collection;
            core.mvc.Router = Backbone.Router;
            core.mvc.History = Backbone.History;
            core.mvc.history = Backbone.history;

            core.mvc.View = Ractive;

            /**
             * @class Sandbox
             */

            sandbox.mvc = sandbox.mvc || {};

            sandbox.mvc.routes = [];

            sandbox.mvc.Model = function(options) {
                return core.mvc.Model.extend(options);
            };

            sandbox.mvc.Collection = function(options) {
                return core.mvc.Collection.extend(options);
            };

            sandbox.mvc.Router = function(options) {
                return core.mvc.Router.extend(options);
            };

            sandbox.mvc.history = core.mvc.history;

            sandbox.mvc.View = function(options) {
                return core.mvc.View.extend(options);
            };

            define('mvc/view', function() {
                return sandbox.mvc.View;
            });

            define('mvc/model', function() {
                return sandbox.mvc.Model;
            });

            define('mvc/collection', function() {
                return sandbox.mvc.Collection;
            });

            // Injecting a View in the Component just before initialization.
            // This View's class will be built and cached this first time the component is included.
            app.components.before('initialize', function(options) {

                // check if component needs a view instance
                if (this && !!this.view) {

                    var View = views[options.ref],
                        viewOptions;

                    if (!View) {
                        viewOptions = this.sandbox.util.pick(this, 'template', 'events');
                        views[options.ref] = View = sandbox.mvc.View(viewOptions);
                    }

                    this.view = new View({
                        adaptors: [Ractive.adaptors.Backbone]
                    });

                    this.view.sandbox = this.sandbox;
                    this.view.parent = this;
                }
            });

            app.components.before('remove', function() {
                if (this && this.view) {
                    this.view.teardown();
                }
            });
        },

        afterAppStart: function(app) {
            app.sandbox.util.delay(function() {
                if (!app.core.mvc.History.started) {
                    app.core.mvc.history.start();
                }
            }, 250);
        }
    };
});
