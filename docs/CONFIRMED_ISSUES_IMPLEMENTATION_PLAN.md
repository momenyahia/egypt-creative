# EGYPT CREATIVE — CONFIRMED ISSUES IMPLEMENTATION PLAN

**Target Website:** `https://egyptcreative.com/`  
**Design Preservation Rule:** Zero redesign. Strictly preserve Noryx template, layout, typography, colors, animations, and page structure.  
**Status:** Planning Only — **Strict STOP Before Execution**  
**Date:** November 24, 2026  

---

## 1. SEO Corrections Plan (Task 3)

### 1.1 Blog & Duplicate Canonical Strategy (`EC-LIVE-01`)
- **Blog Canonical (`/blog/`):** Live `/blog/` currently outputs `canonical: None` and duplicates the homepage `<title>`.
  - *Plan:* If `/blog/` is retained as the blog posts index, assign a dedicated SEO title (`Blog – Egypt Creative`) and enforce a self-referencing canonical (`https://egyptcreative.com/blog/`) in `header.php` / `wp_head`.
- **Duplicate Project Pair (`/project-mohamed-al-sagheer/` vs `/project-mohamed-el-sagheer/`):**
  - *Plan:* Keep `/project-mohamed-el-sagheer/` as canonical primary URL; configure a `301` redirect via the already-active **Safe Redirect Manager** plugin from `/project-mohamed-al-sagheer/` to `/project-mohamed-el-sagheer/`.
- **Title Double Suffix (`– Egypt Creative – Egypt Creative`):**
  - *Plan:* All 30 project pages currently append `– Egypt Creative` twice. Audit `wp_title` / `document_title_parts` filter in `noryx` or Elementor/page title fields so the site name appears once.

### 1.2 Verified Organization & ProfessionalService JSON-LD Schema (`EC-LIVE-06`)
*(Using **only** verified company data observed on `https://egyptcreative.com/` — zero fabricated addresses, awards, or ratings.)*
- **Target:** `noryx-live-theme/noryx/header.php` (already drafted locally, not yet deployed to production).
- **Verified Entity Fields:**
  - `@type`: `["Organization", "ProfessionalService"]` (or `MarketingAgency`)
  - `name`: `"Egypt Creative"`
  - `url`: `"https://egyptcreative.com/"`
  - `logo`: `"https://egyptcreative.com/wp-content/themes/noryx/assets/img/egypt_creative_white_logo.png"` (or `/assets/img/logo.png`)
  - `telephone`: `"+201044107134"`
  - `email`: `"info@egyptcreative.com"`
  - `address`: `{ "@type": "PostalAddress", "addressLocality": "Cairo", "addressCountry": "EG" }`
  - `sameAs`:
    - `"https://www.linkedin.com/company/egypt-creative-agency"`
    - `"https://www.instagram.com/egypt_creative_agency"`
    - `"https://www.facebook.com/share/1FG6ZDWwwq/?mibextid=wwXIfr"`
    - `"https://wa.me/201044107134"`
- **Internal Pages:** Add `BreadcrumbList` JSON-LD on `/project-*` pages (`Home > Works > [Project Name]`).

### 1.3 Missing Image `alt` Attributes (`EC-LIVE-10`)
- **Current State:** 13 of 70 homepage `<img>` elements lack `alt` attributes.
- **Plan:** Update Media Library `alt` metadata for meaningful brand/client/portfolio images, and explicitly set `alt=""` with `aria-hidden="true"` on purely decorative background shapes.

---

## 2. Minimal-Risk Security Corrections Plan (Task 4)

*(Compatible with Hostinger Cloud/LiteSpeed and WordPress 7.1.5 without modifying global server configuration.)*

