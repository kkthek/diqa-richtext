/*
 * Richtext SFI
 * 
 * @author: Kai Kuehn
 */

/**
 * Init function which is called by SemanticForms when the form is loaded.
 * 
 * @param inputID
 *            ID of textarea element
 * @param attribs
 *            config attributes
 */
function SFI_RICHTEXT_init(inputID, attribs) {
		
	// initialize richtext editor
	var basePath = wgScriptPath + '/extensions/Richtext/libs/tinymce-4.4.0/';
	var withimage = $('#' + inputID).attr("withimage") == "true";
	var alignment = $('#' + inputID).attr("alignment");
	var category = $('#' + inputID).attr("category");
	var menu = withimage ? 'undo redo | bold italic underline strikethrough | bullist numlist indent outdent | table addImage addLink addCategory | fullscreen' 
			: 'undo redo | bold italic underline strikethrough | bullist numlist indent outdent fullscreen';
	var ed = $('#' + inputID)
			.tinymce(
					{
						language: wgUserLanguage,
						language_url : basePath+'/langs/'+wgUserLanguage+'.js', 
						forced_root_block : 'div',

						theme_url : basePath + 'themes/modern/theme.min.js',
						skin_url : basePath + 'skins/lightgray',
						external_plugins : {
							"fullscreen" : basePath
									+ 'plugins/fullscreen/plugin.min.js',
							"table" : basePath
									+ 'plugins/table/plugin.min.js',
							"paste" : basePath
									+ 'plugins/paste/plugin.min.js'

						},
						menu : {

							edit : {
								title : 'Edit',
								items : 'undo redo | cut copy paste pastetext'
							},

							format : {
								title : 'Format',
								items : 'bold italic underline strikethrough | formats | removeformat'
							}

						},
						toolbar : [
						           	menu
								 ],

						style_formats: [
						    {title: 'Header 1', format: 'h1'},
						    {title: 'Header 2', format: 'h2'},
						    {title: 'Header 3', format: 'h3'},
						    {title: 'Header 4', format: 'h4'},
						    {title: 'Header 5', format: 'h5'},
						    {title: 'Header 6', format: 'h6'},
						    {title: 'Paragraph', format: 'p'}
						],

						resize : "both",

						// make sure, src-URIs of images are not modified
						relative_urls : false,
						remove_script_host : true,

						setup : function(editor) {

							editor.on('FullscreenStateChanged', function(e) {
								$('nav').toggle();
							});

							editor.on('init', function(args) {
								$('table div.placeholder img', editor.dom.doc).click(new DIQARICHTEXT.ImageEditor(editor).editImageConfirm);
					        });
														
							editor.addButton('addImage', {
						            title : 'Add image',
						            image : basePath + 'skins/lightgray/img/object.gif',
						            onclick : function(event) {
						            	
						            	var selectionNode = $(editor.selection.getNode());
						            	if (selectionNode.prop("tagName").toLowerCase() == 'td' || selectionNode.hasClass('placeholder')) {
						            		event.target = selectionNode;
						            		new DIQARICHTEXT.ImageEditor(editor).editImageDialog(event, category);
						            	} else {
						            		new DIQARICHTEXT.ImageEditor(editor).addImagesDialog(alignment, category);
						            	}
						            }
						        });
							
							var onEditLink = function(event) {
				            	
				            	var clickHandler = arguments.callee;
				            	var node = $(editor.selection.getNode());
				            						            
				            	var dialog = new DIQARICHTEXT.Dialogs.WikiPagesDialog('richtext-edit-links', node, function(selectedTab, data) {
				            		
				            		var cell = $(editor.selection.getNode());
				            		
				            		var anchor = null;
				            		switch(selectedTab) {
				            		case 0:
				            			anchor = $('<a href="'+data.fullTitle+'" title="'+data.title+'" class="diqa-richtext">'+data.title+'</a>');
				            			
				            			break;
				            		case 1:
				            			anchor = $('<a target="_blank" rel="nofollow noreferrer noopener" class="external text diqa-richtext" href="'+data.url+'">'+data.label+'</a>');
				            		
				            			break;
				            		}
				            		
				            		var editExisting = cell.hasClass('diqa-richtext');
				            		if (editExisting) {
				            			var parent = cell.parent();
				            			parent.find('a').remove();
				            			parent.append(anchor);
				            		} else {
				            			cell.append(anchor);
				            		}
				            		anchor.css({'cursor' : 'pointer'});
				            		anchor.click(clickHandler);	
				            		
				            	});
				            	dialog.openDialog();
				            };
				            
							editor.addButton('addLink', {
					            title : 'Add link',
					            image : basePath + 'skins/lightgray/img/anchor.gif',
					            onclick : onEditLink
					        });
							
							editor.addButton('addCategory', {
					            title : 'Add category',
					            image : basePath + 'skins/lightgray/img/category.png',
					            onclick : function(event) {
					            	
					            	var dialog = new DIQARICHTEXT.Dialogs.CategoryPickerDialog('richtext-edit-category', function(label, fullTitle) {
					            		var cell = $(editor.selection.getNode());
					    				var span = $('<span>');
					    				var categoryKeyword = mw.config.get('wgFormattedNamespaces')[14];
					    				span.html("[["+categoryKeyword+":"+fullTitle+"|"+label+"]]");
					    				cell.append(span);
					            	});
					            	dialog.openDialog();
					            }
					        });
						

							editor.on('init', function(args) {
								//alert('init occured');
								$("#wpSaveAndContinue").removeClass('sf-save_and_continue-changed');
								$("#wpSaveAndContinue").removeAttr("disabled");
								
					        });
							editor.on('keyup', function(args) {
								//alert('keyup occured');
								$("#wpSaveAndContinue").addClass('sf-save_and_continue-changed');
								$("#wpSaveAndContinue").removeAttr("disabled");
					        });
							editor.on('setcontent', function(args) {
								//alert('setcontent occured');
								$("#wpSaveAndContinue").addClass('sf-save_and_continue-changed');
								$("#wpSaveAndContinue").removeAttr("disabled");
								$('a.diqa-richtext', this.getBody()).click(onEditLink);
					        });
							editor.on('change', function(args) {
								//alert('change occured');
								$("#wpSaveAndContinue").addClass('sf-save_and_continue-changed');
								$("#wpSaveAndContinue").removeAttr("disabled");
					        });
							
							
							
				            
						}

					});
	
	
	


}
