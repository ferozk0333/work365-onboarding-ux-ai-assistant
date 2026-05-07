/* ── MOCK DATA ─────────────────────────────────────────────────────────────── */
const DOCS_CATS = {
  core: {
    key: 'core', title: 'Work 365 Core', count: 14,
    previewLinks: ['Core Architecture & Data Model', 'Partner Center Integration Setup', 'Reconciliation & Billing Execution'],
    sections: [
      { label: 'Getting Started', articles: [
        { name: 'Setting Up Work 365 Core',        key: 'general' },
        { name: 'Connecting to Partner Center',    key: 'general' },
        { name: 'Initial Configuration Checklist', key: 'general' },
        { name: 'User Roles & Permissions',        key: 'general' },
      ]},
      { label: 'Billing & Reconciliation', articles: [
        { name: 'Understanding the Billing Cycle',  key: 'billing' },
        { name: 'Running Reconciliation Reports',   key: 'general' },
        { name: 'Handling Billing Discrepancies',   key: 'general' },
        { name: 'Automated Invoice Generation',     key: 'general' },
        { name: 'Credit Notes & Adjustments',       key: 'general' },
      ]},
      { label: 'Data & Integrations', articles: [
        { name: 'Data Model Overview',        key: 'general' },
        { name: 'Microsoft 365 License Sync', key: 'general' },
        { name: 'Azure Integration Guide',    key: 'general' },
        { name: 'Webhook Configuration',      key: 'general' },
        { name: 'API Reference Guide',        key: 'general' },
      ]},
    ],
  },
  dynamic: {
    key: 'dynamic', title: 'Dynamic Version Documentation', count: 8,
    previewLinks: ['Getting Started with Dynamic Version', 'Managing Subscriptions Dynamically', 'Billing Sync & License Configuration'],
    sections: [
      { label: 'Getting Started', articles: [
        { name: 'Getting Started with Dynamic Version',  key: 'general' },
        { name: 'Managing Subscriptions Dynamically',    key: 'general' },
        { name: 'Billing Sync & License Configuration',  key: 'general' },
      ]},
      { label: 'Advanced', articles: [
        { name: 'Dynamic Pricing Rules',        key: 'general' },
        { name: 'Automated Renewal Settings',   key: 'general' },
        { name: 'Multi-Tenant Configuration',   key: 'general' },
        { name: 'Version Migration Guide',       key: 'general' },
        { name: 'Release Notes & Changelog',    key: 'general' },
      ]},
    ],
  },
  power: {
    key: 'power', title: 'Power Version Documentation', count: 11,
    previewLinks: ['Power Version Overview & Setup', 'License Management in Power Version', 'Advanced Reporting & Analytics'],
    sections: [
      { label: 'Overview', articles: [
        { name: 'Power Version Overview & Setup',       key: 'general' },
        { name: 'License Management in Power Version',  key: 'general' },
        { name: 'Advanced Reporting & Analytics',       key: 'general' },
      ]},
      { label: 'Configuration', articles: [
        { name: 'Power BI Integration',       key: 'general' },
        { name: 'Custom Dashboard Setup',     key: 'general' },
        { name: 'Role-Based Access Control',  key: 'general' },
        { name: 'API Endpoints Reference',    key: 'general' },
        { name: 'Performance Tuning Guide',   key: 'general' },
        { name: 'Security & Compliance',      key: 'general' },
        { name: 'Audit Logging',              key: 'general' },
        { name: 'Data Export Options',        key: 'general' },
      ]},
    ],
  },
  selfservice: {
    key: 'selfservice', title: 'Self-Service Portal', count: 6,
    previewLinks: ['Customer Portal Setup Guide', 'Enabling Self-Service Provisioning', 'Portal Branding & Customization'],
    sections: [
      { label: 'Setup', articles: [
        { name: 'Customer Portal Setup Guide',          key: 'general' },
        { name: 'Enabling Self-Service Provisioning',   key: 'general' },
        { name: 'Portal Branding & Customization',      key: 'general' },
        { name: 'User Invitation & Onboarding',         key: 'general' },
        { name: 'Subscription Self-Management',         key: 'general' },
        { name: 'Invoice & Billing History Access',     key: 'general' },
      ]},
    ],
  },
};

const ARTICLES_DATA = {
  billing: {
    title: 'Understanding the Billing Cycle',
    sub:   'How Work 365 calculates, processes, and distributes invoices each billing period.',
    body: `
      <div class="article-h2">Overview</div>
      <div class="article-p">The <a class="article-link">billing cycle</a> in Work 365 defines how and when invoices are generated for your customers. Each cycle aligns with your configured billing frequency and begins on the <a class="article-link">subscription start date</a>. When a cycle closes, Work 365 automatically pulls license counts from <a class="article-link">Microsoft Partner Center</a> and generates draft invoices ready for review.</div>
      <div class="article-p">Billing is fully automated once configured. The system reconciles seat counts against active licenses, applies any mid-cycle changes (upgrades, downgrades, or cancellations), and calculates <a class="article-link">prorated charges</a>.</div>
      <div class="article-h2">How It Works</div>
      <div class="article-p">At the end of each billing period, Work 365 runs a <a class="article-link">reconciliation job</a> that compares license usage data from Partner Center against the expected subscription quantities. Discrepancies are flagged in the <a class="article-link">Reconciliation Dashboard</a> for manual review before invoices are finalised.</div>
      <div class="article-h2">Key Concepts</div>
      <div class="article-p"><strong>Proration</strong> applies when a subscription changes mid-cycle. Work 365 calculates the number of days remaining and charges only for the active period — customers are never overbilled for unused licences.</div>
      <div class="article-p"><strong>Invoice locking</strong> prevents changes to a finalised invoice. Once a billing cycle closes and invoices are approved, they are locked. Corrections must be made through <a class="article-link">credit notes</a> tracked in the <a class="article-link">Billing Ledger</a>.</div>
    `,
  },
  general: {
    title: 'Setting Up Work 365 Core',
    sub:   'A step-by-step guide to configuring your Work 365 environment for the first time.',
    body: `
      <div class="article-h2">Prerequisites</div>
      <div class="article-p">Before getting started, ensure you have admin access to your Microsoft Partner Center account and valid CSP credentials for your Azure tenant. Work 365 requires these to sync license data accurately.</div>
      <div class="article-h2">Initial Configuration</div>
      <div class="article-p">Navigate to the Settings panel and enter your Partner Center API credentials. Work 365 will validate the connection and begin an initial data sync automatically. This may take up to 15 minutes depending on your tenant size.</div>
      <div class="article-h2">Next Steps</div>
      <div class="article-p">Once the initial sync is complete, your subscriptions will populate in the Billing dashboard. From there, you can configure billing cycles, set up reconciliation rules, and invite team members.</div>
    `,
  },
};

