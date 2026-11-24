# Egypt Creative — Work Log & System Memory (CHANGELOG_MEM_2026.md)
*Date: September 4, 2026*

## 1. Hero Scroll-Pinned Step Rotation & Zero Gap Fix
- **Restored Native Sticky Scroll Pinning**:
  - Removed `overflow-x: clip;` from `html` and `body` which previously broke CSS `position: sticky;` on modern browsers and caused the screen to scroll away immediately.
  - Set `.hero` scroll track to a balanced `180vh` with `.hero-sticky` at `position: sticky; top: 0; height: 100vh; height: 100dvh;`.
  - Enabled sticky scroll on **both desktop and mobile viewports** (`@media (max-width: 768px)`).
- **Eliminated Black Void / Space Below Moving Content**:
  - Docked `.hero-marquee` neatly at the exact bottom of `.hero-sticky` (`margin-top: auto; margin-bottom: 0;`), with the `.hero-scroll-hint` positioned right above it (`bottom: 54px;`).
  - Vertically centered `.hero-content` with `margin: auto 0;`, creating a balanced, luxurious layout with zero empty black void.
  - Once the 4 text steps complete, the next section (`.stats-band`) slides up immediately without any extra gap.
- **Dual Interaction (Scroll + Idle Auto-Rotate)**:
  - Scrolling (mouse wheel on desktop, swipe on mobile) actively steps through all 4 text headlines cleanly.
  - If the user is idle at the top of the page without scrolling, an auto-rotation timer gently steps through the slides every 3.4s. The moment the user touches or scrolls, scroll position takes over instantly.

## 2. Yellow Spotlight Glow Removal
- **Completely Removed `.hero::before`**:
  - Removed the yellow radial spotlight glow from both Dark Mode and Light Mode (`display: none !important; content: none !important;`).
  - Dark mode now features a clean, sleek deep-navy luxury background with subtle particle canvas.
  - Light mode is crisp, modern, and pure white/light-gray without any dirty yellow blob on top.

## 3. Infinite Marquee Ticker Loop
- **Continuous Ticker**: Quadrupled elements in `.marquee-track` and set `heroMarqueeTrack` (35s linear infinite) with `direction: ltr`, ensuring the services ticker loops endlessly without interruption.

## 4. Bilingual Services Dynamic Translation
- **Arabic CMS Services**: Configured `renderServicesFromCMS` with `activeLang` support to dynamically render `name_ar` and `desc_ar` on language toggle.

## 5. Portfolio & Client Showcase (All 13 Projects Added & Bilingual)
- **13 Real Client Companies Populated**:
  1. Azzam Real Estate & Interior Finishing / عزام للاستثمار العقاري والتشطيبات
  2. Egypt Builders Construction / إيجيبت بيلدرز للمقاولات
  3. Next Executive Academy / أكاديمية نكست للإدارة والذكاء الاصطناعي
  4. Ramadan Majlis Event / مجلس رمضان للفعاليات والمؤتمرات
  5. Smile Care Dental Clinics / عيادات سمايل كير إيجيبت لطب وزراعة الأسنان
  6. The Smile Dental Center / مركز ذا سمايل لتجميل الأسنان
  7. German Pest Control Services / الشركة الألمانية لمكافحة الحشرات والآفات
  8. Egyptian Center for Training & Management / المركز المصري للتدريب وإدارة الأعمال
  9. Badae' Express Logistics / شركة بضائع للشحن السريع واللوجستيات
  10. Hawawshi El-Rayyan / مطعم حواوشي الريان
  11. Sultan Al-Mandi / مطعم سلطان المندي
  12. Doaa Pharmacy & Healthcare / صيدلية د. دعاء والرعاية الصحية
  13. Fish Day Seafood Restaurant / مطعم يوم السمك للمأكولات البحرية
- **Full Bilingual Case Studies**:
  - Arabic and English titles, categories, descriptions, challenges, strategies, solutions, executions, and concrete results.
  - 3 dynamic metrics per project (e.g. ROAS, Reach, Patient/Client Surge) in both English and Arabic.
  - 113 optimized high-resolution web visuals (logos, covers, galleries) hosted at `assets/portfolio_web/`.
- **Integrated Across UI**:
  - Golden Circle Showcase on Homepage dynamically steps through projects with direct "View Case Study ↗" buttons.
  - Success Partners Marquee dynamically displays all 13 client brands.
  - Individual Case Study page (`case-study.html?project=slug`) dynamically renders full project details, gallery lightbox, metrics, and bilingual toggle.

## 6. Case Study Page Header & Light Mode
- **Metadata Aligned at Top**: In Arabic mode, the project title is on the right, and the Metadata Bar (Client, Category, Year) is positioned on the left (`شمال`), aligned with the title.
- **Full Light Mode Support**: Added theme toggle button (`#csThemeToggle`) and high-contrast light theme styles.

## 7. Deployment Status
- Live on production: `https://egyptcreative.com`.
