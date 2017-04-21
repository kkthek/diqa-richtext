/**
 * richtext-dialog Dialog
 * 
 * @author: Kai Kuehn
 * @ingroup DIQA Richtext
 */

(function() { 
	
	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	window.DIQARICHTEXT.Dialogs = window.DIQARICHTEXT.Dialogs || {};
	
	DIQARICHTEXT.Dialogs.RichtextDialog = function(dialogId, wikipage, signature, category, inputID, callbackOnClose) {
		var that = {};

		that.dialog = null;
		that.dialogId = dialogId;
		that.wikipage = wikipage;
		that.signature = signature;
		that.category = category;
		that.inputID = $('#' + inputID);
		that.callbackOnClose = callbackOnClose;

		/**
		 * Initializes the dialog's controls
		 */
		that.initialize = function() {

			that.addButtonListeners();
			that.addSearchFieldListener();
			
		};
		
		that.addButtonListeners = function() {
			
			/**
			 * 'Add image' button
			 */
			$("button.btn", that.dialog).on(
					"click",
					function(event) {
						var action = $(event.target).attr("action");
						if (action == "add-image") {
							var signature = $('input.richtext-image-result', that.dialog).val();
							if (!signature || signature == '') {
								return;
							}
							
							that.inputID.val("Datei:" + signature + '.jpg');
							var ajaxIndicator = new DIQARICHTEXT.Util.AjaxIndicator();
							ajaxIndicator.setGlobalLoading(true);

							new window.DIQARICHTEXT.Ajax().createImagePage(signature, that.category, function(
									jsondata) {
								ajaxIndicator.setGlobalLoading(false);
								if (jsondata.error) {
									that.handleError(jsondata);
								}
								if (that.callbackOnClose) {
									that.callbackOnClose(jsondata);
								}
							}, function(jsondata) { 
								ajaxIndicator.setGlobalLoading(false);
								that.handleError(jsondata);
							});
							that.dialog.modal('hide');
						}
					});
    
		   /**
			* Adds 'Übernehmen' button
			*/
			$('input.add-to-basket').click(function(event) {
    				var targetRow =$('table tr.selected', that.dialog);
    				var signature = targetRow.attr('signature');
    				$('input.richtext-image-result', that.dialog).val(signature);
    		});
		};
    
		that.search = function(substr) {
			
			that.setImageListLoading(true);
			$('div.richtext-image-list', that.dialog).empty();
			new window.DIQARICHTEXT.Ajax().findImages(substr, function(jsondata) {
				that.setImageListLoading(false);
				that.handleError(jsondata);
				
				// append results and re-initialize listeners
				var html = jsondata.diqarichtext.html;
				$('div.richtext-image-list', that.dialog).append($(html));
				that.initializeImageList();
				
			}, function(jsondata) { 
				that.setImageListLoading(false);
				that.handleError(jsondata);
			});
		};
		
		that.addSearchFieldListener = function() {
			
			$("input.richtext-search-field", that.dialog).keyup(function(event) {
				
				if (event.keyCode == 13) {
					var substr = $(event.target).val();
					if (substr.length < 3) {
						alert("Bitte mind. 3 Zeichen eingeben.");
						return;
					}
					
					that.search(substr);
				}

			});
			
			$("input#richtext-image-search", that.dialog).click(function() { 
				var substr = $("input.richtext-search-field").val();
				if (substr.length < 3) {
					alert("Bitte mind. 3 Zeichen eingeben.");
					return;
				}
				
				that.search(substr);
			});
		};

		/**
		 * (Re-)initializes the image list event handlers
		 */
		that.initializeImageList = function() {
			var oldRow = null;	
			//$('div.richtext-image-list', that.dialog).tablesorter();
			$('table tr.image-row', that.dialog).click(
					function(event) {
						
						// hightlight selected row
						var targetRow = $(event.target).parent();
						if (oldRow != null) {
    						oldRow.toggleClass('selected');
	    				}
	    				targetRow.toggleClass('selected');
	    				oldRow = targetRow;
	            
	    				// request thumbnail
	    				var signature = targetRow.attr('signature');
						that.setImagePreviewLoading(true);
						new window.DIQARICHTEXT.Ajax().getThumbnail(signature, function(jsondata) {
							that.setImagePreviewLoading(false);
							that.handleError(jsondata);
							
							// add thumbnail-image
							var filepath = jsondata.diqarichtext.html;
							var wgScriptPath = mw.config.get('wgScriptPath');
							$('div.richtext-preview-image', that.dialog).css(
									'background', 'url('+filepath + ') no-repeat scroll');
							
							if (jsondata.diqarichtext.ext == null) {
									if (alert('Fehler während der Verbindung zum Wiki. Unbekannter Grund.')) {
										return;
									}
								}
							
							
						}, function() {
							that.setImagePreviewLoading(false);
							
						});
					});
			
		};
		
		/**
		 * window.DIQARICHTEXT.Ajax indicator for image previewing
		 */
		that.setImagePreviewLoading = function(state) {
			var css = {};
			if (state) {
				var wgScriptPath = mw.config.get('wgScriptPath');
				css = {
					'background-image' : 'url('
							+ wgScriptPath
							+ '/extensions/Richtext/skins/ajax-preview-loader.gif)',
					'background-repeat' : 'no-repeat',
					'background-position' : 'center'
				};
			}
			$('div.richtext-preview-image', that.dialog).css(css);
		};

		/**
		 * window.DIQARICHTEXT.Ajax indicator for image list updates
		 */
		that.setImageListLoading = function(state) {
			var css = {};
			if (state) {
				var wgScriptPath = mw.config.get('wgScriptPath');
				css = {
					'background-image' : 'url('
							+ wgScriptPath
							+ '/extensions/Richtext/skins/ajax-preview-loader.gif)',
					'background-repeat' : 'no-repeat',
					'background-position' : 'center'
				};
			} else {
				css = {
					'background-image' : 'url()',
					'background-repeat' : 'no-repeat',
					'background-position' : 'center'
				};
			}
			$('div.modal-body', that.dialog).css(css);
		};
		
		/**
		 * Global error handler for all ajax requests in Richtext-Image-Dialog
		 */
		that.handleError = function(jsondata) {
			if (jsondata.error) {
				if (!jsondata.error.info) {
					alert('Fehler beim Importieren eines Bildes. Unbekannter Grund.');
				} else {
					if (jsondata.error.code == 'readapidenied') {
						alert("Ihre Sitzung ist abgelaufen. Sie müssen sich anmelden." );
					} else if (jsondata.error.code == 'internal_api_error_Exception') {
						alert("Fehler beim Öffnen eines Bildes. Die Originalfehlermeldung lautet: " + jsondata.error.info);
					} else {
						alert(jsondata.error.info);
					}
				}
			}
		};

		/**
		 * Opens the dialog
		 */
		that.openDialog = function() {
			
			if ($('#'+that.dialogId).length == 0) {
				
				// first opening: request dialog, then open
				new window.DIQARICHTEXT.Ajax().getDialog(that.dialogId, '', that.wikipage, that.signature, function(jsondata) {
					var html = jsondata.diqarichtext.html;
					$('body').append($(html));
					
					that.dialog = $('#'+that.dialogId).modal({
						"backdrop" : "static",
						"keyboard" : true,
						"show" : true

					}).on('shown.bs.modal', function (e) {
						
					});
					that.initialize();
					that.initializeImageList();
					
					if (!that.signature || that.signature=='') {
						return;
					}
					else {
						
						// request thumbnail
						that.setImagePreviewLoading(true);
						new window.DIQARICHTEXT.Ajax().getThumbnail(that.signature, function(jsondata) {
							that.setImagePreviewLoading(false);
							that.handleError(jsondata);
							
							// add thumbnail-image
							var filepath = jsondata.diqarichtext.html;
							var wgScriptPath = mw.config.get('wgScriptPath');
							$('div.richtext-preview-image', that.dialog).css(
									'background', 'url('+filepath + ') no-repeat scroll');
							
							if (jsondata.diqarichtext.ext == null) {
								if (alert('Fehler während der Verbindung zum Wiki. Unbekannter Grund.')) {
									return;
								}
							}
							
							
						}, function() {
							that.setImagePreviewLoading(false);
							
						});
					}
					
				},  function(jsondata){
				});

			} else {
				
				// just re-open already loaded dialog
				that.dialog = $('#'+that.dialogId).modal({
					"backdrop" : "static",
					"keyboard" : true,
					"show" : true

				});

			}

			return that.dialog;
		};

		return that;
	};
  
	
	
}());