| Issue | Current State | Minimal-Risk WordPress / `.htaccess` Fix |
| :--- | :--- | :--- |
| **WordPress Version Disclosure** | `<meta name="generator" content="WordPress 7.1.5">` in HTML `<head>` | Add `remove_action('wp_head', 'wp_generator');` and `add_filter('the_generator', '__return_empty_string');` in `noryx/functions.php`. |
| **PHP Version Disclosure** | `X-Powered-By: PHP/8.3.37` HTTP response header | Add `<IfModule mod_headers.c> Header always unset X-Powered-By </IfModule>` in site root `.htaccess` (if LiteSpeed/Apache permits override; otherwise disable `expose_php` in hPanel PHP Configuration UI). |
| **Public `/readme.html` & `/license.txt`** | Both return `HTTP 200 OK` (7.4 KB & 19.9 KB) | Block public HTTP access via `.htaccess` `<FilesMatch "^(readme\.html|license\.txt)$"> Require all denied </FilesMatch>` (zero impact on WP core or updates). |

---

## 3. Favicon & WordPress Site Icon Plan (Task 5)

- **Current State:**
  - `/favicon.ico` returns **HTTP 404**.
  - WordPress Site Icon PNGs ARE active (`cropped-logo-.ش-32x32.png`, `192x192`, `180x180` returning `200 OK`), **but** their filename contains a non-ASCII Arabic character (`ش`).
- **Existing Verified Brand Assets in Repo:**
  - `D:\Antigravity\Projects\egypt-creative\favicon.ico` (1,059 bytes) & `favicon-32x32.png` (1,059 bytes) & `apple-touch-icon.png` (7,635 bytes) exist in project root.
  - `noryx-live-theme/noryx/assets/img/logo.png` (29,726 bytes) & `egypt_creative_white_logo.png` (4,211 bytes).
- **Plan:**
  1. Upload clean ASCII `favicon.ico` to WordPress document root (`public_html/favicon.ico`) so legacy `/favicon.ico` requests return `200 OK`.
  2. Re-upload a clean ASCII-named 512×512 PNG (e.g., `egypt-creative-site-icon.png`) via **WordPress Admin -> Appearance -> Customize -> Site Identity -> Site Icon** so generated `32x32`, `180x180`, and `192x192` icons have clean ASCII URLs.

---

## 4. Performance Investigation & Measurement Plan (Task 6)

### 4.1 Forensic Breakdown of 192.9 KB HTML & 57 Assets (`EC-LIVE-05`)
- **HTML Document (`192,947` bytes):**
  - **73 inline `<svg>` elements = `67,238` bytes (34.8% of total HTML)** — the single largest contributor to HTML bloat.
  - **Inline `<style>` blocks = `17,809` bytes (9.2%)**.
  - **Inline `<script>` = `373` bytes**.
- **JavaScript (`37` `<script>` tags):**
  - **34 of 37 scripts already have `defer`**.
  - **Only 1 script is parser-blocking in `<head>`:** `wp-includes/js/jquery/jquery.min.js`.
  - Optimization opportunity is **not** "adding defer to 37 scripts", but rather **de-enqueuing unused theme/plugin scripts** (e.g., unused animation libraries or WooCommerce leftovers if WooCommerce is inactive) and **combining/minifying via LiteSpeed Cache**.
- **CSS (`20` `<link rel="stylesheet">` tags):**
  - Opportunities: Audit unused styles (e.g., WooCommerce/unused Elementor widgets) and enable CSS combine/minify + Critical CSS carefully in staging.
- **Inline SVG Externalization:**
  - Moving repeated/large inline SVGs (67.2 KB) to an external cached SVG sprite or `<img>` SVG files shrinks initial HTML by ~35% without changing a single pixel.

### 4.2 Legitimate Alternative Performance Measurement (Lighthouse 403 Workaround)
Because Hostinger CDN (`hcdn`) returns `HTTP 403` to headless Lighthouse CLI (`v13.6.0`), scores are **not** fabricated. Legitimate alternatives without bypassing security controls:
1. **Interactive Chrome DevTools Lighthouse:** Run Lighthouse directly inside a real user's desktop Chrome session (which passes standard browser checks normally).
2. **Google Search Console Core Web Vitals (CrUX):** Inspect real-user field metrics (LCP, INP, CLS) in GSC.
3. **Local Staging Parity Benchmark:** Run Lighthouse CLI against the local staging mirror (`http://127.0.0.1:10004/`) once production DB + theme are imported, to measure before/after deltas accurately.
