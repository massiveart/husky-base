/**
 * This file is part of Husky, a scalable, event-driven JavaScript web applications framework.
 *
 * (c) Thomas Schedler <thomas@chirimoya.at>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 *
 * @module husky/components
 */
define(['mvc/model'], function(model) {

    'use strict';

    return {

        view: true,

        template: '<input placeholder="Type your name" value="{{ user.name }}"><br/> My name: {{ user.name }}',

        initialize: function(options) {
            this.sandbox.logger.log(options);
            this.sandbox.logger.log(this.sandbox);

            var User = model(),
                user = new User({
                    name: '...'
                });

            this.view.set('user', user);
            this.view.render(this.$el);

            this.view.observe('user', function(userData) {
                this.sandbox.logger.log('observe', userData.attributes);
            }.bind(this));

            this.view.on('change', function(data) {
                this.sandbox.logger.log('change', data);
            }.bind(this));

            this.view.on('teardown', function() {
                this.sandbox.logger.log('teardown');
            }.bind(this));


            this.sandbox.util.delay(function() {
                user.set('name', 'Thomas');
            }.bind(this), 1000);

            this.sandbox.util.delay(function() {
                this.view.teardown();
            }.bind(this), 2000);
        }
    };
});
