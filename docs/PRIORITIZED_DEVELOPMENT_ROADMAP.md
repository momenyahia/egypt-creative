# EGYPT CREATIVE — PRIORITIZED DEVELOPMENT ROADMAP
## Staged Engineering Roadmap, Safe Implementation Sequence & Risk Mitigation Protocols

**Project:** Egypt Creative Production Website (`https://egyptcreative.com/`)  
**Target Architecture:** Noryx Theme / WordPress 7.1.5 / LiteSpeed Cache / Hostinger Edge CDN  
**Implementation Standard:** Zero Downtime, Zero Loss of Live Functionality, Step-by-Step Staged Execution  
**Audit Date:** November 24, 2026  
**Engineering Lead:** Principal Software Architect & Release Manager  

---

## 1. Executive Implementation Phasing

To eliminate operational risk on the live production environment, all engineering remediation is partitioned into **4 sequential, independently verifiable phases**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     4-PHASE DEVELOPMENT ROADMAP                        │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: CRITICAL FIXES & IMMEDIATE REPAIR (Days 1 - 2)                │
│  - Re-architect /project/ archive (Remove themexriver links, loop 12)  │
│  - Eliminate double-branding title tags across all 12 projects         │
│  - Correct Cairo Capital Hub title and canonical targets               │
│  - Secure /xmlrpc.php, /readme.html, /license.txt in .htaccess         │
│  - 301 redirect conventional 404 slugs (/portfolio/, /works/, etc.)    │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: PORTFOLIO UNIFICATION & CASE STUDY POLISH (Days 3 - 5)        │
│  - Migrate 10 Elementor projects to unified template-project.php       │
│  - Implement previous/next project pagination across all 12 projects   │
│  - Standardize 16:9 video containers and high-DPI poster images        │
│  - Unify project category filters (Real Estate, Tech, Luxury, FMCG)    │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: SEO CLEANUP & SITEMAP HYGIENE (Days 6 - 7)                    │
│  - Filter wp-sitemap.xml (Exclude noryx_template, dummy posts, shop)   │
│  - Purge duplicate placeholder blog posts from database                │
│  - Implement Schema.org JSON-LD (AdvertisingAgency & CreativeWork)     │
│  - Add descriptive alt attributes to 13 uncaptioned images             │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: CODEBASE MODERNIZATION & BILINGUAL FOUNDATION (Days 8 - 12)   │
│  - Eliminate 25+ runtime regex replacements in front-page.php          │
│  - Consolidate 57 CSS/JS requests into optimized bundles               │
│  - Configure LiteSpeed Cache preloading and stale-while-revalidate     │
│  - Establish Arabic (RTL) localization foundation                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase 1: Critical Fixes & Immediate Repairs (Days 1 – 2)

| Task ID | Component | Operational Action | Risk Level | Verification Step |
| :--- | :--- | :--- | :---: | :--- |
| **P1-01** | `/project/` Archive | Replace ThemeForest demo cards with dynamic query looping the 12 approved projects. Strip all `themexriver.com` links. | Low | Visit `/project/`; confirm all 12 projects display with local links. |
| **P1-02** | Title Tag Hook | Update `functions.php` document title filter to prevent double site name appending (`– Egypt Creative – Egypt Creative`). | Low | Check `<title>` tag on all 12 project pages via curl. |
| **P1-03** | Cairo Capital Hub | Correct title tag from `Cairo Capital Video` to `Cairo Capital Hub`. | Low | Verify `<title>` and OpenGraph tags in page source. |
| **P1-04** | Security Lockdown | Add `.htaccess` directives denying public access to `xmlrpc.php`, `readme.html`, and `license.txt`. | Low | Probe endpoints; verify HTTP 403 Forbidden is returned. |
| **P1-05** | 301 Route Aliasing | Add `.htaccess` 301 redirects mapping `/portfolio/`, `/works/`, `/projects/`, `/our-works/` to `/project/`. | Low | Test curl requests on all 4 slugs; confirm 301 to `/project/`. |
| **P1-06** | Modon Link Update | Update homepage link from `/project-modon/` directly to canonical `/project-modon-developments/`. | Low | Confirm 0 redirect hops on Modon portfolio card click. |

---

