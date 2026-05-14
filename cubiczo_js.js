/* cubiczo_js.js */
// ================= SOUND SYSTEM (Web Audio API) =================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let masterGain = null;
let isSoundEnabled = true; // Respect global sound pref

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);
  }
}
function canPlay() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return isSoundEnabled && !prefersReducedMotion;
}

function playTapSound() {
  if (!canPlay()) return; initAudio();
  const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  osc.connect(gain); gain.connect(masterGain); osc.start(); osc.stop(audioCtx.currentTime + 0.04);
}

function playSaveSound() {
  if (!canPlay()) return; initAudio();
  const dur = 0.08;
  [523.25, 659.25].forEach((freq, i) => { // C5, E5
    const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i*dur);
    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i*dur); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i*dur + dur);
    osc.connect(gain); gain.connect(masterGain); osc.start(audioCtx.currentTime + i*dur); osc.stop(audioCtx.currentTime + i*dur + dur);
  });
}

function playShareSound() {
  if (!canPlay()) return; initAudio();
  const dur = 0.1;
  [523.25, 659.25, 783.99].forEach((freq, i) => { // C5, E5, G5
    const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i*dur);
    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i*dur); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i*dur + dur);
    osc.connect(gain); gain.connect(masterGain); osc.start(audioCtx.currentTime + i*dur); osc.stop(audioCtx.currentTime + i*dur + dur);
  });
}

