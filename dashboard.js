/**
 * Egypt Creative — Enterprise Control Panel & CRM (v5.5)
 * 100% Inline View Architecture (Zero Modal/Popup UI Dependencies)
 * Real Analytics, WhatsApp Leads Tracking, RBAC & Security Management
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE = (window.location.protocol === 'file:' || window.location.port === '3000' || window.location.port === '8080')
    ? 'http://localhost:3000/api'
    : 'api.php';

  // --- AUTH GUARD (HttpOnly Cookie-based) + CSRF Protection ---
  let currentUserRole = 'admin';
  let currentUserEmail = '';
  let csrfToken = '';
  let sessionInitialized = false;
  let sessionInitPromise = null;

  // Intercept fetch calls to include X-CSRF-Token header on all API requests
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    options = options || {};
    options.credentials = 'include';
    const method = (options.method || 'GET').toUpperCase();

    // Guarantee session & CSRF initialization before sending any mutating request
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && !sessionInitialized && sessionInitPromise) {
      await sessionInitPromise;
    }

    if (csrfToken && typeof url === 'string' && (url.includes('api.php') || url.includes('/api'))) {
      options.headers = options.headers || {};
      if (options.headers instanceof Headers) {
        if (!options.headers.has('X-CSRF-Token')) {
          options.headers.set('X-CSRF-Token', csrfToken);
        }
      } else {
        if (!options.headers['X-CSRF-Token']) {
          options.headers['X-CSRF-Token'] = csrfToken;
        }
      }
    }
    return originalFetch.call(this, url, options);
  };

  function dismissDashboardSplash() {
    const splash = document.getElementById('dashboardSplash');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 400);
    }
  }

  // Async auth check with smooth splash transition
  sessionInitPromise = (async () => {
    try {
      const dashboardApp = document.getElementById('dashboardApp');
      const splashStatus = document.getElementById('splashStatusText');

      // 1. Check if initial setup is required
      const setupRes = await fetch(`${API_BASE}?action=check_setup_status&_t=${Date.now()}`).then(r => r.json()).catch(() => null);
      if (setupRes && setupRes.first_run) {
        if (splashStatus) splashStatus.textContent = 'جاري التوجيه للإعداد الأولي...';
        window.location.replace('admin.html');
        return;
      }

      // 2. Verify logged-in session
      const authRes = await fetch(`${API_BASE}?action=verify_session&_t=${Date.now()}`, { credentials: 'include' }).then(r => r.json()).catch(() => null);

      if (!authRes || authRes.authenticated !== true) {
        if (splashStatus) splashStatus.textContent = 'جاري التحويل لصفحة الدخول...';
        window.location.replace('admin.html');
        return;
      }

      // Reveal Dashboard UI only for verified authenticated users
      document.body.classList.add('is-authenticated');
      if (dashboardApp) {
        dashboardApp.style.display = '';
      }
      dismissDashboardSplash();

      csrfToken = authRes.csrf_token || '';
      sessionInitialized = true;

      currentUserRole  = authRes.role || 'viewer';
      currentUserEmail = authRes.email || '';

      if (adminRoleBadge) adminRoleBadge.textContent = currentUserRole.replace('_', ' ').toUpperCase();
      if (tabUsersNav) tabUsersNav.hidden = (currentUserRole !== 'super_admin');
      if (tabEmailNav) tabEmailNav.hidden = (currentUserRole !== 'super_admin');

      await fetchData();
      fetchDashboardStats();
      fetchAnalytics('7days');
      fetchWhatsAppLeads();
      fetchMedia();
    } catch (e) {
      const splashStatus = document.getElementById('splashStatusText');
      if (splashStatus) splashStatus.textContent = 'جاري التحويل لصفحة الدخول...';
      window.location.replace('admin.html');
    }
  })();

  // --- GLOBAL STATE ---
  let activePickerField = null;
  let chartVisitors = null, chartSources = null, chartDevices = null, chartPages = null;
  let appData = {
    clients: [], portfolio: [], team: [], testimonials: [], services: [],
    navigation: [], media: [], inquiries: [], whatsappLeads: [], users: [],
    seo: {}, settings: {}, hero: {}, stats: {}, about: {}
  };

  // --- HELPER: ESCAPE HTML ---
  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str).replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
    );
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) {
      el.value = val || '';
      try {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (_) {}
    }
  }

  // --- DOM REFS ---
  const adminRoleBadge = document.getElementById('adminRoleBadge');
  const tabUsersNav    = document.getElementById('tabUsersNav');
  const tabEmailNav    = document.getElementById('tabEmailNav');
  const logoutBtn      = document.getElementById('logoutBtn');
  const refreshDataBtn = document.getElementById('refreshDataBtn');
  const toast          = document.getElementById('toast');
  const pageTitle      = document.getElementById('pageTitle');
  const pageDesc       = document.getElementById('pageDesc');

  // Role badge and SA tabs are hidden by default; verify_session above updates them.
  if (adminRoleBadge) adminRoleBadge.textContent = '';
  if (tabUsersNav) tabUsersNav.hidden = true;
  if (tabEmailNav) tabEmailNav.hidden = true;

  // --- LOGOUT HANDLER ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e?.preventDefault?.();
      try {
        await fetch(`${API_BASE}?action=logout`, { credentials: 'include', method: 'POST' });
        await fetch(`${API_BASE}?action=logout`, { credentials: 'include', method: 'GET' });
      } catch (_) {}
      sessionStorage.clear();
      localStorage.clear();
      document.cookie = 'egypt_admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.replace('admin.html?logged_out=1');
    });
  }

  if (refreshDataBtn) {
    refreshDataBtn.addEventListener('click', () => {
      showToast('Refreshing dashboard data...');
      fetchData();
      fetchDashboardStats();
      fetchWhatsAppLeads();
    });
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    toast.style.display = 'block';
    setTimeout(() => { toast.hidden = true; toast.style.display = 'none'; }, 3500);
  }

  // --- TAB NAVIGATION SYSTEM ---
  const navTabs     = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  const tabTitles = {
    dashboard: ['Dashboard Overview', 'Real-time agency KPIs, traffic statistics, lead funnel, and recent system activity.'],
    analytics: ['Website Analytics', 'Visitor trends, device breakdown, traffic sources, and most visited pages.'],
    'all-leads': ['All Leads Feed', 'Combined CRM feed of all WhatsApp clicks and Contact form submissions.'],
    'whatsapp-leads': ['WhatsApp Leads Tracking', 'Track and manage every visitor WhatsApp click interaction.'],
    inquiries: ['Contact Form Submissions', 'Lead submissions inbox received directly from the contact form.'],
    pages: ['Page Management', 'Edit headlines, subtext, and content for Home, About, Services, and Contact.'],
    services: ['Services Management', 'Add, edit, delete, and reorder agency services.'],
    process: ['Process Steps Management', 'Manage agency 4-step workflow and descriptions.'],
    navigation: ['Navigation Links', 'Manage site header navigation items.'],
    portfolio: ['Portfolio Showcase', 'Add, edit, and organize portfolio project case studies.'],
    clients: ['Clients & Logos', 'Manage brand logos for the homepage logo marquee.'],
    team: ['Team Members', 'Manage agency team profiles and social links.'],
    testimonials: ['Client Reviews', 'Manage client testimonials, quotes, and ratings.'],
    'footer-social': ['Footer & Social Links', 'Manage footer company info, social links, and copyrights.'],
    media: ['Media Library', 'Upload, preview, and organize image files.'],
    seo: ['SEO & Meta Settings', 'Configure page titles, meta descriptions, and OpenGraph tags.'],
    settings: ['Site Settings', 'Configure website theme colors and admin passwords.'],
    'email-security': ['Email & Security Configuration', 'Manage primary security notification email and SMTP server credentials.'],
    'tracking-settings': ['WhatsApp & Tracking Setup', 'Configure global WhatsApp tracking parameters.'],
    users: ['User Accounts', 'Manage admin accounts and access permissions.']
  };

  // --- MOBILE SIDEBAR TOGGLE ---
  const sidebarToggle   = document.getElementById('sidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const adminSidebar    = document.querySelector('.admin-sidebar');

  function closeMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', () => {
      adminSidebar.classList.toggle('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active', adminSidebar.classList.contains('open'));
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      closeMobileSidebar();
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const name = tab.dataset.tab;
      const el = document.getElementById(`tab-${name}`);
      if (el) el.classList.add('active');

      // Sync mobile bottom navigation active state
      const mobButtons = document.querySelectorAll('.mob-tab-btn[data-mob-tab]');
      mobButtons.forEach(b => b.classList.toggle('active', b.dataset.mobTab === name));

      if (tabTitles[name]) {
        if (pageTitle) pageTitle.textContent = tabTitles[name][0];
        if (pageDesc)  pageDesc.textContent  = tabTitles[name][1];
      }

      if (name === 'media') {
        fetchMedia();
      }

      if (name === 'pages') {
        populatePageForms();
      }

      resetSectionViews();
    });
  });

  function resetSectionViews() {
    showView('usersListView', 'userFormView');
    showView('servicesListView', 'serviceFormView');
    showView('navListView', 'navFormView');
    showView('portfolioListView', 'projectFormView');
    showView('clientsListView', 'clientFormView');
    showView('teamListView', 'teamFormView');
    showView('testiListView', 'testiFormView');
    showView('waLeadsListView', 'waLeadEditView');
  }

  function showView(showId, hideId) {
    const showEl = document.getElementById(showId);
    const hideEl = document.getElementById(hideId);
    if (showEl) { showEl.hidden = false; showEl.style.display = 'block'; }
    if (hideEl) { hideEl.hidden = true; hideEl.style.display = 'none'; }
  }

  // --- DASHBOARD KPI & FUNNEL ---
  async function fetchDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}?action=get_dashboard_stats`, { credentials: 'include', 
        headers: {  }
      }).then(r => r.json());

      if (res && res.success) {
        if (document.getElementById('kpiTotalVisitors'))  document.getElementById('kpiTotalVisitors').textContent  = (res.total_visitors || 0).toLocaleString();
        if (document.getElementById('kpiUniqueVisitors')) document.getElementById('kpiUniqueVisitors').textContent = (res.unique_visitors || 0).toLocaleString();
        if (document.getElementById('kpiVisitorsToday'))  document.getElementById('kpiVisitorsToday').textContent  = (res.visitors_today || 0).toLocaleString();
        if (document.getElementById('kpiVisitorsWeek'))   document.getElementById('kpiVisitorsWeek').textContent   = (res.visitors_week || 0).toLocaleString();
        if (document.getElementById('kpiVisitorsMonth'))  document.getElementById('kpiVisitorsMonth').textContent  = (res.visitors_month || 0).toLocaleString();
        if (document.getElementById('kpiTotalLeads'))     document.getElementById('kpiTotalLeads').textContent     = (res.total_leads || 0).toLocaleString();
        if (document.getElementById('kpiNewLeads'))       document.getElementById('kpiNewLeads').textContent       = (res.new_leads || 0).toLocaleString();
        if (document.getElementById('kpiWaClicks'))       document.getElementById('kpiWaClicks').textContent       = (res.whatsapp_clicks || 0).toLocaleString();
        if (document.getElementById('kpiWaLeads'))        document.getElementById('kpiWaLeads').textContent        = (res.whatsapp_leads || 0).toLocaleString();
        if (document.getElementById('kpiContactLeads'))   document.getElementById('kpiContactLeads').textContent   = (res.contact_leads || 0).toLocaleString();
        if (document.getElementById('kpiProjects'))       document.getElementById('kpiProjects').textContent       = (res.portfolio_count || 0).toLocaleString();
        if (document.getElementById('kpiAdminUsers'))     document.getElementById('kpiAdminUsers').textContent     = (res.admin_users || 0).toLocaleString();

        const waBadge  = document.getElementById('waBadge');
        const inqBadge = document.getElementById('inqBadge');
        if (waBadge)  { waBadge.textContent  = res.whatsapp_leads || 0; waBadge.hidden  = !res.whatsapp_leads; }
        if (inqBadge) { inqBadge.textContent = res.new_leads || 0;      inqBadge.hidden = !res.new_leads; }

        // Update mobile bottom bar badge
        const mobBadge = document.getElementById('mobBadgeLeads');
        const pendingCount = (Number(res.new_leads) || 0) + (Number(res.whatsapp_leads) || 0);
        if (mobBadge) {
          mobBadge.textContent = pendingCount;
          mobBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
        }

        // Real-time audio alert & browser notification on new lead
        const currentTotal = (Number(res.total_leads) || 0) + (Number(res.whatsapp_clicks) || 0);
        if (typeof window.previousLeadsTotal === 'number' && currentTotal > window.previousLeadsTotal) {
          const diff = currentTotal - window.previousLeadsTotal;
          playLeadAlertChime();
          showToast(`⚡ ${diff} new lead interaction received!`);
          showBrowserNotification('Egypt Creative — New Lead!', `You received ${diff} new lead(s). Tap to open CRM.`);
        }
        window.previousLeadsTotal = currentTotal;

        const fn = res.funnel || {};
        if (document.getElementById('fnVisitors'))     document.getElementById('fnVisitors').textContent     = (fn.visitors || 0).toLocaleString();
        if (document.getElementById('fnInteractions')) document.getElementById('fnInteractions').textContent = (fn.interactions || 0).toLocaleString();
        if (document.getElementById('fnContacted'))    document.getElementById('fnContacted').textContent    = (fn.contacted || 0).toLocaleString();
        if (document.getElementById('fnQualified'))    document.getElementById('fnQualified').textContent    = (fn.qualified || 0).toLocaleString();
        if (document.getElementById('fnConverted'))    document.getElementById('fnConverted').textContent    = (fn.converted || 0).toLocaleString();

        renderActivityFeed(res.recent_activity || []);
        renderTopPagesTable(res.top_pages || [], res.total_visitors || 1);
      }
    } catch (e) { console.warn('Dashboard stats error', e); }
  }

  function renderActivityFeed(logs) {
    const feed = document.getElementById('dashActivityFeed');
    if (!feed) return;
    if (!logs.length) {
      feed.innerHTML = `<p style="color:var(--text2); font-size:0.85rem;">No recent system activity recorded.</p>`;
      return;
    }
    feed.innerHTML = logs.map(l => `
      <div class="activity-item">
        <span class="act-icon">${l.icon || '⚡'}</span>
        <span class="act-text">${escapeHtml(l.activity)}</span>
        <span class="act-time">${escapeHtml(l.created_at || '')}</span>
      </div>`).join('');
  }

  function renderTopPagesTable(pages, totalVisits) {
    const tbody = document.getElementById('dashTopPagesTable');
    if (!tbody) return;
    if (!pages || !pages.length) {
      tbody.innerHTML = `<tr><td colspan="3" style="color:var(--text2); text-align:center;">No visit data collected yet.</td></tr>`;
      return;
    }
    const sumViews = pages.reduce((acc, curr) => acc + (Number(curr.views) || 0), 0);
    const denominator = Math.max(sumViews, Number(totalVisits) || 1);

    tbody.innerHTML = pages.map(p => {
      const views = Number(p.views) || 0;
      const pct = Math.min(100, Math.round((views / denominator) * 100));
      return `<tr>
        <td><strong style="color:#fff;">${escapeHtml(p.page)}</strong></td>
        <td>${views.toLocaleString()} views</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; background:var(--surface2); height:6px; border-radius:4px; overflow:hidden;">
              <div style="width:${pct}%; background:var(--gold); height:100%;"></div>
            </div>
            <span style="font-size:0.75rem; color:var(--text2); font-weight:700;">${pct}%</span>
          </div>
        </td></tr>`;
    }).join('');
  }

  // --- CHART.JS ANALYTICS ENGINE ---
  async function fetchAnalytics(range = '7days') {
    try {
      const res = await fetch(`${API_BASE}?action=get_analytics&range=${range}`, { credentials: 'include', 
        headers: {  }
      }).then(r => r.json());
      if (res && res.success) {
        renderVisitorsChart(res.visits_over_time || [], res.leads_over_time || []);
        renderSourcesChart(res.traffic_sources || []);
        renderDevicesChart(res.devices || []);
        renderPageviewsChart(res.top_pages || []);
      }
    } catch (e) { console.warn('Analytics error', e); }
  }

  function renderVisitorsChart(visits, leads) {
    const ctx = document.getElementById('chartVisitorsOverTime');
    if (!ctx) return;
    if (chartVisitors) chartVisitors.destroy();
    const labels = visits.map(v => v.day);
    const leadMap = {}; leads.forEach(l => leadMap[l.day] = l.leads);
    chartVisitors = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [
          { label: 'Visitors', data: visits.map(v => v.visits), borderColor: '#FFB800', backgroundColor: 'rgba(255,184,0,0.1)', fill: true, tension: 0.3 },
          { label: 'Leads', data: labels.map(d => leadMap[d] || 0), borderColor: '#00B4D8', backgroundColor: 'rgba(0,180,216,0.1)', fill: true, tension: 0.3 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94A3B8' } } },
        scales: {
          x: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });
  }

  function renderSourcesChart(sources) {
    const ctx = document.getElementById('chartTrafficSources');
    if (!ctx) return;
    if (chartSources) chartSources.destroy();
    chartSources = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: sources.length ? sources.map(s => s.source || 'Direct') : ['Direct'],
        datasets: [{ data: sources.length ? sources.map(s => s.count) : [1], backgroundColor: ['#FFB800','#00B4D8','#7C3AED','#10B981','#EF4444','#64748B'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94A3B8' } } } }
    });
  }

  function renderDevicesChart(devices) {
    const ctx = document.getElementById('chartDevices');
    if (!ctx) return;
    if (chartDevices) chartDevices.destroy();
    chartDevices = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: devices.length ? devices.map(d => d.device) : ['Desktop', 'Mobile'],
        datasets: [{ data: devices.length ? devices.map(d => d.count) : [0,0], backgroundColor: ['#00B4D8','#FFB800','#7C3AED'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8' } } } }
    });
  }

  function renderPageviewsChart(pages) {
    const ctx = document.getElementById('chartPageviews');
    if (!ctx) return;
    if (chartPages) chartPages.destroy();
    chartPages = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: pages.length ? pages.map(p => p.page) : ['/'],
        datasets: [{ label: 'Pageviews', data: pages.length ? pages.map(p => p.views) : [0], backgroundColor: '#7C3AED' }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });
  }

  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fetchAnalytics(btn.dataset.range);
    });
  });

  // --- WHATSAPP LEADS ---
  async function fetchWhatsAppLeads() {
    const status = document.getElementById('waStatusFilter')?.value || 'All';
    const search = document.getElementById('waSearch')?.value || '';
    try {
      const res = await fetch(`${API_BASE}?action=get_whatsapp_leads&status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`, { credentials: 'include', 
        headers: {  }
      }).then(r => r.json());
      if (res && res.success) { appData.whatsappLeads = res.whatsapp_leads || []; renderWaLeadsTable(); }
    } catch (e) {}
  }

  function renderWaLeadsTable() {
    const tbody = document.getElementById('waLeadsTable');
    if (!tbody) return;
    if (!appData.whatsappLeads.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="color:var(--text2); text-align:center;">No WhatsApp interactions recorded yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = appData.whatsappLeads.map(l => {
      const sc = (l.status || 'New').toLowerCase().replace(/\s+/g,'-');
      return `<tr>
        <td><strong style="color:var(--gold); font-family:monospace;">${escapeHtml(l.lead_code || '#'+l.id)}</strong></td>
        <td style="white-space:nowrap;">${escapeHtml(l.created_at || '')}</td>
        <td><strong>${escapeHtml(l.page)}</strong><span style="font-size:0.75rem; color:var(--text3); display:block;">(${escapeHtml(l.button_location||'CTA')})</span></td>
        <td>${escapeHtml(l.device)} · <span style="color:var(--text2); font-size:0.8rem;">${escapeHtml(l.browser)}</span></td>
        <td>${escapeHtml(l.referrer || 'Direct')}</td>
        <td><span class="status-pill ${sc}">${escapeHtml(l.status)}</span></td>
        <td style="max-width:200px; font-size:0.82rem; color:var(--text2);">${escapeHtml(l.notes||'—')}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn-admin-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="openEditLeadInline(${l.id},'whatsapp')">Edit Status</button>
            <button class="btn-media-del" style="padding:4px 10px; font-size:0.75rem;" onclick="deleteWaLead(${l.id})">Delete</button>
          </div>
        </td></tr>`;
    }).join('');
  }

  const waStatusFilter = document.getElementById('waStatusFilter');
  const waSearch = document.getElementById('waSearch');
  if (waStatusFilter) waStatusFilter.addEventListener('change', fetchWhatsAppLeads);
  if (waSearch) waSearch.addEventListener('input', fetchWhatsAppLeads);

  document.getElementById('exportWaLeadsBtn')?.addEventListener('click', () => {
    if (!appData.whatsappLeads.length) { showToast('No leads to export'); return; }
    let csv = 'ID,Lead Code,Date,Page,Location,Device,Browser,Referrer,Status,Notes\n';
    appData.whatsappLeads.forEach(l => {
      csv += `"${l.id}","${l.lead_code}","${l.created_at}","${l.page}","${l.button_location}","${l.device}","${l.browser}","${l.referrer}","${l.status}","${l.notes||''}"\n`;
    });
    downloadCSV(csv, 'whatsapp_leads.csv');
  });

  function downloadCSV(csv, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = filename; link.click();
    showToast('CSV exported successfully!');
  }

  // --- INLINE LEAD EDIT ---
  window.openEditLeadInline = function(id, type = 'whatsapp') {
    setVal('editLeadId', id);
    setVal('editLeadType', type);
    const leads = type === 'whatsapp' ? appData.whatsappLeads : (appData.inquiries || []);
    const lead = leads.find(l => l.id === id);
    if (lead) {
      setVal('leadCodeDisplay', lead.lead_code || (type === 'whatsapp' ? '#WA-'+lead.id : '#INQ-'+lead.id));
      setVal('leadStatusSelect', lead.status || 'New');
      setVal('leadNotesInput', lead.notes || '');
    }
    showView('waLeadEditView', 'waLeadsListView');
  };

  document.getElementById('cancelWaLeadEdit')?.addEventListener('click', () => showView('waLeadsListView', 'waLeadEditView'));
  document.getElementById('cancelWaLeadEdit2')?.addEventListener('click', () => showView('waLeadsListView', 'waLeadEditView'));

  document.getElementById('leadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id     = document.getElementById('editLeadId').value;
    const type   = document.getElementById('editLeadType').value;
    const status = document.getElementById('leadStatusSelect').value;
    const notes  = document.getElementById('leadNotesInput').value.trim();
    const endpoint = type === 'whatsapp' ? 'update_whatsapp_lead' : 'update_inquiry';
    try {
      const res = await fetch(`${API_BASE}?action=${endpoint}`, { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes })
      }).then(r => r.json());
      if (res && res.success) {
        showToast('Lead status updated!');
        showView('waLeadsListView', 'waLeadEditView');
        fetchWhatsAppLeads(); fetchDashboardStats(); fetchData();
      }
    } catch (e) { showToast('Failed to update lead'); }
  });

  window.deleteWaLead = async function(id) {
    if (!confirm('Delete this WhatsApp lead interaction?')) return;
    await fetch(`${API_BASE}?action=delete_whatsapp_lead&id=${id}`, { credentials: 'include',  method: 'DELETE', headers: {  } });
    showToast('Lead interaction deleted');
    fetchWhatsAppLeads();
  };

  // --- ALL LEADS CRM TABLE ---
  function renderAllLeadsTable() {
    const tbody = document.getElementById('allLeadsTable');
    if (!tbody) return;
    fetch(`${API_BASE}?action=get_all_leads`, { credentials: 'include',  headers: {  } })
      .then(r => r.json()).then(res => {
        if (res && res.success) {
          const combined = [...(res.whatsapp_leads||[]), ...(res.contact_leads||[])].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
          if (!combined.length) { tbody.innerHTML = `<tr><td colspan="7" style="color:var(--text2); text-align:center;">No leads recorded yet.</td></tr>`; return; }
          tbody.innerHTML = combined.map(l => {
            const sc = (l.status||'New').toLowerCase().replace(/\s+/g,'-');
            const isWa = l.type==='WhatsApp';

            let contactDisplay = 'Direct Click';
            if (!isWa) {
              const nameStr  = l.name ? `<strong>${escapeHtml(l.name)}</strong>` : '';
              const emailStr = l.email ? escapeHtml(l.email) : '';
              const phoneStr = l.phone ? escapeHtml(l.phone) : '';
              const details  = [emailStr, phoneStr].filter(Boolean).join(' • ');
              
              if (nameStr && details) {
                contactDisplay = `${nameStr} <span style="color:var(--text2); font-size:0.82rem;">(${details})</span>`;
              } else if (nameStr) {
                contactDisplay = nameStr;
              } else if (details) {
                contactDisplay = `<span style="color:var(--text2); font-size:0.82rem;">${details}</span>`;
              } else {
                contactDisplay = '—';
              }
            }

            let quickActions = '';
            if (l.phone) {
              const waUrl = formatEgyptianWhatsAppUrl(l.phone, `مرحباً ${l.name || ''}، تواصلنا معك من وكالة Egypt Creative.`);
              const telUrl = formatPhoneCallUrl(l.phone);
              quickActions = `<div class="mob-lead-actions" style="margin-top:5px;">
                ${waUrl ? `<a href="${waUrl}" target="_blank" rel="noopener" class="btn-mob-action btn-mob-whatsapp" style="padding:2px 8px; font-size:0.75rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                  <span>WhatsApp</span>
                </a>` : ''}
                ${telUrl ? `<a href="${telUrl}" class="btn-mob-action btn-mob-call" style="padding:2px 8px; font-size:0.75rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>اتصال</span>
                </a>` : ''}
              </div>`;
            }

            return `<tr>
              <td><strong style="color:var(--gold); font-family:monospace;">${escapeHtml(l.code)}</strong></td>
              <td><span style="font-size:0.75rem; font-weight:700; color:${isWa?'var(--green)':'var(--blue)'};">${escapeHtml(l.type)}</span></td>
              <td>${contactDisplay}${quickActions}</td>
              <td>${escapeHtml(l.page || 'Homepage')}</td>
              <td style="white-space:nowrap;">${escapeHtml(l.created_at || '')}</td>
              <td><span class="status-pill ${sc}">${escapeHtml(l.status||'New')}</span></td>
              <td><button class="btn-admin-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="openEditLeadInline(${l.id},'${isWa?'whatsapp':'inquiry'}')">Edit Status</button></td>
            </tr>`;
          }).join('');
        }
      }).catch(() => {});
  }

  // --- PAGE EDITOR TABS ---
  const btnPageTabs      = document.querySelectorAll('.btn-page-tab');
  const pageEditSections = document.querySelectorAll('.page-edit-section');
  btnPageTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      btnPageTabs.forEach(b => b.classList.remove('active'));
      pageEditSections.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const t = document.getElementById(`page-${btn.dataset.page}`);
      if (t) t.classList.add('active');
      populatePageForms();
    });
  });

  // --- FETCH CMS DATA ---
  async function fetchData() {
    try {
      const ts = Date.now();
      const data = await fetch(`${API_BASE}?action=get_data&_t=${ts}`, { cache: 'no-store' }).then(r => r.json());
      if (data) {
        if (Array.isArray(data.portfolio)) appData.portfolio = data.portfolio;
        if (Array.isArray(data.services)) appData.services = data.services;
        if (Array.isArray(data.clients)) appData.clients = data.clients;
        if (Array.isArray(data.team)) appData.team = data.team;
        if (Array.isArray(data.testimonials)) appData.testimonials = data.testimonials;
        appData = Object.assign(appData, data);
      }
    } catch (e) {}

    try {
      const inqRes = await fetch(`${API_BASE}?action=get_inquiries`, { credentials: 'include' }).then(r => r.json());
      if (inqRes && inqRes.success) appData.inquiries = inqRes.inquiries || [];
    } catch (e) {}

    if (currentUserRole === 'super_admin') {
      try {
        const uRes = await fetch(`${API_BASE}?action=get_users`, { credentials: 'include' }).then(r => r.json());
        if (uRes && uRes.success) appData.users = uRes.users || [];
      } catch (e) {}
    }

    populatePageForms();
    renderClients(); renderPortfolio(); renderTeam();
    renderTestimonials(); renderServices(); renderNavigation();
    loadSeoSettings(); renderInquiries(); renderAllLeadsTable();
    if (currentUserRole === 'super_admin') renderUsers();
    fetchMedia();
  }

  function populatePageForms() {
    const getS = (val, def) => {
      if (!val && val !== 0) return def || '';
      if (typeof val === 'object') return val.en || val.ar || def || '';
      return String(val);
    };

    const hero = appData.hero || {};
    setVal('heroBadgeEn', getS(hero.badge_en, 'Egyptian creativity. Global impact.'));
    setVal('heroBadgeAr', getS(hero.badge_ar, 'إبداع مصري. تأثير عالمي.'));
    setVal('heroStep1En', getS(hero.step1_en, 'We Make Brands Unforgettable.'));
    setVal('heroStep1Ar', getS(hero.step1_ar, 'نجعل العلامات التجارية لا تُنسى.'));
    setVal('heroStep2En', getS(hero.step2_en, 'Strategy-Driven Creative Marketing.'));
    setVal('heroStep2Ar', getS(hero.step2_ar, 'تسويق إبداعي مدفوع بالاستراتيجية.'));
    setVal('heroStep3En', getS(hero.step3_en, 'High-Impact Content & Campaigns.'));
    setVal('heroStep3Ar', getS(hero.step3_ar, 'محتوى وحملات عالية التأثير.'));
    setVal('heroStep4En', getS(hero.step4_en, 'Measurable Growth & ROI.'));
    setVal('heroStep4Ar', getS(hero.step4_ar, 'نمو قابل للقياس وعائد استثماري.'));

    const about = appData.about || {};
    setVal('aboutTagEn', getS(about.tag_en || about.tag, 'Who We Are'));
    setVal('aboutTagAr', getS(about.tag_ar, 'من نحن'));
    setVal('aboutTitleEn', getS(about.title_en || about.title, 'Who We Are — Egypt Creative'));
    setVal('aboutTitleAr', getS(about.title_ar, 'من نحن — إيجيبت كرييتف'));

    setVal('aboutSlide1P1En', getS(about.slide1_p1_en || about.tab1_p1, 'Egypt Creative is a full-service marketing and creative agency. Our goal is clear: helping brands reach where they aspire to be.'));
    setVal('aboutSlide1P1Ar', getS(about.slide1_p1_ar, 'Egypt Creative هي وكالة متكاملة للإبداع والتسويق، هدفنا واضح: مساعدة العلامات التجارية على الوصول إلى المكان الذي تطمح إليه.'));

    setVal('aboutSlide1P2En', getS(about.slide1_p2_en, 'Our journey began in 2011 when our founders started as freelancers in marketing and creative services. Over the years, they gained extensive experience across diverse industries.'));
    setVal('aboutSlide1P2Ar', getS(about.slide1_p2_ar, 'بدأت رحلتنا في 2011، عندما انطلق مؤسسونا كمستقلين في مجالات التسويق والخدمات الإبداعية. وعلى مدار السنوات، اكتسبوا خبرات واسعة في مختلف الصناعات.'));

    setVal('aboutSlide1P3En', getS(about.slide1_p3_en, 'Today, Egypt Creative brings this experience under one entity, delivering a full blend of creativity, marketing, and strategy.'));
    setVal('aboutSlide1P3Ar', getS(about.slide1_p3_ar, 'واليوم، تجمع Egypt Creative هذه الخبرات تحت كيان واحد، لتقدم مزيجًا متكاملًا من الإبداع والتسويق والاستراتيجية.'));

    setVal('aboutSlide1P4En', getS(about.slide1_p4_en, 'From branding and strategy to social media, content production, media buying, PR, web development, and outdoor ads — we provide everything your brand needs under one roof.'));
    setVal('aboutSlide1P4Ar', getS(about.slide1_p4_ar, 'من الاستراتيجية والهوية التجارية، إلى السوشيال ميديا، المحتوى والإنتاج، الميديا باينج، العلاقات العامة، التسويق الرقمي، تطوير المواقع والإعلانات الخارجية، نوفر كل ما تحتاجه العلامة التجارية تحت سقف واحد.'));

    setVal('aboutSlide1P5En', getS(about.slide1_p5_en, 'We don’t just create campaigns; we understand the business behind every brand, studying goals, audience, and market to turn ideas into results.'));
    setVal('aboutSlide1P5Ar', getS(about.slide1_p5_ar, 'نحن لا نصنع الحملات والمحتوى فقط، بل نفهم البيزنس وراء كل براند، وندرس أهدافه وجمهوره وسوقه، ثم نحول الأفكار إلى نتائج.'));

    setVal('aboutSlide1P6En', getS(about.slide1_p6_en, 'Because likes are not the goal… results are the goal. And that is what defines the power of Egypt Creative.'));
    setVal('aboutSlide1P6Ar', getS(about.slide1_p6_ar, 'لأن اللايكات ليست الهدف… النتائج هي الهدف. ودول هما اللي بيحددوا قوة Egypt Creative.'));

    setVal('aboutSlide2TitleEn', getS(about.slide2_title_en || about.tab2_title, 'Our Vision — Competing On The World Stage'));
    setVal('aboutSlide2TitleAr', getS(about.slide2_title_ar, 'رؤيتنا — المنافسة على الساحة العالمية'));

    setVal('aboutSlide2P1En', getS(about.slide2_p1_en || about.tab2_p1, 'Our vision is to make Egypt Creative a globally recognized name born in Egypt to compete internationally.'));
    setVal('aboutSlide2P1Ar', getS(about.slide2_p1_ar, 'رؤيتنا هي أن نجعل من إيجيبت كرييتف اسمًا معترفًا به عالميًا، وُلد في مصر وتأسس للمنافسة على الساحة الدولية.'));

    setVal('aboutSlide2P2En', getS(about.slide2_p2_en, 'We look forward to a future where creativity is inseparable from business strategy and goals.'));
    setVal('aboutSlide2P2Ar', getS(about.slide2_p2_ar, 'نتطلع إلى مستقبل لا ينفصل فيه الإبداع عن الاستراتيجية أو أهداف الأعمال.'));

    setVal('aboutSlide2P3En', getS(about.slide2_p3_en, 'From building and launching brands to scaling them, our vision is to deliver work that drives real impact.'));
    setVal('aboutSlide2P3Ar', getS(about.slide2_p3_ar, 'من بناء وإطلاق العلامات التجارية إلى تطويرها وتوسيع نطاقها، رؤيتنا هي تقديم أعمال تحقق تأثيرًا حقيقيًا.'));

    setVal('aboutSlide3TitleEn', getS(about.slide3_title_en || about.tab3_title, 'Our Mission — Build, Launch, Grow & Scale'));
    setVal('aboutSlide3TitleAr', getS(about.slide3_title_ar, 'رسالتنا — البناء، الإطلاق، النمو والتوسع'));

    setVal('aboutSlide3P1En', getS(about.slide3_p1_en || about.tab3_p1, 'Our mission is to help brands Build, Launch, Grow, and Scale through deep marketing expertise and creative strategy.'));
    setVal('aboutSlide3P1Ar', getS(about.slide3_p1_ar, 'رسالتنا هي مساعدة العلامات التجارية على البناء، الإطلاق، النمو، والتوسع من خلال الجمع بين الخبرة التسويقية والتفكير الاستراتيجي.'));

    setVal('aboutSlide3P2En', getS(about.slide3_p2_en, 'We start by understanding the nature of your business, market, audience, and competitive landscape.'));
    setVal('aboutSlide3P2Ar', getS(about.slide3_p2_ar, 'نبدأ بفهم طبيعة العمل، والسوق، والجمهور، والمشهد التنافسي — لأن الإبداع المؤثر يبدأ من الفهم العميق.'));

    setVal('aboutSlide3P3En', getS(about.slide3_p3_en, 'With our multidisciplinary team, we offer everything under one roof without managing multiple agencies.'));
    setVal('aboutSlide3P3Ar', getS(about.slide3_p3_ar, 'بخبرتنا الممتدة وفريقنا متعدد التخصصات الذي يغطي كافة مجالات التسويق، نقدم كل ما يحتاجون إليه تحت سقف واحد.'));

    setVal('aboutSlide3P4En', getS(about.slide3_p4_en, 'We work side by side with our clients to be an extension of their team and a true partner.'));
    setVal('aboutSlide3P4Ar', getS(about.slide3_p4_ar, 'نحن لا نعمل فقط لحساب عملائنا؛ بل نعمل جنبًا إلى جنب معهم — لنكون امتدادًا لفريقهم وشريكًا حقيقيًا.'));

    setVal('aboutSlide3P5En', getS(about.slide3_p5_en, 'Our mission is simple: turning understanding into competitive advantage to help brands outperform competitors.'));
    setVal('aboutSlide3P5Ar', getS(about.slide3_p5_ar, 'رسالتنا بسيطة: فهم ما يجعل كل عمل تجاري فريدًا، وتحويل ذلك الفهم إلى ميزة تنافسية.'));

    setVal('aboutCardTitleEn', getS(about.card_title_en, '16+ Years of Experience'));
    setVal('aboutCardTitleAr', getS(about.card_title_ar, '16+ سنوات خبرة'));
    setVal('aboutCardDescEn', getS(about.card_desc_en, 'Established in Cairo · 2011'));
    setVal('aboutCardDescAr', getS(about.card_desc_ar, 'تأسست في القاهرة · 2011'));

    const settings = appData.settings || {};
    setVal('contactPhone', getS(settings.phone, '+20 104 4107134'));
    setVal('contactWhatsapp', getS(settings.whatsapp, '201044107134'));
    setVal('contactEmail', getS(settings.email, 'info@egyptcreative.com'));
    setVal('contactInstagram', getS(settings.instagram, 'https://www.instagram.com/egypt_creative_agency'));
    setVal('contactLinkedin', getS(settings.linkedin, 'https://www.linkedin.com/company/egypt-creative-agency'));

    const isTeamEnabled = (Number(appData.team_section_enabled) !== 0) && (settings.team_section_enabled !== 0);
    const chk = document.getElementById('toggleTeamSection');
    if (chk) chk.checked = isTeamEnabled;

    const stats = appData.stats || {};
    setVal('statClientsVal', getS(stats.stat1_val, '2000+'));
    setVal('statExpVal', getS(stats.stat2_val, '16+'));
    setVal('statCampaignsVal', getS(stats.stat3_val, '3000+'));
    setVal('statSatisfactionVal', getS(stats.stat4_val, '98%'));
  }

  async function saveContent(section, fields) {
    return fetch(`${API_BASE}?action=save_content`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, fields })
    }).then(r => r.json());
  }

  document.getElementById('homeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim();
    const res = await saveContent('hero', { badge_en:f('heroBadgeEn'), badge_ar:f('heroBadgeAr'), step1_en:f('heroStep1En'), step1_ar:f('heroStep1Ar'), step2_en:f('heroStep2En'), step2_ar:f('heroStep2Ar'), step3_en:f('heroStep3En'), step3_ar:f('heroStep3Ar'), step4_en:f('heroStep4En'), step4_ar:f('heroStep4Ar') });
    if (res?.success) showToast('Home page content saved!');
  });

  document.getElementById('aboutForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim() || '';
    const res = await saveContent('about', {
      tag_en: f('aboutTagEn'), tag_ar: f('aboutTagAr'),
      title_en: f('aboutTitleEn'), title_ar: f('aboutTitleAr'),
      slide1_p1_en: f('aboutSlide1P1En'), slide1_p1_ar: f('aboutSlide1P1Ar'),
      slide1_p2_en: f('aboutSlide1P2En'), slide1_p2_ar: f('aboutSlide1P2Ar'),
      slide1_p3_en: f('aboutSlide1P3En'), slide1_p3_ar: f('aboutSlide1P3Ar'),
      slide1_p4_en: f('aboutSlide1P4En'), slide1_p4_ar: f('aboutSlide1P4Ar'),
      slide1_p5_en: f('aboutSlide1P5En'), slide1_p5_ar: f('aboutSlide1P5Ar'),
      slide1_p6_en: f('aboutSlide1P6En'), slide1_p6_ar: f('aboutSlide1P6Ar'),
      slide2_title_en: f('aboutSlide2TitleEn'), slide2_title_ar: f('aboutSlide2TitleAr'),
      slide2_p1_en: f('aboutSlide2P1En'), slide2_p1_ar: f('aboutSlide2P1Ar'),
      slide2_p2_en: f('aboutSlide2P2En'), slide2_p2_ar: f('aboutSlide2P2Ar'),
      slide2_p3_en: f('aboutSlide2P3En'), slide2_p3_ar: f('aboutSlide2P3Ar'),
      slide3_title_en: f('aboutSlide3TitleEn'), slide3_title_ar: f('aboutSlide3TitleAr'),
      slide3_p1_en: f('aboutSlide3P1En'), slide3_p1_ar: f('aboutSlide3P1Ar'),
      slide3_p2_en: f('aboutSlide3P2En'), slide3_p2_ar: f('aboutSlide3P2Ar'),
      slide3_p3_en: f('aboutSlide3P3En'), slide3_p3_ar: f('aboutSlide3P3Ar'),
      slide3_p4_en: f('aboutSlide3P4En'), slide3_p4_ar: f('aboutSlide3P4Ar'),
      slide3_p5_en: f('aboutSlide3P5En'), slide3_p5_ar: f('aboutSlide3P5Ar'),
      card_title_en: f('aboutCardTitleEn'), card_title_ar: f('aboutCardTitleAr'),
      card_desc_en: f('aboutCardDescEn'), card_desc_ar: f('aboutCardDescAr')
    });
    if (res?.success) showToast('About content saved successfully!');
  });

  // Save Contact & Social Info
  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim() || '';
    const isTeamEnabled = document.getElementById('toggleTeamSection')?.checked ? 1 : 0;

    const res = await saveContent('settings', { 
      phone: f('contactPhone'), 
      whatsapp: f('contactWhatsapp'), 
      email: f('contactEmail'), 
      instagram: f('contactInstagram'), 
      linkedin: f('contactLinkedin'),
      team_section_enabled: isTeamEnabled
    });

    try {
      await fetch(`${API_BASE}?action=toggle_team_visibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_section_enabled: isTeamEnabled })
      });
    } catch (_) {}

    if (res?.success) {
      showToast('✓ تم حفظ بيانات التواصل وروابط السوشيال بنجاح!');
      fetchData();
    } else {
      showToast('Error saving contact settings');
    }
  });

  // Dedicated Save for Counter Statistics (Clients, Experience, Campaigns, Satisfaction)
  document.getElementById('counterStatsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim() || '';
    const btn = document.getElementById('saveCounterStatsBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ جاري الحفظ...';
    }

    const payload = {
      stat1_val: f('statClientsVal'),
      stat2_val: f('statExpVal'),
      stat3_val: f('statCampaignsVal'),
      stat4_val: f('statSatisfactionVal')
    };

    try {
      const res = await saveContent('stats', payload);
      if (res?.success) {
        showToast('✓ تم حفظ إحصائيات العدادات بنجاح! / Counter Statistics Saved!');
        await fetchData();
      } else {
        showToast('Error: ' + (res?.message || 'Failed to save statistics'));
      }
    } catch (err) {
      showToast('Connection error saving statistics');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '💾 حفظ العدادات والإحصائيات (Save Counter Statistics)';
      }
    }
  });

  // --- SERVICES SECTION ---
  function renderServices() {
    const list = document.getElementById('servicesList');
    if (!list) return;
    if (!appData.services?.length) { list.innerHTML = `<p style="color:var(--text2);">No services found.</p>`; return; }
    list.innerHTML = appData.services.map(s => `
      <div class="portfolio-admin-item">
        <div>
          <strong style="color:#fff;">${escapeHtml(s.name_en)}</strong>
          <span style="color:var(--gold); margin-left:8px;">(${escapeHtml(s.name_ar)})</span>
          <p style="color:var(--text2); font-size:0.85rem; margin-top:4px;">${escapeHtml(s.desc_en)}</p>
        </div>
        <div class="port-actions">
          <button class="btn-admin-secondary" onclick="editServiceInline('${s.id}')">Edit</button>
          <button class="btn-media-del" onclick="deleteService('${s.id}')">Delete</button>
        </div>
      </div>`).join('');
  }

  document.getElementById('addServiceBtn')?.addEventListener('click', () => {
    document.getElementById('serviceForm')?.reset();
    setVal('editServiceId', '');
    document.getElementById('serviceFormTitle').textContent = 'Add New Service';
    showView('serviceFormView', 'servicesListView');
  });

  window.editServiceInline = function(id) {
    const s = appData.services?.find(x => x.id === id); if (!s) return;
    setVal('editServiceId', s.id); setVal('svcNameEn', s.name_en); setVal('svcNameAr', s.name_ar);
    setVal('svcDescEn', s.desc_en); setVal('svcDescAr', s.desc_ar); setVal('svcBadgeEn', s.badge_en);
    setVal('svcBadgeAr', s.badge_ar); setVal('svcIconSvg', s.icon_svg);
    document.getElementById('serviceFormTitle').textContent = 'Edit Service';
    showView('serviceFormView', 'servicesListView');
  };

  document.getElementById('cancelServiceForm')?.addEventListener('click', () => showView('servicesListView', 'serviceFormView'));
  document.getElementById('cancelServiceForm2')?.addEventListener('click', () => showView('servicesListView', 'serviceFormView'));

  document.getElementById('serviceForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim();
    const res = await fetch(`${API_BASE}?action=save_service`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id:f('editServiceId'), name_en:f('svcNameEn'), name_ar:f('svcNameAr'), desc_en:f('svcDescEn'), desc_ar:f('svcDescAr'), badge_en:f('svcBadgeEn'), badge_ar:f('svcBadgeAr'), icon_svg:f('svcIconSvg') })
    }).then(r => r.json());
    if (res?.success) { showToast('Service saved!'); showView('servicesListView', 'serviceFormView'); fetchData(); }
  });

  window.deleteService = async function(id) {
    if (!confirm('Delete this service?')) return;
    await fetch(`${API_BASE}?action=delete_service&id=${id}`, { credentials: 'include',  method: 'DELETE', headers: {  } });
    showToast('Service deleted'); fetchData();
  };

  // --- NAVIGATION SECTION ---
  function renderNavigation() {
    const list = document.getElementById('navList');
    if (!list) return;
    if (!appData.navigation?.length) { list.innerHTML = `<p style="color:var(--text2);">No navigation items.</p>`; return; }
    list.innerHTML = appData.navigation.map(n => `
      <div class="portfolio-admin-item">
        <div>
          <strong style="color:#fff;">${escapeHtml(n.label_en)}</strong>
          <span style="color:var(--gold); margin-left:8px;">(${escapeHtml(n.label_ar)})</span>
          <span style="color:var(--text2); font-size:0.85rem; display:block;">${escapeHtml(n.href)}</span>
        </div>
        <div class="port-actions">
          <button class="btn-admin-secondary" onclick="editNavItemInline('${n.id}')">Edit</button>
          <button class="btn-media-del" onclick="deleteNavItem('${n.id}')">Delete</button>
        </div>
      </div>`).join('');
  }

  document.getElementById('addNavBtn')?.addEventListener('click', () => {
    document.getElementById('navForm')?.reset();
    setVal('editNavId', '');
    document.getElementById('navFormTitle').textContent = 'Add Navigation Item';
    showView('navFormView', 'navListView');
  });

  window.editNavItemInline = function(id) {
    const n = appData.navigation?.find(x => x.id === id); if (!n) return;
    setVal('editNavId', n.id); setVal('navLabelEn', n.label_en); setVal('navLabelAr', n.label_ar);
    setVal('navHref', n.href); setVal('navTarget', n.target);
    document.getElementById('navFormTitle').textContent = 'Edit Navigation Item';
    showView('navFormView', 'navListView');
  };

  document.getElementById('cancelNavForm')?.addEventListener('click', () => showView('navListView', 'navFormView'));
  document.getElementById('cancelNavForm2')?.addEventListener('click', () => showView('navListView', 'navFormView'));

  document.getElementById('navForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim();
    const res = await fetch(`${API_BASE}?action=save_nav_item`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id:f('editNavId'), label_en:f('navLabelEn'), label_ar:f('navLabelAr'), href:f('navHref'), target:document.getElementById('navTarget')?.value })
    }).then(r => r.json());
    if (res?.success) { showToast('Nav item saved!'); showView('navListView', 'navFormView'); fetchData(); }
  });

  window.deleteNavItem = async function(id) {
    if (!confirm('Delete this nav item?')) return;
    await fetch(`${API_BASE}?action=delete_nav_item&id=${id}`, { credentials: 'include',  method: 'DELETE', headers: {  } });
    showToast('Nav item deleted'); fetchData();
  };

  // --- CLIENTS SECTION ---
  function renderClients() {
    const grid = document.getElementById('clientsGrid');
    if (!grid) return;
    if (!appData.clients?.length) { grid.innerHTML = `<p style="color:var(--text2);">No clients added.</p>`; return; }
    grid.innerHTML = appData.clients.map(c => `
      <div class="client-admin-card">
        <img src="${escapeHtml(c.logo_url||c.logo||'assets/placeholder-logo.png')}" alt="${escapeHtml(c.name)}" onerror="this.src='assets/placeholder-logo.png'" />
        <h4>${escapeHtml(c.name)}</h4>
        <div style="display:flex; gap:6px; margin-top:8px;">
          <button class="btn-admin-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="editClientInline('${c.id}')">Edit</button>
          <button class="btn-media-del" style="padding:4px 10px; font-size:0.75rem;" onclick="deleteClient('${c.id}')">Delete</button>
        </div>
      </div>`).join('');
  }

  document.getElementById('addClientBtn')?.addEventListener('click', () => {
    document.getElementById('clientForm')?.reset();
    setVal('editClientId', '');
    document.getElementById('clientFormTitle').textContent = 'Add Client Logo';
    showView('clientFormView', 'clientsListView');
  });

  window.editClientInline = function(id) {
    const c = appData.clients?.find(x => x.id === id); if (!c) return;
    setVal('editClientId', c.id); setVal('clientName', c.name); setVal('clientLogoUrl', c.logo_url||c.logo);
    setVal('clientWebsiteUrl', c.website_url||c.website); setVal('clientLogoStyle', c.style||'auto');
    document.getElementById('clientFormTitle').textContent = 'Edit Client Partner';
    showView('clientFormView', 'clientsListView');
  };

  document.getElementById('cancelClientForm')?.addEventListener('click', () => showView('clientsListView', 'clientFormView'));
  document.getElementById('cancelClientForm2')?.addEventListener('click', () => showView('clientsListView', 'clientFormView'));

  document.getElementById('clientForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim();
    const res = await fetch(`${API_BASE}?action=save_client`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id:f('editClientId'), name:f('clientName'), logo_url:f('clientLogoUrl'), website_url:f('clientWebsiteUrl'), style:document.getElementById('clientLogoStyle')?.value })
    }).then(r => r.json());
    if (res?.success) { showToast('Client saved!'); showView('clientsListView', 'clientFormView'); fetchData(); }
  });

  window.deleteClient = async function(id) {
    if (!confirm('Delete this client?')) return;
    await fetch(`${API_BASE}?action=delete_client&id=${id}`, { credentials: 'include',  method: 'DELETE', headers: {  } });
    showToast('Client deleted'); fetchData();
  };

  // --- PORTFOLIO SECTION ---
  function renderPortfolio() {
    const list = document.getElementById('portfolioList');
    if (!list) return;
    if (!appData.portfolio?.length) { list.innerHTML = `<p style="color:var(--text2);">No projects found.</p>`; return; }
    list.innerHTML = appData.portfolio.map(p => {
      const logoUrl = p.company_logo || p.logo || p.logo_url || p.img || 'assets/placeholder-cover.jpg';
      const companyName = p.company_name_en || p.company_name || p.client || p.title_en || p.title;
      return `
        <div class="portfolio-admin-item" style="display:flex; align-items:center; gap:16px; padding:12px 16px; background:var(--surface2); border:1px solid var(--border); border-radius:12px; margin-bottom:12px;">
          <div style="width:56px; height:56px; border-radius:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,184,0,0.25); display:flex; align-items:center; justify-content:center; padding:5px; flex-shrink:0;">
            <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" style="max-width:100%; max-height:100%; object-fit:contain; display:block;" onerror="this.src='assets/placeholder-cover.jpg'" />
          </div>
          <div style="flex:1; min-width:0;">
            <strong style="color:#fff; font-size:1rem; font-family:'Syne',sans-serif; display:block;">${escapeHtml(companyName)}</strong>
            <div style="color:var(--text2); font-size:0.85rem; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              Category: <span style="color:var(--gold);">${escapeHtml(p.category)}</span> · Title: ${escapeHtml(p.title_en || p.title || '')}
            </div>
          </div>
          <div class="port-actions" style="display:flex; gap:8px;">
            <button class="btn-admin-secondary" onclick="editProjectInline('${p.id}')">Edit</button>
            <button class="btn-media-del" onclick="deleteProject('${p.id}')">Delete</button>
          </div>
        </div>`;
    }).join('');
  }

  document.getElementById('addPortfolioBtn')?.addEventListener('click', () => {
    document.getElementById('projectForm')?.reset();
    setVal('editProjectId', '');
    setVal('projCompanyLogo', '');
    if (typeof window.clearLogoImage === 'function') window.clearLogoImage();
    setVal('projImgUrl', '');
    if (typeof window.clearCoverImage === 'function') window.clearCoverImage();
    currentProjectGallery = [];
    renderGalleryManager();
    currentProjectVideos = [];
    renderVideoGalleryManager();
    const title = document.getElementById('projectFormTitle');
    if (title) title.textContent = 'Add New Case Study';
    showView('projectFormView', 'portfolioListView');
  });

  window.editProjectInline = function(id) {
    const p = appData.portfolio?.find(x => x.id === id); if (!p) return;
    setVal('editProjectId', p.id);
    setVal('projCompanyNameEn', p.company_name_en || p.company_name || p.client || '');
    setVal('projCompanyNameAr', p.company_name_ar || '');
    setVal('projCompanyLogo', p.company_logo || p.logo || p.logo_url || '');
    if (typeof window.updateLogoPreview === 'function') window.updateLogoPreview();

    setVal('projTitleEn', p.title_en || p.title || '');
    setVal('projTitleAr', p.title_ar || '');
    setVal('projCategory', p.category || '');
    setVal('projCategoryAr', p.category_ar || '');
    setVal('projYear', p.year || '');
    setVal('projSlug', p.slug || '');

    setVal('projDescEn', p.desc_en || p.desc || '');
    setVal('projDescAr', p.desc_ar || '');
    setVal('projChallengeEn', p.challenge_en || p.challenge || '');
    setVal('projChallengeAr', p.challenge_ar || '');
    setVal('projSolutionEn', p.solution_en || p.solution || p.strategy_en || '');
    setVal('projSolutionAr', p.solution_ar || p.strategy_ar || '');
    setVal('projExecutionEn', p.execution_en || '');
    setVal('projExecutionAr', p.execution_ar || '');
    setVal('projResultsEn', p.results_en || '');
    setVal('projResultsAr', p.results_ar || '');

    setVal('projImgUrl', p.img || p.cover_image || '');
    window.updateCoverPreview();

    currentProjectGallery = [];
    if (Array.isArray(p.gallery)) {
      currentProjectGallery = [...p.gallery];
    } else if (typeof p.gallery === 'string') {
      try {
        const parsed = JSON.parse(p.gallery);
        if (Array.isArray(parsed)) {
          currentProjectGallery = parsed;
        } else {
          currentProjectGallery = p.gallery.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
        }
      } catch (_) {
        currentProjectGallery = p.gallery.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
      }
    }
    renderGalleryManager();

    currentProjectVideos = [];
    let rawVid = p.video_url || p.video_urls || p.videos || '';
    if (Array.isArray(rawVid)) {
      currentProjectVideos = rawVid.map(v => typeof v === 'object' && v !== null ? (v.url || '') : String(v || '')).filter(Boolean);
    } else if (typeof rawVid === 'string' && rawVid.trim()) {
      try {
        const parsed = JSON.parse(rawVid);
        if (Array.isArray(parsed)) {
          currentProjectVideos = parsed.map(v => typeof v === 'object' && v !== null ? (v.url || '') : String(v || '')).filter(Boolean);
        } else {
          currentProjectVideos = rawVid.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
        }
      } catch (_) {
        currentProjectVideos = rawVid.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
      }
    }
    renderVideoGalleryManager();

    const r = p.results || [];
    setVal('resVal1', p.metric_val1 || r[0]?.val || ''); setVal('resLbl1En', p.metric_lbl1_en || r[0]?.lbl_en || r[0]?.lbl || ''); setVal('resLbl1Ar', p.metric_lbl1_ar || r[0]?.lbl_ar || '');
    setVal('resVal2', p.metric_val2 || r[1]?.val || ''); setVal('resLbl2En', p.metric_lbl2_en || r[1]?.lbl_en || r[1]?.lbl || ''); setVal('resLbl2Ar', p.metric_lbl2_ar || r[1]?.lbl_ar || '');
    setVal('resVal3', p.metric_val3 || r[2]?.val || ''); setVal('resLbl3En', p.metric_lbl3_en || r[2]?.lbl_en || r[2]?.lbl || ''); setVal('resLbl3Ar', p.metric_lbl3_ar || r[2]?.lbl_ar || '');

    setVal('projWebsiteUrl', p.project_url || p.website_url || '');
    setVal('projCaseStudyUrl', p.case_study_url || '');
    setVal('projDisplayOrder', p.display_order || 0);

    const featCb = document.getElementById('projFeatured');
    if (featCb) featCb.checked = Boolean(p.featured);
    const actCb = document.getElementById('projActive');
    if (actCb) actCb.checked = p.active !== undefined ? Boolean(p.active) : true;

    document.getElementById('projectFormTitle').textContent = 'Edit Case Study';
    showView('projectFormView', 'portfolioListView');
  };

  document.getElementById('cancelProjectForm')?.addEventListener('click', () => showView('portfolioListView', 'projectFormView'));
  document.getElementById('cancelProjectForm2')?.addEventListener('click', () => showView('portfolioListView', 'projectFormView'));

  document.getElementById('projectForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim() || '';
    
    // Safely retrieve gallery array without string splitting JSON string
    const rawGallery = f('projGalleryUrls');
    let galleryArr = Array.isArray(currentProjectGallery) ? currentProjectGallery : [];
    if ((!galleryArr || !galleryArr.length) && rawGallery) {
      try {
        const parsed = JSON.parse(rawGallery);
        galleryArr = Array.isArray(parsed) ? parsed : rawGallery.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
      } catch (_) {
        galleryArr = rawGallery.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
      }
    }

    let companyLogoVal = f('projCompanyLogo');
    let imgVal = f('projImgUrl');
    if (!companyLogoVal && imgVal) companyLogoVal = imgVal;
    if (!imgVal && companyLogoVal) imgVal = companyLogoVal;

    const res = await fetch(`${API_BASE}?action=save_project`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: f('editProjectId'),
        company_name_en: f('projCompanyNameEn'),
        company_name_ar: f('projCompanyNameAr'),
        company_logo: companyLogoVal,
        client: f('projCompanyNameEn'),
        title_en: f('projTitleEn'),
        title_ar: f('projTitleAr'),
        category: f('projCategory'),
        category_ar: f('projCategoryAr'),
        year: f('projYear'),
        slug: f('projSlug'),
        desc_en: f('projDescEn'),
        desc_ar: f('projDescAr'),
        challenge_en: f('projChallengeEn'),
        challenge_ar: f('projChallengeAr'),
        solution_en: f('projSolutionEn'),
        solution_ar: f('projSolutionAr'),
        execution_en: f('projExecutionEn'),
        execution_ar: f('projExecutionAr'),
        results_en: f('projResultsEn'),
        results_ar: f('projResultsAr'),
        img: imgVal,
        gallery: galleryArr,
        video_url: JSON.stringify(currentProjectVideos),
        metric_val1: f('resVal1'), metric_lbl1_en: f('resLbl1En'), metric_lbl1_ar: f('resLbl1Ar'),
        metric_val2: f('resVal2'), metric_lbl2_en: f('resLbl2En'), metric_lbl2_ar: f('resLbl2Ar'),
        metric_val3: f('resVal3'), metric_lbl3_en: f('resLbl3En'), metric_lbl3_ar: f('resLbl3Ar'),
        project_url: f('projWebsiteUrl'),
        case_study_url: f('projCaseStudyUrl'),
        display_order: parseInt(f('projDisplayOrder') || '0', 10),
        featured: document.getElementById('projFeatured')?.checked ? 1 : 0,
        active: document.getElementById('projActive')?.checked ? 1 : 0
      })
    }).then(r => r.json());

    if (res?.success) { showToast('Case Study saved successfully!'); showView('portfolioListView', 'projectFormView'); fetchData(); }
  });

  window.deleteProject = async function(id) {
    if (!confirm('Delete this Case Study?')) return;
    try {
      const res = await fetch(`${API_BASE}?action=delete_project`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ id: id })
      }).then(r => r.json());
      if (res?.success) {
        showToast('Case Study deleted successfully!');
        fetchData();
      } else {
        showToast(res?.message || 'Error deleting project', 'error');
      }
    } catch (e) {
      showToast('Failed to delete project', 'error');
    }
  };

  // --- TEAM SECTION (CMS CONTROLLED) ---
  let currentTeamSectionEnabled = 1;

  function renderTeam() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;

    // 1. Update Global Visibility Badge
    if (appData.team_section_enabled !== undefined) {
      currentTeamSectionEnabled = Number(appData.team_section_enabled);
    }
    const badge = document.getElementById('teamSectionStatusBadge');
    if (badge) {
      if (currentTeamSectionEnabled !== 0) {
        badge.textContent = 'SECTION ON';
        badge.style.background = 'rgba(16,185,129,0.15)';
        badge.style.color = '#10B981';
      } else {
        badge.textContent = 'SECTION OFF (Hidden Publicly)';
        badge.style.background = 'rgba(239,68,68,0.15)';
        badge.style.color = '#EF4444';
      }
    }

    if (!appData.team?.length) {
      grid.innerHTML = `<p style="color:var(--text2); grid-column:1/-1;">No team members added. Click "+ Add Member" to create one.</p>`;
      return;
    }

    grid.innerHTML = appData.team.map((t, idx) => {
      const isActive = t.active !== 0 && t.active !== '0';
      const statusBadge = isActive
        ? `<span style="font-size:0.7rem; font-weight:700; color:#10B981; background:rgba(16,185,129,0.15); padding:2px 8px; border-radius:10px;">ACTIVE</span>`
        : `<span style="font-size:0.7rem; font-weight:700; color:#EF4444; background:rgba(239,68,68,0.15); padding:2px 8px; border-radius:10px;">INACTIVE</span>`;

      return `
        <div class="client-admin-card" style="text-align:center; padding:1.25rem;">
          <img src="${escapeHtml(t.img || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400')}" 
               style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin:0 auto 0.75rem; border:2px solid var(--border-gold);" 
               onerror="this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'" />
          <h4 style="margin-bottom:2px; color:#fff; font-size:1.05rem;">${escapeHtml(t.name)}</h4>
          ${t.name_ar ? `<p style="font-size:0.8rem; color:var(--text3); margin-bottom:4px;">${escapeHtml(t.name_ar)}</p>` : ''}
          <p style="color:var(--gold); font-size:0.82rem; font-weight:600; margin-bottom:6px;">${escapeHtml(t.role_en || t.roleEn || 'Team Member')}</p>
          <div style="margin-bottom:10px;">${statusBadge}</div>
          <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">
            <button class="btn-admin-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="editTeamInline('${t.id}')">Edit</button>
            <button class="btn-admin-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="toggleTeamActive('${t.id}', ${isActive ? 0 : 1})">${isActive ? 'Deactivate' : 'Activate'}</button>
            <button class="btn-media-del" style="padding:4px 10px; font-size:0.75rem;" onclick="deleteTeam('${t.id}')">Delete</button>
          </div>
        </div>`;
    }).join('');
  }

  // Toggle Global Team Visibility (ON / OFF)
  document.getElementById('toggleTeamSectionBtn')?.addEventListener('click', async () => {
    const newStatus = (currentTeamSectionEnabled !== 0) ? 0 : 1;
    showToast(`Updating Team Section visibility...`);
    try {
      const res = await fetch(`${API_BASE}?action=save_team_settings`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_section_enabled: newStatus })
      }).then(r => r.json());

      if (res?.success) {
        currentTeamSectionEnabled = newStatus;
        const badge = document.getElementById('teamSectionStatusBadge');
        if (badge) {
          if (newStatus !== 0) {
            badge.textContent = 'SECTION ON';
            badge.style.background = 'rgba(16,185,129,0.15)';
            badge.style.color = '#10B981';
          } else {
            badge.textContent = 'SECTION HIDDEN';
            badge.style.background = 'rgba(239,68,68,0.15)';
            badge.style.color = '#F87171';
          }
        }
        showToast(`Team Section is now ${newStatus ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'} on homepage!`);
        fetchData();
      } else {
        showToast('Failed to update team section visibility', 'error');
      }
    } catch (_) {
      showToast('Error updating team visibility', 'error');
    }
  });

  window.toggleTeamActive = async function(id, newActive) {
    const member = appData.team?.find(x => x.id === id);
    if (!member) return;
    member.active = newActive;

    const res = await fetch(`${API_BASE}?action=save_team`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    }).then(r => r.json());

    if (res?.success) {
      showToast(`Member ${newActive ? 'activated' : 'deactivated'}`);
      fetchData();
    }
  };

  document.getElementById('addTeamBtn')?.addEventListener('click', () => {
    document.getElementById('teamForm')?.reset();
    setVal('editTeamId', '');
    document.getElementById('teamFormTitle').textContent = 'Add Team Member';
    showView('teamFormView', 'teamListView');
  });

  window.editTeamInline = function(id) {
    const t = appData.team?.find(x => x.id === id); if (!t) return;
    setVal('editTeamId', t.id); setVal('teamNameEn', t.name); setVal('teamNameAr', t.name_ar);
    setVal('teamRoleEn', t.role_en||t.roleEn); setVal('teamRoleAr', t.role_ar||t.roleAr);
    setVal('teamLinkedin', t.social_linkedin||t.linkedin); setVal('teamInstagram', t.social_instagram||t.instagram);
    setVal('teamPhotoUrl', t.img);
    document.getElementById('teamFormTitle').textContent = 'Edit Team Member Profile';
    showView('teamFormView', 'teamListView');
  };

  document.getElementById('cancelTeamForm')?.addEventListener('click', () => showView('teamListView', 'teamFormView'));
  document.getElementById('cancelTeamForm2')?.addEventListener('click', () => showView('teamListView', 'teamFormView'));

  document.getElementById('teamForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim() || '';
    const res = await fetch(`${API_BASE}?action=save_team`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: f('editTeamId'),
        name: f('teamNameEn'),
        name_ar: f('teamNameAr'),
        role_en: f('teamRoleEn'),
        role_ar: f('teamRoleAr'),
        social_linkedin: f('teamLinkedin'),
        social_instagram: f('teamInstagram'),
        img: f('teamPhotoUrl'),
        active: 1
      })
    }).then(r => r.json());
    if (res?.success) { showToast('Team member saved!'); showView('teamListView', 'teamFormView'); fetchData(); }
  });

  window.deleteTeam = async function(id) {
    if (!confirm('Delete this team member?')) return;
    await fetch(`${API_BASE}?action=delete_team&id=${id}`, { credentials: 'include', method: 'DELETE' });
    showToast('Member deleted'); fetchData();
  };



  // --- TESTIMONIALS SECTION ---
  function renderTestimonials() {
    const list = document.getElementById('testiList');
    if (!list) return;
    if (!appData.testimonials?.length) { list.innerHTML = `<p style="color:var(--text2);">No reviews added.</p>`; return; }
    list.innerHTML = appData.testimonials.map(t => `
      <div class="portfolio-admin-item">
        <div>
          <strong style="color:#fff;">${escapeHtml(t.author)}</strong>
          <span style="color:var(--gold); margin-left:8px;">(${escapeHtml(t.company||'Client')})</span>
          <p style="color:var(--text2); font-size:0.85rem; margin-top:4px;">"${escapeHtml(t.quote_en||t.quoteEn||'')}"</p>
        </div>
        <div class="port-actions">
          <button class="btn-admin-secondary" onclick="editTestiInline('${t.id}')">Edit</button>
          <button class="btn-media-del" onclick="deleteTesti('${t.id}')">Delete</button>
        </div>
      </div>`).join('');
  }

  document.getElementById('addTestiBtn')?.addEventListener('click', () => {
    document.getElementById('testiForm')?.reset();
    setVal('editTestiId', '');
    document.getElementById('testiFormTitle').textContent = 'Add Client Review';
    showView('testiFormView', 'testiListView');
  });

  window.editTestiInline = function(id) {
    const t = appData.testimonials?.find(x => x.id === id); if (!t) return;
    setVal('editTestiId', t.id); setVal('testiAuthor', t.author); setVal('testiCompany', t.company);
    setVal('testiPosEn', t.position_en); setVal('testiPosAr', t.position_ar);
    setVal('testiQuoteEn', t.quote_en||t.quoteEn); setVal('testiQuoteAr', t.quote_ar||t.quoteAr);
    setVal('testiRating', t.rating||'5');
    document.getElementById('testiFormTitle').textContent = 'Edit Client Review';
    showView('testiFormView', 'testiListView');
  };

  document.getElementById('cancelTestiForm')?.addEventListener('click', () => showView('testiListView', 'testiFormView'));
  document.getElementById('cancelTestiForm2')?.addEventListener('click', () => showView('testiListView', 'testiFormView'));

  document.getElementById('testiForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim();
    const res = await fetch(`${API_BASE}?action=save_testimonial`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id:f('editTestiId'), author:f('testiAuthor'), company:f('testiCompany'), position_en:f('testiPosEn'), position_ar:f('testiPosAr'), quote_en:f('testiQuoteEn'), quote_ar:f('testiQuoteAr'), rating:f('testiRating') })
    }).then(r => r.json());
    if (res?.success) { showToast('Review saved!'); showView('testiListView', 'testiFormView'); fetchData(); }
  });

  window.deleteTesti = async function(id) {
    if (!confirm('Delete this review?')) return;
    await fetch(`${API_BASE}?action=delete_testimonial&id=${id}`, { credentials: 'include',  method: 'DELETE', headers: {  } });
    showToast('Review deleted'); fetchData();
  };

  // --- INQUIRIES ---
  function renderInquiries() {
    const list = document.getElementById('inquiriesList');
    if (!list) return;
    if (!appData.inquiries?.length) { list.innerHTML = `<p style="color:var(--text2);">No inquiries received yet.</p>`; return; }
    list.innerHTML = appData.inquiries.map(inq => {
      const sc = (inq.status||'New').toLowerCase().replace(/\s+/g,'-');
      const contactInfo = [inq.email, inq.phone].filter(Boolean).join(' · ') || '—';
      const waUrl = formatEgyptianWhatsAppUrl(inq.phone, `مرحباً ${inq.name || ''}، تواصلنا معك من وكالة Egypt Creative بخصوص استفسارك.`);
      const telUrl = formatPhoneCallUrl(inq.phone);

      const mobActions = (waUrl || telUrl) ? `
        <div class="mob-lead-actions" style="margin-top:10px;">
          ${waUrl ? `<a href="${waUrl}" target="_blank" rel="noopener" class="btn-mob-action btn-mob-whatsapp">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            <span>WhatsApp</span>
          </a>` : ''}
          ${telUrl ? `<a href="${telUrl}" class="btn-mob-action btn-mob-call">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>اتصال</span>
          </a>` : ''}
        </div>` : '';

      return `<div class="portfolio-admin-item" style="${inq.read_status?'opacity:0.75;':'border-left:4px solid var(--gold);'}">
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
            <strong style="color:#fff; font-size:1rem;">${escapeHtml(inq.name || 'Anonymous Visitor')}</strong>
            <span class="status-pill ${sc}">${escapeHtml(inq.status||'New')}</span>
          </div>
          <div style="color:var(--text2); font-size:0.85rem; margin-top:2px;">${escapeHtml(contactInfo)}</div>
          <p style="color:var(--text1); font-size:0.88rem; margin-top:6px; background:var(--surface2); padding:8px 12px; border-radius:6px;">${escapeHtml(inq.message || 'No message provided.')}</p>
          <div style="display:flex; gap:12px; font-size:0.75rem; color:var(--text3); margin-top:6px;">
            <span>📅 ${escapeHtml(inq.submitted_at||'')}</span>
          </div>
          ${mobActions}
        </div>
        <div class="port-actions" style="align-self:flex-start;">
          <button class="btn-admin-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="openEditLeadInline(${inq.id},'inquiry')">Status</button>
          <button class="btn-media-del" style="padding:4px 10px; font-size:0.75rem;" onclick="deleteInquiry(${inq.id})">Delete</button>
        </div>
      </div>`;
    }).join('');
  }

  window.deleteInquiry = async function(id) {
    if (!confirm('Delete this inquiry?')) return;
    await fetch(`${API_BASE}?action=delete_inquiry&id=${id}`, { credentials: 'include',  method: 'DELETE', headers: {  } });
    showToast('Inquiry deleted'); fetchData(); fetchDashboardStats();
  };

  // --- MEDIA LIBRARY ---
  async function fetchMedia() {
    try {
      const res = await fetch(`${API_BASE}?action=get_media`, { credentials: 'include' }).then(r => r.json());
      if (res && res.success) {
        appData.media = res.media || [];
        renderMediaLibrary();
      } else {
        showToast('Unable to load Media Library: ' + (res?.message || 'Server error'));
      }
    } catch (err) {
      showToast('Unable to load Media Library. Please check network connection.');
    }
  }

  let activeMediaFilter = 'all';
  let activePickerFilter = 'all';

  window.filterMediaLibraryByCompany = function(catSlug) {
    activeMediaFilter = catSlug || 'all';
    renderMediaLibrary();
  };

  window.filterPickerMediaByCompany = function(catSlug) {
    activePickerFilter = catSlug || 'all';
    renderMediaLibrary();
  };

  window.activePickerField = null;

  window.openMediaSelector = function(targetFieldId) {
    window.activePickerField = targetFieldId;
    const overlay = document.getElementById('mediaPickerOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
    }

    // Auto-filter by company if editing a portfolio project
    const projCategory = document.getElementById('projCategory')?.value.trim();
    const pickerFilterSelect = document.getElementById('pickerCompanyFilter');
    
    if (pickerFilterSelect && projCategory) {
      const matchOpt = Array.from(pickerFilterSelect.options).find(o => 
        o.text.toLowerCase().includes(projCategory.toLowerCase()) || 
        o.value.toLowerCase().includes(projCategory.toLowerCase())
      );
      if (matchOpt) {
        pickerFilterSelect.value = matchOpt.value;
        activePickerFilter = matchOpt.value;
      }
    }

    fetchMedia();
  };

  window.closeMediaPicker = function() {
    const overlay = document.getElementById('mediaPickerOverlay');
    if (overlay) overlay.style.display = 'none';
    window.activePickerField = null;
  };

  window.selectMediaItem = function(encodedFilepath) {
    const filepath = decodeURIComponent(encodedFilepath || '');
    const targetId = window.activePickerField;
    if (!targetId || !filepath) return;

    if (targetId === 'projGallery') {
      if (!currentProjectGallery.includes(filepath)) {
        currentProjectGallery.push(filepath);
        renderGalleryManager();
        showToast('Image added to project gallery!');
      } else {
        showToast('Image already in project gallery', 'warning');
      }
      closeMediaPicker();
    } else if (targetId === 'projVideoManager') {
      if (!currentProjectVideos.includes(filepath)) {
        currentProjectVideos.push(filepath);
        renderVideoGalleryManager();
        showToast('Video added to project video gallery!');
      }
      closeMediaPicker();
    } else {
      const field = document.getElementById(targetId);
      if (field) {
        field.value = filepath;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        if (targetId === 'projImgUrl') {
          window.updateCoverPreview();
        }
        if (targetId === 'projCompanyLogo') {
          window.updateLogoPreview();
        }
      }
      closeMediaPicker();
      showToast('Image selected successfully!');
    }
  };

  const isVideoFile = (fp) => /\.(mp4|webm|mov|ogg|mkv|avi|m4v|3gp)(\?.*)?$/i.test(String(fp || ''));

  /**
   * High-Performance Client-Side Image Optimizer
   * Pre-compresses large camera photos (e.g. 10MB-25MB) to high-quality 2400px max web images in ~40ms,
   * making image uploads 50x faster and eliminating network timeouts!
   */
  async function optimizeImageForUpload(file) {
    if (!file || !file.type || !file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
      return file;
    }
    // Skip small images that don't need compression
    if (file.size < 700 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 2400;
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;

          if (w <= MAX_DIM && h <= MAX_DIM && file.size < 1.2 * 1024 * 1024) {
            resolve(file);
            return;
          }

          if (w > h && w > MAX_DIM) {
            h = Math.round((h * MAX_DIM) / w);
            w = MAX_DIM;
          } else if (h > MAX_DIM) {
            w = Math.round((w * MAX_DIM) / h);
            h = MAX_DIM;
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          const isPng = file.type === 'image/png';
          const outType = isPng ? 'image/png' : 'image/jpeg';
          const quality = isPng ? undefined : 0.90;

          canvas.toBlob((blob) => {
            if (blob && blob.size < file.size) {
              const optimizedFile = new File([blob], file.name, {
                type: outType,
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          }, outType, quality);
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  }

  // --- REAL-TIME UPLOAD ENGINE WITH CONCURRENCY QUEUE & LIVE PROGRESS ---
  const UploadManager = {
    showOverlay(title, totalFiles) {
      const overlay = document.getElementById('uploadProgressOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        const titleEl = document.getElementById('uploadModalMainTitle');
        const countEl = document.getElementById('uploadFileCounter');
        const nameEl = document.getElementById('uploadCurrentFileName');
        const fillEl = document.getElementById('uploadBarFill');
        const bytesEl = document.getElementById('uploadBytesStatus');
        const pctEl = document.getElementById('uploadPercentStatus');
        if (titleEl) titleEl.textContent = title || 'Uploading Files...';
        if (countEl) countEl.textContent = `1 / ${totalFiles}`;
        if (nameEl) nameEl.textContent = 'Preparing upload...';
        if (fillEl) fillEl.style.width = '0%';
        if (bytesEl) bytesEl.textContent = '0 MB / 0 MB';
        if (pctEl) pctEl.textContent = '0%';
      }
    },
    update(fileIndex, totalFiles, fileName, pct, loadedBytes, totalBytes) {
      const overlay = document.getElementById('uploadProgressOverlay');
      if (overlay && overlay.style.display !== 'none') {
        const countEl = document.getElementById('uploadFileCounter');
        const nameEl = document.getElementById('uploadCurrentFileName');
        const fillEl = document.getElementById('uploadBarFill');
        const bytesEl = document.getElementById('uploadBytesStatus');
        const pctEl = document.getElementById('uploadPercentStatus');
        if (countEl) countEl.textContent = `${fileIndex} / ${totalFiles}`;
        if (nameEl) nameEl.textContent = `📁 ${fileName}`;
        if (fillEl) fillEl.style.width = `${pct}%`;
        const loadedMB = loadedBytes ? (loadedBytes / (1024 * 1024)).toFixed(1) : '0';
        const totalMB = totalBytes ? (totalBytes / (1024 * 1024)).toFixed(1) : '0';
        if (bytesEl) bytesEl.textContent = `${loadedMB} MB / ${totalMB} MB`;
        if (pctEl) pctEl.textContent = `${pct}%`;
      }
    },
    hideOverlay() {
      const overlay = document.getElementById('uploadProgressOverlay');
      if (overlay) {
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 350);
      }
    }
  };

  /**
   * Upload single media file with XMLHttpRequest for progress tracking
   */
  async function uploadSingleMedia(rawFile, onProgress) {
    const isImage = rawFile.type && rawFile.type.startsWith('image/');
    const fileToUpload = isImage ? await optimizeImageForUpload(rawFile) : rawFile;

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}?action=upload_media`, true);
      xhr.withCredentials = true;

      if (xhr.upload && typeof onProgress === 'function') {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            onProgress(pct, e.loaded, e.total);
          }
        };
      }

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            resolve({ success: false, message: 'Invalid response: ' + (xhr.responseText.substring(0, 80) || 'Unknown error') });
          }
        } else if (xhr.status === 413) {
          resolve({ success: false, message: 'File is too large for the server (HTTP 413).' });
        } else {
          resolve({ success: false, message: `Upload failed (HTTP ${xhr.status})` });
        }
      };

      xhr.onerror = function() {
        resolve({ success: false, message: 'Network connection error during upload.' });
      };

      xhr.ontimeout = function() {
        resolve({ success: false, message: 'Upload timed out. Please try again with a smaller file.' });
      };

      // 10 minutes timeout for very large videos
      xhr.timeout = 600000;

      const fd = new FormData();
      fd.append('file', fileToUpload);
      xhr.send(fd);
    });
  }

  /**
   * Controlled Concurrency Batch Uploader (max 2 parallel uploads at once)
   */
  async function uploadMediaBatch(files, modalTitle = 'Uploading Files...') {
    if (!files || !files.length) return [];
    UploadManager.showOverlay(modalTitle, files.length);

    const results = new Array(files.length);
    let completedCount = 0;
    let nextIndex = 0;
    const CONCURRENCY = 2; // Optimal concurrency to prevent bandwidth choking

    async function worker() {
      while (nextIndex < files.length) {
        const idx = nextIndex++;
        const file = files[idx];
        UploadManager.update(completedCount + 1, files.length, file.name, 5, 0, file.size);

        try {
          const res = await uploadSingleMedia(file, (pct, loaded, total) => {
            UploadManager.update(completedCount + 1, files.length, file.name, pct, loaded, total);
          });
          results[idx] = { file, res };
        } catch (err) {
          results[idx] = { file, res: { success: false, message: err.message || 'Upload error' } };
        }
        completedCount++;
      }
    }

    const workers = [];
    const poolSize = Math.min(CONCURRENCY, files.length);
    for (let i = 0; i < poolSize; i++) {
      workers.push(worker());
    }

    await Promise.all(workers);
    UploadManager.hideOverlay();
    return results;
  }

  function renderMediaLibrary() {
    let items = appData.media || [];

    let mainFiltered = items;
    if (activeMediaFilter && activeMediaFilter !== 'all') {
      mainFiltered = items.filter(m => {
        const fn = (m.filename || '').toLowerCase();
        const fp = (m.filepath || '').toLowerCase();
        return fn.includes(activeMediaFilter.toLowerCase()) || fp.includes(activeMediaFilter.toLowerCase());
      });
    }

    let pickerFiltered = items;
    if (activePickerFilter && activePickerFilter !== 'all') {
      pickerFiltered = items.filter(m => {
        const fn = (m.filename || '').toLowerCase();
        const fp = (m.filepath || '').toLowerCase();
        return fn.includes(activePickerFilter.toLowerCase()) || fp.includes(activePickerFilter.toLowerCase());
      });
    }

    const buildMainHtml = (list) => list.map(m => {
      const isVid = isVideoFile(m.filepath || m.filename);
      return `
        <div class="media-card" style="position:relative;">
          ${isVid ?
            `<div style="position:relative; width:100%; height:140px; background:#000; border-radius:8px; overflow:hidden;">
              <video src="${escapeHtml(m.filepath)}" preload="metadata" muted playsinline style="width:100%; height:100%; object-fit:cover;"></video>
              <span style="position:absolute; top:6px; left:6px; background:rgba(0,0,0,0.75); color:#FFB800; font-size:0.72rem; padding:2px 8px; border-radius:10px; font-weight:700;">▶ Video</span>
            </div>` :
            `<img src="${escapeHtml(m.filepath)}" alt="${escapeHtml(m.filename)}" loading="lazy" style="width:100%; height:140px; object-fit:cover; border-radius:8px;" />`
          }
          <div class="media-card-footer" style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <span style="font-size:0.75rem; color:var(--text2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px;" title="${escapeHtml(m.filename)}">${escapeHtml(m.filename)}</span>
            <button class="btn-media-del" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteMedia('${m.id}')">Delete</button>
          </div>
        </div>`;
    }).join('') || `<p style="color:var(--text2); grid-column: 1 / -1; text-align:center; padding:1.5rem;">No media files found for selected category.</p>`;

    const buildPickerHtml = (list) => list.map(m => {
      const safePath = encodeURIComponent(m.filepath || '');
      const isVid = isVideoFile(m.filepath || m.filename);
      return `
        <div class="media-card picker-card" style="cursor:pointer; border:1px solid var(--border); border-radius:10px; padding:8px; background:var(--surface2); transition:all 0.2s;" onclick="selectMediaItem('${safePath}')">
          ${isVid ?
            `<div style="position:relative; width:100%; height:120px; background:#000; border-radius:6px; overflow:hidden;">
              <video src="${escapeHtml(m.filepath)}" preload="metadata" muted playsinline style="width:100%; height:100%; object-fit:cover;"></video>
              <span style="position:absolute; top:4px; left:4px; background:rgba(0,0,0,0.75); color:#FFB800; font-size:0.68rem; padding:2px 6px; border-radius:8px; font-weight:700;">▶ Video</span>
            </div>` :
            `<img src="${escapeHtml(m.filepath)}" alt="${escapeHtml(m.filename)}" loading="lazy" style="width:100%; height:120px; object-fit:cover; border-radius:6px;" />`
          }
          <div style="margin-top:6px; display:flex; flex-direction:column; gap:4px;">
            <span style="font-size:0.72rem; color:var(--text2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(m.filename)}">${escapeHtml(m.filename)}</span>
            <button type="button" class="btn-admin-primary" style="width:100%; padding:5px 8px; font-size:0.75rem; font-weight:700; border-radius:6px;" onclick="event.stopPropagation(); selectMediaItem('${safePath}')">✓ Select ${isVid ? 'Video' : 'Image'}</button>
          </div>
        </div>`;
    }).join('') || `<p style="color:var(--text2); grid-column: 1 / -1; text-align:center; padding:1.5rem;">No media files found in library for selected folder.</p>`;

    const grid = document.getElementById('mediaLibraryGrid');
    const pickerGrid = document.getElementById('pickerMediaLibraryGrid');
    if (grid) grid.innerHTML = buildMainHtml(mainFiltered);
    if (pickerGrid) pickerGrid.innerHTML = buildPickerHtml(pickerFiltered);
  }

  // Media Library Tab Upload Handler (Images & Videos with Live Progress)
  document.getElementById('mediaUploadFileInput')?.addEventListener('change', async function() {
    if (!this.files || !this.files.length) return;
    const files = Array.from(this.files);
    const results = await uploadMediaBatch(files, 'Uploading to Media Library...');

    const succeeded = results.filter(r => r.res?.success);
    const failed = results.filter(r => !r.res?.success);

    if (succeeded.length > 0) {
      showToast(`Successfully uploaded ${succeeded.length} file(s)!`);
      fetchMedia();
    }
    if (failed.length > 0) {
      showToast(`Failed to upload ${failed.length} file(s): ${failed.map(f => f.file.name).join(', ')}`, 'error');
    }
    this.value = '';
  });

  // Media Picker Upload Handler (Images & Videos with Live Progress)
  document.getElementById('pickerUploadFileInput')?.addEventListener('change', async function() {
    if (!this.files || !this.files.length) return;
    const files = Array.from(this.files);
    const results = await uploadMediaBatch(files, 'Uploading Media...');

    const succeeded = results.filter(r => r.res?.success);
    if (succeeded.length > 0) {
      showToast(`Uploaded ${succeeded.length} file(s)!`);
      await fetchMedia();
      if (succeeded.length === 1 && succeeded[0].res?.filepath) {
        selectMediaItem(encodeURIComponent(succeeded[0].res.filepath));
      }
    }
    this.value = '';
  });

  // --- PORTFOLIO MEDIA & GALLERY MANAGER ---
  let currentProjectGallery = [];

  window.updateLogoPreview = function() {
    const url = document.getElementById('projCompanyLogo')?.value.trim();
    const container = document.getElementById('logoPreviewContainer');
    const img = document.getElementById('logoPreviewImg');
    if (url) {
      if (img) img.src = url;
      if (container) container.style.display = 'inline-block';
    } else {
      if (container) container.style.display = 'none';
    }
  };

  window.clearLogoImage = function() {
    const input = document.getElementById('projCompanyLogo');
    if (input) input.value = '';
    window.updateLogoPreview();
  };

  window.triggerLogoFileUpload = function() {
    document.getElementById('logoFileInput')?.click();
  };

  document.getElementById('logoFileInput')?.addEventListener('change', async function() {
    if (!this.files || !this.files[0]) return;
    const file = this.files[0];
    const results = await uploadMediaBatch([file], 'Uploading Company Logo...');
    if (results[0]?.res?.success) {
      const path = results[0].res.filepath || results[0].res.url;
      const logoInput = document.getElementById('projCompanyLogo');
      if (logoInput) {
        logoInput.value = path;
        window.updateLogoPreview();
      }
      showToast('Logo uploaded successfully!');
      fetchMedia();
    } else {
      showToast(results[0]?.res?.message || 'Logo upload failed', 'error');
    }
    this.value = '';
  });

  window.updateCoverPreview = function() {
    const url = document.getElementById('projImgUrl')?.value.trim();
    const container = document.getElementById('coverPreviewContainer');
    const img = document.getElementById('coverPreviewImg');
    if (url) {
      if (img) img.src = url;
      if (container) container.style.display = 'inline-block';
    } else {
      if (container) container.style.display = 'none';
    }
  };

  window.clearCoverImage = function() {
    const input = document.getElementById('projImgUrl');
    if (input) input.value = '';
    window.updateCoverPreview();
  };

  window.triggerCoverFileUpload = function() {
    document.getElementById('coverFileInput')?.click();
  };

  // Cover Image File Change Handler (with fast optimization)
  document.getElementById('coverFileInput')?.addEventListener('change', async function() {
    if (!this.files || !this.files[0]) return;
    const file = this.files[0];
    const results = await uploadMediaBatch([file], 'Uploading Cover Image...');
    if (results[0]?.res?.success) {
      const path = results[0].res.filepath || results[0].res.url;
      const coverInput = document.getElementById('projImgUrl');
      if (coverInput) {
        coverInput.value = path;
        window.updateCoverPreview();
      }
      showToast('Cover image uploaded successfully!');
      fetchMedia();
    } else {
      showToast(results[0]?.res?.message || 'Cover upload failed', 'error');
    }
    this.value = '';
  });

  // --- PORTFOLIO MEDIA & GALLERY MANAGERS ---
  let currentProjectVideos = [];

  window.triggerVideoMultiUpload = function() {
    document.getElementById('videoMultiFileInput')?.click();
  };

  window.addVideoUrlFromInput = function() {
    const input = document.getElementById('projVideoUrlInput');
    const val = input?.value.trim();
    if (val) {
      currentProjectVideos.push(val);
      if (input) input.value = '';
      renderVideoGalleryManager();
      showToast('Video added!');
    }
  };

  window.removeVideoFromGallery = function(idx) {
    currentProjectVideos.splice(idx, 1);
    renderVideoGalleryManager();
    showToast('Video removed!');
  };

  window.moveVideoItem = function(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentProjectVideos.length) return;
    const temp = currentProjectVideos[index];
    currentProjectVideos[index] = currentProjectVideos[newIndex];
    currentProjectVideos[newIndex] = temp;
    renderVideoGalleryManager();
  };

  function renderVideoGalleryManager() {
    const grid = document.getElementById('videoThumbnailsGrid');
    const hiddenTextarea = document.getElementById('projVideoUrls');
    if (!grid) return;

    if (hiddenTextarea) {
      hiddenTextarea.value = JSON.stringify(currentProjectVideos);
    }

    if (!currentProjectVideos.length) {
      grid.innerHTML = `<p id="videoEmptyNotice" style="color:var(--text3); font-size:0.9rem; margin:0; width:100%; text-align:center; padding:16px 0; grid-column:1/-1;">No project videos added yet. Click "Upload Videos" or paste video URLs above.</p>`;
      return;
    }

    grid.innerHTML = currentProjectVideos.map((item, idx) => {
      const url = (typeof item === 'object' && item !== null) ? (item.url || '') : String(item || '');
      const isDirect = (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('uploads/') || url.includes('assets/videos/'));
      return `
        <div class="video-thumb-card" data-index="${idx}">
          <div class="thumb-video-wrap">
            ${isDirect ?
              `<video src="${escapeHtml(url)}" preload="metadata" muted playsinline></video>` :
              `<div class="video-link-badge">🎬 <span>${escapeHtml(url.replace(/^https?:\/\//, '').substring(0,25))}</span></div>`
            }
          </div>
          <div class="thumb-actions">
            <button type="button" title="Move Left / Up" onclick="moveVideoItem(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>◀</button>
            <button type="button" title="Move Right / Down" onclick="moveVideoItem(${idx}, 1)" ${idx === currentProjectVideos.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>▶</button>
            <button type="button" class="btn-thumb-del" title="Remove video" onclick="removeVideoFromGallery(${idx})">✕</button>
          </div>
        </div>`;
    }).join('');
  }

  // Multi-Video Upload Handler (Batch with Concurrency & Live Progress)
  document.getElementById('videoMultiFileInput')?.addEventListener('change', async function() {
    if (!this.files || !this.files.length) return;
    const files = Array.from(this.files);
    const results = await uploadMediaBatch(files, 'Uploading Project Videos...');

    let addedCount = 0;
    results.forEach(({ file, res }) => {
      if (res?.success && (res.filepath || res.url)) {
        const path = res.filepath || res.url;
        currentProjectVideos.push(path);
        addedCount++;
      } else {
        showToast(`Failed: ${file.name} (${res?.message || 'Error'})`, 'error');
      }
    });

    renderVideoGalleryManager();
    if (addedCount > 0) {
      showToast(`Added ${addedCount} video(s) to project!`);
      fetchMedia();
    }
    this.value = '';
  });

  window.triggerGalleryMultiUpload = function() {
    document.getElementById('galleryMultiFileInput')?.click();
  };

  function renderGalleryManager() {
    const grid = document.getElementById('galleryThumbnailsGrid');
    const hiddenTextarea = document.getElementById('projGalleryUrls');
    if (!grid) return;

    if (hiddenTextarea) {
      hiddenTextarea.value = JSON.stringify(currentProjectGallery);
    }

    if (!currentProjectGallery.length) {
      grid.innerHTML = `<p id="galleryEmptyNotice" style="color:var(--text3); font-size:0.9rem; margin:0; width:100%; text-align:center; padding:16px 0; grid-column:1/-1;">No gallery images added yet. Click "Upload Images" or "Choose From Library" to add project photos.</p>`;
      return;
    }

    grid.innerHTML = currentProjectGallery.map((url, idx) => `
      <div class="gallery-thumb-card" data-index="${idx}">
        <div class="thumb-img-wrap">
          <img src="${escapeHtml(url)}" alt="Gallery item ${idx+1}" loading="lazy" />
        </div>
        <div class="thumb-actions">
          <button type="button" title="Move Left / Up" onclick="moveGalleryItem(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>◀</button>
          <button type="button" title="Move Right / Down" onclick="moveGalleryItem(${idx}, 1)" ${idx === currentProjectGallery.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>▶</button>
          <button type="button" class="btn-thumb-del" title="Remove from project gallery" onclick="removeGalleryItem(${idx})">✕</button>
        </div>
      </div>
    `).join('');
  }

  window.moveGalleryItem = function(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentProjectGallery.length) return;
    const temp = currentProjectGallery[index];
    currentProjectGallery[index] = currentProjectGallery[newIndex];
    currentProjectGallery[newIndex] = temp;
    renderGalleryManager();
  };

  window.removeGalleryItem = function(index) {
    if (index >= 0 && index < currentProjectGallery.length) {
      currentProjectGallery.splice(index, 1);
      renderGalleryManager();
      showToast('Image removed from project gallery');
    }
  };

  // Multi-Gallery Files Change Handler (Batch with Concurrency & Live Progress)
  document.getElementById('galleryMultiFileInput')?.addEventListener('change', async function() {
    if (!this.files || !this.files.length) return;
    const files = Array.from(this.files);
    const results = await uploadMediaBatch(files, 'Uploading Project Gallery Images...');

    let addedCount = 0;
    results.forEach(({ file, res }) => {
      if (res?.success && (res.filepath || res.url)) {
        const path = res.filepath || res.url;
        currentProjectGallery.push(path);
        addedCount++;
      } else {
        showToast(`Failed: ${file.name} (${res?.message || 'Error'})`, 'error');
      }
    });

    renderGalleryManager();
    if (addedCount > 0) {
      showToast(`Added ${addedCount} photo(s) to gallery!`);
      fetchMedia();
    }
    this.value = '';
  });

  // --- SEO MANAGEMENT ---
  async function loadSeoSettings() {
    try {
      const res = await fetch(`${API_BASE}?action=get_seo&page=home`).then(r => r.json());
      if (res?.success && res.seo) {
        const s = res.seo;
        setVal('seoTitleEn', s.title_en); setVal('seoTitleAr', s.title_ar);
        setVal('seoDescEn', s.description_en); setVal('seoDescAr', s.description_ar);
        setVal('seoKeywords', s.keywords);
        setVal('seoOgTitleEn', s.og_title_en); setVal('seoOgTitleAr', s.og_title_ar);
        setVal('seoCanonical', s.canonical_url);
      }
    } catch (_) {}
  }

  document.getElementById('seoForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim();
    const res = await fetch(`${API_BASE}?action=save_seo`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_key:'home', title_en:f('seoTitleEn'), title_ar:f('seoTitleAr'), description_en:f('seoDescEn'), description_ar:f('seoDescAr'), keywords:f('seoKeywords'), og_title_en:f('seoOgTitleEn'), og_title_ar:f('seoOgTitleAr'), canonical_url:f('seoCanonical') })
    }).then(r => r.json());
    if (res?.success) showToast('SEO settings saved successfully!');
  });

  // --- SITE SETTINGS & ACCENT COLOR ---
  document.getElementById('colorForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const color = document.getElementById('accentColorHex')?.value.trim();
    if (!color) return;
    await saveContent('settings', { accent_color: color });
    showToast('Accent color saved!');
  });

  const accentPicker = document.getElementById('accentColorPicker');
  const accentHex    = document.getElementById('accentColorHex');
  if (accentPicker && accentHex) {
    accentPicker.addEventListener('input', e => accentHex.value = e.target.value);
    accentHex.addEventListener('input', e => accentPicker.value = e.target.value);
  }
  document.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.dataset.color;
      if (accentPicker) accentPicker.value = c;
      if (accentHex)    accentHex.value = c;
    });
  });

  // --- CHANGE ADMIN PASSWORD ---
  document.getElementById('changePassForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPass = document.getElementById('currentPass')?.value.trim();
    const newPass = document.getElementById('newPass')?.value.trim();
    const confirm = document.getElementById('confirmPass')?.value.trim();
    const errEl   = document.getElementById('passChangeErr');
    if (errEl) errEl.hidden = true;

    if (newPass !== confirm) {
      if (errEl) { errEl.textContent = 'New passwords do not match.'; errEl.hidden = false; }
      return;
    }
    if (newPass.length < 12) {
      if (errEl) { errEl.textContent = 'New password must be at least 12 characters long.'; errEl.hidden = false; }
      return;
    }

    const res = await fetch(`${API_BASE}?action=change_password`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password: oldPass, new_password: newPass })
    }).then(r => r.json());

    if (res?.success) {
      showToast('Password updated successfully! Redirecting to login...');
      document.getElementById('changePassForm').reset();
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1500);
    } else if (errEl) {
      errEl.textContent = res?.message || 'Error updating password';
      errEl.hidden = false;
    }
  });

  // --- EMAIL & SECURITY SETTINGS (Super Admin Only) ---
  async function fetchEmailSettings() {
    try {
      const res = await fetch(`${API_BASE}?action=get_email_settings`, { credentials: 'include', 
        headers: {  }
      }).then(r => r.json());

      if (res && res.success) {
        setVal('sysNotifyEmailInput', res.system_notification_email || 'momenyahia8@gmail.com');
        if (res.smtp) {
          setVal('smtpHost', res.smtp.host);
          setVal('smtpPort', res.smtp.port);
          setVal('smtpUser', res.smtp.username);
          setVal('smtpEncrypt', res.smtp.encryption || 'tls');
          setVal('smtpFromName', res.smtp.from_name || 'Egypt Creative');
          setVal('smtpFromEmail', res.smtp.from_email || 'noreply@egyptcreative.com');
          if (res.smtp.password_set) {
            setVal('smtpPass', '********');
          }
        }
      }
    } catch (_) {}
  }

  document.getElementById('notifyEmailForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('sysNotifyEmailInput')?.value.trim();
    if (!email) return;
    const res = await fetch(`${API_BASE}?action=save_email_settings`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_notification_email: email })
    }).then(r => r.json());
    if (res?.success) showToast('System notification email saved!');
  });

  document.getElementById('smtpForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = id => document.getElementById(id)?.value.trim();
    const payload = {
      system_notification_email: document.getElementById('sysNotifyEmailInput')?.value.trim() || 'momenyahia8@gmail.com',
      smtp: {
        host: f('smtpHost'),
        port: f('smtpPort'),
        username: f('smtpUser'),
        password: f('smtpPass'),
        encryption: document.getElementById('smtpEncrypt')?.value,
        from_name: f('smtpFromName'),
        from_email: f('smtpFromEmail')
      }
    };
    const res = await fetch(`${API_BASE}?action=save_email_settings`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());
    if (res?.success) showToast('SMTP settings saved successfully!');
  });

  document.getElementById('testSmtpBtn')?.addEventListener('click', async () => {
    showToast('Sending test email to momenyahia8@gmail.com...');
    try {
      const res = await fetch(`${API_BASE}?action=test_smtp`, { credentials: 'include', 
        headers: {  }
      }).then(r => r.json());
      if (res && res.success) showToast('Test email sent to momenyahia8@gmail.com!');
      else showToast('SMTP Test failed: ' + (res?.message || 'Check config'));
    } catch (e) { showToast('SMTP Test connection error'); }
  });

  // --- USER ACCOUNTS & ACCESS ROLES MANAGEMENT (Super Admin Only) ---
  function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    if (!appData.users || !appData.users.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2.5rem; color:var(--text3);">No team accounts found.</td></tr>`;
      return;
    }

    const roleBadges = {
      'super_admin': { label: '👑 Super Admin', bg: 'rgba(255,184,0,0.15)', color: '#FFB800', border: 'rgba(255,184,0,0.35)' },
      'editor': { label: '✏️ Editor', bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: 'rgba(59,130,246,0.35)' },
      'sales': { label: '💼 Sales / Leads', bg: 'rgba(16,185,129,0.15)', color: '#34D399', border: 'rgba(16,185,129,0.35)' },
      'viewer': { label: '👁️ Viewer', bg: 'rgba(148,163,184,0.15)', color: '#94A3B8', border: 'rgba(148,163,184,0.35)' }
    };

    tbody.innerHTML = appData.users.map(u => {
      const isActive = (u.active !== undefined && u.active !== null) ? (Number(u.active) === 1) : true;
      const statusPill = isActive
        ? `<span style="background:rgba(16,185,129,0.15); color:#10B981; border:1px solid rgba(16,185,129,0.3); padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:700; text-transform:uppercase;">Active</span>`
        : `<span style="background:rgba(239,68,68,0.15); color:#EF4444; border:1px solid rgba(239,68,68,0.3); padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:700; text-transform:uppercase;">Suspended</span>`;

      const roleCfg = roleBadges[u.role] || { label: u.role || 'Member', bg: 'rgba(255,255,255,0.08)', color: '#fff', border: 'rgba(255,255,255,0.2)' };
      const roleBadge = `<span style="background:${roleCfg.bg}; color:${roleCfg.color}; border:1px solid ${roleCfg.border}; padding:3px 10px; border-radius:12px; font-size:0.78rem; font-weight:700;">${roleCfg.label}</span>`;

      return `
        <tr style="border-bottom:1px solid var(--border); transition:background 0.2s ease;">
          <td style="padding:14px; vertical-align:middle;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:36px; height:36px; border-radius:50%; background:rgba(255,184,0,0.15); border:1px solid rgba(255,184,0,0.3); color:#FFB800; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.95rem;">
                ${escapeHtml((u.name || u.username || u.email || 'U')[0].toUpperCase())}
              </div>
              <div>
                <strong style="color:#FFFFFF; font-size:0.95rem; display:block;">${escapeHtml(u.name || u.username)}</strong>
                <span style="color:var(--text3); font-size:0.78rem;">@${escapeHtml(u.username || '')}</span>
              </div>
            </div>
          </td>
          <td style="padding:14px; vertical-align:middle; color:var(--text2); font-size:0.88rem;">${escapeHtml(u.email || '-')}</td>
          <td style="padding:14px; vertical-align:middle;">${roleBadge}</td>
          <td style="padding:14px; vertical-align:middle;">${statusPill}</td>
          <td style="padding:14px; vertical-align:middle; text-align:right;">
            <div style="display:inline-flex; gap:6px; align-items:center;">
              <button class="btn-admin-secondary" style="padding:5px 12px; font-size:0.78rem;" onclick="editUserInline('${u.id}')">✏️ Edit</button>
              <button class="btn-admin-secondary" style="padding:5px 12px; font-size:0.78rem;" onclick="toggleUserStatus('${u.id}', ${isActive ? 0 : 1})">${isActive ? '⏸️ Suspend' : '▶️ Activate'}</button>
              ${u.role !== 'super_admin' ? `<button class="btn-media-del" style="padding:5px 10px; font-size:0.78rem;" onclick="deleteUserAccount('${u.id}')">🗑️ Delete</button>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.toggleUserStatus = async function(id, newStatus) {
    try {
      const res = await fetch(`${API_BASE}?action=toggle_user_status`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), active: newStatus })
      }).then(r => r.json());

      if (res && res.success) {
        showToast(newStatus === 1 ? 'User activated successfully!' : 'User suspended successfully!');
        await fetchData();
      } else {
        showToast('Error: ' + (res?.message || 'Failed to update user status'));
      }
    } catch (e) {
      showToast('Connection error updating user status');
    }
  };

  document.getElementById('addNewUserBtn')?.addEventListener('click', () => {
    document.getElementById('userForm')?.reset();
    setVal('editUserId', '');
    setVal('userName', '');
    setVal('userUsername', '');
    setVal('userEmail', '');
    setVal('userPassword', '');
    setVal('userRole', 'editor');
    setVal('userStatusSelect', '1');

    document.querySelectorAll('.user-perm-chk').forEach(chk => chk.checked = true);

    const permGroup = document.getElementById('userPermissionsGroup');
    if (permGroup) permGroup.style.display = 'block';

    document.getElementById('userFormTitle').textContent = 'Add New Team Member';
    const passInput = document.getElementById('userPassword');
    if (passInput) passInput.placeholder = '•••••••• (Enter initial password)';

    document.getElementById('saveUserBtn').textContent = 'Create Team Account';
    showView('userFormView', 'usersListView');
  });

  window.editUserInline = function(id) {
    const u = appData.users?.find(x => String(x.id) === String(id));
    if (!u) return;

    setVal('editUserId', u.id);
    setVal('userName', u.name || '');
    setVal('userUsername', u.username || '');
    setVal('userEmail', u.email || '');
    setVal('userPassword', '');
    setVal('userRole', u.role || 'editor');
    setVal('userStatusSelect', (u.active !== undefined && u.active !== null) ? String(u.active) : '1');

    let perms = [];
    try {
      perms = typeof u.permissions === 'string' ? JSON.parse(u.permissions) : (u.permissions || []);
    } catch(e) {}

    document.querySelectorAll('.user-perm-chk').forEach(chk => {
      chk.checked = (u.role === 'super_admin' || perms.includes(chk.value));
    });

    const permGroup = document.getElementById('userPermissionsGroup');
    if (permGroup) {
      permGroup.style.display = (u.role === 'editor') ? 'block' : 'none';
    }

    document.getElementById('userFormTitle').textContent = `Edit Account — ${u.name || u.username}`;
    const passInput = document.getElementById('userPassword');
    if (passInput) passInput.placeholder = '•••••••• (Leave blank to keep current password)';

    document.getElementById('saveUserBtn').textContent = 'Save Account Changes';
    showView('userFormView', 'usersListView');
  };

  document.getElementById('cancelUserForm')?.addEventListener('click', () => showView('usersListView', 'userFormView'));
  document.getElementById('cancelUserForm2')?.addEventListener('click', () => showView('usersListView', 'userFormView'));

  document.getElementById('userRole')?.addEventListener('change', (e) => {
    const permGroup = document.getElementById('userPermissionsGroup');
    if (permGroup) {
      permGroup.style.display = (e.target.value === 'editor') ? 'block' : 'none';
    }
  });

  document.getElementById('userForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id       = document.getElementById('editUserId').value;
    const name     = document.getElementById('userName').value.trim();
    const username = document.getElementById('userUsername').value.trim();
    const email    = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const role     = document.getElementById('userRole').value;
    const active   = Number(document.getElementById('userStatusSelect').value);
    const permissions = Array.from(document.querySelectorAll('.user-perm-chk:checked')).map(c => c.value);

    if (!id && !password) {
      showToast('Error: Password is required when creating a new account');
      return;
    }

    if (password && password.length < 6) {
      showToast('Error: Password must be at least 6 characters long');
      return;
    }

    const payload = { username: username || email, email, name, role, permissions, active };
    if (id) payload.id = Number(id);
    if (password) payload.password = password;

    try {
      const res = await fetch(`${API_BASE}?action=save_user`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res && res.success) {
        showToast(id ? 'Account updated successfully!' : 'Account created successfully!');
        showView('usersListView', 'userFormView');
        await fetchData();
      } else {
        showToast('Error: ' + (res?.message || 'Failed to save account'));
      }
    } catch (e) {
      showToast('Connection error saving account');
    }
  });

  window.deleteUserAccount = async function(id) {
    if (!confirm('Are you sure you want to delete this team account?')) return;
    try {
      const res = await fetch(`${API_BASE}?action=delete_user&id=${id}`, {
        credentials: 'include',
        method: 'DELETE'
      }).then(r => r.json());

      if (res && res.success) {
        showToast('User account deleted successfully');
        await fetchData();
      } else {
        showToast('Error: ' + (res?.message || 'Failed to delete user'));
      }
    } catch (_) {
      showToast('Connection error deleting user');
    }
  };

  // =========================================================================
  // --- EGYPT CREATIVE PWA & MOBILE MANAGEMENT ENGINE ---
  // =========================================================================

  // Helper: Format phone numbers for Egyptian WhatsApp links
  function formatEgyptianWhatsAppUrl(phone, defaultMsg = 'مرحباً، تواصلنا معك من وكالة Egypt Creative.') {
    if (!phone) return null;
    let digits = String(phone).replace(/\D/g, '');
    if (digits.startsWith('002')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('01') && digits.length === 11) {
      digits = '2' + digits;
    } else if (digits.length === 10 && digits.startsWith('1')) {
      digits = '20' + digits;
    }
    if (!digits) return null;
    return `https://wa.me/${digits}?text=${encodeURIComponent(defaultMsg)}`;
  }

  // Helper: Format phone numbers for direct dial
  function formatPhoneCallUrl(phone) {
    if (!phone) return null;
    const clean = String(phone).replace(/[^\d+]/g, '');
    return clean ? `tel:${clean}` : null;
  }

  // Synthesized Web Audio API Chime (Double-tone golden chime: 880Hz -> 1318.5Hz)
  function playLeadAlertChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // First chime tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.28, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Second harmonic chime tone (higher pitch, golden sparkle)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.12);
      gain2.gain.setValueAtTime(0.32, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  }

  // Browser Notification helper
  function showBrowserNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: 'assets/uploads/img_1788651219_921512f2.png',
          badge: 'assets/uploads/img_1788651219_921512f2.png'
        });
      } catch (_) {}
    }
  }

  // Initialize Notification Toggle Button
  const btnNotifyToggle = document.getElementById('btnNotifyToggle');
  function updateNotifyButtonState() {
    if (!btnNotifyToggle) return;
    if (!('Notification' in window)) {
      btnNotifyToggle.style.display = 'none';
      return;
    }
    if (Notification.permission === 'granted') {
      btnNotifyToggle.classList.add('active');
      btnNotifyToggle.title = 'Sound & Push Alerts Active (Click to test sound)';
      btnNotifyToggle.innerHTML = '<span class="notify-dot"></span><span>🔔 Alerts On</span>';
    } else {
      btnNotifyToggle.classList.remove('active');
      btnNotifyToggle.title = 'Click to enable sound and lead alerts';
      btnNotifyToggle.innerHTML = '<span>🔔 Enable Alerts</span>';
    }
  }

  if (btnNotifyToggle) {
    updateNotifyButtonState();
    btnNotifyToggle.addEventListener('click', async () => {
      if (!('Notification' in window)) {
        showToast('Browser notifications not supported on this device');
        return;
      }
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        updateNotifyButtonState();
        if (perm === 'granted') {
          playLeadAlertChime();
          showToast('🔔 Alerts activated! Double chime tested.');
          showBrowserNotification('Egypt Creative Admin', 'Notifications active! You will hear a chime when new leads arrive.');
        }
      } else if (Notification.permission === 'granted') {
        playLeadAlertChime();
        showToast('🔔 Chime tested! Notifications are already active.');
      } else {
        showToast('Alerts are disabled in browser settings. Please allow notifications.');
      }
    });
  }

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw-admin.js', { scope: './' })
        .then(reg => {
          console.log('[PWA] ServiceWorker registered:', reg.scope);
        })
        .catch(err => {
          console.warn('[PWA] ServiceWorker registration error:', err);
        });
    });
  }

  // PWA Install Prompt Handler
  let deferredPrompt = null;
  const btnPwaInstall = document.getElementById('btnPwaInstall');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnPwaInstall) {
      btnPwaInstall.style.display = 'inline-flex';
    }
  });

  if (btnPwaInstall) {
    // If standalone already, hide button
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      btnPwaInstall.style.display = 'none';
    }
    btnPwaInstall.addEventListener('click', async () => {
      if (!deferredPrompt) {
        showToast('To install on iPhone/iPad: Tap Share ⎋ and choose "Add to Home Screen"');
        return;
      }
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        showToast('Egypt Creative Admin installed successfully!');
        btnPwaInstall.style.display = 'none';
      }
      deferredPrompt = null;
    });
  }

  window.addEventListener('appinstalled', () => {
    if (btnPwaInstall) btnPwaInstall.style.display = 'none';
    showToast('Egypt Creative App installed to your device!');
  });

  // Mobile Bottom Navigation Bar Actions
  const mobTabButtons = document.querySelectorAll('.mob-tab-btn[data-mob-tab]');
  const mobBtnMenu    = document.getElementById('mobBtnMenu');

  function navigateToTab(tabName) {
    const targetNav = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
    if (targetNav) {
      targetNav.click();
    } else {
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      const content = document.getElementById(`tab-${tabName}`);
      if (content) content.classList.add('active');
    }
    mobTabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mobTab === tabName);
    });
  }

  window.navigateToTab = navigateToTab;

  window.openSectionTab = function(tabName, triggerAdd = false) {
    navigateToTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (triggerAdd) {
      setTimeout(() => {
        if (tabName === 'portfolio')    document.getElementById('addPortfolioBtn')?.click();
        if (tabName === 'clients')      document.getElementById('addClientBtn')?.click();
        if (tabName === 'services')     document.getElementById('addServiceBtn')?.click();
        if (tabName === 'testimonials') document.getElementById('addTestiBtn')?.click();
        if (tabName === 'team')         document.getElementById('addTeamBtn')?.click();
      }, 150);
    }
  };

  mobTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.dataset.mobTab;
      navigateToTab(tabName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (mobBtnMenu && adminSidebar) {
    mobBtnMenu.addEventListener('click', (e) => {
      e.preventDefault();
      adminSidebar.classList.toggle('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active', adminSidebar.classList.contains('open'));
    });
  }

  // Real-time Lead Polling (every 25 seconds for mobile & desktop)
  setInterval(async () => {
    try {
      await fetchDashboardStats();
    } catch (_) {}
  }, 25000);

});
