<?php
/**
 * The template for displaying the front page.
 *
 * @package noryx
 */

get_header();

$front_id = 1825;

echo '<main id="primary" class="site-main">';

ob_start();

if (class_exists('\Elementor\Plugin')) {
    $raw = get_post_meta($front_id, '_elementor_data', true);
    $elements = json_decode($raw, true);
    if (is_array($elements) && !empty($elements)) {
        echo '<div class="elementor elementor-' . esc_attr($front_id) . '" data-elementor-id="' . esc_attr($front_id) . '" data-elementor-type="wp-page">';
        foreach ($elements as $el) {
            $inst = \Elementor\Plugin::$instance->elements_manager->create_element_instance($el);
            if ($inst) {
                $inst->print_element();
            }
        }
        echo '</div>';
    } else {
        while (have_posts()) :
            the_post();
            the_content();
        endwhile;
    }
} else {
    while (have_posts()) :
        the_post();
        the_content();
    endwhile;
}

$page_html = ob_get_clean();

// Replace demo team members with official Egypt Creative leadership team in exact 1-5 order
$team_uri = get_template_directory_uri() . '/assets/img/team/';
$team_cards_html = '
    <div class="nx-team1-item ec-team-card ec-founder _1">
        <div class="item-inner position-relative">
            <div class="item-img img-cover">
                <img src="' . esc_url($team_uri . 'team-3-mahmoud-ragab.webp?v=72') . '" alt="Mahmoud Ragab - The Founder" loading="lazy" decoding="async">
            </div>
            <div class="item-text text-center headline">
                <h3>Mahmoud Ragab</h3>
                <span>The Founder</span>
            </div>
            <div class="item-social">
                <a aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/mahmoud-ragab-abugabal/">
                    <span><svg aria-hidden="true" class="e-font-icon-svg e-fab-linkedin-in" viewbox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg></span>
                </a>
            </div>
        </div>
    </div>
    <div class="nx-team1-item ec-team-card _2">
        <div class="item-inner position-relative">
            <div class="item-img img-cover">
                <img src="' . esc_url($team_uri . 'team-1-ahmed-hatef.webp?v=71') . '" alt="Ahmed Hatef - CEO" loading="lazy" decoding="async">
            </div>
            <div class="item-text text-center headline">
                <h3>Ahmed Hatef</h3>
                <span>CEO</span>
            </div>
            <div class="item-social">
                <a aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/ahmedhatef/">
                    <span><svg aria-hidden="true" class="e-font-icon-svg e-fab-linkedin-in" viewbox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg></span>
                </a>
            </div>
        </div>
    </div>
    <div class="nx-team1-item ec-team-card _3">
        <div class="item-inner position-relative">
            <div class="item-img img-cover">
                <img src="' . esc_url($team_uri . 'team-5-mohamed-yasser.webp') . '" alt="Mohamed Yasser - General Manager" loading="lazy" decoding="async">
            </div>
            <div class="item-text text-center headline">
                <h3>Mohamed Yasser</h3>
                <span>General Manager</span>
            </div>
            <div class="item-social">
                <a aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/mohamed-yasser-1ab14a406/">
                    <span><svg aria-hidden="true" class="e-font-icon-svg e-fab-linkedin-in" viewbox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg></span>
                </a>
            </div>
        </div>
    </div>
    <div class="nx-team1-item ec-team-card _4">
        <div class="item-inner position-relative">
            <div class="item-img img-cover">
                <img src="' . esc_url($team_uri . 'team-2-momen-yahia.webp?v=71') . '" alt="Momen Yahia - Operation Manager" loading="lazy" decoding="async">
            </div>
            <div class="item-text text-center headline">
                <h3>Momen Yahia</h3>
                <span>Operation Manager</span>
            </div>
            <div class="item-social">
                <a aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/momenyahia/">
                    <span><svg aria-hidden="true" class="e-font-icon-svg e-fab-linkedin-in" viewbox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg></span>
                </a>
            </div>
        </div>
    </div>
    <div class="nx-team1-item ec-team-card _5">
        <div class="item-inner position-relative">
            <div class="item-img img-cover">
                <img src="' . esc_url($team_uri . 'team-4-bassant.webp?v=68') . '" alt="Bassant - Head of Strategy" loading="lazy" decoding="async">
            </div>
            <div class="item-text text-center headline">
                <h3>Bassant</h3>
                <span>Head of Strategy</span>
            </div>
            <div class="item-social">
                <a aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/bassant-abdelazez-a57992250/">
                    <span><svg aria-hidden="true" class="e-font-icon-svg e-fab-linkedin-in" viewbox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg></span>
                </a>
            </div>
        </div>
    </div>
