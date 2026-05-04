/* =====================================================
   BonScan v2 — App Logic
   ===================================================== */

// ─── STATE ───────────────────────────────────────────
let lang = 'nl';
let receipts = [];
let projects = [];
let currentReceipt = null;
let activeFilter = 'all';
let charts = {};
let deferredInstallPrompt = null;
let cameraStream = null;
let firebaseDb = null;
let fbConfig = null;

// ─── TRANSLATIONS ─────────────────────────────────────
const T = {
  nl: {
    splash_loading: 'Laden...',
    nav_scan: 'Scannen', nav_hist: 'Geschiedenis', nav_items: 'Artikelen',
    nav_proj: 'Projecten', nav_stats: 'Statistieken', nav_set: 'Instellingen',
    bn_scan: 'Scan', bn_hist: 'Bonnen', bn_items: 'Zoeken', bn_proj: 'Projecten', bn_stats: 'Stats',
    ph_scan: 'Bon Scannen', ps_scan: 'Upload of fotografeer een kasticket',
    ph_manual: 'Handmatige invoer', ph_hist: 'Geschiedenis',
    ph_items: 'Artikelen zoeken', ps_items: 'Zoek door al je gekochte artikelen',
    ph_proj: 'Projecten', ph_stats: 'Statistieken', ph_set: 'Instellingen',
    ua_title: 'Sleep een foto hierheen', ua_sub: 'of klik om te bladeren · JPG, PNG, WEBP',
    btn_gallery: 'Gallerij', btn_camera: 'Camera', btn_manual_lbl: 'Handmatig',
    btn_save_res: 'Opslaan', btn_edit_res: 'Bewerken',
    btn_analyze: 'Analyseer bon', lbl_proj_sel: 'Project (optioneel)',
    opt_no_proj: '— Geen project —',
    fl_store: 'Winkel', fl_date: 'Datum', fl_total: 'Totaalbedrag (€)',
    fl_cat: 'Categorie', fl_proj: 'Project', fl_notes: 'Notities',
    fl_items_ttl: 'Artikelen',
    btn_add_row: 'Artikel toevoegen', btn_save_man: 'Opslaan',
    btn_new_proj: '+ Nieuw project',
    lbl_cat_filter: 'Alle categorieën',
    ph_search: 'Zoek op winkel of datum...', ph_item_search: 'Zoek een artikel...',
    hs_dd: 'Datum ↓', hs_da: 'Datum ↑', hs_td: 'Bedrag ↓', hs_ta: 'Bedrag ↑',
    hp_all: 'Alle projecten',
    is_na: 'Naam A-Z', is_pd: 'Prijs ↓', is_fd: 'Meest gekocht',
    sp_all: 'Alle tijd', sp_year: 'Dit jaar', sp_month: 'Deze maand', sp_q: 'Kwartaal',
    ct_monthly: 'Uitgaven per maand', ct_cat: 'Per categorie', ct_day: 'Per weekdag',
    ct_trend: 'Uitgaven trend (30 dagen)', ct_hour: 'Per tijdstip',
    ct_proj: 'Per project', ct_topstores: 'Top winkels', ct_topitems: 'Meest gekochte artikelen',
    kpi_total: 'Totaal uitgegeven', kpi_count: 'Aantal bonnen', kpi_avg: 'Gemiddeld per bon',
    kpi_max: 'Hoogste bon', kpi_items: 'Unieke artikelen', kpi_stores: 'Unieke winkels',
    filter_all: 'Alles',
    cat_food: '🥦 Voeding', cat_drink: '🥤 Drank', cat_hygiene: '🧴 Hygiëne',
    cat_household: '🏠 Huishouden', cat_electronics: '💻 Elektronica',
    cat_clothing: '👕 Kleding', cat_other: '📦 Overig',
    pay_cash: 'Contant', pay_card: 'Kaart', pay_pin: 'PIN', pay_unknown: 'Onbekend',
    rml_cat: 'Categorie', rml_pay: 'Betaling', rml_btw: 'BTW', rml_items: 'Artikelen',
    rtb_total: 'Totaal', items_lbl: 'Artikelen',
    notes_lbl: 'AI Opmerkingen', btn_save_edit: 'Wijzigingen opslaan',
    btn_edit: 'Bewerken', btn_delete: 'Verwijderen',
    modal_receipt: 'Bon details', modal_edit: 'Bon bewerken',
    modal_project: 'Project details', modal_new_project: 'Nieuw project',
    days: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
    months: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    toast_saved: '✅ Bon opgeslagen', toast_deleted: '🗑️ Verwijderd',
    toast_exported: '📤 Geëxporteerd', toast_cleared: '🗑️ Alles gewist',
    toast_error: '❌ Analysefout — API key nodig?', toast_fill: '⚠️ Vul alle velden in',
    toast_demo: '🎭 Demo geladen', toast_proj_saved: '✅ Project opgeslagen',
    toast_firebase: '✅ Firebase verbonden', toast_fb_error: '❌ Firebase fout',
    toast_imported: '✅ Geïmporteerd', toast_api_saved: '✅ API key opgeslagen',
    confirm_clear: 'Alle bonnen wissen?', confirm_delete: 'Deze bon verwijderen?',
    proj_lbl_name: 'Projectnaam', proj_lbl_color: 'Kleur', proj_lbl_budget: 'Budget (€)',
    proj_lbl_desc: 'Omschrijving', proj_no_budget: 'Geen budget',
    progress_steps: ['Afbeelding verwerken', 'AI analyse', 'Data extraheren', 'Categoriseren', 'Klaar'],
    empty_hist: 'Nog geen bonnen. Scan je eerste!', empty_items: 'Geen artikelen gevonden',
    no_results: 'Geen resultaten', no_receipts_stats: 'Scan je eerste bon voor statistieken',
    isb_results: 'resultaten', isb_unique: 'uniek', isb_avg: 'gem. prijs',
    item_also_in: 'ook in', store_txt: 'winkel',
    exp_title: 'Exporteer gegevens',
    st_cloud: '☁️ Cloud opslag (Firebase)', sd_cloud: 'Sla bonnen op in de gratis Firebase cloud. Werkt op al je apparaten.',
    st_api: '🤖 Claude API (AI analyse)', sd_api: 'Voer je Anthropic API key in voor AI-analyse van kastickets.',
    st_data: '📦 Data beheer', st_pwa: '📱 App installeren',
    sd_pwa: 'Installeer BonScan als app op je telefoon of computer.',
    fb_connected: 'Verbonden met Firebase',
    api_note: 'Je key wordt alleen lokaal opgeslagen.',
    btn_fb_connect: 'Verbinden', btn_fb_guide: '📖 Handleiding',
    btn_fb_disconnect: 'Verbreken', btn_save_api: 'Opslaan',
    btn_exp_json: '📥 Export JSON', btn_exp_csv: '📊 Export CSV',
    btn_import: '📤 Importeer JSON', btn_clear_all: '🗑️ Alles wissen',
  },
  en: {
    splash_loading: 'Loading...',
    nav_scan: 'Scan', nav_hist: 'History', nav_items: 'Items',
    nav_proj: 'Projects', nav_stats: 'Statistics', nav_set: 'Settings',
    bn_scan: 'Scan', bn_hist: 'Receipts', bn_items: 'Search', bn_proj: 'Projects', bn_stats: 'Stats',
    ph_scan: 'Scan Receipt', ps_scan: 'Upload or photograph a receipt',
    ph_manual: 'Manual entry', ph_hist: 'History',
    ph_items: 'Search items', ps_items: 'Search through all your purchased items',
    ph_proj: 'Projects', ph_stats: 'Statistics', ph_set: 'Settings',
    ua_title: 'Drop a photo here', ua_sub: 'or click to browse · JPG, PNG, WEBP',
    btn_gallery: 'Gallery', btn_camera: 'Camera', btn_manual_lbl: 'Manual',
    btn_save_res: 'Save', btn_edit_res: 'Edit',
    btn_analyze: 'Analyze receipt', lbl_proj_sel: 'Project (optional)',
    opt_no_proj: '— No project —',
    fl_store: 'Store', fl_date: 'Date', fl_total: 'Total amount (€)',
    fl_cat: 'Category', fl_proj: 'Project', fl_notes: 'Notes',
    fl_items_ttl: 'Items',
    btn_add_row: 'Add item', btn_save_man: 'Save',
    btn_new_proj: '+ New project',
    lbl_cat_filter: 'All categories',
    ph_search: 'Search store or date...', ph_item_search: 'Search an item...',
    hs_dd: 'Date ↓', hs_da: 'Date ↑', hs_td: 'Amount ↓', hs_ta: 'Amount ↑',
    hp_all: 'All projects',
    is_na: 'Name A-Z', is_pd: 'Price ↓', is_fd: 'Most bought',
    sp_all: 'All time', sp_year: 'This year', sp_month: 'This month', sp_q: 'Quarter',
    ct_monthly: 'Spending per month', ct_cat: 'Per category', ct_day: 'By weekday',
    ct_trend: 'Spending trend (30 days)', ct_hour: 'By time of day',
    ct_proj: 'Per project', ct_topstores: 'Top stores', ct_topitems: 'Most purchased items',
    kpi_total: 'Total spent', kpi_count: 'Receipts saved', kpi_avg: 'Average per receipt',
    kpi_max: 'Highest receipt', kpi_items: 'Unique items', kpi_stores: 'Unique stores',
    filter_all: 'All',
    cat_food: '🥦 Food', cat_drink: '🥤 Drinks', cat_hygiene: '🧴 Hygiene',
    cat_household: '🏠 Household', cat_electronics: '💻 Electronics',
    cat_clothing: '👕 Clothing', cat_other: '📦 Other',
    pay_cash: 'Cash', pay_card: 'Card', pay_pin: 'PIN', pay_unknown: 'Unknown',
    rml_cat: 'Category', rml_pay: 'Payment', rml_btw: 'VAT', rml_items: 'Items',
    rtb_total: 'Total', items_lbl: 'Items',
    notes_lbl: 'AI Notes', btn_save_edit: 'Save changes',
    btn_edit: 'Edit', btn_delete: 'Delete',
    modal_receipt: 'Receipt details', modal_edit: 'Edit receipt',
    modal_project: 'Project details', modal_new_project: 'New project',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    toast_saved: '✅ Receipt saved', toast_deleted: '🗑️ Deleted',
    toast_exported: '📤 Exported', toast_cleared: '🗑️ All cleared',
    toast_error: '❌ Analysis error — API key needed?', toast_fill: '⚠️ Fill all fields',
    toast_demo: '🎭 Demo loaded', toast_proj_saved: '✅ Project saved',
    toast_firebase: '✅ Firebase connected', toast_fb_error: '❌ Firebase error',
    toast_imported: '✅ Imported', toast_api_saved: '✅ API key saved',
    confirm_clear: 'Clear all receipts?', confirm_delete: 'Delete this receipt?',
    proj_lbl_name: 'Project name', proj_lbl_color: 'Color', proj_lbl_budget: 'Budget (€)',
    proj_lbl_desc: 'Description', proj_no_budget: 'No budget',
    progress_steps: ['Processing image', 'AI analysis', 'Extracting data', 'Categorizing', 'Done'],
    empty_hist: 'No receipts yet. Scan your first!', empty_items: 'No items found',
    no_results: 'No results', no_receipts_stats: 'Scan your first receipt for statistics',
    isb_results: 'results', isb_unique: 'unique', isb_avg: 'avg. price',
    item_also_in: 'also in', store_txt: 'stores',
    exp_title: 'Export data',
    st_cloud: '☁️ Cloud storage (Firebase)', sd_cloud: 'Store receipts in free Firebase cloud. Works on all devices.',
    st_api: '🤖 Claude API (AI analysis)', sd_api: 'Enter your Anthropic API key for AI receipt analysis.',
    st_data: '📦 Data management', st_pwa: '📱 Install app',
    sd_pwa: 'Install BonScan as an app on your phone or computer.',
    fb_connected: 'Connected to Firebase',
    api_note: 'Your key is only stored locally.',
    btn_fb_connect: 'Connect', btn_fb_guide: '📖 Guide',
    btn_fb_disconnect: 'Disconnect', btn_save_api: 'Save',
    btn_exp_json: '📥 Export JSON', btn_exp_csv: '📊 Export CSV',
    btn_import: '📤 Import JSON', btn_clear_all: '🗑️ Clear all',
  }
};

