<?php
namespace DIQA\Richtext;

/**
 * Overwrites Special:Upload to indicate it is used in an iframe.
 * 
 * @author Kai
 *
 */
class SpecialUploadRichtext extends \SpecialUpload {
	
	public function __construct( $request = null ) {
		parent::__construct( 'Upload', 'upload' );
	}
	
	public function setHeaders() {
		parent::setHeaders();
		if (!is_null($this->getRequest()->getVal('usedInIframe'))) {
			$out = $this->getOutput();
			$out->addModuleStyles( [
					'ext.semanticformsinputs.richtext.upload',
					] );
		}
	}
	
	protected function getUploadForm( $message = '', $sessionKey = '', $hideIgnoreWarning = false ) {
		$form = parent::getUploadForm($message, $sessionKey, $hideIgnoreWarning);
		if (!is_null($this->getRequest()->getVal('usedInIframe'))) {
			$form->addHiddenField('usedInIframe', 'true');
		}
		return $form;
	}
	
	protected function processUpload() {
		parent::processUpload();
		if (!is_null($this->getRequest()->getVal('usedInIframe'))) {
			$this->getOutput()->redirect( $this->mLocalFile->getTitle()->getFullURL() . '?usedInIframe=true' );
		}
	}
	

	
}