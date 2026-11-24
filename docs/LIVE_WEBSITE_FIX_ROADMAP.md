# EGYPT CREATIVE — LIVE WEBSITE FORENSIC REMEDIATION ROADMAP

**Project:** Egypt Creative Production Website (`https://egyptcreative.com/`)  
**Core Non-Negotiable Directive:** STRICTLY PRESERVE THE APPROVED NORYX TEMPLATE, COLORS, AND CREATIVE IDENTITY (NO REDESIGN).  
**Roadmap Objective:** Step-by-Step Technical Rectification, Performance Optimization, SEO Cleanup, and Security Hardening.  
**Date:** November 24, 2026  

---

## 1. Remediation Prioritization Framework

All issues identified during the live forensic audit are mapped into a 4-tier risk/impact matrix:

```
HIGH IMPACT
   ▲
   │   [P1] Font Fixes & CORS            [P2] Sitemap & Junk De-index
   │   [P3] Mobile Overflow Fix          [P4] Schema JSON-LD Structured Data
   │   [P5] CF7 REST API Fix             [P6] 57 Asset Deferral / Minification
   │
   │   [P7] Missing Favicon (404)        [P8] 13 Missing Image Alts
   │   [P9] Version Info Leakage         [P10] CSP Hardening
   ▼
LOW IMPACT ────────────────────────────────────────────────────────► HIGH EFFORT
```

---

## 2. Phase 1: Critical Immediate Fixes (Severity: Critical | Risk: Near Zero)

### Task 1.1 — Fix Broken Corporate Fonts & CORS Headers (EC-LIVE-02)
- **Target:** `Runiga.woff`, `fa-solid-900.woff2`, and OMGF Google Fonts.
- **Action:**
  1. Add proper CORS headers to `.htaccess` on Hostinger:
     ```apache
     <FilesMatch "\.(ttf|ttc|otf|eot|woff|woff2|font.css|css|js)$">
         Header set Access-Control-Allow-Origin "*"
     </FilesMatch>
     ```
  2. Ensure font files exist in `wp-content/themes/noryx/assets/fonts/` and replace missing OMGF paths with inline optimized `@font-face` definitions using `font-display: swap`.
- **Outcome:** Eliminates console errors; restores original brand typography; eliminates visual FOUT/FOIT.

### Task 1.2 — Purge Sitemap & De-index Template/Duplicate Junk (EC-LIVE-01)
- **Target:** 6 duplicate `hello-world` posts, 6 orphaned WooCommerce pages, 8 demo homepages.
- **Action:**
  1. Delete or unpublish the 6 duplicate posts (`hello-world-copy-*`).
  2. Set `noindex, nofollow` or draft status on WooCommerce orphan pages (`/shop/`, `/cart/`, `/checkout/`, `/compare/`, `/wishlist/`).
  3. Delete/draft unused template pages (`home-1-dark`, `home-2`, `home-3`, `sample-page`).
  4. Regenerate `wp-sitemap.xml` so only authentic company pages and verified portfolio case studies remain.
- **Outcome:** Protects SEO domain authority; prevents Google penalties for duplicate demo content.

### Task 1.3 — Eliminate Mobile Horizontal Overflow (EC-LIVE-03)
- **Target:** Mobile viewports (390px, 375px).
- **Action:**
  1. Add responsive containment to theme CSS:
     ```css
     html, body {
         overflow-x: clip;
         max-width: 100vw;
     }
     .nx-step1-wrapper, .slick-track, .badge-container {
         max-width: 100%;
         box-sizing: border-box;
     }
     ```
  2. Constrain fixed badge padding on screens `< 576px`.
- **Outcome:** 100% stable touch scrolling on iPhones and Android devices with zero horizontal sway.

---

## 3. Phase 2: High-Priority Quality & SEO Enhancements (Severity: High | Risk: Low)