function t(k) { return T[lang][k] || k }

// ─── LANG ──────────────────────────────────────────────
function setLang(l) {
  lang = l;
  ['nl', 'en'].forEach(x => {
    document.getElementById(`lb-${x}`).classList.toggle('active', x === l);
    const el2 = document.getElementById(`lb-${x}2`);
    if (el2) el2.classList.toggle('active', x === l);
  });
  document.documentElement.lang = l;
  updateAllTexts();
  renderHistory(); renderItems(); renderStats(); renderProjects();
  localStorage.setItem('bonscan_lang', l);
}

function updateAllTexts() {
  const map = {
    'sn-scan': 'nav_scan', 'sn-hist': 'nav_hist', 'sn-items': 'nav_items',
    'sn-proj': 'nav_proj', 'sn-stats': 'nav_stats', 'sn-set': 'nav_set',
    'bn-scan': 'bn_scan', 'bn-hist': 'bn_hist', 'bn-items': 'bn_items',
    'bn-proj': 'bn_proj', 'bn-stats': 'bn_stats',
    'ph-scan': 'ph_scan', 'ps-scan': 'ps_scan',
    'ph-manual': 'ph_manual', 'ph-hist': 'ph_hist',
    'ph-items': 'ph_items', 'ps-items': 'ps_items',
    'ph-proj': 'ph_proj', 'ph-stats': 'ph_stats', 'ph-set': 'ph_set',
    'ua-title': 'ua_title', 'ua-sub': 'ua_sub',
    'btn-gallery': 'btn_gallery', 'btn-camera': 'btn_camera',
    'btn-manual-lbl': 'btn_manual_lbl',
    'btn-save-res': 'btn_save_res', 'btn-edit-res': 'btn_edit_res',
    'lbl-proj-sel': 'lbl_proj_sel', 'opt-no-proj': 'opt_no_proj',
    'fl-store': 'fl_store', 'fl-date': 'fl_date', 'fl-total': 'fl_total',
    'fl-cat': 'fl_cat', 'fl-proj': 'fl_proj', 'fl-notes': 'fl_notes',
    'fl-items-ttl': 'fl_items_ttl', 'btn-add-row-txt': 'btn_add_row',
    'btn-save-man': 'btn_save_man', 'btn-new-proj': 'btn_new_proj',
    'hs-dd': 'hs_dd', 'hs-da': 'hs_da', 'hs-td': 'hs_td', 'hs-ta': 'hs_ta',
    'hp-all': 'hp_all', 'icf-all': 'lbl_cat_filter',
    'is-na': 'is_na', 'is-pd': 'is_pd', 'is-fd': 'is_fd',
    'sp-all': 'sp_all', 'sp-year': 'sp_year', 'sp-month': 'sp_month', 'sp-q': 'sp_q',
    'ct-monthly': 'ct_monthly', 'ct-cat': 'ct_cat', 'ct-day': 'ct_day',
    'ct-trend': 'ct_trend', 'ct-hour': 'ct_hour',
    'ct-proj-chart': 'ct_proj', 'ct-topstores': 'ct_topstores', 'ct-topitems': 'ct_topitems',
    'rml-cat': 'rml_cat', 'rml-pay': 'rml_pay', 'rml-btw': 'rml_btw', 'rml-items': 'rml_items',
    'rtb-total': 'rtb_total', 'items-lbl': 'items_lbl', 'items-total-lbl': '',
    'st-cloud': 'st_cloud', 'sd-cloud': 'sd_cloud', 'st-api': 'st_api', 'sd-api': 'sd_api',
    'st-data': 'st_data', 'st-pwa': 'st_pwa', 'sd-pwa': 'sd_pwa',
    'fb-connected-txt': 'fb_connected', 'api-note': 'api_note',
    'btn-fb-connect': 'btn_fb_connect', 'btn-fb-guide': 'btn_fb_guide',
    'btn-fb-disconnect': 'btn_fb_disconnect', 'btn-save-api': 'btn_save_api',
    'btn-exp-json': 'btn_exp_json', 'btn-exp-csv': 'btn_exp_csv',
    'btn-import': 'btn_import', 'btn-clear-all': 'btn_clear_all',
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && key) el.textContent = t(key);
  });
  const si = document.getElementById('histSearch');
  if (si) si.placeholder = t('ph_search');
  const is = document.getElementById('itemSearch');
  if (is) is.placeholder = t('ph_item_search');
  document.title = 'BonScan';
  renderCatChips();
  populateProjectSelects();
}

// ─── NAVIGATION ───────────────────────────────────────
function goPage(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.snav-item').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.bnav').forEach(x => x.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  document.querySelectorAll(`[data-page="${p}"]`).forEach(x => x.classList.add('active'));
  const titles = { scan: 'BonScan', history: t('nav_hist'), items: t('nav_items'), projects: t('nav_proj'), stats: t('nav_stats'), settings: t('nav_set'), manual: t('ph_manual') };
  document.getElementById('topbar-title').textContent = titles[p] || 'BonScan';
  if (p === 'history') renderHistory();
  if (p === 'items') renderItems();
  if (p === 'stats') setTimeout(renderStats, 50);
  if (p === 'projects') renderProjects();
  if (p === 'manual') initManual();
  if (window.innerWidth <= 768) closeSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  let ov = document.getElementById('sidebarOverlay');
  if (!ov) { ov = document.createElement('div'); ov.id = 'sidebarOverlay'; ov.onclick = closeSidebar; document.body.appendChild(ov); }
  ov.classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  const ov = document.getElementById('sidebarOverlay');
  if (ov) ov.classList.remove('open');
}

// ─── FILE HANDLING ────────────────────────────────────
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.remove('drag');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) processFile(f);
}
function handleFile(e) { const f = e.target.files[0]; if (f) processFile(f); }

let currentBase64 = null;
let currentMime = null;

function processFile(f) {
  const reader = new FileReader();
  reader.onload = ev => {
    currentBase64 = ev.target.result.split(',')[1];
    const m = ev.target.result.match(/data:([^;]+);/);
    currentMime = m ? m[1] : 'image/jpeg';
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('analyzeBtnWrap') && (document.getElementById('analyzeBtnWrap').style.display = 'block');
    showAnalyzeReady();
  };
  reader.readAsDataURL(f);
}

