# EGYPT CREATIVE — LIVE WEBSITE FINAL FIX PRIORITY ROADMAP

**Target Website:** `https://egyptcreative.com/`  
**Basis:** Second-Pass Evidence Validation ([LIVE_AUDIT_EVIDENCE_VALIDATION.md](file:///d:/Antigravity/Projects/egypt-creative/docs/LIVE_AUDIT_EVIDENCE_VALIDATION.md))  
**Date:** November 24, 2026  
**Status:** Read-Only Audit Complete — **Awaiting User Approval Before Any Changes**

---

## 1. Dropped / Non-Issue Items (Removed from Fix Queue)

The following Pass 1 items were **Not Reproduced** during real-origin validation and require **no remediation**:
- ~~`EC-LIVE-02` (Broken Runiga & OMGF Fonts)~~ — All 16 font files return **HTTP 200 OK** under real origin.
- ~~`EC-LIVE-03` (Mobile Horizontal Overflow)~~ — `doc_scroll_width === viewport_width` across 390px, 375px, and 360px (`page_has_horizontal_scroll: False`).
- ~~`EC-LIVE-04` (Contact Form 7 REST API Errors)~~ — `/feedback/schema` and `/refill` return **HTTP 200 OK** with 0 console errors under real origin.

---

## 2. Prioritized Confirmed Issues Matrix

Ranked by **1) Business Impact, 2) User Experience Impact, 3) SEO Impact, 4) Security Risk, 5) Implementation Risk**:

| Priority | Finding ID | Confirmed Issue | Business Impact | UX Impact | SEO Impact | Security Risk | Implementation Risk |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **P1** | **EC-LIVE-01A** | **18 Identical Portfolio Pages + 2 Duplicate Pairs** (`project-*` sharing exact body text with `single-project/`) | **CRITICAL** (Client trust & portfolio credibility) | **HIGH** (Visitors clicking case studies see identical placeholder text) | **CRITICAL** (Severe duplicate content penalty risk) | None | **LOW** (Content population only) |
| **P2** | **EC-LIVE-01B** | **Sitemap Polluted with 25 Demo/Orphan Pages** (6 `hello-world*`, 6 WooCommerce `/shop/`/`/cart/`, 8 `home-*`, 5 utility templates) + `/blog/` missing canonical | **HIGH** (Dilutes agency authority) | **MEDIUM** (Confusing search landing pages) | **CRITICAL** (Wastes crawl budget & dilutes domain relevance) | Low | **LOW** (Verify in GSC first, then draft/noindex) |
| **P3** | **EC-LIVE-06** | **Zero Schema.org JSON-LD** across all 72 pages | **HIGH** (Missing Knowledge Graph & Rich Results) | None | **HIGH** (Reduced SERP CTR & local Cairo visibility) | None | **LOW** (Read-safe `wp_head` JSON-LD injection) |
| **P4** | **EC-LIVE-05** | **192.9 KB HTML + 57 Render-Blocking CSS/JS Files** | **MEDIUM** (Bounce rate on slower mobile networks) | **HIGH** (Slower FCP / LCP / TBT) | **MEDIUM** (Core Web Vitals ranking signal) | None | **MEDIUM** (Must test JS defer order in staging first) |
| **P5** | **EC-LIVE-08** | **PHP 8.3.37 & WP 7.1.5 Version Disclosure + `/readme.html` & `/license.txt` Exposed + Weak CSP** | Low | None | None | **MEDIUM** (Reconnaissance exposure) | **LOW** (`.htaccess` & `remove_action`) |
| **P6** | **EC-LIVE-09** | **Root `/favicon.ico` Returns 404** (Site Icon PNGs work, but `/favicon.ico` is missing & uses Arabic filename) | Low | **LOW** (Legacy bookmarks/bots 404) | **LOW** (Minor crawl 404) | None | **NEAR ZERO** (Upload `favicon.ico` to root) |
| **P7** | **EC-LIVE-10** | **13 Missing Image `alt` Attributes** on Homepage | Low | **MEDIUM** (Screen reader accessibility) | **LOW-MEDIUM** (Image search & WCAG 2.2 AA) | None | **NEAR ZERO** (Media Library metadata edit) |
| **P8** | **EC-LIVE-07** | **Hostinger CDN (`hcdn`) Blocks Headless Lighthouse (403)** | Low | None | **LOW** (Blocks automated monitoring bots) | Protective control | **MEDIUM** (Adjusting WAF/CDN rules requires caution) |

---

## 3. Recommended Execution Sequence (Post-Approval)

1. **Step 1 — Google Search Console Check (Read-Only):** Confirm which of the 72 sitemap URLs are actually indexed by Google before modifying permalinks or status.
2. **Step 2 — Safe SEO & Hygiene Quick Wins (Staging -> Production):**
   - Populate real bilingual case studies for the 18 cloned `/project-*` pages and resolve the 2 duplicate pairs.
   - Draft/noindex demo posts (`hello-world*`), orphan WooCommerce pages, and unused `home-*` variants; fix `/blog/` canonical.
   - Add `Organization` / `ProfessionalService` / `WebSite` JSON-LD schema.
   - Upload root `favicon.ico` and fill the 13 missing image `alt` attributes.
3. **Step 3 — Security Header Hardening:** Strip `X-Powered-By`, remove `wp_generator`, restrict `/readme.html` & `/license.txt`.
4. **Step 4 — Performance Optimization (Staging Verification Required):** Defer non-critical JS, dequeue unused styles, and trim the 192.9 KB HTML payload while preserving 100% of the Noryx visual design.