function playToggleSound(isOn) {
  if (!canPlay()) return; initAudio();
  const freq = isOn ? 900 : 600;
  const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  const gain = audioCtx.createGain(); gain.gain.setValueAtTime(isOn ? 0.1 : 0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
  osc.connect(gain); gain.connect(masterGain); osc.start(); osc.stop(audioCtx.currentTime + 0.06);
}

// ================= THEMES =================
const THEMES = {
  'cotton-candy': { bg: 'linear-gradient(135deg, #FFD6E7, #C9E4FF)', cardBg: 'rgba(255,255,255,0.75)', accent: '#FF85A1', textPrimary: '#3A2040' },
  'obsidian': { bg: '#0A0A0A', cardBg: '#1A1A1A', accent: '#FFFFFF', textPrimary: '#F0F0F0' },
  'sakura-rain': { bg: 'linear-gradient(160deg, #FFE4F0, #FFF0F8)', cardBg: 'rgba(255,230,245,0.85)', accent: '#FF6BA8', textPrimary: '#3C0820' },
  'vhs-glitch': { bg: '#080808', cardBg: 'rgba(20,20,20,0.92)', accent: '#00FFFF', textPrimary: '#C0FFFF' },
  'ocean-depth': { bg: 'linear-gradient(180deg, #0A3050, #082040)', cardBg: 'rgba(10,40,70,0.85)', accent: '#40C8E8', textPrimary: '#C0F0FF' }
}; // truncated for brevity, standard set handles custom styling

// ================= STATE & Persistence =================
const DEFAULT_PROFILE = {
  id: 'pro_' + Math.random().toString(36).substr(2, 9),
  identity: { displayName: 'New Creator', username: '@creator', pronouns: '', tagline: 'Welcome to my world!', hobbies: [], aestheticVibes: [], country: '' },
  links: [],
  media: { avatarBase64: '', galleryPhotos: [], musicBase64: '' },
  style: { themeId: 'cotton-candy', customCSS: '', avatarBorderOn: true },
  stats: { totalViews: 0, totalHearts: 0 }
};

let activeProfile = JSON.parse(localStorage.getItem('cubiczo_active_profile')) || DEFAULT_PROFILE;

function saveProfile() {
  localStorage.setItem('cubiczo_active_profile', JSON.stringify(activeProfile));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ================= ICONS (SVG) =================
const ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
};

// ================= UI BINDING: STUDIO =================

function bindStudioUI() {
  // Tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      playTapSound();
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.section-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
      const titles = {'pane-profile': 'My Profile', 'pane-links': 'My Links', 'pane-media': 'Media & Music', 'pane-style': 'Profile Style', 'pane-more': 'More'};
      document.getElementById('studio-top-title').textContent = titles[tab.dataset.target] || 'Studio';
    });
  });

  // Inputs bi-directional bind
  const bindInput = (id, objPath) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = activeProfile.identity[objPath] || '';
    el.addEventListener('input', (e) => {
      activeProfile.identity[objPath] = e.target.value;
      saveProfile();
      updatePublicProfile(); // live sync
    });
  };
  bindInput('inp-display-name', 'displayName');
  bindInput('inp-username', 'username');
  bindInput('inp-tagline', 'tagline');
  bindInput('inp-pronouns', 'pronouns');
  
  // Add Link
  document.getElementById('btn-add-link').addEventListener('click', () => {
    playTapSound();
    editingLinkId = null;
    document.getElementById('inp-link-title').value = '';
    document.getElementById('inp-link-url').value = '';
    const toggle = document.getElementById('toggle-link-visible');
    if (!toggle.classList.contains('active')) toggle.classList.add('active');
    openSheet('sheet-link-editor');
  });
  
  document.getElementById('btn-save-link').addEventListener('click', () => {
    playSaveSound();
    const title = document.getElementById('inp-link-title').value || 'My Link';
    const url = document.getElementById('inp-link-url').value || '#';
    const visible = document.getElementById('toggle-link-visible').classList.contains('active');
    const platform = document.getElementById('inp-link-platform').value;
    
    if (editingLinkId) {
      const l = activeProfile.links.find(x => x.id === editingLinkId);
      if(l) { l.title = title; l.url = url; l.visible = visible; l.platform = platform; }
    } else {
      activeProfile.links.push({
        id: 'lnk_' + Math.random().toString(36).substr(2, 9),
        title, url, visible, platform, clickCount: 0
      });
    }
    saveProfile();
    renderStudioLinks();
    updatePublicProfile();
    closeSheet('sheet-link-editor');
  });
  
  // Theme selection
  const grid = document.getElementById('theme-grid-container');
  grid.innerHTML = Object.keys(THEMES).map(tid => `
    <div class="theme-swatch ${activeProfile.style.themeId === tid ? 'active' : ''}" data-tid="${tid}" style="background:${THEMES[tid].bg}">
       <div class="theme-swatch-inner" style="background:${THEMES[tid].cardBg}">
          <div class="swatch-avatar" style="background:${THEMES[tid].accent}"></div>
          <div class="swatch-line" style="background:${THEMES[tid].textPrimary}"></div>
          <div class="swatch-line" style="background:${THEMES[tid].textPrimary}; width:50%;"></div>
       </div>
    </div>
  `).join('');
  
  grid.querySelectorAll('.theme-swatch').forEach(sw => {
    sw.addEventListener('click', (e) => {
      document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      activeProfile.style.themeId = sw.dataset.tid;
      saveProfile();
      updatePublicProfile();
      if(typeof playThemeSwitchSound === 'function') playThemeSwitchSound(); else playTapSound();
    });
  });

  // Avatar Upload
  const avatarInp = document.createElement('input'); avatarInp.type = 'file'; avatarInp.accept = 'image/*';
  document.getElementById('btn-edit-photo').addEventListener('click', () => avatarInp.click());
  avatarInp.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        activeProfile.media.avatarBase64 = ev.target.result;
        saveProfile();
        document.getElementById('studio-avatar-preview').style.backgroundImage = `url('${ev.target.result}')`;
        updatePublicProfile();
        playSaveSound();
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Main Share
  document.getElementById('btn-share-main').addEventListener('click', async () => {
    playSaveSound(); // Share sound simulation
    triggerConfetti();
    const shareUrl = window.location.origin + window.location.pathname + '#view?id=' + activeProfile.id;
    try {
      if (navigator.share) await navigator.share({ title: 'My Cubiczo', url: shareUrl });
      else { await navigator.clipboard.writeText(shareUrl); showToast("Link copied to clipboard!"); }
    } catch(e) { }
  });

  renderStudioLinks();
}

let editingLinkId = null;

