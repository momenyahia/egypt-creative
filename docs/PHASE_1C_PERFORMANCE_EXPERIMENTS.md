# EGYPT CREATIVE — PHASE 1C PERFORMANCE INVESTIGATION & STAGING EXPERIMENTS

**Target:** Local WordPress Staging (`http://127.0.0.1:10004/`) + Live Production HTML Forensics (`https://egyptcreative.com/`)  
**Tooling:** Lighthouse CLI `v13.6.0`, Playwright Headless Chromium, BeautifulSoup DOM Byte Profiler  
**Date:** November 24, 2026  

---

## 1. Forensic Breakdown of Live Production Assets

| Asset Category | Measured Live Count / Size | Key Breakdown & Root Cause |
| :--- | :---: | :--- |
| **Inline `<svg>` Elements** | **73 SVGs (`67,238` bytes)** | Accounts for **34.8%** of the `192,947`-byte homepage HTML. Largest single SVGs are `3,993`, `3,133`, and `2,016` bytes (repeated decorative icons/badges). |
| **Inline `<style>` Blocks** | **9 blocks (`17,809` bytes)** | `#global-styles-inline-css` (`10,239` B), `#elementor-frontend-inline-css` (`4,609` B), `#wp-custom-css` (`1,474` B), `#classic-theme-styles-inline-css` (`348` B), `#noryx-theme-custom-style-inline-css` (`168` B). |
| **jQuery in `<head>`** | **1 blocking script** | Out of `37` `<script>` tags on live, `34` already have `defer`; **only `wp-includes/js/jquery/jquery.min.js` is parser-blocking in `<head>`**. |
| **Stylesheets & Scripts** | **20 CSS + 37 JS (`57` requests)** | Mobile Lighthouse baseline flags **`779 KiB` unused CSS** and **`333 KiB` unused JS** (`1,526 KiB` total staging page weight). |

---

## 2. Controlled Experiments on Local Staging (`http://127.0.0.1:10004/`)

### Baseline Measurements (Before Experiment)
- **Desktop Baseline (Lighthouse 13.6.0):** Performance **87** | SEO **92** | A11y **98** | BP **100** | FCP `1.6 s` | LCP `1.6 s` | TBT `0 ms` | CLS `0.003` | Speed Index `1.6 s`
- **Mobile Baseline (Lighthouse 13.6.0):** Performance **57** | SEO **92** | A11y **98** | BP **100** | FCP `8.4 s` | LCP `8.4 s` | TBT `40 ms` | CLS `0` | Speed Index `8.4 s`

### Experiment 1: Defer `jquery-core`, `jquery-migrate`, and Theme/GSAP Footer Scripts
- **Change Tested (`staging-site/.../noryx/inc/enqueue-scripts.php`):** Added `jquery-core`, `jquery-migrate`, `bootstrap-bundle`, `swiper-bundle`, `SplitText`, `split-type`, `gsap`, `CustomEase`, `ScrollTrigger`, `lenis` to the `script_loader_tag` `defer` list.
- **Visual & JS Functionality Check (Playwright across 1920px, 1366px, 390px, 375px):**
  - **0 JavaScript console errors**, **0 broken images**, **0 horizontal overflow**.
- **Measured Mobile Lighthouse Comparison:**

| Metric | Mobile Baseline | Mobile Exp 1 (Defer jQuery + Theme JS) | Delta |
| :--- | :---: | :---: | :---: |
| **Performance Score** | **57** | **60** | **+3** |
| **First Contentful Paint (FCP)** | `8.4 s` | **`5.9 s`** | **-2.5 s (-29.8%)** |
| **Speed Index** | `8.4 s` | **`5.9 s`** | **-2.5 s (-29.8%)** |
| **Total Blocking Time (TBT)** | `40 ms` | **`10 ms`** | **-30 ms (-75%)** |
| **Largest Contentful Paint (LCP)**| `8.4 s` | `9.6 s` | +1.2 s (CSS-bound) |
| **Cumulative Layout Shift (CLS)**| `0` | `0` | Unchanged |

### Key Experimental Conclusion
1. Deferring `jquery-core` and Noryx/GSAP scripts on staging is **safe (`0` console errors)** and cuts Mobile FCP & Speed Index by **2.5 seconds**.
2. However, **Mobile LCP remains at 8.4s–9.6s** because the browser is still blocked by **20 render-blocking CSS stylesheets (`779 KiB` unused CSS)** and large inline SVGs (`67.2 KB`).
3. **Recommended Next Experiment (Phase 2):** Externalize the top 10 largest inline SVGs to cached `.svg` assets and dequeue/combine unused CSS (`e-animations`, `magnific-popup`, `nice-select`, `global-styles`) via LiteSpeed/theme hooks in staging.