';

$page_html = preg_replace(
    '/<div class="nx-team1-content d-flex justify-content-between">[\s\S]*?<\/div>(\s*<div class="nx-tm1-bottom)/i',
    '<div class="nx-team1-content d-flex justify-content-between">' . $team_cards_html . '</div>$1',
    $page_html,
    1
);

// Add Google Maps Location icon to hero top-left circular social bar (nx-hr-social) and Card 4 social chips
$maps_url = 'https://maps.app.goo.gl/rMCADUQhtTWfNPKx9';
$maps_li = '<li><a target="_blank" rel="noopener noreferrer" href="' . esc_url($maps_url) . '" title="Location on Google Maps" aria-label="Google Maps Location"><svg aria-hidden="true" class="e-font-icon-svg" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg></a></li>';

// 1. Hero top-left social circle: place right after WhatsApp item
$page_html = preg_replace(
    '#(<li>\s*<a[^>]*href="[^"]*wa\.link[^"]*"[^>]*>[\s\S]*?<\/li>)#i',
    '$1' . "\n\t\t\t\t\t" . $maps_li,
    $page_html,
    1
);

// 2. Why Choose Us Card 4: place Location chip after WhatsApp chip
$maps_chip = '<a href="' . esc_url($maps_url) . '" target="_blank" rel="noopener noreferrer" class="nx-social-chip"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-4.198 0-8 3.402-8 7.602 0 4.884 7.031 15.421 7.33 15.867.168.25.449.398.749.398.301 0 .582-.148.75-.398.299-.446 7.33-10.983 7.33-15.867 0-4.2-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg><span>Location</span></a>';
$page_html = preg_replace(
    '#(<a[^>]*href="https://wa\.me/201044107134"[^>]*class="nx-social-chip"[^>]*>[\s\S]*?<\/a>)#i',
    '$1' . "\n\t\t\t\t" . $maps_chip,
    $page_html,
    1
);

// Client Stories / Testimonials Avatar Replacements (Optimized lightweight images)
$testi_base = get_template_directory_uri() . '/assets/img/testimonials/';
$page_html = preg_replace(
    '#https?://[^"\']*(?:wp-content/uploads/\d{4}/\d{2}/|assets/img/demo/)?tst([1-5])\.(?:jpg|jpeg|png|webp)#i',
    $testi_base . 'egyptian-exec-$1.jpg',
    $page_html
);
// Clean up any potential nested URL prefixes
$page_html = preg_replace(
    '#https?://[^"\']+/assets/img/(?:demo|testimonials)/https?://#i',
    'https://',
    $page_html
);

// Fix title typo & bottom motto typo
$page_html = str_replace('Stories Weve Told', "Stories We've Told", $page_html);
$page_html = str_replace('Driven by Creativity. United by Visio</p>', 'Driven by Creativity. United by Vision.</p>', $page_html);

// Rename Cairo Capital Center -> Cairo Capital Hub and replace logo
$cch_logo_url = get_template_directory_uri() . '/assets/img/cairo-capital-hub-logo.png';
$page_html = str_replace('Cairo Capital Center', 'Cairo Capital Hub', $page_html);
$page_html = str_replace('https://egyptcreative.com/wp-content/uploads/2026/10/cairo-capital-logo.jpg', $cch_logo_url, $page_html);

