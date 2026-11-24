# EGYPT CREATIVE — PRODUCTION FIX & ROLLBACK PLAN

**Target Website:** `https://egyptcreative.com/`  
**Rule:** Every change MUST be tested on local staging (`D:\Antigravity\Projects\egypt-creative\staging-site\egypt-creative`) before production deployment.  
**Date:** November 24, 2026  

---

## Pre-Deployment Global Backup Requirement

Before applying **any** production change:
1. **Database Snapshot:** Download full `.sql.gz` backup of `u656165302_aiptW` from Hostinger hPanel (`Backups -> Database Backups`).
2. **Files Snapshot:** Archive `wp-content/themes/noryx/` and root `.htaccess`.
3. **Export Redirections & Settings:** Export Safe Redirect Manager rules and LiteSpeed Cache settings JSON.

---

## Issue-by-Issue Implementation & Rollback Matrix

### 1. `EC-LIVE-01A` — 18 Identical Portfolio Pages + Duplicate Pairs
- **Current Behavior:** 17 client `/project-*` pages + `/single-project/` display identical `Modon Developments` placeholder text (`1,879` chars, `0` content images). `/project-mohamed-al-sagheer/` duplicates `/project-mohamed-el-sagheer/`.
- **Proposed Change:** Populate unique, owner-approved case study copy & gallery images for each active client page; set `301` redirect from `/project-mohamed-al-sagheer/` -> `/project-mohamed-el-sagheer/` via Safe Redirect Manager; fix double title suffix.
- **Exact Files / WP Records:** `wp_posts` (`post_type = 'page'`, `post_title`, `post_content`), `wp_postmeta` (`_elementor_data`), Safe Redirect Manager CPT (`redirect_rule`).
- **Expected Business Impact:** Eliminates broken client credibility (visitors no longer see Modon Developments when clicking Smile Care or Honor); removes severe duplicate content SEO risk.
- **Risk Level:** **Low** (Content/redirect updates only; Noryx template untouched).
- **Testing Procedure:** Visit every updated `/project-*` URL, verify unique `<h1>`, unique body text, gallery images load `200 OK`, and `/project-mohamed-al-sagheer/` returns `301` to `/project-mohamed-el-sagheer/`.
- **Backup Requirement:** Full `u656165302_aiptW` SQL dump before editing Elementor pages.
- **Rollback Procedure:** Restore individual post revisions via WordPress Revisions UI (`wp_posts` revision ID) or re-import pre-change SQL dump; delete the Safe Redirect Manager rule.

---

### 2. `EC-LIVE-01B` — Sitemap Pollution (25 Demo/Orphan Pages) & `/blog/` Canonical
- **Current Behavior:** `wp-sitemap.xml` advertises 6 `hello-world*` posts, 6 orphan WooCommerce pages, 8 `home-*` variants, 5 utility templates; `/blog/` has `canonical: None`.
- **Proposed Change:** After GSC verification, set unused demo posts/pages to `Draft` (or `noindex` via SEO/meta), add self-canonical + unique title to `/blog/`, and flush rewrite/sitemap cache.
- **Exact Files / WP Records:** `wp_posts` (`post_status`), `noryx/header.php` (canonical logic).
- **Expected Business Impact:** Concentrates crawl budget and domain authority on genuine agency & portfolio URLs.
- **Risk Level:** **Low-Medium** (Must verify GSC traffic/indexation first so no active URL is accidentally drafted).
- **Testing Procedure:** Fetch `/wp-sitemap-posts-page-1.xml` and `/wp-sitemap-posts-post-1.xml` to confirm only approved URLs remain; verify `/blog/` `<link rel="canonical">`.
- **Backup Requirement:** Full `wp_posts` export + list of original `post_status` values.
- **Rollback Procedure:** Change `post_status` back to `publish` in WP Admin and purge LiteSpeed Cache.

---

### 3. `EC-LIVE-06` — Missing Organization / ProfessionalService / Breadcrumb JSON-LD
- **Current Behavior:** `0` `<script type="application/ld+json">` tags across all 72 live URLs.
- **Proposed Change:** Output verified `Organization` / `ProfessionalService` JSON-LD on homepage and `BreadcrumbList` on internal pages via `wp_head` hook.
- **Exact Files / WP Records:** `wp-content/themes/noryx/header.php` or `inc/schema.php` hooked in `functions.php`.
- **Expected Business Impact:** Enables Google Knowledge Graph entity recognition and rich search snippets.
- **Risk Level:** **Low** (Non-visual `<head>` metadata only).
- **Testing Procedure:** Validate live HTML with Schema.org Validator / Rich Results Test syntax parser; confirm zero JSON syntax errors.
- **Backup Requirement:** Backup `noryx/header.php` and `noryx/functions.php`.
- **Rollback Procedure:** Restore original `header.php` / `functions.php` and purge LiteSpeed Cache.

