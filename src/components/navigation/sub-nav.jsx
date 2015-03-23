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
define(['view'], function(View) {

    'use strict';

    var SubNavigation = View.createClass({
        render: function() {
            return (
                <ul>
                    <li>Test 1</li>
                    <li>Test 2</li>
                    <li>Test 3</li>
                </ul>
            )
        }
    });

    return SubNavigation;
});
