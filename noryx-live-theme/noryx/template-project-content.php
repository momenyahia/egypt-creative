<?php
/**
 * Egypt Creative Project Case Study Content
 * Production-ready luxury template matching homepage Our Work style.
 */

// Determine current project from slug or URL parameter
$current_slug = get_post_field('post_name', get_the_ID());
if (empty($current_slug) || $current_slug === 'single-project') {
    $current_slug = isset($_GET['project']) ? sanitize_key($_GET['project']) : 'modon';
}

// Canonical Projects Registry - 100% Client Projects with Verified Media
$projects_database = array(
    'modon' => array(
        'aliases' => array('project-modon', 'modon', 'modon-developments'),
        'title' => 'Modon Developments',
        'client' => 'Modon Real Estate Developments',
        'category' => 'Real Estate & Architectural Media',
        'year' => '2025',
        'agency' => 'Egypt Creative 2025',
        'badge' => 'Real Estate Development Leader',
        'tagline' => 'Architectural cinematic visual production, commercial TVC, and luxury real estate branding.',
        'overview' => 'Egypt Creative engineered full-scale cinematic visual campaigns and architectural showcase videos for Modon Developments, articulating modern construction excellence, urban aesthetics, and premium investment opportunities.',
        'deliverables' => array(
            'Architectural Video Commercial & Cinematography',
            '3D Architectural Animation & Masterplan Render Media',
            'Strategic Real Estate Launch Campaign',
            'Digital & Print Prestige Marketing Collateral'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/modon-logo.png',
        'link' => home_url('/project-modon/'),
        'videos' => array(
            array(
                'title' => 'Modon Commercial Showcase',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/modon-commercial.mp4',
                'desc' => 'High-impact commercial video capturing architectural scale, modern design, and community living.'
            )
        ),
        'images' => array()
    ),
    '2b' => array(
        'aliases' => array('project-2b', '2b', '2b-egypt'),
        'title' => '2B Egypt',
        'client' => '2B Electronics & Tech Retail Group',
        'category' => 'Tech Retail & Consumer Electronics',
        'year' => '2024',
        'agency' => 'Egypt Creative 2024',
        'badge' => 'Technology Retail Leader',
        'tagline' => 'High-energy commercial TVC, modern in-store digital showcase, and performance video campaign.',
        'overview' => 'Egypt Creative produced premier video commercial content and dynamic visual branding for 2B Egypt, capturing the vibrant retail tech atmosphere, leading consumer electronics showcase, and seamless financing partnership experiences.',
        'deliverables' => array(
            'Cinematic Video Commercial & In-Store Showcase',
            'Commercial Promo & Social Reels Direction',
            'Multi-Platform Consumer Tech Advertising',
            'Official Brand Identity & Motion Design'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/2b-logo-official-v2.png',
        'link' => home_url('/project-2b/'),
        'videos' => array(
            array(
                'title' => '2B Commercial Showcase',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/2b-commercial.mov',
                'desc' => 'High-energy commercial promo highlighting retail tech and customer experience.'
            )
        ),
        'images' => array()
    ),
    'yves-saint-laurent' => array(
        'aliases' => array('project-yves-saint-laurent', 'yves-saint-laurent', 'project-ywaves', 'ywaves', 'ysl'),
        'title' => 'Yves Saint Laurent',
        'client' => 'Yves Saint Laurent (YSL)',
        'category' => 'High-End Fashion & Fragrance Campaign',
        'year' => '2023',
        'agency' => 'Egypt Creative 2023',
        'badge' => 'Luxury Beauty & Fashion',
        'tagline' => 'Iconic Parisian haute couture aesthetic, cinematic fragrance commercial, and luxury visual storytelling.',
        'overview' => 'Egypt Creative engineered luxury cinematic video productions and editorial brand assets for Yves Saint Laurent. The campaign highlighted high-end fragrance artistry, bold typography, and sophisticated Parisian aesthetic to deliver an unforgettable brand presence.',
        'deliverables' => array(
            'Haute Couture Cinematic Commercial Reel',
            'Editorial Photography & Visual Brand Direction',
            'Prestige Fragrance Launch Creative Strategy',
            'High-Engagement Social Media Visuals'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/yves-saint-laurent-logo-1.jpg',
        'link' => home_url('/project-yves-saint-laurent/'),
        'videos' => array(
            array(
                'title' => 'Yves Saint Laurent Cinematic Film',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/yves-saint-laurent-commercial.mov',
                'desc' => 'Luxury cinematic commercial exploring the timeless allure of YSL fragrance and fashion.'
            )
        ),
        'images' => array()
    ),
    'mohamed-el-sagheer' => array(
        'aliases' => array('project-mohamed-el-sagheer', 'project-mohamed-al-sagheer', 'mohamed-el-sagheer', 'mohamed-al-sagheer', 'alsogayer', 'sagheer'),
        'title' => 'Mohamed El Sagheer Salons',
        'client' => 'Mohamed El Sagheer Luxury Beauty Salons',
        'category' => 'Luxury Beauty & Cinematic Reels',
        'year' => '2024',
        'agency' => 'Egypt Creative 2024',
        'badge' => 'Iconic Beauty & Lifestyle',
        'tagline' => 'Heritage beauty elegance, high-fashion styling cinematography, and premium salon aesthetic.',
        'overview' => 'Full creative direction, cinematic video reels, and brand storytelling for Mohamed El Sagheer Salons. Highlighting precision hair artistry, elite beauty rituals, and timeless Egyptian luxury culture.',
        'deliverables' => array(
            'High-Fashion Cinematic Video Production',
            'Editorial Beauty & Styling Photography',
            'Social Media Reels & Engagement Strategy',
            'Salon Experience Visual Branding'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/mohamed-el-sagheer-logo.png',
        'link' => home_url('/project-mohamed-el-sagheer/'),
        'videos' => array(
            array(
                'title' => 'Mohamed El Sagheer Cinematic Reel',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/mohamed-el-sagheer-video-1.mp4',
                'desc' => 'Artistic beauty cinematography showcasing heritage salon craft and style.'
            )
        ),
        'images' => array()
    ),
    'doner-konner' => array(
        'aliases' => array('project-doner-konner', 'doner-konner', 'donner-coner', 'donner-corner'),
        'title' => 'Doner Konner Restaurant',
        'client' => 'Doner Konner Gourmet Restaurant',
        'category' => 'Restaurant Branding & Food Visuals',
        'year' => '2023',
        'agency' => 'Egypt Creative 2023',
        'badge' => 'Gourmet Culinary Brand',
        'tagline' => 'Appetizing culinary cinematography, modern restaurant packaging, and high-impact digital campaign.',
        'overview' => 'Egypt Creative orchestrated vibrant visual marketing, menu styling, and high-conversion food photography for Doner Konner, creating mouthwatering brand appeal that drove substantial dining and delivery demand.',
        'deliverables' => array(
            'Culinary Photography & Food Styling',
            'Social Media Content Engine & Ads Production',
            'Brand Identity, Menu Cards & Packaging Design',
            'Local Search & Delivery Growth Marketing'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/doner-konner-logo.jpg',
        'link' => home_url('/project-doner-konner/'),
        'videos' => array(),
        'images' => array(
            'https://egyptcreative.com/wp-content/uploads/2026/10/doner-konner-img-1.webp',
            'https://egyptcreative.com/wp-content/uploads/2026/10/doner-konner-img-2.webp',
            'https://egyptcreative.com/wp-content/uploads/2026/10/doner-konner-img-3.webp'
        )
    ),
    'touche' => array(
        'aliases' => array('project-touche-aesthetic', 'project-touche', 'touche-aesthetic', 'touche', 'touch'),
        'title' => 'Touche Aesthetic Clinic',
        'client' => 'Touche Clinic & Dermatology Center',
        'category' => 'Lifestyle & Aesthetic Care',
        'year' => '2022',
        'agency' => 'Egypt Creative 2022',
        'badge' => 'Prestige Medical Aesthetics',
        'tagline' => 'Scientific elegance, cinematic patient experience stories, and elite medical beauty marketing.',
        'overview' => 'Egypt Creative delivered comprehensive visual identity and commercial video interviews for Touche Aesthetic Clinic, building patient trust through refined aesthetics, doctor authority, and cinematic presentation.',
        'deliverables' => array(
            'Cinematic Doctor & Patient Interview Series',
            'Luxury Aesthetic Clinic Photography',
            'Medical Authority Social Media Campaigns',
            'Patient Journey Digital Content Strategy'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/touche-logo.png',
        'link' => home_url('/project-touche-aesthetic/'),
        'videos' => array(
            array(
                'title' => 'Touche Clinical Showcase & Interview',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/touche-commercial.mp4',
                'desc' => 'Exclusive clinical tour and doctor discussion on advanced cosmetic care.'
            )
        ),
        'images' => array()
    ),
    'masaya' => array(
        'aliases' => array('project-masaya-sidi-abdelrahman', 'masaya-sidi-abdelrahman', 'masaya'),
        'title' => 'Masaya Sidi Abdelrahman',
        'client' => 'Masaya Coastal Living by EGYGAB',
        'category' => 'Coastal Luxury Living & Hospitality',
        'year' => '2025',
        'agency' => 'Egypt Creative 2025',
        'badge' => 'Coastal Resort Architecture',
        'tagline' => 'Pristine coastal luxury, turquoise sea cinematography, and visionary real estate lifestyle showcase.',
        'overview' => 'Egypt Creative produced premier cinematic promotional films and brand media for Masaya Sidi Abdelrahman, highlighting the beauty of Egypt\'s Mediterranean shoreline, architectural elegance, and vibrant resort lifestyle.',
        'deliverables' => array(
            'Aerial 4K Drone Cinematography & Coastal TVC',
            'Resort Masterplan Showcase & Architecture Reels',
            'High-Net-Worth Investor Marketing Campaign',
            'Digital Experience & Brochure Presentation Design'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/masaya-sidi-abdelrahman-logo.png',
        'link' => home_url('/project-masaya-sidi-abdelrahman/'),
        'videos' => array(
            array(
                'title' => 'Masaya Coastal Lifestyle Film',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/masaya-commercial.mp4',
                'desc' => 'Breathtaking 4K cinematography showcasing the coastal living experience at Sidi Abdelrahman.'
            )
        ),
        'images' => array()
    ),
    'remas' => array(
        'aliases' => array('project-remas-land', 'remas-land', 'remas'),
        'title' => 'Remas Land',
        'client' => 'Remas Land Dairy & Food Industries',
        'category' => 'FMCG Commercial TVC Campaign',
        'year' => '2022',
        'agency' => 'Egypt Creative 2022',
        'badge' => 'FMCG Industry Leader',
        'tagline' => 'High-production TV commercial, dynamic factory and family lifestyle visuals, and FMCG brand leadership.',
        'overview' => 'Egypt Creative directed and produced the flagship national TV commercial for Remas Land, blending heartwarming family dining moments with world-class dairy production technology to solidify brand leadership in Egypt.',
        'deliverables' => array(
            'National Television Commercial (TVC) Production',
            'Full Broadcast Audio Design & Custom Score',
            'High-Speed Macro Food Cinematography',
            'Cross-Platform Digital Ad Campaign'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/remas-land-logo.png',
        'link' => home_url('/project-remas-land/'),
        'videos' => array(
            array(
                'title' => 'Remas Land National TV Commercial',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/remas-land-video-1.mp4',
                'desc' => 'Full-length broadcast commercial celebrating Egyptian dairy excellence.'
            )
        ),
        'images' => array()
    ),
    'azha' => array(
        'aliases' => array('project-azha-clinics', 'azha-clinics', 'azha'),
        'title' => 'Azha Clinics',
        'client' => 'Azha Medical & Skin Care Centers',
        'category' => 'Medical Aesthetics & Dermatology',
        'year' => '2023',
        'agency' => 'Egypt Creative 2023',
        'badge' => 'Medical Aesthetic Excellence',
        'tagline' => 'Patient-centric dermatology visuals, physician interviews, and medical authority marketing.',
        'overview' => 'Egypt Creative created refined medical branding and physician interview videos for Azha Clinics, emphasizing medical safety, advanced aesthetic technologies, and genuine patient satisfaction.',
        'deliverables' => array(
            'Specialist Physician Video Series',
            'Treatment Room High-Definition Visuals',
            'Patient Education & Trust Marketing',
            'Social Media Conversion Campaigns'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/azha-clinics-logo.png',
        'link' => home_url('/project-azha-clinics/'),
        'videos' => array(
            array(
                'title' => 'Azha Clinics Medical Showcase',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/azha-clinics-commercial.mov',
                'desc' => 'Physician insights and modern dermatology treatment procedures.'
            )
        ),
        'images' => array()
    ),
    'dermasilk' => array(
        'aliases' => array('project-dermasilk', 'dermasilk', 'derma'),
        'title' => 'Dermasilk Skincare',
        'client' => 'Dermasilk Pharmaceutical Skincare',
        'category' => 'Pharmaceutical & Skincare Commercial',
        'year' => '2021',
        'agency' => 'Egypt Creative 2021',
        'badge' => 'Dermatological Skincare',
        'tagline' => 'Clinical laboratory elegance, premium bottle 3D renders, and pharmaceutical campaign design.',
        'overview' => 'Egypt Creative engineered scientific and luxurious brand positioning for Dermasilk Skincare, presenting clinical efficacy through sleek minimalist packaging visuals, product demonstrations, and doctor endorsement campaigns.',
        'deliverables' => array(
            'Pharmaceutical Product Advertising & 3D Visuals',
            'Skin Health Education Campaign Content',
            'Dermatologist Presentation Deck & Print Assets',
            'E-Commerce & Pharmacy Point-of-Sale Branding'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/dermasilk-logo.png',
        'link' => home_url('/project-dermasilk/'),
        'videos' => array(),
        'images' => array()
    ),
    'saint-johns' => array(
        'aliases' => array('project-saint-johns', 'saint-johns', 'saint'),
        'title' => 'Saint Johns',
        'client' => 'Saint Johns Prestige Developments',
        'category' => 'Prestige Hospitality & Architectural Branding',
        'year' => '2024',
        'agency' => 'Egypt Creative 2024',
        'badge' => 'Prestige Hospitality & Living',
        'tagline' => 'Architectural elegance, golden emblem branding, and cinematic hospitality showcase.',
        'overview' => 'Egypt Creative designed prestige visual identity assets and cinematic video production for Saint Johns, communicating world-class architectural grandeur, curated hospitality environments, and timeless luxury appeal.',
        'deliverables' => array(
            'Cinematic Architectural Film & Drone Cinematography',
            'Luxury Gold Emblem & Visual Identity System',
            'Prestige Hospitality Collateral & Print Lookbook',
            'Digital Marketing Media & Interactive Presentations'
        ),
        'logo' => 'https://egyptcreative.com/wp-content/uploads/2026/10/saint-johns-logo-1.png',
        'link' => home_url('/project-saint-johns/'),
        'videos' => array(
            array(
                'title' => 'Saint Johns Architectural Commercial',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/saint-johns-commercial.mp4',
                'desc' => 'Cinematic tour through the luxury spaces and master design of Saint Johns.'
            )
        ),
        'images' => array()
    ),
    'cairo-capital' => array(
        'aliases' => array('project-cairo-capital', 'cairo-capital', 'cairo-capital-center', 'cairo-capital-hub', 'project-cairo-capital-hub'),
        'title' => 'Cairo Capital Hub',
        'client' => 'Cairo Capital Hub Administrative & Business Hub',
        'category' => 'Corporate & Financial Video Production',
        'year' => '2022',
        'agency' => 'Egypt Creative 2022',
        'badge' => 'Commercial Real Estate Hub',
        'tagline' => 'Prime corporate architecture, executive business hub media, and institutional investor presentations.',
        'overview' => 'Egypt Creative engineered executive promotional films and high-definition architectural media for Cairo Capital Hub, showcasing world-class business towers, cutting-edge smart offices, and strategic commercial location.',
        'deliverables' => array(
            'Executive Corporate Showcase Video Production',
            'Commercial Tower Drone & Architectural Filming',
            'B2B Corporate Real Estate Marketing Strategy',
            'Interactive Executive Investor Deck'
        ),
        'logo' => get_template_directory_uri() . '/assets/img/cairo-capital-hub-logo.png',
        'link' => home_url('/project-cairo-capital/'),
        'videos' => array(
            array(
                'title' => 'Cairo Capital Hub Corporate Showcase',
                'url' => 'https://egyptcreative.com/wp-content/uploads/2026/10/cairo-capital-commercial.mp4',
                'desc' => 'Cinematic executive presentation of Cairo Capital Hub corporate complex and facilities.'
            )
        ),
        'images' => array()
    ),
);

// Match active project
$active_project = null;
foreach ($projects_database as $p_key => $p_data) {
    if ($current_slug === $p_key || in_array($current_slug, $p_data['aliases'])) {
        $active_project = $p_data;
        $active_project['key'] = $p_key;
        break;
    }
}
if (!$active_project) {
    // Try substring matching across aliases
    foreach ($projects_database as $p_key => $p_data) {
        foreach ($p_data['aliases'] as $alias) {
            if (!empty($alias) && (strpos($current_slug, $alias) !== false || strpos($alias, $current_slug) !== false)) {
                $active_project = $p_data;
                $active_project['key'] = $p_key;
                break 2;
            }
        }
    }
}
if (!$active_project) {
    $active_project = $projects_database['modon'];
    $active_project['key'] = 'modon';
}
?>

<style>
/* ==========================================================================
   Egypt Creative - Executive Dark Green Project Case Study Styles
   ========================================================================== */
html, body {
  background-color: #07150c !important;
  color: #e2e8f0 !important;
}

#page, .site, .site-main, .body-bg-1 {
  background-color: #07150c !important;
  background-image: none !important;
}

.egyptcreative-case-study {
  background-color: #07150c !important;
  background-image: 
    radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.14) 0%, transparent 55%),
    radial-gradient(circle at 100% 30%, rgba(20, 60, 30, 0.2) 0%, transparent 45%),
    radial-gradient(circle at 0% 70%, rgba(15, 45, 25, 0.2) 0%, transparent 45%) !important;
  color: #e2e8f0 !important;
  min-height: 100vh !important;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
  padding-bottom: 80px !important;
  position: relative !important;
}

/* 1. Executive Top Navbar */
.cs-top-navbar {
  position: sticky !important;
  top: 0 !important;
  z-index: 99 !important;
  background: rgba(7, 21, 12, 0.85) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-bottom: 1px solid rgba(74, 222, 128, 0.15) !important;
  padding: 16px 0 !important;
}

.cs-top-agency-logo {
  max-height: 38px !important;
  width: auto !important;
  display: block !important;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)) !important;
}

.cs-nav-link-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #cbd5e1 !important;
  text-decoration: none !important;
  padding: 8px 18px !important;
  border-radius: 20px !important;
  transition: all 0.25s ease !important;
}

.cs-nav-link-btn:hover {
  color: #4ade80 !important;
  background: rgba(74, 222, 128, 0.08) !important;
}

.cs-nav-cta-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #051009 !important;
  background: #4ade80 !important;
  padding: 8px 22px !important;
  border-radius: 20px !important;
  text-decoration: none !important;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3) !important;
  transition: all 0.25s ease !important;
}

.cs-nav-cta-btn:hover {
  background: #22c55e !important;
  color: #ffffff !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.45) !important;
}

/* 2. Header & Hero */
.cs-header-wrap {
  padding: 45px 0 35px !important;
}

.cs-back-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 8px 18px !important;
  background: rgba(34, 197, 94, 0.1) !important;
  border: 1px solid rgba(74, 222, 128, 0.25) !important;
  border-radius: 30px !important;
  color: #4ade80 !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  text-decoration: none !important;
  transition: all 0.25s ease !important;
  margin-bottom: 24px !important;
}

.cs-back-btn:hover {
  background: rgba(34, 197, 94, 0.22) !important;
  border-color: #4ade80 !important;
  color: #ffffff !important;
  transform: translateX(-4px) !important;
}

.cs-header-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 6px 14px !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(74, 222, 128, 0.2) !important;
  border-radius: 20px !important;
  font-size: 12px !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  color: #4ade80 !important;
  font-weight: 700 !important;
  margin-bottom: 18px !important;
}

