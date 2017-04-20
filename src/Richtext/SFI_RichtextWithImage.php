<?php
namespace DIQA\Richtext;

class SFIRichtextWithImage extends SFIRichtext {
	
	public static function getName() {
		return 'richtext';
	}
	
	protected function getTextAreaAttributes() {
		$attrs = parent::getTextAreaAttributes();
		
		$attrs['withimage'] = "true";
		if (isset($this->mOtherArgs['alignment'])) {
			$attrs['alignment'] = $this->mOtherArgs['alignment'];
		}
		if (isset($this->mOtherArgs['category'])) {
			$attrs['category'] = $this->mOtherArgs['category'];
		}
		return $attrs;
	}
}