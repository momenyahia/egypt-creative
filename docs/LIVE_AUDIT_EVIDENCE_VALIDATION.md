# EGYPT CREATIVE — LIVE AUDIT EVIDENCE VALIDATION LEDGER

**Target Website:** `https://egyptcreative.com/`  
**Validation Date:** November 24, 2026  
**Audit Mode:** 100% Read-Only Second-Pass Forensic Validation  
**Purpose:** Independently verify, reproduce, or refute every major claim from the Pass 1 audit using direct HTTP telemetry, real-origin Playwright rendering, full 72-URL sitemap inspection, and Lighthouse CLI execution.

---

## 1. Executive Summary of Validation Outcomes

Second-pass validation uncovered **three critical false positives** from Pass 1 caused by `page.set_content()` running under an `about:blank` (`origin: null`) context, while **confirming and deepening** the SEO, Sitemap, Duplicate Content, Schema, and Information Disclosure findings:

| Status | Count | Findings |
| :--- | :---: | :--- |
| **Confirmed** | **6** | `EC-LIVE-01` (Sitemap & Duplicate Junk — **worse than initially reported: 18 identical portfolio pages**), `EC-LIVE-05` (HTML & Asset Overhead), `EC-LIVE-06` (0 Schema JSON-LD across all 72 pages), `EC-LIVE-07` (Lighthouse 403 CDN Challenge), `EC-LIVE-08` (PHP/WP Version Exposure & `readme.html`), `EC-LIVE-10` (13 Missing Image Alts) |
| **Partially Confirmed** | **1** | `EC-LIVE-09` (`/favicon.ico` returns 404, **but** WordPress Site Icon PNGs are configured and return 200 OK) |
| **Not Reproduced** | **3** | `EC-LIVE-02` (Fonts load 200 OK under real origin), `EC-LIVE-03` (0 page-level horizontal scroll on 390px, 375px, 360px), `EC-LIVE-04` (CF7 REST API endpoints return 200 OK under real origin) |

---

## 2. Detailed Evidence Ledger

### Finding EC-LIVE-01 — Sitemap Pollution & Massive Duplicate Content
- **Original Claim:** 72 live URLs in `wp-sitemap.xml` containing 6 duplicate `hello-world` posts, orphan WooCommerce pages, and demo homepages.
- **Validation Result:** **CONFIRMED (Severity Upgraded — 18 Identical Portfolio Pages Found)**
- **Exact Evidence:**
  - Crawled all **72 URLs** from `wp-sitemap-posts-page-1.xml` (61 URLs) and `wp-sitemap-posts-post-1.xml` (11 URLs).
  - **72/72** return `HTTP 200 OK`, `robots_meta: max-image-preview:large`, `X-Robots-Tag: None` (all 72 are advertised as indexable).
  - **Exact Body Duplicate Group 1 (MD5 `0c895a9123` — 18 URLs):** `single-project/` and **17 portfolio pages** (`project-75-mall/`, `project-aswaq-developments/`, `project-azzam-developments/`, `project-capital-dubai-mall/`, `project-dr-ahmed-abogabal/`, `project-dr-heba/`, `project-halo-clinics/`, `project-honor/`, `project-intercontinental/`, `project-ki-scissors/`, `project-modon-developments/`, `project-sama-beirut/`, `project-samak-day/`, `project-sedar-global/`, `project-senara-restaurant/`, `project-smile-care/`, `project-sultan-al-mandi/`) serve **identical body text**.
  - **Exact Body Duplicate Group 2 (MD5 `028dcea011` — 2 URLs):** `project-mohamed-al-sagheer/` and `project-mohamed-el-sagheer/`.
  - **Exact Body Duplicate Group 3 (MD5 `ed68a96bbe` — 2 URLs):** `project-yves-saint-laurent/` and `project-ywaves/`.
  - **6 Demo Blog Posts:** `hello-world/`, `hello-world-2/`, `hello-world-copy/` through `hello-world-copy-copy-copy-copy/`.
  - **6 Orphan WooCommerce Pages:** `cart/`, `checkout/`, `compare/`, `my-account/`, `shop/`, `wishlist/`.
  - **8 Theme Demo Homepages:** `home-1-dark/`, `home-1-onepage/`, `home-2/`, `home-2-light/`, `home-2-onepage/`, `home-3/`, `home-3-dark/`, `home-3-onepage/`.
  - **5 Template/Utility Pages:** `sample-page/`, `single-project/`, `single-service/`, `single-team/`, `nx-get-in-touch/`.
  - **Canonical Mismatch:** `https://egyptcreative.com/blog/` has `canonical: None`.