// 1. Remove Our Trusted Partners section completely
$page_html = preg_replace('/<div[^>]*class="[^"]*elementor-element-3984767[^"]*"[\s\S]*?(?=<div[^>]*class="[^"]*elementor-element-0615671)/i', '', $page_html);

// 2. Numbers & Subtitles updates
// 4.8 -> 9.8 in Hero review count
$page_html = preg_replace('/(<div class="nx-hr1-cl-text[^>]*>[\s\S]*?<h3>\s*)4\.8(\s*<\/h3>)/i', '${1}9.8${2}', $page_html);

// 4.8 -> 9.8 and subtitle update in About section
$page_html = preg_replace(
    '/(<h3>\s*)4\.8(\s*<\/h3>\s*<p>)\s*My goal is to capture the real,[\s\t\r\n]*raw emotions(\s*<\/p>)/i',
    '${1}9.8${2}The ultimate level of customer satisfaction.${3}',
    $page_html
);

// 2K+ subtitle update in About section
$page_html = preg_replace(
    '/(<h3>\s*2K\+\s*<\/h3>\s*<p>)\s*My goal is to capture the real,[\s\t\r\n]*raw emotions(\s*<\/p>)/i',
    '${1}From Vision to Achievement${2}',
    $page_html
);

// 120+ Campaigns -> 4000 Campaigns in Card 6
$page_html = preg_replace(
    '/(<div class="card6-stat-num">\s*)120\+(\s*<\/div>\s*<div class="card6-stat-label">\s*Campaigns\s*<\/div>)/i',
    '${1}4000${2}',
    $page_html
);

// 15+ Years Exp. -> 16 Years Exp. in Card 6
$page_html = preg_replace(
    '/(<div class="card6-stat-num">\s*)15\+(\s*<\/div>\s*<div class="card6-stat-label">\s*Years Exp\.\s*<\/div>)/i',
    '${1}16${2}',
    $page_html
);

// 3. Services Section Updates
// Service 1: Web Design
$page_html = preg_replace(
    '/(<div class="nx-ser1-item-wrap[^"]*elementor-repeater-item-8b43ba7[\s\S]*?<div class="item-meta[^"]*">)[\s\S]*?(<\/div>)/i',
    '$1<a href="javascript:void(0)">E-commerce Websites</a><a href="javascript:void(0)">Corporate Websites</a><a href="javascript:void(0)">Custom Web Solutions</a>$2',
    $page_html
);

// Service 2: Digital Marketing
$page_html = preg_replace(
    '/(<div class="nx-ser1-item-wrap[^"]*elementor-repeater-item-6ba4b67[\s\S]*?<div class="item-meta[^"]*">)[\s\S]*?(<\/div>)/i',
    '$1<a href="javascript:void(0)">Media Buying &amp; Paid Advertising</a><a href="javascript:void(0)">Social Media Marketing</a><a href="javascript:void(0)">SEO &amp; Search Engine Marketing (SEM)</a>$2',
    $page_html
);

// Service 3: Brand Strategy
$page_html = preg_replace(
    '/(<div class="nx-ser1-item-wrap[^"]*elementor-repeater-item-e0e77df[\s\S]*?<h3[^>]*><a[^>]*>)\s*brand Strategy\s*(<\/a><\/h3>[\s\S]*?<div class="item-meta[^"]*">)[\s\S]*?(<\/div>)/i',
    '$1Brand Strategy$2<a href="javascript:void(0)">Brand Positioning &amp; Strategy</a><a href="javascript:void(0)">Brand Identity Development</a><a href="javascript:void(0)">Market Research &amp; Competitor Analysis</a>$3',
    $page_html
);

// Service 4: Production (was Motion & 3d)
$page_html = preg_replace(
    '/(<div class="nx-ser1-item-wrap[^"]*elementor-repeater-item-6633231[\s\S]*?<h3[^>]*><a[^>]*>)\s*Motion &amp; 3d\s*(<\/a><\/h3>[\s\S]*?<div class="item-meta[^"]*">)[\s\S]*?(<\/div>)/i',
    '$1Production$2<a href="javascript:void(0)">Video &amp; Photo Production</a><a href="javascript:void(0)">Commercials &amp; TVC Production</a><a href="javascript:void(0)">Reels &amp; Social Media Content Production</a>$3',
    $page_html
);

