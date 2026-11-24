<?php
include_once(get_template_directory() . '/inc/admin/demo-import/codestar.php');
function noryx_ocdi_import_files()
{
	return array(

		array(
			'import_file_name' => 'Demo Import',
			'local_import_file' => trailingslashit(get_template_directory()) . 'inc/admin/demo-import/demo-content/content.xml',
			'local_import_widget_file' => trailingslashit(get_template_directory()) . 'inc/admin/demo-import/demo-content/widgets.wie',
			'local_import_customizer_file' => trailingslashit(get_template_directory()) . 'inc/admin/demo-import/demo-content/customizer.dat',
			'local_import_json' => array(
				array(
					'file_path' => trailingslashit(get_template_directory()) . 'inc/admin/demo-import/demo-content/codestar.json',
					'option_name' => 'noryx',
				),
			),
			'import_notice' => esc_html__('Import process may take 3-10 minutes. If you facing any issues please contact our support. After Import Successfully go to Appearance->Menu And Set your Menu', 'noryx'),
			'preview_url' => 'https://themexriver.com/wp/noryx/',
		)

	);
}
add_filter('pt-ocdi/import_files', 'noryx_ocdi_import_files');

function noryx_ocdi_after_import($selected_import)
{

	$front_page_id = get_page_by_title('Home');
	$blog_page_id = get_page_by_title('Blog');

	// Assign noryx menus to their locations where will be display.
	$primary = get_term_by('name', 'Primary', 'nav_menu');

	if ($primary && !is_wp_error($primary)) {
		set_theme_mod(
			'nav_menu_locations',
			array(
				'menu-1' => $primary->term_id,
			)
		);
	}

	update_option('show_on_front', 'page');
	if ($front_page_id && isset($front_page_id->ID)) {
		update_option('page_on_front', $front_page_id->ID);
	}
	if ($blog_page_id && isset($blog_page_id->ID)) {
		update_option('page_for_posts', $blog_page_id->ID);
	}
	update_option('elementor_experiment-e_font_icon_svg', 'inactive');

}
add_action('pt-ocdi/after_import', 'noryx_ocdi_after_import');

function noryx_ocdi_before_content_import()
{
	add_filter('wp_import_post_data_processed', 'noryx_ocdi_wp_import_post_data_processed', 99, 2);
}
add_action('pt-ocdi/before_content_import', 'noryx_ocdi_before_content_import', 99);

function noryx_ocdi_wp_import_post_data_processed($postdata, $data)
{
	return wp_slash($postdata);
}

add_filter('pt-ocdi/disable_pt_branding', '__return_true');


/**
 * Customize the One Click Demo Import plugin intro text
 * 
 * @param string $default_text The default intro text
 * @return string Modified intro text
 */
