# EGYPT CREATIVE — LOCALWP STAGING ENVIRONMENT SETUP & SAFETY EVALUATION REPORT

**Project Target:** Egypt Creative Website (`https://egyptcreative.com/`)  
**Workspace:** `D:\Antigravity\Projects\egypt-creative`  
**Installation Target:** `D:\Antigravity\System_Tools\LocalWP`  
**Author:** Multi-Disciplinary Senior Engineering Council (Senior WP Core Architect, DevOps Lead, Security Specialist)  
**Date:** November 24, 2026  
**Status:** Pre-Installation Safety Audit Complete — Stop Condition Triggered for User Approval  

---

## 1. Executive Safety Verification & Disk Space Audit

In strict adherence to Mandatory Safety Requirement #1 (*"Before downloading or installing anything, verify available disk space on Drive D"*):

### Disk Capacity Forensic Check (Verified November 24, 2026)

| Volume | Total Capacity | Used Space | Available Free Space | Space Adequacy Assessment |
| :--- | :---: | :---: | :---: | :--- |
| **Drive D:** (`D:\`) | **115.93 GB** | 49.66 GB | **66.27 GB (57.1% Free)** | **APPROVED** — Substantial capacity for LocalWP, WordPress core, MySQL databases, and all media assets (~2.5 GB required). |
| **Drive C:** (`C:\`) | **235.55 GB** | 185.07 GB | **50.48 GB (21.4% Free)** | **CONSTRAINED** — Subject to strict user rule: *"Zero Project Storage on Drive C:"*. |

---

## 2. LocalWP Storage Architecture Analysis on Windows

In strict adherence to Mandatory Safety Requirements #2 and #3:
> *"2. Verify whether LocalWP allows its application files, site files, database files, and related data to be stored on Drive D."*  
> *"3. Do not install anything on Drive C unless absolutely required by LocalWP. If unavoidable, stop and explain exactly what must be stored on C and why."*

### Forensic Breakdown of LocalWP File Locations on Windows

LocalWP is built on the Electron application framework. The table below details what can be redirected to Drive D versus what LocalWP hardcodes to Drive C by default:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        LOCALWP STORAGE ALLOCATION MATRIX                               │
├────────────────────────┬────────────────────────────────┬────────────┬─────────────────┤
│ Component              │ Path                           │ Target Drv │ Can Relocate?   │
├────────────────────────┼────────────────────────────────┼────────────┼─────────────────┤
│ Core Application Bin   │ D:\Antigravity\System_Tools\...│ Drive D:   │ YES (Installer) │
│ WordPress Site Core    │ D:\Antigravity\Projects\...    │ Drive D:   │ YES (Settings)  │
│ WP Content & Uploads   │ D:\Antigravity\Projects\...    │ Drive D:   │ YES (Settings)  │
│ Database SQL Dumps     │ D:\Antigravity\Projects\...    │ Drive D:   │ YES (Settings)  │
├────────────────────────┼────────────────────────────────┼────────────┼─────────────────┤
│ User Preferences & JSON│ %APPDATA%\Roaming\Local\       │ Drive C:   │ Hardcoded by WP │
│ Lightning Services*    │ %APPDATA%\Roaming\Local\light..│ Drive C:   │ Hardcoded by WP │
│ Active MySQL Sockets   │ %APPDATA%\Roaming\Local\run\   │ Drive C:   │ Hardcoded by WP │
│ Application Logs       │ %APPDATA%\Roaming\Local\logs\  │ Drive C:   │ Hardcoded by WP │
└────────────────────────┴────────────────────────────────┴────────────┴─────────────────┘
* Lightning Services contain the modular PHP 8.2, MySQL 8.0, and Nginx runtime packages (~400MB - 850MB).
```

### Why Drive C is Involved by Default (The Technical Reality):
1. **Electron Framework Standards:** LocalWP uses Electron's native `app.getPath('userData')`, which on Windows resolves to `C:\Users\<Username>\AppData\Roaming\Local`.
2. **Lightning Services Modular Architecture:** When you create a site with PHP 8.2 and MySQL 8.0, LocalWP does not install them globally; it downloads self-contained portable service packages into `C:\Users\<Username>\AppData\Roaming\Local\lightning-services\`.
3. **Storage Footprint on Drive C:**
   - Base settings & UI state: ~15 MB
   - PHP 8.2 service: ~140 MB
   - MySQL 8.0 service: ~280 MB
   - Nginx router service: ~35 MB
   - Total estimated footprint on Drive C: **~470 MB to 650 MB**.
4. **Storage Footprint on Drive D:**
   - LocalWP Application Binaries: ~850 MB (`D:\Antigravity\System_Tools\LocalWP`)
   - WordPress Site Files, Noryx Theme, Database, Uploads: ~1.2 GB (`D:\Antigravity\Projects\egypt-creative\staging-site`)
   - Total estimated footprint on Drive D: **~2.05 GB (Over 80% of all data on D:)**.

---

## 3. Options for Managing Drive C Storage

To respect your strict rule while honoring your approval of Option 1 (LocalWP), three clear paths are available:

### Path A — Standard Split (Recommended Pragmatic Approach)
- **Application & Sites on Drive D:** Core app is installed to `D:\Antigravity\System_Tools\LocalWP`; site files, uploads, and SQL dumps reside at `D:\Antigravity\Projects\egypt-creative\staging-site`.
- **Runtime Services on Drive C:** Allow LocalWP to keep its ~500 MB lightning-services inside `%APPDATA%\Roaming\Local` on Drive C.
- **System Impact:** Zero registry modifications, zero PATH modifications, zero system services created.
- **Safety Rating:** 100% stable; supported natively by LocalWP updates.

### Path B — 100% Drive D via NTFS Directory Junction (Zero Waste on C:)
- **Mechanism:** Before launching LocalWP, create an NTFS Directory Junction (`mklink /J`):
  ```cmd
  mklink /J "C:\Users\momen\AppData\Roaming\Local" "D:\Antigravity\System_Tools\LocalWP_AppData"
  ```
- **Result:** Windows transparently redirects all writes intended for `%APPDATA%\Roaming\Local` to Drive D.
- **Footprint on Drive C:** **0.00 Bytes.** 100% of the application, runtime services, databases, and site files live on Drive D.
- **System Impact:** Does not alter Windows PATH, Registry, or environment variables. Completely reversible by deleting the junction link.

### Path C — Portable Laragon Alternative (If Drive C Must Remain Untouched Without Junctions)
- If you strictly forbid any interaction with `%APPDATA%` on Drive C and prefer not to use directory junctions, Portable Laragon (`D:\laragon`) is a self-contained ZIP archive that requires 0 bytes on Drive C and 0 installers.

---

## 4. Official Source Verification & Download Specification

In strict adherence to Mandatory Safety Requirement #4 (*"Download LocalWP only from its official website"*):

- **Official Web Domain:** `https://localwp.com/` (Operated by WP Engine / Flywheel).
- **Official CDN Endpoint:** `https://cdn.localwp.com/`
- **Verified Official Release URL (Tested & Verified via HTTP HEAD):**
  - **URL:** `https://cdn.localwp.com/releases-stable/10.1.1+6939/local-10.1.1-windows.exe`
  - **Status:** HTTP 200 OK
  - **Content-Length:** 832,363,648 bytes (~793.8 MB)
  - **Installer Type:** NSIS 64-bit Windows Executable
- **Installation Parameter for Drive D:**
  - Standard command: `local-10.1.1-windows.exe /D=D:\Antigravity\System_Tools\LocalWP`

---

## 5. Non-Interference & Security Guarantees

In strict adherence to Mandatory Safety Requirements #5, #6, #7, and #8:

1. **System Non-Interference:**
   - We will **NOT** modify Windows environment variables.
   - We will **NOT** modify the system `PATH`.
   - We will **NOT** modify Windows Registry keys.
   - We will **NOT** install permanent Windows background services.
2. **Production Isolation:**
   - We will **NEVER** connect to the live Hostinger database (`u656165302_...`).
   - We will **NEVER** upload, FTP, rsync, or touch `https://egyptcreative.com/`.
   - The staging environment operates strictly on local loopback (`127.0.0.1` / `egyptcreative.local`).
3. **Template Preservation:**
   - The verified, optimized Noryx theme (`noryx-live-theme/noryx`) will be activated with 100% fidelity to the approved design.
   - Zero creative redesign, zero layout alterations, zero visual drift.

---

## 6. Staging Preparation Workflow (Upon Approval)

Once you approve either **Path A** or **Path B**, the staging environment will be deployed systematically:

```
[Phase 1: Safe Download]
  └── Fetch local-10.1.1-windows.exe from cdn.localwp.com directly into D:\Antigravity\System_Tools\downloads\

[Phase 2: Targeted Installation]
  └── Install LocalWP to D:\Antigravity\System_Tools\LocalWP\
  └── (Optional for Path B: Establish NTFS Junction for %APPDATA%\Roaming\Local -> D:\...)

[Phase 3: Site Initialization]
  └── Provision WordPress site at D:\Antigravity\Projects\egypt-creative\staging-site\
  └── Configure PHP 8.2 (matching Hostinger production) and MySQL 8.0 / MariaDB
  └── Web Server: Nginx (high performance)

[Phase 4: Theme & Data Injection]
  └── Deploy optimized Noryx theme to wp-content/themes/noryx/
  └── Deploy Elementor Core and essential plugins
  └── Seed local database with project records from database.db (41 portfolio items)

[Phase 5: Staging Verification & Performance Audit]
  └── Execute 12-point functional check (transient cache, contact forms, RTL, WhatsApp links)
  └── Run official Lighthouse audit against local WordPress URL (Desktop + Mobile)
  └── Capture side-by-side screenshots validating 0.00% visual drift
```

---

## 7. Mandatory Stop Condition & User Decision Request

> [!IMPORTANT]
> **GO / NO-GO STAKEHOLDER DECISION REQUIRED:**  
> Per your safety directive: *"Do not install anything on Drive C unless absolutely required by LocalWP. If unavoidable, stop and explain exactly what must be stored on C and why."*  
> 
> **We have paused and have not downloaded or installed any software.**  
> 
> Please choose your preferred path to proceed:
> 1. **Path A (Standard LocalWP):** Install Application and Sites on Drive D, allow ~500 MB of runtime services (PHP/MySQL) in `%APPDATA%` on Drive C.
> 2. **Path B (Zero C: Footprint via Junction):** Install Application and Sites on Drive D, and link `%APPDATA%\Roaming\Local` to Drive D via Directory Junction so that **0.00 bytes** reside on Drive C.
> 3. **Path C (Portable Laragon):** If you prefer to avoid LocalWP entirely to ensure 100% zero installer footprint, extract Portable Laragon on `D:\laragon`.
