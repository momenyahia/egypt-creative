# EGYPT CREATIVE — LIVE PORTFOLIO TECHNICAL ROOT CAUSE

**Target Website:** `https://egyptcreative.com/`  
**Investigation Mode:** 100% Live Read-Only REST API & DOM Inspection  
**Date:** November 24, 2026  

---

## Root Cause Evaluation Matrix

| Potential Cause | Status | Live Evidence |
| :--- | :---: | :--- |
| **1. Custom Post Type (CPT) Configuration** | **CONFIRMED** | Public REST API `/wp-json/wp/v2/types` lists **no `project` or `portfolio` CPT**. All 30+ project URLs are standard WordPress `page` records (`post_type = page`). |
| **2. Taxonomy / Category Assignments** | **CONFIRMED** | `/wp-json/wp/v2/taxonomies` lists only `category`, `post_tag`, `nav_menu`, `wp_pattern_category`. There is **no portfolio category taxonomy** on the live site. |
| **3. Portfolio Query & Filtering Logic** | **CONFIRMED** | Because no CPT or taxonomy exists, the Homepage Portfolio section (`#nx-project1`) renders a **static/hardcoded list of 12 links**, rather than dynamically querying all published `/project-*` pages. `/project/` has `0` project links and `0` filter buttons. |
| **4. WordPress Post Status** | **NOT CONFIRMED** *(as cause of hiding)* | All 19 hidden project pages return **HTTP 200 OK** and appear in `wp-sitemap-posts-page-1.xml`, proving they ARE `publish` status — they are simply not linked from the static Homepage grid. |
| **5. Pagination or JavaScript Errors** | **NOT CONFIRMED** | Live rendering under `https://egyptcreative.com/` origin produces **0 JavaScript console errors**. No pagination controls exist on `#nx-project1` or `/project/`. |
| **6. Theme Template Conditions** | **PARTIALLY CONFIRMED** | The 17 hidden client pages were cloned from `single-project/` (Modon Developments template) with only `<title>` changed, leaving `<h1>` and body text identical. |
