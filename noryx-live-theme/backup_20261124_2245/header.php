<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package noryx
 */
if (get_post_meta(get_the_ID(), 'noryx_page_meta', true)) {
	$header_meta = get_post_meta(get_the_ID(), 'noryx_page_meta', true);
} else {
	$header_meta = array();
}

if (array_key_exists('page_header_disable', $header_meta)) {
	$page_header_disable = $header_meta['page_header_disable'];
} else {
	$page_header_disable = false;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Egypt Creative is Egypt's leading full-service digital marketing agency. We build brands, create meaningful digital experiences, and drive measurable business growth." />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Egypt Creative" />
	<meta property="og:title" content="Egypt Creative | Leading Digital Marketing & Creative Agency in Egypt" />
	<meta property="og:description" content="We help ambitious brands grow beyond borders with high-impact strategy, creativity, performance marketing, and measurable results." />
	<meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>" />
	<meta property="og:image" content="<?php echo esc_url(get_template_directory_uri() . '/assets/img/egypt_creative_white_logo.png'); ?>" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Egypt Creative | Leading Digital Marketing & Creative Agency" />
	<meta name="twitter:description" content="We help ambitious brands grow beyond borders with high-impact strategy, creativity, and measurable results." />
	<meta name="twitter:image" content="<?php echo esc_url(get_template_directory_uri() . '/assets/img/egypt_creative_white_logo.png'); ?>" />
	<link rel="canonical" href="<?php echo esc_url(home_url(add_query_arg([], $GLOBALS['wp']->request ?? ''))); ?>" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<!-- Structured Data: MarketingAgency & LocalBusiness -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "MarketingAgency",
		"name": "Egypt Creative",
		"alternateName": "ايجبت كرييتف",
		"url": "https://egyptcreative.com/",
		"logo": "<?php echo esc_url(get_template_directory_uri() . '/assets/img/egypt_creative_white_logo.png'); ?>",
		"description": "Egypt's leading full-service digital marketing agency. We build brands, create meaningful digital experiences, and drive measurable business growth.",
		"telephone": "+201044107134",
		"address": {
			"@type": "PostalAddress",
			"addressLocality": "Cairo",
			"addressCountry": "EG"
		},
		"sameAs": [
			"https://www.linkedin.com/company/egypt-creative-agency",
			"https://wa.me/201044107134"
		],
		"knowsLanguage": ["en", "ar"]
	}
	</script>
	<script>
		window.elementorFrontendConfig = window.elementorFrontendConfig || {
			environmentMode: { edit: false, wpPreview: false, isScriptDebug: false },
			experimentalFeatures: { container: false },
			isEditMode: "",
			isPreviewMode: "",
			isScriptDebug: false,
			is_rtl: <?php echo is_rtl() ? 'true' : 'false'; ?>,
			breakpoints: { xs: 0, sm: 480, md: 768, lg: 1025, xl: 1440, xxl: 1600 },
			responsive: { breakpoints: { mobile: { max: 767 }, tablet: { max: 1024 } } },
			version: "4.3.4",
			urls: { assets: "https://egyptcreative.com/wp-content/plugins/elementor/assets/", uploadUrl: "https://egyptcreative.com/wp-content/uploads/" },
			kit: { body_background_background: "classic" },
			settings: { page: [], editorPreferences: [] },
			i18n: {}
		};
	</script>
	<?php wp_head(); ?>
</head>

<body <?php body_class('ax-home'); ?>>
	<?php wp_body_open(); ?>

	<div id="page" class="site site_wrapper">
		<?php
		if (function_exists('noryx_preloader')) {
			noryx_preloader();
		}
		if (function_exists('noryx_scroll_up_btn')) {
			noryx_scroll_up_btn();
		}

		if ($page_header_disable != true) {
			noryx_Helper::noryx_header_template();
		}
		do_action('noryx_before_main_content');
		?>
		<div class="body-bg-1 bg-default">