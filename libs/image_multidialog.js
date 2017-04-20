/**
 * richtext-dialog Multiselect Dialog
 * 
 * @author: Kai Kuehn
 * @ingroup DIQA Richtext
 */

(function() { 
	
	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	window.DIQARICHTEXT.Dialogs = window.DIQARICHTEXT.Dialogs || {};
	
	DIQARICHTEXT.Dialogs.RichtextDialogMultiSelect = function(dialogId, inputID, alignment, category, callbackOnClose) { 
		
		var o = $.extend(new DIQARICHTEXT.Dialogs.RichtextDialog(), {
			
			addButtonListeners : function() {
				
				var that = this;
				
				/**
				 * 'Add image' button
				 */
				$("button.btn", that.dialog).on(
						"click",
						function(event) {
							var action = $(event.target).attr("action");
							if (action == "add-image") {
								var signatures = $('input.richtext-image-result', that.dialog).val().split(",");
								signatures = $.map(signatures, function(e) { return e.trim(); });
								signatures = $.grep(signatures, function(e) { return e != ''; });
								if (signatures.length == 0) {
									return;
								}
								
								var ajaxIndicator = new DIQARICHTEXT.Util.AjaxIndicator();
								ajaxIndicator.setGlobalLoading(true);

								new window.DIQARICHTEXT.Ajax().createImagePagesForRichtext(signatures.join(","), that.alignment, that.category, function(
										jsondata) {
									ajaxIndicator.setGlobalLoading(false);
									that.handleError(jsondata);
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
    				
    				// make sure to add every signature only once
    				var selectedSignatures = $('input.richtext-image-result', that.dialog).val();
    				var parts = selectedSignatures.split(",");
    				for(var i = 0; i < parts.length; i++) {
    					if ($.trim(parts[i]) == signature) {
    						return;
    					} 
    				}
    				
    				// add signature
    				$('input.richtext-image-result', that.dialog).val(selectedSignatures == '' ? signature :  selectedSignatures + ", " + signature);
    			});
				
		
			}
			
			
		});
	
		o.dialogId = dialogId;
		o.inputID = inputID;
		o.callbackOnClose = callbackOnClose;
		o.alignment = alignment;
		o.category = category;
		return o;
	};
	
}());
