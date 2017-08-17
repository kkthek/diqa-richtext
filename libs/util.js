(function($) {

	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	DIQARICHTEXT.Util = DIQARICHTEXT.Util || {};

	DIQARICHTEXT.Util.confirm = function(message, buttons) {
		bootbox.setLocale('de');
		bootbox.dialog({
				size: 'small',
				message: message,
				buttons: buttons
			});
	};
	
	/**
	 * Extracts signature from file path.
	 * 
	 * @param placeholder image path
	 * @return string
	 */
	DIQARICHTEXT.Util.getSignature = function(placeholder) {
		var image = $(placeholder).find('img');
		var src = $(image).prop('src');
		if (!src) return null;
		var pathMatches = src.match(/(\/[^\/]*)*\/(.{1,})$/);
		if (!pathMatches) return null;
		var signature = pathMatches[2].replace(/\.jpe?g/i,'');
		return signature;
	};
	
	
	
	/**
	 * ImageEditor is used to add/edit images to the richtext editor.
	 * It adds/removes HTML to TinyMCE's DOM model.
	 * 
	 */
	DIQARICHTEXT.ImageEditor = function(editor) { 
		var that = {};
		that.editor = editor;
		
		that.editImageConfirm = function(event) {
			
			DIQARICHTEXT.Util.confirm("Wollen Sie das Bild löschen oder ersetzen?", {
			    
			    // For each key inside the buttons object...
			    
			"Löschen": {
				     
				      callback: function() {
				    	  var table = $(event.target).closest('table');
				    	  $(event.target).parent().remove();
				    	  var others = $('div.placeholder', table);
				    	  if (others.length == 0) {
				    		  table.remove();
				    	  }
				      }
			},
			
			"Ersetzen": {
					     
					  callback: function() {
						  that.editImageDialog(event);
					  }
			}
			    
			   
			});
			
			
		};
		
		that.editImageDialog = function(event, category) {
			var placeholder = $(event.target).closest('div');

            var signature = DIQARICHTEXT.Util.getSignature(placeholder);
            var wikipage = "Datei:"+signature;
            
			var richtextDialog = new DIQARICHTEXT.Dialogs.RichtextDialog('richtext-edit-images', wikipage, signature, category, '', function(jsondata) {
				var cell = $(that.editor.selection.getNode()).closest('div');
				cell.empty();
				cell.html(jsondata.diqarichtext.html);
        		
//        		$('div.placeholder img', that.editor.dom.doc).off("click");
//        		$('div.placeholder img', that.editor.dom.doc).click(new DIQARICHTEXT.ImageEditor(that.editor).editImageConfirm);
        	});
        	richtextDialog.openDialog();
        	
			
        	
		};
		
		that.addImagesDialog = function(alignment, category) {
			
        	var richtextDialog = new DIQARICHTEXT.Dialogs.RichtextDialogMultiSelect('richtext-add-images', '', alignment, category, function(jsondata) {
        		that.editor.focus();
        		that.editor.selection.setContent(jsondata.diqarichtext.html);
//        		$('div.placeholder img', that.editor.dom.doc).off("click");
//        		$('div.placeholder img', that.editor.dom.doc).click(new DIQARICHTEXT.ImageEditor(that.editor).editImageConfirm);
        	});
        	richtextDialog.setImagePreviewLoading(false);
        	richtextDialog.openDialog();
		};
		
		return that;
	};
	
	
	window.DIQARICHTEXT = window.DIQARICHTEXT || {};
	DIQARICHTEXT.Util = DIQARICHTEXT.Util || {};

	DIQARICHTEXT.Util.AjaxIndicator = function() {

		var that = {};
		/**
		 * Ajax indicator for the whole page
		 */
		that.setGlobalLoading = function(state) {
			
			if ($('.globalSpinner').length == 0) {
				$('body').append($('<div class="globalSpinner" style="display: none;"></div>'))
			}
			var wgScriptPath = mw.config.get('wgScriptPath');
			css = {
				'background-image' : 'url(' + wgScriptPath
						+ '/extensions/Richtext/skins/ajax-preview-loader.gif)',
				'background-repeat' : 'no-repeat',
				'background-position' : 'center'
			};

			if (state) {
				$('.globalSpinner').css(css).show();
			} else {
				$('.globalSpinner').css(css).hide();
			}
		};

		/**
		 * Returns current state of the Ajax indicator 
		 */
		that.getGlobalLoading = function() {
			if ($('.globalSpinner').length == 0) {
				return false;
			}
			return $('.globalSpinner').is(':visible') ;
		};

		return that;
	}

	
})(jQuery);