.cs-dot {
  width: 5px !important;
  height: 5px !important;
  background: #4ade80 !important;
  border-radius: 50% !important;
  display: inline-block !important;
}

.cs-title {
  font-family: 'Runiga', 'Syne', sans-serif !important;
  font-size: clamp(34px, 4.5vw, 58px) !important;
  line-height: 1.15 !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 16px !important;
  letter-spacing: -0.02em !important;
  text-shadow: 0 4px 25px rgba(0, 0, 0, 0.5) !important;
}

.cs-tagline {
  font-size: clamp(16px, 1.6vw, 20px) !important;
  line-height: 1.6 !important;
  color: #94a3b8 !important;
  max-width: 860px !important;
  margin-bottom: 30px !important;
}

.cs-meta-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 16px !important;
  margin-top: 25px !important;
}

.cs-meta-card {
  background: rgba(13, 34, 19, 0.65) !important;
  border: 1px solid rgba(74, 222, 128, 0.18) !important;
  border-radius: 16px !important;
  padding: 18px 22px !important;
  backdrop-filter: blur(10px) !important;
  transition: transform 0.25s ease, border-color 0.25s ease !important;
}

.cs-meta-card:hover {
  transform: translateY(-3px) !important;
  border-color: rgba(74, 222, 128, 0.38) !important;
}

