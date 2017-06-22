<?php
namespace DIQA\Richtext;

use ApiBase;
use Philo\Blade\Blade;
use SMW\DIWikiPage;

class RichtextAjaxAPI extends ApiBase {

	private $blade;
	private $logger;

	public function __construct($query, $moduleName) {

		parent::__construct ( $query, $moduleName );
		$views = __DIR__ . '/../../views';
		$cache = __DIR__ . '/../../cache';

		$this->blade = new Blade ( $views, $cache );
	}

	public function execute() {
		$params = $this->extractRequestParams ();

		switch ($params ['method']) {
			case 'getWikiPagesDialog' :
				$this->getWikiPagesDialog ( $params );
				break;
			case 'getCategoryPickerDialog':
				$this->getCategoryPickerDialog ( $params );
				break;
			case 'getDialog' :
				$this->getDialog ( $params );
				break;
			case 'getUploadDialog' :
				$this->getUploadDialog ( $params );
				break;
			case 'findImages' :
				$this->findImages ( $params );
				break;
			case 'getThumbnail' :
				$this->getThumbnail ( $params );
				break;
			case 'createImagePage' :
				$this->createImagePageForRichtext ( $params );
				break;
			case 'createImagePagesForRichtext' :
				$this->createImagePagesForRichtext ( $params );
				break;
			case 'getCategoryTree' :
				$this->getCategoryTree ( $params );
				break;
		}
	}
	
	private function getCategoryTree(array $params) {
		
		$categoryTree = CategoryTreeBuilder::getCategoryTree();
		$formattedData = new \stdClass ();
		$formattedData->json = json_encode($categoryTree);
		$result = $this->getResult ();
		
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}
	
	
	private function getCategoryPickerDialog(array $params) {
	
		$html = $this->blade->view ()->make ( "dialogs.select-category", array (
	
				'id' => $params ['id']
	
		) )->render ();
		$formattedData = new \stdClass ();
		$formattedData->html = $html;
		$result = $this->getResult ();
	
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}
	
	private function getWikiPagesDialog(array $params) {
		
		$html = $this->blade->view ()->make ( "dialogs.select-wiki-page", array (
				
				'id' => $params ['id']
	
		) )->render ();
		$formattedData = new \stdClass ();
		$formattedData->html = $html;
		$result = $this->getResult ();
	
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}
	
	/**
	 */
	private function getDialog(array $params) {
        if ($params['wikipage'] != '')
        {
            $images = [wfFindFile(\Title::newFromText($params['wikipage']))];
           
        }
        else
        {
            $imageInterface = ImageInterfaceImpl::getInstance();
            $images = $imageInterface->findImages($params['substr']);
        }

        $signature = ($params ['signature'] != '') ? $params ['signature'] : '';

		$html = $this->blade->view ()->make ( "dialogs.select-image", array (
				'rows' => $images ,
				'id' => $params ['id'],
		        'signature' => $signature,
		    
		) )->render ();
		$formattedData = new \stdClass ();
		$formattedData->html = $html;
		$result = $this->getResult ();
		
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}
	
	private function getUploadDialog(array $params) {
		
		global $wgScriptPath;
		
		$html = $this->blade->view ()->make ( "dialogs.upload-image", array (
				
				'id' => 'richtext-upload-dialog',
				'wgScriptPath' => $wgScriptPath,
	
		) )->render ();
		$formattedData = new \stdClass ();
		$formattedData->html = $html;
		$result = $this->getResult ();
	
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}

	private function findImages(array $params) {
		$imageInterface = ImageInterfaceImpl::getInstance();
		$images = $imageInterface->findImages ( $params ['substr'] );

		$html = $this->blade->view ()->make ( "dialogs.select-image-list", array (
				'rows' => $images
		) )->render ();
		$formattedData = new \stdClass ();
		$formattedData->html = $html;
		$result = $this->getResult ();
		
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}

	private function getThumbnail(array $params) {
		$imageInterface = ImageInterfaceImpl::getInstance();
		$file = $imageInterface->getThumbnail ( $params ['signature'] );

		$thumbnails = $file->getThumbnails();
		$html = $file->getThumbUrl(self::getPreferredThumbnail($thumbnails, ['320px', '180px', '800px', '120px']));
		$ext = $file->getExtension();
		$formattedData = new \stdClass ();
		$formattedData->html = $html;
		$formattedData->ext = $ext;
		$result = $this->getResult ();
	
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}

	private function createImagePageForRichtext($params) {
		$imageInterface = ImageInterfaceImpl::getInstance();
		$imageFiles = $imageInterface->getImages ( [ $params ['signature'] ] );
		$category = $params['category'];

		if ($category == '') {
			$category = 'Bild';
		}


		$html = $this->blade->view ()->make ( "partials.image-table-content", array (
				'im' => reset($imageFiles),
				'category' => $category
		) )->render ();

		$formattedData = new \stdClass ();
		$formattedData->html = $html;
		$result = $this->getResult ();
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}
	
	private function createImagePagesForRichtext(array $params) {
		$signatures = explode(",", $params ['signatures']);
		$signatures = array_map(function($e) { return trim($e); }, $signatures);

		$alignment = $params['alignment'];
		$category = $params['category'];

		if ($alignment == '') {
			$alignment = 'horizontal';
		}

		if ($category == '') {
			$category = 'Inventarblatt';
		}

		// create HTML to include in Richtext
		$imageInterface = ImageInterfaceImpl::getInstance();
		$images = $imageInterface->getImages ( $signatures );

		$html = $this->blade->view ()->make ( "partials.image-table-$alignment", array (
				'imageFiles' => $images,
				'category' => $category
		) )->render ();


		$formattedData = new \stdClass ();
		$formattedData->html = $html;

		$result = $this->getResult ();
		
		$result->addValue ( null, $this->getModuleName (), $formattedData );
	}

	protected function getAllowedParams() {
		return array (
				'id' => null,
				'substr' => null,
				'wikipage' => null,
				'signature' => null,
				'signatures' => null,
				'alignment' => null,
				'category' => null,
				'method' => null
		);
	}

	protected function getParamDescription() {
		return array (
				'substr' => 'Search substring'
		);
	}

	protected function getDescription() {
		return 'RichtextAjaxAPI';
	}

	protected function getExamples() {
		return array (
				'api.php?action=diqarichtext&substr=te'
		);
	}

	public function getVersion() {
		return __CLASS__ . ': $Id$';
	}
	
	private static function getPreferredThumbnail($thumbNailSizes, $preferredSizes) {
		foreach($preferredSizes as $size) {
			foreach($thumbNailSizes as $thumbSize) {
				if (strpos($thumbSize, $size) === 0) {
					return $thumbSize;
				}
			}
		}
		return reset($thumbSize);
	}
}