### Task 2.1 — Implement Comprehensive Schema.org JSON-LD (EC-LIVE-06)
- **Target:** Homepage & Portfolio Case Studies.
- **Action:** Inject structured data via `wp_head`:
  - `Organization` (Legal name, official logo, founding date, verified social media handles).
  - `LocalBusiness` / `ProfessionalService` (Cairo office coordinates, phone `+201044107134`, email, opening hours).
  - `WebSite` Schema with sitename and target URL.
- **Outcome:** Qualifies Egypt Creative for Google Knowledge Graph, rich snippets, and enhanced CTR.

### Task 2.2 — Resolve Contact Form 7 REST API Fetch Failures (EC-LIVE-04)
- **Target:** Front-end form initialization on `/wp-json/contact-form-7/v1/`.
- **Action:**
  1. Verify REST API routing in LiteSpeed Cache settings.
  2. Whitelist CF7 endpoints from edge bot challenges or switch form initialization to standard AJAX fallback.
- **Outcome:** Guaranteed lead submission delivery across all visitor browsers.

### Task 2.3 — Restore Root Favicon (EC-LIVE-09)
- **Target:** `https://egyptcreative.com/favicon.ico`.
- **Action:** Place a 32x32 / multi-resolution `favicon.ico` in the WordPress root directory and link `<link rel="icon">` in the theme header.
- **Outcome:** Eliminates 404 console errors; displays Egypt Creative brand logo in browser tabs.

### Task 2.4 — Populate Missing Image Alt Attributes (EC-LIVE-10)
- **Target:** 13 decorative and client logo images lacking `alt` tags.
- **Action:** Update Media Library entries and theme template tags with descriptive bilingual alt text.
- **Outcome:** Enhances WCAG 2.2 AA accessibility and Google Image search discoverability.

---

## 4. Phase 3: Performance & Asset Optimization (Severity: Medium | Risk: Low)

### Task 3.1 — Defer & Consolidate Enqueued Scripts (EC-LIVE-05)
- **Target:** 37 `<script>` tags and 20 `<link rel="stylesheet">` tags.
- **Action:**
  1. Add `defer` or `async` attributes to non-critical scripts (WOW.js, Slick slider, Waypoints).
  2. De-enqueue unused styles (WooCommerce legacy styles, block library styles if unused).
  3. Minify and combine core theme stylesheets.
- **Outcome:** Reduces render-blocking time; accelerates FCP and LCP by up to 60%.

### Task 3.2 — Compress Initial HTML Payload
- **Target:** Initial 192.9 KB HTML response.
- **Action:**
  1. Externalize large inline SVG icons into an SVG sprite sheet (`assets/icons/sprite.svg`).
  2. Remove redundant HTML comments and whitespace.
- **Outcome:** Shrinks initial HTML from 192.9 KB down to ~45 KB, drastically improving First Contentful Paint.

---

## 5. Phase 4: Security Hardening & Hygiene (Severity: Medium/Low | Risk: Near Zero)

### Task 4.1 — Mask Information Disclosure Headers (EC-LIVE-08)
- **Target:** `X-Powered-By` and `generator` meta tag.
- **Action:**
  1. In `.htaccess`:
     ```apache
     Header unset X-Powered-By
     ```
  2. In `functions.php`:
     ```php
     remove_action('wp_head', 'wp_generator');
     ```
  3. Restrict public access to `/readme.html` and `/license.txt`.
- **Outcome:** Blocks automated reconnaissance bots from identifying exact PHP and WordPress versions.

### Task 4.2 — Strengthen Content Security Policy (CSP)
- **Target:** Response header `Content-Security-Policy`.
- **Action:** Expand beyond `upgrade-insecure-requests;` to define explicit trusted sources for scripts, styles, and fonts.
- **Outcome:** Hardens website against XSS and unauthorized script injection.

---

## 6. Implementation Safety & Rollback Verification Protocol

For every task executed during future remediation:
1. **Never edit files directly on the live server.** Test in local staging first.
2. **Verify browser rendering at all 7 viewports** after every CSS/JS modification.
3. **Confirm zero visual drift** to strictly preserve the approved Noryx template.
4. **Take database and file snapshots** before applying changes to production.
