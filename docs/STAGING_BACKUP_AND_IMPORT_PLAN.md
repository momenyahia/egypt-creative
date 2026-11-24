# EGYPT CREATIVE — PRODUCTION BACKUP ASSESSMENT & SAFE STAGING IMPORT PLAN

**Target Project:** Egypt Creative Website (`https://egyptcreative.com/`)  
**Workspace:** `D:\Antigravity\Projects\egypt-creative`  
**Clean Staging Site:** `D:\Antigravity\Projects\egypt-creative\staging-site\egypt-creative`  
**Author:** Multi-Disciplinary Senior Engineering Council (Senior WP Architect, DevOps Lead, Security Specialist, Database Engineer)  
**Date:** November 24, 2026  
**Status:** Assessment & Architecture Plan Complete — Awaiting Stakeholder Review & Explicit Approval  

---

## 1. Inventory & Forensic Assessment of Available Local Assets

A complete forensic inspection of all local directories and repositories under `D:\Antigravity\Projects\egypt-creative` was performed:

| Asset Category | Local Path / Asset Name | Items / Size | Completeness Status | Architectural Finding |
| :--- | :--- | :---: | :---: | :--- |
| **Pristine Theme Backup** | `noryx-live-theme/noryx_backup_original/` | 234 files (1.4 MB) | **COMPLETE** | Original, unmodified Noryx theme backup preserved directly from production. |
| **Optimized Theme** | `noryx-live-theme/noryx/` | 234 files (1.4 MB) | **COMPLETE** | Contains 5 verified technical improvements: transient caching, Schema.org JSON-LD, smooth service anchors, non-blocking fonts, security hardening, and production RTL stylesheet. |
| **Theme Companion Plugin** | `noryx-live-theme/noryx/inc/plugins/noryx-plugin.zip` | 1 archive (28 KB) | **COMPLETE** | Core post types and custom Elementor widgets required by Noryx theme. |
| **Local SQLite Database** | `database.db` | 352 KB | **COMPLETE (STANDALONE ONLY)** | Contains 41 verified client companies, 41 portfolio projects, 6 services, 3 team members, and 466 media records from the custom SQLite/PHP engine. **Not a WordPress MySQL database.** |
| **Local Media Directory** | `assets/uploads/` | 423 image files (54.2 MB) | **PARTIAL (FLAT STRUCTURE)** | 309 PNGs, 113 JPGs, 1 JPEG. Stored in flat format for the standalone site; lacks standard WordPress `wp-content/uploads/YYYY/MM/` hierarchy. |
| **Live Homepage Snapshot** | `live_site_snapshot/live_homepage.html` | 1 file (83.6 KB) | **COMPLETE (HTML ONLY)** | Rendered HTML source of the live homepage (`https://egyptcreative.com/`). |
| **Optimization Backups** | `backups_and_reports/` | 9 files | **COMPLETE** | LiteSpeed Cache export (`litespeed_cache_settings_export.data`), WPCode snippets (2186 HTML & 2188 PHP), and master settings. |
| **Production MySQL Dump** | `*.sql`, `*.sql.gz` | **0 files** | **MISSING LOCALLY** | **Critical:** No WordPress MySQL export (`.sql`) currently exists in the local workspace. |
| **Production WP Uploads** | `wp-content/uploads/` | **0 files** | **MISSING LOCALLY** | Full WordPress uploads hierarchy with Elementor generated CSS files (`/elementor/css/`) is not present locally. |
| **Production Plugins** | `elementor`, `contact-form-7`, etc. | **0 folders** | **MISSING LOCALLY** | Active WordPress plugins from production are not stored locally (only `noryx-plugin.zip` is present). |

---

## 2. Production Backup Requirements & Acquisition Protocol

To achieve 100% fidelity to the live Egypt Creative website without guesswork, a consistent, uncorrupted backup of the live production environment is required.

### A. Mandatory Production Backup Components:
1. **WordPress MySQL/MariaDB Database Dump (`.sql`):**
   - Tables: `wp_posts` (specifically Post ID 1825 which holds the Elementor homepage layout), `wp_postmeta`, `wp_options`, `wp_terms`, `wp_term_taxonomy`, `wp_term_relationships`, and `wp_comments`.
2. **WordPress Uploads Directory (`wp-content/uploads/`):**
   - All year/month subdirectories (`2024/`, `2025/`, `2026/`) containing full-resolution featured images, client logos, team portraits, video backgrounds, and vector SVGs.
3. **Active Plugins Directory (`wp-content/plugins/`):**
   - Elementor Core (exact version matching production, approx. v4.3.4).
   - Contact Form 7.
   - WPCode (Lite or Pro).
   - Any active translation or custom post type plugins.
4. **Active Theme Directory (`wp-content/themes/noryx`):**
   - Already securely mirrored in `noryx-live-theme/noryx_backup_original`.

---

### B. Recommended Safe Acquisition Methods (Zero-Risk Matrix)

