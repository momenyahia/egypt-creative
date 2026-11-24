# Codebase File Inventory & Component Mapping

## Directory Structure

```
c:\Users\momen\egyptcreative-backup\
│
├── .htaccess
├── api.php
├── index.html
├── dashboard.html
└── admin.html
```

---

## File Details & Functional Specifications

### 1. `.htaccess`
- **Purpose**: Apache Web Server runtime configuration, rewrite rules, and response header configuration.
- **Key Routing Rules**:
  - `RewriteRule ^api$ api.php [L,QSA]`
  - `RewriteRule ^api/(.*)$ api.php [L,QSA]`
  - `RewriteRule ^admin$ admin.html [L]`
  - `RewriteRule ^case-study/([a-zA-Z0-9_-]+)/?$ case-study.html?slug=$1 [L,QSA]`
- **Header Directives**: Defines `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`, and zero-cache directives for dynamic extensions (`.html`, `.php`, `.js`, `.css`).

---

### 2. `api.php`
- **Purpose**: Core backend REST API engine, SQLite PDO layer, authentication router, and CMS data controller.
- **Helper Functions**:
  - `logActivity($db, $icon, $message)`: Appends activity log entries to `activity_logs`.
  - `getJsonInput()`: Normalizes raw `php://input` JSON bodies, `$_GET`, and `$_POST`.
  - `restoreSessionFromCookie($db)`: Authenticates user session from persistent `egypt_admin_auth` HMAC cookie.
  - `verifyCsrfToken()`: Validates `HTTP_X_CSRF_TOKEN` or `csrf_token` POST parameter.
  - `requireAuth($allowedRoles)`: Enforces role-based endpoint access control.
- **Action Switch Router**: Handles 34 distinct action cases for auth, CMS content, portfolio, services, media, inquiries, analytics, and SMTP settings.

---

### 3. `index.html`
- **Purpose**: Public agency marketing landing page.
- **Components & Sections**:
  - Preloader & custom cursor elements
  - Header & Navigation (`#site-header`, mobile navigation dialog)
  - Hero Section (`#home`) with Canvas animation background and 4-step slogan scroll
  - Agency Statistics Counter Band
  - About Us Section (`#about`) with 3 tabs (Who We Are, Vision, Mission) and 2011 KPI Showcase
  - Services Grid (`#services`) with 8 service cards
  - Portfolio Showcase (`#work`) featuring 5-circle interactive showcase
  - Client Testimonials & Marquee (`#testimonials`)
  - Contact Form Section (`#contact`) submitting to `api.php?action=submit_inquiry`
  - Site Footer (`footer`) with social links and newsletter form

---

### 4. `dashboard.html`
- **Purpose**: Single-page administrative dashboard and Content Management System UI.
- **Sidebar & Navigation Tabs**:
  - **Overview (`dashboard`)**: KPI metrics (visits, leads, WhatsApp clicks), Charts (`Chart.js`), Conversion Funnel.
  - **Content Management (`pages`, `services`, `process`, `navigation`, `portfolio`, `clients`, `team`, `testimonials`, `footer-social`)**: Complete CMS editing suites.
  - **CRM & Leads (`all-leads`, `inquiries`, `whatsapp-leads`)**: Lead inbox, pipeline status changer, and CSV export.
  - **Analytics & Media (`analytics`, `media`, `seo`)**: Traffic reports, media library storage grid, SEO metadata form.
  - **System (`users`, `tracking-settings`, `email-security`, `settings`)**: RBAC user accounts, SMTP configuration, WhatsApp tracking setup, password changes.

---

### 5. `admin.html`
- **Purpose**: Administrator authentication and initial setup portal.
- **Features**:
  - Dynamic API status checker (`check_setup_status`).
  - First-run Super Admin creation form (`#setupPanel`) shown automatically if 0 user accounts exist.
  - Normal admin sign-in form (`#loginPanel`) submitting credentials to `api.php?action=login`.
  - Client-side redirect to `dashboard.html` upon successful authentication.