function showAnalyzeReady() {
  const ua = document.getElementById('uploadArea');
  ua.innerHTML = `
    <div class="upload-ring" style="border-color:var(--cyan);background:var(--cyan3)">
      <svg viewBox="0 0 24 24" width="28" height="28" style="color:var(--cyan)"><path d="M20 6L9 17l-5-5"/></svg>
    </div>
    <h3 style="color:var(--cyan)">Afbeelding geladen</h3>
    <p>${t('ua_sub')}</p>
    <div class="upload-actions">
      <button class="btn btn-primary" onclick="analyzeReceipt()" style="min-width:200px">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2m0 0v10M12 16h.01"/></svg>
        ${t('btn_analyze')}
      </button>
      <button class="btn btn-outline" onclick="resetScan()">✕ Reset</button>
    </div>
  `;
  ua.style.display = 'block';
}

function resetScan() {
  currentBase64 = null; currentMime = null; currentReceipt = null;
  document.getElementById('uploadArea').innerHTML = `
    <input type="file" id="fileInput" accept="image/*" onchange="handleFile(event)" style="display:none">
    <div class="upload-visual"><div class="upload-ring"><svg viewBox="0 0 24 24" width="32" height="32"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg></div></div>
    <h3 id="ua-title">${t('ua_title')}</h3>
    <p id="ua-sub">${t('ua_sub')}</p>
    <div class="upload-actions">
      <button class="btn btn-outline" onclick="document.getElementById('fileInput').click()"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16M14 14l1.586-1.586a2 2 0 012.828 0L20 20M14 8h.01"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg><span>${t('btn_gallery')}</span></button>
      <button class="btn btn-outline" onclick="openCameraCapture()"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg><span>${t('btn_camera')}</span></button>
      <button class="btn btn-outline" onclick="goPage('manual')"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>${t('btn_manual_lbl')}</span></button>
      <button class="btn btn-ghost-cyan" onclick="loadDemo()"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>Demo</button>
    </div>
  `;
  document.getElementById('scanProgress').style.display = 'none';
  document.getElementById('resultWrap').style.display = 'none';
}

// ─── CAMERA ───────────────────────────────────────────
async function openCameraCapture() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    cameraStream = stream;
    document.getElementById('cameraVideo').srcObject = stream;
    document.getElementById('cameraWrap').style.display = 'block';
  } catch (e) {
    showToast('Camera niet beschikbaar', 'error');
  }
}
function capturePhoto() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  canvas.toBlob(blob => { closeCamera(); processFile(blob); }, 'image/jpeg', 0.92);
}
function closeCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  document.getElementById('cameraWrap').style.display = 'none';
}

// ─── ANALYZE ──────────────────────────────────────────
const STEPS = ['progress_reading', 'progress_ai', 'progress_extract', 'progress_cat', 'progress_done'];

async function analyzeReceipt() {
  if (!currentBase64) return;
  const apiKey = localStorage.getItem('bonscan_apikey') || '';
  const prog = document.getElementById('scanProgress');
  prog.style.display = 'flex';
  document.getElementById('resultWrap').style.display = 'none';
  const steps = t('progress_steps');

  function setProgress(pct, stepIdx) {
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('progressPct').textContent = pct + '%';
    document.getElementById('progressTxt').textContent = steps[stepIdx] || '';
    const stepsHtml = steps.map((s, i) =>
      `<span class="ps-step ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''}">${s}</span>`
    ).join('');
    document.getElementById('progressSteps').innerHTML = stepsHtml;
  }

  setProgress(10, 0); await delay(300);
  setProgress(30, 1);

  const projectId = document.getElementById('scanProject').value;
  const projectName = projectId ? (projects.find(p => p.id == projectId)?.name || '') : '';

  const prompt = `You are an expert receipt/kasticket analyzer. Extract ALL information from this receipt image.
Return ONLY valid JSON, no markdown, no explanation:
{
  "store": "exact store name or Unknown",
  "date": "YYYY-MM-DD",
  "total": 0.00,
  "subtotal": 0.00,
  "tax": 0.00,
  "category": "food|drink|hygiene|household|electronics|clothing|other",
  "paymentMethod": "cash|card|pin|unknown",
  "currency": "EUR",
  "items": [{"name":"item name","qty":1,"price":0.00,"category":"food|drink|hygiene|household|electronics|clothing|other"}],
  "notes": "brief observations about this receipt"
}
Be precise with amounts. If unreadable, make reasonable estimate. Return ONLY JSON.`;

  try {
    setProgress(50, 1);
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['x-api-key'] = apiKey;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: currentMime, data: currentBase64 } },
          { type: 'text', text: prompt }
        ]}]
      })
    });
    setProgress(75, 2); await delay(200);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const raw = (data.content || []).map(c => c.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    setProgress(90, 3); await delay(150);
    let receipt;
    try { receipt = JSON.parse(clean); }
    catch { receipt = { store: 'Onbekend', date: today(), total: 0, subtotal: 0, tax: 0, category: 'other', paymentMethod: 'unknown', currency: 'EUR', items: [], notes: raw.slice(0, 200) }; }
    receipt.id = Date.now();
    receipt.scannedAt = new Date().toISOString();
    receipt.projectId = projectId || null;
    receipt.projectName = projectName;
    // NO image stored — privacy
    setProgress(100, 4); await delay(300);
    currentReceipt = receipt;
    prog.style.display = 'none';
    displayResult(receipt);
  } catch (err) {
    prog.style.display = 'none';
    showToast(t('toast_error'), 'error');
  }
}

function displayResult(r) {
  const catColors = { food: '#4ade80', drink: '#60a5fa', hygiene: '#c084fc', household: '#fb923c', electronics: '#fbbf24', clothing: '#f472b6', other: '#94a3b8' };
  const storeEmojis = { food: '🛒', drink: '🥤', hygiene: '💊', household: '🏠', electronics: '💻', clothing: '👕', other: '🧾' };
  const payLabels = { cash: t('pay_cash'), card: t('pay_card'), pin: t('pay_pin'), unknown: t('pay_unknown') };

  document.getElementById('resStoreIcon').textContent = storeEmojis[r.category] || '🧾';
  document.getElementById('resStoreName').textContent = r.store || '?';
  document.getElementById('resDate').textContent = formatDate(r.date);
  document.getElementById('resTotalAmount').textContent = '€' + (+r.total || 0).toFixed(2);
  document.getElementById('resCategory').innerHTML = `<span class="c-${r.category || 'other'}">${t('cat_' + (r.category || 'other'))}</span>`;
  document.getElementById('resPayment').textContent = payLabels[r.paymentMethod] || r.paymentMethod || '?';
  document.getElementById('resTax').textContent = '€' + (+r.tax || 0).toFixed(2);
  document.getElementById('resItemCount').textContent = (r.items || []).length;

  const list = document.getElementById('resList');
  list.innerHTML = (r.items || []).map(item => `
    <div class="item-row">
      <span class="cat-dot dot-${item.category || 'other'}"></span>
      <span class="iname">${item.name}</span>
      <span class="iqty">×${item.qty || 1}</span>
      <span class="iprice">€${(+item.price || 0).toFixed(2)}</span>
    </div>
  `).join('') || `<div style="padding:14px 16px;color:var(--text3);font-size:13px">Geen artikelen herkend</div>`;

  if (r.items && r.items.length) {
    const sum = r.items.reduce((s, i) => s + (+i.price || 0) * (i.qty || 1), 0);
    document.getElementById('items-total-lbl').textContent = `∑ €${sum.toFixed(2)}`;
  }

  if (r.notes && r.notes.length > 5) {
    document.getElementById('resNotes').style.display = 'block';
    document.getElementById('resNotesText').textContent = r.notes;
  } else {
    document.getElementById('resNotes').style.display = 'none';
  }

  if (r.projectName) {
    const ph = document.getElementById('resDate');
    ph.textContent = formatDate(r.date) + ' · ' + r.projectName;
  }

  document.getElementById('resultWrap').style.display = 'flex';
  document.getElementById('resultWrap').style.flexDirection = 'column';
  document.getElementById('resultWrap').style.gap = '12px';
}

function saveCurrentReceipt() {
  if (!currentReceipt) return;
  const idx = receipts.findIndex(r => r.id === currentReceipt.id);
  if (idx >= 0) receipts[idx] = currentReceipt;
  else receipts.unshift(currentReceipt);
  saveData();
  if (firebaseDb) syncToFirebase(currentReceipt);
  showToast(t('toast_saved'), 'success');
}