---

### 4. `EC-LIVE-05` — 192.9 KB HTML (67.2 KB Inline SVGs) & 57 CSS/JS Requests
- **Current Behavior:** Homepage HTML is `192,947` bytes (73 inline SVGs = `67,238` bytes); 20 stylesheets + 37 scripts (1 blocking `jquery.min.js` in `<head>`).
- **Proposed Change:** Externalize large/repeated inline SVGs to cached static SVG files/sprite; audit and dequeue unused WooCommerce/demo styles; enable LiteSpeed CSS/JS minification & combination on staging first.
- **Exact Files / WP Records:** `noryx/inc/enqueue-scripts.php`, Elementor SVG widgets, LiteSpeed Cache options (`wp_options`).
- **Expected Business Impact:** Reduces initial HTML weight by ~35% and accelerates FCP/LCP on mobile connections.
- **Risk Level:** **Medium** (CSS/JS combination or jQuery deferral can break Elementor/Slick/GSAP initialization if misordered).
- **Testing Procedure:** Test all interactive components (hero animations, portfolio filter tabs, marquee, CF7, mobile drawer) across 1920px, 1366px, and 390px in staging with 0 console errors before touching production.
- **Backup Requirement:** Backup `enqueue-scripts.php` + export LiteSpeed Cache settings.
- **Rollback Procedure:** Revert `enqueue-scripts.php` and restore LiteSpeed Cache JSON settings, then Purge All.

---

### 5. `EC-LIVE-08` — WordPress/PHP Version Disclosure & Public `readme.html`
- **Current Behavior:** `X-Powered-By: PHP/8.3.37`, `<meta name="generator" content="WordPress 7.1.5">`, `/readme.html` & `/license.txt` return `200 OK`.
- **Proposed Change:** Remove `wp_generator` in `noryx/functions.php`; unset `X-Powered-By` and deny access to `readme.html` / `license.txt` in `.htaccess`.
- **Exact Files / WP Records:** `wp-content/themes/noryx/functions.php`, root `.htaccess`.
- **Expected Business Impact:** Reduces automated vulnerability scanner fingerprinting.
- **Risk Level:** **Low** (Note: test `.htaccess` syntax immediately after upload to avoid 500 error).
- **Testing Procedure:** `HEAD`/`GET` `https://egyptcreative.com/` (verify no `X-Powered-By` or `generator` tag) and `GET /readme.html` (verify `403`).
- **Backup Requirement:** Exact copy of live `.htaccess` and `functions.php`.
- **Rollback Procedure:** Restore backup `.htaccess` and `functions.php` via Hostinger File Manager / FTP.

---

### 6. `EC-LIVE-09` — Root `/favicon.ico` 404 & Non-ASCII Icon Filename
- **Current Behavior:** `/favicon.ico` returns `404`; Site Icon PNGs use `cropped-logo-.ش-*.png`.
- **Proposed Change:** Upload `favicon.ico` to document root and re-select clean ASCII PNG in WP Customizer Site Icon.
- **Exact Files / WP Records:** `public_html/favicon.ico`, `wp_options` (`site_icon`).
- **Expected Business Impact:** Eliminates 404 errors for legacy icon requests and clean ASCII asset URLs.
- **Risk Level:** **Near Zero**.
- **Testing Procedure:** `GET https://egyptcreative.com/favicon.ico` returns `200 OK`; inspect `<link rel="icon">` tags in `<head>`.
- **Backup Requirement:** Record current `site_icon` option ID in `wp_options`.
- **Rollback Procedure:** Delete `favicon.ico` and restore previous `site_icon` ID in WP Customizer.

---

### 7. `EC-LIVE-10` — 13 Missing Image `alt` Attributes
- **Current Behavior:** 13 of 70 homepage `<img>` tags lack `alt` attributes.
- **Proposed Change:** Populate descriptive `alt` text in WP Media Library / Elementor image widgets; use `alt=""` for decorative shapes.
- **Exact Files / WP Records:** `wp_postmeta` (`_wp_attachment_image_alt`), Elementor page JSON (`_elementor_data`).
- **Expected Business Impact:** Improves WCAG 2.2 AA accessibility and Google Image SEO.
- **Risk Level:** **Near Zero**.
- **Testing Procedure:** Re-run DOM `<img>` audit on homepage and verify `missing_alt_count == 0` (excluding `alt=""` decorative images).
- **Backup Requirement:** Database SQL dump (`u656165302_aiptW`).
- **Rollback Procedure:** Restore `_wp_attachment_image_alt` / post revision.
