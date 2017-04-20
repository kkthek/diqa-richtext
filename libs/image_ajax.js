/**
 * richtext-dialog Ajax interface
 * 
 * @author: Kai Kuehn
 * @ingroup DIQA Richtext
 */

(function() { 
	
	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	window.DIQARICHTEXT.Ajax = window.DIQARICHTEXT.Ajax || {};
	
	window.DIQARICHTEXT.Ajax = function() {
		
		var that = {};

		/**
		 * Returns the dialog HTML with an inital empty image list
		 * 
		 * @param string id ID of dialog DIV
		 * @param string substr Initial substr to be shown
		 * @param function callback Callback on success
		 * @param function callbackError Callback on error
		 */
		that.getDialog = function(id, substr, wikipage, signature, callback, callbackError) {

			var ajaxIndicator = new DIQARICHTEXT.Util.AjaxIndicator();
			ajaxIndicator.setGlobalLoading(true);
			
			var data = {
				action : 'diqarichtext',
				'method' : 'getDialog',
				'substr' : substr,
				'id' : id,
				'wikipage' : wikipage,
				'signature' : signature,
				format : 'json'
			};

			$.ajax({
				type : "GET",
				url : mw.util.wikiScript('api'),
				data : data,
				dataType : 'json',
				success : function(jsondata) {
					ajaxIndicator.setGlobalLoading(false);
					callback(jsondata);

				},
				error : function(jsondata) {
					ajaxIndicator.setGlobalLoading(false);
					callbackError(jsondata);
				}
			});

		};
		
		
		that.getWikiPagesDialog = function(id, callback, callbackError) {

			var ajaxIndicator = new DIQARICHTEXT.Util.AjaxIndicator();
			ajaxIndicator.setGlobalLoading(true);
			
			var data = {
				'action' : 'diqarichtext',
				'method' : 'getWikiPagesDialog',
				'id' : id,
				'format' : 'json'
			};

			$.ajax({
				type : "GET",
				url : mw.util.wikiScript('api'),
				data : data,
				dataType : 'json',
				success : function(jsondata) {
					ajaxIndicator.setGlobalLoading(false);
					callback(jsondata);

				},
				error : function(jsondata) {
					ajaxIndicator.setGlobalLoading(false);
					callbackError(jsondata);
				}
			});

		};
		
		that.getCategoryPickerDialog = function(id, callback, callbackError) {

			var ajaxIndicator = new DIQARICHTEXT.Util.AjaxIndicator();
			ajaxIndicator.setGlobalLoading(true);
			
			var data = {
				'action' : 'diqarichtext',
				'method' : 'getCategoryPickerDialog',
				'id' : id,
				'format' : 'json'
			};

			$.ajax({
				type : "GET",
				url : mw.util.wikiScript('api'),
				data : data,
				dataType : 'json',
				success : function(jsondata) {
					ajaxIndicator.setGlobalLoading(false);
					callback(jsondata);

				},
				error : function(jsondata) {
					ajaxIndicator.setGlobalLoading(false);
					callbackError(jsondata);
				}
			});

		};

		/**
		 * Finds images in the Wiki.
		 * 
		 * @param string substr 
		 * @param function callback Callback on success
		 * @param function callbackError Callback on error
		 */
		that.findImages = function(substr, callback, callbackError) {

			var data = {
				action : 'diqarichtext',
				'method' : 'findImages',
				'substr' : substr,
				format : 'json'
			};

			$.ajax({
				type : "GET",
				url : mw.util.wikiScript('api'),
				data : data,
				dataType : 'json',
				success : function(jsondata) {
					callback(jsondata);

				},
				error : function(jsondata) {
					callbackError(jsondata);
				}
			});

		};

		/**
		 * Returns the thumbnail with the given signature
		 * 
		 * @param string signture
		 * @param function callback Callback on success
		 * @param function callbackError Callback on error
		 */
		that.getThumbnail = function(signature, callback, callbackError) {

			var data = {
				action : 'diqarichtext',
				'method' : 'getThumbnail',
				'signature' : signature,
				format : 'json'
			};

			$.ajax({
				type : "GET",
				url : mw.util.wikiScript('api'),
				data : data,
				dataType : 'json',
				success : function(jsondata) {
					callback(jsondata);

				},
				error : function(jsondata) {
					callbackError(jsondata);
				}
			});

		};

		/**
		 * Creates an image page with the given signature
		 * 
		 * @param string signture
		 * @param string category (arbitrary value, used to create CSS-classes)
		 * @param function callback Callback on success
		 * @param function callbackError Callback on error
		 */
		that.createImagePage = function(signature, category, callback, callbackError) {

			var data = {
				action : 'diqarichtext',
				'method' : 'createImagePage',
				'signature' : signature,
				'category' : category,
				format : 'json'
			};

			$.ajax({
				type : "GET",
				url : mw.util.wikiScript('api'),
				data : data,
				dataType : 'json',
				success : function(jsondata) {
					callback(jsondata);

				},
				error : function(jsondata) {
					callbackError(jsondata);
				}
			});

		};
		
		
		/**
		 * Creates an image pages with the given signatures
		 * 
		 * @param string signtures (comma-separated)
		 * @param string aligment (horizontal or vertical)
		 * @param string category (arbitrary value, used to create CSS-classes)
		 * @param function callback Callback on success
		 * @param function callbackError Callback on error
		 */
		that.createImagePagesForRichtext = function(signatures, alignment, category, callback, callbackError) {

			var data = {
				action : 'diqarichtext',
				'method' : 'createImagePagesForRichtext',
				'signatures' : signatures,
				'alignment' : alignment,
				'category' : category,
				format : 'json'
			};

			$.ajax({
				type : "GET",
				url : mw.util.wikiScript('api'),
				data : data,
				dataType : 'json',
				success : function(jsondata) {
					callback(jsondata);

				},
				error : function(jsondata) {
					callbackError(jsondata);
				}
			});

		};

		return that;
	};
		
}());
