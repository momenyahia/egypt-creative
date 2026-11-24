# EGYPT CREATIVE — LIVE PORTFOLIO VISIBILITY REPORT

**Target Website:** `https://egyptcreative.com/`  
**Investigation Mode:** 100% Live Read-Only Browser & HTTP Inspection  
**Date:** November 24, 2026  

---

## 1. Executive Summary

On the live production website `https://egyptcreative.com/`:
- **12** project URLs are visibly linked and rendered inside the Homepage Portfolio section (`#nx-project1`).
- **0** `/project-*` URLs are linked on `https://egyptcreative.com/project/` (which returns HTTP 200 but contains no dynamic portfolio grid or filter buttons).
- **19** additional `/project-*` / `single-project/` pages exist as live, published HTTP 200 WordPress pages in `wp-sitemap-posts-page-1.xml`, **but are completely hidden from the Homepage Portfolio listing**.

---

## 2. Visible Projects on Live Homepage (`#nx-project1` — 12 Projects)

| # | Visible Project Name | Live Link on Homepage | Content Status | Finding Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **2B Egypt** | `https://egyptcreative.com/project-2b/` | Unique copy (`1,834` chars) | **CONFIRMED** |
| 2 | **Azha Clinics** | `https://egyptcreative.com/project-azha-clinics/` | Unique copy (`1,763` chars) | **CONFIRMED** |
| 3 | **Cairo Capital Hub** | `https://egyptcreative.com/project-cairo-capital/` | Unique copy (`1,898` chars) | **CONFIRMED** |
| 4 | **Dermasilk Skincare** | `https://egyptcreative.com/project-dermasilk/` | Unique copy (`1,655` chars) | **CONFIRMED** |
| 5 | **Doner Konner Restaurant** | `https://egyptcreative.com/project-doner-konner/` | Unique copy (`1,688` chars, 3 images) | **CONFIRMED** |
| 6 | **Masaya Sidi Abdelrahman** | `https://egyptcreative.com/project-masaya-sidi-abdelrahman/` | Unique copy (`1,901` chars) | **CONFIRMED** |
| 7 | **Modon Developments** | `https://egyptcreative.com/project-modon/` *(Note: sitemap has `/project-modon-developments/`)* | Original Modon copy (`1,879` chars) | **CONFIRMED** |
| 8 | **Mohamed El Sagheer Salons** | `https://egyptcreative.com/project-mohamed-el-sagheer/` | Unique copy (`1,823` chars) | **CONFIRMED** |
| 9 | **Remas Land** | `https://egyptcreative.com/project-remas-land/` | Unique copy (`1,814` chars) | **CONFIRMED** |
| 10 | **Saint Johns** | `https://egyptcreative.com/project-saint-johns/` | Unique copy (`1,877` chars) | **CONFIRMED** |
| 11 | **Touche Aesthetic Clinic** | `https://egyptcreative.com/project-touche-aesthetic/` | Unique copy (`1,833` chars) | **CONFIRMED** |
| 12 | **Yves Saint Laurent** | `https://egyptcreative.com/project-yves-saint-laurent/` | Unique copy (`1,910` chars) | **CONFIRMED** |

---

## 3. Evidence & Screenshots

- **Homepage Portfolio Section (`#nx-project1`):** [live_homepage_portfolio_section.png](file:///d:/Antigravity/Projects/egypt-creative/docs/audit_screenshots/live_portfolio/live_homepage_portfolio_section.png)
- **`/project/` Page:** [live_project_archive_page.png](file:///d:/Antigravity/Projects/egypt-creative/docs/audit_screenshots/live_portfolio/live_project_archive_page.png)
