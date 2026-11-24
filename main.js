/**
 * Egypt Marketing Agency — script.js
 * Professional, error-free, fully commented
 */

'use strict';

function fixMediaUrl(url) {
  if (!url) return '';
  url = String(url).trim();
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return url.replace(/^[\/\.\\]+/, '');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ============================================
   FIRST-PARTY ANALYTICS & WHATSAPP TRACKING
   ============================================ */
(function initAnalyticsTracking() {
  let sessionId = sessionStorage.getItem('egypt_session_id');
  if (!sessionId) {
    sessionId = 's_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem('egypt_session_id', sessionId);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource   = urlParams.get('utm_source') || '';
  const utmMedium   = urlParams.get('utm_medium') || '';
  const utmCampaign = urlParams.get('utm_campaign') || '';

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
    return 'Desktop';
  };

  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    return 'Browser';
  };

  const getOS = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'OS';
  };

  const getNormalizedPath = () => {
    let p = window.location.pathname || '/';
    p = p.split('?')[0].split('#')[0];
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    const lower = p.toLowerCase();
    if (lower === '/index.html' || lower === '/index.php' || lower === '/home' || lower === 'index.html' || lower === '') {
      return '/';
    }
    return p;
  };

  // Track page visit
  try {
    fetch('api.php?action=track_visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        page: getNormalizedPath(),
        referrer: document.referrer || 'Direct',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        device: getDeviceType(),
        browser: getBrowser(),
        os: getOS()
      })
    }).catch(() => {});
  } catch (_) {}

  // Attach WhatsApp tracking to all WhatsApp links across website
  document.addEventListener('click', (e) => {
    const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (waLink) {
      const location = waLink.dataset.location || waLink.getAttribute('aria-label') || waLink.textContent.trim() || 'WhatsApp CTA';
      try {
        fetch('api.php?action=track_whatsapp_click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: window.location.pathname || 'Homepage',
            location: location,
            device: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            referrer: document.referrer || 'Direct',
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign
          })
        }).catch(() => {});
      } catch (_) {}
    }
  });
})();

/* ============================================
   UTILITY HELPERS
   ============================================ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================
   TRANSLATION DICTIONARY (EN & AR)
   ============================================ */
const i18n = {
  en: {
    "nav.home": "HOME",
    "nav.about": "WHO WE ARE",
    "nav.services": "SERVICES",
    "nav.work": "OUR WORK",
    "nav.process": "PROCESS",
    "nav.team": "TEAM",
    "nav.contact": "CONTACT",
    "nav.cta": "Get in Touch",

    "hero.badge": "Egyptian creativity. Global impact.",
    "hero.step1": 'We Make Brands <span class="accent-line"><em>Unforgettable.</em></span>',
    "hero.step2": 'Across Egypt &amp; <span class="accent-line"><em>Beyond.</em></span>',
    "hero.step3": 'Full-Service Digital <span class="accent-line"><em>Marketing Agency.</em></span>',
    "hero.step4": 'From Content &amp; Social to <span class="accent-line"><em>Data Growth.</em></span>',
    "hero.ctaWork": "See Our Work",
    "hero.ctaStart": "Start a Project",
    "hero.scroll": "Scroll",

    "stats.clients": "Clients Served",
    "stats.exp": "Years of Experience",
    "stats.campaigns": "Campaigns Launched",
    "stats.satisfaction": "Client Satisfaction",

    "about.badgeClients": "2000+ Clients",
    "about.badgeCampaigns": "3000+ Campaigns",
    "about.badgeCampaignsFull": "3000+ Campaigns",
    "about.badgeExp": "16+ Years of Industry Experience",
    "about.badgeClients": "2000+ Satisfied Clients",
    "about.revenueGrowth": "Revenue Growth",
    "about.organicReach": "Organic Reach",

    "svc.tag": "SERVICES",
    "svc.title": 'Our Services<br>That <span class="accent">Drive Results</span>',
    "svc.desc": "Everything your brand needs to dominate the digital landscape — under one roof.",

    "svc.s1.title": "Strategy & Planning",
    "svc.s1.desc": "Our experience across diverse industries has given us a deep understanding of different markets, audiences, and business challenges. We turn this cross-industry knowledge into smart strategies built around real insights and proven experience. From market understanding to audience behavior, every decision is carefully planned to create meaningful impact. Because great results don’t happen by chance — they start with the right strategy.",

    "svc.s2.title": "Branding & Design",
    "svc.s2.desc": "We build distinctive brands through powerful identities and thoughtful design. Our experience across diverse industries helps us create identities that connect with different audiences. From brand strategy and visual identity to campaigns and digital content, every detail has a purpose. Because a strong brand isn’t just recognized — it’s remembered.",

    "svc.s3.title": "Social Media",
    "svc.s3.desc": "We build social media strategies that put your brand in the right conversations. From creative content to daily community management, we keep your audience engaged. We turn ideas into scroll-stopping content that strengthens your brand presence. And we use insights and performance data to continuously drive better results.",

    "svc.s4.title": "Content Production",
    "svc.s4.desc": "We create high-quality content that brings your brand’s story to life. From photography and video production to Reels, commercials, and UGC, we create content built to stand out. Every frame is crafted with a clear creative direction that reflects your brand identity. We turn ideas into visual experiences that capture attention and leave a lasting impression.",

    "svc.s5.title": "Media Buying & Performance",
    "svc.s5.desc": "We put your brand in front of the right audience, at the right time, and in the right place. We build data-driven campaigns designed to maximize reach, engagement, leads, and sales. From Meta and Google to TikTok and other digital platforms, we manage every stage of your media investment. We continuously analyze performance, optimize campaigns, and turn your budget into measurable growth.",

    "svc.s6.title": "Public Relations",
    "svc.s6.desc": "We build powerful PR strategies that put your brand in the right conversations and in front of the right people. From media relations and press coverage to influencer and celebrity collaborations, we create visibility that builds trust. We connect brands with TV shows, media platforms, creators, and influential personalities to amplify their presence. Every opportunity is carefully selected to strengthen credibility, expand reach, and turn exposure into real brand value.",

    "svc.s7.title": "Events & Activations",
    "svc.s7.desc": "We create experiences that bring brands to life and turn moments into lasting memories. From launches and corporate events to brand activations and experiential campaigns, we handle every detail. We combine creative concepts, production, entertainment, and audience engagement to create unforgettable experiences. Every event is designed to generate attention, build connections, and leave a powerful impression on your audience.",

    "svc.s8.title": "Web & E-Commerce Development",
    "svc.s8.desc": "We design and develop modern websites and e-commerce experiences built around your brand and business goals. From corporate websites and landing pages to fully integrated online stores, we create digital experiences that are fast, intuitive, and conversion-focused. We combine creative design, seamless user experience, and powerful technology to turn visitors into customers. From concept to launch, we build digital platforms that look exceptional, perform flawlessly, and grow with your business.",

    "svc.explore": "Explore Service →",

    "about.tag": "Who We Are",
    "about.tab1": "Who We Are",
    "about.tab2": "Our Vision",
    "about.tab3": "Our Mission",

    "about.slide1.title": 'Who We Are — <span class="accent">Egypt Creative</span>',
    "about.slide1.p1": "<strong>Egypt Creative</strong> is a <strong>Creative &amp; Full-Service Marketing Agency</strong> with one clear purpose: <strong>helping brands reach where they want to be.</strong>",
    "about.slide1.p2": "Our journey began in <strong>2011</strong>, when our founders started as independent freelancers across marketing and creative services. Over the years, they gained extensive experience across industries and built a strong track record of turning ideas into results.",
    "about.slide1.p3": "Today, <strong>Egypt Creative brings that collective experience together under one agency</strong>, combining creative, marketing, and strategic capabilities to handle ambitious projects from every angle.",
    "about.slide1.p4": "From <strong>strategy, branding, social media, content, and production</strong> to <strong>media buying, PR, digital marketing, web development, and outdoor advertising</strong>, we offer full-service solutions tailored to each brand's needs.",
    "about.slide1.p5": "We don't just create campaigns — we <strong>understand the business behind the brand</strong>, its audience, objectives, and market.",
    "about.slide1.p6": "Because <strong>likes are not the goal. Results are.</strong> And our results define the strength of Egypt Creative.",

    "about.slide2.title": 'Our Vision — <span class="accent">Competing On The World Stage</span>',
    "about.slide2.p1": "Our vision is to build <strong>Egypt Creative into a globally recognized name born in Egypt and built to compete on the world stage</strong> — joining the growing number of Egyptian businesses that have successfully taken their expertise beyond borders.",
    "about.slide2.p2": "We envision a future where creativity is never separated from strategy or business. Where every idea has a purpose, every decision is driven by insight, and every creative move contributes to <strong>business growth and market leadership</strong>. We aim to become more than a marketing agency to our clients — we strive to become an integral part of their businesses, a trusted partner in their growth, decisions, and long-term success.",
    "about.slide2.p3": "From <strong>building and launching brands to growing and scaling them</strong>, our vision is to create work that doesn't simply get attention, but creates meaningful and measurable impact.",

    "about.slide3.title": 'Our Mission — <span class="accent">Build, Launch, Grow &amp; Scale</span>',
    "about.slide3.p1": "Our mission is to help brands <strong>build, launch, grow, and scale</strong> by combining deep marketing expertise, strategic thinking, and creativity that creates real business impact.",
    "about.slide3.p2": "We begin by understanding the <strong>business, the market, the audience, and the competitive landscape</strong> — because meaningful creativity starts with meaningful understanding. From there, we develop strategies built around clear objectives, create ideas designed for impact, execute with precision, measure what matters, and continuously optimize for growth.",
    "about.slide3.p3": "With years of marketing experience and a multidisciplinary team working across the full spectrum of marketing and creative services, we provide our clients with everything they need under one roof — without the need to manage multiple agencies for different parts of their business.",
    "about.slide3.p4": "But we don't simply work for our clients. We work <strong>alongside them</strong> — becoming an extension of their team and a partner in their decisions, growth, and success.",
    "about.slide3.p5": "Our mission is simple: <strong>to understand what makes each business unique, turn that understanding into a competitive advantage, and create marketing that helps brands outperform their competition.</strong>",

    "about.btn": "Work With Us",

    "work.tag": "PORTFOLIO",
    "work.title": 'Selected <span class="accent">Work</span>',
    "work.desc": "Selected work crafted to make brands impossible to ignore.",
    "work.viewCase": "View Case Study →",

    "process.tag": "How We Work",
    "process.title": 'A Process Built<br>for <span class="accent">Real Results</span>',
    "process.p1.title": "Discovery",
    "process.p1.desc": "We deep-dive into your brand, audience, competitors, and goals. No shortcuts — we need to understand you completely.",
    "process.p2.title": "Strategy",
    "process.p2.desc": "Based on insights, we craft a custom marketing strategy with clear objectives, KPIs, and a roadmap.",
    "process.p3.title": "Create & Launch",
    "process.p3.desc": "Our creative and media teams bring the strategy to life — producing content, launching campaigns, and managing touchpoints.",
    "process.p4.title": "Optimize & Grow",
    "process.p4.desc": "We monitor results in real time, optimize performance continuously, and provide transparent reporting.",

    "team.tag": "Meet the Team",
    "team.title": 'The Minds Behind<br><span class="accent">Your Growth</span>',
    "team.desc": "A team of strategists, creatives, and data experts united by one mission — your success.",

    "testi.tag": "Testimonials",
    "testi.title": 'Clients Love<br><span class="accent">What We Do</span>',
    "testi.trusted": "Trusted By",

    "cta.title": 'Ready to Grow<br><span class="accent">Your Brand?</span>',
    "cta.desc": "Let's build your next winning campaign. Free consultation — no commitment needed.",
    "cta.btnConsult": "Get Free Consultation",
    "cta.btnCall": "📞 Call Us Now",

    "contact.tag": "Your Inquiry",
    "contact.title": 'Let\'s Build<br>Something <span class="accent">Great</span>',
    "contact.desc": "Fill out the form and our team will get back to you within 24 hours with a tailored proposal for your brand.",
    "contact.labelName": "Full Name *",
    "contact.labelEmail": "Email Address *",
    "contact.labelPhone": "Phone Number *",
    "contact.labelCompany": "Company / Brand",
    "contact.labelService": "Service Interested In *",
    "contact.labelBudget": "Monthly Budget",
    "contact.labelMsg": "Tell Us About Your Brand *",
    "contact.btnSend": "Send Message",
    "contact.successTitle": "Message Received!",
    "contact.successDesc": "Thank you for reaching out. Our team will contact you within 24 hours with a personalized proposal.",

    "footer.desc": "Egypt's leading full-service digital marketing agency. We help ambitious brands grow beyond borders with strategy, creativity, and measurable results.",
    "footer.rights": "© 2026 Egypt Marketing Agency. All Rights Reserved."
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "خدماتنا",
    "nav.work": "أعمالنا",
    "nav.process": "طريقة العمل",
    "nav.team": "فريق العمل",
    "nav.contact": "تواصل معنا",
    "nav.cta": "استفسارك",

    "hero.badge": "إبداع مصري. تأثير عالمي.",
    "hero.step1": 'نسرع نمو <span class="accent-line"><em>العلامات التجارية.</em></span>',
    "hero.step2": 'في مصر وجميع أنحاء <span class="accent-line"><em>الشرق الأوسط.</em></span>',
    "hero.step3": 'وكالة تسويق رقمي<br><span class="accent-line"><em>متكاملة وابتكارية.</em></span>',
    "hero.step4": 'من صناعة المحتوى إلى <span class="accent-line"><em>النمو والبيانات.</em></span>',
    "hero.ctaWork": "شاهد أعمالنا",
    "hero.ctaStart": "ابدأ مشروعك",
    "hero.scroll": "تصفح",

    "stats.clients": "عميل تم خدمتهم",
    "stats.exp": "سنوات خبرة",
    "stats.campaigns": "حملة تسويقية",
    "stats.satisfaction": "نسبة رضا العملاء",

    "about.badgeClients": "2000+ عميل خدمتهم",
    "about.badgeCampaigns": "3000+ حملة تسويقية",
    "about.badgeCampaignsFull": "3000+ حملة ناجحة",
    "about.badgeExp": "16+ سنة من الخبرة",
    "about.badgeRank": "المركز 1 في مصر",
    "about.revenueGrowth": "نمو الأرباح",
    "about.organicReach": "الوصول الطبيعي",

    "svc.tag": "الخدمات",
    "svc.title": 'خدماتنا<br><span class="accent">تحقق نتائج ملموسة</span>',
    "svc.desc": "كل ما تحتاجه علامتك التجارية للسيطرة على السوق الرقمي — تحت سقف واحد.",

    "svc.s1.title": "الاستراتيجية والتخطيط",
    "svc.s1.desc": "خبرتنا في العمل عبر قطاعات ومجالات متنوعة منحتنا فهمًا عميقًا لمختلف الأسواق والجمهور وتحديات الأعمال. نحوّل هذه الخبرات المتراكمة إلى استراتيجيات ذكية مبنية على رؤى حقيقية وتجارب مثبتة. من فهم السوق إلى سلوك الجمهور، نخطط لكل خطوة بعناية لتحقيق تأثير حقيقي وملموس. لأن النتائج القوية لا تحدث بالصدفة — بل تبدأ بالاستراتيجية الصحيحة.",

    "svc.s2.title": "الهوية والتصميم",
    "svc.s2.desc": "نصنع علامات تجارية مميزة من خلال هويات قوية وتصميمات مدروسة بعناية. خبرتنا في مختلف القطاعات تساعدنا على ابتكار هويات تتواصل بفعالية مع جماهير متنوعة. من استراتيجية العلامة التجارية والهوية البصرية إلى الحملات والمحتوى الرقمي، لكل تفصيلة هدف واضح. لأن العلامة التجارية القوية لا يقتصر دورها على أن تُعرَف — بل أن تُتذكَر.",

    "svc.s3.title": "السوشيال ميديا",
    "svc.s3.desc": "نبني استراتيجيات للسوشيال ميديا تضع علامتك التجارية في قلب المحادثات المناسبة. من صناعة المحتوى الإبداعي إلى إدارة المجتمعات، نحافظ على تفاعل جمهورك باستمرار. نحوّل الأفكار إلى محتوى جذاب يلفت الانتباه ويعزز حضور علامتك التجارية. ونعتمد على البيانات وتحليل الأداء لتطوير النتائج وتحقيق نمو مستمر.",

    "svc.s4.title": "إنتاج المحتوى",
    "svc.s4.desc": "نصنع محتوى عالي الجودة يحوّل قصة علامتك التجارية إلى تجربة بصرية حقيقية. من التصوير الفوتوغرافي وإنتاج الفيديو إلى الريلز والإعلانات ومحتوى الـUGC، نصنع محتوى يلفت الانتباه. كل لقطة يتم تنفيذها برؤية إبداعية واضحة تعكس هوية علامتك التجارية. نحوّل الأفكار إلى تجارب بصرية مؤثرة تجذب الجمهور وتترك انطباعًا يدوم.",

    "svc.s5.title": "شراء وإدارة الإعلانات والأداء",
    "svc.s5.desc": "نضع علامتك التجارية أمام الجمهور المناسب، في الوقت المناسب، وعلى المنصة المناسبة. نصمم حملات تعتمد على البيانات لتحقيق أقصى وصول وتفاعل وجذب عملاء ومبيعات. من Meta وGoogle إلى TikTok وغيرها من المنصات الرقمية، ندير كل مرحلة من مراحل استثمارك الإعلاني. نحلل الأداء باستمرار، ونُحسّن الحملات، ونحوّل ميزانيتك إلى نمو حقيقي قابل للقياس.",

    "svc.s6.title": "العلاقات العامة",
    "svc.s6.desc": "نبني استراتيجيات علاقات عامة قوية تضع علامتك التجارية في المحادثات المناسبة وأمام الأشخاص المناسبين. من العلاقات الإعلامية والتغطيات الصحفية إلى التعاون مع المؤثرين والمشاهير، نصنع حضورًا يعزز الثقة في علامتك التجارية. نربط العلامات التجارية بالبرامج التلفزيونية والمنصات الإعلامية وصنّاع المحتوى والشخصيات المؤثرة لتوسيع حضورها. نختار كل فرصة بعناية لتعزيز المصداقية، وتوسيع الوصول، وتحويل الظهور الإعلامي إلى قيمة حقيقية للعلامة التجارية.",

    "svc.s7.title": "الفعاليات والتجارب التسويقية",
    "svc.s7.desc": "نصنع تجارب حقيقية تنبض بالحياة، وتحول لحظات علامتك التجارية إلى ذكريات تدوم. من حفلات الإطلاق والفعاليات الخاصة بالشركات إلى تنشيط العلامات التجارية والحملات التجريبية، نتولى كل التفاصيل. نجمع بين الأفكار الإبداعية، والإنتاج، والترفيه، وتفاعل الجمهور لصناعة تجارب لا تُنسى. نصمم كل فعالية لجذب الانتباه، وبناء علاقات قوية، وترك انطباع مؤثر لدى جمهورك.",

    "svc.s8.title": "تطوير المواقع والمتاجر الإلكترونية",
    "svc.s8.desc": "نصمم ونطور مواقع إلكترونية وتجارب تجارة إلكترونية عصرية، مصممة حول هوية علامتك التجارية وأهداف عملك. من مواقع الشركات والـLanding Pages إلى المتاجر الإلكترونية المتكاملة، نصنع تجارب رقمية سريعة، سهلة الاستخدام، ومصممة لتحقيق التحويلات. نجمع بين التصميم الإبداعي، وتجربة المستخدم السلسة، والتكنولوجيا القوية لتحويل الزوار إلى عملاء. من الفكرة وحتى الإطلاق، نبني منصات رقمية بمظهر استثنائي، وأداء قوي، وقابلة للنمو مع تطور أعمالك.",

    "svc.explore": "استكشف الخدمة ←",

    "about.tag": "من نحن",
    "about.tab1": "من نحن",
    "about.tab2": "رؤيتنا",
    "about.tab3": "رسالتنا",

    "about.slide1.title": 'من نحن — <span class="accent">إيجيبت كرييتف</span>',
    "about.slide1.p1": "<strong>إيجيبت كرييتف</strong> هي <strong>وكالة متكاملة للإبداع والتسويق</strong>، هدفنا واضح: <strong>مساعدة العلامات التجارية على الوصول إلى المكان الذي تطمح إليه.</strong>",
    "about.slide1.p2": "بدأت رحلتنا في <strong>2011</strong>، عندما انطلق مؤسسونا كمستقلين في مجالات التسويق والخدمات الإبداعية. وعلى مدار السنوات، اكتسبوا خبرات واسعة في مختلف الصناعات، وطوروا قدرات متنوعة، وحققوا نتائج حقيقية.",
    "about.slide1.p3": "واليوم، تجمع <strong>إيجيبت كرييتف</strong> هذه الخبرات تحت كيان واحد، لتقدم مزيجًا متكاملًا من <strong>الإبداع والتسويق والاستراتيجية</strong>.",
    "about.slide1.p4": "من <strong>الاستراتيجية والهوية التجارية، إلى السوشيال ميديا، المحتوى والإنتاج، الإعلانات الممولة، العلاقات العامة، التسويق الرقمي، تطوير المواقع والإعلانات الخارجية</strong>، نوفر كل ما تحتاجه العلامة التجارية تحت سقف واحد.",
    "about.slide1.p5": "نحن لا نصنع الحملات والمحتوى فقط، بل <strong>نفهم قطاع العمل وراء كل براند</strong>، وندرس أهدافه وجمهوره وسوقه، ثم نحول الأفكار إلى نتائج.",
    "about.slide1.p6": "لأن <strong>اللايكات ليست الهدف… النتائج هي الهدف.</strong> وهذا هو الذي يميز إيجيبت كرييتف.",

    "about.slide2.title": 'رؤيتنا — <span class="accent">المنافسة على الساحة العالمية</span>',
    "about.slide2.p1": "رؤيتنا هي أن نجعل من <strong>إيجيبت كرييتف اسمًا معترفًا به عالميًا، وُلد في مصر وتأسس للمنافسة على الساحة الدولية</strong> — للانضمام إلى قائمة الشركات المصرية الرائدة التي نجحت في نقل خبراتها خارج الحدود.",
    "about.slide2.p2": "نتطلع إلى مستقبل لا ينفصل فيه الإبداع عن الاستراتيجية أو أهداف الأعمال. مستقبل تكون فيه كل فكرة لها هدف، وكل قرار مدفوعًا برؤية عميقة، وكل خطوة إبداعية تسهم في <strong>نمو الأعمال وقيادة السوق</strong>. نهدف إلى أن نكون أكثر من مجرد وكالة تسويق لعملائنا — بل نسعى لأن نكون جزءًا لا يتجزأ من أعمالهم، وشريكًا موثوقًا في نموهم وقراراتهم ونجاحهم طويل الأمد.",
    "about.slide2.p3": "من <strong>بناء وإطلاق العلامات التجارية إلى تطويرها وتوسيع نطاقها</strong>، رؤيتنا هي تقديم أعمال لا تجذب الانتباه فحسب، بل تحقق تأثيرًا حقيقيًا وملموسًا.",

    "about.slide3.title": 'رسالتنا — <span class="accent">البناء، الإطلاق، النمو والتوسع</span>',
    "about.slide3.p1": "رسالتنا هي مساعدة العلامات التجارية على <strong>البناء، الإطلاق، النمو، والتوسع</strong> من خلال الجمع بين الخبرة التسويقية العميقة، والتفكير الاستراتيجي، والإبداع الذي يحقق تأثيرًا تجاريًا حقيقيًا.",
    "about.slide3.p2": "نبدأ بفهم <strong>طبيعة العمل، والسوق، والجمهور، والمشهد التنافسي</strong> — لأن الإبداع المؤثر يبدأ من الفهم العميق. ومن هناك، نطور استراتيجيات مبنية على أهداف واضحة، ونبتكر أفكارًا صُممت لترك انطباع قوي، وننفذ بدقة، ونقيس ما يهم، ونطور باستمرار لتحقيق النمو.",
    "about.slide3.p3": "بخبرتنا الممتدة وفريقنا متعدد التخصصات الذي يغطي كافة مجالات التسويق والخدمات الإبداعية، نقدم كل ما تحتاج إليه تحت سقف واحد — دون الحاجة لإدارة وكالات متعددة.",
    "about.slide3.p4": "نحن لا نعمل فقط لحساب عملائنا؛ بل نعمل <strong>جنبًا إلى جنب معهم</strong> — لنكون امتدادًا لفريقهم وشريكًا حقيقيًا في قراراتهم ونموهم ونجاحهم.",
    "about.slide3.p5": "رسالتنا بسيطة: <strong>فهم ما يجعل كل عمل تجاري فريدًا، وتحويل ذلك الفهم إلى ميزة تنافسية، وصناعة تسويق يساعد العلامات التجارية على التفوق على منافسيها.</strong>",

    "about.btn": "اعمل معنا الآن",

    "work.tag": "أعمالنا",
    "work.title": 'أعمال <span class="accent">مختارة</span>',
    "work.desc": "أعمال مختارة صُممت لتجعل العلامات التجارية يستحيل التغافل عنها.",
    "work.viewCase": "عرض دراسة الحالة ←",

    "process.tag": "طريقة عملنا",
    "process.title": 'منهجية عمل صممت<br><span class="accent">لتحقيق أقصى نتائج</span>',
    "process.p1.title": "الاستكشاف والتخطيط",
    "process.p1.desc": "ندرس علامتك التجارية وجمهورك والمنافسين بعناية لوضع الرؤية الصحيحة قبل الانطلاق.",
    "process.p2.title": "بناء الاستراتيجية",
    "process.p2.desc": "نصمم استراتيجية تسويقية مخصصة بأهداف ومؤشرات أداء دقيقة تضمن كفاءة الحملات.",
    "process.p3.title": "التنفيذ والإطلاق",
    "process.p3.desc": "تحول فرقنا الإبداعية والاعلامية الاستراتيجية إلى واقع بمحتوى جذاب وحملات ممولة دقيقة.",
    "process.p4.title": "التطوير والنمو",
    "process.p4.desc": "نتابع الأداء بشكل لحظي ونطور الحملات باستمرار مع تقديم تقارير شفافة ومفصلة.",

    "team.tag": "فريق العمل",
    "team.title": 'عقول احترافية تقود<br><span class="accent">نمو علامتك التجارية</span>',
    "team.desc": "فريق من الاستراتيجيين، المبدعين، ومحللي البيانات يجمعهم هدف واحد — نجاحك المستمر.",

    "testi.tag": "آراء العملاء",
    "testi.title": 'ما يقوله شركاؤنا<br><span class="accent">عن تجربتهم معنا</span>',
    "testi.trusted": "شركاء النجاح",

    "cta.title": 'جاهز لتكبير<br><span class="accent">علامتك التجارية؟</span>',
    "cta.desc": "دعنا نبني حملتك التسويقية القادمة. استشارة مجانية وبدون أي التزامات.",
    "cta.btnConsult": "💬 راسلنا على واتساب",
    "cta.btnCall": '📞 اتصل بنا <span dir="ltr" style="unicode-bidi: isolate; display: inline-block;">+20 104 4107134</span>',

    "contact.tag": "استفسارك",
    "contact.title": 'دعنا نبني<br>شيئاً <span class="accent">استثنائياً</span>',
    "contact.desc": "قم بتعبئة النموذج وسيقوم فريقنا بالتواصل معك خلال 24 ساعة بعرض مخصص لعلامتك التجارية.",
    "contact.labelName": "الاسم الكامل *",
    "contact.labelEmail": "البريد الإلكتروني *",
    "contact.labelPhone": "رقم الهاتف *",
    "contact.labelCompany": "اسم الشركة / العلامة التجارية",
    "contact.labelService": "الخدمة المطلوبة *",
    "contact.labelBudget": "الميزانية الشهرية المتوقعة",
    "contact.labelMsg": "تفاصيل المشروع *",
    "contact.btnSend": "إرسال الرسالة",
    "contact.successTitle": "تم استلام رسالتك بنجاح!",
    "contact.successDesc": "شكراً لتواصلك معنا. سيقوم فريقنا بالتواصل معك خلال 24 ساعة بعرض أسعار مخصص.",

    "footer.desc": "الوكالة الرائدة في مصر للتسويق الرقمي المتكامل. نساعد العلامات التجارية الطموحة على النمو واستمرار التوسع باستراتيجيات ابتكارية.",
    "footer.rights": "© 2026 وكالة مصر للتسويق. جميع الحقوق محفوظة."
  }
};