## 3. Phase 2: Portfolio Unification & Case Study Depth (Days 3 – 5)

| Task ID | Component | Operational Action | Risk Level | Verification Step |
| :--- | :--- | :--- | :---: | :--- |
| **P2-01** | Template Migration | Assign `template-project.php` to the 10 Elementor project pages in WordPress database (`_wp_page_template`). | Medium | Verify layout consistency across all 12 projects on desktop and mobile. |
| **P2-02** | Project Pagination | Implement circular next/previous navigation footer in `template-project-content.php` connecting all 12 projects. | Low | Click "Next Project" through all 12 projects; confirm infinite loop. |
| **P2-03** | Poster Frames | Ensure every project video has a designated high-DPI poster image (`poster="..."`) and `preload="metadata"`. | Low | Inspect video DOM elements; verify zero initial bandwidth stall. |
| **P2-04** | Case Study Copy | Enrich project descriptions with a 3-part narrative structure (*Challenge -> Strategy -> Impact*). | Low | Review readability and executive tone on live project pages. |

---

## 4. Phase 3: SEO Cleanup & Indexability (Days 6 – 7)

| Task ID | Component | Operational Action | Risk Level | Verification Step |
| :--- | :--- | :--- | :---: | :--- |
| **P3-01** | Sitemap Filtering | Implement `wp_sitemaps_post_types` filter in theme to remove `noryx_template` from `wp-sitemap.xml`. | Low | Visit `https://egyptcreative.com/wp-sitemap.xml`; confirm 0 template parts. |
| **P3-02** | Dummy Post Purge | Permanently delete 4 placeholder posts (`hello-world`, `hello-world-copy`, etc.) from WordPress admin. | Low | Verify `/hello-world/` returns 410 or clean 404; sitemap count drops. |
| **P3-03** | JSON-LD Schema | Inject `AdvertisingAgency` schema on homepage and `CreativeWork` schema on all 12 project pages. | Low | Validate with Google Rich Results Test tool. |
| **P3-04** | Image Alt Audit | Add descriptive `alt="..."` attributes to the 13 uncaptioned homepage images. | Low | Run automated DOM inspection; confirm 100% alt coverage. |
| **P3-05** | OG Social Banner | Design and set a 1200×630px branded editorial OpenGraph banner replacing transparent logo. | Low | Test sharing link in Facebook Debugger and LinkedIn Inspector. |

---

## 5. Phase 4: Codebase Modernization & Bilingual Expansion (Days 8 – 12)

| Task ID | Component | Operational Action | Risk Level | Verification Step |
| :--- | :--- | :--- | :---: | :--- |
| **P4-01** | Refactor `front-page` | Replace runtime `preg_replace()` string replacements in `front-page.php` with native theme action hooks. | High | Test homepage layout, team cards, and numbers for zero regression. |
| **P4-02** | Script Deferral | Move `jquery.min.js` and non-critical scripts to footer with `defer` attributes. | Medium | Verify preloader, sliders, mobile menu, and CF7 function smoothly. |
| **P4-03** | Asset Minification | Merge theme CSS files into unified minified bundle; purge unreferenced vendor styles. | Medium | Measure network payload; confirm reduction from 57 to < 20 requests. |
| **P4-04** | Arabic RTL Toggle | Scaffold bilingual language toggle (`EN | AR`) with Tajawal font and RTL stylesheet. | Medium | Toggle between languages; verify mirror layout and typography harmony. |

---

## 6. Safety Protocols & Rollback Architecture

To ensure zero risk of production downtime or data loss:
1. **Pre-Change Database Snapshot:** Export full SQL database backup (`mysqldump`) prior to commencing any phase.
2. **Theme File Versioning:** Maintain timestamped copies of every modified PHP file in `noryx-live-theme/noryx_backup_original/`.
3. **Staging Environment Validation:** Every code modification must be executed and visually regression-tested on the local staging environment (`D:\Antigravity\Projects\egypt-creative\staging-site`) before deployment to production.
4. **Instant Rollback Mechanism:**
   - In the event of an unexpected PHP fatal error or CSS regression, restore the original theme template file via Hostinger File Manager / FTP in **< 60 seconds**.
   - Clear LiteSpeed Cache immediately via admin bar or `.litespeed_cache` flush to purge stale assets.