// Service 5: Public Relations (PR) (was Visual identity)
$page_html = preg_replace(
    '/(<div class="nx-ser1-item-wrap[^"]*elementor-repeater-item-b0c36c3[\s\S]*?<h3[^>]*><a[^>]*>)\s*Visual identity\s*(<\/a><\/h3>[\s\S]*?<div class="item-meta[^"]*">)[\s\S]*?(<\/div>)/i',
    '$1Public Relations (PR)$2<a href="javascript:void(0)">Influencer &amp; Celebrity Collaborations</a><a href="javascript:void(0)">Media Relations &amp; Press Coverage</a><a href="javascript:void(0)">Brand Awareness &amp; PR Campaigns</a>$3',
    $page_html
);

// Remove Explore More buttons in Working Process section
$page_html = preg_replace(
    '/<div class="item-btn\s+d-flex\s+justify-content-end">[\s\S]*?<\/div>\s*<\/div>/i',
    '',
    $page_html
);

// Connect "Book a Call" button in Why Choose Us Card 1 directly to WhatsApp
$page_html = preg_replace(
    '/(<div class="nx-why-c1-card1[\s\S]*?<div class="nx-btn1 ver_2">\s*)<a\s*>/i',
    '$1<a href="https://wa.me/201044107134?text=' . rawurlencode("Hello Egypt Creative, I would like to book a call for my project.") . '" target="_blank" rel="noopener noreferrer">',
    $page_html
);

// Performance Optimization: Inject loading="lazy" & decoding="async" to images below fold
$page_html = preg_replace_callback('/<img\b([^>]*?)>/i', function($m) {
    $attrs = $m[1];
    if (stripos($attrs, 'loading=') !== false) {
        return $m[0];
    }
    if (stripos($attrs, 'custom-preloader-logo') !== false || stripos($attrs, 'ec-footer-logo') !== false) {
        return '<img ' . $attrs . ' decoding="async">';
    }
    return '<img ' . $attrs . ' loading="lazy" decoding="async">';
}, $page_html);

// Ensure all video elements have preload="metadata" and playsinline to avoid initial network bandwidth stalls
$page_html = preg_replace_callback('/<video\b([^>]*?)>/i', function($m) {
    $attrs = $m[1];
    if (stripos($attrs, 'preload=') === false) {
        $attrs .= ' preload="metadata"';
    } else {
        $attrs = preg_replace('/preload=["\'][^"\']*["\']/i', 'preload="metadata"', $attrs);
    }
    if (stripos($attrs, 'playsinline') === false) {
        $attrs .= ' playsinline';
    }
    return '<video ' . $attrs . '>';
}, $page_html);

// Localize all 33 external themexriver demo assets to local theme assets
$demo_img_uri = get_template_directory_uri() . '/assets/img/demo/';
$page_html = preg_replace(
    '#https?://themexriver\.com/wp/noryx/wp-content/uploads/\d{4}/\d{2}/#i',
    $demo_img_uri,
    $page_html
);
$page_html = str_replace(
    'https://themexriver.com/wp/noryx/',
    $demo_img_uri,
    $page_html
);

// Map any localized demo tst[1-5] to our optimized executive testimonial avatars
$page_html = preg_replace(
    '#assets/img/demo/tst([1-5])\.(?:jpg|jpeg|png|webp)#i',
    'assets/img/testimonials/egyptian-exec-$1.jpg',
    $page_html
);

// Clean up any double/nested URLs in image sources
$page_html = preg_replace(
    '#https?://[^"\']+/assets/img/(?:demo|testimonials)/https?://#i',
    'https://',
    $page_html
);

echo $page_html;

echo '</main>';

get_footer();