.cs-meta-label {
  font-size: 11px !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  color: #4ade80 !important;
  font-weight: 700 !important;
  margin-bottom: 6px !important;
}

.cs-meta-value {
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  line-height: 1.4 !important;
}

/* 3. Sleek Client Brand Identity Card */
.cs-brand-showcase {
  padding: 20px 0 35px !important;
}

.cs-brand-card {
  display: flex !important;
  align-items: center !important;
  gap: 24px !important;
  padding: 20px 28px !important;
  background: rgba(13, 34, 19, 0.7) !important;
  border: 1px solid rgba(74, 222, 128, 0.22) !important;
  border-radius: 18px !important;
  backdrop-filter: blur(14px) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45) !important;
  max-width: 600px !important;
}

.cs-brand-logo-wrap {
  width: 140px !important;
  height: 75px !important;
  padding: 10px 16px !important;
  background: #ffffff !important;
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35) !important;
}

.cs-brand-logo {
  max-width: 100% !important;
  max-height: 52px !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
  display: block !important;
}

.cs-brand-sub {
  font-size: 11px !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  color: #4ade80 !important;
  font-weight: 700 !important;
  display: block !important;
  margin-bottom: 4px !important;
}

.cs-brand-name {
  font-family: 'Runiga', 'Syne', sans-serif !important;
  font-size: 22px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 4px !important;
}

