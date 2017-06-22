<?php
use DIQA\Richtext\SFIRichtext;
use DIQA\Richtext\SFIRichtextWithImage;
/**
 * Additional input types for [http://www.mediawiki.org/wiki/Extension:SemanticForms Semantic Forms].
 *
 * @defgroup DIQA Richtext
 *
 * @author Kai Kühn
 *
 * @version 0.1
 */

/**
 * The main file of the DIQA Richtext extension
 *
 * @file
 * @ingroup DIQA
 */

if ( !defined( 'MEDIAWIKI' ) ) {
	die( 'This file is part of a MediaWiki extension, it is not a valid entry point.' );
}

define( 'DIQA_RICHTEXT_VERSION', '0.1' );

global $wgVersion;
global $wgExtensionCredits;
global $wgExtensionMessagesFiles;
global $wgHooks;
global $wgResourceModules;
global $wgExtensionFunctions;

// register extension
$wgExtensionCredits[ 'diqa' ][] = array(
	'path' => __FILE__,
	'name' => 'Richtext',
	'author' => array( 'DIQA Projektmanagement GmbH' ),
	'license-name' => 'GPL-2.0+',
	'url' => 'http://www.diqa-pm.com',
	'descriptionmsg' => 'diqa-richtext-desc',
	'version' => DIQA_RICHTEXT_VERSION,
);

$dir = dirname( __FILE__ );

$wgExtensionMessagesFiles['DIQArichtext'] = $dir . '/DIQArichtext.i18n.php';
$wgHooks['ParserFirstCallInit'][] = 'wfDIQArichtextSetup';
$wgExtensionFunctions[] = 'wfDIQArichtextExtension';

$wgResourceModules['ext.semanticformsinputs.richtext'] = array(
		'localBasePath' => $dir,
		'remoteExtPath' => 'Richtext',
		'scripts' => array(
				'libs/category-picker-dialog.js',
				'libs/jquery-ui/jquery-ui-1.9.2.custom.min.js',
				'libs/fancytree/jquery.fancytree-all.js',
				'libs/bootbox.min.js',
				'libs/tinymce-4.6.4/jquery.tinymce.min.js',
				'libs/tinymce-4.6.4/tinymce.min.js',
				'libs/image_ajax.js',
				'libs/image_dialog.js',
				'libs/image_multidialog.js',
				'libs/util.js',
				'libs/richtext.js',
				'libs/wikipages_dialog.js',
		),
		'styles' => ['skins/richtext.css',
					 'libs/fancytree/skin-win8/ui.fancytree.min.css',
					 'skins/jquery-ui-1.9.2.custom.min.css' 
		],
		'dependencies' => ['jquery.tablesorter', 'ext.pageforms.main', 'ext.bootstrap.styles', 'ext.bootstrap.scripts' ]
);


$GLOBALS['wgAPIModules']['diqarichtext'] = 'DIQA\Richtext\RichtextAjaxAPI';

/**
 * Registers the input types with Semantic Forms.
 */
function wfDIQArichtextSetup() {
	global $wgPageFormsFormPrinter;

    $wgPageFormsFormPrinter->registerInputType( 'DIQA\Richtext\SFIRichtext' );
    $wgPageFormsFormPrinter->registerInputType( 'DIQA\Richtext\SFIRichtextWithImage' );
    
	return true;
}

function wfDIQArichtextExtension() {
	global $wgSpecialPages;
	$wgSpecialPages['Upload'] = array('DIQA\Richtext\SpecialUploadRichtext');
	
	global $wgRequest, $wgOut;
	if (!is_null($wgRequest->getVal('usedInIframe'))) {
		$wgOut->addInlineStyle('#mw-navigation {
			    display: none !important;
			}');
	}
	
	return true;
}
