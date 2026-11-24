# PHASE 3.3 — PRODUCTION READINESS & DEPLOYMENT RUNBOOK

**Target Production:** `https://egyptcreative.com/` (Hostinger Agency Hosting)  
**Local Workspace:** `D:\Antigravity\Projects\egypt-creative`  
**Theme:** Noryx (`/wp-content/themes/noryx`)  
**Assessment Date:** November 24, 2026  
**Final Status:** **CONDITIONAL GO (Approved for Staged Deployment)**

---

## 1. Architectural Readiness Assessment

The Dynamic Portfolio System has been built and tested according to the Universal Engineering Standards.

### Architecture Comparison
```
BEFORE (Legacy Production)                 AFTER (Dynamic System)
+------------------------------------+      +------------------------------------+
| Hardcoded Elementor Page 1825      |      | WordPress Native Custom Post Type  |
| - 12 Manual links                  |      | - CPT: `project`                   |
| - Empty `/project/` archive        | ---> | - Taxonomy: `project_industry`     |
| - 18 Duplicate "Modon" pages       |      | - Dynamic `/project/` Archive      |
| - Broken / Unused CPT mapping      |      | - Regex Rewrite: `^project-([^/]+)`|
| - Double brand titles in `<title>` |      | - Exact URL preservation (200 OK)  |
+------------------------------------+      +------------------------------------+
```

### Technical Deliverables Package
The implementation consists of the following modified and added theme files inside `wp-content/themes/noryx/`:

1. `inc/project-cpt.php`:
   - Registers CPT `project` (`has_archive => true`, `rewrite => ['slug' => 'project', 'with_front' => false]`).
   - Registers taxonomy `project_industry` (`hierarchical => true`).
   - Registers custom rewrite rule: `^project-([^/]+)/?$` -> `index.php?project=$matches[1]`.
   - Filters `post_type_link` so permalinks format cleanly as `/project-<slug>/`.
2. `archive-project.php`:
   - Native Noryx archive template rendering the 12 approved projects.
   - Fully responsive 3-column / 2-column / 1-column layout.
3. `single-project.php`:
   - Single project view loading `template-project-content.php`.
4. `template-project-content.php`:
   - High-end agency case study layout (overview, industry, client, services, next/prev navigation).
5. `functions.php`:
   - Loads `inc/project-cpt.php`.
   - Title tag deduplication and structured data hooks.

---

## 2. Rewrite Rule Safety & Conflict Analysis

### Regex Rule Evaluation
```php
add_rewrite_rule( '^project-([^/]+)/?$', 'index.php?project=$matches[1]', 'top' );
```

| Route Pattern | Target Destination | Collision Risk | Staging Test Result |
|---|---|:---:|:---:|
| `/project-<slug>/` | CPT `project` post with slug matching `<slug>` | **NONE** (Dedicated prefix) | HTTP 200 (12/12 Verified) |
| `/project/` | Native CPT Archive (`archive-project.php`) | **NONE** | HTTP 200 (Verified) |
| `/` (Homepage) | Front page template | **NONE** | HTTP 200 (Verified) |
| `/sample-page/` | Standard WordPress Page | **NONE** | HTTP 200 (Verified) |
| `/wp-admin/` | WordPress Core Admin | **NONE** | HTTP 200 (Verified) |
| `/random-404-url/` | Standard 404 Handler | **NONE** | HTTP 404 (Verified) |

*Conclusion:* The regex rule is safe and completely isolated by the `project-` namespace prefix.

---

## 3. Pre-Deployment Risk Assessment

| Risk Item | Severity | Likelihood | Mitigation Strategy |
|---|:---:|:---:|---|
| **Elementor Homepage Desync** | Medium | Low | Maintain existing live Elementor links until dynamic shortcode/widget is updated. |
| **Missing Featured Image Thumbnails**| Low | Medium | Graceful fallback (`has_post_thumbnail()`) prevents broken images. Attach thumbnails post-deploy in WP Admin. |
| **Rewrite Cache Invalidation** | Medium | Medium | Flushed automatically via WP Admin -> Permalinks -> "Save Changes" immediately upon deployment. |
| **Database Collisions** | Low | Low | Projects are imported as new CPT `project` entries; standard pages are untouched. |

---

## 4. Step-by-Step Production Deployment Runbook

Follow this sequential runbook strictly. Do not execute deployment without user authorization.

### Phase 1: Pre-Deployment Backup
1. **Live Database Backup:**
   - Export full production MySQL database via Hostinger hPanel or WP-CLI (`wp db export pre_phase3_deploy.sql`).
2. **Live Theme Backup:**
   - Create a ZIP archive of `wp-content/themes/noryx` on production as `noryx_backup_pre_deploy.zip`.

### Phase 2: File Deployment
Deploy only the verified files to `wp-content/themes/noryx/` on Production:
- `inc/project-cpt.php`
- `archive-project.php`
- `single-project.php`
- `template-project-content.php`
- `functions.php` (append CPT require)

### Phase 3: Rewrite Rules Invalidation
1. Log in to Production WordPress Admin (`/wp-admin/`).
2. Navigate to **Settings > Permalinks**.
3. Click **Save Changes** (without modifying options) to flush rewrite rules into the database.
4. Verify `/project/` loads HTTP 200.

### Phase 4: Project Content & Thumbnail Finalization
1. Under **Projects > All Projects**, verify the 12 approved projects exist with status `Published`.
2. For each project, upload and attach the official client cover image as the **Featured Image**.
3. Verify that all 12 URLs (`/project-modon/`, `/project-2b/`, etc.) render HTTP 200 with complete layouts and images.

### Phase 5: Homepage Link Verification
1. Open the homepage on live production.
2. In the Portfolio section, confirm that "View All Works" links to `/project/`.

---

## 5. Rollback Plan

If any unexpected regression occurs on Production:
1. **Instant Rollback:** Restore the backup theme directory from `noryx_backup_pre_deploy.zip`.
2. **Permalink Flush:** Navigate to **Settings > Permalinks** and click **Save Changes**.
3. **Database Rollback:** If CPT records cause any conflict, run:
   ```sql
   DELETE FROM wp_posts WHERE post_type = 'project';
   DELETE FROM wp_term_relationships WHERE object_id NOT IN (SELECT ID FROM wp_posts);
   ```
4. Full recovery duration: < 5 minutes.

---

## 6. Formal Recommendation: CONDITIONAL GO

The Dynamic Portfolio Architecture has passed all local staging and forensic acceptance checks. All 12 approved URLs are strictly preserved, unapproved pages are completely sequestered, and zero regressions exist in layout or server health.

**Proceed to Production Deployment only after formal stakeholder approval of this runbook.**
