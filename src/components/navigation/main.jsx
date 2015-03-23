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
define(['view', 'jsx!husky/components/navigation/sub-nav'], function(View, SubNavigation) {

    'use strict';

    var Navigation = View.createClass({
        render: function() {
            return View.createElement(SubNavigation)
        }
    });

    return {

        view: true,

        initialize: function(options) {
            this.sandbox.logger.log(options);
            this.sandbox.logger.log(this);

            View.render(View.createElement(Navigation), this.$el[0])
        }

    };
});
