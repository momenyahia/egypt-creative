# EGYPT CREATIVE — PHASE 3.1: DYNAMIC PORTFOLIO VISUAL & FUNCTIONAL QA REPORT

**Target:** Isolated Local Staging (`http://127.0.0.1:10004/`) vs Live Noryx Reference (`https://egyptcreative.com/`)  
**Mode:** QA Only — Zero Production Changes or Deployments  
**Date:** November 24, 2026  

---

## 1. Functional Test Results (All Passed)

| Test Case | Execution & Measured Result | Status |
| :--- | :--- | :---: |
| **12 Approved Projects on `/project/`** | `HTTP 200 OK`, `12` cards rendered (`Modon` through `Cairo Capital Hub`), `0` console errors. | **PASS** |
| **All 12 `/project-<slug>/` URLs** | All `12` URLs return `HTTP 200 OK` via custom rewrite rule `^project-([^/]+)/?$`. | **PASS** |
| **Draft Exclusion** | Created `draft` project (`ID 17`, `QA Draft Test`); `/project/` count remained `12`, draft invisible publicly. | **PASS** |
| **Taxonomy Assignment** | Created `project_industry` term `"Real Estate"` and assigned to `Modon` (`ID 5`) via WP-CLI. | **PASS** |
| **Dynamic Ordering (`menu_order`)** | Updated `Modon` `menu_order=99`; `/project/` dynamically reordered (`First = 2B Egypt`, `Last = Modon`), then restored to `1`. | **PASS** |
| **Responsive & Overflow** | Desktop `1440×900` (`Overflow=False`) & Mobile `390×844` (`Overflow=False`) with `0` console errors. | **PASS** |
| **SEO & Rewrite Rules** | `<link rel="canonical">` present, `Organization` + `ProfessionalService` JSON-LD active, `wp_generator` removed. | **PASS** |

---

## 2. Before / After Screenshots

- **Live Reference (Homepage `#nx-project1`):** [live_homepage_portfolio_section.png](file:///d:/Antigravity/Projects/egypt-creative/docs/audit_screenshots/live_portfolio/live_homepage_portfolio_section.png)
- **Live Reference (`/project/`):** [live_project_archive_page.png](file:///d:/Antigravity/Projects/egypt-creative/docs/audit_screenshots/live_portfolio/live_project_archive_page.png)
- **Staging Dynamic Archive Desktop (`1440×900`):** [staging_archive_desktop.png](file:///d:/Antigravity/Projects/egypt-creative/docs/audit_screenshots/phase3_1_qa/staging_archive_desktop.png)
- **Staging Dynamic Archive Mobile (`390×844`):** [staging_archive_mobile.png](file:///d:/Antigravity/Projects/egypt-creative/docs/audit_screenshots/phase3_1_qa/staging_archive_mobile.png)
- **Staging Single Project (`1440×900`):** [staging_single_desktop.png](file:///d:/Antigravity/Projects/egypt-creative/docs/audit_screenshots/phase3_1_qa/staging_single_desktop.png)

---

## 3. Honest List of Visual Differences & Remaining Gaps

1. **Content & Featured Images on Staging:** Because production database/media were not imported per investigation rules, the 12 staging `project` posts currently contain only their approved titles/slugs (`post_content` empty, no featured/gallery images yet).
2. **Card Visual Parity (`archive-project.php`):** Staging `archive-project.php` renders a clean Bootstrap 3-column title grid (`nx-project-item`), whereas the live Homepage `#nx-project1` renders full Noryx image cards with hover overlays and category badges. Before production deployment, `archive-project.php` and `front-page.php` must use the exact Noryx card HTML/CSS classes.
3. **Category Filter Tabs:** `project_industry` taxonomy is registered and tested in WP Admin, but frontend filter tabs are not yet rendered on `/project/`.

---

## 4. Production Deployment Risk Assessment

- **Risk Level: MEDIUM-HIGH if deployed as-is; LOW once content & card markup are synced.**
- **Why:** Deploying `project` CPT rewrite rules (`^project-([^/]+)/?$`) to production before migrating the 12 live `page` records into `project` CPT posts would intercept existing `/project-<slug>/` page URLs.
- **Required Pre-Deployment Gate:** Migrate the 12 approved `page` records (with their Elementor content & featured images) into `project` CPT posts in staging first, verify 1:1 visual parity with live Noryx cards, and flush permalinks.
