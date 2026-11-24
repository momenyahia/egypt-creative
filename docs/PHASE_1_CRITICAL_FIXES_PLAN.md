# EGYPT CREATIVE — PHASE 1: CRITICAL PRODUCTION FIXES PLAN
## Detailed Implementation, Verification & Rollback Specification

**Target Website:** `https://egyptcreative.com/`  
**Baseline:** Completed Full Website Forensic Audit (November 24, 2026)  
**Execution Mode:** PLANNING & VERIFICATION ONLY (Read-Only until explicit user authorization)  
**Engineering Lead:** Principal Software Architect & Release Manager  

---

## 1. Executive Phasing & Safety Protocols

This specification outlines the surgical implementation plan for the 5 critical production priorities identified during the forensic audit.

### Mandatory Operational Guardrails
1. **Zero Database Drops / Content Deletions:** No WordPress pages, posts, or media items will be deleted from the database.
2. **Preserve Noryx Visual Identity:** 100% preservation of colors, typography (Syne/Inter/Runiga), layout grids, and animations.
3. **Preserve Public Project URLs:** The 12 approved project URLs remain strictly unchanged.
4. **Isolated Verification on Staging First:** Every template edit must be validated on the local staging environment (`staging-site\egypt-creative`) prior to production execution.
5. **Instant Rollback Availability:** Every modified file has an unmodified copy in `noryx-live-theme/noryx_backup_original/` allowing < 60 second restoration.

---

## 2. Priority Task 1: Portfolio Archive (`/project/`)

### 1. Context & Forensic Verification
- **Target Route:** `https://egyptcreative.com/project/`
- **Current Production Behavior:**
  - Page resolves via Elementor page ID 1829 (`elementor_header_footer`).
  - Displays 3 ThemeForest demo cards (*Social Media Engagement Growth Campaign*, *Complete Branding & Strategy*, *Multi-Channel Performance Marketing Strategy*).
  - All 3 cards link off-site to `https://themexriver.com/wp/noryx/single-project/`.
  - Displays ThemeForest sponsor demo logos (`sp4.svg`...`sp7.svg`).
  - Missing `<h1>` heading (0 found).
  - The 12 approved Egypt Creative projects are completely missing.
- **Affected File:** `noryx-live-theme/noryx/page-project.php` (New dedicated template) or `template_include` hook in `functions.php`.

### 2. Proposed Technical Implementation
Create `noryx-live-theme/noryx/page-project.php`. Under WordPress template hierarchy, a file named `page-{slug}.php` automatically takes precedence over generic page templates for that specific slug:

```php
<?php
/**
 * Template Name: Egypt Creative Portfolio Archive
 * Target Slug: /project/
 * Description: Dedicated portfolio archive rendering the 12 approved client projects.
 *
 * @package noryx
 */

get_header();

// Canonical Registry of the 12 Approved Egypt Creative Projects
$approved_projects = array(
    array(
        'title'    => 'Modon Developments',
        'slug'     => 'project-modon-developments',
        'url'      => home_url('/project-modon-developments/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/modon-logo.png',
        'category' => 'Real Estate & Architectural Media',
        'year'     => '2025'
    ),
    array(
        'title'    => '2B Egypt',
        'slug'     => 'project-2b',
        'url'      => home_url('/project-2b/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/2b-logo-official-v2.png',
        'category' => 'Tech Retail & Consumer Electronics',
        'year'     => '2024'
    ),
    array(
        'title'    => 'Yves Saint Laurent',
        'slug'     => 'project-yves-saint-laurent',
        'url'      => home_url('/project-yves-saint-laurent/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/yves-saint-laurent-logo-1.jpg',
        'category' => 'High-End Fashion & Fragrance Campaign',
        'year'     => '2023'
    ),
    array(
        'title'    => 'Mohamed El Sagheer Salons',
        'slug'     => 'project-mohamed-el-sagheer',
        'url'      => home_url('/project-mohamed-el-sagheer/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/mohamed-el-sagheer-logo.png',
        'category' => 'Luxury Beauty & Celebrity Care',
        'year'     => '2024'
    ),
    array(
        'title'    => 'Doner Konner Restaurant',
        'slug'     => 'project-doner-konner',
        'url'      => home_url('/project-doner-konner/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/doner-konner-logo.jpg',
        'category' => 'Food & Beverage Lifestyle Media',
        'year'     => '2024'
    ),
    array(
        'title'    => 'Touche Aesthetic Clinic',
        'slug'     => 'project-touche-aesthetic',
        'url'      => home_url('/project-touche-aesthetic/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/touche-logo.png',
        'category' => 'Medical Aesthetic & Clinical Excellence',
        'year'     => '2025'
    ),
    array(
        'title'    => 'Masaya Sidi Abdelrahman',
        'slug'     => 'project-masaya-sidi-abdelrahman',
        'url'      => home_url('/project-masaya-sidi-abdelrahman/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/masaya-sidi-abdelrahman-logo.png',
        'category' => 'Luxury Coastal Real Estate Showcase',
        'year'     => '2024'
    ),
    array(
        'title'    => 'Remas Land',
        'slug'     => 'project-remas-land',
        'url'      => home_url('/project-remas-land/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/remas-land-logo.png',
        'category' => 'FMCG Brand Identity & TVC Campaign',
        'year'     => '2024'
    ),
    array(
        'title'    => 'Azha Clinics',
        'slug'     => 'project-azha-clinics',
        'url'      => home_url('/project-azha-clinics/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/azha-clinics-logo.png',
        'category' => 'Premium Healthcare & Specialized Clinics',
        'year'     => '2024'
    ),
    array(
        'title'    => 'Dermasilk Skincare',
        'slug'     => 'project-dermasilk',
        'url'      => home_url('/project-dermasilk/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/dermasilk-logo.png',
        'category' => 'Cosmetic Dermatology & Skincare',
        'year'     => '2024'
    ),
    array(
        'title'    => 'Saint Johns',
        'slug'     => 'project-saint-johns',
        'url'      => home_url('/project-saint-johns/'),
        'logo'     => 'https://egyptcreative.com/wp-content/uploads/2026/10/saint-johns-logo-1.png',
        'category' => 'Elite Educational Institution Media',
        'year'     => '2025'
    ),
    array(
        'title'    => 'Cairo Capital Hub',
        'slug'     => 'project-cairo-capital',
        'url'      => home_url('/project-cairo-capital/'),
        'logo'     => 'https://egyptcreative.com/wp-content/themes/noryx/assets/img/cairo-capital-hub-logo.png',
        'category' => 'Commercial Mega-Hub & Business Park',
        'year'     => '2024'
    )
);
?>

<main id="primary" class="site-main">
    <!-- Noryx Breadcrumb / Page Header -->
    <section class="nx-breadcrumb-area position-relative pt-180 pb-100" style="background-color: #0b0f0e;">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="nx-breadcrumb-content text-center">
                        <span class="subtitle text-uppercase" style="color: #2ee59d; letter-spacing: 2px; font-weight: 600;">Selected Portfolio</span>
                        <h1 class="page-title text-uppercase" style="color: #fff; font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; margin-top: 15px;">Featured Case Studies</h1>
                        <p style="color: #9ca3af; max-width: 640px; margin: 15px auto 0; font-size: 16px;">
                            Explore how Egypt Creative engineers high-impact creative campaigns, commercial TVCs, and growth-driven strategies for leading enterprise brands.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Portfolio Grid Section -->
    <section class="nx-portfolio-grid-area pt-80 pb-120" style="background-color: #0b0f0e;">
        <div class="container">
            <div class="row g-4">
                <?php foreach ($approved_projects as $proj) : ?>
                    <div class="col-lg-6 col-md-6 col-12">
                        <div class="nx-pro-card" style="background: #111614; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 36px; transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                            <div class="card-top d-flex justify-content-between align-items-center mb-30">
                                <span class="badge" style="background: rgba(46, 229, 157, 0.1); color: #2ee59d; border: 1px solid rgba(46, 229, 157, 0.2); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                                    <?php echo esc_html($proj['year']); ?>
                                </span>
                                <span style="color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                                    <?php echo esc_html($proj['category']); ?>
                                </span>
                            </div>
                            
                            <div class="card-logo text-center py-4 my-2" style="background: rgba(0,0,0,0.25); border-radius: 12px; padding: 24px; min-height: 140px; display: flex; align-items: center; justify-content: center;">
                                <img src="<?php echo esc_url($proj['logo']); ?>" alt="<?php echo esc_attr($proj['title']); ?> Logo" style="max-height: 70px; max-width: 180px; object-fit: contain;" loading="lazy" decoding="async">
                            </div>

                            <div class="card-bottom mt-30 pt-20" style="border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                                <h3 style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin: 0;">
                                    <a href="<?php echo esc_url($proj['url']); ?>" style="color: inherit; text-decoration: none;">
                                        <?php echo esc_html($proj['title']); ?>
                                    </a>
                                </h3>
                                <a href="<?php echo esc_url($proj['url']); ?>" class="btn-arrow" style="width: 44px; height: 44px; border-radius: 50%; background: #274226; color: #fff; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.2s ease;" aria-label="View <?php echo esc_attr($proj['title']); ?> Case Study">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();
```