Per strict system instructions: **No production credentials will be accessed and no production actions will be executed without explicit user instruction.** The table below ranks the safest acquisition methods:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION BACKUP ACQUISITION METHODS                           │
├─────────┬──────────────────────────┬──────────────┬───────────────┬────────────────────┤
│ Option  │ Method Name              │ Risk Level   │ Server Load   │ User Effort        │
├─────────┼──────────────────────────┼──────────────┼───────────────┼────────────────────┤
│ 1 (Rec) │ Hostinger hPanel Backups │ ZERO RISK    │ 0% (Snapshot) │ 2 Clicks in hPanel │
│ 2       │ Hostinger phpMyAdmin/FTP │ VERY LOW     │ Minimal       │ 3 Clicks in hPanel │
│ 3       │ WordPress Backup Plugin  │ LOW          │ Brief CPU     │ Run via WP Admin   │
│ 4       │ SSH / WP-CLI Export      │ MEDIUM       │ Brief CPU     │ CLI execution      │
└─────────┴──────────────────────────┴──────────────┴───────────────┴────────────────────┘
```

#### Option 1 (Recommended — 100% Safe): Hostinger hPanel Automated Daily Backup
- **Why it is safest:** Hostinger Cloud automatically takes daily filesystem and database snapshots. Downloading a snapshot creates **zero load** on the live website and carries **zero risk** of downtime or disruption.
- **Procedure for User:**
  1. Log into **Hostinger hPanel** (`https://hpanel.hostinger.com`).
  2. Navigate to **Websites** -> `egyptcreative.com` -> **Files** -> **Backups**.
  3. Under **Database Backups**, select the latest date and click **Download** (generates `.sql.gz`).
  4. Under **Files Backups**, select `public_html/wp-content/uploads` and click **Download** (generates `.zip`).
  5. Place the downloaded files in `D:\Antigravity\Projects\egypt-creative\staging-site\backups\`.

#### Option 2: phpMyAdmin Export & File Manager Download
- Open phpMyAdmin from hPanel -> select database `u656165302_...` -> Export -> Quick (SQL format).
- Open File Manager -> compress `wp-content/uploads` into a `.zip` -> Download.

---

## 3. Production vs. Local Staging Compatibility Assessment

| Parameter | Live Production (Hostinger Cloud) | Local Staging (LocalWP Environment) | Compatibility Assessment | Risk Level |
| :--- | :--- | :--- | :--- | :---: |
| **Operating System** | CloudLinux 64-bit | Windows 11 64-bit | LocalWP abstracts OS differences cleanly via portable runtimes. | **LOW** |
| **PHP Version** | **PHP 8.2** | **PHP 8.2.29** | **Exact match.** All core extensions (`mysqli`, `curl`, `mbstring`, `gd`, `openssl`, `zip`) verified. | **NONE** |
| **Database Engine** | **MariaDB 10.6** | **MariaDB 10.6.23** | **Exact match.** Zero syntax discrepancies or SQL mode incompatibilities. | **NONE** |
| **Web Server** | LiteSpeed Enterprise Web Server | Nginx 1.26.1 | Handled via FastCGI reverse proxy. Clean URL rewrites verified. | **LOW** |
| **Caching Engine** | LiteSpeed Server Cache + Hostinger CDN | Local Transient Cache (12h TTL) | LiteSpeed Cache plugin should be deactivated locally to avoid missing LSCache module warnings. | **MEDIUM** |
| **Protocol / Domain** | `https://egyptcreative.com` (HTTPS, SSL) | `http://127.0.0.1:10004` (HTTP) | Protocol and host change requires **serialization-safe** replacement. | **HIGH** |
| **Elementor Data** | Stored in `wp_postmeta` (post ID 1825) | Local staging database `local` | Elementor embeds URLs in JSON and serialized strings. Raw SQL replacement **will break layouts**. | **CRITICAL** |

---

## 4. Reversible, Serialization-Safe Import Strategy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SERIALIZATION-SAFE IMPORT WORKFLOW                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [Step 1: Backup Baseline] ──> Take clean staging snapshot (clean_baseline_wp.sql)     │
│  [Step 2: Database Load]   ──> Import production dump into local MariaDB              │
│  [Step 3: Safe Replace]    ──> Run WP-CLI search-replace (handles PHP serialization)   │
│  [Step 4: Media Deployment]──> Place production uploads into wp-content/uploads/       │
│  [Step 5: Plugin Sequence] ──> Activate Elementor & Contact Form 7; Deactivate LSCache │
│  [Step 6: Theme Activation]──> Activate modified Noryx theme; regenerate Elementor CSS │
│  [Step 7: Verification]    ──> Validate HTTP 200, visual fidelity, and zero drift      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### A. Pre-Import Snapshot (Clean Staging Baseline)
Before any foreign data touches the staging environment, a full rollback snapshot of the clean installation will be taken:
```bash
wp db export D:\Antigravity\Projects\egypt-creative\staging-site\backups\clean_baseline_wp.sql
```

### B. Database Import Procedure
1. Drop clean staging tables: `wp db reset --yes`
2. Import production MySQL dump:
   ```bash
   wp db import D:\Antigravity\Projects\egypt-creative\staging-site\backups\production_dump.sql
   ```
3. Run integrity audit: `wp db check`