let currentLang  = localStorage.getItem('agency_lang') || 'en';
let currentTheme = localStorage.getItem('agency_theme') || 'dark';

/* ============================================
   THEME TOGGLE
   ============================================ */
function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('agency_theme', theme);
  const icon = qs('#themeIcon');

  if (theme === 'light') {
    document.body.classList.add('light-theme');
    if (icon) icon.textContent = '🌙';
  } else {
    document.body.classList.remove('light-theme');
    if (icon) icon.textContent = '☀️';
  }
}

(function initThemeToggle() {
  applyTheme(currentTheme);

  const btn = qs('#themeToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
})();

/* ============================================
   STATIC BILINGUAL TESTIMONIALS (EN/AR)
   ============================================ */
const STATIC_TESTIMONIALS = {
  en: [
    { quote: "Egypt Creative completely transformed our social media presence. Within 3 months we went from 5K to 45K followers and our sales increased by 180%. Best investment we've made.", author: "Mohamed Hassan", company: "CEO, Hassan Foods Group", initials: "MH" },
    { quote: "The team's creativity is unmatched. Our Ramadan video campaign became viral and drove a 300% spike in website traffic. They don't just deliver — they exceed expectations every single time.", author: "Layla Farouk", company: "Marketing Director, Nile Retail", initials: "LF" },
    { quote: "Our Google rankings went from page 4 to #1 for our main keywords in just 4 months. The SEO team at Egypt Creative knows their craft. Our organic leads have tripled since we started.", author: "Tarek Zaki", company: "Founder, Zaki Tech Solutions", initials: "TZ" },
    { quote: "From brand strategy to execution, they handled everything flawlessly. Our new brand identity is modern, powerful, and resonates perfectly with our target audience. Highly recommended!", author: "Rania Abdel", company: "CEO, Luxe Properties", initials: "RA" }
  ],
  ar: [
    { quote: "وكالة إيجيبت كرييتف غيرت تواجدنا على وسائل التواصل الاجتماعي بالكامل. في خلال 3 أشهر فقط ارتفعت مبيعاتنا بنسبة 180% وزاد التفاعل بشكل غير مسبوق. أفضل استثمار قمنا به على الإطلاق.", author: "محمد حسن", company: "الرئيس التنفيذي، مجموعة حسن للأغذية", initials: "م‌ح" },
    { quote: "إبداع الفريق لا مثيل له. حملة رمضان الإعلانية التي نفذوها حققت ملايين المشاهدات وأحدثت قفزة بنسبة 300% في حركة الزيارات للموقع. هم لا يقدمون مجرد عمل، بل يتجاوزون التوقعات دائماً.", author: "ليلى فاروق", company: "مديرة التسويق، النيل للتجزئة", initials: "ل‌ف" },
    { quote: "تصدر موقعنا محركات البحث وجوجل في المرتبة الأولى للكلمات الرئيسية في 4 أشهر فقط. فريق التسويق الرقمي يتقن عمله باحترافية عالية، وتضاعفت المبيعات ثلاث مرات منذ بدء التعاون.", author: "طارق زكي", company: "المؤسس، زكي لحلول التكنولوجيا", initials: "ط‌ز" },
    { quote: "من الاستراتيجية حتى التنفيذ، أداروا كل شيء بإتقان وسلاسة. الهوية التجارية الجديدة عصرية وقوية وتناسب تطلعات جمهورنا تماماً. نوصي بالتعامل معهم بشدة!", author: "رانيا عبد العزيز", company: "الرئيس التنفيذي، لوكس العقارية", initials: "ر‌ع" }
  ]
};

function updateStaticTestimonialsLang(lang) {
  if (window._hasCMSTestimonials) return;
  const list = STATIC_TESTIMONIALS[lang] || STATIC_TESTIMONIALS.en;
  list.forEach((t, i) => {
    const card = document.getElementById(`testi-${i}`);
    if (!card) return;
    const p = card.querySelector('p');
    const cite = card.querySelector('.testi-name');
    const co = card.querySelector('.testi-co');
    const avatar = card.querySelector('.testi-avatar');
    if (p) p.textContent = `"${t.quote}"`;
    if (cite) cite.textContent = t.author;
    if (co) co.textContent = t.company;
    if (avatar) avatar.textContent = t.initials;
  });
}

/* ============================================
   CLIENTS MARQUEE (TRUSTED BY) DYNAMIC BILINGUAL RENDERER
   ============================================ */
function renderClientsMarquee(lang) {
  const track = document.getElementById('clientsTrack');
  if (!track) return;

  const isAr = (lang || currentLang) === 'ar';
  const projects = (window.dynamicPortfolio && window.dynamicPortfolio.length) ? window.dynamicPortfolio : (typeof FALLBACK_13_PROJECTS !== 'undefined' ? FALLBACK_13_PROJECTS : []);

  if (projects && projects.length) {
    const buildPill = (p) => {
      const nameAr = p.company_name_ar || p.titleAr || p.title_ar || 'علامة تجارية';
      const nameEn = p.company_name_en || p.titleEn || p.title_en || 'Client Partner';
      const name = isAr ? nameAr : nameEn;
      const logo = typeof fixMediaUrl === 'function' ? fixMediaUrl(p.company_logo || p.logo || p.logo_url || 'assets/portfolio_web/logo_' + p.slug + '.jpg') : (p.company_logo || p.logo || 'assets/portfolio_web/logo_' + p.slug + '.jpg');
      const slug = p.slug || p.id;
      return `
        <a href="case-study.html?project=${slug}" class="cl-item">
          <img src="${logo}" class="cl-item-logo" alt="" onerror="this.style.display='none';" />
          <span class="client-name-badge" data-en="${escapeHtml(nameEn)}" data-ar="${escapeHtml(nameAr)}">${escapeHtml(name)}</span>
        </a>
      `;
    };

    let html = '';
    projects.forEach(p => { html += buildPill(p); });
    projects.forEach(p => { html += buildPill(p); });
    track.innerHTML = html;
  } else {
    track.querySelectorAll('.client-name-badge').forEach(badge => {
      if (badge.dataset.ar && badge.dataset.en) {
        badge.textContent = isAr ? badge.dataset.ar : badge.dataset.en;
      }
    });
  }
}
window.renderClientsMarquee = renderClientsMarquee;

/* ============================================
   LANGUAGE TOGGLE (i18n & RTL)
   ============================================ */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('agency_lang', lang);

  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  if (lang === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }

  const langCodeEl = qs('#langCode');
  if (langCodeEl) {
    langCodeEl.textContent = lang === 'ar' ? 'English' : 'عربي';
  }

  // Update all elements with data-i18n attribute
  qsa('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) {
      el.innerHTML = i18n[lang][key];
    }
  });

  // Update static testimonials language dynamically
  updateStaticTestimonialsLang(lang);

  // Update dynamic CMS testimonials language
  if (window.dynamicTestimonials && typeof renderTestimonialsFromCMS === 'function') {
    renderTestimonialsFromCMS(window.dynamicTestimonials, lang);
  }

  // Update clients marquee (Success Partners) with dynamic portfolio & client names
  if (typeof renderClientsMarquee === 'function') {
    renderClientsMarquee(lang);
  }

  // Update dynamic CMS services language (Bilingual Arabic/English)
  if (window.dynamicServices && typeof renderServicesFromCMS === 'function') {
    renderServicesFromCMS(window.dynamicServices, lang);
  }

  if (typeof window.updateCoverflowUI === 'function') {
    window.updateCoverflowUI();
  }
}