.cs-brand-cat {
  font-size: 14px !important;
  color: #94a3b8 !important;
  margin: 0 !important;
}

/* 4. Video Showcase - True Native Aspect Ratio */
.cs-video-section {
  padding: 30px 0 50px !important;
}

.cs-section-subtitle {
  display: inline-block !important;
  font-size: 12px !important;
  text-transform: uppercase !important;
  letter-spacing: 2px !important;
  color: #4ade80 !important;
  font-weight: 700 !important;
  margin-bottom: 8px !important;
}

.cs-section-title {
  font-family: 'Runiga', 'Syne', sans-serif !important;
  font-size: clamp(26px, 3.2vw, 36px) !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  line-height: 1.25 !important;
  margin-bottom: 25px !important;
}

.cs-video-grid {
  display: flex !important;
  flex-direction: column !important;
  gap: 35px !important;
}

.cs-video-card {
  width: 100% !important;
  max-width: 960px !important;
  margin: 0 auto !important;
  background: rgba(13, 34, 19, 0.75) !important;
  border: 1px solid rgba(74, 222, 128, 0.22) !important;
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(34, 197, 94, 0.08) !important;
  padding: 16px !important;
  backdrop-filter: blur(12px) !important;
}

.cs-video-player-wrapper {
  position: relative !important;
  width: 100% !important;
  background: #000000 !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.cs-video-player-wrapper video {
  width: 100% !important;
  height: auto !important;
  max-height: 72vh !important;
  object-fit: contain !important;
  display: block !important;
  margin: 0 auto !important;
  border-radius: 14px !important;
  background: #000000 !important;
}