function renderStudioLinks() {
  const cont = document.getElementById('studio-links-list');
  const msg = document.getElementById('no-links-msg');
  if (activeProfile.links.length === 0) {
    cont.innerHTML = ''; msg.style.display = 'block'; return;
  }
  msg.style.display = 'none';
  cont.innerHTML = activeProfile.links.map(l => `
    <div class="studio-link-card">
      <div class="drag-handle">≡</div>
      <div class="link-thumb" style="color:var(--accent)">
         ${ICONS[l.platform] || ICONS.link}
      </div>
      <div class="link-info">
        <div class="link-info-title" style="text-decoration: ${!l.visible ? 'line-through' : 'none'}; opacity:${!l.visible ? 0.5 : 1}">${l.title}</div>
        <div class="link-info-url">${l.url}</div>
      </div>
      <div class="link-actions">
        <button class="icon-btn btn-edit-lnk" data-id="${l.id}">✎</button>
        <button class="icon-btn btn-del-lnk" data-id="${l.id}">×</button>
      </div>
    </div>
  `).join('');
  
  cont.querySelectorAll('.btn-edit-lnk').forEach(b => b.addEventListener('click', (e) => {
    editingLinkId = e.currentTarget.dataset.id;
    const l = activeProfile.links.find(x => x.id === editingLinkId);
    document.getElementById('inp-link-title').value = l.title;
    document.getElementById('inp-link-url').value = l.url;
    document.getElementById('inp-link-platform').value = l.platform || 'custom';
    const tog = document.getElementById('toggle-link-visible');
    if (l.visible && !tog.classList.contains('active')) tog.classList.add('active');
    if (!l.visible && tog.classList.contains('active')) tog.classList.remove('active');
    openSheet('sheet-link-editor');
  }));
  
  cont.querySelectorAll('.btn-del-lnk').forEach(b => b.addEventListener('click', (e) => {
    activeProfile.links = activeProfile.links.filter(x => x.id !== e.currentTarget.dataset.id);
    saveProfile(); renderStudioLinks(); updatePublicProfile(); playToggleSound(false);
  }));
}

// ================= BOTTOM SHEETS =================
function openSheet(id) {
  const overlay = document.getElementById('sheet-overlay');
  overlay.classList.add('open');
  const sheet = document.getElementById(id);
  sheet.classList.add('open');
}
function closeSheet(id) {
  document.getElementById(id).classList.remove('open');
  document.getElementById('sheet-overlay').classList.remove('open');
}
document.getElementById('sheet-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('sheet-overlay')) {
    document.querySelectorAll('.bottom-sheet.open').forEach(s => s.classList.remove('open'));
    e.target.classList.remove('open');
  }
});


// ================= PREVIEW / VIEW MODE =================

