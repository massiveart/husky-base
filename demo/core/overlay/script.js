require.config({
    baseUrl: '../../../'
});

require(['src/husky'], function (husky) {

    'use strict';


    function main() {
        zone.reset();

        var app = husky({
                debug: true
            }),
            _ = app.sandbox.util._,

            testData = '<div class="content-inner">' +
                '<h3>Most awesome overlay</h3>' +
                '<p>here could be anything</p>' +
                '<div class="grid-row divider">' +
                '<div class="grid-col-5 pull-left">' +
                '<div>Some text</div>' +
                '</div>' +
                '<div class="grid-col-4 pull-right">' +
                '<div id="action" class="btn action fit only-icon pointer">' +
                '<div class="fa-arrow-right"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<textarea></textarea>' +
                '</div>';

        app.start([
                {
                    name: 'overlay@husky',
                    options: {
                        el: '#overlaySlides',
                        triggerEl: '#slides',
                        draggable: true,
                        instanceName: 'slides',
                        skin: 'wide',
                        slides: [
                            {
                                title: 'Slide 1',
                                data: testData,
                                closeCallback: function () {
                                    console.log('You clicked on close');
                                },
                                okCallback: function () {
                                    console.log('You clicked on ok - another');
                                    console.log('returned data ', data)
                                    console.log($(data).find('h3').text());
                                    return true;
                                }
                            },
                            {
                                title: 'Slide2',
                                data: '<div id="column-navigation"/>',
                                cssClass: 'column-navigation-slide',
                                buttons: [
                                    {
                                        type: 'ok',
                                        inactive: false,
                                        align: 'right'
                                    },
                                    {
                                        type: 'cancel',
                                        inactive: false,
                                        align: 'left'
                                    }
                                ],
                                closeCallback: function () {
                                    console.log('You clicked on close');

                                    app.sandbox.emit('husky.overlay.slides.slide-left');
                                    return true;
                                },
                                okCallback: function (data) {
                                    console.log('You clicked on ok - another');
                                    console.log('returned data ', data)
                                    console.log($(data).find('h3').text());
                                    app.sandbox.emit('husky.overlay.slides.slide-left');
                                    return false;
                                }
                            }
                        ]
                    }
                },
                {
                    name: 'overlay@husky',
                    options: {
                        el: '#overlay1',
                        triggerEl: '#normal',
                        title: 'This is the title of the overlay',
                        data: '<div style="min-height: 350px"></div>',
                        closeCallback: function () {
                            console.log('You clicked on close');
                        },
                        okCallback: function () {
                            console.log('You clicked on ok');
                        }
                    }
                },
                {
                    name: 'overlay@husky',
                    options: {
                        el: '#overlay2',
                        triggerEl: '#withtabs',
                        title: 'This overlay has tabs',
                        instanceName: 'withTabs',
                        tabs: [
                            {title: 'Info', data: '<div><h2>Info Tab</h2></div>'},
                            {title: 'Languages', data: '<div><h2>Languages Tab</h2></div>'},
                            {title: 'Versions', data: '<div><h2>Versions</h2></div>'}
                        ],
                        languageChanger: {
                            locales: ['EN', 'DE', 'ES'],
                            preSelected: 'DE'
                        },
                        closeCallback: function () {
                            console.log('You clicked on close');
                        },
                        okCallback: function () {
                            console.log('You clicked on ok');
                        }
                    }
                },
                {
                    name: 'overlay@husky',
                    options: {
                        el: '#overlay3',
                        triggerEl: '#showme3',
                        title: 'We want your title!',
                        container: '#insertOverlayHere',
                        okInactive: true,
                        data: testData,
                        closeCallback: function () {
                            console.log('You clicked on close');
                        },
                        okCallback: function () {
                            console.log('You clicked on ok');
                        }
                    }
                },
                {
                    name: 'overlay@husky',
                    options: {
                        el: '#overlay4',
                        triggerEl: '#showme4',
                        title: 'We want your title!',
                        container: '#insertOverlayHere',
                        instanceName: 'wide',
                        skin: 'wide',
                        data: testData,
                        okInactive: true,
                        closeCallback: function () {
                            console.log('You clicked on close');
                        },
                        okCallback: function () {
                            console.log('You clicked on ok');
                        }
                    }
                }

            ]).then(function () {
            app.logger.log('Husky started...');

            app.sandbox.on('husky.overlay.slides.initialized', function () {
                app.sandbox.start(
                    [
                        {
                            name: 'column-navigation@husky',
                            options: {
                                el: '#column-navigation',
                                url: 'http://husky.lo:7878/admin/api/columnnavigation?children=1.2.3.1',
                                selected: '1.2.3.1',
                                noPageDescription: 'No Pages',
                                sizeRelativeTo: '#overlaySlides .slide-0 .overlay-content',
                                wrapper: {height: 100},
                                showEdit: false,
                                showStatus: false
                            }
                        }
                    ]
                );
            });

            $('body').on('click', '#action', function () {
                app.sandbox.emit('husky.overlay.slides.slide-right');
            });

            app.sandbox.on('husky.overlay.deactivated.opened', function () {
                setTimeout(function () {
                    app.sandbox.emit('husky.overlay.deactivated.okbutton.activate');
                    setTimeout(function () {
                        app.sandbox.emit('husky.overlay.deactivated.okbutton.deactivate');
                    }, 2000);
                }, 2000);
            });

            $('#warning').click(function () {
                var $element = $('<div/>');
                $('body').append($element);

                app.sandbox.start([
                    {
                        name: 'overlay@husky',
                        options: {
                            el: $element,
                            title: 'Please confirm',
                            message: 'If you delete this content it will be lost. Do you want to continue?',
                            okDefaultText: 'Yes, delete it',
                            type: 'warning',
                            closeCallback: function () {
                                console.log('You clicked on close');
                            },
                            okCallback: function (data) {
                                console.log('You clicked on ok - another');
                                console.log('returned data ', data)
                                console.log($(data).find('h3').text());
                            }
                        }
                    }
                ]);
            });

            $('#error').click(function () {
                var $element = $('<div/>');
                $('body').append($element);

                app.sandbox.start([
                    {
                        name: 'overlay@husky',
                        options: {
                            el: $element,
                            title: 'This action is not possible',
                            message: 'Sorry, you cannot delete this content because you don’t have the permissions.',
                            type: 'error',
                            closeCallback: function () {
                                console.log('You clicked on close');
                            },
                            okCallback: function (data) {
                                console.log('You clicked on ok - another');
                                console.log('returned data ', data)
                                console.log($(data).find('h3').text());
                            }
                        }
                    }
                ]);
            });
        });
    }


    /*
     * This zone starts a timer at the start of each task,
     * and stops it at the end. It accumulates the total run
     * time internally, exposing it via `zone.time()`
     */
    var profilingZone = (function () {
        var time = 0,
        // use the high-res timer if available
            timer = performance ?
                performance.now.bind(performance) :
                Date.now.bind(Date);
        return {
            beforeTask: function () {
                this.start = timer();
            },
            afterTask: function () {
                time += timer() - this.start;
            },
            time: function () {
                return Math.floor(time * 100) / 100 + 'ms';
            },
            reset: function () {
                time = 0;
            }
        };
    }());


    /*
     * Bootstrap the app
     */
    zone.fork(profilingZone).run(main);

});