- **Google Indexation Distinction:**
  - **Sitemap URLs:** 72 URLs confirmed in `wp-sitemap.xml`.
  - **Confirmed Indexed by Google:** **Unverified** (Google Search Console access is required; automated Google scraping is CAPTCHA-gated).
  - **Needs GSC Verification:** Exact index count of `/hello-world*`, `/shop/`, `/home-*`, and the 18 duplicate `/project-*` pages in Google Search Console.
- **Log Reference:** `scratch/val_sitemap_72.json`
- **Confidence:** High (100% direct HTTP/DOM measurement)
- **Recommended Next Action:** Verify indexed URLs in Google Search Console, then draft/noindex demo & WooCommerce junk and populate unique content for the 18 cloned portfolio pages.

---

### Finding EC-LIVE-02 — Brand Font (`Runiga.woff`) & OMGF Font Failures
- **Original Claim:** `Runiga.woff` and 7 OMGF Google Fonts fail to load (`net::ERR_FAILED`), triggering FOIT/FOUT.
- **Validation Result:** **NOT REPRODUCED**
- **Exact Evidence:**
  - Direct `GET` requests with `Origin: https://egyptcreative.com` returned **HTTP 200 OK** for all **16** `@font-face` font URLs referenced across the theme's 79 `@font-face` rules:
    - `https://egyptcreative.com/wp-content/themes/noryx/assets/fonts/Runiga.woff` -> **200 OK** (`application/font-woff`)
    - `https://egyptcreative.com/wp-content/themes/noryx/assets/fonts/fa-solid-900.woff2` -> **200 OK** (`font/woff2`)
    - `https://egyptcreative.com/wp-content/themes/noryx/assets/fonts/fa-solid-900.ttf` -> **200 OK** (`application/x-font-ttf`)
    - All 13 OMGF local fonts (`roboto`, `robotoslab`, `inter`, `space-grotesk`, `squada-one`, `syne`) -> **200 OK** (`font/woff2`).
  - `Access-Control-Allow-Origin` header is `None` (same-origin only).
  - Pass 1's CORS errors were an artifact of Playwright's `page.set_content()` executing from `about:blank` (`origin: null`). When re-tested in Pass 2 using `page.route()` under the real `https://egyptcreative.com/` origin, **0 console errors** occurred.
- **URL / Log Reference:** `scratch/val_fonts_cf7_icons.json`, `scratch/val_mobile_overflow.json`
- **Confidence:** High
- **Recommended Next Action:** No emergency font fix required. Keep `Access-Control-Allow-Origin` on `.htaccess` only as a future-proofing measure if a separate CDN hostname is introduced.

---

### Finding EC-LIVE-03 — Mobile Horizontal Overflow (390×844, 375×812, 360×800)
- **Original Claim:** 19–20 DOM elements exceed viewport width, producing horizontal scrolling and broken touch margins.
- **Validation Result:** **NOT REPRODUCED (Page-level horizontal scroll is `False`)**
- **Exact Evidence:**
  - Re-tested under real `https://egyptcreative.com/` origin:
    - **390 × 844:** `doc_scroll_width = 390`, `body_scroll_width = 390`, `page_has_horizontal_scroll = False`.
    - **375 × 812:** `doc_scroll_width = 375`, `body_scroll_width = 375`, `page_has_horizontal_scroll = False`.
    - **360 × 800:** `doc_scroll_width = 360`, `body_scroll_width = 360`, `page_has_horizontal_scroll = False`.
  - Why 13–14 elements had `getBoundingClientRect().right > viewport_width`: Every flagged element sits inside a parent container with `overflow-x: hidden` or `overflow-x: auto`:
    - `div.js-marquee-wrapper` (`width: 100000`) inside `div.nx-testi1-marquee.over-hidden` (`overflow-x: hidden`).
    - `div.wc-img1.position-absolute`, `span.nx-step-shape.position-absolute`, `span.nx-get-in-shape.position-absolute` inside `overflow-x: hidden` parent cards.
    - `button.ec-legal-tab-btn` inside `div.ec-legal-modal-tabs` (`overflow-x: auto` scrollable modal tab bar).
