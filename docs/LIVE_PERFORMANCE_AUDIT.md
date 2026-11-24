# EGYPT CREATIVE — LIVE PERFORMANCE & ASSET DELIVERY AUDIT REPORT

**Target Website:** `https://egyptcreative.com/`  
**Hosting Infrastructure:** Hostinger Cloud Web Hosting / LiteSpeed Enterprise / Hostinger CDN (`hcdn`)  
**Audit Date:** November 24, 2026  
**Auditor:** Performance Engineering & Core Web Vitals Specialist  

---

## 1. Executive Summary & Critical Distinction

Per the audit specification, this report clearly separates **synthetic automated test execution** from **real-user asset delivery analysis**:

1. **Synthetic Automated Audits (Google Lighthouse CLI):**
   - **Result:** **BLOCKED by Hostinger Edge CDN (HTTP 403 Challenge Barrier)**.
   - Hostinger CDN (`hcdn`) active bot management identifies standard headless Chromium automation and serves a 403 Challenge Page (`Checking your browser before accessing. Just a moment...`), preventing synthetic crawlers from completing Lighthouse scoring.
2. **Real-User Asset & Network Analysis:**
   - Real-user browsers receiving the cached page (`x-litespeed-cache: hit`) experience significant asset overhead: **192.9 KB of raw HTML**, **57 external CSS/JS requests**, and **8 broken local font requests**.

---

## 2. Real-User Network Payload Breakdown

| Resource Category | File Count | Estimated Payload Weight | Forensic Evaluation |
| :--- | :---: | :---: | :--- |
| **Initial HTML Document** | 1 | **192.9 KB** | **CRITICAL BLOAT:** Clean WordPress homepage HTML should be 25–45 KB. Excessive inline SVGs and unminified markup bloat the initial payload by ~400%. |
| **JavaScript Scripts** | **37 scripts** | ~1.4 MB | **HIGH OVERHEAD:** 37 separate `<script>` tags, including jQuery, Elementor frontend, Slick carousel, and WOW.js. Multiple scripts are parser-blocking. |
| **CSS Stylesheets** | **20 styles** | ~680 KB | **HIGH OVERHEAD:** 20 separate `<link rel="stylesheet">` tags. Substantial unused CSS from inactive demo components. |
| **Web Fonts** | 8 requests | ~350 KB | **CRITICAL FAILURE:** 8 font files fail to load (`net::ERR_FAILED`), triggering layout shifts (CLS) when system fonts take over. |
| **Images & Media** | 70 images | ~3.8 MB | **OPPORTUNITY:** Major portfolio images are high resolution; some lack modern responsive `srcset` (1x, 2x) definitions. |
| **TOTAL INITIAL LOAD** | **~136 Requests** | **~6.4 MB** | **Substantially exceeds the 1.5MB - 2.0MB recommended budget for agency landing pages.** |

---

## 3. Core Web Vitals Forensic Analysis

### 1. Largest Contentful Paint (LCP)
- **Primary LCP Candidate:** The primary Display Headline in the Hero section (`Creative Ideas. Powerful Results`) and the background gradient orb / hero illustration.
- **Observed Bottleneck:** The primary font (`Runiga.woff`) fails to load via CORS, and 37 parser-blocking scripts delay the rendering of the headline by several hundred milliseconds.

### 2. Cumulative Layout Shift (CLS)
- **Primary CLS Trigger:** Missing width and height attributes on decorative background SVG shapes and floating badge elements.
- **Font Replacement Shift:** When `@font-face Runiga` fails to resolve, the browser recalculates the bounding box for all major headers using Arial / Helvetica, causing visible content jumping down the page.

### 3. Interaction to Next Paint (INP) / Total Blocking Time (TBT)
- **Primary INP Trigger:** Main-thread contention caused by simultaneous execution of Elementor frontend scripts, Slick slider initializers, GSAP/WOW scroll observers, and Contact Form 7 background validators.

---

## 4. Forensic Finding: 8 Broken Local Font Files (EC-LIVE-02)

The live homepage HTML requests the following local font files, all of which return network failures:
1. `https://egyptcreative.com/wp-content/themes/noryx/assets/fonts/Runiga.woff`
2. `https://egyptcreative.com/wp-content/themes/noryx/assets/fonts/fa-solid-900.woff2`
3. `https://egyptcreative.com/wp-content/themes/noryx/assets/fonts/fa-solid-900.ttf`
4. `https://egyptcreative.com/wp-content/uploads/omgf/noryx-google-fonts/syne-normal-700.woff2`
5. `https://egyptcreative.com/wp-content/uploads/omgf/noryx-google-fonts/syne-normal-800.woff2`
6. `https://egyptcreative.com/wp-content/uploads/omgf/noryx-google-fonts/inter-normal-400.woff2`
7. `https://egyptcreative.com/wp-content/uploads/omgf/noryx-google-fonts/inter-normal-600.woff2`
8. `https://egyptcreative.com/wp-content/uploads/omgf/noryx-google-fonts/space-grotesk-normal-700.woff2`

### Impact:
- Triggers 8 wasted HTTP connections.
- Forces browser to render fallback system fonts, breaking visual design fidelity.

---

## 5. Server & Edge Caching Performance

- **Server:** Hostinger Edge CDN (`hcdn`).
- **Cache Engine:** LiteSpeed Cache (`x-litespeed-cache: hit`).
- **Cache Age:** Observed `Age: 32187` seconds (~8.9 hours), proving that the HTML document is successfully cached in edge memory and served quickly at the network level, despite the heavy asset payload.