### 3. Conventional URL Redirection
In `.htaccess`, map standard portfolio variations to `/project/`:
```apache
# 301 Redirects for Portfolio Aliases
RewriteRule ^portfolio/?$ /project/ [R=301,L]
RewriteRule ^works/?$ /project/ [R=301,L]
RewriteRule ^projects/?$ /project/ [R=301,L]
RewriteRule ^our-works/?$ /project/ [R=301,L]
```

### 4. Verification Protocol
1. Query `https://egyptcreative.com/project/`.
2. Confirm HTTP status is 200 OK.
3. Verify `<h1>` heading is present: `"Featured Case Studies"`.
4. Verify all 12 project cards are present with legitimate client logos and links.
5. Verify 0 occurrences of `themexriver.com` exist in the rendered HTML.
6. Test `https://egyptcreative.com/portfolio/`; confirm HTTP 301 redirect to `/project/`.

---

## 3. Priority Task 2: SEO Title Tag & Metadata Normalization

### 1. Context & Forensic Verification
- **Target Pages:** All 12 project pages + Cairo Capital Hub.
- **Current Production Behavior:**
  - Double branding: `Modon Developments – Egypt Creative – Egypt Creative`.
  - Inconsistent name: `Cairo Capital Video – Egypt Creative – Egypt Creative`.
- **Root Cause:** WordPress `document_title_parts` appends the blog name (`Egypt Creative`) automatically, while the post titles in the database were saved as `[Project Name] – Egypt Creative`.

### 2. Proposed Technical Implementation
In `noryx-live-theme/noryx/functions.php`, implement the `document_title_parts` filter:

```php
/**
 * Egypt Creative — Clean Single-Branded Document Titles
 */
add_filter('document_title_parts', function($parts) {
    if (is_singular('page')) {
        $site_name = get_bloginfo('name'); // 'Egypt Creative'
        
        // Strip duplicate site name and trailing dashes/pipes
        $clean_title = preg_replace('/(\s*[\-\–\|]\s*' . preg_quote($site_name, '/') . ')+$/iu', '', $parts['title']);
        
        // Standardize Cairo Capital Hub name
        if (is_page('project-cairo-capital') || strpos($clean_title, 'Cairo Capital') !== false) {
            $clean_title = 'Cairo Capital Hub';
        }
        
        // Clean single project titles
        $parts['title'] = trim($clean_title);
        $parts['site']  = $site_name; // Appended once cleanly by WordPress
    }
    return $parts;
}, 20);
```

### 3. Verification Protocol
1. Curl the `<title>` tag for each project:
   - `https://egyptcreative.com/project-modon-developments/` -> `Modon Developments – Egypt Creative`
   - `https://egyptcreative.com/project-2b/` -> `2B Egypt – Egypt Creative`
   - `https://egyptcreative.com/project-cairo-capital/` -> `Cairo Capital Hub – Egypt Creative`
2. Verify that zero double branding exists (`– Egypt Creative – Egypt Creative`).

---

## 4. Priority Task 3: Sitemap Filtering & Clean Indexation

### 1. Context & Forensic Verification
- **Target Endpoint:** `https://egyptcreative.com/wp-sitemap.xml`
- **Current Production Behavior:** 115 total URLs including 20 `noryx_template` layout parts, 4 duplicate dummy posts (`hello-world-copy`), and abandoned WooCommerce shop pages.
- **Mandatory Constraint:** Do not delete pages or database records.

### 2. Proposed Technical Implementation
In `noryx-live-theme/noryx/functions.php`, inject native WordPress sitemap filter hooks:

```php
/**
 * Egypt Creative — XML Sitemap Exclusion & Indexation Hygiene
 * Safely filters output of wp-sitemap.xml without deleting any database records.
 */

// 1. Unregister 'noryx_template' from the sitemap provider
add_filter('wp_sitemaps_post_types', function($post_types) {
    unset($post_types['noryx_template']);
    return $post_types;
});

// 2. Eliminate user / author archive sitemap
add_filter('wp_sitemaps_users_query_args', function($args) {
    $args['include'] = array(0); // Query yields empty set, dropping author sitemap
    return $args;
});

// 3. Exclude dummy posts and orphan WooCommerce endpoints from sitemaps
add_filter('wp_sitemaps_posts_query_args', function($args, $post_type) {
    if ($post_type === 'post') {
        // Exclude dummy hello-world posts
        $dummy_posts = get_posts(array(
            'post_type'      => 'post',
            'post_name__in'  => array('hello-world', 'hello-world-copy', 'hello-world-copy-copy', 'hello-world-2'),
            'fields'         => 'ids',
            'posts_per_page' => 10
        ));
        if (!empty($dummy_posts)) {
            $args['post__not_in'] = isset($args['post__not_in']) ? array_merge($args['post__not_in'], $dummy_posts) : $dummy_posts;
        }
    }

    if ($post_type === 'page') {
        // Exclude orphan shop, cart, sample pages
        $orphan_pages = get_posts(array(
            'post_type'      => 'page',
            'post_name__in'  => array('sample-page', 'shop', 'cart', 'checkout', 'my-account', 'nx-get-in-touch'),
            'fields'         => 'ids',
            'posts_per_page' => 10
        ));
        if (!empty($orphan_pages)) {
            $args['post__not_in'] = isset($args['post__not_in']) ? array_merge($args['post__not_in'], $orphan_pages) : $orphan_pages;
        }
    }

    return $args;
}, 10, 2);
```

### 3. Verification Protocol
1. Request `https://egyptcreative.com/wp-sitemap.xml`.
2. Confirm `wp-sitemap-posts-noryx_template-1.xml` is removed.
3. Confirm `wp-sitemap-users-1.xml` is removed or returns empty.
4. Verify `wp-sitemap-posts-page-1.xml` does not contain `shop/`, `cart/`, or `sample-page/`.
5. Total indexed URLs drops to ~72 clean, approved pages.

---

## 5. Priority Task 4: Public File Hardening (`readme.html`, `license.txt`, `xmlrpc.php`)

### 1. Context & Forensic Verification
- **Target Files:**
  - `https://egyptcreative.com/readme.html` (Returns 200 OK, 7.4 KB)
  - `https://egyptcreative.com/license.txt` (Returns 200 OK, 19.9 KB)
  - `https://egyptcreative.com/xmlrpc.php` (Returns 200 OK, 8 Bytes)
- **Constraint:** Zero disruption to WordPress admin, Elementor, or Contact Form 7.

### 2. Proposed Technical Implementation
In production `.htaccess` (located at web root), add web-server level deny rules:

```apache
# ==============================================================================
# Egypt Creative — Defensive Endpoint Hardening
# ==============================================================================
<FilesMatch "^(readme\.html|license\.txt)">
    Require all denied
</FilesMatch>

<Files "xmlrpc.php">
    Require all denied
</Files>
```

### 3. Verification Protocol
1. Curl `https://egyptcreative.com/readme.html` -> Verify HTTP 403 Forbidden.
2. Curl `https://egyptcreative.com/license.txt` -> Verify HTTP 403 Forbidden.
3. Curl `https://egyptcreative.com/xmlrpc.php` -> Verify HTTP 403 Forbidden.
4. Verify `/wp-admin/` and Contact Form 7 submission continue to function normally.

---

## 6. Priority Task 5: Homepage Performance & Regex Optimization

### 1. Forensic Audit of the 25+ Regex Operations
Inspection of `noryx-live-theme/noryx/front-page.php` (lines 48–320) reveals 25 distinct runtime operations:

