<?php

add_action('tgmpa_register', 'noryx_register_required_plugins');

function noryx_register_required_plugins()
{

    $plugins = array(
        array(
            'name' => esc_html__('Noryx Plugin', 'noryx'),
            'slug' => 'noryx-plugin',
            'source' => (file_exists(get_template_directory() . '/inc/plugins/noryx-plugin.zip') ? get_template_directory() . '/inc/plugins/noryx-plugin.zip' : 'https://themexriver.com/wp/noryx/plugin/noryx-plugin.zip'),
            'required' => true,
            'force_activation' => false,
            'force_deactivation' => false,
        ),
        array(
            'name' => 'Elementor Website Builder',
            'slug' => 'elementor',
            'required' => true,
        ),

        array(
            'name' => esc_html__('Contact Form 7', 'noryx'),
            'slug' => 'contact-form-7',
            'required' => false,
        ),

        array(
            'name' => esc_html__('One Click Demo Import', 'noryx'),
            'slug' => 'one-click-demo-import',
            'required' => true,
        ),

        array(
            'name' => esc_html__('WooCommerce', 'noryx'),
            'slug' => 'woocommerce',
            'required' => true,
        ),
        array(
            'name' => esc_html__('WooCommerce Shop Builder For Elementor', 'noryx'),
            'slug' => 'shopbuilder',
            'required' => true,
        )

    );

    $config = array(
        'id' => 'noryx',
        'parent_slug' => 'noryx',
        'menu' => 'tgmpa-install-plugins',
        'dismissable' => true,
        'dismiss_msg' => '',
        'is_automatic' => false,
        'message' => '',
        'default_path' => '',
    );

    tgmpa($plugins, $config);
}