.cs-video-info {
  padding: 18px 8px 8px !important;
}

.cs-video-title {
  font-family: 'Runiga', 'Syne', sans-serif !important;
  font-size: 22px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 6px !important;
}

.cs-video-desc {
  font-size: 15px !important;
  line-height: 1.6 !important;
  color: #94a3b8 !important;
  margin: 0 !important;
}

/* 5. Editorial Content & Strategic Deliverables */
.cs-content-section {
  padding: 40px 0 60px !important;
}

.cs-content-grid {
  display: grid !important;
  grid-template-columns: 1.2fr 0.9fr !important;
  gap: 35px !important;
  align-items: start !important;
}

.cs-overview-col,
.cs-deliverables-col {
  background: rgba(13, 34, 19, 0.7) !important;
  border: 1px solid rgba(74, 222, 128, 0.18) !important;
  border-radius: 20px !important;
  padding: 35px !important;
  backdrop-filter: blur(12px) !important;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45) !important;
}

.cs-overview-text {
  font-size: 17px !important;
  line-height: 1.8 !important;
  color: #cbd5e1 !important;
  margin: 0 !important;
}

.cs-deliverables-title {
  font-family: 'Runiga', 'Syne', sans-serif !important;
  font-size: 26px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 22px !important;
}

.cs-deliverables-list {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.cs-deliverables-list li {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px !important;
  font-size: 15px !important;
  line-height: 1.5 !important;
  color: #f1f5f9 !important;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(74, 222, 128, 0.14) !important;
  padding: 12px 16px !important;
  border-radius: 12px !important;
  transition: all 0.25s ease !important;
}

.cs-deliverables-list li:hover {
  background: rgba(34, 197, 94, 0.08) !important;
  border-color: rgba(74, 222, 128, 0.35) !important;
  transform: translateX(4px) !important;
}

.cs-deliverables-list li svg {
  flex-shrink: 0 !important;
  margin-top: 2px !important;
  stroke: #4ade80 !important;
}

/* 6. Gallery Section (If any images) */
.cs-gallery-section {
  padding: 40px 0 60px !important;
}

.cs-gallery-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
  gap: 24px !important;
  margin-top: 30px !important;
}

