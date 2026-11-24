<?php

/**
 * Get Site Logo URL from any source (WordPress Customizer, Codestar, or Theme Options)
 */
function noryx_get_site_logo_url()
{
    // 1. Check WordPress standard custom logo (Appearance > Customize > Site Identity)
    $custom_logo_id = get_theme_mod('custom_logo');
    if (!empty($custom_logo_id)) {
        $logo = wp_get_attachment_image_url((int)$custom_logo_id, 'full');
        if (!empty($logo)) {
            return $logo;
        }
    }

    // 2. Check Codestar Option: preloader_logo
    $preloader_logo = cs_get_option('preloader_logo');
    if (is_array($preloader_logo)) {
        if (!empty($preloader_logo['url'])) {
            return $preloader_logo['url'];
        }
        if (!empty($preloader_logo['id'])) {
            $logo = wp_get_attachment_image_url((int)$preloader_logo['id'], 'full');
            if (!empty($logo)) {
                return $logo;
            }
        }
    } elseif (is_numeric($preloader_logo)) {
        $logo = wp_get_attachment_image_url((int)$preloader_logo, 'full');
        if (!empty($logo)) {
            return $logo;
        }
    } elseif (is_string($preloader_logo) && !empty($preloader_logo)) {
        return $preloader_logo;
    }

    // 3. Check Codestar Options: logo, site_logo, header_logo, logo_white
    foreach (array('logo', 'site_logo', 'header_logo', 'logo_white') as $opt_key) {
        $opt = cs_get_option($opt_key);
        if (is_array($opt)) {
            if (!empty($opt['url'])) {
                return $opt['url'];
            }
            if (!empty($opt['id'])) {
                $logo = wp_get_attachment_image_url((int)$opt['id'], 'full');
                if (!empty($logo)) {
                    return $logo;
                }
            }
        } elseif (is_string($opt) && !empty($opt)) {
            return $opt;
        }
    }

    // 4. Check WordPress Site Icon
    $site_icon_id = get_option('site_icon');
    if (!empty($site_icon_id)) {
        $icon = wp_get_attachment_image_url((int)$site_icon_id, 'full');
        if (!empty($icon)) {
            return $icon;
        }
    }

    return '';
}

/**
 * Default Logo for Header
 */
function noryx_default_logo()
{
    $logo_url = noryx_get_site_logo_url();
    if (!empty($logo_url)) {
        echo '<div class="brand-logo"><a href="' . esc_url(home_url('/')) . '"><img class="logo_site-size" src="' . esc_url($logo_url) . '" alt="' . esc_attr(get_bloginfo('name')) . '"></a></div>';
    } else {
        echo '<div class="brand-logo"><a href="' . esc_url(home_url('/')) . '"><h2 class="site-title" style="color:#fff;margin:0;font-weight:700;">' . esc_html(get_bloginfo('name')) . '</h2></a></div>';
    }
}

/**
 * Preloader
 *
 * @return  [type]  [return description]
 */
function noryx_preloader()
{
    $preloader_enable = cs_get_option('preloader_enable');
    $custom_logo_url = noryx_get_site_logo_url();

    if ($preloader_enable === true || $preloader_enable === '1' || $preloader_enable === 1 || !isset($preloader_enable)):
        ?>
        <div id="preloader">
            <div class="preloader-logo">
                <?php if (!empty($custom_logo_url)): ?>
                    <img src="<?php echo esc_url($custom_logo_url); ?>" alt="<?php bloginfo('name'); ?>" class="custom-preloader-logo">
                <?php else: ?>
                    <svg class="logo-spin" width="168" height="168" viewBox="-20 -20 208 208" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path class="path-white"
                            d="M35.4335 60.0016V59.3879C35.4335 47.8896 49.3705 42.1311 57.5217 50.2617L109.208 101.817V4.0795C101.071 1.43506 92.3865 0 83.3646 0C37.3235 0 0 37.2294 0 83.1541C0 111.282 14.0034 136.145 35.4335 151.193V60.0016Z"
                            fill="white" />
                        <path class="path-orange"
                            d="M132.567 16.8066V112.635C132.567 116.367 131.634 119.88 129.992 122.961C126.28 129.924 118.937 134.667 110.479 134.667L58.793 83.1121V163.92C66.9299 166.565 75.6143 168 84.6361 168C130.677 168 168.001 130.77 168.001 84.8455C168.001 56.7177 153.997 31.8546 132.567 16.8066Z"
                            fill="var(--nx-prime-c, #274226)" />
                    </svg>
                <?php endif; ?>
            </div>
        </div>
        <script>
        (function() {
            function removePreloaderNow() {
                var p = document.getElementById("preloader");
                if (p && !p.classList.contains("preloaded")) {
                    p.classList.add("preloaded");
                    setTimeout(function() {
                        if (p && p.parentNode) p.parentNode.removeChild(p);
                    }, 600);
                }
            }
            if (document.readyState === "complete" || document.readyState === "interactive") {
                removePreloaderNow();
            } else {
                document.addEventListener("DOMContentLoaded", function() { setTimeout(removePreloaderNow, 150); });
                window.addEventListener("load", removePreloaderNow);
            }
            setTimeout(removePreloaderNow, 600);
        })();
        </script>
        <?php
    endif;
}

