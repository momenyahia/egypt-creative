<?php

// File Security Check
if (!defined('ABSPATH')) {
    exit;
}

function noryx_Theme_options_style()
{
    //
    $theme_version = wp_get_theme()->get('Version') ?: '2.6.0';
    wp_enqueue_style('noryx-theme-custom-style', get_template_directory_uri() . '/assets/css/custom-style.css', array('noryx-main'), $theme_version);

    $thx_color_1 = cs_get_option('theme-color-1');
    $thx_color_2 = cs_get_option('theme-color-2');

    // Default or override demo orange to Egypt Creative brand green
    if (empty($thx_color_1) || strtoupper($thx_color_1) === '#FD3F00' || strtolower($thx_color_1) === '#ff6000') {
        $thx_color_1 = '#274226';
    }

    if (empty($thx_color_2)) {
        $thx_color_2 = '#1e3a1f';
    }

    $css_output = '       
        :root {
            --nx-prime-c: ' . esc_attr($thx_color_1) . ' !important;
            --nx-prime-c2: ' . esc_attr($thx_color_2) . ' !important;
        }
    ';

    wp_add_inline_style('noryx-theme-custom-style', $css_output);
}
add_action('wp_enqueue_scripts', 'noryx_Theme_options_style', 99);