(function initLangToggle() {
  applyLang(currentLang);

  const btn = qs('#langToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    applyLang(nextLang);
  });
})();

/* ============================================
   PRELOADER
   ============================================ */
(function initPreloader() {
  const pre = qs('#preloader');
  if (!pre) return;

  let dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;

    // Ensure the bar reaches 100% width
    const bar = qs('.pre-bar', pre);
    if (bar) bar.style.width = '100%';

    setTimeout(() => {
      pre.classList.add('done');
      setTimeout(() => {
        if (pre && pre.parentNode) {
          pre.parentNode.removeChild(pre);
        }
      }, 650);

      qsa('.h-line').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    }, 150);
  }

  // Dismiss right after progress bar completes full 100% animation (1.2s + 0.1s buffer)
  setTimeout(dismiss, 1300);
})();

/* ============================================
   CUSTOM CURSOR
   ============================================ */
(function initCursor() {
  const dot  = qs('#cur-dot');
  const ring = qs('#cur-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const hoverTargets = 'a, button, .svc-card, .work-card, .team-card, .pillar, .process-step';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cur-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cur-hover');
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
(function initHeader() {
  const header = qs('#site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
    toggleBackTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================
   HERO SCROLL-PINNED STEP TEXT ROTATION
   Pins hero for 180vh so user scrolls
   through all 4 steps clearly on both desktop & mobile
   ============================================ */
(function initHeroScrollSteps() {
  const hero  = qs('#home');
  const steps = qsa('.hero-step');
  const scrollHint = qs('.hero-scroll-hint');
  if (!hero || !steps.length) return;

  let autoTimer = null;
  let autoIdx = 0;

  function updateSteps(activeIdx) {
    steps.forEach((step, idx) => {
      if (idx === activeIdx) {
        step.classList.add('active');
        step.classList.remove('before', 'exit');
      } else if (idx < activeIdx) {
        step.classList.add('exit');
        step.classList.remove('active', 'before');
      } else {
        step.classList.add('before');
        step.classList.remove('active', 'exit');
      }
    });
  }

  function startAutoTimer() {
    if (autoTimer) return;
    autoTimer = setInterval(() => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY < 25) {
        autoIdx = (autoIdx + 1) % steps.length;
        updateSteps(autoIdx);
      }
    }, 3400);
  }

  function stopAutoTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function onHeroScroll() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const rect = hero.getBoundingClientRect();
    const scrollableHeight = hero.offsetHeight - window.innerHeight;

    if (scrollY > 20) {
      stopAutoTimer();
    } else {
      startAutoTimer();
    }

    if (scrollableHeight <= 0) return;

    // Progress from 0.0 to 1.0
    const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));

    // Scroll hint fade-out
    if (scrollHint) {
      if (progress > 0.04) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
        scrollHint.style.transform = 'translate(-50%, 15px)';
      } else {
        scrollHint.style.opacity = '0.6';
        scrollHint.style.pointerEvents = 'auto';
        scrollHint.style.transform = 'translate(-50%, 0)';
      }
    }

    // 4 crisp steps mapped evenly:
    // 0: 0.00 - 0.25 (Slide 1)
    // 1: 0.25 - 0.50 (Slide 2)
    // 2: 0.50 - 0.75 (Slide 3)
    // 3: 0.75 - 1.00 (Slide 4)
    let stepIdx = 0;
    if (progress < 0.25) {
      stepIdx = 0;
    } else if (progress < 0.50) {
      stepIdx = 1;
    } else if (progress < 0.75) {
      stepIdx = 2;
    } else {
      stepIdx = 3;
    }

    autoIdx = stepIdx;
    updateSteps(stepIdx);
  }

  window.addEventListener('scroll', onHeroScroll, { passive: true });
  window.addEventListener('resize', onHeroScroll, { passive: true });
  onHeroScroll();
  startAutoTimer();
})();

/* ============================================
   ACTIVE NAV LINK (Spy)
   ============================================ */
function updateActiveNav() {
  const sections = qsa('section[id], div[id]');
  const links    = qsa('.nav-link');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });

  links.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === '#' + current);
  });
}

/* ============================================
   MOBILE NAVIGATION
   ============================================ */
(function initMobileNav() {
  const btn = qs('#hamburger');
  const nav = qs('#mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = !nav.hidden;
    nav.hidden = isOpen;
    btn.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    document.body.classList.toggle('no-scroll', !isOpen);
  });
})();

function closeMenu() {
  const btn = qs('#hamburger');
  const nav = qs('#mobileNav');
  if (!btn || !nav) return;
  nav.hidden = true;
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = qs(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const offset = 80;
  window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
});

/* ============================================
   BACK TO TOP
   ============================================ */
function toggleBackTop() {
  const btn = qs('#backTop');
  if (!btn) return;
  btn.hidden = window.scrollY < 500;
}

