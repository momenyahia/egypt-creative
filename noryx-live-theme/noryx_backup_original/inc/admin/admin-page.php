<?php
if (!defined('ABSPATH')) {
    exit;
}

$boxes = [
    [
        'title' => __('Theme Documentation', 'noryx'),
        'description' => __('For comprehensive information on theme settings, please refer to our online documentation.', 'noryx'),
        'url' => 'https://themexriver.com/documentation/noryx-doc/',
        'button' => __('Go to Documentation', 'noryx'),
    ],
    [
        'title' => __('Theme Support', 'noryx'),
        'description' => __('Need help? Open a support ticket and our team will assist you.', 'noryx'),
        'url' => 'https://themexriver.ticksy.com/tickets/',
        'button' => __('Go to Support Tickets', 'noryx'),
    ],
    [
        'title' => __('Theme Setup Wizard', 'noryx'),
        'description' => __('Complete the initial setup including demo import and required plugins.', 'noryx'),
        'url' => admin_url('admin.php?page=one-click-demo-import'),
        'button' => __('Start Setup', 'noryx'),
    ],
    [
        'title' => __('Import Demo Content', 'noryx'),
        'description' => __('Import pre-built demo content with one click.', 'noryx'),
        'url' => admin_url('admin.php?page=one-click-demo-import'),
        'button' => __('Import Demo', 'noryx'),
    ],
    [
        'title' => __('Theme Options', 'noryx'),
        'description' => __('Customize colors, typography, layout and more.', 'noryx'),
        'url' => admin_url('admin.php?page=noryx-theme-option'),
        'button' => __('Customize Theme', 'noryx'),
    ],
    [
        'title' => __('Required Plugins', 'noryx'),
        'description' => __('Install and manage required and recommended plugins.', 'noryx'),
        'url' => admin_url('admin.php?page=tgmpa-install-plugins'),
        'button' => __('Manage Plugins', 'noryx'),
    ],
    [
        'title' => __('Video Tutorials', 'noryx'),
        'description' => __('Watch step-by-step video tutorials to learn the theme.', 'noryx'),
        'url' => 'https://www.youtube.com/@themexriver',
        'button' => __('Watch Tutorials', 'noryx'),
    ],
    [
        'title' => __('Theme Updates', 'noryx'),
        'description' => __('View recent updates, improvements and bug fixes.', 'noryx'),
        'url' => 'https://themexriver.com/changelog/noryx',
        'button' => __('View Changelog', 'noryx'),
    ],
    [
        'title' => __('System Status', 'noryx'),
        'description' => __('Check server configuration and WordPress environment status.', 'noryx'),
        'url' => admin_url('site-health.php'),
        'button' => __('View Status', 'noryx'),
    ],
    [
        'title' => __('Rate This Theme', 'noryx'),
        'description' => __('If you enjoy using noryx, please rate us on ThemeForest.', 'noryx'),
        'url' => 'https://themeforest.net/downloads',
        'button' => __('Leave a Rating ⭐', 'noryx'),
    ],
];
?>

<div class="rz-container-wrap">
    <div class="rz-admin-boxes">
        <?php foreach ($boxes as $box): ?>
            <div class="rz-admin-box">
                <div class="rz-admin-box__header">
                    <h3><?php echo esc_html($box['title']); ?></h3>
                </div>
                <div class="rz-admin-box__content">
                    <p><?php echo esc_html($box['description']); ?></p>
                    <a href="<?php echo esc_url($box['url']); ?>" target="_blank" class="rz-admin-button">
                        <?php echo esc_html($box['button']); ?>
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>