// ─── MANUAL ENTRY ─────────────────────────────────────
function initManual() {
  document.getElementById('m-date').value = today();
  document.getElementById('m-store').value = '';
  document.getElementById('m-total').value = '';
  document.getElementById('m-notes').value = '';
  document.getElementById('m-items-list').innerHTML = '';
  addManualItem();
  populateProjectSelects();
}
function addManualItem() {
  const c = document.getElementById('m-items-list');
  const i = c.children.length;
  const d = document.createElement('div'); d.className = 'edit-item-row';
  d.innerHTML = `
    <input class="field-input" placeholder="${t('fl_store')}" id="mi-n-${i}">
    <input class="field-input qty-in" type="number" min="1" value="1" id="mi-q-${i}">
    <input class="field-input price-in" type="number" step="0.01" value="0.00" id="mi-p-${i}">
    <button class="remove-btn" onclick="this.parentElement.remove()">✕</button>`;
  c.appendChild(d);
}
function saveManual() {
  const store = document.getElementById('m-store').value.trim();
  const date = document.getElementById('m-date').value;
  const total = parseFloat(document.getElementById('m-total').value) || 0;
  if (!store || !date) { showToast(t('toast_fill'), 'error'); return; }
  const rows = document.getElementById('m-items-list').querySelectorAll('.edit-item-row');
  const items = [];
  rows.forEach((row, i) => {
    const n = row.querySelector(`#mi-n-${i}`) || row.querySelector('input:nth-child(1)');
    const q = row.querySelector(`#mi-q-${i}`) || row.querySelector('input:nth-child(2)');
    const p = row.querySelector(`#mi-p-${i}`) || row.querySelector('input:nth-child(3)');
    if (n && n.value.trim()) items.push({ name: n.value.trim(), qty: parseInt(q?.value || 1), price: parseFloat(p?.value || 0), category: document.getElementById('m-cat').value });
  });
  const projectId = document.getElementById('m-proj').value;
  const projectName = projectId ? (projects.find(p => p.id == projectId)?.name || '') : '';
  const r = { id: Date.now(), store, date, total, subtotal: total, tax: 0, category: document.getElementById('m-cat').value, paymentMethod: 'unknown', currency: 'EUR', notes: document.getElementById('m-notes').value, items, projectId, projectName, scannedAt: new Date().toISOString() };
  receipts.unshift(r);
  saveData();
  if (firebaseDb) syncToFirebase(r);
  showToast(t('toast_saved'), 'success');
  goPage('history');
}