- **Screenshots:**
  - `docs/audit_screenshots/validation_pass2/mobile_390x844_viewport.png` & `_fullpage.png`
  - `docs/audit_screenshots/validation_pass2/mobile_375x812_viewport.png` & `_fullpage.png`
  - `docs/audit_screenshots/validation_pass2/mobile_360x800_viewport.png` & `_fullpage.png`
- **Confidence:** High
- **Recommended Next Action:** Close as non-issue; do **not** apply blanket `overflow-x: hidden` on `body`.

---

### Finding EC-LIVE-04 — Contact Form 7 Background REST API Failure
- **Original Claim:** Contact Form 7 client scripts fail to fetch `/feedback/schema` and `/refill` (`net::ERR_FAILED`).
- **Validation Result:** **NOT REPRODUCED**
- **Exact Evidence:**
  - Form markup verified: `action="/wpcf7-f6-o1"`, `method="post"`, `class="wpcf7-form init"`, `_wpcf7="6"`, `_wpcf7_version="6.2.5"`.
  - `GET https://egyptcreative.com/wp-json/contact-form-7/v1/contact-forms/6/feedback/schema` -> **HTTP 200 OK** (`{"version":"SWV Core 2026-09-20","locale":"en_US",...}`).
  - `GET https://egyptcreative.com/wp-json/contact-form-7/v1/contact-forms/6/refill` -> **HTTP 200 OK** (`[]`).
  - Under real origin in Playwright, **0 console errors** occur. Pass 1 failure was caused by `origin: null`.
  - Conclusion: Form initializes cleanly and background REST API calls succeed. (Actual email delivery was not triggered per read-only safety rule.)
- **Log Reference:** `scratch/val_fonts_cf7_icons.json`
- **Confidence:** High
- **Recommended Next Action:** No REST API fix needed; optionally test form mail delivery in staging.

---

### Finding EC-LIVE-05 — Heavy HTML Payload & Render-Blocking Asset Overhead
- **Original Claim:** 192.9 KB HTML payload, 37 `<script>` tags, 20 `<link rel="stylesheet">` tags.
- **Validation Result:** **CONFIRMED**
- **Exact Evidence:**
  - Measured homepage HTML document size: **192,917 bytes** (`188.4 KiB`).
  - Enqueued scripts: **37** `<script src="...">` tags; stylesheets: **20** `<link rel="stylesheet">` tags.
- **Log Reference:** `scratch/audit_seo_tech_security_results.json`
- **Confidence:** High
- **Recommended Next Action:** Defer non-critical scripts and consolidate/minify CSS in staging after approval.

---

### Finding EC-LIVE-06 — Zero Schema.org JSON-LD Structured Data
- **Original Claim:** Zero `<script type="application/ld+json">` on homepage.
- **Validation Result:** **CONFIRMED (Across ALL 72 Pages)**
- **Exact Evidence:** Inspected all 72 URLs in `wp-sitemap.xml`; `Pages WITH JSON-LD: []` (0 out of 72 pages contain structured data).
- **Log Reference:** `scratch/val_sitemap_72.json`
- **Confidence:** High
- **Recommended Next Action:** Implement `Organization` / `ProfessionalService` / `WebSite` JSON-LD on homepage and `CreativeWork` / `BreadcrumbList` on portfolio pages.

---

