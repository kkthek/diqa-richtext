/**
 * WikiPages Dialog
 * 
 * @author: Kai Kuehn
 * @ingroup DIQA Richtext
 */

(function() { 
	
	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	window.DIQARICHTEXT.Dialogs = window.DIQARICHTEXT.Dialogs || {};
	
	DIQARICHTEXT.Dialogs.WikiPagesDialog = function(dialogId, callbackOnClose) {
		var that = {};

		that.dialog = null;
		that.dialogId = dialogId;
		that.callbackOnClose = callbackOnClose;

		/**
		 * Initializes the dialog's controls
		 */
		that.initialize = function() {

			that.addButtonListeners();
			
			$( "#richtext-edit-links input#wiki-pages-search-field" ).autocomplete({
		        source: function( request, response ) {
		        			
		            $.ajax({
		              type : "GET",
					  url : mw.util.wikiScript('api'),
		              dataType: "jsonp",
		              data: {
		            	  action: "diqa_autocomplete",
		            	  format: "json",
		            	  substr: request.term,
		            	  property: "Titel"
		            	  
		              },
		              success: function( data ) {
		                response( $.map(data.sfautocomplete, function(obj,i) { 
		                	return { label : obj.title, value: obj.title, data: { id: obj.id, ns: obj.ns, fullTitle: obj.data.fullTitle, category: obj.data.category } };
		                }));
		              }
		            });
		          },
	              select: function( event, ui ) {
	                  that.selectedItem = ui.item.data;
	              }
		    
		      });
		
		};
		
		
		
		that.addButtonListeners = function() {
			
			/**
			 * 'Add image' button
			 */
			$("button.btn", that.dialog).on(
					"click",
					function(event) {
						var action = $(event.target).attr("action");
						if (action == "add-link") {
							if (that.callbackOnClose) {
								var title = $( "#richtext-edit-links input#wiki-pages-search-field" ).val();
								that.callbackOnClose(title, that.selectedItem.fullTitle);
							}
							that.dialog.modal('hide');
						}
					});
    
		   
		};
    
		
		/**
		 * Opens the dialog
		 */
		that.openDialog = function() {
			
			if ($('#'+that.dialogId).length == 0) {
				
				// first opening: request dialog, then open
				new window.DIQARICHTEXT.Ajax().getWikiPagesDialog(that.dialogId, function(jsondata) {
					var html = jsondata.diqarichtext.html;
					$('body').append($(html));
					
					that.dialog = $('#'+that.dialogId).modal({
						"backdrop" : "static",
						"keyboard" : true,
						"show" : true

					}).on('shown.bs.modal', function (e) {
						
					});
					that.initialize();
					
					
					
					
				},  function(jsondata){
					alert('Error');
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