const DOC_ICON = `<svg class="doc-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><line x1="4.5" y1="4.5" x2="9.5" y2="4.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><line x1="4.5" y1="6.5" x2="9.5" y2="6.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><line x1="4.5" y1="8.5" x2="7.5" y2="8.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`;

let currentCat = null;


/* ── LEVEL 1 — Landing ─────────────────────────────────────────────────────── */
function initDocs() {
  setDocsContent(renderDocsLanding());
}

function renderDocsLanding() {
  const cards = Object.values(DOCS_CATS).map(cat => `
    <div class="docs-cat-card" onclick="openCategory('${cat.key}')">
      <div class="docs-cat-header">
        <div class="docs-cat-title">${cat.title}</div>
        <span class="docs-count">${cat.count} Articles</span>
      </div>
      ${cat.previewLinks.map(l => `<div class="docs-cat-link" onclick="event.stopPropagation()">${l} <span>›</span></div>`).join('')}
      <button class="docs-view-all" onclick="event.stopPropagation(); openCategory('${cat.key}')">View all →</button>
    </div>`).join('');

  return `
    <div class="page-mono-label">Documentation</div>
    <div style="font-size:var(--t-22);font-weight:600;letter-spacing:var(--ls-h2);color:var(--ink);margin-bottom:var(--sp-5h);">Work 365 Documentation</div>
    <div class="docs-search-wrap">
      <svg class="docs-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.4"/>
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
      <input class="docs-search" type="text" placeholder="Search documentation…">
    </div>
    <div class="docs-grid">${cards}</div>`;
}


/* ── LEVEL 2 — Category article list ───────────────────────────────────────── */
function openCategory(key) {
  currentCat = key;
  const cat = DOCS_CATS[key];

  const sections = cat.sections.map(sec => `
    <div class="docs-section">
      <div class="docs-sec-label">${sec.label}</div>
      ${sec.articles.map(a => `
        <div class="doc-row">
          <div class="doc-row-l">${DOC_ICON}${a.name}</div>
          <button class="btn-view" data-key="${a.key}" data-name="${a.name.replace(/"/g,'&quot;')}" onclick="openArticle(this.dataset.key, this.dataset.name)">View</button>
        </div>`).join('')}
    </div>`).join('');

  setDocsContent(`
    <button class="docs-back" onclick="initDocs()">← Documentation</button>
    <div class="docs-breadcrumb">Documentation / <span>${cat.title}</span></div>
    <div class="docs-title-row">
      <div class="docs-title">${cat.title}</div>
      <span class="docs-count">${cat.count} Articles</span>
    </div>
    ${sections}`);
}


/* ── LEVEL 3 — Article view ─────────────────────────────────────────────────── */
function openArticle(key, name) {
  const article = ARTICLES_DATA[key] || ARTICLES_DATA.general;
  const cat     = DOCS_CATS[currentCat];
  const askMsg  = `Can you explain "${name}" in the context of Work 365?`;

  setDocsContent(`
    <button class="docs-back" onclick="openCategory('${currentCat}')">← ${cat.title}</button>
    <div class="docs-breadcrumb">Documentation / ${cat.title} / <span>${name}</span></div>
    <div class="article-wrap">
      <div class="article-title">${article.title}</div>
      <div class="article-sub">${article.sub}</div>
      ${article.body}
      <div class="article-footer">
        <div class="footer-resume">
          <div style="margin-bottom:var(--sp-2)">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 11A9 9 0 1 1 4.5 4.5" stroke="#7a3b1a" stroke-width="1.7" stroke-linecap="round"/>
              <polyline points="2,3 2,11 10,11" stroke="#7a3b1a" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="footer-resume-title">Pick up from Last Time?</div>
          <div class="footer-resume-link" onclick="navigate('learning', null)">Resume Last Learning Session →</div>
        </div>
        <div class="footer-help">
          <div class="footer-help-title">Still have questions?</div>
          <div class="footer-help-row" onclick="openCategory('${currentCat}')">
            <div class="footer-help-row-l">${DOC_ICON} Read more articles</div>
            <span style="color:var(--text-40)">›</span>
          </div>
          <div class="footer-help-row" data-q="${askMsg.replace(/"/g,'&quot;')}" onclick="openAI(this.dataset.q)">
            <div class="footer-help-row-l">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4l-3 3V2a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/></svg>
              Ask AI Assistant to explain
            </div>
            <span style="color:var(--text-40)">›</span>
          </div>
        </div>
      </div>
    </div>`);
}


/* ── UTIL ──────────────────────────────────────────────────────────────────── */
function setDocsContent(html) {
  document.getElementById('page-documentation').innerHTML = `<div class="page-inner">${html}</div>`;
}
