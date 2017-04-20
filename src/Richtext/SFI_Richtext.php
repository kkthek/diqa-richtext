<?php
namespace DIQA\Richtext;

if ( !defined( 'PF_VERSION' ) ) {
	die( '<b>Error:</b> <a href="https://www.mediawiki.org/wiki/Extension:Page_Forms">Page Forms Extension</a> is required.' );
}

/**
 * The FormsInput class for Richtext.
 * Richtext field input (powered by TinyMCE)
 * 
 * @author Kai Kuehn
 * @ingroup DIQArichtext
 */
class SFIRichtext extends \PFFormInput {

    protected $mUseWikieditor = false;

	/**
	 * Constructor.
	 *
	 * @param String $input_number
	 *		The number of the input in the form.
	 * @param String $cur_value
	 *		The current value of the input field.
	 * @param String $input_name
	 *		The name of the input.
	 * @param String $disabled
	 *		Is this input disabled?
	 * @param Array $other_args
	 *		An associative array of other parameters that were present in the
	 *		input definition.
	 */
	public function __construct( $input_number, $cur_value, $input_name, $disabled, $other_args ) {
		parent::__construct( $input_number, $cur_value, $input_name, $disabled, $other_args );
		
		// add JS data
		$this->addJsInitFunctionData( 'SFI_RICHTEXT_init', $this->setupJsInitAttribs() );
	}
	
	/**
	 * Returns the name of the input type this class handles: menuselect.
	 *
	 * This is the name to be used in the field definition for the "input type"
	 * parameter.
	 *
	 * @return String The name of the input type this class handles.
	 */
	public static function getName() {
		return 'richtext_without_image';
	}

	protected function setupJsInitAttribs() {
		$jsattribs = array();
		
		// build JS code from attributes array
		return \Xml::encodeJsVar( $jsattribs );
	}
	
	protected function getTextAreaAttributes() {
	    global $wgPageFormsTabIndex, $wgPageFormsFieldNum;
	
	    // Use a special ID for the free text field -
	    // this was originally done for FCKeditor, but maybe it's
	    // useful for other stuff too.
	    $input_id = $this->mInputName == 'pf_free_text' ? 'pf_free_text' : "input_$wgPageFormsFieldNum";
	
	    if ( $this->mUseWikieditor ) {
	        // load modules for all enabled features
	        WikiEditorHooks::editPageShowEditFormInitial( $this );
	        $className = 'wikieditor ';

	    } else {
	        $className = '';
	    }
	
	    $className .= ( $this->mIsMandatory ) ? 'mandatoryField' : 'createboxInput';
	
	    if ( array_key_exists( 'class', $this->mOtherArgs ) ) {
	        $className .= ' ' . $this->mOtherArgs['class'];
	    }
	
	    if ( array_key_exists( 'autogrow', $this->mOtherArgs ) ) {
	        $className .= ' autoGrow';
	    }
	
	    if ( array_key_exists( 'rows', $this->mOtherArgs ) ) {
	        $rows = $this->mOtherArgs['rows'];
	    } else {
	        $rows = 5;
	    }
	
	    $textarea_attrs = array(
	        'tabindex' => $wgPageFormsTabIndex,
	        'name' => $this->mInputName,
	        'id' => $input_id,
	        'class' => $className,
	        'rows' => $rows,
	    );
	
	    if ( array_key_exists( 'cols', $this->mOtherArgs ) ) {
	        $textarea_attrs['cols'] = $this->mOtherArgs['cols'];
	        // Needed to prevent CSS from overriding the manually-
	        // set width.
	        $textarea_attrs['style'] = 'width: auto';
	    } elseif ( array_key_exists( 'autogrow', $this->mOtherArgs ) ) {
	        // If 'autogrow' has been set, automatically set
	        // the number of columns - otherwise, the Javascript
	        // won't be able to know how many characters there
	        // are per line, and thus won't work.
	        $textarea_attrs['cols'] = 90;
	        $textarea_attrs['style'] = 'width: auto';
	    } else {
	        $textarea_attrs['cols'] = 90;
	        $textarea_attrs['style'] = 'width: 100%';
	    }
	
	    if ( $this->mIsDisabled ) {
	        $textarea_attrs['disabled'] = 'disabled';
	    }
	
	    if ( array_key_exists( 'maxlength', $this->mOtherArgs ) ) {
	        $maxlength = $this->mOtherArgs['maxlength'];
	        // For every actual character pressed (i.e., excluding
	        // things like the Shift key), reduce the string to its
	        // allowed length if it's exceeded that.
	        // This JS code is complicated so that it'll work
	        // correctly in IE - IE moves the cursor to the end
	        // whenever this.value is reset, so we'll make sure to
	        // do that only when we need to.
	        $maxLengthJSCheck = "if (window.event && window.event.keyCode < 48 && window.event.keyCode != 13) return; if (this.value.length > $maxlength) { this.value = this.value.substring(0, $maxlength); }";
	        $textarea_attrs['onKeyDown'] = $maxLengthJSCheck;
	        $textarea_attrs['onKeyUp'] = $maxLengthJSCheck;
	    }
	
	    if ( array_key_exists( 'placeholder', $this->mOtherArgs ) ) {
	        $textarea_attrs['placeholder'] = $this->mOtherArgs['placeholder'];
	    }
	
	    return $textarea_attrs;
	}

    /**
     * Returns the HTML code to be included in the output page for this input.
     *
     * Ideally this HTML code should provide a basic functionality even if the
     * browser is not Javascript capable. I.e. even without Javascript the user
     * should be able to input values.
     */
    public function getHtmlText() {
        $textarea_attrs = $this->getTextAreaAttributes();
        
        $text = \Html::element('textarea', $textarea_attrs, $this->mCurrentValue);
        $spanClass = 'inputSpan';
        if ($this->mIsMandatory) {
            $spanClass .= ' mandatoryFieldSpan';
        }
        $text = \Html::rawElement('span', array(
            'class' => $spanClass
        ), $text);
        
        return $text;
    }

	/**
	 * Returns the set of SMW property types which this input can
	 * handle, but for which it isn't the default input.
	 */
	public static function getOtherPropTypesHandled() {
		return array( '_str', '_txt' );
	}

	/**
	 * Returns the names of the resource modules this input type uses.
	 * 
	 * Returns the names of the modules as an array or - if there is only one 
	 * module - as a string.
	 * 
	 * @return null|string|array
	 */
	public function getResourceModuleNames() {
		return 'ext.semanticformsinputs.richtext';
	}

}
