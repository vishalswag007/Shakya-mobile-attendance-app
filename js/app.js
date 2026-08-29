/**
 * AttendEase Application Controller (Clean 3D Edition)
 * Handles 3D Tactile Interactions, Organization Logo Upload,
 * Candidate Photo Processing, 3D Digital ID Badge, and Audio Feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let currentDate = getTodayDateStr();
  let currentDeptFilter = 'all';
  let searchQuery = '';
  let candidateSearchQuery = '';
  let historyDate = getTodayDateStr();
  let historyStatusFilter = 'all';
  let deferredPrompt = null;
  let audioCtx = null;

  // DOM Elements - Auth & Brand
  const adminLockscreen = document.getElementById('admin-lockscreen');
  const formAdminLogin = document.getElementById('form-admin-login');
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const btnHeaderLogout = document.getElementById('btn-header-logout');
  const btnAdminLogoutSettings = document.getElementById('btn-admin-logout-settings');
  const formUpdateAdminPass = document.getElementById('form-update-admin-pass');
  const adminCurrentPass = document.getElementById('admin-current-pass');
  const adminNewPass = document.getElementById('admin-new-pass');

  // Header Brand & Logo DOM
  const headerBrandEmoji = document.getElementById('header-brand-emoji');
  const headerBrandImg = document.getElementById('header-brand-img');
  const headerOrgTitle = document.getElementById('header-org-title');
  const headerOrgSubtitle = document.getElementById('header-org-subtitle');
  const loginLogoEmoji = document.getElementById('login-logo-emoji');
  const loginLogoImg = document.getElementById('login-logo-img');

  // Organization Logo Upload DOM
  const inputOrgLogoFile = document.getElementById('input-org-logo-file');
  const settingsLogoImg = document.getElementById('settings-logo-img');
  const settingsLogoEmoji = document.getElementById('settings-logo-emoji');
  const btnRemoveOrgLogo = document.getElementById('btn-remove-org-logo');

  // 3D Circular Attendance Gauge DOM
  const gaugeCircleStroke = document.getElementById('gauge-circle-stroke');
  const gaugePercentText = document.getElementById('gauge-percent-text');
  const gaugeStatusSubtext = document.getElementById('gauge-status-subtext');

  // Attendance Tab DOM
  const liveClock = document.getElementById('live-clock');
  const dateInput = document.getElementById('attendance-date-input');
  const datePrevBtn = document.getElementById('date-prev');
  const dateNextBtn = document.getElementById('date-next');
  const btnQuickToday = document.getElementById('btn-quick-today');
  const dateBadgeToday = document.getElementById('date-badge-today');
  const attendanceList = document.getElementById('attendance-list');
  const attendanceSearch = document.getElementById('attendance-search');
  const btnMarkAllPresent = document.getElementById('btn-mark-all-present');
  const deptChipsContainer = document.getElementById('dept-filter-chips');

  const statTotal = document.getElementById('stat-total');
  const statPresent = document.getElementById('stat-present');
  const statAbsent = document.getElementById('stat-absent');
  const statLeave = document.getElementById('stat-leave');

  // Candidate Directory DOM
  const candidatesDirectoryList = document.getElementById('candidates-directory-list');
  const candidateDirectorySearch = document.getElementById('candidate-directory-search');
  const candidateCountBadge = document.getElementById('candidate-count-badge');

  // History Tab DOM
  const historyDatePicker = document.getElementById('history-date-picker');
  const historySummaryDate = document.getElementById('history-summary-date');
  const historySummaryRate = document.getElementById('history-summary-rate');
  const histPresent = document.getElementById('hist-present');
  const histAbsent = document.getElementById('hist-absent');
  const histLeave = document.getElementById('hist-leave');
  const historyRecordsList = document.getElementById('history-records-list');

  // Candidate Registration DOM
  const modalAddCandidate = document.getElementById('modal-add-candidate');
  const formAddCandidate = document.getElementById('form-add-candidate');
  const btnOpenAddCandidate = document.getElementById('btn-open-add-candidate');
  const btnNewCandidateAction = document.getElementById('btn-new-candidate-action');
  const fabAddCandidate = document.getElementById('fab-add-candidate');
  const btnCloseCandidateModal = document.getElementById('btn-close-candidate-modal');
  const candidatePhotoFile = document.getElementById('candidate-photo-file');
  const photoPreviewImg = document.getElementById('photo-preview-img');
  const photoPreviewEmoji = document.getElementById('photo-preview-emoji');
  const btnRemovePhoto = document.getElementById('btn-remove-photo');
  const candidatePhotoData = document.getElementById('candidate-photo-data');
  const candidateAvatarInput = document.getElementById('candidate-avatar');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const candidateDeptSelect = document.getElementById('candidate-dept');

  // Modals DOM
  const modalCandidateDetail = document.getElementById('modal-candidate-detail');
  const btnCloseDetailModal = document.getElementById('btn-close-detail-modal');
  const candidateProfileContent = document.getElementById('candidate-profile-content');
  const modalIdBadge = document.getElementById('modal-id-badge');
  const btnCloseIdBadge = document.getElementById('btn-close-id-badge');
  const idBadgeContainer = document.getElementById('id-badge-container');
  const btnPrintIdCard = document.getElementById('btn-print-id-card');

  const modalAddDept = document.getElementById('modal-add-dept');
  const btnOpenAddDept = document.getElementById('btn-open-add-dept');
  const btnCloseDeptModal = document.getElementById('btn-close-dept-modal');
  const formAddDept = document.getElementById('form-add-dept');
  const inputNewDeptName = document.getElementById('input-new-dept-name');
  const settingsDeptTags = document.getElementById('settings-dept-tags');

  // Settings DOM
  const settingOrgName = document.getElementById('setting-org-name');
  const settingOrgBranch = document.getElementById('setting-org-branch');
  const btnSaveBranding = document.getElementById('btn-save-branding');
  const btnExportBackup = document.getElementById('btn-export-backup');
  const inputImportBackup = document.getElementById('input-import-backup');

  // Deployment DOM
  const inputCloudRoomId = document.getElementById('input-cloud-room-id');
  const btnUpdateRoomId = document.getElementById('btn-update-room-id');
  const btnTriggerPwaInstall = document.getElementById('btn-trigger-pwa-install');
  const btnDeployVercelGuide = document.getElementById('btn-deploy-vercel-guide');
  const btnDeployCpanelGuide = document.getElementById('btn-deploy-cpanel-guide');
  const btnDownloadDeployBundle = document.getElementById('btn-download-deploy-bundle');

  // Desktop Controls
  const toggleFrameBtn = document.getElementById('toggle-frame-btn');
  const resetDataBtn = document.getElementById('reset-data-btn');
  const deviceContainer = document.getElementById('device-container');

  // Export Buttons
  const btnExportExcel = document.getElementById('btn-export-excel');
  const btnSyncSheets = document.getElementById('btn-sync-sheets');

  // ----------------------------------------------------
  // Initialization & Auth Guard
  // ----------------------------------------------------
  checkAdminAuth();
  initClock();
  initDatePickers();
  applySettingsToUI();
  bindNavigation();
  bindEvents();
  renderAll();

  // PWA Install Event Interceptor
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  // Subscribe to store updates
  window.attendanceStore.subscribe(() => {
    checkAdminAuth();
    applySettingsToUI();
    renderAll();
  });

  // ----------------------------------------------------
  // Audio & Tactile Synthesizer
  // ----------------------------------------------------
  function playTactileClick() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}

    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  // ----------------------------------------------------
  // Auth Functions
  // ----------------------------------------------------
  function checkAdminAuth() {
    const isLoggedIn = window.attendanceStore.isLoggedIn();
    if (isLoggedIn) {
      adminLockscreen.classList.add('hidden');
    } else {
      adminLockscreen.classList.remove('hidden');
    }
  }

  // ----------------------------------------------------
  // Date Helpers
  // ----------------------------------------------------
  function getTodayDateStr() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDateHuman(dateStr) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('en-US', options);
  }

  function initDatePickers() {
    dateInput.value = currentDate;
    historyDatePicker.value = historyDate;
    updateDateBadge();
  }

  function updateDateBadge() {
    const today = getTodayDateStr();
    if (currentDate === today) {
      dateBadgeToday.textContent = 'TODAY';
      dateBadgeToday.className = 'text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold shadow-sm';
    } else {
      const d = new Date(currentDate + 'T00:00:00');
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateBadgeToday.textContent = formatted.toUpperCase();
      dateBadgeToday.className = 'text-[10px] bg-indigo-100 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold shadow-sm';
    }
  }

  function changeDate(delta) {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    currentDate = d.toISOString().split('T')[0];
    dateInput.value = currentDate;
    updateDateBadge();
    renderAttendanceList();
    renderStats();
  }

  function initClock() {
    function updateClock() {
      const now = new Date();
      liveClock.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    updateClock();
    setInterval(updateClock, 10000);
  }

  // ----------------------------------------------------
  // Settings & Theme Management
  // ----------------------------------------------------
  function applySettingsToUI() {
    const settings = window.attendanceStore.getSettings();

    // Theme Accent
    document.body.className = `theme-${settings.themeAccent || 'indigo'}`;
    document.querySelectorAll('.theme-swatch').forEach(swatch => {
      const theme = swatch.getAttribute('data-theme');
      const checkIcon = swatch.querySelector('i');
      if (theme === settings.themeAccent) {
        swatch.classList.add('border-slate-900');
        swatch.classList.remove('border-transparent');
        if (checkIcon) checkIcon.classList.remove('opacity-0');
      } else {
        swatch.classList.remove('border-slate-900');
        swatch.classList.add('border-transparent');
        if (checkIcon) checkIcon.classList.add('opacity-0');
      }
    });

    // Branding Header Logo (Uploaded Image vs Emoji)
    if (settings.orgLogoUrl) {
      headerBrandImg.src = settings.orgLogoUrl;
      headerBrandImg.classList.remove('hidden');
      headerBrandEmoji.classList.add('hidden');

      loginLogoImg.src = settings.orgLogoUrl;
      loginLogoImg.classList.remove('hidden');
      loginLogoEmoji.classList.add('hidden');

      settingsLogoImg.src = settings.orgLogoUrl;
      settingsLogoImg.classList.remove('hidden');
      settingsLogoEmoji.classList.add('hidden');
      btnRemoveOrgLogo.classList.remove('hidden');
    } else {
      headerBrandImg.classList.add('hidden');
      headerBrandEmoji.classList.remove('hidden');
      headerBrandEmoji.textContent = settings.orgLogo || '⚡';

      loginLogoImg.classList.add('hidden');
      loginLogoEmoji.classList.remove('hidden');
      loginLogoEmoji.textContent = settings.orgLogo || '⚡';

      settingsLogoImg.classList.add('hidden');
      settingsLogoEmoji.classList.remove('hidden');
      settingsLogoEmoji.textContent = settings.orgLogo || '⚡';
      btnRemoveOrgLogo.classList.add('hidden');
    }

    headerOrgTitle.innerHTML = `${escapeHtml(settings.orgName || 'AttendEase Systems')}`;
    headerOrgSubtitle.textContent = settings.orgBranch || 'HQ Campus';

    // Settings Inputs
    settingOrgName.value = settings.orgName || '';
    settingOrgBranch.value = settings.orgBranch || '';
    inputCloudRoomId.value = settings.cloudRoomId || 'GLOBAL-CAMPUS-2026';

    renderDepartmentUI(settings.departments || []);
  }

  function renderDepartmentUI(departments) {
    deptChipsContainer.innerHTML = `
      <button class="chip ${currentDeptFilter === 'all' ? 'active bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'} text-[11px] px-3 py-1 rounded-full font-bold whitespace-nowrap" data-dept="all">All</button>
      ${departments.map(dept => `
        <button class="chip ${currentDeptFilter === dept ? 'active bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'} text-[11px] px-3 py-1 rounded-full font-bold whitespace-nowrap" data-dept="${escapeHtml(dept)}">${escapeHtml(dept)}</button>
      `).join('')}
    `;

    deptChipsContainer.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        currentDeptFilter = chip.getAttribute('data-dept');
        renderDepartmentUI(departments);
        renderAttendanceList();
      });
    });

    candidateDeptSelect.innerHTML = departments.map(d => `
      <option value="${escapeHtml(d)}">${escapeHtml(d)}</option>
    `).join('');

    settingsDeptTags.innerHTML = departments.map(d => `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
        ${escapeHtml(d)}
        <button class="btn-remove-dept text-slate-400 hover:text-rose-600 transition" data-dept="${escapeHtml(d)}" title="Remove Department">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </span>
    `).join('');

    settingsDeptTags.querySelectorAll('.btn-remove-dept').forEach(btn => {
      btn.addEventListener('click', () => {
        const dept = btn.getAttribute('data-dept');
        if (confirm(`Remove "${dept}" from departments?`)) {
          window.attendanceStore.removeDepartment(dept);
          showToast(`Department "${dept}" removed`, 'trash-2');
        }
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Avatar / Photo Renderer Helper
  // ----------------------------------------------------
  function renderAvatar(candidate) {
    if (candidate.photoUrl) {
      return `<img src="${escapeHtml(candidate.photoUrl)}" alt="${escapeHtml(candidate.name)}" class="candidate-avatar-img">`;
    }
    return `<span>${candidate.avatar || '👤'}</span>`;
  }

  // ----------------------------------------------------
  // Tab Navigation
  // ----------------------------------------------------
  function bindNavigation() {
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        dockItems.forEach(i => i.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.add('hidden');
          pane.classList.remove('active');
        });

        const activePane = document.getElementById(targetTab);
        if (activePane) {
          activePane.classList.remove('hidden');
          activePane.classList.add('active');
        }

        if (targetTab === 'tab-attendance' || targetTab === 'tab-candidates') {
          fabAddCandidate.style.display = 'flex';
        } else {
          fabAddCandidate.style.display = 'none';
        }

        if (window.lucide) lucide.createIcons();
      });
    });
  }

  // ----------------------------------------------------
  // Rendering Logic
  // ----------------------------------------------------
  function renderAll() {
    renderAttendanceList();
    renderStats();
    renderCandidatesDirectory();
    renderHistory();
    if (window.lucide) lucide.createIcons();
  }

  function renderStats() {
    const stats = window.attendanceStore.getStatsForDate(currentDate);
    statTotal.textContent = stats.total;
    statPresent.textContent = stats.present;
    statAbsent.textContent = stats.absent;
    statLeave.textContent = stats.leave;

    // 3D Circular Progress Gauge Animation
    if (gaugeCircleStroke) {
      gaugeCircleStroke.setAttribute('stroke-dasharray', `${stats.rate}, 100`);
      gaugePercentText.textContent = `${stats.rate}%`;
      const markedCount = stats.present + stats.absent + stats.leave;
      gaugeStatusSubtext.textContent = `${markedCount} of ${stats.total} marked today`;
    }
  }

  function renderAttendanceList() {
    const candidates = window.attendanceStore.getCandidates();
    const attendanceMap = window.attendanceStore.getAttendanceForDate(currentDate);

    const filtered = candidates.filter(c => {
      const matchDept = currentDeptFilter === 'all' || c.department === currentDeptFilter;
      const matchSearch = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSearch;
    });

    if (filtered.length === 0) {
      attendanceList.innerHTML = `
        <div class="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <i data-lucide="user-x" class="w-6 h-6"></i>
          </div>
          <p class="text-sm font-bold text-slate-800">No candidates found</p>
          <p class="text-xs text-slate-500 mt-1">Try adjusting your search or add a new candidate.</p>
        </div>
      `;
      return;
    }

    attendanceList.innerHTML = filtered.map(candidate => {
      const status = attendanceMap[candidate.id] || 'unmarked';
      
      const isPresent = status === 'present';
      const isAbsent = status === 'absent';
      const isLeave = status === 'leave';

      let statusCardClass = '';
      if (isPresent) statusCardClass = 'status-present';
      else if (isAbsent) statusCardClass = 'status-absent';
      else if (isLeave) statusCardClass = 'status-leave';

      return `
        <div class="candidate-card ${statusCardClass}" data-id="${candidate.id}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 cursor-pointer candidate-info-trigger" data-id="${candidate.id}">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-sm overflow-hidden shrink-0">
                ${renderAvatar(candidate)}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-sm text-slate-900">${escapeHtml(candidate.name)}</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-indigo-700 font-mono font-bold border border-slate-200">${candidate.id}</span>
                </div>
                <p class="text-xs text-slate-500 font-medium">${escapeHtml(candidate.role)} • <span class="text-indigo-600 font-semibold">${escapeHtml(candidate.department)}</span></p>
              </div>
            </div>

            <div class="text-right">
              ${renderStatusBadge(status)}
            </div>
          </div>

          <!-- 3D Tactile Attendance Buttons -->
          <div class="attendance-actions">
            <button class="btn-status btn-present ${isPresent ? 'active' : ''}" data-status="present" data-candidate="${candidate.id}">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> Present
            </button>
            <button class="btn-status btn-absent ${isAbsent ? 'active' : ''}" data-status="absent" data-candidate="${candidate.id}">
              <i data-lucide="x" class="w-3.5 h-3.5"></i> Absent
            </button>
            <button class="btn-status btn-leave ${isLeave ? 'active' : ''}" data-status="leave" data-candidate="${candidate.id}">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i> Leave
            </button>
          </div>
        </div>
      `;
    }).join('');

    attendanceList.querySelectorAll('.btn-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playTactileClick();
        const candidateId = btn.getAttribute('data-candidate');
        const status = btn.getAttribute('data-status');
        window.attendanceStore.markAttendance(candidateId, currentDate, status);
      });
    });

    attendanceList.querySelectorAll('.candidate-info-trigger').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        openCandidateDetailModal(id);
      });
    });
  }

  function renderStatusBadge(status) {
    if (status === 'present') {
      return `<span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">PRESENT</span>`;
    }
    if (status === 'absent') {
      return `<span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 shadow-sm">ABSENT</span>`;
    }
    if (status === 'leave') {
      return `<span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">LEAVE</span>`;
    }
    return `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">UNMARKED</span>`;
  }

  function renderCandidatesDirectory() {
    const candidates = window.attendanceStore.getCandidates();
    candidateCountBadge.textContent = candidates.length;

    const filtered = candidates.filter(c => {
      if (!candidateSearchQuery) return true;
      const q = candidateSearchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) ||
             c.id.toLowerCase().includes(q) ||
             c.department.toLowerCase().includes(q) ||
             c.role.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      candidatesDirectoryList.innerHTML = `
        <div class="text-center py-10 text-slate-400 text-xs bg-white border border-slate-200 rounded-3xl shadow-sm">
          No candidates match "${escapeHtml(candidateSearchQuery)}"
        </div>
      `;
      return;
    }

    candidatesDirectoryList.innerHTML = filtered.map(c => {
      const history = window.attendanceStore.getCandidateAttendanceHistory(c.id);
      const totalDays = history.length;
      const presentDays = history.filter(h => h.status === 'present').length;
      const rate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

      return `
        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between hover:border-slate-300 transition shadow-3d-card">
          <div class="flex items-center gap-3 cursor-pointer candidate-row" data-id="${c.id}">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl overflow-hidden shrink-0 shadow-sm">
              ${renderAvatar(c)}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-sm text-slate-900">${escapeHtml(c.name)}</h4>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono font-bold">${c.id}</span>
              </div>
              <p class="text-xs text-slate-500">${escapeHtml(c.role)} • <span class="text-indigo-600 font-semibold">${escapeHtml(c.department)}</span></p>
              <div class="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                <span>📞 ${escapeHtml(c.phone || 'No phone')}</span>
                <span>•</span>
                <span class="text-emerald-700 font-bold">${rate}% attendance</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button class="btn-open-id-card p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm" data-id="${c.id}" title="3D Digital ID Badge">
              <i data-lucide="qr-code" class="w-4 h-4"></i>
            </button>
            <button class="btn-delete-candidate p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-sm" data-id="${c.id}" title="Delete Candidate">
              <i data-lucide="trash" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    candidatesDirectoryList.querySelectorAll('.candidate-row').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        openCandidateDetailModal(id);
      });
    });

    candidatesDirectoryList.querySelectorAll('.btn-open-id-card').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.getAttribute('data-id');
        open3DIdBadgeModal(id);
      });
    });

    candidatesDirectoryList.querySelectorAll('.btn-delete-candidate').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.getAttribute('data-id');
        const candidate = window.attendanceStore.getCandidateById(id);
        if (confirm(`Are you sure you want to remove ${candidate?.name || 'this candidate'}?`)) {
          window.attendanceStore.deleteCandidate(id);
          showToast(`Candidate removed`, 'trash-2');
        }
      });
    });
  }

  function renderHistory() {
    historySummaryDate.textContent = formatDateHuman(historyDate);
    const stats = window.attendanceStore.getStatsForDate(historyDate);
    const attendanceMap = window.attendanceStore.getAttendanceForDate(historyDate);
    const candidates = window.attendanceStore.getCandidates();

    histPresent.textContent = stats.present;
    histAbsent.textContent = stats.absent;
    histLeave.textContent = stats.leave;
    historySummaryRate.textContent = `${stats.rate}% Rate`;

    const records = candidates.map(c => {
      return {
        ...c,
        status: attendanceMap[c.id] || 'unmarked'
      };
    }).filter(item => {
      if (historyStatusFilter === 'all') return true;
      return item.status === historyStatusFilter;
    });

    if (records.length === 0) {
      historyRecordsList.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl shadow-sm">
          No records matching the selected status for this date.
        </div>
      `;
      return;
    }

    historyRecordsList.innerHTML = records.map(r => `
      <div class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base overflow-hidden shrink-0 shadow-sm">
            ${renderAvatar(r)}
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">${escapeHtml(r.name)} <span class="text-[10px] text-slate-400 font-mono font-normal">(${r.id})</span></p>
            <p class="text-[11px] text-slate-500">${escapeHtml(r.department)}</p>
          </div>
        </div>
        <div>
          ${renderStatusBadge(r.status)}
        </div>
      </div>
    `).join('');
  }

  // ----------------------------------------------------
  // Candidate Detail Profile Modal
  // ----------------------------------------------------
  function openCandidateDetailModal(candidateId) {
    const candidate = window.attendanceStore.getCandidateById(candidateId);
    if (!candidate) return;

    const history = window.attendanceStore.getCandidateAttendanceHistory(candidateId);
    const totalDays = history.length;
    const presentCount = history.filter(h => h.status === 'present').length;
    const absentCount = history.filter(h => h.status === 'absent').length;
    const leaveCount = history.filter(h => h.status === 'leave').length;
    const rate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 100;

    candidateProfileContent.innerHTML = `
      <div class="text-center pb-3 border-b border-slate-200">
        <div class="w-20 h-20 rounded-3xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-3xl mx-auto mb-2 shadow-md overflow-hidden">
          ${renderAvatar(candidate)}
        </div>
        <h3 class="text-lg font-extrabold text-slate-900">${escapeHtml(candidate.name)}</h3>
        <p class="text-xs text-indigo-700 font-semibold">${escapeHtml(candidate.role)} • <span class="text-slate-500">${escapeHtml(candidate.department)}</span></p>
        <span class="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200">${candidate.id}</span>
      </div>

      <div class="grid grid-cols-4 gap-2 text-center my-3">
        <div class="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm">
          <span class="block text-indigo-700 font-extrabold text-sm">${rate}%</span>
          <span class="text-[9px] text-slate-500 uppercase font-bold">Rate</span>
        </div>
        <div class="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm">
          <span class="block text-emerald-600 font-extrabold text-sm">${presentCount}</span>
          <span class="text-[9px] text-slate-500 uppercase font-bold">Present</span>
        </div>
        <div class="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm">
          <span class="block text-rose-600 font-extrabold text-sm">${absentCount}</span>
          <span class="text-[9px] text-slate-500 uppercase font-bold">Absent</span>
        </div>
        <div class="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm">
          <span class="block text-amber-600 font-extrabold text-sm">${leaveCount}</span>
          <span class="text-[9px] text-slate-500 uppercase font-bold">Leave</span>
        </div>
      </div>

      <button class="btn-profile-id-badge w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm">
        <i data-lucide="qr-code" class="w-4 h-4"></i> View 3D Digital ID Card & QR Badge
      </button>

      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
        <div class="flex items-center justify-between text-slate-700">
          <span class="text-slate-500 font-medium">Email:</span>
          <span>${escapeHtml(candidate.email || 'Not provided')}</span>
        </div>
        <div class="flex items-center justify-between text-slate-700">
          <span class="text-slate-500 font-medium">Phone:</span>
          <span>${escapeHtml(candidate.phone || 'Not provided')}</span>
        </div>
        <div class="flex items-center justify-between text-slate-700">
          <span class="text-slate-500 font-medium">Enrolled:</span>
          <span>${candidate.createdAt || 'August 2026'}</span>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Recent Attendance Logs</h4>
        <div class="max-h-44 overflow-y-auto space-y-2 pr-1">
          ${history.length > 0 ? history.map(h => `
            <div class="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-2xl text-xs shadow-sm">
              <span class="font-medium text-slate-700">${formatDateHuman(h.date)}</span>
              ${renderStatusBadge(h.status)}
            </div>
          `).join('') : '<p class="text-xs text-slate-400 text-center py-4">No attendance marked yet.</p>'}
        </div>
      </div>
    `;

    candidateProfileContent.querySelector('.btn-profile-id-badge').addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
      open3DIdBadgeModal(candidateId);
    });

    modalCandidateDetail.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  // ----------------------------------------------------
  // 3D Digital Candidate ID Badge Modal
  // ----------------------------------------------------
  function open3DIdBadgeModal(candidateId) {
    const candidate = window.attendanceStore.getCandidateById(candidateId);
    const settings = window.attendanceStore.getSettings();
    if (!candidate) return;

    // Generate dynamic QR Code SVG representation
    const qrData = encodeURIComponent(`ATTENDEASE:${candidate.id}:${candidate.name}`);
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrData}&color=1e1b4b`;

    const logoHtml = settings.orgLogoUrl ? 
      `<img src="${settings.orgLogoUrl}" class="w-8 h-8 rounded-lg object-cover">` : 
      `<span class="text-2xl">${settings.orgLogo || '⚡'}</span>`;

    idBadgeContainer.innerHTML = `
      <div id="printable-id-card" class="digital-id-badge">
        <div class="id-badge-lanyard-hole"></div>
        <div class="id-badge-hologram"></div>

        <!-- Org Header -->
        <div class="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-3.5">
          <div class="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
            ${logoHtml}
          </div>
          <div>
            <h4 class="text-xs font-black text-slate-900 uppercase tracking-tight">${escapeHtml(settings.orgName || 'AttendEase Systems')}</h4>
            <p class="text-[9px] text-slate-500 font-semibold">${escapeHtml(settings.orgBranch || 'Campus HQ')} • Official ID</p>
          </div>
        </div>

        <!-- Candidate Photo & Details -->
        <div class="flex items-center gap-4 mb-3.5">
          <div class="w-20 h-20 rounded-2xl bg-white border-2 border-indigo-200 overflow-hidden shadow-md shrink-0 flex items-center justify-center text-3xl">
            ${renderAvatar(candidate)}
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">${candidate.id}</span>
            <h3 class="text-base font-extrabold text-slate-900 truncate mt-1">${escapeHtml(candidate.name)}</h3>
            <p class="text-xs text-indigo-700 font-bold truncate">${escapeHtml(candidate.role)}</p>
            <p class="text-[11px] text-slate-500">${escapeHtml(candidate.department)}</p>
          </div>
        </div>

        <!-- QR Code & Barcode Section -->
        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 shadow-inner">
          <div>
            <span class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Scan for Attendance</span>
            <p class="text-[10px] text-slate-700 font-mono font-bold">STATUS: AUTHORIZED</p>
            <p class="text-[9px] text-emerald-600 font-bold mt-1">✓ VALID 2026-2027</p>
          </div>
          <div class="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center">
            <img src="${qrImgUrl}" alt="QR" class="w-full h-full object-contain">
          </div>
        </div>
      </div>
    `;

    modalIdBadge.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Photo & Logo Compression Engines
  // ----------------------------------------------------
  function processCandidatePhoto(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'alert-circle');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        photoPreviewImg.src = compressedDataUrl;
        photoPreviewImg.classList.remove('hidden');
        photoPreviewEmoji.classList.add('hidden');
        btnRemovePhoto.classList.remove('hidden');
        candidatePhotoData.value = compressedDataUrl;

        showToast('Candidate photo attached!', 'image');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function processOrgLogo(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'alert-circle');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const logoDataUrl = canvas.toDataURL('image/png');
        window.attendanceStore.updateOrgLogo(logoDataUrl);
        showToast('Organization Logo updated!', 'sparkles');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ----------------------------------------------------
  // Event Bindings
  // ----------------------------------------------------
  function bindEvents() {
    // Admin Login Form
    formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = loginUsername.value;
      const pass = loginPassword.value;

      const res = window.attendanceStore.loginAdmin(user, pass);
      if (res.success) {
        loginErrorMsg.classList.add('hidden');
        adminLockscreen.classList.add('hidden');
        playTactileClick();
        showToast('Welcome Administrator!', 'shield-check');
      } else {
        loginErrorMsg.textContent = res.error;
        loginErrorMsg.classList.remove('hidden');
        if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
      }
    });

    // Admin Logout
    const handleLogout = () => {
      if (confirm('Are you sure you want to log out as Admin?')) {
        window.attendanceStore.logoutAdmin();
        checkAdminAuth();
        showToast('Logged out securely', 'log-out');
      }
    };
    btnHeaderLogout.addEventListener('click', handleLogout);
    btnAdminLogoutSettings.addEventListener('click', handleLogout);

    // Update Admin Password
    formUpdateAdminPass.addEventListener('submit', (e) => {
      e.preventDefault();
      const cur = adminCurrentPass.value;
      const neu = adminNewPass.value;

      const res = window.attendanceStore.updateAdminPassword(cur, neu);
      if (res.success) {
        formUpdateAdminPass.reset();
        showToast('Admin password updated!', 'key');
      } else {
        alert(res.error);
      }
    });

    // Date Navigation
    datePrevBtn.addEventListener('click', () => changeDate(-1));
    dateNextBtn.addEventListener('click', () => changeDate(1));
    btnQuickToday.addEventListener('click', () => {
      currentDate = getTodayDateStr();
      dateInput.value = currentDate;
      updateDateBadge();
      renderAttendanceList();
      renderStats();
      showToast('Jumped to Today', 'calendar');
    });

    dateInput.addEventListener('change', (e) => {
      currentDate = e.target.value || getTodayDateStr();
      updateDateBadge();
      renderAttendanceList();
      renderStats();
    });

    // Attendance Search
    attendanceSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderAttendanceList();
    });

    // Mark All Present
    btnMarkAllPresent.addEventListener('click', () => {
      playTactileClick();
      window.attendanceStore.markAllAttendance(currentDate, 'present');
      showToast('All candidates marked Present!', 'check-check');
    });

    // Candidate Directory Search
    candidateDirectorySearch.addEventListener('input', (e) => {
      candidateSearchQuery = e.target.value;
      renderCandidatesDirectory();
    });

    // Candidate Photo Upload Picker
    candidatePhotoFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processCandidatePhoto(e.target.files[0]);
      }
    });

    btnRemovePhoto.addEventListener('click', () => {
      candidatePhotoFile.value = '';
      candidatePhotoData.value = '';
      photoPreviewImg.src = '';
      photoPreviewImg.classList.add('hidden');
      photoPreviewEmoji.classList.remove('hidden');
      btnRemovePhoto.classList.add('hidden');
    });

    // Organization Logo Upload Picker
    inputOrgLogoFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processOrgLogo(e.target.files[0]);
      }
    });

    btnRemoveOrgLogo.addEventListener('click', () => {
      inputOrgLogoFile.value = '';
      window.attendanceStore.removeOrgLogo();
      showToast('Reset to default logo icon', 'rotate-ccw');
    });

    // Open Add Candidate Modal
    const openAddCandidateModal = () => {
      formAddCandidate.reset();
      candidatePhotoData.value = '';
      photoPreviewImg.src = '';
      photoPreviewImg.classList.add('hidden');
      photoPreviewEmoji.classList.remove('hidden');
      btnRemovePhoto.classList.add('hidden');
      candidateAvatarInput.value = '👨‍💻';

      avatarOptions.forEach((btn, idx) => {
        if (idx === 0) {
          btn.className = 'avatar-option active w-9 h-9 rounded-2xl bg-indigo-50 border-2 border-indigo-600 text-lg flex items-center justify-center shadow-sm';
        } else {
          btn.className = 'avatar-option w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 text-lg flex items-center justify-center';
        }
      });
      modalAddCandidate.classList.add('open');
    };

    btnOpenAddCandidate.addEventListener('click', openAddCandidateModal);
    btnNewCandidateAction.addEventListener('click', openAddCandidateModal);
    fabAddCandidate.addEventListener('click', openAddCandidateModal);

    btnCloseCandidateModal.addEventListener('click', () => {
      modalAddCandidate.classList.remove('open');
    });

    modalAddCandidate.addEventListener('click', (e) => {
      if (e.target === modalAddCandidate) modalAddCandidate.classList.remove('open');
    });

    avatarOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        avatarOptions.forEach(b => {
          b.className = 'avatar-option w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 text-lg flex items-center justify-center';
        });
        btn.className = 'avatar-option active w-9 h-9 rounded-2xl bg-indigo-50 border-2 border-indigo-600 text-lg flex items-center justify-center shadow-sm';
        const emoji = btn.getAttribute('data-emoji');
        candidateAvatarInput.value = emoji;
        if (!candidatePhotoData.value) {
          photoPreviewEmoji.textContent = emoji;
        }
      });
    });

    formAddCandidate.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('candidate-name').value;
      const id = document.getElementById('candidate-id').value;
      const department = document.getElementById('candidate-dept').value;
      const role = document.getElementById('candidate-role').value;
      const phone = document.getElementById('candidate-phone').value;
      const email = document.getElementById('candidate-email').value;
      const photoUrl = candidatePhotoData.value || null;
      const avatar = candidateAvatarInput.value || '👤';

      if (!name) return;

      const newCand = window.attendanceStore.addCandidate({
        name,
        id,
        department,
        role: role || `${department} Member`,
        phone,
        email,
        avatar,
        photoUrl
      });

      modalAddCandidate.classList.remove('open');
      playTactileClick();
      showToast(`Registered ${newCand.name}`, 'user-check');
    });

    // Candidate Detail Modal Close
    btnCloseDetailModal.addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
    });
    modalCandidateDetail.addEventListener('click', (e) => {
      if (e.target === modalCandidateDetail) modalCandidateDetail.classList.remove('open');
    });

    // 3D Digital ID Badge Modal Close & Print
    btnCloseIdBadge.addEventListener('click', () => {
      modalIdBadge.classList.remove('open');
    });
    modalIdBadge.addEventListener('click', (e) => {
      if (e.target === modalIdBadge) modalIdBadge.classList.remove('open');
    });

    btnPrintIdCard.addEventListener('click', () => {
      window.print();
    });

    // History Date Change
    historyDatePicker.addEventListener('change', (e) => {
      historyDate = e.target.value || getTodayDateStr();
      renderHistory();
    });

    // History Filters
    document.querySelectorAll('.hist-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hist-filter').forEach(b => {
          b.classList.remove('active', 'bg-indigo-600', 'text-white');
          b.classList.add('bg-white');
        });
        btn.classList.add('active', 'bg-indigo-600', 'text-white');
        btn.classList.remove('bg-white');
        historyStatusFilter = btn.getAttribute('data-status');
        renderHistory();
      });
    });

    // Theme Swatch Selector
    document.querySelectorAll('.theme-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const theme = swatch.getAttribute('data-theme');
        window.attendanceStore.updateSettings({ themeAccent: theme });
        showToast(`Theme updated to ${theme.toUpperCase()}`, 'palette');
      });
    });

    // Save Branding
    btnSaveBranding.addEventListener('click', () => {
      const name = settingOrgName.value || 'AttendEase Systems';
      const branch = settingOrgBranch.value || 'HQ';

      window.attendanceStore.updateSettings({
        orgName: name,
        orgBranch: branch
      });

      showToast('Branding updated!', 'check');
    });

    // Add Department Modal
    btnOpenAddDept.addEventListener('click', () => {
      formAddDept.reset();
      modalAddDept.classList.add('open');
    });

    btnCloseDeptModal.addEventListener('click', () => {
      modalAddDept.classList.remove('open');
    });

    modalAddDept.addEventListener('click', (e) => {
      if (e.target === modalAddDept) modalAddDept.classList.remove('open');
    });

    formAddDept.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inputNewDeptName.value;
      if (val) {
        window.attendanceStore.addDepartment(val);
        modalAddDept.classList.remove('open');
        showToast(`Department "${val}" added!`, 'plus');
      }
    });

    // Update Cloud Room ID
    btnUpdateRoomId.addEventListener('click', () => {
      const room = inputCloudRoomId.value;
      if (room) {
        window.attendanceStore.setCloudRoomId(room);
        showToast(`Connected to Cloud Room: ${room}`, 'cloud');
      }
    });

    // PWA Install Trigger
    btnTriggerPwaInstall.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          showToast('AttendEase installed successfully!', 'sparkles');
        }
        deferredPrompt = null;
      } else {
        showToast('To install: Open browser menu and tap "Add to Home Screen"', 'smartphone');
      }
    });

    // Deployment Guides
    btnDeployVercelGuide.addEventListener('click', () => {
      showDeploymentGuide('Vercel / Netlify Live Hosting', `
1. Push this project folder to a GitHub repository.
2. Go to vercel.com or netlify.com and click "New Project".
3. Select your repository and hit Deploy.
4. You will get a live URL to share with all staff!
      `);
    });

    btnDeployCpanelGuide.addEventListener('click', () => {
      showDeploymentGuide('cPanel / Apache PHP Hosting', `
1. Zip this project folder.
2. Upload and extract to public_html in cPanel File Manager.
3. In Step 2, configure MySQL and connect all devices to the same backend.
      `);
    });

    btnDownloadDeployBundle.addEventListener('click', () => {
      downloadDeploymentReadme();
    });

    // Backup & Restore
    btnExportBackup.addEventListener('click', () => {
      const json = window.attendanceStore.exportFullDataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AttendEase_Backup_${getTodayDateStr()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Backup JSON downloaded', 'file-down');
    });

    inputImportBackup.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = window.attendanceStore.importFullDataJSON(event.target.result);
        if (res.success) {
          showToast('Backup restored successfully!', 'check-circle');
        } else {
          showToast('Failed to import backup: ' + res.error, 'alert-triangle');
        }
      };
      reader.readAsText(file);
    });

    // Reset Data
    const handleReset = () => {
      localStorage.clear();
      window.attendanceStore.init();
      window.attendanceStore.notify();
      showToast('Data reset to defaults', 'rotate-ccw');
    };
    resetDataBtn.addEventListener('click', handleReset);

    // Desktop Frame Toggle
    toggleFrameBtn.addEventListener('click', () => {
      deviceContainer.classList.toggle('fullscreen-mode');
      toggleFrameBtn.classList.toggle('active');
    });

    // Export Excel / CSV
    btnExportExcel.addEventListener('click', () => {
      exportAttendanceCSV(historyDate);
    });

    // Sync Sheets
    btnSyncSheets.addEventListener('click', () => {
      showToast('Google Sheets Sync ready for Step 3 API', 'cloud');
    });
  }

  // ----------------------------------------------------
  // Utility & Feedback
  // ----------------------------------------------------
  function showToast(message, icon = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 text-emerald-400"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.remove();
    }, 2600);
  }

  function showDeploymentGuide(title, steps) {
    alert(`${title}\n\n${steps}`);
  }

  function downloadDeploymentReadme() {
    const content = `# AttendEase - Online Deployment Instructions

## How Anyone in the World Can Use This App & See the Same Data

### Method 1: 1-Click Free Hosting (Vercel / Netlify / GitHub Pages)
1. Push this folder to a GitHub repository.
2. Connect the repository on https://vercel.com or https://netlify.com.
3. Click **Deploy**.
4. You receive a public live URL (e.g. \`https://attendease-app.vercel.app\`).
5. Share this URL with your teachers, managers, or staff members.

### Method 2: Multi-Device Shared Database
- When multiple phones open your deployed URL and enter the same **Cloud Room ID**, all candidate registrations, photos, and attendance logs are shared in real-time.

### Method 3: Mobile Home Screen App (PWA)
- Open the live link on Safari (iPhone) or Chrome (Android).
- Tap the **Share/Menu** icon and select **Add to Home Screen**.
- The app will run like a native mobile app without needing app store downloads!
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HOW_TO_DEPLOY_ONLINE.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Deployment guide downloaded', 'file-down');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function exportAttendanceCSV(dateStr) {
    const candidates = window.attendanceStore.getCandidates();
    const attendanceMap = window.attendanceStore.getAttendanceForDate(dateStr);

    let csv = 'Candidate ID,Full Name,Department,Designation,Phone,Email,Date,Status\n';
    candidates.forEach(c => {
      const status = (attendanceMap[c.id] || 'unmarked').toUpperCase();
      csv += `"${c.id}","${c.name}","${c.department}","${c.role}","${c.phone}","${c.email}","${dateStr}","${status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported report for ${dateStr}`, 'file-check');
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
