# API Endpoint & Action Router Mapping

All API endpoints are processed by `api.php`. Action routing is determined by the `action` request parameter (supplied via URL query or JSON payload).

---

## Action Map Reference Table

| Action Name | HTTP Methods | Authentication Required | Allowed Roles | Description / Functionality |
| :--- | :--- | :--- | :--- | :--- |
| `check_setup_status` / `check_first_run` | `GET` / `POST` | Public | None | Checks if Super Admin account exists in the `users` table. |
| `setup_super_admin` / `setup_initial_admin` | `POST` | Public (Locked if SA exists) | None | Creates the initial Super Admin account when 0 accounts exist. |
| `login` | `POST` | Public | None | Verifies user credentials (`username`/`email` and `password_hash`), creates session, sets signed auth cookie. |
| `verify_session` | `GET` / `POST` | Session Cookie | All Roles | Validates current session status and returns active user profile & CSRF token. |
| `logout` | `GET` / `POST` | Public | None | Clears active PHP session variables and expires authentication cookies. |
| `get_data` | `GET` / `POST` | Public | None | Unified CMS endpoint returning all public content (Hero, About, Services, Portfolio, Clients, Testimonials, Team). |
| `get_project_by_slug` | `GET` | Public | None | Fetches detailed portfolio case study object by `slug` or `id`. |
| `submit_inquiry` / `submit_contact` | `POST` | Public | None | Saves public contact form submissions into `inquiries` table. |
| `track_visit` | `POST` | Public | None | Records visitor page views, IP address, and device type into `analytics_visits`. |
| `track_event` / `track_whatsapp_click` | `POST` | Public | None | Records WhatsApp button clicks or custom event triggers into `analytics_events`. |
| `save_content` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Batch or single update of key-value CMS content strings in `content` table. |
| `save_project` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Creates or updates portfolio case studies in `portfolio` table. |
| `delete_project` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Removes a portfolio case study entry by `id`. |
| `save_client` | `POST` | Authenticated | `super_admin`, `admin` | Creates or updates client logo partner entry in `clients` table. |
| `delete_client` | `POST` | Authenticated | `super_admin`, `admin` | Removes client logo partner by `id`. |
| `save_service` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Creates or updates service offering details in `services` table. |
| `delete_service` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Removes a service offering by `id`. |
| `get_media` | `GET` | Public / Admin | All Roles | Scans `assets/uploads/` directory on disk and returns file listing. |
| `upload_media` / `upload_image` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Handles binary/multipart image and video uploads to `assets/uploads/`. |
| `delete_media` | `POST` | Authenticated | `super_admin`, `admin` | Unlinks media file from `assets/uploads/` disk and `media` table. |
| `get_inquiries` | `GET` | Authenticated | `super_admin`, `admin`, `sales` | Retrieves list of contact form inquiry submissions. |
| `update_inquiry_status` | `POST` | Authenticated | `super_admin`, `admin`, `sales` | Updates lead pipeline status (`New`, `Contacted`, `Qualified`, `Converted`, `Closed`) and notes. |
| `get_whatsapp_leads` / `get_all_leads` | `GET` | Authenticated | `super_admin`, `admin`, `editor`, `sales`, `viewer` | Returns aggregated WhatsApp click leads and contact form leads. |
| `get_analytics` / `get_dashboard_stats` | `GET` | Authenticated | `super_admin`, `admin`, `editor`, `sales`, `viewer` | Calculates aggregate traffic metrics, conversion funnel, device shares, and top pages. |
| `get_seo` | `GET` | Public | None | Returns active SEO meta tags, title, description, and OpenGraph parameters. |
| `save_seo` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Updates SEO meta content records in `content` table. |
| `get_email_settings` | `GET` | Authenticated | `super_admin`, `admin` | Fetches SMTP configuration status. |
| `save_email_settings` | `POST` | Authenticated | `super_admin` | Updates SMTP host, port, username, encryption, and notification destination. |
| `test_smtp` | `POST` | Authenticated | `super_admin`, `admin` | Performs TCP socket connection test (`fsockopen`) to configured SMTP host/port. |
| `get_users` | `GET` | Authenticated | `super_admin` | Returns administrative user account list. |
| `save_user` | `POST` | Authenticated | `super_admin` | Creates or updates admin user accounts, roles, and JSON permissions. |
| `delete_user` | `POST` | Authenticated | `super_admin` | Deletes user account (prevents deleting last `super_admin` or self). |
| `toggle_user_status` | `POST` | Authenticated | `super_admin` | Enables or suspends user account access. |
| `toggle_team_visibility` / `save_team_settings` | `POST` | Authenticated | `super_admin`, `admin`, `editor` | Updates team section visibility status in `content` table. |

---

## Response Formats

- **Success Standard Response**:
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
  }
  ```
- **Error Standard Response**:
  ```json
  {
    "success": false,
    "message": "Error description message"
  }
  ```