function noryx_scroll_up_btn()
{
    $scroll_up_btn = cs_get_option('scroll_up_btn');

    if ($scroll_up_btn == true):
        ?>
        <div class="nx-up">
            <a href="#" class="nx-scrollup text-center"><i class="fa-solid fa-chevron-up"></i></a>
        </div>
        <?php
    endif;
}


/**
 * noryx Post Loop
 *
 * @return  [type]  [return description]
 */
function noryx_post_loop()
{
    if (have_posts()):

        /* Start the Loop */
        while (have_posts()):
            the_post();

            /*
             * Include the Post-Type-specific template for the content.
             * If you want to override this in a child theme, then include a file
             * called content-___.php (where ___ is the Post Type name) and that will be used instead.
             */
            get_template_part('template-parts/content', get_post_type());

        endwhile; ?>
        <!-- pagination -->
        <div class="sn-pagination text-center ul-li">
            <?php
            noryx_pagination(
                '
                    <i class="fa-solid fa-angles-left"></i>',
                '<i class="fa-solid fa-angles-right"></i>',
                '',
                ['class' => '']
            );
            ?>
        </div>

    <?php else:

        get_template_part('template-parts/content', 'none');

    endif;
}

/**
 * Single Post Loop
 *
 * @return  [type]  [return description]
 */
function noryx_single_post_loop()
{
    while (have_posts()):
        the_post();

        get_template_part('template-parts/content', 'single');
    endwhile; // End of the loop.
}

/**
 * Archive Loop
 *
 * @return  [type]  [return description]
 */
function noryx_post_archive_loop()
{
    if (have_posts()):
        /* Start the Loop */
        while (have_posts()):
            the_post();

            /*
             * Include the Post-Type-specific template for the content.
             * If you want to override this in a child theme, then include a file
             * called content-___.php (where ___ is the Post Type name) and that will be used instead.
             */
            get_template_part('template-parts/content', get_post_type());

        endwhile; ?>

        <div class="ct-pagination">
            <?php
            noryx_pagination(
                '
                    <i class="fa-solid fa-angles-left feh-pagination-icon"></i>',
                '<i class="fa-solid fa-angles-right feh-pagination-icon"></i>',
                '',
                ['class' => '']
            );
            ?>
        </div>

    <?php else:

        get_template_part('template-parts/content', 'none');

    endif;
}

/**
 * Search Loop
 *
 * @return  [type]  [return description]
 */
function noryx_search_loop()
{
    if (have_posts()):

        /* Start the Loop */
        while (have_posts()):
            the_post();

            /**
             * Run the loop for the search to output the results.
             * If you want to overload this in a child theme then include a file
             * called content-search.php and that will be used instead.
             */
            get_template_part('template-parts/content', 'search');

        endwhile; ?>
        <div class="ct-pagination">
            <?php
            noryx_pagination(
                '
                    <i class="fa-solid fa-angles-left feh-pagination-icon"></i>',
                '<i class="fa-solid fa-angles-right feh-pagination-icon"></i>',
                '',
                ['class' => '']
            );
            ?>
        </div>

    <?php else:

        get_template_part('template-parts/content', 'none');

    endif;
}

/**
 * Page Loop
 *
 * @return  [type]  [return description]
 */
function noryx_page_loop()
{
    while (have_posts()):
        the_post();

        get_template_part('template-parts/content', 'page');

        // If comments are open or we have at least one comment, load up the comment template.
        if (comments_open() || get_comments_number()):
            comments_template();
        endif;

    endwhile; // End of the loop.
}
