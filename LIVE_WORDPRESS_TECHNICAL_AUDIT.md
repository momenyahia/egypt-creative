# EGYPT CREATIVE — LIVE WORDPRESS & HOSTING TECHNICAL FORENSIC AUDIT

**Target Website:** `https://egyptcreative.com/`  
**Host:** Hostinger Cloud / Shared Web Hosting (Account `u656165302`)  
**Audit Date:** November 24, 2026  
**Auditor:** Principal WordPress Architect & DevOps Infrastructure Lead  

---

## 1. Technical Stack Architecture Summary

| Architectural Layer | Live Production Specification | Audit Assessment |
| :--- | :--- | :---: |
| **WordPress Core** | **WordPress 7.1.5** | **Up-to-Date / Modern** |
| **PHP Runtime** | **PHP 8.3.37** | **High Performance (PHP 8.3)** |
| **Web Server** | **LiteSpeed Enterprise** | **Optimal for WordPress** |
| **Edge CDN** | **Hostinger CDN (`hcdn`)** | **Active with Edge Caching** |
| **Database Server** | **MariaDB 10.6.23** on `srv1733.hstgr.io:3306` | **Dedicated Cloud DB** |
| **Production Database** | `u656165302_aiptW` (60.0 MB Disk Usage) | **Healthy Database State** |
| **Active Theme** | **Noryx Theme** (`wp-content/themes/noryx`) | **Approved Agency Design** |
| **Caching Engine** | **LiteSpeed Cache (LSCache)** | **Active (`x-litespeed-cache: hit`)** |
| **Network Protocols**| **HTTP/2, HTTP/3 (QUIC), TLS 1.3** | **Modern Protocols Enabled** |

---

## 2. Active Plugins Inventory & Forensics

Verified via live file inspection through the Hostinger File API and frontend script analysis:

| Plugin Name | Directory Slug | Status | Purpose & Audit Observation |
| :--- | :--- | :---: | :--- |
| **Elementor Page Builder**| `elementor` | **Active** | Powers custom layout sections and interactive grid modules. Causes asset overhead (multiple JS/CSS loads). |
| **Contact Form 7** | `contact-form-7` | **Active** | Manages inquiries. Generates background console errors due to schema/refill fetch failures. |
| **Code Snippets** | `code-snippets` | **Active** | Injects custom PHP functions without editing functions.php directly. |
| **WPCode (Insert Headers & Footers)**| `insert-headers-and-footers`| **Active** | Injects header meta tags and tracking scripts (Google Analytics / Pixel). |
| **Safe Redirect Manager** | `safe-redirect-manager` | **Active** | Handles 301/302 redirects (e.g., `/nx-get-in-touch/`). |

---

## 3. WordPress REST API Health & Telemetry

- **Root API Endpoint:** `https://egyptcreative.com/wp-json/` (**HTTP 200 OK**)
- **Exposed Routes:** **333 API routes** registered.
- **Site Identity in API:**
  - `name`: "Egypt Creative"
  - `description`: "Leading Full-Service Marketing & Creative Agency"
  - `url`: `https://egyptcreative.com`
  - `home`: `https://egyptcreative.com`
- **Homepage Post ID:** Discovered via API header: Page ID **1825** (`https://egyptcreative.com/wp-json/wp/v2/pages/1825`).
- **User Enumeration Security:** `https://egyptcreative.com/wp-json/wp/v2/users` returns **HTTP 403 Forbidden** (properly secured against user enumeration).

---

## 4. Theme Architecture & Hook Hygiene (Noryx)

### Enqueue Chain:
1. `wp_enqueue_scripts` in Noryx theme enqueues **37 script files** and **20 stylesheet files** directly on the front-end document.
2. Multiple scripts are loaded without `defer` or `async` attributes, triggering browser parser-blocking warnings.
3. The custom font `Runiga.woff` is enqueued in CSS without CORS header support on the CDN, causing font loading to fail on clean page visits.

### Template Hierarchy:
- The homepage is driven by `front-page.php` or `page.php` with Elementor canvas/full-width templates.
- Leftover template files from the original theme purchase (`home-1-dark.php`, `home-2.php`, `home-3.php`) exist in the theme directory and are published as live pages in WordPress.

---

## 5. Hosting & Server Response Analysis

```http
HTTP/2 200 OK
date: Tue, 24 Nov 2026 18:46:35 GMT
content-type: text/html; charset=UTF-8
x-powered-by: PHP/8.3.37
strict-transport-security: max-age=63072000
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
etag: W/"719-1795332174;gz"
x-litespeed-cache: hit
server: hcdn
alt-svc: h3=":443"; ma=86400
x-hcdn-request-id: 9cea9512cbf2c4521a7b67c8abd82c64-fra-edge7
x-hcdn-cache-status: HIT
```

### Key Technical Findings:
1. **Edge CDN Hit:** `x-hcdn-cache-status: HIT` indicates Hostinger CDN is caching the page at the Frankfurt edge node (`fra-edge7`).
2. **GZIP / Brotli Compression:** Active (`content-encoding: br` / `gz`).
3. **HTTP/3 Support:** Advertised via `alt-svc: h3=":443"; ma=86400`.
4. **Information Leakage:** `x-powered-by: PHP/8.3.37` exposes exact PHP patch level to network observers.