(function initBackTop() {
  const btn = qs('#backTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================
   HERO CANVAS — HIGH CONTRAST PARTICLE NETWORK
   ============================================ */
(function initCanvas() {
  const canvas = qs('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 80;

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.r     = Math.random() * 2.5 + 0.8;
      this.vx    = (Math.random() - 0.5) * 0.45;
      this.vy    = (Math.random() - 0.5) * 0.45;
      this.phase = Math.random() * Math.PI * 2;
      this.type  = Math.random() > 0.4 ? 'gold' : 'dark';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.03;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.init();
    }
    draw(isLight) {
      const alpha = 0.45 + 0.4 * Math.abs(Math.sin(this.phase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, isLight ? this.r * 1.2 : this.r, 0, Math.PI * 2);

      if (isLight) {
        ctx.fillStyle = this.type === 'gold' ? `rgba(212, 155, 0, ${alpha})` : `rgba(15, 23, 42, ${alpha * 0.75})`;
      } else {
        ctx.fillStyle = this.type === 'gold' ? `rgba(255, 184, 0, ${alpha * 0.7})` : `rgba(255, 107, 0, ${alpha * 0.6})`;
      }
      ctx.fill();
    }
  }

  const particles = Array.from({ length: COUNT }, () => new Particle());

  function drawLinks(isLight) {
    const maxDist = 135;
    const strokePrefix = isLight ? 'rgba(212, 155, 0, ' : 'rgba(255, 184, 0, ';
    const opacityMult  = isLight ? 0.42 : 0.16;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = strokePrefix + (opacityMult * (1 - d / maxDist)) + ')';
          ctx.lineWidth = isLight ? 1.2 : 0.7;
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.body.classList.contains('light-theme');
    particles.forEach(p => { p.update(); p.draw(isLight); });
    drawLinks(isLight);
    requestAnimationFrame(loop);
  })();
})();

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
function checkReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      io.unobserve(el);

      if (el.classList.contains('services-grid') || el.classList.contains('team-grid')) {
        qsa('.svc-card, .team-card', el).forEach((card, i) => {
          card.style.transitionDelay = (i * 0.1) + 's';
          card.classList.add('in');
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  const targets = qsa([
    '.stats-band',
    '.services-grid',
    '.about-visual',
    '.about-copy',
    '.work-card',
    '.process-step',
    '.team-grid',
    '.testi-slider',
    '.cta-inner',
    '.contact-info-col',
    '.contact-form-col',
    '.svc-card'
  ].join(','));

  targets.forEach(el => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      el.classList.add('reveal');
    }
    io.observe(el);
  });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
(function initCounters() {
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const nums = qsa('.stat-num', entry.target);
      nums.forEach(el => animateNum(el));
      counterIO.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  const band = qs('.stats-band');
  if (band) counterIO.observe(band);
})();

function animateNum(el, overrideTarget) {
  const target = overrideTarget !== undefined ? parseInt(overrideTarget, 10) : parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;

  if (el._animRaf) cancelAnimationFrame(el._animRaf);

  const duration = 2000;
  const start    = performance.now();
  const startVal = parseInt(el.textContent, 10) || 0;

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(startVal + eased * (target - startVal));
    if (progress < 1) {
      el._animRaf = requestAnimationFrame(tick);
    } else {
      el.textContent = target;
      el._animRaf = null;
    }
  }
  el._animRaf = requestAnimationFrame(tick);
}

/* ============================================
   3D COVERFLOW PORTFOLIO SHOWCASE & CASE STUDY DATA
   ============================================ */

/**
 * PORTFOLIO DATA STRUCTURE
 * Replace image placeholders (e.g. 'assets/projects/project-01.jpg') with actual image URLs when uploading to WordPress or static server.
 */
const portfolioData = [
  {
    id: "project-01",
    // IMAGE PLACEHOLDER: Upload project 1 image here (e.g. 'assets/projects/project-01.jpg')
    image: "assets/projects/project-01.jpg",
    bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    title: {
      en: "Al-Rashidi Foods — Brand Revival",
      ar: "الرشيدي للأغذية — إحياء العلامة التجارية"
    },
    category: {
      en: "Branding / Campaign / Digital",
      ar: "هوية تجارية / حملات / تسويق رقمي"
    },
    description: {
      en: "Rebranded a legacy FMCG brand for the digital age, increasing organic social reach by +340% and doubling engagement in 6 months.",
      ar: "إعادة بناء الهوية الرقمية لعلامة تجارية عريقة، مما أدى لزيادة الوصول بنسبة +340% ومضاعفة التفاعل خلال 6 أشهر."
    },
    caseStudy: {
      client: { en: "Al-Rashidi Foods", ar: "الرشيدي للأغذية" },
      year: "2025 - 2026",
      category: { en: "Branding & Digital Strategy", ar: "هوية تجارية واستراتيجية رقمية" },
      heroBg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      challenge: {
        en: "Al-Rashidi Foods needed to modernize its traditional heritage image to appeal to younger tech-savvy consumers without losing 40+ years of trust.",
        ar: "احتاجت شركة الرشيدي للأغذية إلى تحديث صورتها التراثية لتناسب الأجيال الشابة دون التضحية بأكثر من 40 عاماً من الثقة الجماهيرية."
      },
      strategy: {
        en: "We developed a dual-layered brand architecture: preserving core visual elements while introducing vibrant digital typography, motion graphics, and content series.",
        ar: "قمنا بتطوير بنية جديدة للهوية: المحافظة على العناصر البصرية الأساسية مع إدخال خطوط رقمية حديثة، أنيميشن تفاعلي، وسلاسل محتوى رقمية متجددة."
      },
      creativeDirection: {
        en: "Modern Editorial meets Culinary Excellence — high contrast typography, studio macro photography, and punchy motion design.",
        ar: "التميز العصيري برؤية حديثة — خطوط متباينة، تصوير احترافي دقيق، وتصميمات حركة ديناميكية."
      },
      execution: {
        en: "Rolled out full brand guidelines, 60+ social templates, 3 Hero commercials, and targeted performance campaigns across Meta, TikTok, and YouTube.",
        ar: "إطلاق دليل كامل للهوية البصرية، 60+ قالب سوشيال ميديا، 3 إعلانات مصورة، وحملات أداء ممثولة عبر ميتا وتيك توك ويوتيوب."
      },
      results: [
        { val: "+340%", lbl: { en: "Organic Reach Growth", ar: "نمو الوصول الطبيعي" } },
        { val: "+218%", lbl: { en: "Engagement Rate", ar: "معدل التفاعل" } },
        { val: "14.2M", lbl: { en: "Total Campaign Views", ar: "إجمالي المشاهدات" } }
      ],
      galleryGradients: [
        "linear-gradient(135deg, #312e81, #4338ca)",
        "linear-gradient(135deg, #1e1b4b, #312e81)",
        "linear-gradient(135deg, #4338ca, #6366f1)"
      ]
    }
  },
  {
    id: "project-02",
    // IMAGE PLACEHOLDER: Upload project 2 image here (e.g. 'assets/projects/project-02.jpg')
    image: "assets/projects/project-02.jpg",
    bgGradient: "linear-gradient(135deg, #1a0f00 0%, #3a2200 50%, #FFB800 100%)",
    title: {
      en: "Luxe & Co. — Real Estate Identity",
      ar: "لوكس آند كو — الهوية البصرية العقارية"
    },
    category: {
      en: "Branding / Visual Identity / Luxury",
      ar: "هوية بصرية / تصميم فاخر / عقارات"
    },
    description: {
      en: "End-to-end luxury identity and digital experience for an ultra-high-net-worth real estate developer based in Cairo & Dubai.",
      ar: "هوية فاخرة وتجربة رقمية متكاملة لشركة تطوير عقاري فاخرة تستهدف كبار المستثمرين في القاهرة ودبي."
    },
    caseStudy: {
      client: { en: "Luxe & Co. Developments", ar: "شركة لوكس آند كو للتطوير" },
      year: "2026",
      category: { en: "Luxury Branding & Web", ar: "هوية فاخرة وتطوير موقع" },
      heroBg: "linear-gradient(135deg, #2a1800 0%, #4a2d00 100%)",
      challenge: {
        en: "Establish Luxe & Co. as the top choice for ultra-luxury residential properties in Egypt and the GCC against established global legacy developers.",
        ar: "ترسيخ لوكس آند كو كخيار أول للعقارات السكنية الفاخرة في مصر والخليج في مواجهة المطورين العالميين."
      },
      strategy: {
        en: "Created a minimalist gold and obsidian design system emphasizing architectural symmetry, bespoke typography, and interactive virtual tours.",
        ar: "ابتكار نظام تصميم مينيمالي يعتمد على الذهبي والأسود البركاني، مع التركيز على التماثل المعماري والتصفح التفاعلي ثلاثي الأبعاد."
      },
      creativeDirection: {
        en: "Silent Luxury — understated elegance, generous whitespace, gold metallic foils, and cinematic architectural lighting.",
        ar: "الفخامة الهادئة — أناقة غير متكلفة، مساحات واسعة، تفاصيل ذهبية برّاقة، وإضاءة سينمائية للمشاريع المعمارية."
      },
      execution: {
        en: "Delivered brand strategy, logo mark, printed pitch books, digital sales center displays, and interactive 3D web experience.",
        ar: "تقديم استراتيجية الشعار، الهوية البصرية الكاملة، المطبوعات الجلدية الفاخرة، وشاشات العرض التفاعلية بمراكز المبيعات."
      },
      results: [
        { val: "EGP 850M", lbl: { en: "Pre-Launch Sales", ar: "مبيعات ما قبل الإطلاق" } },
        { val: "#1", lbl: { en: "Luxury Brand Recall", ar: "أفضل علامة فاخرة" } },
        { val: "100%", lbl: { en: "Unit Allocation Sold", ar: "بيع كافة الوحدات" } }
      ],
      galleryGradients: [
        "linear-gradient(135deg, #3a2200, #FFB800)",
        "linear-gradient(135deg, #1a0f00, #2a1800)",
        "linear-gradient(135deg, #4a2d00, #FFC72C)"
      ]
    }
  },
  {
    id: "project-03",
    // IMAGE PLACEHOLDER: Upload project 3 image here (e.g. 'assets/projects/project-03.jpg')
    image: "assets/projects/project-03.jpg",
    bgGradient: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)",
    title: {
      en: "TechHub Egypt — Scalable Growth",
      ar: "تك هب مصر — نمو وتوسع رقمي"
    },
    category: {
      en: "SEO / Performance Marketing / Growth",
      ar: "تحسين محركات البحث / إعلانات الأداء / نمو"
    },
    description: {
      en: "Data-driven SEO & performance infrastructure that drove a +420% increase in organic qualified leads for a leading fintech platform.",
      ar: "بنية تسويقية مبنية على البيانات والتنظيم البرمجي رفعت حركة المرور والعملاء المحتملين بنسبة +420%."
    },
    caseStudy: {
      client: { en: "TechHub Middle East", ar: "تيك هب الشرق الأوسط" },
      year: "2025",
      category: { en: "SEO & Growth Hacking", ar: "نمو وتحسين محركات البحث" },
      heroBg: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
      challenge: {
        en: "Outrank massive legacy financial competitors in Google search and reduce customer acquisition costs (CAC) by over 50%.",
        ar: "التفوق على منافسين قطاع التكنولوجيا المالية في محركات البحث وتخفيض تكلفة اكتساب العميل بنسبة أكثر من 50%."
      },
      strategy: {
        en: "Built a programmatic content engine targeting high-intent commercial keywords, technical site optimization, and performance conversion funnels.",
        ar: "بناء محرك محتوى برلمجي يستهدف الكلمات المفتاحية ذات القيمة العالية، تحسين سرعة الأداء البرمجي، ومسارات تحويل مخصصة."
      },
      creativeDirection: {
        en: "Data Dashboard Precision — futuristic neon green accents, dark interface aesthetics, and dynamic chart visualizations.",
        ar: "دقة البيانات المستقبلية — لمسات نيون خضراء، واجهات سوداء حديثة، ورسوم بيانية تفاعلية."
      },
      execution: {
        en: "Published 200+ localized articles, optimized Core Web Vitals to 99/100, and launched high-converting Google Search & Meta campaigns.",
        ar: "نشر 200+ مقال متخصص، رفع كفاءة الموقع الفنية إلى 99/100، وإطلاق حملات بحث جوجل وإعلانات أداء دقيقة."
      },
      results: [
        { val: "+420%", lbl: { en: "Organic Traffic Growth", ar: "نمو الزوار المستهدفين" } },
        { val: "-54%", lbl: { en: "CAC Reduction", ar: "انخفاض تكلفة الاستحواذ" } },
        { val: "48.5K", lbl: { en: "New Monthly Leads", ar: "عميل محتمل شهرياً" } }
      ],
      galleryGradients: [
        "linear-gradient(135deg, #047857, #10b981)",
        "linear-gradient(135deg, #064e3b, #047857)",
        "linear-gradient(135deg, #10b981, #34d399)"
      ]
    }
  },
  {
    id: "project-04",
    // IMAGE PLACEHOLDER: Upload project 4 image here (e.g. 'assets/projects/project-04.jpg')
    image: "assets/projects/project-04.jpg",
    bgGradient: "linear-gradient(135deg, #881337 0%, #be123c 50%, #f43f5e 100%)",
    title: {
      en: "Maadi Mall — Cinematic Ramadan Film",
      ar: "المعادي مول — فيلم رمضان السينمائي"
    },
    category: {
      en: "Video Production / Content / Commercial",
      ar: "إنتاج سينمائي / صناعة محتوى / إعلان"
    },
    description: {
      en: "A viral 60-second Ramadan narrative campaign generating over 2.8M organic views and breaking regional engagement records.",
      ar: "حملة إعلانية سينمائية لرمضان حققت أكثر من 2.8 مليون مشاهدة طبيعية وحطمت أرقام التفاعل بالمنطقة."
    },
    caseStudy: {
      client: { en: "Maadi Retail Group", ar: "مجموعة المعادي للمتاجر" },
      year: "2025",
      category: { en: "Video Production & Campaign", ar: "إنتاج فيديو وحملة إعلانية" },
      heroBg: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
      challenge: {
        en: "Stand out in the most competitive advertising season of the year (Ramadan in Cairo) with a heartwarming narrative that drives foot traffic.",
        ar: "البروز وسط أشد المواسم الإعلانية تنافسية (موسم رمضان في القاهرة) بقصة مؤثرة تحفز الزيارات الفعلية للمول."
      },
      strategy: {
        en: "Focus on human emotion, family reunions, and nostalgia while seamlessly embedding Maadi Mall as the backdrop of iconic moments.",
        ar: "التركيز على المشاعر الإنسانية الدافئة، اللمم الأسري، والحنين، مع دمج المعادي مول كخلفية لهذه اللحظات الخالدة."
      },
      creativeDirection: {
        en: "Warm Warmth & Cinematic Grain — 35mm film aesthetic, golden hour lighting, emotional musical score, and rich Arabic typography.",
        ar: "الدفء السينمائي — إضاءة دافئة بحس 35 مم، موسيقى تصويرية مؤثرة، وخط عربي أصيل وشديد الأناقة."
      },
      execution: {
        en: "Full film production (casting, direction, post-production), sound design, social cuts, and targeted omni-channel release.",
        ar: "إنتاج سينمائي متكامل (إخراج، تمثيل، مونتاج، تصحيح ألوان)، هندسة صوتية، وقاطع مخصصة لوسائل التواصل الاجتماعي."
      },
      results: [
        { val: "2.8M+", lbl: { en: "Organic Views", ar: "مشاهدة طبيعية" } },
        { val: "+165%", lbl: { en: "Foot Traffic Increase", ar: "زيادة زوار المول" } },
        { val: "99.4%", lbl: { en: "Positive Sentiment", ar: "انطباع إيجابي" } }
      ],
      galleryGradients: [
        "linear-gradient(135deg, #be123c, #f43f5e)",
        "linear-gradient(135deg, #881337, #be123c)",
        "linear-gradient(135deg, #f43f5e, #fb7185)"
      ]
    }
  },
  {
    id: "project-05",
    // IMAGE PLACEHOLDER: Upload project 5 image here (e.g. 'assets/projects/project-05.jpg')
    image: "assets/projects/project-05.jpg",
    bgGradient: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)",
    title: {
      en: "Vibe Energy — E-Commerce Launch",
      ar: "فايب إنرجي — إطلاق متجر ومنتج"
    },
    category: {
      en: "Web Development / E-Commerce / Product",
      ar: "تطوير مواقع / تجارة إلكترونية / منتجات"
    },
    description: {
      en: "Headless e-commerce platform and launch campaign for a new generation functional beverage brand, selling out initial batch in 48 hours.",
      ar: "منصة تجارة إلكترونية سريعة مع إطلاق إعلاني لمنتج جديد، نفدت الدفعة الأولى منه بالكامل خلال 48 ساعة."
    },
    caseStudy: {
      client: { en: "Vibe Beverage Co.", ar: "شركة فايب للمشروبات" },
      year: "2026",
      category: { en: "Web & E-Commerce Launch", ar: "تطوير متجر وإطلاق منتج" },
      heroBg: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)",
      challenge: {
        en: "Launch a new FMCG product online-first with high conversion rates and seamless 1-click checkout experience.",
        ar: "إطلاق مشروب جديد عبر الإنترنت أولاً بمعدل تحويل مرتفع وتجربة شراء سريعة بضغطة واحدة."
      },
      strategy: {
        en: "Created a high-speed interactive website with 3D product visualizer, micro-animations, fast checkout, and influencer drop campaigns.",
        ar: "تطوير موقع فائق السرعة يعرض المنتجات ثلاثية الأبعاد، مع أنيميشن سلس، وشراء سريع بالتزامن مع إعلانات المؤثرين."
      },
      creativeDirection: {
        en: "High Voltage Cyberpunk — cyan & electric blue neon gradients, 3D bottle rendering, and energetic kinetic typography.",
        ar: "طاقة نيون حديثة — درجات الأزرق الكهربائي والسايان، مجسمات ثلاثية الأبعاد للمنتج، وتحريك نصوص حركية."
      },
      execution: {
        en: "Custom Shopify/WooCommerce build, Stripe/Paymob integration, 3D WebGL product showcase, and performance launch ads.",
        ar: "برمجة خاصة للمتجر، ربط بوابات الدفع الإلكتروني، عرض 3D تفاعلي للمنتج، وحملات ممثولة ومباشرة."
      },
      results: [
        { val: "48 Hours", lbl: { en: "Sold Out Batch", ar: "نفاد الدفعة الأولى" } },
        { val: "4.8%", lbl: { en: "Conversion Rate", ar: "معدل التحويل" } },
        { val: "12,500+", lbl: { en: "Orders Processed", ar: "طلبية مكتملة" } }
      ],
      galleryGradients: [
        "linear-gradient(135deg, #0284c7, #38bdf8)",
        "linear-gradient(135deg, #0c4a6e, #0284c7)",
        "linear-gradient(135deg, #38bdf8, #7dd3fc)"
      ]
    }
  },
  {
    id: "project-06",
    // IMAGE PLACEHOLDER: Upload project 6 image here (e.g. 'assets/projects/project-06.jpg')
    image: "assets/projects/project-06.jpg",
    bgGradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)",
    title: {
      en: "Khedivial Experience — PR & Event",
      ar: "تجربة الخديوي — فعاليات وعلاقات عامة"
    },
    category: {
      en: "Public Relations / Events / Activations",
      ar: "علاقات عامة / فعاليات / تجارب حية"
    },
    description: {
      en: "Exclusive cultural event launch & VIP press management combining historical storytelling, immersive projection mapping, and PR.",
      ar: "فعالية ثقافية فاخرة وتغطية إعلامية حصرية جمعت بين السرد التاريخي، العرض الضوئي التفاعلي، والتغطية التلفزيونية."
    },
    caseStudy: {
      client: { en: "Heritage Cultural Foundation", ar: "مؤسسة التراث الثقافي" },
      year: "2025",
      category: { en: "PR, Events & Media Coverage", ar: "علاقات عامة وتغطية إعلامية" },
      heroBg: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
      challenge: {
        en: "Attract international media figures, celebrities, and high-profile diplomats to an exclusive cultural launch event in Cairo.",
        ar: "جذب وسائل الإعلام الدولية، الشخصيات العامة، والدبلوماسيين لحضور إطلاق فعاليات رسمية فاخرة بالقاهرة."
      },
      strategy: {
        en: "Leveraged Egypt Creative's extensive network of TV networks, press partners, and influencers for targeted coverage and VIP guest management.",
        ar: "استغلال شبكة علاقات وكالة مصر الإبداعية مع القنوات الفضائية والأنباء والمؤثرين لضمان تغطية استثنائية."
      },
      creativeDirection: {
        en: "Royal Purple & Imperial Gold — majestic lighting, architectural projection, velvet textures, and refined editorial press kits.",
        ar: "الأرجواني الملكي والذهبي — إضاءة ملكية، عروض إسقاط ضوئي معمارية، واستقبال VIP رفيع المستوى."
      },
      execution: {
        en: "End-to-end event management, 3D projection mapping, press conference organization, and 45+ media publications.",
        ar: "إدارة الفعالية بالكامل، عروض 3D الضوئية، المؤتمر الصحفي الرسمي، ونشر التغطيات في أكثر من 45 وسيلة إعلامية."
      },
      results: [
        { val: "45+", lbl: { en: "Media Features", ar: "تغطية إعلامية" } },
        { val: "350+", lbl: { en: "VIP Attendees", ar: "ضيف من كبار الشخصيات" } },
        { val: "100%", lbl: { en: "Positive Press Rate", ar: "تقييم إعلامي ممتاز" } }
      ],
      galleryGradients: [
        "linear-gradient(135deg, #7c3aed, #a855f7)",
        "linear-gradient(135deg, #4c1d95, #7c3aed)",
        "linear-gradient(135deg, #a855f7, #c084fc)"
      ]
    }
  }
];

/*
(function initCoverflowEngine() {
  const stage = qs('#coverflowStage');
  const prevBtn = qs('#cfPrev');
  const nextBtn = qs('#cfNext');
  const indexEl = qs('#cfCurrentIndex');
  const countEl = qs('#cfTotalCount');
  const catEl = qs('#cfCategory');
  const titleEl = qs('#cfTitle');
  const descEl = qs('#cfDesc');
  const caseBtn = qs('#cfCaseBtn');

  if (!stage) return;

  let activeIndex = 0;
  const total = portfolioData.length;
  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let dragDiff = 0;

  function safeStrVal(val, defaultVal = '') {
    if (val === undefined || val === null) return defaultVal;
    const str = String(val).trim();
    if (str === 'undefined' || str === 'null' || str === 'NaN') return defaultVal;
    return str;
  }

  function getProjectField(item, propName, lang = 'en') {
    if (!item) return '';
    const isAr = lang === 'ar';
    if (isAr && item[`${propName}_ar`]) return safeStrVal(item[`${propName}_ar`]);
    if (item[`${propName}_en`]) return safeStrVal(item[`${propName}_en`]);
    if (typeof item[propName] === 'string') return safeStrVal(item[propName]);
    if (item[propName] && typeof item[propName] === 'object') {
      if (isAr && item[propName].ar) return safeStrVal(item[propName].ar);
      if (item[propName].en) return safeStrVal(item[propName].en);
    }
    if (propName === 'category' && item.tag) return safeStrVal(item.tag);
    if (propName === 'description' && item.desc) return safeStrVal(item.desc);
    return '';
  }

  // Create cards dynamically
  function createCards() {
    stage.innerHTML = '';
    portfolioData.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'cf-card';
      card.setAttribute('data-index', idx);
      card.setAttribute('role', 'group');
      const itemTitle = getProjectField(item, 'title', currentLang) || 'Project';
      const itemCategory = getProjectField(item, 'category', currentLang) || 'Portfolio';
      card.setAttribute('aria-label', itemTitle);

      card.innerHTML = `
        <div class="cf-card-inner">
          <div class="cf-card-gfx" style="background:${item.bgGradient || 'linear-gradient(135deg, #0D121F 0%, #1A2338 100%)'};">
            <div class="cf-gfx-badge">${itemCategory}</div>
            <h4 class="cf-gfx-title">${itemTitle}</h4>
          </div>
          <div class="cf-card-overlay">
            <span class="cf-overlay-hint">${currentLang === 'ar' ? 'عرض دراسة الحالة ←' : 'View Case Study →'}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (idx === activeIndex) {
          openCaseStudy(item);
        } else {
          setActiveIndex(idx);
        }
      });

      stage.appendChild(card);
    });

    if (countEl) countEl.textContent = String(total).padStart(2, '0');
  }

  function updateLayout() {
    const cards = qsa('.cf-card', stage);
    if (!cards.length) return;

    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 992 && window.innerWidth > 600;

    const spacing = isMobile ? 160 : isTablet ? 220 : 280;
    const zDepth  = isMobile ? -140 : -200;
    const rotateY = isMobile ? 28 : 35;
    const scaleFactor = isMobile ? 0.8 : 0.82;

    cards.forEach((card, idx) => {
      let offset = idx - activeIndex;

      if (offset > Math.floor(total / 2)) offset -= total;
      if (offset < -Math.floor(total / 2)) offset += total;

      const absOffset = Math.abs(offset);

      card.classList.remove('active', 'is-side', 'is-hidden');

      if (offset === 0) {
        card.classList.add('active');
        card.style.transform = `translateX(0px) translateZ(0px) rotateY(0deg) scale(1)`;
        card.style.opacity = '1';
        card.style.zIndex = '20';
      } else if (absOffset <= 2) {
        card.classList.add('is-side');
        const dir = offset > 0 ? 1 : -1;
        const tx = offset * spacing;
        const tz = absOffset * zDepth;
        const ry = -dir * rotateY;
        const sc = Math.pow(scaleFactor, absOffset);

        card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`;
        card.style.opacity = absOffset === 1 ? '0.75' : '0.4';
        card.style.zIndex = String(10 - absOffset);
      } else {
        card.classList.add('is-hidden');
        card.style.transform = `translateX(${offset * spacing * 1.5}px) translateZ(-500px) scale(0.4)`;
        card.style.opacity = '0';
        card.style.zIndex = '0';
      }
    });

    const currentItem = portfolioData[activeIndex];
    if (currentItem) {
      if (indexEl) indexEl.textContent = String(activeIndex + 1).padStart(2, '0');
      if (catEl) catEl.textContent = getProjectField(currentItem, 'category', currentLang);
      if (titleEl) titleEl.textContent = getProjectField(currentItem, 'title', currentLang);
      if (descEl) descEl.textContent = getProjectField(currentItem, 'description', currentLang) || getProjectField(currentItem, 'desc', currentLang);
    }
  }

  function setActiveIndex(idx) {
    activeIndex = (idx + total) % total;
    updateLayout();
  }

  window.updateCoverflowUI = function() {
    qsa('.cf-gfx-badge', stage).forEach((el, i) => {
      if (portfolioData[i]) el.textContent = getProjectField(portfolioData[i], 'category', currentLang);
    });
    qsa('.cf-gfx-title', stage).forEach((el, i) => {
      if (portfolioData[i]) el.textContent = getProjectField(portfolioData[i], 'title', currentLang);
    });
    qsa('.cf-overlay-hint', stage).forEach(el => {
      el.textContent = currentLang === 'ar' ? 'عرض دراسة الحالة ←' : 'View Case Study →';
    });
    updateLayout();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setActiveIndex(activeIndex - 1);
      resetAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setActiveIndex(activeIndex + 1);
      resetAutoplay();
    });
  }

  if (caseBtn) {
    caseBtn.addEventListener('click', () => {
      if (portfolioData[activeIndex]) {
        openCaseStudy(portfolioData[activeIndex]);
      }
    });
  }

  document.addEventListener('keydown', e => {
    const workSec = qs('#work');
    if (!workSec) return;
    const rect = workSec.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      setActiveIndex(currentLang === 'ar' ? activeIndex + 1 : activeIndex - 1);
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      setActiveIndex(currentLang === 'ar' ? activeIndex - 1 : activeIndex + 1);
      resetAutoplay();
    }
  });

  stage.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    dragDiff = 0;
  });
  stage.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDiff = e.clientX - startX;
  });
  stage.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(dragDiff) > 40) {
      if (dragDiff > 0) setActiveIndex(activeIndex - 1);
      else setActiveIndex(activeIndex + 1);
      resetAutoplay();
    }
  });
  stage.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  stage.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].clientX;
    dragDiff = 0;
  }, { passive: true });

  stage.addEventListener('touchmove', e => {
    if (!isDragging) return;
    dragDiff = e.touches[0].clientX - startX;
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(dragDiff) > 40) {
      if (dragDiff > 0) setActiveIndex(activeIndex - 1);
      else setActiveIndex(activeIndex + 1);
      resetAutoplay();
    }
  });

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      setActiveIndex(activeIndex + 1);
    }, 5500);
  }
  function resetAutoplay() {
    startAutoplay();
  }

  stage.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  stage.addEventListener('mouseleave', () => startAutoplay());

  window.addEventListener('resize', updateLayout, { passive: true });

  createCards();
  updateLayout();
  startAutoplay();
})();
*/

