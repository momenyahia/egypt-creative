<?php

/**
 *Google Font Load
 */
if (!function_exists('noryx_fonts_url')):

	function noryx_fonts_url()
	{
		$fonts_url = '';
		$font_families = array();
		$subsets = 'latin';

		if ('off' !== _x('on', 'Space Grotesk: on or off', 'noryx')) {
			$font_families[] = 'Space Grotesk:400,600,700';
		}
		if ('off' !== _x('on', 'Inter: on or off', 'noryx')) {
			$font_families[] = 'Inter:400,500,600,700,800';
		}
		if ('off' !== _x('on', 'Squada One: on or off', 'noryx')) {
			$font_families[] = 'Squada One:400';
		}
		if ('off' !== _x('on', 'Syne: on or off', 'noryx')) {
			$font_families[] = 'Syne:700,800';
		}

		if ($font_families) {
			$fonts_url = add_query_arg(
				array(
					'family' => urlencode(implode('|', $font_families)),
					'subset' => urlencode($subsets),
					'display' => 'swap',
				),
				'https://fonts.googleapis.com/css'
			);
		}

		return esc_url_raw($fonts_url);
	}
endif;


/**
 * Enqueue scripts and styles.
 */
function noryx_scripts()
{
	wp_enqueue_style('noryx-google-fonts', noryx_fonts_url(), array(), null);

	wp_enqueue_style('bootstrap', NORYX_CSS_PATH . '/bootstrap.min.css');
	wp_enqueue_style('e-animations', NORYX_CSS_PATH . '/animate.css');
	wp_enqueue_style('fontawesome', NORYX_CSS_PATH . '/fontawesome.css');
	wp_enqueue_style('magnific-popup', NORYX_CSS_PATH . '/magnific-popup.css');
	wp_enqueue_style('nice-select', NORYX_CSS_PATH . '/nice-select.css');
	wp_enqueue_style('swiper-noryx', NORYX_CSS_PATH . '/swiper.min.css');
	wp_enqueue_style('noryx-main', NORYX_CSS_PATH . '/style.css');

	$your_curnt_lang = apply_filters('wpml_current_language', NULL);
	if (is_rtl() && $your_curnt_lang != 'en') {
		wp_enqueue_style('noryx-rtl', NORYX_CSS_PATH . '/rtl.css');
	}

	wp_enqueue_style('noryx-style', get_stylesheet_uri(), array());

	wp_enqueue_script('bootstrap-bundle', NORYX_JS_PATH . '/bootstrap.bundle.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('swiper-bundle', NORYX_JS_PATH . '/swiper-bundle.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('wow', NORYX_JS_PATH . '/wow.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('appear', NORYX_JS_PATH . '/appear.js', array('jquery'), '1.0', true);
	wp_enqueue_script('SplitText', NORYX_JS_PATH . '/SplitText.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('split-type', NORYX_JS_PATH . '/split-type.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('gsap', NORYX_JS_PATH . '/gsap.min.js', array('jquery'), '1.0', true);
	// Pixi removed for high-speed performance: 120KB saved
	wp_enqueue_script('magnific-popup', NORYX_JS_PATH . '/jquery.magnific-popup.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('CustomEase', NORYX_JS_PATH . '/CustomEase.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('ScrollTrigger', NORYX_JS_PATH . '/ScrollTrigger.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('counterup', NORYX_JS_PATH . '/jquery.counterup.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('waypoints', NORYX_JS_PATH . '/waypoints.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('marquee', NORYX_JS_PATH . '/jquery.marquee.min.js', array('jquery'), '1.0', true);
	wp_enqueue_script('lenis', NORYX_JS_PATH . '/lenis.min.js', array('jquery'), '1.0', true);
	$theme_version = wp_get_theme()->get('Version') ?: '2.6.1';
	wp_enqueue_script('script', NORYX_JS_PATH . '/script.js', array('jquery', 'gsap', 'ScrollTrigger', 'SplitText', 'marquee', 'lenis', 'imagesloaded'), $theme_version, true);

	wp_localize_script(
		'script',
		'themeData',
		array(
			'themeUrl' => get_template_directory_uri(),
			'siteLogo' => function_exists('noryx_get_site_logo_url') ? noryx_get_site_logo_url() : '',
			'whatsappNumber' => '201044107134',
			'brandGreen' => '#274226',
		)
	);

	$your_curnt_lang = apply_filters('wpml_current_language', NULL);
	if (is_rtl() && $your_curnt_lang != 'en') {
		wp_enqueue_script('noryx-rtl', NORYX_JS_PATH . '/rtl.js', array('jquery'), '1.0', true);
	}


	if (is_singular() && comments_open() && get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
}
add_action('wp_enqueue_scripts', 'noryx_scripts');

/**
 * Performance Optimization: Dequeue WooCommerce & Shopbuilder on non-shop pages & Front Page
 */
add_action('wp_enqueue_scripts', function() {
    if (is_front_page() || !function_exists('is_woocommerce') || (!is_woocommerce() && !is_cart() && !is_checkout())) {
        // Dequeue WooCommerce CSS
        wp_dequeue_style('woocommerce-layout');
        wp_dequeue_style('woocommerce-smallscreen');
        wp_dequeue_style('woocommerce-general');
        wp_dequeue_style('photoswipe');
        wp_dequeue_style('photoswipe-default-skin');
        wp_dequeue_style('woocommerce_frontend_styles');
        wp_dequeue_style('wc-blocks-style');
        wp_dequeue_style('wc-blocks-vendors-style');

        // Dequeue WooCommerce JS
        wp_dequeue_script('wc-add-to-cart');
        wp_dequeue_script('woocommerce');
        wp_dequeue_script('wc-cart-fragments');
        wp_dequeue_script('photoswipe');
        wp_dequeue_script('photoswipe-ui-default');
        wp_dequeue_script('wc-single-product');
        wp_dequeue_script('wc-add-to-cart-variation');
        wp_dequeue_script('order-attribution');
        wp_dequeue_script('sourcebuster-js');
        wp_dequeue_script('js-cookie');
        wp_dequeue_script('jquery-blockui');
        
        // Dequeue redundant plugins on front-page
        wp_dequeue_script('shopbuilder-swiper');
        wp_dequeue_style('shopbuilder-swiper');
        wp_dequeue_script('pixi');
    }
}, 99999);