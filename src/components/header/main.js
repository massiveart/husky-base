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
define(function() {

    'use strict';

    return {

        initialize: function(options) {
            this.sandbox.logger.log(options);
            this.sandbox.logger.log(this);
        }
    };
});