/* ============================================
   CASE STUDY — DEDICATED PAGE NAVIGATION
   (No modal — redirects to case-study.html?slug=...)
   ============================================ */

/* ============================================
   TESTIMONIALS SLIDER CONTROLLER
   ============================================ */
let currentTestiIndex = 0;
let testiAutoTimer = null;

function updateTestimonialView(index) {
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  if (!cards.length) return;

  currentTestiIndex = (index + cards.length) % cards.length;

  cards.forEach((c, i) => {
    c.classList.toggle('active', i === currentTestiIndex);
  });

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.t-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentTestiIndex);
      d.setAttribute('aria-selected', i === currentTestiIndex ? 'true' : 'false');
    });
  }
}
window.updateTestimonialView = updateTestimonialView;

function startTestimonialAutoTimer() {
  if (testiAutoTimer) clearInterval(testiAutoTimer);
  testiAutoTimer = setInterval(() => {
    updateTestimonialView(currentTestiIndex + 1);
  }, 5500);
}
window.startTestimonialAutoTimer = startTestimonialAutoTimer;

function bindTestimonialsButtons() {
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsContainer = document.getElementById('testiDots');

  if (prevBtn) {
    prevBtn.onclick = function(e) {
      e.preventDefault();
      updateTestimonialView(currentTestiIndex - 1);
      startTestimonialAutoTimer();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = function(e) {
      e.preventDefault();
      updateTestimonialView(currentTestiIndex + 1);
      startTestimonialAutoTimer();
    };
  }

  if (dotsContainer) {
    dotsContainer.querySelectorAll('.t-dot').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        const idx = parseInt(btn.dataset.i, 10);
        if (!isNaN(idx)) {
          updateTestimonialView(idx);
          startTestimonialAutoTimer();
        }
      };
    });
  }
}
window.bindTestimonialsButtons = bindTestimonialsButtons;

(function initTestimonials() {
  bindTestimonialsButtons();
  startTestimonialAutoTimer();

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      updateTestimonialView(currentTestiIndex - 1);
      startTestimonialAutoTimer();
    }
    if (e.key === 'ArrowRight') {
      updateTestimonialView(currentTestiIndex + 1);
      startTestimonialAutoTimer();
    }
  });

  const slider = document.querySelector('.testi-slider');
  if (slider) {
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        updateTestimonialView(diff > 0 ? currentTestiIndex + 1 : currentTestiIndex - 1);
        startTestimonialAutoTimer();
      }
    }, { passive: true });
  }
})();

/* ============================================
   NEWSLETTER FORM
   ============================================ */
(function initNewsletter() {
  const btn   = qs('#fnBtn');
  const input = qs('#fnEmail');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(input.value)) {
      input.style.borderColor = '#ef4444';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }
    btn.textContent      = '✓';
    btn.style.background = '#22c55e';
    input.value          = '';
    input.placeholder    = currentLang === 'ar' ? 'شكراً! تم الاشتراك بنجاح' : 'Thank you! You\'re subscribed.';
    input.disabled       = true;
    btn.disabled         = true;
  });
})();

/* ============================================
   3D TILT EFFECT ON CARDS
   ============================================ */
(function initTilt() {
  qsa('.svc-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const rx = (e.clientY - cy) / 18;
      const ry = (cx - e.clientX) / 18;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================
   ABOUT SECTION 3-SLIDE SLIDER
   ============================================ */
(function initAboutSlider() {
  const slides  = qsa('.about-slide');
  const tabs    = qsa('.about-tab-btn');
  const dots    = qsa('.slide-dot');
  const prevBtn = qs('#aboutPrev');
  const nextBtn = qs('#aboutNext');

  if (!slides.length) return;

  let currentSlideIndex = 0;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlideIndex = index;

    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    tabs.forEach((tab, idx) => {
      if (idx === currentSlideIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const slideIdx = parseInt(tab.getAttribute('data-slide'), 10);
      goToSlide(slideIdx);
    });
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
      goToSlide(slideIdx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex + 1);
    });
  }
})();

/* ============================================
   CONTACT FORM WHATSAPP SUBMISSION ENGINE
   ============================================ */
(function initContactForm() {
  const form = qs('#contactForm');
  if (!form) return;

  const nameInput = qs('#cf-name');
  const emailInput = qs('#cf-email');
  const phoneInput = qs('#cf-phone');
  const companyInput = qs('#cf-company');
  const messageInput = qs('#cf-message');

  const errName = qs('#err-name');
  const errEmail = qs('#err-email');
  const errPhone = qs('#err-phone');
  const errMessage = qs('#err-message');

  function validate() {
    let isValid = true;

    if (!nameInput || !nameInput.value.trim()) {
      if (errName) errName.textContent = currentLang === 'ar' ? 'يرجى كتابة الاسم' : 'Please enter your name.';
      if (nameInput) nameInput.classList.add('error');
      isValid = false;
    } else {
      if (errName) errName.textContent = '';
      if (nameInput) nameInput.classList.remove('error');
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailInput.value.trim() || !emailRe.test(emailInput.value.trim())) {
      if (errEmail) errEmail.textContent = currentLang === 'ar' ? 'يرجى كتابة بريد إلكتروني صحيح' : 'Please enter a valid email.';
      if (emailInput) emailInput.classList.add('error');
      isValid = false;
    } else {
      if (errEmail) errEmail.textContent = '';
      if (emailInput) emailInput.classList.remove('error');
    }

    // Phone validation: Mandatory + Egyptian 11 digits (e.g. 01012345678) or international format
    const rawPhone = phoneInput ? phoneInput.value.trim() : '';
    const cleanDigits = rawPhone.replace(/[^0-9]/g, '');
    const isEgyptianFormat = /^(01[0125][0-9]{8}|(\+?20|0020)1[0125][0-9]{8})$/.test(rawPhone.replace(/[\s\-\(\)]/g, ''));
    const is11Digits = cleanDigits.length === 11;

    if (!rawPhone) {
      if (errPhone) errPhone.textContent = currentLang === 'ar' ? 'يرجى كتابة رقم الهاتف' : 'Please enter your phone number.';
      if (phoneInput) phoneInput.classList.add('error');
      isValid = false;
    } else if (!isEgyptianFormat && !is11Digits) {
      if (errPhone) errPhone.textContent = currentLang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح مكون من 11 رقم (مثال: 01012345678)' : 'Please enter a valid 11-digit phone number (e.g. 01012345678).';
      if (phoneInput) phoneInput.classList.add('error');
      isValid = false;
    } else {
      if (errPhone) errPhone.textContent = '';
      if (phoneInput) phoneInput.classList.remove('error');
    }

    if (!messageInput || !messageInput.value.trim()) {
      if (errMessage) errMessage.textContent = currentLang === 'ar' ? 'يرجى كتابة تفاصيل طلبك' : 'Please enter your message.';
      if (messageInput) messageInput.classList.add('error');
      isValid = false;
    } else {
      if (errMessage) errMessage.textContent = '';
      if (messageInput) messageInput.classList.remove('error');
    }

    return isValid;
  }

  [nameInput, emailInput, phoneInput, messageInput].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = qs('#err-' + field.id.replace('cf-', ''));
      if (errEl) errEl.textContent = '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const company = (companyInput && companyInput.value.trim()) ? companyInput.value.trim() : (currentLang === 'ar' ? 'غير محدد' : 'N/A');
    const message = messageInput.value.trim();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = currentLang === 'ar' ? '⏳ جاري الإرسال...' : '⏳ Sending...';
    }

    // Get dynamic WhatsApp number from global window settings or fallback
    const rawWa = (window.siteSettings && window.siteSettings.whatsapp) 
      ? String(window.siteSettings.whatsapp).replace(/[^0-9]/g, '') 
      : '201044107134';
    const waNumber = rawWa.length ? rawWa : '201044107134';

    // Post to backend database & trigger email notification
    let apiEndpoint = 'api.php?action=submit_inquiry';
    let dbSuccess = false;

    try {
      const resp = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, message })
      });
      const resJson = await resp.json();
      if (resJson && resJson.success) {
        dbSuccess = true;
      }
    } catch (err) {
      console.warn('API submission warning:', err);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    const waText = 
`✨ *طلب جديد من موقع Egypt Creative* 🚀
━━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${name}
📱 *الهاتف:* ${phone}
📧 *الإيميل:* ${email}
🏢 *الشركة / النشاط:* ${company}
━━━━━━━━━━━━━━━━━━━
📝 *تفاصيل الاستفسار:*
"${message}"
━━━━━━━━━━━━━━━━━━━
🌐 *تم الإرسال عبر الموقع الإلكتروني*`;

    const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
    window.open(whatsappUrl, '_blank');

    const formDone = qs('#formDone');
    if (formDone) {
      formDone.hidden = false;
      formDone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset form
    form.reset();
  });
})();

/* ============================================
   DYNAMIC CONTENT DATA BINDING FROM CMS
   ============================================ */
(async function initDynamicContent() {
  try {
    // Always use the real API — data.json is blocked by .htaccess on production
    const endpoint = (window.location.protocol === 'file:')
      ? null  // Cannot use API from local file:// — dynamic sections skipped
      : `api.php?action=get_data&_t=${Date.now()}`;

    if (!endpoint) return; // Skip dynamic loading in file:// context
    let res = await fetch(endpoint, { cache: 'no-store' }).then(r => r.json());
    if (!res) return;

    function cmsValue(val, lang) {
      if (!val) return '';
      if (typeof val === 'object') {
        const currentLang = lang || (document.documentElement.lang === 'ar' || document.body.classList.contains('rtl') ? 'ar' : 'en');
        return String(val[currentLang] ?? val.en ?? val.ar ?? '');
      }
      return String(val);
    }

    // 1. Settings (Phone, Email, Socials, Accent Color)
    try {
      if (res.settings) {
        const accentColor = cmsValue(res.settings.accentColor);
        if (accentColor) {
          document.documentElement.style.setProperty('--gold', accentColor);
        }

        const phone = cmsValue(res.settings.phone);
        if (phone) {
          document.querySelectorAll('a[href^="tel:"]').forEach(a => {
            a.href = `tel:${phone.replace(/\s+/g, '')}`;
            if (a.classList.contains('cd-value')) a.textContent = phone;
          });
        }

        const email = cmsValue(res.settings.email);
        if (email) {
          document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
            a.href = `mailto:${email}`;
            a.textContent = email;
          });
        }

        const insta = cmsValue(res.settings.instagram);
        if (insta) {
          document.querySelectorAll('a[aria-label="Instagram"]').forEach(a => a.href = insta);
        }

        const linkedin = cmsValue(res.settings.linkedin);
        if (linkedin) {
          document.querySelectorAll('a[aria-label="LinkedIn"]').forEach(a => a.href = linkedin);
        }
      }
    } catch (e) {
      console.warn('CMS Settings error:', e);
    }

    // 1b. Dynamic Hero & Process Badge from CMS
    if (res.hero) {
      const isAr = document.documentElement.lang === 'ar' || document.body.classList.contains('rtl');
      const badge = cmsValue(isAr ? res.hero.badge_ar : res.hero.badge_en);
      if (badge) {
        const badgeEl = document.querySelector('.hero-badge');
        if (badgeEl) badgeEl.textContent = badge;
      }
    }

    // 2. Stats Counters & Labels
    if (res.stats) {
      const statItems = document.querySelectorAll('.stats-grid .stat-item');
      if (statItems.length >= 4) {
        const getStatVal = (obj) => {
          if (!obj) return null;
          if (typeof obj === 'string') return obj;
          return (isAr ? obj.ar : obj.en) || obj.en || obj.ar || null;
        };

        const valKeys = ['stat1_val', 'stat2_val', 'stat3_val', 'stat4_val'];
        const altValKeys = ['stat1Val', 'stat2Val', 'stat3Val', 'stat4Val'];
        const lblKeys = ['stat1_lbl', 'stat2_lbl', 'stat3_lbl', 'stat4_lbl'];

        valKeys.forEach((key, idx) => {
          const item = statItems[idx];
          if (!item) return;
          const numEl = item.querySelector('.stat-num');
          const plusEl = item.querySelector('.stat-plus');
          const lblEl = item.querySelector('p[data-i18n]');

          const rawLbl = getStatVal(res.stats[lblKeys[idx]]);
          if (rawLbl && lblEl) {
            lblEl.textContent = rawLbl;
          }

          const rawVal = getStatVal(res.stats[key] || res.stats[altValKeys[idx]]);
          if (rawVal && numEl) {
            const match = String(rawVal).trim().match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
            if (match) {
              const numericTarget = match[1];
              const suffix = match[2];
              numEl.dataset.target = numericTarget;
              if (plusEl && suffix !== undefined) {
                plusEl.textContent = suffix;
              }
              animateNum(numEl, numericTarget);
            } else {
              numEl.textContent = rawVal;
            }
          }
        });
      }
    }

    // 3. Dynamic Clients & Portfolio Storage — Success Partners Marquee
    window.dynamicClients = res.clients || [];
    window.dynamicPortfolio = res.portfolio || [];
    renderClientsMarquee(currentLang);

    // 4. Dynamic Portfolio — store and re-render coverflow & golden circle showcase
    if (res.portfolio) {
      window.dynamicPortfolio = res.portfolio;
      initCoverflow(res.portfolio);
      buildGoldenCircleShowcase(res.portfolio);
    }

    // 5. Dynamic Team Section (with CMS visibility toggle)
    const teamFlag = (res.team_section_enabled !== undefined) ? res.team_section_enabled : 1;
    renderTeamSection(res.team || [], teamFlag);

    // 6. Dynamic Testimonials from CMS (replaces static HTML)
    if (res.testimonials && res.testimonials.length) {
      renderTestimonialsFromCMS(res.testimonials);
    }

    // 7. Dynamic Services from CMS (replaces static HTML with bilingual support)
    if (res.services && res.services.length) {
      window.dynamicServices = res.services;
      renderServicesFromCMS(res.services, currentLang);
    }

    // Update global i18n translation dictionary so static i18n loop NEVER overwrites CMS edits!
    if (!i18n.en) i18n.en = {};
    if (!i18n.ar) i18n.ar = {};

    if (res.hero) {
      if (res.hero.badge_en) i18n.en['hero.badge'] = res.hero.badge_en;
      if (res.hero.badge_ar) i18n.ar['hero.badge'] = res.hero.badge_ar;
    }
    if (res.about) {
      if (res.about.tag_en) i18n.en['about.tag'] = res.about.tag_en;
      if (res.about.tag_ar) i18n.ar['about.tag'] = res.about.tag_ar;
      if (res.about.title_en) i18n.en['about.title'] = res.about.title_en;
      if (res.about.title_ar) i18n.ar['about.title'] = res.about.title_ar;

      if (res.about.slide1_p1_en) i18n.en['about.slide1.p1'] = res.about.slide1_p1_en;
      if (res.about.slide1_p1_ar) i18n.ar['about.slide1.p1'] = res.about.slide1_p1_ar;
      if (res.about.slide1_p2_en) i18n.en['about.slide1.p2'] = res.about.slide1_p2_en;
      if (res.about.slide1_p2_ar) i18n.ar['about.slide1.p2'] = res.about.slide1_p2_ar;
      if (res.about.slide1_p3_en) i18n.en['about.slide1.p3'] = res.about.slide1_p3_en;
      if (res.about.slide1_p3_ar) i18n.ar['about.slide1.p3'] = res.about.slide1_p3_ar;
      if (res.about.slide1_p4_en) i18n.en['about.slide1.p4'] = res.about.slide1_p4_en;
      if (res.about.slide1_p4_ar) i18n.ar['about.slide1.p4'] = res.about.slide1_p4_ar;
      if (res.about.slide1_p5_en) i18n.en['about.slide1.p5'] = res.about.slide1_p5_en;
      if (res.about.slide1_p5_ar) i18n.ar['about.slide1.p5'] = res.about.slide1_p5_ar;
      if (res.about.slide1_p6_en) i18n.en['about.slide1.p6'] = res.about.slide1_p6_en;
      if (res.about.slide1_p6_ar) i18n.ar['about.slide1.p6'] = res.about.slide1_p6_ar;

      if (res.about.slide2_title_en) i18n.en['about.slide2.title'] = res.about.slide2_title_en;
      if (res.about.slide2_title_ar) i18n.ar['about.slide2.title'] = res.about.slide2_title_ar;
      if (res.about.slide2_p1_en) i18n.en['about.slide2.p1'] = res.about.slide2_p1_en;
      if (res.about.slide2_p1_ar) i18n.ar['about.slide2.p1'] = res.about.slide2_p1_ar;
      if (res.about.slide2_p2_en) i18n.en['about.slide2.p2'] = res.about.slide2_p2_en;
      if (res.about.slide2_p2_ar) i18n.ar['about.slide2.p2'] = res.about.slide2_p2_ar;
      if (res.about.slide3_p3_en) i18n.en['about.slide2.p3'] = res.about.slide2_p3_en;
      if (res.about.slide3_p3_ar) i18n.ar['about.slide2.p3'] = res.about.slide2_p3_ar;

      if (res.about.slide3_title_en) i18n.en['about.slide3.title'] = res.about.slide3_title_en;
      if (res.about.slide3_title_ar) i18n.ar['about.slide3.title'] = res.about.slide3_title_ar;
      if (res.about.slide3_p1_en) i18n.en['about.slide3.p1'] = res.about.slide3_p1_en;
      if (res.about.slide3_p1_ar) i18n.ar['about.slide3.p1'] = res.about.slide3_p1_ar;
      if (res.about.slide3_p2_en) i18n.en['about.slide3.p2'] = res.about.slide3_p2_en;
      if (res.about.slide3_p2_ar) i18n.ar['about.slide3.p2'] = res.about.slide3_p2_ar;
      if (res.about.slide3_p3_en) i18n.en['about.slide3.p3'] = res.about.slide3_p3_en;
      if (res.about.slide3_p3_ar) i18n.ar['about.slide3.p3'] = res.about.slide3_p3_ar;
      if (res.about.slide3_p4_en) i18n.en['about.slide3.p4'] = res.about.slide3_p4_en;
      if (res.about.slide3_p4_ar) i18n.ar['about.slide3.p4'] = res.about.slide3_p4_ar;
      if (res.about.slide3_p5_en) i18n.en['about.slide3.p5'] = res.about.slide3_p5_en;
      if (res.about.slide3_p5_ar) i18n.ar['about.slide3.p5'] = res.about.slide3_p5_ar;

      if (res.about.card_title_en) i18n.en['about.card.title'] = res.about.card_title_en;
      if (res.about.card_title_ar) i18n.ar['about.card.title'] = res.about.card_title_ar;
      if (res.about.card_desc_en) i18n.en['about.card.desc'] = res.about.card_desc_en;
      if (res.about.card_desc_ar) i18n.ar['about.card.desc'] = res.about.card_desc_ar;
    }
    if (res.stats) {
      if (res.stats.stat1_lbl_en) i18n.en['stats.clients'] = res.stats.stat1_lbl_en;
      if (res.stats.stat1_lbl_ar) i18n.ar['stats.clients'] = res.stats.stat1_lbl_ar;
      if (res.stats.stat2_lbl_en) i18n.en['stats.exp'] = res.stats.stat2_lbl_en;
      if (res.stats.stat2_lbl_ar) i18n.ar['stats.exp'] = res.stats.stat2_lbl_ar;
      if (res.stats.stat3_lbl_en) i18n.en['stats.campaigns'] = res.stats.stat3_lbl_en;
      if (res.stats.stat3_lbl_ar) i18n.ar['stats.campaigns'] = res.stats.stat3_lbl_ar;
      if (res.stats.stat4_lbl_en) i18n.en['stats.satisfaction'] = res.stats.stat4_lbl_en;
      if (res.stats.stat4_lbl_ar) i18n.ar['stats.satisfaction'] = res.stats.stat4_lbl_ar;
    }

    applyLang(currentLang);

  } catch (e) {
    // API unreachable — dynamic sections remain in their default static state.
    // data.json is intentionally blocked by .htaccess; no fallback fetch attempted.
    console.warn('Dynamic CMS API unreachable:', e?.message || e);
  }
})();

