<?php
/**
 * Template Name: Egypt Creative Portfolio Archive
 * The template for displaying the official Egypt Creative Portfolio archive (/project/)
 *
 * @package noryx
 */

get_header();

$ec_approved_projects = array(
    array(
        'title'    => 'Modon Developments',
        'category' => 'Real Estate & Architectural Media',
        'year'     => '2025',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/modon-logo.png',
        'link'     => home_url('/project-modon/')
    ),
    array(
        'title'    => '2B Egypt',
        'category' => 'Tech Retail & Consumer Electronics',
        'year'     => '2024',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/2b-logo-official-v2.png',
        'link'     => home_url('/project-2b/')
    ),
    array(
        'title'    => 'Yves Saint Laurent',
        'category' => 'High-End Fashion & Fragrance Campaign',
        'year'     => '2023',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/ysl-logo.png',
        'link'     => home_url('/project-yves-saint-laurent/')
    ),
    array(
        'title'    => 'Mohamed El Sagheer Salons',
        'category' => 'Luxury Beauty & Salons Network',
        'year'     => '2024',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/sagheer-logo.png',
        'link'     => home_url('/project-mohamed-el-sagheer/')
    ),
    array(
        'title'    => 'Doner Konner Restaurant',
        'category' => 'Fast Casual F&B & Dining Experience',
        'year'     => '2023',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/doner-logo.png',
        'link'     => home_url('/project-doner-konner/')
    ),
    array(
        'title'    => 'Touche Aesthetic Clinic',
        'category' => 'Medical Aesthetics & Dermatology',
        'year'     => '2022',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/touche-logo.png',
        'link'     => home_url('/project-touche-aesthetic/')
    ),
    array(
        'title'    => 'Masaya Sidi Abdelrahman',
        'category' => 'Coastal Luxury Real Estate & Resort',
        'year'     => '2025',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/masaya-logo.png',
        'link'     => home_url('/project-masaya-sidi-abdelrahman/')
    ),
    array(
        'title'    => 'Remas Land',
        'category' => 'FMCG & Dairy Products Campaign',
        'year'     => '2022',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/remas-logo.png',
        'link'     => home_url('/project-remas-land/')
    ),
    array(
        'title'    => 'Azha Clinics',
        'category' => 'Specialized Medical Centers Network',
        'year'     => '2023',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/azha-logo.png',
        'link'     => home_url('/project-azha-clinics/')
    ),
    array(
        'title'    => 'Dermasilk Skincare',
        'category' => 'Premium Cosmeceuticals & Skincare',
        'year'     => '2021',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/dermasilk-logo.png',
        'link'     => home_url('/project-dermasilk/')
    ),
    array(
        'title'    => 'Saint Johns',
        'category' => 'International Educational Institution',
        'year'     => '2024',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/saint-johns-logo.png',
        'link'     => home_url('/project-saint-johns/')
    ),
    array(
        'title'    => 'Cairo Capital Hub',
        'category' => 'Corporate & Financial Video Production',
        'year'     => '2022',
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/cairo-capital-logo.png',
        'link'     => home_url('/project-cairo-capital/')
    )
);
?>

<!-- Noryx Breadcrumb Hero Section -->
<section class="nx-breadcrumb-section position-relative" style="background-color: #0b0c10; padding: 140px 0 70px;">
    <div class="container">
        <div class="nx-breadcrumb-content text-center headline position-relative">
            <span class="sub-title text-uppercase" style="color: #6d6e75; letter-spacing: 2px; font-size: 14px; font-weight: 600; display: block; margin-bottom: 15px;">Featured Case Studies</span>
            <h1 class="text-uppercase" style="font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 700; color: #ffffff; margin-bottom: 20px;">Our Portfolio</h1>
            <div class="nx-breadcrumb-list ul-li">
                <ul style="list-style: none; padding: 0; margin: 0; display: inline-flex; gap: 10px; align-items: center; color: #a0a0a5; font-size: 15px;">
                    <li><a href="<?php echo esc_url(home_url('/')); ?>" style="color: #a0a0a5; text-decoration: none;">Home</a></li>
                    <li>/</li>
                    <li style="color: #ffffff;">Portfolio</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Noryx Portfolio Items List -->
<section class="nx-project-page-section" style="background-color: #0b0c10; padding: 60px 0 120px;">
    <div class="container">
        <div class="nx-project-archive-wrapper">
            <?php foreach ($ec_approved_projects as $proj) : ?>
                <div class="nx-pro1-item-area" style="margin-bottom: 40px;">
                    <div class="nx-pro1-item d-flex">
                        <div class="item-img position-relative nx-card-logo-display">
                            <div class="nx-card-logo-center">
                                <img src="<?php echo esc_url($proj['logo']); ?>" alt="<?php echo esc_attr($proj['title']); ?> Logo" loading="lazy" decoding="async">
                            </div>
                        </div>
                        <div class="item-text headline d-flex justify-content-between flex-wrap">
                            <h3 class="text-uppercase href-underline pro_title">
                                <a href="<?php echo esc_url($proj['link']); ?>">
                                    <?php echo esc_html($proj['title']); ?>
                                </a>
                            </h3>
                            <div class="item-bottom mt-40">
                                <div class="item-list mb-35 ul-li-block">
                                    <ul>
                                        <li><span class="text-uppercase">Year:</span> <?php echo esc_html($proj['year']); ?></li>
                                        <li><span class="text-uppercase">CATEGORY:</span> <?php echo esc_html($proj['category']); ?></li>
                                    </ul>
                                </div>
                                <div class="nx-btn1 ver_2">
                                    <a href="<?php echo esc_url($proj['link']); ?>">
                                        <i>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </i>
                                        View Case Study
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php
get_footer();
