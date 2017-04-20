<?php
namespace DIQA\Richtext;

use DIQA\Richtext\Contracts\ImageInterface;

class ImageInterfaceImpl implements ImageInterface {
	
	private static $INSTANCE = NULL;
	
	public static function getInstance() {
		if (is_null(self::$INSTANCE)) {
			self::$INSTANCE = new ImageInterfaceImpl();
		}
		return self::$INSTANCE;
	}
	
	public function findImages($searchString, $limit = self::MAX_LIMIT, $offset = 0) {
		$repo = \RepoGroup::singleton()->getLocalRepo();
		return $this->findFilesBySubstring($searchString, $limit);
		
	}
	
	public function getThumbnail($imageSignature) {
		$repo = \RepoGroup::singleton()->getLocalRepo();
		return $repo->findFile(\Title::newFromText($imageSignature, NS_FILE));
	}
	
	public function getImages(array $imageSignatures) {
		$repo = \RepoGroup::singleton()->getLocalRepo();
		return $repo->findFiles($imageSignatures);
	}
	
	public function getImageMetaData(array $imageSignatures) {
		$repo = \RepoGroup::singleton()->getLocalRepo();
		return $repo->findFiles($imageSignatures);
	}
	
	private function findFilesBySubstring( $prefix, $limit ) {
		$repo = \RepoGroup::singleton()->getLocalRepo();
		$selectOptions = [ 'ORDER BY' => 'img_name', 'LIMIT' => intval( $limit ) ];
	
		// Query database
		$prefix = strtolower($prefix);
		$dbr = $repo->getSlaveDB();
		$ext = ['jpg', 'jpeg', 'png', 'gif'];
		
		// select images containing $prefix in title and having a valid file extension or image-mimetype
		$cond = [
					'LOWER(CONVERT(img_name USING utf8)) LIKE \'%'.$dbr->strencode($prefix).'%\'',
					'(' . implode(' OR ', array_map(function($e) use ($dbr) { 
						return 'LOWER(CONVERT(img_name USING utf8)) LIKE \'%'.$dbr->strencode('.'.$e).'\'';
					}, $ext)) . ' OR img_major_mime = \'image\')'
					
				];
					
		$res = $dbr->select(
				'image',
				\LocalFile::selectFields(),
				 $cond,
				__METHOD__,
				$selectOptions
		);
	
		// Build file objects
		$files = [];
		foreach ( $res as $row ) {
			$files[] = $repo->newFileFromRow( $row );
		}
	
		return $files;
	}
	
}