.cs-gallery-item {
  border-radius: 18px !important;
  overflow: hidden !important;
  background: rgba(13, 34, 19, 0.7) !important;
  border: 1px solid rgba(74, 222, 128, 0.2) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45) !important;
}

.cs-gallery-item img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
  transition: transform 0.4s ease !important;
}

.cs-gallery-item:hover img {
  transform: scale(1.04) !important;
}

/* 7. Footer CTA Box */
.cs-footer-nav {
  padding-top: 30px !important;
}

.cs-cta-box {
  background: linear-gradient(135deg, rgba(13, 34, 19, 0.85) 0%, rgba(9, 23, 13, 0.95) 100%) !important;
  border: 1px solid rgba(74, 222, 128, 0.25) !important;
  border-radius: 22px !important;
  padding: 45px 35px !important;
  text-align: center !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(34, 197, 94, 0.1) !important;
}

.cs-cta-title {
  font-family: 'Runiga', 'Syne', sans-serif !important;
  font-size: clamp(26px, 3.5vw, 40px) !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 14px !important;
}

.cs-cta-desc {
  font-size: 16px !important;
  color: #94a3b8 !important;
  max-width: 620px !important;
  margin: 0 auto 28px !important;
  line-height: 1.6 !important;
}

.cs-cta-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 14px 32px !important;
  background: #4ade80 !important;
  color: #051009 !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  border-radius: 30px !important;
  text-decoration: none !important;
  box-shadow: 0 6px 25px rgba(74, 222, 128, 0.35) !important;
  transition: all 0.3s ease !important;
}