document.getElementById('btn-preview').addEventListener('click', () => {
  playTapSound();
  updatePublicProfile();
  
  // Set up iframe simulation by copying the public profile HTML into the iframe, or just show it embedded.
  // Since we want standard single file, we can just overlay the public view directly.
  const overlay = document.getElementById('preview-overlay');
  const iframe = document.getElementById('preview-iframe');
  
  // Generate HTML for iframe
  const theme = THEMES[activeProfile.style.themeId] || THEMES['cotton-candy'];
  const profileHTML = document.getElementById('public-profile-container').outerHTML;
  const injectCSS = `
    body { margin:0; padding:0; overflow-x:hidden; background: ${theme.bg}; font-family: 'Nunito', sans-serif; color: ${theme.textPrimary}; }
    .public-profile { min-height: 100vh; padding-bottom: 80px; }
    /* Inherit required styles */
    ${document.querySelector('style').innerHTML}
    .profile-avatar.animating::before { animation: spin 4s linear infinite; }
  `;
  
  const iframeContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>${injectCSS}</style>
    </head>
    <body style="background: ${theme.bg};">
      ${profileHTML}
    </body>
    </html>
  `;
  
  iframe.srcdoc = iframeContent;
  overlay.classList.add('active');
});

document.getElementById('btn-close-preview').addEventListener('click', () => {
  playTapSound();
  document.getElementById('preview-overlay').classList.remove('active');
});


function updatePublicProfile() {
  const root = document.getElementById('public-profile-container');
  const theme = THEMES[activeProfile.style.themeId] || THEMES['cotton-candy'];
  
  // Apply theme inline custom properties
  root.style.background = theme.bg;
  root.style.color = theme.textPrimary;
  
  // Update elements
  document.getElementById('pub-name').textContent = activeProfile.identity.displayName || 'Creator Name';
  document.getElementById('pub-name').style.color = theme.textPrimary;
  
  document.getElementById('pub-username').textContent = activeProfile.identity.username || '';
  document.getElementById('pub-tagline').textContent = activeProfile.identity.tagline || '';
  
  // Avatar
  const avatar = document.getElementById('pub-avatar');
  if (activeProfile.media.avatarBase64) {
    avatar.style.backgroundImage = `url('${activeProfile.media.avatarBase64}')`;
  } else {
    avatar.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><circle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%23eee\'/></svg>')`;
  }
  if (activeProfile.style.avatarBorderOn) avatar.classList.add('animating'); else avatar.classList.remove('animating');
  avatar.style.border = `4px solid ${theme.cardBg}`;
  
  // Banner
  const banner = document.getElementById('pub-banner');
  banner.style.background = theme.accent; // Simple solid color banner for now
  
  // Links
  const linksCont = document.getElementById('pub-links');
  const visibleLinks = activeProfile.links.filter(l => l.visible);
  
  linksCont.innerHTML = visibleLinks.map(l => `
    <a href="${l.url}" target="_blank" class="link-card anim-pop" style="background:${theme.cardBg}; border:1px solid rgba(0,0,0,0.05); color:${theme.textPrimary};">
      <div class="link-icon" style="color:${theme.accent}">${ICONS[l.platform] || ICONS.link}</div>
      <div class="link-content">
        <div class="link-title">${l.title}</div>
      </div>
      <div class="link-icon" style="opacity:0.3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></div>
    </a>
  `).join('');
  
  // Attach ripple event dynamically to preview links
  linksCont.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mousedown', createRipple);
    card.addEventListener('touchstart', createRipple);
  });
}

// ================= ANIMATIONS & EFFECTS =================

function triggerConfetti() {
  const colors = ['#FF85A1', '#FFD6E7', '#9B5DE5', '#00FFFF', '#FFD700'];
  for(let i=0; i<40; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    conf.style.animationDuration = (Math.random() * 2 + 1) + 's';
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 3000);
  }
}

function createRipple(e) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const button = e.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const rect = button.getBoundingClientRect();
  
  let clientX, clientY;
  if(e.touches) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; } else { clientX = e.clientX; clientY = e.clientY; }
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${clientX - rect.left - radius}px`;
  circle.style.top = `${clientY - rect.top - radius}px`;
  circle.classList.add('ripple');
  
  const existing = button.querySelector('.ripple');
  if (existing) existing.remove();
  
  button.appendChild(circle);
  playTapSound();
}

// ================= INIT & ROUTING =================
function handleHashChange() {
  const hash = window.location.hash;
  const studio = document.getElementById('studio-view');
  const pub = document.getElementById('public-view');
  
  if (hash.startsWith('#view')) {
    // Show full public view
    document.getElementById('app-root').classList.remove('mode-studio');
    document.getElementById('app-root').classList.add('mode-view');
    studio.classList.add('hidden');
    pub.classList.remove('hidden');
    
    // Simulate fetching profile logic for view
    activeProfile.stats.totalViews++;
    saveProfile();
    updatePublicProfile();
  } else {
    // Show studio mode
    document.getElementById('app-root').classList.add('mode-studio');
    document.getElementById('app-root').classList.remove('mode-view');
    pub.classList.add('hidden');
    studio.classList.remove('hidden');
    if (activeProfile.media.avatarBase64) document.getElementById('studio-avatar-preview').style.backgroundImage = `url('${activeProfile.media.avatarBase64}')`;
  }
}

window.addEventListener('hashchange', handleHashChange);

function initializeApp() {
  bindStudioUI();
  handleHashChange();
  
  // Set initial default theme background for studio editing mode if no base64 avatar
  if (!activeProfile.media.avatarBase64) {
    playSaveSound(); // Boot up
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);