### C. URL Replacement Protocol (Strict Anti-Corruption Standard)
> [!CAUTION]
> **NEVER USE RAW SQL OR TEXT EDITOR SEARCH-AND-REPLACE ON WORDPRESS DATABASES!**  
> Elementor and WordPress store URLs inside serialized PHP strings such as:  
> `s:27:"https://egyptcreative.com";`  
> If replaced blindly with a string of different length (e.g., `s:22:"http://127.0.0.1:10004";`), the byte counter `27` becomes invalid, causing PHP `unserialize()` to fail and permanently corrupting all Elementor page builder widgets and settings!

**The Mandatory Serialization-Safe WP-CLI Procedure:**
1. **Dry-Run Validation:**
   ```bash
   wp search-replace "https://egyptcreative.com" "http://127.0.0.1:10004" --all-tables --dry-run
   ```
2. **Live Execution (Recalculates Serialized Byte Counts):**
   ```bash
   wp search-replace "https://egyptcreative.com" "http://127.0.0.1:10004" --all-tables
   ```
3. **Protocol Fallback Pass:**
   ```bash
   wp search-replace "http://egyptcreative.com" "http://127.0.0.1:10004" --all-tables
   ```

### D. Media Import Protocol
1. Extract production `uploads.zip` directly into:  
   `D:\Antigravity\Projects\egypt-creative\staging-site\egypt-creative\app\public\wp-content\uploads\`
2. Verify image permissions and ensure thumbnails and full-size assets match database attachment IDs.
3. Fallback: If full uploads archive is temporarily delayed, link existing 423 media files from `assets/uploads/`.

### E. Plugin Activation Sequence
1. Activate Core Builder: `wp plugin activate elementor`
2. Activate Forms: `wp plugin activate contact-form-7`
3. Activate Noryx Companion: `wp plugin activate noryx-plugin`
4. Deactivate Incompatible Server Plugins:
   - `wp plugin deactivate litespeed-cache` (Incompatible with local Nginx server environment).

### F. Theme Activation & Elementor Asset Regeneration
1. Deploy modified theme from `noryx-live-theme/noryx` to `staging-site\egypt-creative\app\public\wp-content\themes\noryx`.
2. Activate theme: `wp theme activate noryx`
3. Flush and regenerate Elementor CSS files:
   ```bash
   wp elementor flush_css
   wp rewrite flush --hard
   wp transient delete --all
   ```

---

## 5. Comprehensive Risk Assessment & Mitigation

| Identified Technical Risk | Severity | Potential Impact | Engineering Mitigation Strategy |
| :--- | :---: | :--- | :--- |
| **Elementor Data Serialization Desync** | **CRITICAL** | Blank homepage, broken layout, missing Elementor widgets. | Enforce WP-CLI `search-replace` exclusively; zero raw text or SQL editor replacement. |
| **LiteSpeed Cache Server Module Absence** | **MEDIUM** | PHP fatal errors or HTTP 500 from missing LiteSpeed server headers. | Deactivate `litespeed-cache` plugin in staging; rely on local Nginx and theme transients. |
| **Missing Image Attachments** | **MEDIUM** | Broken image icons (404) on portfolio cards. | Verify `wp-content/uploads` presence before activating theme; fallback to local `assets/uploads/`. |
| **Port / Socket Collision** | **LOW** | Services fail to bind on restart. | Fixed dedicated ports assigned (`10004` Nginx, `10005` MariaDB, `10003` FastCGI). |

---

## 6. Fast Rollback Plan (< 30 Seconds)

If any unexpected error occurs during import, testing, or theme activation:
1. **Database Rollback:**
   ```bash
   wp db reset --yes
   wp db import D:\Antigravity\Projects\egypt-creative\staging-site\backups\clean_baseline_wp.sql
   ```
2. **Theme Reset:**
   ```bash
   wp theme activate twentytwentyfive
   ```
3. **Cache Purge:**
   ```bash
   wp transient delete --all
   ```
*Result:* Returns the local staging environment to its verified, pristine clean state instantaneously.

---

## 7. Mandatory STOP Condition & Stakeholder Approval Gates

```
========================================================================================
STATUS: BACKUP ASSESSMENT COMPLETE | IMPORT PLAN FROZEN | AWAITING USER APPROVAL
========================================================================================
```

> [!IMPORTANT]
> **STRICT COMPLIANCE CONFIRMATION:**  
> - **Zero production data has been downloaded.**  
> - **Zero connections were made to Hostinger or the live website.**  
> - **No database has been imported into staging.**  
> - **The clean staging site remains pristine and untouched.**  
> - **The approved Noryx design remains 100% preserved.**  
>
> ### Next Required Action from User:
> To proceed with reproducing the live website locally:
> 1. Please obtain the production backup from Hostinger hPanel (**Option 1**: Database `.sql.gz` + Uploads `.zip`) and place them under `D:\Antigravity\Projects\egypt-creative\staging-site\backups\`.  
>    *(Alternatively, if you prefer us to seed the staging site from the local 41 portfolio companies in `database.db` while awaiting production files, please confirm).*
> 2. Formally approve proceeding with **Phase 4 (Reversible Staging Import Procedure)**.