### Finding EC-LIVE-07 — Lighthouse CLI Blocked by Hostinger CDN (HTTP 403)
- **Original Claim:** Lighthouse CLI exits with code 1 (`Status code: 403`).
- **Validation Result:** **CONFIRMED (Both Mobile & Desktop Blocked)**
- **Exact Evidence:**
  - **Lighthouse Version:** `13.6.0`
  - **Measurement Date:** November 24, 2026
  - **Mobile Command:** `npx lighthouse https://egyptcreative.com/ --output=json --output-path=scratch/lighthouse_live_mobile.json --chrome-flags="--headless --no-sandbox" --quiet` -> Exit Code 1 (`Status code: 403`).
  - **Desktop Command:** `npx lighthouse https://egyptcreative.com/ --preset=desktop --output=json --output-path=scratch/lighthouse_val_desktop.json --chrome-flags="--headless --no-sandbox" --quiet` -> Exit Code 1 (`Status code: 403`).
  - **Root Cause:** Hostinger CDN (`server: hcdn`) serves a bot-challenge HTML page (`Checking your browser before accessing. Just a moment...`) with HTTP 403 to headless Chrome.
  - **Score Policy:** No Lighthouse scores are invented or estimated.
- **Confidence:** High
- **Recommended Next Action:** Run Lighthouse via authenticated PageSpeed Insights UI or against local staging once production DB is imported.

---

### Finding EC-LIVE-08 — WordPress/PHP Version Exposure & Sensitive Paths
- **Original Claim:** `X-Powered-By: PHP/8.3.37`, WP 7.1.5 generator tag, `/readme.html` exposed; `/xmlrpc.php` and `/wp-json/wp/v2/users` blocked.
- **Validation Result:** **CONFIRMED**
- **Exact Evidence:**
  - `X-Powered-By: PHP/8.3.37` header present on HTTP 200 responses.
  - `<meta name="generator" content="WordPress 7.1.5">` present in HTML.
  - `/readme.html` -> **HTTP 200** (7,407 bytes); `/license.txt` -> **HTTP 200** (19,903 bytes).
  - `/xmlrpc.php`, `/wp-json/wp/v2/users`, `/.env`, `/.git/HEAD`, `/wp-config.php` -> **HTTP 403**.
  - TLSv1.3 (`TLS_AES_256_GCM_SHA384`), HSTS `max-age=63072000`, Let's Encrypt valid until Jan 17, 2027.
  - `/wp-json/` exposes 333 REST routes publicly.
- **Log Reference:** `scratch/audit_seo_tech_security_results.json`
- **Confidence:** High
- **Recommended Next Action:** Strip `X-Powered-By` and `wp_generator`, and block `/readme.html` and `/license.txt`.

---

### Finding EC-LIVE-09 — Root `/favicon.ico` 404 vs WordPress Site Icon PNGs
- **Original Claim:** Root favicon returns HTTP 404, causing missing browser tab icon.
- **Validation Result:** **PARTIALLY CONFIRMED**
- **Exact Evidence:**
  - `https://egyptcreative.com/favicon.ico` returns **HTTP 404**.
  - **However**, WordPress Site Icon `<link>` tags ARE present in `<head>` and all 3 PNG files return **HTTP 200 OK**:
    - `https://egyptcreative.com/wp-content/uploads/2026/10/cropped-logo-.%D8%B4-32x32.png` (200 OK, 826 bytes)
    - `https://egyptcreative.com/wp-content/uploads/2026/10/cropped-logo-.%D8%B4-192x192.png` (200 OK, 4,670 bytes)
    - `https://egyptcreative.com/wp-content/uploads/2026/10/cropped-logo-.%D8%B4-180x180.png` (200 OK, 4,295 bytes)
  - Note: Filename contains non-ASCII Arabic character `ش`. Modern browsers render the PNG icon, while legacy requests to `/favicon.ico` get 404.
- **Confidence:** High
- **Recommended Next Action:** Upload a clean ASCII `favicon.ico` to web root so `/favicon.ico` returns 200 OK.

---

### Finding EC-LIVE-10 — Missing Image `alt` Attributes
- **Original Claim:** 13 out of 70 homepage images lack `alt` attributes.
- **Validation Result:** **CONFIRMED**
- **Exact Evidence:** `Images Total: 70`, `With Alt: 57`, `Missing Alt: 13`.
- **Confidence:** High
- **Recommended Next Action:** Populate descriptive `alt` text on portfolio/logo images and `alt=""` on purely decorative shapes.
