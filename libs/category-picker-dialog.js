/**
 * Category-Picker Dialog
 * 
 * @author: Kai Kuehn
 * @ingroup DIQA Richtext
 */

(function() { 
	
	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	window.DIQARICHTEXT.Dialogs = window.DIQARICHTEXT.Dialogs || {};
	
	DIQARICHTEXT.Dialogs.CategoryPickerDialog = function(dialogId, callbackOnClose) {
		var that = {};

		that.dialog = null;
		that.dialogId = dialogId;
		that.callbackOnClose = callbackOnClose;

		/**
		 * Initializes the dialog's controls
		 */
		that.initialize = function() {

			that.addButtonListeners();
			
			$(function() {
				
				// initialize fancytree and load it via ajax
				$("#category-tree").fancytree({ 
					 extensions: ["filter"],

					 source: { 
						 url: mw.util.wikiScript('api') + '?action=diqarichtext&method=getCategoryTree&format=json'
					 },
					 postProcess: function(event, data) {
						  // assuming the ajax response contains a list of child nodes:
						  data.result =  $.parseJSON(data.response.diqarichtext.json).children  ;
					},
					loadChildren: function() {
						// expand tree
						 var tree = $("#category-tree").fancytree("getTree");
						 
						 tree.visit(function(node){
							    node.setExpanded(true);
						 });
					},
					filter: {
				        autoApply: true,   // Re-apply last filter if lazy data is loaded
				        autoExpand: false, // Expand all branches that contain matches while filtered
				        counter: true,     // Show a badge with number of matching child nodes near parent icons
				        fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
				        hideExpandedCounter: true,  // Hide counter badge if parent is expanded
				        hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
				        highlight: true,   // Highlight matches by wrapping inside <mark> tags
				        leavesOnly: false, // Match end nodes only
				        nodata: true,      // Display a 'no data' status node if result is empty
				        mode: "dimm"       // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
				      },
					 toggleEffect: false, // REQUIRED! incompatibility with jQuery.ui used with Mediawiki
					 click: function(event, data) {
						    var node = data.node,
						        // Only for click and dblclick events:
						        // 'title' | 'prefix' | 'expander' | 'checkbox' | 'icon'
						        targetType = data.targetType;

						    // store selected node in an input field
						    $('input[name=diqa_categorytree_selectednode]').val(node.key);
						  },
				}); 
				
				
			});
		};
		
		/**
		 * Filter tree nodes 
		 * 
		 * @param searchterm
		 */
		that.search = function(searchterm) { 
			 var tree = $("#category-tree").fancytree("getTree");
			 tree.filterNodes(function(node) {
				 return node.title.toLowerCase().indexOf(searchterm.toLowerCase()) !== -1;
			 }, { autoApply: true,   // Re-apply last filter if lazy data is loaded
			        autoExpand: false, // Expand all branches that contain matches while filtered
			        counter: true,     // Show a badge with number of matching child nodes near parent icons
			        fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
			        hideExpandedCounter: true,  // Hide counter badge if parent is expanded
			        hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
			        highlight: true,   // Highlight matches by wrapping inside <mark> tags
			        leavesOnly: false, // Match end nodes only
			        nodata: true,      // Display a 'no data' status node if result is empty
			        mode: "dimm" });
		};
		
		
		/**
		 * Add buttons 
		 */
		that.addButtonListeners = function() {
			
			var categoryPickerHandle;
			$('input#category-picker-search').keyup(function(event) { 
				if (categoryPickerHandle) {
					clearTimeout(categoryPickerHandle);
				}
				var target = $(event.target);
				categoryPickerHandle = setTimeout(function() {
					that.search(target.val());
				}, 500);
			});
			
			/**
			 * OK button
			 */
			$("button.btn", that.dialog).on(
					"click",
					function(event) {
						var action = $(event.target).attr("action");
						if (action == "add-link") {
							if (that.callbackOnClose) {
								var selectedNode = $('input[name=diqa_categorytree_selectednode]').val();
								
								that.callbackOnClose(selectedNode, selectedNode);
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
				new window.DIQARICHTEXT.Ajax().getCategoryPickerDialog(that.dialogId, function(jsondata) {
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