define(function() {

    'use strict';

    return {
        name: 'Util',

        initialize: function(app) {

            /**
             * @method util.load
             */
            app.core.util.load = function(url, data) {
                var deferred = new app.sandbox.data.deferred();

                app.logger.log('load', url);

                app.sandbox.util.ajax({
                    url: url,
                    data: data || null,

                    success: function(data, textStatus) {
                        app.logger.log('data loaded', data, textStatus);
                        deferred.resolve(data, textStatus);
                    }.bind(this),

                    error: function(jqXHR, textStatus, error) {
                        deferred.reject(textStatus, error);
                    }
                });

                app.sandbox.emit('husky.util.load.data');

                return deferred.promise();
            };

            /**
             * @method util.save
             */
            app.core.util.save = function(url, type, data) {
                var deferred = new app.sandbox.data.deferred();

                app.logger.log('save', url);

                app.sandbox.util.ajax({

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    url: url,
                    type: type,
                    data: JSON.stringify(data),

                    success: function(data, textStatus) {
                        app.logger.log('data saved', data, textStatus);
                        deferred.resolve(data, textStatus);
                    }.bind(this),

                    error: function(jqXHR, textStatus, error) {
                        deferred.reject(jqXHR, textStatus, error);
                    }
                });

                app.sandbox.emit('husky.util.save.data');

                return deferred.promise();
            };

            /**
             * @method util.cropMiddle
             */
            app.core.util.cropMiddle = function(text, maxLength, delimiter) {
                var substrLength;

                // return text if it doesn't need to be cropped
                if (!text || text.length <= maxLength) {
                    return text;
                }

                // default delimiter
                if (!delimiter) {
                    delimiter = '...';
                }

                substrLength = Math.floor((maxLength - delimiter.length)/2);
                return text.slice(0, substrLength) + delimiter + text.slice(-substrLength);
            }
        }
    };
});
