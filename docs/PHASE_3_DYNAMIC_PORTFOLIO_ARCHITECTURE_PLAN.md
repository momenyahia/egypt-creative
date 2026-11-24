# EGYPT CREATIVE — PHASE 3: DYNAMIC PORTFOLIO ARCHITECTURE & IMPLEMENTATION PLAN

**Target Website:** `https://egyptcreative.com/`  
**Design Preservation Rule:** Strictly preserve the existing Noryx visual design, card layout, hover effects, typography, spacing, animations, and responsive behavior.  
**Status:** Planning & Implementation Preparation Only — **Zero Production Changes Applied**  
**Date:** November 24, 2026  

---

## 1. Portfolio Architecture Proposal

Currently, `https://egyptcreative.com/` has **no `project` Custom Post Type** and **no portfolio taxonomy**. All 30+ project URLs are static `page` records, `#nx-project1` on the Homepage renders a **hardcoded 12-link list**, and `/project/` is empty.

### Target Architecture
1. Register a dedicated **`project`** Custom Post Type (`has_archive => true`, `rewrite => ['slug' => 'project', 'with_front' => false]`).
2. Register **`project_industry`** (hierarchical taxonomy for industries/categories) and **`project_service`** (for services delivered).
3. Store structured project metadata (`client`, `year`, `project_url`, `gallery`, `display_order`, `summary`) in post meta (`_ec_project_*`).
4. Replace the hardcoded 12-project list in `#nx-project1` with a **`WP_Query(['post_type' => 'project', 'post_status' => 'publish', 'orderby' => 'menu_order', 'order' => 'ASC'])`** loop that outputs the **exact existing Noryx card HTML/CSS classes**.
5. Build `archive-project.php` (serving `/project/`) and `single-project.php` using `template-project.php` / `template-project-content.php` styling.

---

## 2. CPT & Taxonomy Schema

### Custom Post Type: `project`
```php
register_post_type('project', [
    'labels' => ['name' => 'Projects', 'singular_name' => 'Project'],
    'public' => true,
    'has_archive' => 'project',
    'rewrite' => ['slug' => 'project', 'with_front' => false],
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'page-attributes', 'revisions'],
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-portfolio',
]);
```

### Taxonomies
- **`project_industry`** (Hierarchical, `show_in_rest => true`, `rewrite => ['slug' => 'project-industry']`): e.g., Real Estate, Healthcare & Medical, F&B / Hospitality, Retail & Beauty, Technology.
- **`project_service`** (Non-hierarchical or hierarchical, `show_in_rest => true`): e.g., Social Media Management, Media Buying, Branding, Video Production, Web Development.

### Structured Project Meta Fields
| Field Key | Type | Purpose |
| :--- | :--- | :--- |
| `title` | Core `post_title` | Project / Client Display Name |
| `featured_image` | Core `_thumbnail_id` | Card & Hero Featured Image |
| `gallery` | `_ec_project_gallery` (IDs array) | Case Study Gallery Images |
| `description` | Core `post_content` / `post_excerpt` | Case Study Overview |
| `client` | `_ec_project_client` (string) | Client Name |
| `industry` | Taxonomy `project_industry` | Industry / Category |
| `services` | Taxonomy `project_service` | Services Delivered |
| `project_url` | `_ec_project_url` (URL) | Live Client Website / Video URL |
| `display_order` | Core `menu_order` (int) | Controls Homepage & Archive Sort Order |

---

## 3. Existing URL Migration Map & Content Safety

### Content Safety Rules Applied
- **Only the 12 verified projects** with unique live content are scheduled for initial migration.
- **16 Modon-cloned pages, `/single-project/`, `/project-mohamed-al-sagheer/`, and `/project-ywaves/` are EXCLUDED** from public listings until verified content is provided by the business owner.

### URL Preservation Strategy
Because existing live URLs use `/project-<slug>/` (e.g., `/project-2b/`) while a CPT with `slug => 'project'` uses `/project/<slug>/`:
- **Option A (Zero-Redirect Rewrite):** Add a WordPress `add_rewrite_rule('^project-([^/]+)/?$', 'index.php?project=$matches[1]', 'top')` + `post_type_link` filter so `/project-2b/` resolves directly to the `project` CPT with **HTTP 200** and **zero 301 redirects needed**.
- **Option B (Clean `/project/<slug>/` + 301):** Use `/project/2b/` and add `301` redirects from `/project-2b/` -> `/project/2b/` via Safe Redirect Manager. *(Option A is recommended for zero SEO link-equity loss.)*