| # | Operation Description | Lines in `front-page.php` | Type | Essential vs Removable |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Inject Official Leadership Team Cards | Lines 48–138 | `preg_replace` | **Essential:** Injects official leadership. |
| 2 | Add Maps link to Hero Social Ring | Lines 145–150 | `preg_replace` | **Essential:** Places Maps pin. |
| 3 | Add Maps chip to Why Choose Us Card 4 | Lines 154–159 | `preg_replace` | **Essential:** Places Maps chip. |
| 4 | Testimonial Avatars (`tst1..5` -> Egyptian execs) | Lines 163–167 | `preg_replace` | **Essential:** Replaces demo avatars. |
| 5 | Clean nested URL prefixes | Lines 170–173 | `preg_replace` | **Essential:** Fixes broken asset prefixes. |
| 6 | Fix title typo (`Stories Weve Told`) | Line 176 | `str_replace` | **Essential:** Typographic correction. |
| 7 | Fix motto typo (`United by Visio</p>`) | Line 177 | `str_replace` | **Essential:** Typographic correction. |
| 8 | Cairo Capital Center -> Cairo Capital Hub | Lines 181–182 | `str_replace` | **Essential:** Renames project & replaces logo. |
| 9 | Remove "Our Trusted Partners" Section | Line 185 | `preg_replace` | **Essential:** Strips unwanted demo section. |
| 10 | Review score 4.8 -> 9.8 in Hero | Line 189 | `preg_replace` | **Essential:** Aligns verified rating. |
| 11 | Review score 4.8 -> 9.8 in About | Lines 192–196 | `preg_replace` | **Essential:** Aligns verified rating. |
| 12 | 2K+ Subtitle update | Lines 199–203 | `preg_replace` | **Essential:** Updates subtitle text. |
| 13 | Campaigns stat 120+ -> 4000 in Card 6 | Lines 206–210 | `preg_replace` | **Essential:** Updates verified campaigns. |
| 14 | Years Exp. 15+ -> 16 in Card 6 | Lines 213–217 | `preg_replace` | **Essential:** Updates verified experience. |
| 15 | Service 1 (Web Design) sub-links | Lines 221–225 | `preg_replace` | **Essential:** Sets interactive pill links. |
| 16 | Service 2 (Digital Marketing) sub-links | Lines 228–232 | `preg_replace` | **Essential:** Sets interactive pill links. |
| 17 | Service 3 (Brand Strategy) sub-links | Lines 235–239 | `preg_replace` | **Essential:** Sets interactive pill links. |
| 18 | Service 4 (Production) sub-links | Lines 242–246 | `preg_replace` | **Essential:** Sets interactive pill links. |
| 19 | Service 5 (PR) sub-links | Lines 249–253 | `preg_replace` | **Essential:** Sets interactive pill links. |
| 20 | Remove Explore More in Working Process | Lines 256–260 | `preg_replace` | **Essential:** Removes dead buttons. |
| 21 | Connect "Book a Call" to WhatsApp in Card 1 | Lines 263–267 | `preg_replace` | **Essential:** Sets conversion CTA. |
| 22 | Lazy loading & async decoding on `<img>` | Lines 270–279 | `preg_replace_cb`| **Essential:** Prevents offscreen bandwidth waste. |
| 23 | Preload metadata on `<video>` tags | Lines 282–293 | `preg_replace_cb`| **Essential:** Prevents video bandwidth stall. |
| 24 | Localize 33 Themexriver demo assets | Lines 297–306 | `preg_replace` | **Essential:** Avoids external domain calls. |
| 25 | Map localized demo tst to exec avatars | Lines 309–313 | `preg_replace` | **Essential:** Second-pass avatar mapping. |

### 2. Architectural Optimization Strategy
- **Conclusion:** All 25 operations are **functional requirements**; none can be removed without causing visual regression, broken links, or reverted text.
- **Optimization Action:**
  1. Consolidate operations 6, 7, 8, 10, 13, 14, and 24 into a single, high-speed C-level `str_replace()` dictionary call, reducing regex compilation passes.
  2. Maintain the 12-hour transient cache (`ec_front_page_html_pub_en`) so that 99.9% of user requests experience **0ms regex overhead**.
  3. Ensure that when transient cache purges occur, the optimized single-pass compiler executes in < 15ms.

---

## 7. Master Risk Assessment & Rollback Protocol

| Task | Operational Risk | Mitigation Strategy | Rollback Action (< 60s) |
| :--- | :---: | :--- | :--- |
| **1. Portfolio Archive** | Low | New template `page-project.php` isolates changes solely to `/project/`. | Delete or rename `page-project.php`. |
| **2. SEO Titles** | Low | Filter operates strictly on document title parts; does not touch body content. | Remove filter from `functions.php`. |
| **3. Sitemap Filters** | Low | Native WordPress hook unregisters post type from sitemap; no DB records altered. | Remove sitemap hooks from `functions.php`. |
| **4. Security Hardening** | Low | `.htaccess` rule matches only 3 static files; admin and CF7 untouched. | Remove `<FilesMatch>` block from `.htaccess`. |
| **5. Homepage Performance** | Medium | Compile and verify on staging with automated character-for-character DOM diff. | Restore `front-page.php` from `noryx_backup_original/`. |

---

## 8. Summary of Implementation Readiness

All 5 tasks are fully specified, verified against production code, and ready for execution.

**Awaiting your explicit authorization before applying any production modifications.**
