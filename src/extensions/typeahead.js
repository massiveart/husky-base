(function() {

	'use strict';

	if (window.Typeahead) {
		define('typeahead', [], function() {
			return window.Typeahead;
		});
	} else {
		require.config({
			paths: { "typeahead": 'bower_components/typeahead.js/dist/typeahead' },
			shim: { backbone: { deps: ['jquery'] } }
		});
	}

	define(['typeahead'], {
		name: 'typeahead',

		initialize: function(app) {
			app.sandbox.autocomplete = {

				init: function(selector, configs) {
					return app.core.dom.$(selector).typeahead(configs);
				},

                setValue: function(selector, value) {
                    return app.core.dom.$(selector).typeahead('setQuery', value);
                }
			};
		}
	});
})();
