<?php
namespace DIQA\Richtext\Contracts;

interface ImageInterface {

	const MAX_LIMIT = 100;

	/**
	 * Find images which match a given searchstring.
	 *
	 * @param string $searchString
	 * @param number $limit
	 * @param number $offset
	 *
	 * @return array of stdClass
	 */
	public function findImages($searchString, $limit = self::MAX_LIMIT, $offset = 0); // NOSONAR

	/**
	 * Returns thumbnail version of image.
	 *
	 * @param string $imageSignature
	 *
	 * @return string image path
	 */
	public function getThumbnail($imageSignature);

	/**
	 * Return images for the passed imageSignatures
	 *
	 * @param array $imageSignatures
	 *
	 * @return array mapping filenames to array [ 'tmpFile' => $tmpFile, 'metadata' => $metadata ]
	 */
	public function getImages(array $imageSignatures);

	/**
	 * Returns image metadata.
	 *
	 * @param array $imageSignatures
	 *
	 * @return stdClass
	 */
	public function getImageMetaData(array $imageSignatures);



	

}