/* ============================================
   HORIZONTAL AUTO-SLIDING SHOWCASE ENGINE (6s)
   ============================================ */
  window.initCoverflow = function(projects) {
    const data = (projects && Array.isArray(projects)) ? projects : [];
    buildGoldenCircleShowcase(data);
  };

  const FALLBACK_13_PROJECTS = [
  {
    "id": "p_1",
    "slug": "azzam-real-estate",
    "company_name_ar": "عزام للاستثمار العقاري",
    "company_name_en": "Azzam Real Estate",
    "title_ar": "هوية وتسويق استثماري لشركة عزام للعقارات والتشطيبات",
    "title_en": "Azzam Luxury Real Estate & Interior Finishing",
    "category_ar": "استثمار عقاري وتصميم داخلي",
    "category_en": "Real Estate & Interior Design",
    "category": "Real Estate & Interior Design",
    "servicesAr": "استثمار عقاري وتصميم داخلي",
    "servicesEn": "Real Estate & Interior Design",
    "desc_ar": "حملة تسويقية رقمية متكاملة لترسيخ مكانة شركة عزام في التطوير العقاري والتشطيبات الفاخرة وجذب العملاء المستهدفين.",
    "desc_en": "Comprehensive digital marketing campaign, visual identity rollout, and high-ticket interior finishing lead generation.",
    "logo": "assets/portfolio_web/logo_azzam-real-estate.jpg",
    "company_logo": "assets/portfolio_web/logo_azzam-real-estate.jpg",
    "img": "assets/portfolio_web/cover_azzam-real-estate.jpg",
    "gallery": [
      "assets/portfolio_web/g_azzam-real-estate_1.jpg",
      "assets/portfolio_web/g_azzam-real-estate_2.jpg"
    ],
    "metric_val1": "4.2x",
    "metric_lbl1_en": "ROAS Growth",
    "metric_lbl1_ar": "عائد الإنفاق الإعلاني",
    "metric_val2": "450+",
    "metric_lbl2_en": "Qualified Leads",
    "metric_lbl2_ar": "استفسار تعاقد جاد",
    "metric_val3": "+180%",
    "metric_lbl3_en": "Client Base Surge",
    "metric_lbl3_ar": "نمو قاعدة العملاء"
  },
  {
    "id": "p_2",
    "slug": "egypt-builders",
    "company_name_ar": "إيجيبت بيلدرز للمقاولات",
    "company_name_en": "Egypt Builders",
    "title_ar": "بناء الهوية والريادة لشركة إيجيبت بيلدرز للمقاولات العامة",
    "title_en": "Egypt Builders Enterprise Construction & Contracting",
    "category_ar": "مقاولات وهندسة إنشائية",
    "category_en": "Construction & Contracting",
    "category": "Construction & Contracting",
    "servicesAr": "مقاولات وهندسة إنشائية",
    "servicesEn": "Construction & Contracting",
    "desc_ar": "بناء حضور رقمي مؤسسي قوي لشركة إيجيبت بيلدرز واستعراض المشاريع الإنشائية والتجارية الكبرى.",
    "desc_en": "Corporate brand elevation and commercial contracting showcase establishing Egypt Builders as a top-tier construction firm.",
    "logo": "assets/portfolio_web/logo_egypt-builders.jpg",
    "company_logo": "assets/portfolio_web/logo_egypt-builders.jpg",
    "img": "assets/portfolio_web/cover_egypt-builders.jpg",
    "gallery": [
      "assets/portfolio_web/g_egypt-builders_1.jpg",
      "assets/portfolio_web/g_egypt-builders_2.jpg",
      "assets/portfolio_web/g_egypt-builders_3.jpg",
      "assets/portfolio_web/g_egypt-builders_4.jpg"
    ],
    "metric_val1": "6",
    "metric_lbl1_en": "Major Tenders Won",
    "metric_lbl1_ar": "مناقصات تجارية كبرى",
    "metric_val2": "2.4M+",
    "metric_lbl2_en": "Total Reach",
    "metric_lbl2_ar": "إجمالي الوصول الرقمي",
    "metric_val3": "99%",
    "metric_lbl3_en": "Corporate Trust Index",
    "metric_lbl3_ar": "مؤشر الثقة المؤسسية"
  },
  {
    "id": "p_3",
    "slug": "next-academy",
    "company_name_ar": "أكاديمية نكست للإدارة",
    "company_name_en": "Next Academy",
    "title_ar": "استراتيجية استقطاب رواد الأعمال لأكاديمية نكست",
    "title_en": "Next Executive Academy — Business & AI Leadership",
    "category_ar": "تدريب إداري وذكاء اصطناعي",
    "category_en": "Business Training & AI",
    "category": "Business Training & AI",
    "servicesAr": "تدريب إداري وذكاء اصطناعي",
    "servicesEn": "Business Training & AI",
    "desc_ar": "حملة إعلانية ومحتوى فكري مكثف لترسيخ ريادة نكست أكاديمي في تدريب القيادات وتطبيقات الذكاء الاصطناعي في الأعمال.",
    "desc_en": "High-converting educational campaign positioning Next Academy at the forefront of AI-powered corporate management.",
    "logo": "assets/portfolio_web/logo_next-academy.jpg",
    "company_logo": "assets/portfolio_web/logo_next-academy.jpg",
    "img": "assets/portfolio_web/cover_next-academy.jpg",
    "gallery": [
      "assets/portfolio_web/g_next-academy_1.jpg",
      "assets/portfolio_web/g_next-academy_2.jpg",
      "assets/portfolio_web/g_next-academy_3.jpg",
      "assets/portfolio_web/g_next-academy_4.jpg",
      "assets/portfolio_web/g_next-academy_5.jpg",
      "assets/portfolio_web/g_next-academy_6.jpg",
      "assets/portfolio_web/g_next-academy_7.jpg",
      "assets/portfolio_web/g_next-academy_8.jpg"
    ],
    "metric_val1": "3.2K+",
    "metric_lbl1_en": "Executive Trainees",
    "metric_lbl1_ar": "قائد ومتدرب تنفيذي",
    "metric_val2": "+380%",
    "metric_lbl2_en": "Enrollment Surge",
    "metric_lbl2_ar": "نمو في التسجيل",
    "metric_val3": "4.9/5",
    "metric_lbl3_en": "Program Rating",
    "metric_lbl3_ar": "تقييم جودة البرامج"
  },
  {
    "id": "p_4",
    "slug": "ramadan-majlis",
    "company_name_ar": "مجلس رمضان للفعاليات",
    "company_name_en": "Ramadan Majlis",
    "title_ar": "إطلاق وتغطية وتذاكر فعاليات مجلس رمضان الثقافي",
    "title_en": "Ramadan Majlis — Premier Cultural & Business Gathering",
    "category_ar": "فعاليات ومهرجانات",
    "category_en": "Event Production & Media",
    "category": "Event Production & Media",
    "servicesAr": "فعاليات ومهرجانات",
    "servicesEn": "Event Production & Media",
    "desc_ar": "بناء هوية بصرية رمضانية فاخرة، وإدارة الحملة الترويجية لمتحدثي وضيوف مجلس رمضان وحجز المقاعد.",
    "desc_en": "Complete branding, guest speaker reveals, and ticket booking campaigns for the premier Ramadan Majlis summit.",
    "logo": "assets/portfolio_web/logo_ramadan-majlis.jpg",
    "company_logo": "assets/portfolio_web/logo_ramadan-majlis.jpg",
    "img": "assets/portfolio_web/cover_ramadan-majlis.jpg",
    "gallery": [
      "assets/portfolio_web/g_ramadan-majlis_1.jpg",
      "assets/portfolio_web/g_ramadan-majlis_2.jpg",
      "assets/portfolio_web/g_ramadan-majlis_3.jpg",
      "assets/portfolio_web/g_ramadan-majlis_4.jpg",
      "assets/portfolio_web/g_ramadan-majlis_5.jpg",
      "assets/portfolio_web/g_ramadan-majlis_6.jpg",
      "assets/portfolio_web/g_ramadan-majlis_7.jpg",
      "assets/portfolio_web/g_ramadan-majlis_8.jpg"
    ],
    "metric_val1": "100%",
    "metric_lbl1_en": "Sold Out Tickets",
    "metric_lbl1_ar": "اكتمال حجز المقاعد",
    "metric_val2": "1.8M+",
    "metric_lbl2_en": "Event Impressions",
    "metric_lbl2_ar": "ظهور وتفاعل اجتماعي",
    "metric_val3": "5 Days",
    "metric_lbl3_en": "Ahead of Schedule",
    "metric_lbl3_ar": "اكتمال الحجز مبكراً"
  },
  {
    "id": "p_5",
    "slug": "smile-care-clinics",
    "company_name_ar": "عيادات سمايل كير",
    "company_name_en": "Smile Care Clinics",
    "title_ar": "استراتيجية التحول الرقمي وجذب المرضى لعيادات سمايل كير",
    "title_en": "Smile Care Dental Clinics — Digital Growth & Patient Acquisition",
    "category_ar": "رعاية طبية وتجميل أسنان",
    "category_en": "Medical & Healthcare",
    "category": "Medical & Healthcare",
    "servicesAr": "رعاية طبية وتجميل أسنان",
    "servicesEn": "Medical & Healthcare",
    "desc_ar": "منظومة متكاملة لزيادة حجوزات المرضى، ورفع الوعي بصحة الأسنان، والترويج لزراعة وتجميل الابتسامة.",
    "desc_en": "End-to-end patient acquisition engine, educational dental health awareness, and cosmetic smile makeover campaigns.",
    "logo": "assets/portfolio_web/logo_smile-care-clinics.jpg",
    "company_logo": "assets/portfolio_web/logo_smile-care-clinics.jpg",
    "img": "assets/portfolio_web/cover_smile-care-clinics.jpg",
    "gallery": [
      "assets/portfolio_web/g_smile-care-clinics_1.jpg",
      "assets/portfolio_web/g_smile-care-clinics_2.jpg",
      "assets/portfolio_web/g_smile-care-clinics_3.jpg",
      "assets/portfolio_web/g_smile-care-clinics_4.jpg",
      "assets/portfolio_web/g_smile-care-clinics_5.jpg",
      "assets/portfolio_web/g_smile-care-clinics_6.jpg",
      "assets/portfolio_web/g_smile-care-clinics_7.jpg",
      "assets/portfolio_web/g_smile-care-clinics_8.jpg"
    ],
    "metric_val1": "650+",
    "metric_lbl1_en": "Monthly Bookings",
    "metric_lbl1_ar": "حجز شهري مؤكد",
    "metric_val2": "+220%",
    "metric_lbl2_en": "Implants Surge",
    "metric_lbl2_ar": "نمو عمليات الزراعة",
    "metric_val3": "4.9★",
    "metric_lbl3_en": "Patient Trust",
    "metric_lbl3_ar": "تقييم رضا المرضى"
  },
  {
    "id": "p_6",
    "slug": "the-smile-center",
    "company_name_ar": "مركز ذا سمايل",
    "company_name_en": "The Smile Center",
    "title_ar": "هوية وحملات تجميل الأسنان بدون ألم لمركز ذا سمايل",
    "title_en": "The Smile Center — Pain-Free Cosmetic Dentistry",
    "category_ar": "طب وتجميل الأسنان",
    "category_en": "Cosmetic Dentistry",
    "category": "Cosmetic Dentistry",
    "servicesAr": "طب وتجميل الأسنان",
    "servicesEn": "Cosmetic Dentistry",
    "desc_ar": "حملة تجميل الأسنان الفاخرة بالتركيز على البنج الإلكتروني بدون إبرة وتصميم الابتسامة في جلسة واحدة.",
    "desc_en": "Premium cosmetic dentistry campaign focusing on electronic anesthesia, same-day veneers, and pain-free transformations.",
    "logo": "assets/portfolio_web/logo_the-smile-center.jpg",
    "company_logo": "assets/portfolio_web/logo_the-smile-center.jpg",
    "img": "assets/portfolio_web/cover_the-smile-center.jpg",
    "gallery": [
      "assets/portfolio_web/g_the-smile-center_1.jpg",
      "assets/portfolio_web/g_the-smile-center_2.jpg",
      "assets/portfolio_web/g_the-smile-center_3.jpg",
      "assets/portfolio_web/g_the-smile-center_4.jpg",
      "assets/portfolio_web/g_the-smile-center_5.jpg",
      "assets/portfolio_web/g_the-smile-center_6.jpg",
      "assets/portfolio_web/g_the-smile-center_7.jpg",
      "assets/portfolio_web/g_the-smile-center_8.jpg"
    ],
    "metric_val1": "3x",
    "metric_lbl1_en": "Consultation Boost",
    "metric_lbl1_ar": "زيادة طلبات الاستشارة",
    "metric_val2": "<4%",
    "metric_lbl2_en": "No-Show Rate",
    "metric_lbl2_ar": "التزام بالمواعيد",
    "metric_val3": "97%",
    "metric_lbl3_en": "Painless Feedback",
    "metric_lbl3_ar": "تأكيد تجربة بدون ألم"
  },
  {
    "id": "p_7",
    "slug": "german-bugs-control",
    "company_name_ar": "الشركة الألمانية لمكافحة الحشرات",
    "company_name_en": "German Pest Control",
    "title_ar": "حملة الحماية المنزلية الآمنة للشركة الألمانية للمكافحة",
    "title_en": "German Pest Control — Safe & Odorless Home Protection",
    "category_ar": "خدمات منزلية ومكافحة آفات",
    "category_en": "Home Services & Hygiene",
    "category": "Home Services & Hygiene",
    "servicesAr": "خدمات منزلية ومكافحة آفات",
    "servicesEn": "Home Services & Hygiene",
    "desc_ar": "حملات إعلانات استجابة مباشرة توفر خدمات إبادة الحشرات والآفات بدون رائحة وبدون مغادرة المنزل.",
    "desc_en": "Direct-response performance marketing campaign delivering safe, odorless, and family-friendly pest eradication.",
    "logo": "assets/portfolio_web/logo_german-bugs-control.jpg",
    "company_logo": "assets/portfolio_web/logo_german-bugs-control.jpg",
    "img": "assets/portfolio_web/cover_german-bugs-control.jpg",
    "gallery": [
      "assets/portfolio_web/g_german-bugs-control_1.jpg",
      "assets/portfolio_web/g_german-bugs-control_2.jpg",
      "assets/portfolio_web/g_german-bugs-control_3.jpg",
      "assets/portfolio_web/g_german-bugs-control_4.jpg",
      "assets/portfolio_web/g_german-bugs-control_5.jpg",
      "assets/portfolio_web/g_german-bugs-control_6.jpg",
      "assets/portfolio_web/g_german-bugs-control_7.jpg",
      "assets/portfolio_web/g_german-bugs-control_8.jpg"
    ],
    "metric_val1": "1.1K+",
    "metric_lbl1_en": "Protected Units",
    "metric_lbl1_ar": "منزل ومؤسسة تم حمايتها",
    "metric_val2": "99.2%",
    "metric_lbl2_en": "Eradication Success",
    "metric_lbl2_ar": "نسبة الإبادة التامة",
    "metric_val3": "15m",
    "metric_lbl3_en": "Fast Response",
    "metric_lbl3_ar": "متوسط سرعة الرد"
  },
  {
    "id": "p_8",
    "slug": "egyptian-center",
    "company_name_ar": "المركز المصري للتدريب",
    "company_name_en": "Egyptian Center for Training",
    "title_ar": "دبلومات إدارة الأعمال والموارد البشرية بالمركز المصري",
    "title_en": "Egyptian Center — Professional HR & AI Management Programs",
    "category_ar": "تدريب إداري وتأهيل مهني",
    "category_en": "Professional Education",
    "category": "Professional Education",
    "servicesAr": "تدريب إداري وتأهيل مهني",
    "servicesEn": "Professional Education",
    "desc_ar": "حملة تعريفية وتوسيع قاعدة الملتحقين بالدبلومات المهنية المعتمدة في الموارد البشرية والذكاء الاصطناعي والإدارة.",
    "desc_en": "Academic branding and student recruitment campaign for accredited diplomas in HR, AI, and enterprise management.",
    "logo": "assets/portfolio_web/logo_egyptian-center.jpg",
    "company_logo": "assets/portfolio_web/logo_egyptian-center.jpg",
    "img": "assets/portfolio_web/cover_egyptian-center.jpg",
    "gallery": [
      "assets/portfolio_web/g_egyptian-center_1.jpg",
      "assets/portfolio_web/g_egyptian-center_2.jpg",
      "assets/portfolio_web/g_egyptian-center_3.jpg",
      "assets/portfolio_web/g_egyptian-center_4.jpg",
      "assets/portfolio_web/g_egyptian-center_5.jpg",
      "assets/portfolio_web/g_egyptian-center_6.jpg",
      "assets/portfolio_web/g_egyptian-center_7.jpg",
      "assets/portfolio_web/g_egyptian-center_8.jpg"
    ],
    "metric_val1": "850+",
    "metric_lbl1_en": "Enrolled Trainees",
    "metric_lbl1_ar": "دارس في الدبلومات",
    "metric_val2": "94%",
    "metric_lbl2_en": "Career Promotion Rate",
    "metric_lbl2_ar": "تطور وظيفي للخريجين",
    "metric_val3": "5",
    "metric_lbl3_en": "Accredited Diplomas",
    "metric_lbl3_ar": "دبلومات مهنية معتمدة"
  },
  {
    "id": "p_9",
    "slug": "badae-logistics",
    "company_name_ar": "شركة بضائع للشحن السريع",
    "company_name_en": "Badae Logistics",
    "title_ar": "شحن أسرع وتكاليف أقل لشركة بضائع للشحن واللوجستيات",
    "title_en": "Badae Logistics — E-Commerce Fast Shipping & Fulfillment",
    "category_ar": "شحن ولوجستيات",
    "category_en": "Logistics & E-Commerce",
    "category": "Logistics & E-Commerce",
    "servicesAr": "شحن ولوجستيات",
    "servicesEn": "Logistics & E-Commerce",
    "desc_ar": "استراتيجية استقطاب أصحاب المتاجر الإلكترونية والشركات للتعاقد مع شركة بضائع للشحن السريع وتأمين البضائع.",
    "desc_en": "B2B merchant acquisition campaign positioning Badae' as the reliable logistics backbone for Egyptian e-commerce stores.",
    "logo": "assets/portfolio_web/logo_badae-logistics.jpg",
    "company_logo": "assets/portfolio_web/logo_badae-logistics.jpg",
    "img": "assets/portfolio_web/cover_badae-logistics.jpg",
    "gallery": [
      "assets/portfolio_web/g_badae-logistics_1.jpg",
      "assets/portfolio_web/g_badae-logistics_2.jpg",
      "assets/portfolio_web/g_badae-logistics_3.jpg",
      "assets/portfolio_web/g_badae-logistics_4.jpg",
      "assets/portfolio_web/g_badae-logistics_5.jpg",
      "assets/portfolio_web/g_badae-logistics_6.jpg",
      "assets/portfolio_web/g_badae-logistics_7.jpg"
    ],
    "metric_val1": "120+",
    "metric_lbl1_en": "Partner Stores",
    "metric_lbl1_ar": "متجر إلكتروني متعاقد",
    "metric_val2": "45K+",
    "metric_lbl2_en": "Monthly Deliveries",
    "metric_lbl2_ar": "شحنة يتم تسليمها شهرياً",
    "metric_val3": "98.5%",
    "metric_lbl3_en": "Delivery Success",
    "metric_lbl3_ar": "نسبة تسليم ناجحة"
  },
  {
    "id": "p_10",
    "slug": "hawawshi-el-rayyan",
    "company_name_ar": "مطعم حواوشي الريان",
    "company_name_en": "Hawawshi El-Rayyan",
    "title_ar": "صناعة المحتوى الشهي ومضاعفة المبيعات لحواوشي الريان",
    "title_en": "Hawawshi El-Rayyan — Viral Food Branding & Delivery Growth",
    "category_ar": "مطاعم وأغذية",
    "category_en": "Food & Beverage (F&B)",
    "category": "Food & Beverage (F&B)",
    "servicesAr": "مطاعم وأغذية",
    "servicesEn": "Food & Beverage (F&B)",
    "desc_ar": "تصوير أطعمة احترافي ومحتوى سوشيال ميديا شهي يضاعف مبيعات الفروع وطلبات التوصيل لمطعم حواوشي الريان.",
    "desc_en": "Mouth-watering food photography, viral social content, and delivery order surge for authentic Egyptian Hawawshi.",
    "logo": "assets/portfolio_web/logo_hawawshi-el-rayyan.jpg",
    "company_logo": "assets/portfolio_web/logo_hawawshi-el-rayyan.jpg",
    "img": "assets/portfolio_web/cover_hawawshi-el-rayyan.jpg",
    "gallery": [
      "assets/portfolio_web/g_hawawshi-el-rayyan_1.jpg",
      "assets/portfolio_web/g_hawawshi-el-rayyan_2.jpg",
      "assets/portfolio_web/g_hawawshi-el-rayyan_3.jpg",
      "assets/portfolio_web/g_hawawshi-el-rayyan_4.jpg",
      "assets/portfolio_web/g_hawawshi-el-rayyan_5.jpg"
    ],
    "metric_val1": "+420%",
    "metric_lbl1_en": "Delivery Surge",
    "metric_lbl1_ar": "زيادة في طلبات التوصيل",
    "metric_val2": "1.2M+",
    "metric_lbl2_en": "Viral Food Views",
    "metric_lbl2_ar": "مشاهدة لفيديوهات الطعام",
    "metric_val3": "4.8★",
    "metric_lbl3_en": "Customer Rating",
    "metric_lbl3_ar": "تقييم جودة ومذاق الطعام"
  },
  {
    "id": "p_11",
    "slug": "sultan-almandy",
    "company_name_ar": "مطعم سلطان المندي",
    "company_name_en": "Sultan Al-Mandi",
    "title_ar": "إبراز فخامة الضيافة ومذاق المندي الأصيل لسلطان المندي",
    "title_en": "Sultan Al-Mandi — Authentic Gulf & Mandi Hospitality",
    "category_ar": "مطاعم ومأكولات شرقية وخليجية",
    "category_en": "Traditional F&B",
    "category": "Traditional F&B",
    "servicesAr": "مطاعم ومأكولات شرقية وخليجية",
    "servicesEn": "Traditional F&B",
    "desc_ar": "محتوى مرئي فاخر يبرز فخامة الضيافة وسر الطعم المدخن للمندي والحنيذ وعزائم العائلات والمناسبات.",
    "desc_en": "Premium culinary storytelling, authentic smoke-pit Mandi reels, and family banquet booking campaigns.",
    "logo": "assets/portfolio_web/logo_sultan-almandy.jpg",
    "company_logo": "assets/portfolio_web/logo_sultan-almandy.jpg",
    "img": "assets/portfolio_web/cover_sultan-almandy.jpg",
    "gallery": [
      "assets/portfolio_web/g_sultan-almandy_1.jpg",
      "assets/portfolio_web/g_sultan-almandy_2.jpg",
      "assets/portfolio_web/g_sultan-almandy_3.jpg",
      "assets/portfolio_web/g_sultan-almandy_4.jpg",
      "assets/portfolio_web/g_sultan-almandy_5.jpg",
      "assets/portfolio_web/g_sultan-almandy_6.jpg",
      "assets/portfolio_web/g_sultan-almandy_7.jpg",
      "assets/portfolio_web/g_sultan-almandy_8.jpg"
    ],
    "video_url": [
      { "url": "assets/videos/sultan_reel_1.mp4", "title_ar": "عريكة فخار ملكي", "title_en": "Royal Clay-Pot Areeka" },
      { "url": "assets/videos/sultan_reel_2.mp4", "title_ar": "بشاور ولا مندي؟", "title_en": "Peshawari vs Mandi" },
      { "url": "assets/videos/sultan_reel_3.mp4", "title_ar": "5.. 4.. 3.. والمندي عند بابك", "title_en": "Fast Doorstep Delivery" },
      { "url": "assets/videos/sultan_reel_4.mp4", "title_ar": "الطلب عبر تطبيق ذا شيفز", "title_en": "Instant The Chefz Order" },
      { "url": "assets/videos/sultan_reel_5.mp4", "title_ar": "سفرة الجمعة مع سلطان المندي", "title_en": "Friday Feast Gathering" }
    ],
    "metric_val1": "2.8M+",
    "metric_lbl1_en": "Culinary Views",
    "metric_lbl1_ar": "مشاهدة للمحتوى المرئي",
    "metric_val2": "+260%",
    "metric_lbl2_en": "Banquet Orders",
    "metric_lbl2_ar": "زيادة في حجوزات الولائم",
    "metric_val3": "60+",
    "metric_lbl3_en": "Creative Assets",
    "metric_lbl3_ar": "محتوى وتصميم وفيديو"
  },
  {
    "id": "p_12",
    "slug": "doaa-pharmacy",
    "company_name_ar": "صيدلية د. دعاء",
    "company_name_en": "Doaa Pharmacy",
    "title_ar": "هوية ورعاية صحية متكاملة لصيدلية د. دعاء",
    "title_en": "Doaa Pharmacy — Trusted Community Healthcare & Delivery",
    "category_ar": "صيدليات ورعاية صحية",
    "category_en": "Healthcare & Pharmaceuticals",
    "category": "Healthcare & Pharmaceuticals",
    "servicesAr": "صيدليات ورعاية صحية",
    "servicesEn": "Healthcare & Pharmaceuticals",
    "desc_ar": "حملات توعوية لصحة الأسرة والعظام والعناية بالبشرة مع الترويج لخدمة توصيل الأدوية والاستشارات على مدار الساعة.",
    "desc_en": "Community health awareness, skincare consultation promos, and 24/7 fast medicine delivery campaigns.",
    "logo": "assets/portfolio_web/logo_doaa-pharmacy.jpg",
    "company_logo": "assets/portfolio_web/logo_doaa-pharmacy.jpg",
    "img": "assets/portfolio_web/cover_doaa-pharmacy.jpg",
    "gallery": [
      "assets/portfolio_web/g_doaa-pharmacy_1.jpg",
      "assets/portfolio_web/g_doaa-pharmacy_2.jpg",
      "assets/portfolio_web/g_doaa-pharmacy_3.jpg",
      "assets/portfolio_web/g_doaa-pharmacy_4.jpg",
      "assets/portfolio_web/g_doaa-pharmacy_5.jpg"
    ],
    "metric_val1": "+310%",
    "metric_lbl1_en": "Delivery Surge",
    "metric_lbl1_ar": "نمو في طلبات التوصيل",
    "metric_val2": "8.5K+",
    "metric_lbl2_en": "Families Served",
    "metric_lbl2_ar": "أسرة مستفيدة من الخدمة",
    "metric_val3": "100%",
    "metric_lbl3_en": "Trust Index",
    "metric_lbl3_ar": "مؤشر الثقة الطبية"
  },
  {
    "id": "p_13",
    "slug": "fish-day",
    "company_name_ar": "مطعم يوم السمك للمأكولات البحرية",
    "company_name_en": "Fish Day",
    "title_ar": "هوية وتجربة طعام بحرية استثنائية لمطعم يوم السمك",
    "title_en": "Fish Day — Fresh Seafood Experience & Ocean Delicacies",
    "category_ar": "مطاعم أسماك ومأكولات بحرية",
    "category_en": "Seafood & Dining",
    "category": "Seafood & Dining",
    "servicesAr": "مطاعم أسماك ومأكولات بحرية",
    "servicesEn": "Seafood & Dining",
    "desc_ar": "حملة إبداعية تعكس طزاجة الأسماك اليومية وسر الخلطة الخاصة وعزائم المأكولات البحرية الفاخرة للويكند.",
    "desc_en": "Comprehensive culinary campaign capturing fresh daily catches, secret spice blends, and weekend family seafood feasts.",
    "logo": "assets/portfolio_web/logo_fish-day.jpg",
    "company_logo": "assets/portfolio_web/logo_fish-day.jpg",
    "img": "assets/portfolio_web/cover_fish-day.jpg",
    "gallery": [
      "assets/portfolio_web/g_fish-day_1.jpg",
      "assets/portfolio_web/g_fish-day_2.jpg",
      "assets/portfolio_web/g_fish-day_3.jpg",
      "assets/portfolio_web/g_fish-day_4.jpg",
      "assets/portfolio_web/g_fish-day_5.jpg",
      "assets/portfolio_web/g_fish-day_6.jpg",
      "assets/portfolio_web/g_fish-day_7.jpg",
      "assets/portfolio_web/g_fish-day_8.jpg"
    ],
    "video_url": [
      { "url": "assets/videos/fishday_reel_1.mp4", "title_ar": "تشكيلة مأكولات بحرية فاخرة", "title_en": "Artisan Seafood Platter" },
      { "url": "assets/videos/fishday_reel_2.mp4", "title_ar": "قرمشة تسمعها بالعين", "title_en": "Golden Crispy Catch" },
      { "url": "assets/videos/fishday_reel_3.mp4", "title_ar": "دنيس السوبريم الطازج", "title_en": "Fresh Supreme Sea Bream" },
      { "url": "assets/videos/fishday_reel_4.mp4", "title_ar": "الطزاجة تبان من عينه", "title_en": "Peak Ocean Freshness" },
      { "url": "assets/videos/fishday_reel_5.mp4", "title_ar": "الهامور.. ملك السفرة!", "title_en": "King Grouper Signature Dish" }
    ],
    "metric_val1": "3.4M+",
    "metric_lbl1_en": "Total Reach",
    "metric_lbl1_ar": "إجمالي الوصول الرقمي",
    "metric_val2": "+180%",
    "metric_lbl2_en": "Dine-In Growth",
    "metric_lbl2_ar": "نمو في حجوزات المطعم",
    "metric_val3": "75+",
    "metric_lbl3_en": "Visual Assets & Reels",
    "metric_lbl3_ar": "تصميم ومقطع فيديو"
  }
];

  setTimeout(() => {
    if (!window._circleShowcaseBuilt) {
      buildGoldenCircleShowcase((window.dynamicPortfolio && window.dynamicPortfolio.length) ? window.dynamicPortfolio : FALLBACK_13_PROJECTS);
    }
  }, 500);

  function buildGoldenCircleShowcase(projectsData) {
    window._circleShowcaseBuilt = true;
    const stage = document.getElementById('circles');
    if (!stage) return;

    if (window._circleAutoTimer) {
      clearInterval(window._circleAutoTimer);
    }

    const prevBtn = document.getElementById('circlesPrevBtn');
    const nextBtn = document.getElementById('circlesNextBtn');

    if (!projectsData || !projectsData.length) {
      const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar') || document.documentElement.lang === 'ar';
      stage.innerHTML = `
        <div style="grid-column: 1 / -1; width:100%; text-align:center; padding: 4rem 1.5rem; color: var(--text2);">
          <div style="font-size:2.5rem; margin-bottom: 1rem;">✨</div>
          <h3 style="color:var(--white); font-size:1.4rem; margin-bottom:0.5rem;">${isAr ? 'أعمالنا الإبداعية الجديدة قريباً' : 'New Creative Projects Coming Soon'}</h3>
          <p style="font-size:0.95rem; max-width:450px; margin:0 auto;">${isAr ? 'نقوم حالياً بتجهيز وإضافة دراسات الحالة والمشاريع الجديدة.' : 'We are currently uploading and preparing our latest case studies and agency works.'}</p>
        </div>
      `;
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    if (prevBtn) prevBtn.style.display = '';
    if (nextBtn) nextBtn.style.display = '';

    let rawProjects = [...projectsData];
    let projects = [...rawProjects];
    while (projects.length > 0 && projects.length < 5) {
      projects = projects.concat(rawProjects);
    }

    const circleConfig = [
      { num: "05", size: "far", slotIdx: 0 },
      { num: "03", size: "near", slotIdx: 1 },
      { num: "01", size: "featured", slotIdx: 2 },
      { num: "02", size: "near", slotIdx: 3 },
      { num: "04", size: "far", slotIdx: 4 }
    ];

    function render() {
      stage.innerHTML = '';
      const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar') || document.documentElement.lang === 'ar';

      circleConfig.forEach((cfg) => {
        const p = projects[cfg.slotIdx % projects.length];
        if (!p) return;

        const card = document.createElement('div');
        card.className = `circle-card-item ${cfg.size}`;

        let logoUrl = p.company_logo || p.logo || p.logo_url || p.orb_image || p.img || p.clientLogo || 'assets/uploads/bebek-logo.png';
        logoUrl = fixMediaUrl(logoUrl);

        const titleStr = isAr
          ? (p.company_name_ar || p.titleAr || p.title_ar || p.title || p.client || 'علامة تجارية')
          : (p.company_name_en || p.titleEn || p.title_en || p.title || p.client || 'Creative Brand');

        const servicesStr = isAr
          ? (p.servicesAr || p.services || p.tagsAr || p.categoryAr || 'هوية بصرية • سوشيال ميديا')
          : (p.servicesEn || p.services || p.tagsEn || p.categoryEn || 'Branding • Social Media');

        card.innerHTML = `
          <div class="circle-box ${p.light ? 'light' : ''}">
            <div class="badge">${cfg.num}</div>
            <img src="${logoUrl}" alt="${escapeHtml(titleStr)}" class="circle-brand-img" onerror="if(!this.dataset.errored){this.dataset.errored='1'; this.src='assets/uploads/bebek-logo.png';}" />
          </div>
          <div class="circle-info-body">
            <h3 class="circle-title">${escapeHtml(titleStr)}</h3>
            <div class="circle-services">${escapeHtml(servicesStr)}</div>
            <a class="circle-cta-btn" href="#">View Case Study ↗</a>
          </div>
        `;

        card.addEventListener('click', (e) => {
          if (e.target.closest('.circle-cta-btn')) {
            e.preventDefault();
            openCaseStudy(p);
            return;
          }
          if (cfg.size !== 'featured') {
            const shiftCount = cfg.slotIdx - 2;
            if (shiftCount > 0) {
              for (let s = 0; s < shiftCount; s++) projects.push(projects.shift());
            } else if (shiftCount < 0) {
              for (let s = 0; s < Math.abs(shiftCount); s++) projects.unshift(projects.pop());
            }
            render();
          } else {
            openCaseStudy(p);
          }
        });

        stage.appendChild(card);
      });
    }

    render();

    function nextSlide() {
      projects.push(projects.shift());
      render();
    }

    function prevSlide() {
      projects.unshift(projects.pop());
      render();
    }

    if (nextBtn) {
      nextBtn.style.display = 'flex';
      nextBtn.onclick = (e) => {
        if (e) e.preventDefault();
        nextSlide();
      };
    }
    if (prevBtn) {
      prevBtn.style.display = 'flex';
      prevBtn.onclick = (e) => {
        if (e) e.preventDefault();
        prevSlide();
      };
    }

    // Fixed constant auto-rotate speed for all projects (5.5 seconds = 5500ms)
    if (window._circleAutoTimer) clearInterval(window._circleAutoTimer);
    window._circleAutoTimer = setInterval(nextSlide, 5500);

    stage.addEventListener('mouseenter', () => clearInterval(window._circleAutoTimer));
    stage.addEventListener('mouseleave', () => {
      if (window._circleAutoTimer) clearInterval(window._circleAutoTimer);
      window._circleAutoTimer = setInterval(nextSlide, 5500);
    });
  }

// Global Open Case Study Navigation
function openCaseStudy(p) {
  if (!p) return;
  let projectObj = (typeof p === 'object') ? p : null;
  if (!projectObj && (typeof p === 'string' || typeof p === 'number')) {
    const allProjects = window.dynamicPortfolio || (typeof FALLBACK_13_PROJECTS !== 'undefined' ? FALLBACK_13_PROJECTS : []);
    projectObj = allProjects.find(proj => String(proj.id) === String(p) || String(proj.slug) === String(p));
  }
  const targetSlug = projectObj?.slug || (projectObj?.company_name_en ? projectObj.company_name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : (projectObj?.id || p));
  if (targetSlug && targetSlug !== 'undefined') {
    window.location.href = `case-study.html?slug=${encodeURIComponent(targetSlug)}`;
  }
}

/* ============================================
   TEAM SECTION RENDERER (CMS Controlled)
   ============================================ */
function renderTeamSection(teamData, isEnabled = 1) {
  const teamSection = document.getElementById('team');
  const navLinks    = document.querySelectorAll('a[href="#team"]');

  // Filter only active members (active !== 0 and active !== '0')
  const activeMembers = (teamData || []).filter(m => m.active !== 0 && m.active !== '0');

  const shouldShow = (Number(isEnabled) !== 0) && activeMembers.length > 0;

  // 1. Show or hide team section in public DOM
  if (teamSection) {
    teamSection.style.display = shouldShow ? '' : 'none';
  }

  // 2. Show or hide #team links in header and mobile drawer
  navLinks.forEach(link => {
    const parentLi = link.closest('li');
    if (parentLi) {
      parentLi.style.display = shouldShow ? '' : 'none';
    } else {
      link.style.display = shouldShow ? '' : 'none';
    }
  });

  if (!shouldShow) return;

  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';

  grid.innerHTML = activeMembers.map(m => {
    const nameStr = (lang === 'ar' && m.name_ar) ? m.name_ar : (m.name || '');
    const roleEn  = m.role_en || m.roleEn || '';
    const roleAr  = m.role_ar || m.roleAr || '';
    const roleStr = (lang === 'ar' && roleAr) ? roleAr : roleEn;

    return `
      <article class="team-card" aria-label="${nameStr}">
        <div class="team-card-img">
          <img src="${m.img || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}"
               alt="${nameStr}"
               loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'" />
        </div>
        <div class="team-card-info">
          <div class="team-card-name">${nameStr}</div>
          <div class="team-card-role" data-role-en="${roleEn}" data-role-ar="${roleAr}">
            ${roleStr}
          </div>
        </div>
      </article>`;
  }).join('');

  // Observe for scroll-reveal
  if (typeof IntersectionObserver !== 'undefined') {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.team-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      obs.observe(card);
    });
  }
}

