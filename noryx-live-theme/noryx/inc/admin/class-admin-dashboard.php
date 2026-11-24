<?php

/**
 * [Noryx_Aadmin description]
 */
if (!class_exists('Noryx_Aadmin')) {
    class Noryx_Aadmin
    {

        private static $instance = null;

        /**
         * register instance
         *
         * @return void
         */
        public static function init()
        {
            if (is_null(self::$instance)) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        /**
         * init Construct
         */
        public function __construct()
        {
            add_action('init', [$this, 'noryx_tgm_dashboard'], 1);
            add_action('admin_menu', [$this, 'noryx_admin_dashboard'], 1);
            add_action('admin_menu', [$this, 'noryx_template_dashboard'], 20);
            add_action('ocdi/plugin_page_setup', [$this, 'noryx_import_dsb'], 20);
            add_action('admin_enqueue_scripts', array($this, 'noryx_admin_enqueue_scripts'));
            add_action('admin_menu', [$this, 'noryx_megamenu_dashboard'], 21);
        }

        /**
         * Admin Dashboard
         *
         * @return void
         */
        public function noryx_admin_dashboard()
        {
            add_menu_page(
                esc_html__('Noryx', 'noryx'),
                esc_html__('Noryx', 'noryx'),
                'manage_options',
                'noryx',
                [$this, 'display_noryx_admin_dashboard'],
                get_template_directory_uri() . '/inc/admin/assets/img/favicon.png',
                2
            );


        }

        /**
         * Template Dashboard
         *
         * @return void
         */
        public function noryx_template_dashboard()
        {
            add_submenu_page(
                'noryx',
                esc_html__('Templates', 'noryx'),
                esc_html__('Templates', 'noryx'),
                'manage_options',
                'edit.php?post_type=noryx_template',
                false
            );
        }

        /**
         * admin style Add
         */
        public function noryx_admin_enqueue_scripts()
        {
            wp_enqueue_style('noryx-admin', get_theme_file_uri('inc/admin/assets/css/admin.css'), array(), null, 'all');
        }

        public function display_noryx_admin_dashboard()
        {
            require_once NORYX_INC_DRI . 'admin/admin-page.php';
        }

        public function noryx_tgm_dashboard()
        {
            require_once NORYX_INC_DRI . 'admin/class-tgm-plugin-activation.php';
            require_once NORYX_INC_DRI . 'admin/plugin-activation.php';
        }

        public function noryx_import_dsb($default)
        {
            $default['parent_slug'] = 'noryx';
            $default['page_title'] = esc_html__('One Click Demo Import', 'noryx');
            $default['menu_title'] = esc_html__('Import Demo Data', 'noryx');
            $default['capability'] = 'import';
            $default['menu_slug'] = 'one-click-demo-import';

            return $default;
        }

        /**
         * Megamenu Elementor Template
         *
         * @return  [type]  [return description]
         */
        public function noryx_megamenu_dashboard()
        {
            add_submenu_page(
                'noryx',
                esc_html__('Mega Menu', 'noryx'),
                esc_html__('Mega Menu', 'noryx'),
                'manage_options',
                'edit.php?post_type=th-mega-menu',
                false
            );
        }
    }
    Noryx_Aadmin::init();
}