| Current Live URL | Target CPT Slug | Migration Action | Public Listing? |
| :--- | :--- | :--- | :---: |
| `/project-2b/` | `2b` | Migrate verified content | **Yes** |
| `/project-azha-clinics/` | `azha-clinics` | Migrate verified content | **Yes** |
| `/project-cairo-capital/` | `cairo-capital` | Migrate verified content | **Yes** |
| `/project-dermasilk/` | `dermasilk` | Migrate verified content | **Yes** |
| `/project-doner-konner/` | `doner-konner` | Migrate verified content + 3 images | **Yes** |
| `/project-masaya-sidi-abdelrahman/` | `masaya-sidi-abdelrahman` | Migrate verified content | **Yes** |
| `/project-modon/` & `/project-modon-developments/` | `modon-developments` | Consolidate to one canonical; 301 the other | **Yes** |
| `/project-mohamed-el-sagheer/` | `mohamed-el-sagheer` | Migrate verified content | **Yes** |
| `/project-mohamed-al-sagheer/` | *(Duplicate)* | **Excluded** (301 to `el-sagheer` after approval) | **No** |
| `/project-remas-land/` | `remas-land` | Migrate verified content | **Yes** |
| `/project-saint-johns/` | `saint-johns` | Migrate verified content | **Yes** |
| `/project-touche-aesthetic/` | `touche-aesthetic` | Migrate verified content | **Yes** |
| `/project-yves-saint-laurent/` | `yves-saint-laurent` | Migrate verified content | **Yes** |
| 16 Modon-cloned `/project-*` + `/project-ywaves/` | *(Pending)* | **Excluded** — keep as `draft` until owner supplies content | **No** |
| `/single-project/` | *(Demo)* | **Excluded** — draft/remove from sitemap | **No** |

---

## 4. Frontend Implementation Plan

1. **Homepage (`#nx-project1`):** Replace the hardcoded 12-item HTML block with a `WP_Query` loop rendering the exact Noryx card classes, hover overlays, typography, and GSAP/WOW animation classes. New `publish` projects appear automatically in `menu_order` sequence.
2. **Dynamic Archive (`archive-project.php` at `/project/`):** Render all published `project` posts using the same Noryx card grid.
3. **Category Filtering:** Add `project_industry` filter tabs **only if** styled with the exact existing Noryx filter-tab CSS classes; otherwise keep clean grid without altering design.

---

## 5. SEO & Redirect Impact Assessment

- **Zero Link Loss:** Preserving `/project-<slug>/` via rewrite rule (Option A) keeps all existing backlinks, sitemap URLs, and canonicals intact.
- **Duplicate Elimination:** Excluding the 16 Modon clones and `/project-mohamed-al-sagheer/` removes duplicate content from `wp-sitemap.xml`.
- **Schema Upgrade:** `single-project.php` can output `CreativeWork` + `BreadcrumbList` JSON-LD automatically.

---

## 6. Rollback Plan

1. Take full WordPress database (`u656165302_aiptW`) and `noryx` theme backup before deployment.
2. All 12 original `page` records remain untouched as `draft` during initial cutover.
3. To roll back: deactivate the `project` CPT registration in `functions.php`, restore `front-page.php`, re-publish the 12 original `page` records, and flush permalinks (`wp rewrite flush`).

---

## 7. Decisions Requiring Your Approval

1. **URL Structure:** Approve **Option A** (preserve `/project-<slug>/` via rewrite rule, zero redirects) vs **Option B** (`/project/<slug>/` with 301s).
2. **Modon Canonical URL:** Confirm whether `/project-modon/` or `/project-modon-developments/` should be the primary URL.
3. **Category Filter Tabs:** Approve adding `project_industry` filter tabs on `/project/` using existing Noryx tab styling.
4. **Excluded 19 Pages:** Confirm keeping the 16 Modon-cloned pages + `/project-ywaves/` as `draft` until you provide their real content.