/* ============================================
   CLIENTS MARQUEE / SUCCESS PARTNERS ENGINE
   Automatically syncs portfolio company names
   (company_name_en in EN, company_name_ar in AR)
   ============================================ */
function renderClientsMarquee(lang) {
  const track = document.getElementById('clientsTrack');
  if (!track) return;
  const activeLang = lang || (typeof currentLang !== 'undefined' ? currentLang : 'en');
  const isAr = (activeLang === 'ar');

  const namesSet = new Set();

  // 1. From Dynamic Portfolio Projects (Cases)
  if (Array.isArray(window.dynamicPortfolio) && window.dynamicPortfolio.length) {
    window.dynamicPortfolio.forEach(item => {
      let name = isAr
        ? (item.company_name_ar || item.title_ar || item.company_name_en || item.client)
        : (item.company_name_en || item.title_en || item.client || item.company_name_ar);
      if (name && String(name).trim()) namesSet.add(String(name).trim());
    });
  }

  // 2. From Dynamic Clients CMS list
  if (Array.isArray(window.dynamicClients) && window.dynamicClients.length) {
    window.dynamicClients.forEach(c => {
      let name = isAr
        ? (c.name_ar || c.name || c.name_en)
        : (c.name_en || c.name || c.name_ar);
      if (name && String(name).trim()) namesSet.add(String(name).trim());
    });
  }

  let names = Array.from(namesSet);
  if (!names.length) {
    names = isAr
      ? ['جوجل', 'فودافون', 'أمازون', 'بيبيك', 'مايكروسوفت', 'سبوتيفاي', 'نايل ريتيل', 'لوكس بروبرتيز']
      : ['Google', 'Vodafone', 'Amazon', 'Bebek', 'Microsoft', 'Spotify', 'Nile Retail', 'Luxe Properties'];
  }

  // Multiply items for smooth infinite loop
  const items = [...names, ...names, ...names, ...names];
  track.innerHTML = items.map(n => `
    <div class="cl-item" title="${escapeHtml(n)}">
      <span class="client-name-badge">${escapeHtml(n.toUpperCase())}</span>
    </div>
  `).join('');
}
window.renderClientsMarquee = renderClientsMarquee;

