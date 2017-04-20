<?php
namespace DIQA\Richtext;

use DIQA\Util\Data\TreeNode;
/**
 * CategoryTreeBuilder
 * 
 * @author Kai
 *
 */
class CategoryTreeBuilder {
	
	/**
	 * Returns a TreeNode represenation of all categories.
	 * 
	 * @return \DIQA\Import\Specials\TreeNode
	 */
	public static function getCategoryTree() {
		$categories = self::getAllCategoryTuples();

		// separate single-category root nodes
		$rootNodes = $categories[NULL];
		unset($categories[NULL]);
		
		// calculate other root nodes from dependant nodes
		$dependantRootNodes = self::getRootNodes( $categories );
		
		// and merge both type of root nodes in one array
		$categories[NULL] = array_merge($dependantRootNodes, $rootNodes);
		
		// build tree
		$root = new TreeNode();
		self::_getCategoryTree(NULL, $root, $categories);
		return $root;
	}
	
	/**
	 * Get all nodes with no parent.
	 * 
	 * @param array $categories All child/parent node tuples
	 * @return array Root nodes
	 */
	private static function getRootNodes($categories) {
		$nodes = array_keys($categories);
		foreach($categories as $super => $subs) {
			$nodes = array_diff($nodes, $subs);
		}
		return $nodes;
	}
	
	/**
	 * Builds tree recursively.
	 * 
	 * @param string $key Node key
	 * @param TreeNode $treeNode Current treenode
	 * @param array $categories All child/parent tuples
	 */
	private static function _getCategoryTree($key, & $treeNode, & $categories) {
		if (!isset($categories[$key])) {
			return;
		}
		foreach($categories[$key] as $child) {
			$newNode = new TreeNode($child, $child);
			$treeNode->addChild($newNode);
			self::_getCategoryTree($child, $newNode, $categories);
		}
	}
	
	/**
	 * Returns all child/parent tuples of categories
	 * Including child/NULL for root categories with no subcategory.
	 * 
	 * @return multitype:multitype:NULL
	 */
	private static function getAllCategoryTuples() {
		$db = wfGetDB ( DB_SLAVE );
		
		$categorylinks = $db->tableName ( 'categorylinks' );
		$page = $db->tableName ( 'page' );
		
		// get all categories
		$query_subs = "SELECT subCategory.page_title AS sub, cl.cl_to AS super
		FROM $page subCategory 
		JOIN $categorylinks cl ON cl.cl_from = subCategory.page_id
		WHERE subCategory.page_namespace = ".NS_CATEGORY;
		
		$query_root = "SELECT rootCategory.page_title AS sub, NULL AS super 
		FROM $page rootCategory 
		
		WHERE NOT EXISTS ( SELECT * FROM $categorylinks cl WHERE cl.cl_to = rootCategory.page_title )
		AND rootCategory.page_namespace = ".NS_CATEGORY;
		
		$res = $db->query ( "($query_subs) UNION ($query_root)" );
		// rewrite result as array
		$results = array ();
		
		
		if ($db->numRows ( $res ) > 0) {
			while ( $row = $db->fetchObject ( $res ) ) {
				if (isset($results[$row->super])) {
					$results[$row->super][] = $row->sub;
				} else {
					$results[$row->super] = [$row->sub];
				}
			}
		}
		$db->freeResult ( $res );
		
		return $results;
	}
}