// ─── HISTORY ──────────────────────────────────────────
function renderHistory() {
  renderCatChips();
  const q = (document.getElementById('histSearch')?.value || '').toLowerCase();
  const sort = document.getElementById('histSort')?.value || 'date-desc';
  const projFilter = document.getElementById('histProject')?.value || '';
  let filtered = receipts.filter(r => {
    const mc = activeFilter === 'all' || r.category === activeFilter;
    const mq = !q || (r.store || '').toLowerCase().includes(q) || (r.date || '').includes(q) || (r.projectName || '').toLowerCase().includes(q);
    const mp = !projFilter || r.projectId == projFilter;
    return mc && mq && mp;
  });
  filtered.sort((a, b) => {
    if (sort === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sort === 'total-desc') return (+b.total || 0) - (+a.total || 0);
    if (sort === 'total-asc') return (+a.total || 0) - (+b.total || 0);
    return 0;
  });
  const list = document.getElementById('histList');
  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><div class="ei">${receipts.length ? '🔍' : '🧾'}</div><p>${receipts.length ? t('no_results') : t('empty_hist')}</p></div>`;
    return;
  }
  const catEmojis = { food: '🛒', drink: '🥤', hygiene: '💊', household: '🏠', electronics: '💻', clothing: '👕', other: '🧾' };
  list.innerHTML = filtered.map(r => `
    <div class="receipt-item" onclick="openReceiptModal(${r.id})">
      <div class="receipt-icon">${catEmojis[r.category] || '🧾'}</div>
      <div class="receipt-info">
        <div class="receipt-store">${r.store || '?'}</div>
        <div class="receipt-meta">
          <span>📅 ${formatDate(r.date)}</span>
          <span class="c-${r.category || 'other'}">${t('cat_' + (r.category || 'other'))}</span>
          <span>📦 ${(r.items || []).length}</span>
          ${r.projectName ? `<span class="proj-tag">${r.projectName}</span>` : ''}
        </div>
      </div>
      <div class="receipt-total">€${(+r.total || 0).toFixed(2)}</div>
    </div>
  `).join('');
}

function renderCatChips() {
  const used = [...new Set(receipts.map(r => r.category).filter(Boolean))];
  const cats = ['food', 'drink', 'hygiene', 'household', 'electronics', 'clothing', 'other'];
  const el = document.getElementById('catChips');
  if (!el) return;
  el.innerHTML = `<button class="chip ${activeFilter === 'all' ? 'active' : ''}" onclick="setFilter('all')">${t('filter_all')} (${receipts.length})</button>` +
    cats.filter(c => used.includes(c)).map(c =>
      `<button class="chip ${activeFilter === c ? 'active' : ''}" onclick="setFilter('${c}')">${t('cat_' + c)} (${receipts.filter(r => r.category === c).length})</button>`
    ).join('');
}

function setFilter(f) { activeFilter = f; renderHistory(); }

// ─── ITEM SEARCH ──────────────────────────────────────
function renderItems() {
  const q = (document.getElementById('itemSearch')?.value || '').toLowerCase();
  const catF = document.getElementById('itemCatFilter')?.value || '';
  const sort = document.getElementById('itemSort')?.value || 'name-asc';
  const allItems = [];
  receipts.forEach(r => {
    (r.items || []).forEach(item => {
      if (!item.name) return;
      const existing = allItems.find(i => i.name.toLowerCase() === item.name.toLowerCase());
      if (existing) {
        existing.count += (item.qty || 1);
        existing.prices.push(+item.price || 0);
        existing.receipts.push(r.id);
        existing.stores = [...new Set([...existing.stores, r.store])];
      } else {
        allItems.push({ name: item.name, count: item.qty || 1, prices: [+item.price || 0], category: item.category || r.category || 'other', receipts: [r.id], stores: [r.store].filter(Boolean) });
      }
    });
  });
  let filtered = allItems.filter(i => {
    const mq = !q || i.name.toLowerCase().includes(q);
    const mc = !catF || i.category === catF;
    return mq && mc;
  });
  filtered.sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'price-desc') return Math.max(...b.prices) - Math.max(...a.prices);
    if (sort === 'freq-desc') return b.count - a.count;
    return 0;
  });
  const totalSpent = filtered.reduce((s, i) => s + i.prices.reduce((a, b) => a + b, 0), 0);
  const avgPrice = filtered.length ? totalSpent / filtered.reduce((s, i) => s + i.prices.length, 0) : 0;
  const statsBar = document.getElementById('itemsStatsBar');
  if (statsBar) statsBar.innerHTML = filtered.length ? `
    <span class="isb-stat"><strong>${filtered.length}</strong> ${t('isb_results')}</span>
    <span class="isb-stat"><strong>${[...new Set(filtered.map(i => i.name))].length}</strong> ${t('isb_unique')}</span>
    <span class="isb-stat">${t('isb_avg')} <strong>€${avgPrice.toFixed(2)}</strong></span>
  ` : '';
  const res = document.getElementById('itemSearchResults');
  if (!res) return;
  if (!filtered.length) { res.innerHTML = `<div class="empty-state"><div class="ei">🔍</div><p>${t('empty_items')}</p></div>`; return; }
  res.innerHTML = filtered.map(item => {
    const avgP = item.prices.length ? item.prices.reduce((a, b) => a + b, 0) / item.prices.length : 0;
    const minP = Math.min(...item.prices); const maxP = Math.max(...item.prices);
    return `
      <div class="item-result-row" onclick="showItemDetail('${encodeURIComponent(item.name)}')">
        <div class="irr-top">
          <div class="irr-name"><span class="cat-dot dot-${item.category}" style="display:inline-block;margin-right:6px"></span>${item.name}</div>
          <div class="irr-price">€${avgP.toFixed(2)}</div>
        </div>
        <div class="irr-meta">
          ${t('isb_unique')}: ${item.count}× · 
          ${minP !== maxP ? `€${minP.toFixed(2)}–€${maxP.toFixed(2)} · ` : ''}
          ${item.stores.length} ${t('store_txt')}${item.stores.length > 1 ? 's' : ''}
          ${item.stores.slice(0, 2).map(s => `<span class="proj-tag" style="margin-left:4px">${s}</span>`).join('')}
        </div>
      </div>`;
  }).join('');
}

function showItemDetail(encodedName) {
  const name = decodeURIComponent(encodedName);
  const purchases = [];
  receipts.forEach(r => {
    (r.items || []).forEach(item => {
      if (item.name.toLowerCase() === name.toLowerCase()) {
        purchases.push({ ...item, store: r.store, date: r.date, receiptId: r.id });
      }
    });
  });
  if (!purchases.length) return;
  const avgP = purchases.reduce((s, p) => s + (+p.price || 0), 0) / purchases.length;
  const minP = Math.min(...purchases.map(p => +p.price || 0));
  const maxP = Math.max(...purchases.map(p => +p.price || 0));
  openModal(name, `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
      <div class="rmg-cell"><span class="rmg-lbl">Gemiddeld</span><span class="rmg-val" style="color:var(--green)">€${avgP.toFixed(2)}</span></div>
      <div class="rmg-cell"><span class="rmg-lbl">Min</span><span class="rmg-val">€${minP.toFixed(2)}</span></div>
      <div class="rmg-cell"><span class="rmg-lbl">Max</span><span class="rmg-val">€${maxP.toFixed(2)}</span></div>
    </div>
    <div class="items-section">
      <div class="items-header">${purchases.length}× gekocht</div>
      <div class="items-list">
        ${purchases.sort((a, b) => new Date(b.date) - new Date(a.date)).map(p => `
          <div class="item-row">
            <span class="iname">${p.store || '?'}</span>
            <span class="iqty">${formatDate(p.date)}</span>
            <span class="iprice">€${(+p.price || 0).toFixed(2)}</span>
          </div>`).join('')}
      </div>
    </div>
  `);
}

// ─── PROJECTS ─────────────────────────────────────────
const PROJECT_COLORS = ['#22d3ee', '#4ade80', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c', '#60a5fa'];

function renderProjects() {
  populateProjectSelects();
  const list = document.getElementById('projectsList');
  if (!list) return;
  if (!projects.length) {
    list.innerHTML = `<div class="empty-state"><div class="ei">📁</div><p>Nog geen projecten. Maak je eerste aan!</p></div>`;
    return;
  }
  list.innerHTML = projects.map(p => {
    const recs = receipts.filter(r => r.projectId == p.id);
    const total = recs.reduce((s, r) => s + (+r.total || 0), 0);
    const budget = p.budget ? `Budget: €${(+p.budget).toFixed(0)} · Resterend: €${(+p.budget - total).toFixed(2)}` : t('proj_no_budget');
    return `
      <div class="project-card" onclick="openProjectModal(${p.id})">
        <div class="project-header">
          <div class="project-color" style="background:${p.color || '#22d3ee'}"></div>
          <div class="project-name">${p.name}</div>
          <div style="color:var(--green);font-weight:700;font-family:'DM Mono',monospace">€${total.toFixed(2)}</div>
        </div>
        <div class="project-stats">
          <span><strong>${recs.length}</strong> bonnen</span>
          <span>${budget}</span>
        </div>
        ${p.description ? `<div class="project-desc">${p.description}</div>` : ''}
      </div>`;
  }).join('');
}

function openNewProjectModal() {
  const colors = PROJECT_COLORS;
  openModal(t('modal_new_project'), `
    <div class="field-group" style="margin-bottom:10px"><label class="field-label">${t('proj_lbl_name')}</label><input class="field-input" id="np-name"></div>
    <div class="field-group" style="margin-bottom:10px"><label class="field-label">${t('proj_lbl_color')}</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;padding:4px 0">
        ${colors.map((c, i) => `<button onclick="selectProjColor(this,'${c}')" data-color="${c}" style="width:28px;height:28px;border-radius:50%;background:${c};border:2px solid transparent;cursor:pointer;transition:all.15s" id="pc-${i}"></button>`).join('')}
      </div>
      <input type="hidden" id="np-color" value="${colors[0]}">
    </div>
    <div class="field-group" style="margin-bottom:10px"><label class="field-label">${t('proj_lbl_budget')}</label><input class="field-input" id="np-budget" type="number" step="1" placeholder="0"></div>
    <div class="field-group" style="margin-bottom:14px"><label class="field-label">${t('proj_lbl_desc')}</label><textarea class="field-input" id="np-desc" rows="2"></textarea></div>
    <button class="btn btn-primary full" onclick="saveNewProject()">${t('btn_save_man')}</button>
  `);
  setTimeout(() => { const btn = document.querySelector(`[data-color="${colors[0]}"]`); if (btn) btn.style.border = '2px solid white'; }, 50);
}
function selectProjColor(btn, color) {
  document.querySelectorAll('[data-color]').forEach(b => b.style.border = '2px solid transparent');
  btn.style.border = '2px solid white';
  document.getElementById('np-color').value = color;
}
function saveNewProject() {
  const name = document.getElementById('np-name')?.value.trim();
  if (!name) { showToast(t('toast_fill'), 'error'); return; }
  const p = { id: Date.now(), name, color: document.getElementById('np-color')?.value || '#22d3ee', budget: parseFloat(document.getElementById('np-budget')?.value) || null, description: document.getElementById('np-desc')?.value || '' };
  projects.push(p);
  saveData();
  closeModal();
  renderProjects();
  populateProjectSelects();
  showToast(t('toast_proj_saved'), 'success');
}
function openProjectModal(id) {
  const p = projects.find(x => x.id == id);
  if (!p) return;
  const recs = receipts.filter(r => r.projectId == id);
  const total = recs.reduce((s, r) => s + (+r.total || 0), 0);
  const catEmojis = { food: '🛒', drink: '🥤', hygiene: '💊', household: '🏠', electronics: '💻', clothing: '👕', other: '🧾' };
  openModal(p.name, `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div class="rmg-cell"><span class="rmg-lbl">Totaal</span><span class="rmg-val" style="color:var(--green)">€${total.toFixed(2)}</span></div>
      <div class="rmg-cell"><span class="rmg-lbl">Bonnen</span><span class="rmg-val">${recs.length}</span></div>
      ${p.budget ? `<div class="rmg-cell"><span class="rmg-lbl">Budget</span><span class="rmg-val">€${(+p.budget).toFixed(0)}</span></div><div class="rmg-cell"><span class="rmg-lbl">Resterend</span><span class="rmg-val" style="color:${p.budget - total >= 0 ? 'var(--green)' : 'var(--red)'}">€${(p.budget - total).toFixed(2)}</span></div>` : ''}
    </div>
    <div class="items-section">
      <div class="items-header">Bonnen</div>
      <div class="items-list">
        ${recs.map(r => `<div class="item-row"><span class="iname">${r.store}</span><span class="iqty">${formatDate(r.date)}</span><span class="iprice">€${(+r.total).toFixed(2)}</span></div>`).join('') || '<div style="padding:12px 16px;color:var(--text3);font-size:13px">Geen bonnen</div>'}
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-danger-sm" onclick="deleteProject(${id})">🗑️ Verwijderen</button>
    </div>
  `);
}
function deleteProject(id) {
  projects = projects.filter(p => p.id != id);
  receipts.forEach(r => { if (r.projectId == id) { r.projectId = null; r.projectName = ''; } });
  saveData(); closeModal(); renderProjects(); showToast(t('toast_deleted'));
}
function populateProjectSelects() {
  const opts = `<option value="">${t('opt_no_proj')}</option>` + projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  ['scanProject', 'm-proj'].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = opts; });
  const hpo = document.getElementById('histProject');
  if (hpo) hpo.innerHTML = `<option value="">${t('hp_all')}</option>` + projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

// ─── EDIT MODAL ───────────────────────────────────────
function openEditModal(r) {
  if (!r) return;
  openModal(t('modal_edit'), `
    <div class="form-row-2" style="margin-bottom:10px">
      <div class="field-group"><label class="field-label">${t('fl_store')}</label><input class="field-input" id="e-store" value="${r.store || ''}"></div>
      <div class="field-group"><label class="field-label">${t('fl_date')}</label><input class="field-input" id="e-date" type="date" value="${r.date || ''}"></div>
      <div class="field-group"><label class="field-label">${t('fl_total')}</label><input class="field-input" id="e-total" type="number" step="0.01" value="${r.total || 0}"></div>
      <div class="field-group"><label class="field-label">${t('fl_cat')}</label>
        <select class="field-select" id="e-cat">
          ${['food','drink','hygiene','household','electronics','clothing','other'].map(c => `<option value="${c}"${r.category===c?' selected':''}>${t('cat_'+c)}</option>`).join('')}
        </select>
      </div>
      <div class="field-group span-2"><label class="field-label">${t('fl_notes')}</label><textarea class="field-input" id="e-notes" rows="2">${r.notes || ''}</textarea></div>
    </div>
    <div class="section-title">${t('fl_items_ttl')}</div>
    <div id="e-items">
      ${(r.items || []).map((it, i) => `
        <div class="edit-item-row">
          <input class="field-input" value="${it.name}" id="ei-n-${i}">
          <input class="field-input qty-in" type="number" min="1" value="${it.qty || 1}" id="ei-q-${i}">
          <input class="field-input price-in" type="number" step="0.01" value="${it.price || 0}" id="ei-p-${i}">
          <button class="remove-btn" onclick="this.parentElement.remove()">✕</button>
        </div>`).join('')}
    </div>
    <button class="add-row-btn" onclick="addEditItemRow()">+ ${t('btn_add_row')}</button>
    <button class="btn btn-primary full mt" onclick="saveEdit(${r.id})">${t('btn_save_edit')}</button>
  `);
}
function addEditItemRow() {
  const c = document.getElementById('e-items');
  const i = c.children.length;
  const d = document.createElement('div'); d.className = 'edit-item-row';
  d.innerHTML = `<input class="field-input" placeholder="${t('fl_store')}" id="ei-n-${i}"><input class="field-input qty-in" type="number" min="1" value="1" id="ei-q-${i}"><input class="field-input price-in" type="number" step="0.01" value="0.00" id="ei-p-${i}"><button class="remove-btn" onclick="this.parentElement.remove()">✕</button>`;
  c.appendChild(d);
}
function saveEdit(id) {
  const r = receipts.find(x => x.id == id) || currentReceipt;
  if (!r) return;
  r.store = document.getElementById('e-store').value;
  r.date = document.getElementById('e-date').value;
  r.total = parseFloat(document.getElementById('e-total').value) || 0;
  r.category = document.getElementById('e-cat').value;
  r.notes = document.getElementById('e-notes').value;
  const rows = document.getElementById('e-items').querySelectorAll('.edit-item-row');
  r.items = [];
  rows.forEach((row, i) => {
    const n = row.querySelector('input:nth-child(1)');
    const q = row.querySelector('input:nth-child(2)');
    const p = row.querySelector('input:nth-child(3)');
    if (n && n.value.trim()) r.items.push({ name: n.value.trim(), qty: parseInt(q?.value || 1), price: parseFloat(p?.value || 0), category: r.category });
  });
  if (receipts.find(x => x.id == id)) { saveData(); renderHistory(); }
  else if (currentReceipt) { currentReceipt = r; displayResult(r); }
  if (firebaseDb) syncToFirebase(r);
  closeModal();
  showToast(t('toast_saved'), 'success');
}

// ─── RECEIPT MODAL ────────────────────────────────────
function openReceiptModal(id) {
  const r = receipts.find(x => x.id == id);
  if (!r) return;
  const catEmojis = { food: '🛒', drink: '🥤', hygiene: '💊', household: '🏠', electronics: '💻', clothing: '👕', other: '🧾' };
  openModal(r.store || '?', `
    <div class="result-hero" style="margin-bottom:14px">
      <div class="result-store-icon">${catEmojis[r.category] || '🧾'}</div>
      <div class="result-store-info"><h2>${r.store || '?'}</h2><p class="result-date">${formatDate(r.date)}</p></div>
      <div class="result-total-badge"><span class="rtb-label">Totaal</span><span class="rtb-amount">€${(+r.total || 0).toFixed(2)}</span></div>
    </div>
    <div class="result-meta-grid" style="margin-bottom:14px">
      <div class="rmg-cell"><span class="rmg-lbl">${t('rml_cat')}</span><span class="rmg-val c-${r.category}">${t('cat_' + (r.category || 'other'))}</span></div>
      <div class="rmg-cell"><span class="rmg-lbl">${t('rml_pay')}</span><span class="rmg-val">${r.paymentMethod || '?'}</span></div>
      <div class="rmg-cell"><span class="rmg-lbl">${t('rml_btw')}</span><span class="rmg-val">€${(+r.tax || 0).toFixed(2)}</span></div>
      <div class="rmg-cell"><span class="rmg-lbl">${t('rml_items')}</span><span class="rmg-val">${(r.items || []).length}</span></div>
    </div>
    ${r.projectName ? `<div style="margin-bottom:12px"><span class="proj-tag">📁 ${r.projectName}</span></div>` : ''}
    <div class="items-section" style="margin-bottom:14px">
      <div class="items-header">${t('items_lbl')}</div>
      <div class="items-list">
        ${(r.items || []).map(item => `<div class="item-row"><span class="cat-dot dot-${item.category || 'other'}"></span><span class="iname">${item.name}</span><span class="iqty">×${item.qty || 1}</span><span class="iprice">€${(+item.price || 0).toFixed(2)}</span></div>`).join('') || '<div style="padding:12px 16px;color:var(--text3);font-size:13px">Geen artikelen</div>'}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-outline compact" onclick="closeModal();openEditModal(receipts.find(x=>x.id==${id}))">${t('btn_edit')}</button>
      <button class="btn btn-danger-sm" onclick="deleteReceipt(${id})">🗑️ ${t('btn_delete')}</button>
      <button class="btn btn-outline compact" onclick="exportSingle(${id})">📤 Export</button>
    </div>
  `);
}
function deleteReceipt(id) {
  if (!confirm(t('confirm_delete'))) return;
  receipts = receipts.filter(r => r.id != id);
  saveData();
  if (firebaseDb) deleteFromFirebase(id);
  closeModal(); renderHistory();
  showToast(t('toast_deleted'));
}

// ─── STATS ────────────────────────────────────────────
const chartCfg = { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a5568', font: { size: 11 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a5568', font: { size: 11 }, callback: v => '€' + v } } } };

function getFilteredReceipts() {
  const period = document.getElementById('statsPeriod')?.value || 'all';
  const now = new Date();
  return receipts.filter(r => {
    if (!r.date) return true;
    const d = new Date(r.date);
    if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === 'year') return d.getFullYear() === now.getFullYear();
    if (period === 'quarter') { const q = Math.floor(now.getMonth() / 3); return d.getFullYear() === now.getFullYear() && Math.floor(d.getMonth() / 3) === q; }
    return true;
  });
}

function renderStats() {
  const recs = getFilteredReceipts();
  if (!recs.length) {
    document.getElementById('kpiGrid').innerHTML = `<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text3)">${t('no_receipts_stats')}</div>`;
    return;
  }
  const total = recs.reduce((s, r) => s + (+r.total || 0), 0);
  const avg = total / recs.length;
  const max = Math.max(...recs.map(r => +r.total || 0));
  const uniqueItems = new Set(recs.flatMap(r => (r.items || []).map(i => i.name.toLowerCase()))).size;
  const uniqueStores = new Set(recs.map(r => r.store).filter(Boolean)).size;
  const allItemsCount = recs.reduce((s, r) => s + (r.items || []).reduce((a, i) => a + (i.qty || 1), 0), 0);

  document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card cyan"><div class="kpi-icon">💰</div><div class="kpi-num">€${total.toFixed(0)}</div><div class="kpi-lbl">${t('kpi_total')}</div></div>
    <div class="kpi-card green"><div class="kpi-icon">🧾</div><div class="kpi-num">${recs.length}</div><div class="kpi-lbl">${t('kpi_count')}</div></div>
    <div class="kpi-card amber"><div class="kpi-icon">📊</div><div class="kpi-num">€${avg.toFixed(2)}</div><div class="kpi-lbl">${t('kpi_avg')}</div></div>
    <div class="kpi-card purple"><div class="kpi-icon">🏆</div><div class="kpi-num">€${max.toFixed(2)}</div><div class="kpi-lbl">${t('kpi_max')}</div></div>
    <div class="kpi-card cyan"><div class="kpi-icon">📦</div><div class="kpi-num">${uniqueItems}</div><div class="kpi-lbl">${t('kpi_items')}</div><div class="kpi-sub">${allItemsCount} totaal</div></div>
    <div class="kpi-card green"><div class="kpi-icon">🏪</div><div class="kpi-num">${uniqueStores}</div><div class="kpi-lbl">${t('kpi_stores')}</div></div>
  `;

  renderChartMonthly(recs);
  renderChartCat(recs);
  renderChartDay(recs);
  renderChartTrend(recs);
  renderChartHour(recs);
  renderChartProj(recs);
  renderTopStores(recs);
  renderTopItems(recs);
}

function destroyChart(key) { if (charts[key]) { charts[key].destroy(); charts[key] = null; } }

function renderChartMonthly(recs) {
  destroyChart('monthly');
  const monthly = {};
  recs.forEach(r => { const m = (r.date || '').slice(0, 7); if (m) monthly[m] = (monthly[m] || 0) + (+r.total || 0); });
  const labels = Object.keys(monthly).sort();
  const vals = labels.map(k => +monthly[k].toFixed(2));
  charts.monthly = new Chart(document.getElementById('chartMonthly'), {
    type: 'bar',
    data: { labels: labels.map(l => { const [y, m] = l.split('-'); return t('months')[+m - 1] + ' ' + y.slice(2); }), datasets: [{ data: vals, backgroundColor: 'rgba(34,211,238,0.5)', borderColor: '#22d3ee', borderWidth: 1, borderRadius: 5 }] },
    options: { ...chartCfg, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => '€' + ctx.raw.toFixed(2) } } } }
  });
}

function renderChartCat(recs) {
  destroyChart('cat');
  const catTotals = {};
  recs.forEach(r => { const c = r.category || 'other'; catTotals[c] = (catTotals[c] || 0) + (+r.total || 0); });
  const catColors = { food: '#4ade80', drink: '#60a5fa', hygiene: '#c084fc', household: '#fb923c', electronics: '#fbbf24', clothing: '#f472b6', other: '#94a3b8' };
  const keys = Object.keys(catTotals);
  charts.cat = new Chart(document.getElementById('chartCat'), {
    type: 'doughnut',
    data: { labels: keys.map(k => t('cat_' + k).replace(/^\S+ /, '')), datasets: [{ data: keys.map(k => +catTotals[k].toFixed(2)), backgroundColor: keys.map(k => catColors[k] || '#94a3b8'), borderWidth: 0, hoverOffset: 8 }] },
    options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 10 } }, tooltip: { callbacks: { label: ctx => ctx.label + ': €' + ctx.raw.toFixed(2) } } } }
  });
}

function renderChartDay(recs) {
  destroyChart('day');
  const days = new Array(7).fill(0);
  recs.forEach(r => { if (r.date) { const d = new Date(r.date + 'T12:00:00').getDay(); days[d] += (+r.total || 0); } });
  const labels = t('days');
  charts.day = new Chart(document.getElementById('chartDay'), {
    type: 'radar',
    data: { labels, datasets: [{ data: days.map(v => +v.toFixed(2)), borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.1)', pointBackgroundColor: '#22d3ee', borderWidth: 2, pointRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: true, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8', font: { size: 11 } }, ticks: { display: false } } }, plugins: { legend: { display: false } } }
  });
}

function renderChartTrend(recs) {
  destroyChart('trend');
  const now = new Date();
  const days = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days[key] = 0;
  }
  recs.forEach(r => { if (r.date && days.hasOwnProperty(r.date)) days[r.date] += (+r.total || 0); });
  const labels = Object.keys(days);
  const vals = Object.values(days).map(v => +v.toFixed(2));
  charts.trend = new Chart(document.getElementById('chartTrend'), {
    type: 'line',
    data: { labels: labels.map(l => l.slice(5)), datasets: [{ data: vals, borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.08)', fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2 }] },
    options: { ...chartCfg, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => '€' + ctx.raw.toFixed(2) }, mode: 'index', intersect: false } }, scales: { x: { ...chartCfg.scales.x, ticks: { ...chartCfg.scales.x.ticks, maxTicksLimit: 10 } }, y: { ...chartCfg.scales.y, beginAtZero: true } } }
  });
}

function renderChartHour(recs) {
  destroyChart('hour');
  const hours = new Array(24).fill(0);
  recs.forEach(r => { if (r.scannedAt) { const h = new Date(r.scannedAt).getHours(); hours[h] += (+r.total || 0); } });
  charts.hour = new Chart(document.getElementById('chartHour'), {
    type: 'bar',
    data: { labels: hours.map((_, i) => i + 'u'), datasets: [{ data: hours.map(v => +v.toFixed(2)), backgroundColor: 'rgba(167,139,250,0.5)', borderColor: '#a78bfa', borderWidth: 1, borderRadius: 3 }] },
    options: { ...chartCfg, plugins: { legend: { display: false } }, scales: { x: { ...chartCfg.scales.x, ticks: { ...chartCfg.scales.x.ticks, maxTicksLimit: 12 } }, y: chartCfg.scales.y } }
  });
}

function renderChartProj(recs) {
  destroyChart('proj');
  const projTotals = {};
  recs.forEach(r => { const n = r.projectName || 'Geen project'; projTotals[n] = (projTotals[n] || 0) + (+r.total || 0); });
  const keys = Object.keys(projTotals);
  charts.proj = new Chart(document.getElementById('chartProj'), {
    type: 'bar',
    data: { labels: keys, datasets: [{ data: keys.map(k => +projTotals[k].toFixed(2)), backgroundColor: keys.map((_, i) => PROJECT_COLORS[i % PROJECT_COLORS.length] + '80'), borderColor: keys.map((_, i) => PROJECT_COLORS[i % PROJECT_COLORS.length]), borderWidth: 1, borderRadius: 5 }] },
    options: { ...chartCfg, indexAxis: 'y', scales: { x: { ...chartCfg.scales.x, ticks: { ...chartCfg.scales.x.ticks, callback: v => '€' + v } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } } }, plugins: { legend: { display: false } } }
  });
}

function renderTopStores(recs) {
  const stores = {};
  recs.forEach(r => { const s = r.store || '?'; if (!stores[s]) stores[s] = { count: 0, total: 0 }; stores[s].count++; stores[s].total += (+r.total || 0); });
  const sorted = Object.entries(stores).sort((a, b) => b[1].total - a[1].total).slice(0, 8);
  const maxTotal = sorted[0]?.[1].total || 1;
  document.getElementById('topStoresList').innerHTML = sorted.map(([name, d], i) => `
    <div class="top-store-row">
      <span class="ts-rank">#${i + 1}</span>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between"><span class="ts-name">${name}</span><span class="ts-total">€${d.total.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:4px"><div class="ts-bar" style="width:${(d.total / maxTotal * 100).toFixed(0)}%"></div><span class="ts-count">${d.count}×</span></div>
      </div>
    </div>`).join('');
}

function renderTopItems(recs) {
  const items = {};
  recs.forEach(r => { (r.items || []).forEach(item => { if (!item.name) return; const k = item.name.toLowerCase(); if (!items[k]) items[k] = { name: item.name, count: 0, total: 0 }; items[k].count += item.qty || 1; items[k].total += (+item.price || 0) * (item.qty || 1); }); });
  const sorted = Object.values(items).sort((a, b) => b.count - a.count).slice(0, 8);
  document.getElementById('topItemsList').innerHTML = sorted.map((item, i) => `
    <div class="top-store-row">
      <span class="ts-rank">#${i + 1}</span>
      <span class="ts-name">${item.name}</span>
      <span class="ts-count">${item.count}×</span>
      <span class="ts-total">€${item.total.toFixed(2)}</span>
    </div>`).join('');
}

// ─── EXPORT / IMPORT ──────────────────────────────────
function openExportMenu() {
  openModal(t('exp_title'), `
    <div style="display:flex;flex-direction:column;gap:10px;padding-top:4px">
      <button class="btn btn-outline full" onclick="exportAll('json');closeModal()">📥 JSON — volledige data</button>
      <button class="btn btn-outline full" onclick="exportAll('csv');closeModal()">📊 CSV — spreadsheet</button>
      <button class="btn btn-outline full" onclick="exportAll('txt');closeModal()">📄 TXT — leesbaar overzicht</button>
    </div>
  `);
}
function exportAll(fmt) {
  if (!receipts.length) return;
  const name = `bonscan_${today()}`;
  if (fmt === 'json') {
    download(name + '.json', JSON.stringify({ receipts, projects }, null, 2), 'application/json');
  } else if (fmt === 'csv') {
    const rows = [['ID', 'Store', 'Date', 'Total', 'Tax', 'Category', 'Items', 'Payment', 'Project', 'Notes'],
      ...receipts.map(r => [r.id, r.store, r.date, r.total, r.tax, r.category, (r.items || []).length, r.paymentMethod, r.projectName || '', r.notes || ''])];
    download(name + '.csv', rows.map(r => r.map(c => '"' + String(c || '').replace(/"/g, '""') + '"').join(',')).join('\n'), 'text/csv');
  } else {
    const txt = receipts.map(r =>
      `${r.store} | ${r.date} | €${(+r.total).toFixed(2)} | ${r.category}${r.projectName ? ' | ' + r.projectName : ''}\n` +
      (r.items || []).map(i => `  - ${i.name} ×${i.qty || 1} €${(+i.price).toFixed(2)}`).join('\n')
    ).join('\n\n---\n\n');
    download(name + '.txt', txt, 'text/plain');
  }
  showToast(t('toast_exported'), 'success');
}
function exportSingle(id) {
  const r = receipts.find(x => x.id == id);
  if (!r) return;
  download(`receipt_${r.store}_${r.date}.json`, JSON.stringify(r, null, 2), 'application/json');
  showToast(t('toast_exported'), 'success');
}
function importData() { document.getElementById('importFile').click(); }
function handleImport(e) {
  const f = e.target.files[0]; if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.receipts) receipts.push(...data.receipts.filter(r => !receipts.find(x => x.id === r.id)));
      if (data.projects) projects.push(...data.projects.filter(p => !projects.find(x => x.id === p.id)));
      saveData(); showToast(t('toast_imported'), 'success'); renderHistory();
    } catch { showToast('Ongeldig bestand', 'error'); }
  };
  reader.readAsText(f);
}
function clearAll() {
  if (!confirm(t('confirm_clear'))) return;
  receipts = []; saveData(); renderHistory(); renderStats();
  showToast(t('toast_cleared'));
}
function download(name, content, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name; a.click();
}

// ─── API KEY ──────────────────────────────────────────
function saveApiKey() {
  const k = document.getElementById('apiKey').value.trim();
  if (k) localStorage.setItem('bonscan_apikey', k);
  showToast(t('toast_api_saved'), 'success');
}
function toggleApiKeyVisibility() {
  const inp = document.getElementById('apiKey');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

// ─── FIREBASE ─────────────────────────────────────────
async function connectFirebase() {
  const apiKey = document.getElementById('fb-apikey').value.trim();
  const authDomain = document.getElementById('fb-domain').value.trim();
  const projectId = document.getElementById('fb-projid').value.trim();
  if (!apiKey || !authDomain || !projectId) { showToast(t('toast_fill'), 'error'); return; }
  fbConfig = { apiKey, authDomain, projectId };
  localStorage.setItem('bonscan_fbconfig', JSON.stringify(fbConfig));
  initFirebaseUI();
  showToast(t('toast_firebase'), 'success');
}
function initFirebaseUI() {
  if (!fbConfig) return;
  document.getElementById('cloudConnected').style.display = 'flex';
  document.getElementById('firebaseSetup').style.display = 'none';
  document.getElementById('cloudTxt').textContent = '☁️ Firebase';
  document.getElementById('cloudDot').classList.add('connected');
  // In a real deployment, you'd initialize Firebase SDK here
  // For demo: we simulate cloud sync with localStorage-based simulation
  firebaseDb = true;
}
function disconnectFirebase() {
  fbConfig = null; firebaseDb = null;
  localStorage.removeItem('bonscan_fbconfig');
  document.getElementById('cloudConnected').style.display = 'none';
  document.getElementById('firebaseSetup').style.display = 'flex';
  document.getElementById('cloudTxt').textContent = 'Lokaal';
  document.getElementById('cloudDot').classList.remove('connected');
}
function syncToFirebase(r) { /* Firebase SDK calls would go here */ }
function deleteFromFirebase(id) { /* Firebase SDK calls would go here */ }
function showFirebaseGuide() {
  openModal('Firebase handleiding', `
    <div style="font-size:13px;color:var(--text2);line-height:1.8">
      <p style="margin-bottom:10px">Volg deze stappen voor gratis cloud opslag:</p>
      <ol style="padding-left:18px;display:flex;flex-direction:column;gap:8px">
        <li>Ga naar <span style="color:var(--cyan)">console.firebase.google.com</span></li>
        <li>Maak een nieuw project aan (gratis)</li>
        <li>Klik "Voeg app toe" → Web (⟨/⟩)</li>
        <li>Kopieer de config-gegevens</li>
        <li>Ga naar Firestore Database → Maak database → Testmodus</li>
        <li>Plak de gegevens in de velden hier</li>
      </ol>
      <p style="margin-top:12px;color:var(--text3)">De gratis tier biedt 1GB opslag en 50.000 reads per dag.</p>
    </div>
  `);
}

// ─── PWA ──────────────────────────────────────────────
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'inline-flex';
});
function installPWA() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(() => { deferredInstallPrompt = null; });
}

// ─── MODAL ────────────────────────────────────────────
function openModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('overlay').classList.add('open');
  document.getElementById('modal').classList.add('open');
}
function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('modal').classList.remove('open');
}

// ─── TOAST ────────────────────────────────────────────
let toastTimeout;
function showToast(msg, type = '') {
  clearTimeout(toastTimeout);
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = 'show ' + type;
  toastTimeout = setTimeout(() => { el.className = ''; }, 3000);
}

// ─── DEMO DATA ────────────────────────────────────────
function loadDemo() {
  const proj = [
    { id: 9001, name: 'Verbouwing keuken', color: '#22d3ee', budget: 5000, description: 'Materiaal en boodschappen verbouwing' },
    { id: 9002, name: 'Werk onkosten', color: '#4ade80', budget: 300, description: 'Maandelijkse werkkosten' }
  ];
  proj.forEach(p => { if (!projects.find(x => x.id === p.id)) projects.push(p); });
  const demo = [
    { id: 2001, store: 'Albert Heijn', date: '2025-04-28', total: 47.85, subtotal: 44.31, tax: 3.54, category: 'food', paymentMethod: 'pin', currency: 'EUR', projectId: '', projectName: '', items: [{ name: 'Melk 1L', qty: 2, price: 1.89, category: 'drink' }, { name: 'Brood volkoren', qty: 1, price: 2.49, category: 'food' }, { name: 'Kaas 48+', qty: 1, price: 4.79, category: 'food' }, { name: 'Appels 1kg', qty: 1, price: 2.99, category: 'food' }, { name: 'Pasta penne', qty: 2, price: 1.39, category: 'food' }, { name: 'Tomatenblokjes', qty: 3, price: 1.09, category: 'food' }, { name: 'Ketchup', qty: 1, price: 2.19, category: 'food' }], notes: 'Weekboodschappen vrijdag', scannedAt: new Date(2025, 3, 28, 18, 30).toISOString() },
    { id: 2002, store: 'Jumbo', date: '2025-04-24', total: 23.45, subtotal: 21.90, tax: 1.55, category: 'food', paymentMethod: 'card', currency: 'EUR', projectId: '', projectName: '', items: [{ name: 'Kip filet 500g', qty: 1, price: 5.99, category: 'food' }, { name: 'Groente mix', qty: 1, price: 2.49, category: 'food' }, { name: 'Rijst 1kg', qty: 1, price: 1.99, category: 'food' }, { name: 'Olijfolie', qty: 1, price: 4.49, category: 'food' }], notes: '', scannedAt: new Date(2025, 3, 24, 12, 15).toISOString() },
    { id: 2003, store: 'Kruidvat', date: '2025-04-20', total: 18.70, subtotal: 17.50, tax: 1.20, category: 'hygiene', paymentMethod: 'cash', currency: 'EUR', projectId: '', projectName: '', items: [{ name: 'Shampoo', qty: 1, price: 3.99, category: 'hygiene' }, { name: 'Tandpasta', qty: 2, price: 2.49, category: 'hygiene' }, { name: 'Deodorant', qty: 1, price: 4.99, category: 'hygiene' }], notes: '', scannedAt: new Date(2025, 3, 20, 10, 0).toISOString() },
    { id: 2004, store: 'MediaMarkt', date: '2025-04-15', total: 89.99, subtotal: 74.37, tax: 15.62, category: 'electronics', paymentMethod: 'card', currency: 'EUR', projectId: 9001, projectName: 'Verbouwing keuken', items: [{ name: 'USB-C kabel 2m', qty: 2, price: 12.99, category: 'electronics' }, { name: 'Draadloze muis', qty: 1, price: 29.99, category: 'electronics' }, { name: 'HDMI adapter', qty: 1, price: 19.99, category: 'electronics' }], notes: 'Kantoorspullen', scannedAt: new Date(2025, 3, 15, 14, 45).toISOString() },
    { id: 2005, store: 'Lidl', date: '2025-03-30', total: 31.22, subtotal: 29.05, tax: 2.17, category: 'food', paymentMethod: 'pin', currency: 'EUR', projectId: '', projectName: '', items: [{ name: 'Cola 1.5L', qty: 2, price: 1.49, category: 'drink' }, { name: 'Wijn rood', qty: 1, price: 5.99, category: 'drink' }, { name: 'Chips 200g', qty: 3, price: 1.29, category: 'food' }], notes: '', scannedAt: new Date(2025, 2, 30, 16, 20).toISOString() },
    { id: 2006, store: 'HEMA', date: '2025-03-22', total: 42.50, subtotal: 38.89, tax: 3.61, category: 'clothing', paymentMethod: 'card', currency: 'EUR', projectId: 9002, projectName: 'Werk onkosten', items: [{ name: 'T-shirt basic', qty: 2, price: 9.99, category: 'clothing' }, { name: 'Sokken 3-pack', qty: 1, price: 7.99, category: 'clothing' }, { name: 'Riem', qty: 1, price: 14.99, category: 'clothing' }], notes: '', scannedAt: new Date(2025, 2, 22, 11, 30).toISOString() },
    { id: 2007, store: 'Gamma', date: '2025-03-10', total: 156.80, subtotal: 129.59, tax: 27.21, category: 'household', paymentMethod: 'pin', currency: 'EUR', projectId: 9001, projectName: 'Verbouwing keuken', items: [{ name: 'Verf wit 5L', qty: 2, price: 24.99, category: 'household' }, { name: 'Verfroller set', qty: 1, price: 12.99, category: 'household' }, { name: 'Afplaktape', qty: 3, price: 3.49, category: 'household' }, { name: 'Schuimstof', qty: 1, price: 8.99, category: 'household' }], notes: 'Verbouwingsmateriaal', scannedAt: new Date(2025, 2, 10, 9, 0).toISOString() },
    { id: 2008, store: 'Albert Heijn', date: '2025-02-14', total: 38.90, subtotal: 36.10, tax: 2.80, category: 'food', paymentMethod: 'pin', currency: 'EUR', projectId: '', projectName: '', items: [{ name: 'Steak', qty: 2, price: 7.99, category: 'food' }, { name: 'Wijn rosé', qty: 1, price: 8.99, category: 'drink' }, { name: 'Aardbeien', qty: 1, price: 3.49, category: 'food' }, { name: 'Slagroom', qty: 1, price: 1.79, category: 'food' }], notes: 'Valentijnsdag', scannedAt: new Date(2025, 1, 14, 17, 0).toISOString() },
  ];
  demo.forEach(r => { if (!receipts.find(x => x.id === r.id)) receipts.unshift(r); });
  saveData();
  showToast(t('toast_demo'), 'info');
  goPage('history');
}

// ─── HELPERS ──────────────────────────────────────────
function today() { return new Date().toISOString().split('T')[0]; }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function formatDate(d) {
  if (!d) return '';
  try { const dt = new Date(d + 'T12:00:00'); return dt.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

// ─── DATA PERSISTENCE ─────────────────────────────────
function saveData() { localStorage.setItem('bonscan_receipts', JSON.stringify(receipts)); localStorage.setItem('bonscan_projects', JSON.stringify(projects)); }
function loadData() {
  try { const r = localStorage.getItem('bonscan_receipts'); if (r) receipts = JSON.parse(r); } catch {}
  try { const p = localStorage.getItem('bonscan_projects'); if (p) projects = JSON.parse(p); } catch {}
  try { const fb = localStorage.getItem('bonscan_fbconfig'); if (fb) { fbConfig = JSON.parse(fb); initFirebaseUI(); } } catch {}
  const savedLang = localStorage.getItem('bonscan_lang');
  if (savedLang) lang = savedLang;
  const savedKey = localStorage.getItem('bonscan_apikey');
  if (savedKey && document.getElementById('apiKey')) document.getElementById('apiKey').value = savedKey;
}

// ─── SPLASH + INIT ────────────────────────────────────
async function boot() {
  loadData();
  const steps = [
    [20, 'Gegevens laden...'], [40, 'Interface opbouwen...'],
    [70, 'Grafieken initialiseren...'], [90, 'Bijna klaar...'], [100, 'Gereed!']
  ];
  for (const [pct, txt] of steps) {
    document.getElementById('splashFill').style.width = pct + '%';
    document.getElementById('splash-sub').textContent = lang === 'en' ? txt.replace('Gegevens laden', 'Loading data').replace('Interface opbouwen', 'Building interface').replace('Grafieken initialiseren', 'Initializing charts').replace('Bijna klaar', 'Almost done').replace('Gereed', 'Ready') : txt;
    await delay(180);
  }
  await delay(200);
  document.getElementById('splash').style.opacity = '0';
  await delay(500);
  document.getElementById('splash').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  updateAllTexts();
  populateProjectSelects();
  renderCatChips();
  if (lang === 'en') { setLang('en'); return; }
  ['lb-nl', 'lb-nl2'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('active'); });
  ['lb-en', 'lb-en2'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); });
}

document.addEventListener('DOMContentLoaded', boot);

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