/* ============================================
   TESTIMONIALS DYNAMIC RENDERER (from CMS)
   ============================================ */
function renderTestimonialsFromCMS(testimonials, activeLang) {
  const track = document.getElementById('testiTrack');
  const dots  = document.getElementById('testiDots');
  if (!track || !testimonials || !testimonials.length) return;

  const currentL = activeLang || (typeof currentLang !== 'undefined' ? currentLang : 'en');
  const isAr  = currentL === 'ar' || document.documentElement.lang === 'ar' || document.body.classList.contains('rtl');

  track.innerHTML = testimonials.map((t, i) => {
    const initials = (t.author || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['linear-gradient(135deg,#FFB800,#FF6B00)', 'linear-gradient(135deg,#00b894,#00cec9)',
                    'linear-gradient(135deg,#a29bfe,#6c5ce7)', 'linear-gradient(135deg,#fd79a8,#e84393)'];
    const stars = '★'.repeat(Math.min(5, parseInt(t.rating) || 5));
    const quote = isAr
      ? (t.quote_ar || t.quoteAr || t.quote_en || t.quoteEn || t.quote || '')
      : (t.quote_en || t.quoteEn || t.quote_ar || t.quoteAr || t.quote || '');
    const position = isAr
      ? (t.position_ar || t.positionAr || t.position_en || t.positionEn || '')
      : (t.position_en || t.positionEn || t.position_ar || t.positionAr || '');
    const company = t.company || '';
    const subTitle = [position, company].filter(Boolean).join(' • ');

    return `
      <blockquote class="testi-card${i === 0 ? ' active' : ''}" id="testi-${i}">
        <div class="testi-stars" aria-label="${parseInt(t.rating) || 5} out of 5 stars">${stars}</div>
        <p>"${escapeHtml(quote)}"</p>
        <footer>
          <div class="testi-avatar" style="background:${colors[i % colors.length]}">${escapeHtml(initials)}</div>
          <div>
            <cite class="testi-name">${escapeHtml(t.author || '')}</cite>
            <span class="testi-co">${escapeHtml(subTitle)}</span>
          </div>
        </footer>
      </blockquote>`;
  }).join('');

  if (dots) {
    dots.innerHTML = testimonials.map((_, i) => `
      <button class="t-dot${i === 0 ? ' active' : ''}"
              role="tab"
              aria-selected="${i === 0}"
              aria-controls="testi-${i}"
              data-i="${i}"
              aria-label="Testimonial ${i + 1}"></button>`).join('');
  }

  currentTestiIndex = 0;
  if (typeof updateTestimonialView === 'function') {
    updateTestimonialView(0);
  }
  if (typeof bindTestimonialsButtons === 'function') {
    bindTestimonialsButtons();
  }
  if (typeof startTestimonialAutoTimer === 'function') {
    startTestimonialAutoTimer();
  }
}
window.renderTestimonialsFromCMS = renderTestimonialsFromCMS;

/* ============================================
   SERVICES DYNAMIC RENDERER (from CMS)
   ============================================ */
function renderServicesFromCMS(services, activeLang) {
  const grid = document.querySelector('.services-grid');
  if (!grid || !services || !services.length) return;
  const currentL = activeLang || (typeof currentLang !== 'undefined' ? currentLang : 'en');
  const isAr = (currentL === 'ar');

  const SVG_ICONS = {
    'palette': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.71 1.7-1.63 0-.44-.18-.85-.46-1.15-.27-.31-.44-.71-.44-1.17 0-.92.78-1.67 1.7-1.67h2.5c3.31 0 6-2.69 6-6 0-4.96-4.49-9-11-9z"/></svg>',
    'trending-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    'share-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    'video': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    'layout': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    'users': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'default': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  };

  grid.innerHTML = services.map((s, idx) => {
    const name  = isAr && s.name_ar ? s.name_ar : (s.name_en || s.name || '');
    const desc  = isAr && s.desc_ar ? s.desc_ar : (s.desc_en || s.desc || '');
    const badge = isAr && s.badge_ar ? s.badge_ar : (s.badge_en || s.badge || '');
    const cta   = isAr && s.cta_text_ar ? s.cta_text_ar : (s.cta_text_en || (isAr ? 'استكشف الخدمة ←' : 'Explore Service →'));
    const num   = String(idx + 1).padStart(2, '0');
    const isFeatured = Boolean(s.featured || badge);

    let iconMarkup = SVG_ICONS['default'];
    if (s.icon_svg && s.icon_svg.trim().startsWith('<svg')) {
      iconMarkup = s.icon_svg.trim();
    } else if (s.icon_svg && SVG_ICONS[s.icon_svg.trim().toLowerCase()]) {
      iconMarkup = SVG_ICONS[s.icon_svg.trim().toLowerCase()];
    }

    return `
      <article class="svc-card ${isFeatured ? 'featured' : ''}" id="svc-${s.id}">
        ${badge ? `<div class="svc-badge">${badge}</div>` : ''}
        <div class="svc-num">${num}</div>
        <div class="svc-icon" aria-hidden="true">${iconMarkup}</div>
        <h3>${name}</h3>
        <p>${desc}</p>
        <a href="${s.cta_url || '#contact'}" class="svc-link">${cta}</a>
      </article>`;
  }).join('');
}
window.renderServicesFromCMS = renderServicesFromCMS;

console.log(
  '%c ⚡ EGYPT MARKETING AGENCY ⚡ ',
  'background:#FFB800;color:#0A0A0A;font-size:14px;font-weight:900;padding:10px 20px;border-radius:8px;letter-spacing:2px;'
);
