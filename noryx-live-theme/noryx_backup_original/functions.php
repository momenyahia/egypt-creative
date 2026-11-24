<?php
if (!defined('ABSPATH')) {
    exit;
}
class Noryx_Theme
{

    public function __construct()
    {
        $this->define_constants();
        $this->include_files();
        $this->add_hooks();
    }

    /**
     * Define theme constants
     */
    private function define_constants()
    {
        define('NORYX_THEME_DRI', get_template_directory());
        define('NORYX_THEME_URI', get_template_directory_uri());

        // Directories
        define('NORYX_INC_DRI', NORYX_THEME_DRI . '/inc/');
        define('NORYX_ADMIN', NORYX_THEME_DRI . '/inc/admin');

        // Assets
        define('NORYX_CSS_PATH', NORYX_THEME_URI . '/assets/css');
        define('NORYX_JS_PATH', NORYX_THEME_URI . '/assets/js');
        define('NORYX_IMG_PATH', NORYX_THEME_URI . '/assets/images');
    }

    /**
     * Register WordPress hooks
     */
    private function add_hooks()
    {
        add_action('after_setup_theme', [$this, 'setup_theme']);
        add_action('after_setup_theme', [$this, 'set_content_width'], 0);
        add_action('widgets_init', [$this, 'widgets_init']);
        add_filter('th_enable_megamenu', [$this, 'enable_megamenu']);
    }

    /**
     * Theme setup
     */
    public function setup_theme()
    {
        load_theme_textdomain('noryx', NORYX_THEME_DRI . '/languages');

        add_theme_support('automatic-feed-links');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('woocommerce');
        add_theme_support('wc-product-gallery-lightbox');
        add_theme_support('html5', [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ]);
        add_theme_support('post-formats', ['standard', 'image', 'video', 'gallery']);
        add_theme_support('customize-selective-refresh-widgets');
        add_theme_support('custom-background', apply_filters('noryx_custom_background_args', [
            'default-color' => 'ffffff',
            'default-image' => '',
        ]));
        add_theme_support('custom-logo', [
            'height' => 250,
            'width' => 250,
            'flex-width' => true,
            'flex-height' => true,
        ]);

        add_image_size('noryx-img-size-1', 790, 368, true);

        // Disable block widgets and large image scaling
        remove_theme_support('widgets-block-editor');
        add_filter('big_image_size_threshold', '__return_false');

        // Menus
        register_nav_menus([
            'menu-1' => esc_html__('Primary', 'noryx'),
        ]);
    }

    /**
     * Set content width
     */
    public function set_content_width()
    {
        $GLOBALS['content_width'] = apply_filters('noryx_content_width', 640);
    }

    /**
     * Register widget areas
     */
    public function widgets_init()
    {
        register_sidebar([
            'name' => esc_html__('Sidebar', 'noryx'),
            'id' => 'sidebar-1',
            'description' => esc_html__('Add widgets here.', 'noryx'),
            'before_widget' => '<div id="%1$s" class="%2$s sn-sidebar-widget headline">',
            'after_widget' => '</div>',
            'before_title' => '<h3 class="widget-title">',
            'after_title' => '</h3>',
        ]);
    }

    /**
     * Enable Mega Menu Filter
     */
    public function enable_megamenu()
    {
        return true;
    }

    /**
     * Include required theme files
     */
    private function include_files()
    {
        $core_includes = [
            'enqueue-scripts.php',
            'custom-header.php',
            'template-tags.php',
            'template-functions.php',
            'class-wp-noryx-navwalker.php',
            'noryx-functions.php',
            'cs-framework-functions.php',
            'dynamic-style.php',
            'noryx-helper-class.php',
            'customizer.php',
            'breadcrumb-init.php',
        ];

        $admin_includes = [
            'class-admin-dashboard.php',
            'demo-import/functions.php',
        ];

        foreach ($core_includes as $file) {
            require_once NORYX_INC_DRI . $file;
        }

        foreach ($admin_includes as $file) {
            require_once NORYX_ADMIN . '/' . $file;
        }

        // Conditional includes
        if (defined('JETPACK__VERSION')) {
            require_once NORYX_INC_DRI . 'jetpack.php';
        }
    }
}
new Noryx_Theme();

// Custom SEO Document Title Filter for Egypt Creative
add_filter('pre_get_document_title', function($title) {
    if (is_front_page() || is_home()) {
        return 'Egypt Creative | Leading Digital Marketing & Creative Agency in Egypt';
    }
    return $title;
}, 999);