.cs-cta-btn:hover {
  background: #22c55e !important;
  color: #ffffff !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 30px rgba(34, 197, 94, 0.5) !important;
}

/* 8. Responsive Breakpoints */
@media (max-width: 991px) {
  .cs-meta-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .cs-content-grid {
    grid-template-columns: 1fr !important;
    gap: 25px !important;
  }
}

@media (max-width: 575px) {
  .cs-meta-grid {
    grid-template-columns: 1fr !important;
  }
  .cs-brand-card {
    flex-direction: column !important;
    text-align: center !important;
    padding: 20px !important;
  }
  .cs-brand-logo-wrap {
    margin: 0 auto !important;
  }
  .cs-overview-col,
  .cs-deliverables-col {
    padding: 24px 20px !important;
  }
  .cs-cta-box {
    padding: 30px 20px !important;
  }
}
</style>

<div class="egyptcreative-case-study">
    <!-- Executive Top Agency Navbar -->
    <header class="cs-top-navbar">
        <div class="container d-flex align-items-center justify-content-between">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="cs-nav-logo-link" aria-label="Egypt Creative Agency">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/egypt_creative_white_logo.png'); ?>" alt="Egypt Creative Agency" class="cs-top-agency-logo" />
            </a>
            <div class="cs-nav-actions d-flex align-items-center gap-2">
                <a href="<?php echo esc_url(home_url('/#nx-project1')); ?>" class="cs-nav-link-btn">
                    <span>Our Works</span>
                </a>
                <a href="<?php echo esc_url(home_url('/#nx-get-in-touch')); ?>" class="cs-nav-cta-btn">
                    <span>Let's Talk</span>
                </a>
            </div>
        </div>
    </header>

    <!-- Hero / Case Study Header -->
    <div class="cs-header-wrap">
        <div class="container">
            <div class="cs-back-nav">
                <a href="<?php echo esc_url(home_url('/#nx-project1')); ?>" class="cs-back-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back to All Works</span>
                </a>
            </div>

            <div class="cs-header-content">
                <div class="cs-header-badge">
                    <span><?php echo esc_html($active_project['badge']); ?></span>
                    <span class="cs-dot"></span>
                    <span><?php echo esc_html($active_project['year']); ?></span>
                </div>
                
                <h1 class="cs-title"><?php echo esc_html($active_project['title']); ?></h1>
                
                <p class="cs-tagline"><?php echo esc_html($active_project['tagline']); ?></p>

                <!-- Project Meta Grid -->
                <div class="cs-meta-grid">
                    <div class="cs-meta-card">
                        <div class="cs-meta-label">Client</div>
                        <div class="cs-meta-value"><?php echo esc_html($active_project['client']); ?></div>
                    </div>
                    <div class="cs-meta-card">
                        <div class="cs-meta-label">Category</div>
                        <div class="cs-meta-value"><?php echo esc_html($active_project['category']); ?></div>
                    </div>
                    <div class="cs-meta-card">
                        <div class="cs-meta-label">Year</div>
                        <div class="cs-meta-value"><?php echo esc_html($active_project['year']); ?></div>
                    </div>
                    <div class="cs-meta-card">
                        <div class="cs-meta-label">Creative Direction</div>
                        <div class="cs-meta-value"><?php echo esc_html($active_project['agency']); ?></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Official Client Brand Identity Showcase (Sleek Contained Badge) -->
    <div class="cs-brand-showcase">
        <div class="container">
            <div class="cs-brand-card">
                <div class="cs-brand-logo-wrap">
                    <img src="<?php echo esc_url($active_project['logo']); ?>" alt="<?php echo esc_attr($active_project['title']); ?> Logo" class="cs-brand-logo" />
                </div>
                <div class="cs-brand-info">
                    <span class="cs-brand-sub">Official Client Brand Identity</span>
                    <h3 class="cs-brand-name"><?php echo esc_html($active_project['title']); ?></h3>
                    <p class="cs-brand-cat"><?php echo esc_html($active_project['category']); ?></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Video Commercials Showcase (Natural Aspect Ratio) -->
    <?php if (!empty($active_project['videos'])) : ?>
    <div class="cs-video-section">
        <div class="container">
            <div class="cs-section-header">
                <span class="cs-section-subtitle">Cinematic Commercials</span>
                <h2 class="cs-section-title">Video Production & TVC Showcase</h2>
            </div>

            <div class="cs-video-grid">
                <?php foreach ($active_project['videos'] as $v) : ?>
                <div class="cs-video-card">
                    <div class="cs-video-player-wrapper">
                        <video controls preload="metadata" playsinline>
                            <source src="<?php echo esc_url($v['url']); ?>" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="cs-video-info">
                        <h4 class="cs-video-title"><?php echo esc_html($v['title']); ?></h4>
                        <p class="cs-video-desc"><?php echo esc_html($v['desc']); ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Project Overview & Strategic Deliverables -->
    <div class="cs-content-section">
        <div class="container">
            <div class="cs-content-grid">
                <div class="cs-overview-col">
                    <span class="cs-section-subtitle">Campaign Overview</span>
                    <h2 class="cs-section-title">Creative Vision & Execution</h2>
                    <p class="cs-overview-text"><?php echo esc_html($active_project['overview']); ?></p>
                </div>

                <div class="cs-deliverables-col">
                    <span class="cs-section-subtitle">Core Deliverables</span>
                    <h3 class="cs-deliverables-title">Strategic Deliverables</h3>
                    <ul class="cs-deliverables-list">
                        <?php foreach ($active_project['deliverables'] as $item) : ?>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span><?php echo esc_html($item); ?></span>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Visual Creative Assets Gallery -->
    <?php if (!empty($active_project['images'])) : ?>
    <div class="cs-gallery-section">
        <div class="container">
            <div class="cs-section-header text-center">
                <span class="cs-section-subtitle">Visual Excellence</span>
                <h2 class="cs-section-title">Campaign Media & Visual Assets</h2>
            </div>

            <div class="cs-gallery-grid">
                <?php foreach ($active_project['images'] as $img_url) : ?>
                <div class="cs-gallery-item">
                    <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($active_project['title']); ?> Campaign Asset" loading="lazy" />
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Next / Previous Projects Carousel & CTA -->
    <div class="cs-footer-nav">
        <div class="container">
            <div class="cs-cta-box">
                <span class="cs-section-subtitle">Ready to Elevate Your Brand?</span>
                <h2 class="cs-cta-title">Let's Create Powerful Results Together</h2>
                <p class="cs-cta-desc">Discover how Egypt Creative's strategic design, video production, and digital growth systems can transform your market presence.</p>
                <div class="cs-cta-btn-wrap">
                    <a href="<?php echo esc_url(home_url('/#nx-get-in-touch')); ?>" class="cs-cta-btn">
                        <span>Get In Touch</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
