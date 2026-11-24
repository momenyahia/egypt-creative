<?php
if (!defined('ABSPATH')) {
	exit;
}
/**
 * noryx Theme Helper
 *
 *
 * @class        Noryx_Helper
 * @version      1.0
 * @category 	 Class
 */

if (!class_exists('Noryx_Helper')) {
	class Noryx_Helper
	{

		/**
		 * Header Template
		 *
		 * @return  [type]  [return description]
		 */
		public static function noryx_header_template()
		{
			$meta = get_post_meta(get_the_ID(), 'noryx_page_meta', true);
			$meta_header_option = isset($meta['meta_header_type']) ? $meta['meta_header_type'] : '';

			$f_style = cs_get_option('header_style');
			$header_style = '';

			$meta_header = isset($meta['meta_header_style']) ? $meta['meta_header_style'] : '';

			if ($meta_header_option == true || $meta_header_option == 1) {
				$header_style .= $meta_header;
			} else {
				$header_style .= $f_style;
			}

			if (class_exists('noryx_Plugin_Helper') && $header_style && (get_post($header_style)) && in_array('elementor/elementor.php', apply_filters('active_plugins', get_option('active_plugins')))) { ?>
				<?php $elementor_instance = Elementor\Plugin::instance(); ?>
				<?php echo noryx_Plugin_Helper::noryx_render_header($header_style); ?>
			<?php
			} else {
				get_template_part('template-parts/header/default', 'header');
			}
		}

		/**
		 * Footer Template
		 *
		 * @return  [type]  [return description]
		 */
		public static function noryx_footer_template()
		{
			get_template_part('template-parts/footer/default', 'footer');
		}

	}

	// Instantiate theme
	new Noryx_Helper();
}