function ocdi_plugin_intro_text($default_text)
{
	// Convert shorthand memory size to bytes
	if (!function_exists('xriver_let_to_num')) {
		function xriver_let_to_num($size)
		{
			$l = substr($size, -1);
			$ret = substr($size, 0, -1);

			switch (strtoupper($l)) {
				case 'P':
					$ret *= 1024;
				case 'T':
					$ret *= 1024;
				case 'G':
					$ret *= 1024;
				case 'M':
					$ret *= 1024;
				case 'K':
					$ret *= 1024;
			}
			return $ret;
		}
	}

	// Check if site uses SSL
	$ssl_check = 'https' === substr(get_home_url(), 0, 5);
	$green_mark = '<mark class="green"><span class="dashicons dashicons-yes"></span></mark>';

	// Get active plugins count
	$plugins_counts = (array) get_option('active_plugins', []);
	if (is_multisite()) {
		$network_activated_plugins = array_keys(get_site_option('active_sitewide_plugins', []));
		$plugins_counts = array_merge($plugins_counts, $network_activated_plugins);
	}

	// System requirements data
	$memory = xriver_let_to_num(WP_MEMORY_LIMIT);
	$max_input = ini_get('max_input_vars');
	$php_version = phpversion();
	$wp_version = $GLOBALS['wp_version'];
	$locale = get_locale();

	// Start building output
	$output = '
    <div class="ocdi-system-status">
        <div class="ocdi-notice-header">
            <h2>' . esc_html__('System Status Check', 'noryx') . '</h2>
            <p class="ocdi-notice-subtitle">' . esc_html__('Before importing demo content, ensure your server meets all requirements (green checkmarks).', 'noryx') . '</p>
            <p class="ocdi-warning">' . esc_html__('If any item shows a red warning, contact your hosting provider to adjust the settings.', 'noryx') . '</p>
        </div>
        
        <table class="ocdi-status-table">
            <tbody>
                <!-- WordPress Version -->
                <tr>
                    <td class="status-label">' . esc_html__('WordPress Version', 'noryx') . '</td>
                    <td class="status-value">' . esc_html($wp_version) . '</td>
                    <td class="status-info">
                        ' . (version_compare($wp_version, '5.1', '>=') ?
		$green_mark :
		'<mark class="warning">' . esc_html__('We recommend WordPress 5.1 or higher', 'noryx') . '</mark>'
	) . '
                    </td>
                </tr>
                
                <!-- Language -->
                <tr>
                    <td class="status-label">' . esc_html__('Language', 'noryx') . '</td>
                    <td class="status-value">' . esc_html($locale) . '</td>
                    <td class="status-info">-</td>
                </tr>
                
                <!-- PHP Version -->
                <tr>
                    <td class="status-label">' . esc_html__('PHP Version', 'noryx') . '</td>
                    <td class="status-value">' . esc_html($php_version) . '</td>
                    <td class="status-info">
                        ' . (version_compare($php_version, '7.2', '>=') ?
		$green_mark :
		'<mark class="warning">' . sprintf(
			esc_html__('We recommend PHP 7.2 or higher. %s', 'noryx'),
			'<a href="https://www.php.net/supported-versions.php" target="_blank">' . esc_html__('Learn more', 'noryx') . '</a>'
		) . '</mark>'
	) . '
                    </td>
                </tr>
                
                <!-- WP Memory Limit -->
                <tr>
                    <td class="status-label">' . esc_html__('WP Memory Limit', 'noryx') . '</td>
                    <td class="status-value">' . size_format($memory) . '</td>
                    <td class="status-info">
                        ' . ($memory >= 100663296 ?
		$green_mark :
		'<mark class="warning">' . sprintf(
			esc_html__('We recommend at least 96MB. %s', 'noryx'),
			'<a href="https://www.wpbeginner.com/wp-tutorials/fix-wordpress-memory-exhausted-error-increase-php-memory/" target="_blank">' . esc_html__('How to increase', 'noryx') . '</a>'
		) . '</mark>'
	) . '
                    </td>
                </tr>
                
                <!-- PHP Max Input Vars -->
                <tr>
                    <td class="status-label">' . esc_html__('PHP Max Input Vars', 'noryx') . '</td>
                    <td class="status-value">' . esc_html($max_input) . '</td>
                    <td class="status-info">
                        ' . ($max_input >= 3000 ?
		$green_mark :
		'<mark class="warning">' . sprintf(
			esc_html__('We recommend at least 3000. %s', 'noryx'),
			'<a href="https://jannah.helpscoutdocs.com/article/7-how-to-increase-the-php-max-input-vars" target="_blank">' . esc_html__('How to increase', 'noryx') . '</a>'
		) . '</mark>'
	) . '
                    </td>
                </tr>
                
                <!-- SSL/HTTPS -->
                <tr>
                    <td class="status-label">' . esc_html__('Secure Connection (HTTPS)', 'noryx') . '</td>
                    <td class="status-value">' . ($ssl_check ? esc_html__('Enabled', 'noryx') : esc_html__('Not Enabled', 'noryx')) . '</td>
                    <td class="status-info">
                        ' . ($ssl_check ?
		$green_mark :
		'<mark class="warning">' . esc_html__('Your site is not using HTTPS', 'noryx') . '</mark>'
	) . '
                    </td>
                </tr>
                
                <!-- Active Plugins -->
                <tr>
                    <td class="status-label">' . esc_html__('Active Plugins', 'noryx') . '</td>
                    <td class="status-value">' . count($plugins_counts) . '</td>
                    <td class="status-info">-</td>
                </tr>
            </tbody>
        </table>
        
        <div class="ocdi-requirements-note">
            <p><strong>' . esc_html__('Note:', 'noryx') . '</strong> ' . esc_html__('All items should show green checkmarks before proceeding with demo import.', 'noryx') . '</p>
        </div>
    </div>';

	return $output;
}
add_filter('pt-ocdi/plugin_intro_text', 'ocdi_plugin_intro_text');