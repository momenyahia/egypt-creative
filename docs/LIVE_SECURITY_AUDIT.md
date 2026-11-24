# EGYPT CREATIVE — LIVE CYBERSECURITY & HARDENING FORENSIC AUDIT

**Target Website:** `https://egyptcreative.com/`  
**Audit Protocol:** Non-Invasive, Read-Only Security Inspection  
**Audit Date:** November 24, 2026  
**Auditor:** Principal Security Engineer & Cloud Hardening Specialist  

---

## 1. Executive Security Posture Summary

The live production website exhibits **strong baseline infrastructure security**, particularly regarding transport encryption, database isolation, and perimeter blocks. Hostinger CDN and server configuration successfully block direct access to critical configuration files (`.env`, `.git`, `wp-config.php`), XML-RPC amplification, and REST API user enumeration.

However, several **information disclosure vectors and hardening gaps** were identified that provide reconnaissance data to potential attackers, including exact PHP and WordPress versions, standard administrative entry points, and an overly permissive Content Security Policy (CSP).

---

## 2. Security Headers & Perimeter Analysis

| Security Header | Production Value | Security Evaluation | Recommendation |
| :--- | :--- | :---: | :--- |
| **Strict-Transport-Security (HSTS)** | `max-age=63072000` | **EXCELLENT** | 2-year HSTS active. Protects against SSL-stripping and protocol downgrade attacks. |
| **X-Frame-Options** | `SAMEORIGIN` | **GOOD** | Prevents clickjacking by blocking unauthorized framing from external domains. |
| **X-Content-Type-Options** | `nosniff` | **GOOD** | Prevents MIME-confusion attacks and malicious script execution in media files. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | **GOOD** | Protects sensitive path information when navigating to external origins. |
| **Permissions-Policy** | Restricts camera, microphone, geolocation, usb | **EXCELLENT** | Disables unneeded hardware device capabilities. |
| **Content-Security-Policy (CSP)** | `upgrade-insecure-requests;` | **WEAK** | Only forces HTTPS; lacks directive boundaries (`default-src`, `script-src`, `style-src`) to mitigate XSS. |
| **X-Powered-By** | `PHP/8.3.37` | **RISK (Info Leak)** | Exposes exact PHP version. Should be removed from server headers. |

---

## 3. Sensitive Paths & Exposure Testing Matrix

| Path / Target | Test Method | Live Status | Exposure Risk | Forensic Finding |
| :--- | :---: | :---: | :---: | :--- |
| **`/xmlrpc.php`** | `POST` | **HTTP 403** | **BLOCKED** | Secured. XML-RPC brute force and pingback DDoS amplification are blocked. |
| **`/wp-json/wp/v2/users`** | `GET` | **HTTP 403** | **BLOCKED** | Secured. Automated username enumeration via REST API is blocked. |
| **`/.env`** | `GET` | **HTTP 403** | **BLOCKED** | Secured. Environment variables and secrets cannot be fetched via HTTP. |
| **`/.git/HEAD`** | `GET` | **HTTP 403** | **BLOCKED** | Secured. Git repository metadata is inaccessible. |
| **`/wp-config.php`** | `GET` | **HTTP 403** | **BLOCKED** | Secured. Core configuration and database credentials are protected. |
| **`/readme.html`** | `GET` | **HTTP 200 (7.4 KB)**| **EXPOSED** | Minor leak. Publicly readable WordPress documentation file. |
| **`/license.txt`** | `GET` | **HTTP 200 (19.9 KB)**| **EXPOSED** | Minor leak. Publicly readable WordPress license file. |
| **`/wp-login.php`** | `GET` | **HTTP 200 (7.9 KB)**| **PUBLIC** | Standard WordPress admin login endpoint exposed without custom slug. |
| **`/wp-admin/`** | `GET` | **HTTP 200 (8.0 KB)**| **PUBLIC** | Redirects to `/wp-login.php`. |

---

## 4. SSL / TLS Certificate & Cipher Suite Telemetry

- **Certificate Authority (CA):** Let's Encrypt (`CN = YE2`, `O = Let's Encrypt`, `C = US`).
- **Validity Window:** Active through **January 17, 2027**.
- **Negotiated Protocol:** **TLSv1.3** (Modern, highest security transport layer).
- **Active Cipher Suite:** `TLS_AES_256_GCM_SHA384` (256-bit symmetric key, authenticated encryption).
- **Certificate Status:** Valid, verified, and free of intermediate chain warnings.

---

## 5. Forensic Vulnerability Classification

### 1. Information Disclosure: PHP & WordPress Version Exposure (EC-LIVE-08)
- **Severity:** Medium
- **Evidence:**
  - Header: `X-Powered-By: PHP/8.3.37`
  - HTML tag: `<meta name="generator" content="WordPress 7.1.5" />`
  - Root file: `/readme.html`
- **Impact:** Allows automated scanners and malicious actors to fingerprint the exact software stack and cross-reference targeted CVEs.
- **Fix:** Add `Header unset X-Powered-By` in `.htaccess` and `remove_action('wp_head', 'wp_generator');` in theme functions.

### 2. Weak Content Security Policy (CSP)
- **Severity:** Low
- **Evidence:** `Content-Security-Policy: upgrade-insecure-requests;`
- **Impact:** Provides zero mitigation against Cross-Site Scripting (XSS) or untrusted script execution.
- **Fix:** Define explicit `script-src`, `style-src`, and `font-src` directives allowing only self and trusted CDNs.
