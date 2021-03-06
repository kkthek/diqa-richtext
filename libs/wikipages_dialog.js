/**
 * WikiPages Dialog
 * 
 * @author: Kai Kuehn
 * @ingroup DIQA Richtext
 */

(function() { 
	
	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	window.DIQARICHTEXT.Dialogs = window.DIQARICHTEXT.Dialogs || {};
	
	DIQARICHTEXT.Dialogs.WikiPagesDialog = function(dialogId, formdata, callbackOnClose) {
		var that = {};

		that.dialog = null;
		that.dialogId = dialogId;
		that.formdata = formdata;
		that.callbackOnClose = callbackOnClose;

		/**
		 * Initializes the dialog's controls
		 */
		that.initialize = function() {

			that.addButtonListeners();
			$('#tabs').tabs();
			that.presetInputs();
			
			$( "#richtext-edit-links input#wiki-pages-search-field" ).autocomplete({
		        source: function( request, response ) {
		        	
		        	var data = {
			            	  action: "diqa_autocomplete",
			            	  format: "json",
			            	  substr: request.term,
			            	  property: "Titel",
			            	  
			        };
		        	
		        	if (DIQA.RICHTEXT.linkPickerCategory) {
		        		data['category'] = DIQA.RICHTEXT.linkPickerCategory;
		        	}
		        	
		            $.ajax({
		              type : "GET",
					  url : mw.util.wikiScript('api'),
		              dataType: "jsonp",
		              data: data,
		              success: function( data ) {
		                response( $.map(data.pfautocomplete, function(obj,i) { 
		                	return { label : obj.title, value: obj.title, 
		                		data: { id: obj.id, ns: obj.ns, fullTitle: obj.data.fullTitle, category: obj.data.category, file: obj.data.file } };
		                }));
		              }
		            });
		          },
	              select: function( event, ui ) {
	            	  if (ui.item.data.file.href != null) {
	            		  $('input#wiki-pages-fulltitle-field').val(ui.item.data.file.href);
	            		  $('input#wiki-pages-type-field').val('file');
	            		  $('input#wiki-pages-file-extension-field').val(ui.item.data.file.extension);
	            	  } else {
	            		  $('input#wiki-pages-fulltitle-field').val(ui.item.data.fullTitle);
	            		  $('input#wiki-pages-type-field').val('');
	            		  $('input#wiki-pages-file-extension-field').val('');
	            		  
	            	  }
	              }
		    
		      });
		
		};
		
		that.presetInputs = function() {
			// preset dialog inputs if it is a link
			if (that.formdata.get(0).tagName == 'A') {
        		// edit link
				if (that.formdata.hasClass('external')) {
					$('input#wiki-pages-url-field').val(that.formdata.attr('href'));
					$('input#wiki-pages-label-field').val(that.formdata.html());
					$( "#tabs" ).tabs({ active: 1 });
				} else {
					if (that.formdata.hasClass('file')) {
						$('input#wiki-pages-search-field').val(that.formdata.attr('title'));
						$('input#wiki-pages-fulltitle-field').val(that.formdata.attr('href'));
						$('input#wiki-pages-file-extension-field').val(that.formdata.attr('extension'));
						$('input#wiki-pages-type-field').val('file');
					} else {
						$('input#wiki-pages-search-field').val(that.formdata.attr('title'));
						$('input#wiki-pages-fulltitle-field').val(that.formdata.attr('href'));
						$('input#wiki-pages-file-extension-field').val('');
						$('input#wiki-pages-type-field').val('');
					}
					$( "#tabs" ).tabs({ active: 0 });
				}
        	} else {
        		$('input#wiki-pages-url-field').val('');
				$('input#wiki-pages-label-field').val('');
				$('input#wiki-pages-search-field').val('');
				$( "#tabs" ).tabs({ active: 0 });
        	}
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
							
							var selectedTab = $("#tabs").tabs('option', 'active');
							switch(selectedTab) {
							case 0: 
								// insert File link
								if (that.callbackOnClose) {
									var title = $( "#richtext-edit-links input#wiki-pages-search-field" ).val();
									var fullTitle = $( "#richtext-edit-links input#wiki-pages-fulltitle-field" ).val();
									var type = $( "#richtext-edit-links input#wiki-pages-type-field" ).val();
									var fileExtension = $( "#richtext-edit-links input#wiki-pages-file-extension-field" ).val();
									that.callbackOnClose(selectedTab, { title: title, fullTitle: fullTitle, type: type, fileExtension: fileExtension });
								}
								break;
							case 1:
								// insert external link
								if (that.callbackOnClose) {
									var url = $( "#richtext-edit-links input#wiki-pages-url-field" ).val();
									var label = $( "#richtext-edit-links input#wiki-pages-label-field" ).val();
									
									// if no label given than use URL instead
									if (label == '') {
										label = url;
									}
									// check if schema is present add add HTTP if not
									if (url.toLowerCase().match(/^[a-z]+:\/\//) == null) {
										url = 'http://' + url;
									}
											
									that.callbackOnClose(selectedTab, { url: url, label : label });
								}
								break;
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
				that.presetInputs();
			}

			return that.dialog;
		};

		return that;
	};
  
	
	
}());