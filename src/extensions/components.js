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
define('husky/extensions/components', function() {

    'use strict';

    // extension definition

    return {

        name: 'components',

        require: {
            paths: {
                text: 'bower_components/requirejs-text/text'
            }
        },

        initialize: function(app) {

        }
    };

});
