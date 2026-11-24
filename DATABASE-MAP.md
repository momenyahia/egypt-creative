# Database Schema & Data Mapping

## Overview

The backend engine uses **SQLite 3** via PHP Data Objects (PDO). The database file location resolves dynamically:
1. Primary Production Path: `dirname(__DIR__, 2) . '/persistent_storage/egypt_creative_production.db'`
2. Local Development Path: `__DIR__ . '/database.db'`

---

## Entity-Relationship Table Schemas

### 1. Table: `users`
Stores administrative system accounts, role assignments, and granular permissions.
- `id` (INTEGER, Primary Key, Auto Increment)
- `username` (TEXT, Unique)
- `email` (TEXT, Unique)
- `password_hash` (TEXT)
- `role` (TEXT, Default: `'admin'`)
- `name` (TEXT, Default: `''`)
- `permissions` (TEXT, JSON array, Default: `'[]'`)
- `active` (INTEGER, Default: `1`)
- `created_at` (DATETIME, Default: `CURRENT_TIMESTAMP`)
- `updated_at` (DATETIME, Default: `CURRENT_TIMESTAMP`)

---

### 2. Table: `content`
Key-value store for static website content, hero text, section headers, SEO meta, and SMTP configuration.
- `section_key` (TEXT)
- `content_key` (TEXT)
- `content_val_en` (TEXT, Default: `''`)
- `content_val_ar` (TEXT, Default: `''`)
- **Primary Key**: (`section_key`, `content_key`)

---

### 3. Table: `portfolio`
Case studies, client project showcases, gallery assets, and metrics.
- `id` (TEXT, Primary Key)
- `slug` (TEXT, Unique)
- `company_name_en`, `company_name_ar`, `company_logo` (TEXT)
- `title_en`, `title_ar`, `category`, `category_ar` (TEXT)
- `img`, `gallery`, `client`, `year`, `tag` (TEXT)
- `desc_en`, `desc_ar`, `challenge_en`, `challenge_ar` (TEXT)
- `strategy_en`, `strategy_ar`, `solution_en`, `solution_ar` (TEXT)
- `execution_en`, `execution_ar`, `results_en`, `results_ar` (TEXT)
- `project_url`, `case_study_url`, `video_url` (TEXT)
- `featured` (INTEGER, Default: `0`)
- `display_order` (INTEGER, Default: `0`)
- `active` (INTEGER, Default: `1`)
- `metric_val1`, `metric_lbl1_en`, `metric_lbl1_ar` (TEXT)
- `metric_val2`, `metric_lbl2_en`, `metric_lbl2_ar` (TEXT)
- `metric_val3`, `metric_lbl3_en`, `metric_lbl3_ar` (TEXT)
- `seo_title_en`, `seo_title_ar`, `seo_desc_en`, `seo_desc_ar`, `seo_keywords`, `seo_og_image` (TEXT)
- `created_at`, `updated_at` (DATETIME)

---

### 4. Table: `services`
Agency service offerings listed on the homepage.
- `id` (TEXT, Primary Key)
- `name_en`, `name_ar` (TEXT)
- `desc_en`, `desc_ar` (TEXT)
- `icon_svg` (TEXT)
- `badge_en`, `badge_ar` (TEXT)
- `cta_text_en`, `cta_text_ar`, `cta_url` (TEXT)
- `display_order` (INTEGER, Default: `0`)
- `featured` (INTEGER, Default: `0`)
- `active` (INTEGER, Default: `1`)

---

### 5. Table: `team`
Agency team member profiles.
- `id` (TEXT, Primary Key)
- `name`, `name_ar` (TEXT)
- `role_en`, `role_ar` (TEXT)
- `bio_en`, `bio_ar` (TEXT)
- `img`, `social_linkedin`, `social_instagram`, `social_twitter` (TEXT)
- `display_order` (INTEGER, Default: `0`)
- `active` (INTEGER, Default: `1`)

---

### 6. Table: `clients`
Client logo partner marquee entries.
- `id` (TEXT, Primary Key)
- `name`, `logo_url`, `website_url`, `style` (TEXT)
- `display_order` (INTEGER, Default: `0`)
- `active` (INTEGER, Default: `1`)

---

### 7. Table: `testimonials`
Client review quotes and ratings.
- `id` (TEXT, Primary Key)
- `quote_en`, `quote_ar`, `author`, `position_en`, `position_ar`, `company` (TEXT)
- `avatar_gradient`, `avatar_initials` (TEXT)
- `rating` (INTEGER, Default: `5`)
- `display_order` (INTEGER, Default: `0`)
- `active` (INTEGER, Default: `1`)

---

### 8. Table: `inquiries`
Contact form submissions (CRM pipeline).
- `id` (INTEGER, Primary Key, Auto Increment)
- `name`, `email`, `phone`, `company`, `service`, `budget`, `message` (TEXT)
- `status` (TEXT, Default: `'New'`)
- `notes` (TEXT)
- `page` (TEXT, Default: `'Homepage'`)
- `submitted_at` (DATETIME, Default: `CURRENT_TIMESTAMP`)

---

### 9. Table: `analytics_visits`
Traffic visitor analytics records.
- `id` (INTEGER, Primary Key, Auto Increment)
- `visitor_ip`, `page`, `device`, `referrer` (TEXT)
- `created_at` (DATETIME, Default: `CURRENT_TIMESTAMP`)

---

### 10. Table: `analytics_events`
WhatsApp CTA click and conversion tracking.
- `id` (INTEGER, Primary Key, Auto Increment)
- `event_type`, `source`, `metadata` (TEXT)
- `created_at` (DATETIME, Default: `CURRENT_TIMESTAMP`)

---

### 11. Table: `media`
Uploaded file registry.
- `id` (INTEGER, Primary Key, Auto Increment)
- `filename`, `filepath`, `mime_type` (TEXT)
- `file_size` (INTEGER)
- `uploaded_at` (DATETIME, Default: `CURRENT_TIMESTAMP`)

---

### 12. Table: `activity_logs`
Admin audit log entries.
- `id` (INTEGER, Primary Key, Auto Increment)
- `icon`, `message`, `user_email` (TEXT)
- `created_at` (DATETIME, Default: `CURRENT_TIMESTAMP`)
