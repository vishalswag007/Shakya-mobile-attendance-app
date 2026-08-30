/**
 * AttendEase Coaching Institute Edition (100+ Students Scalability)
 * Handles Student Registration (Roll No, Name, Father Name, Contact, Address, Batch, Course, Photo),
 * Prominent Active Month Display, Batch/Course Filtering, and Dedicated Weekly/Monthly Student History.
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let currentDate = getTodayDateStr();
  let currentBatchFilter = 'all';
  let currentCourseFilter = 'all';
  let searchQuery = '';
  let candidateSearchQuery = '';
  let historyDate = getTodayDateStr();
  let historyStatusFilter = 'all';
  let selectedStudentRollNo = null;
  let historyViewMode = 'weekly'; // 'weekly' | 'monthly'
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

  // Logo Upload DOM
  const inputOrgLogoFile = document.getElementById('input-org-logo-file');
  const settingsLogoImg = document.getElementById('settings-logo-img');
  const settingsLogoEmoji = document.getElementById('settings-logo-emoji');
  const btnRemoveOrgLogo = document.getElementById('btn-remove-org-logo');

  // Month Display & Gauge DOM
  const currentMonthDisplay = document.getElementById('current-month-display');
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
  const batchFilterChips = document.getElementById('batch-filter-chips');
  const courseFilterChips = document.getElementById('course-filter-chips');

  const statTotal = document.getElementById('stat-total');
  const statPresent = document.getElementById('stat-present');
  const statAbsent = document.getElementById('stat-absent');
  const statLeave = document.getElementById('stat-leave');

  // Student Directory DOM
  const candidatesDirectoryList = document.getElementById('candidates-directory-list');
  const candidateDirectorySearch = document.getElementById('candidate-directory-search');
  const candidateCountBadge = document.getElementById('candidate-count-badge');

  // Dedicated Student History View DOM
  const historyStudentSelect = document.getElementById('history-student-select');
  const historyStudentCard = document.getElementById('history-student-card');
  const btnViewWeekly = document.getElementById('btn-view-weekly');
  const btnViewMonthly = document.getElementById('btn-view-monthly');
  const individualHistoryContent = document.getElementById('individual-history-content');

  // Date-wise Logs Tab DOM
  const historyDatePicker = document.getElementById('history-date-picker');
  const historySummaryDate = document.getElementById('history-summary-date');
  const historySummaryRate = document.getElementById('history-summary-rate');
  const histPresent = document.getElementById('hist-present');
  const histAbsent = document.getElementById('hist-absent');
  const histLeave = document.getElementById('hist-leave');
  const historyRecordsList = document.getElementById('history-records-list');

  // Student Registration Form DOM
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
  const studentRollNo = document.getElementById('student-roll-no');
  const studentName = document.getElementById('student-name');
  const studentFatherName = document.getElementById('student-father-name');
  const studentContactNo = document.getElementById('student-contact-no');
  const studentEmail = document.getElementById('student-email');
  const studentCourse = document.getElementById('student-course');
  const studentBatch = document.getElementById('student-batch');
  const studentAddress = document.getElementById('student-address');

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

  // Export Buttons
  const btnExportExcel = document.getElementById('btn-export-excel');
  const btnSyncSheets = document.getElementById('btn-sync-sheets');
  const toggleFrameBtn = document.getElementById('toggle-frame-btn');
  const resetDataBtn = document.getElementById('reset-data-btn');
  const deviceContainer = document.getElementById('device-container');

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
  // Audio Feedback Synthesizer
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
  // Date & Month Helpers
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

  function updateMonthDisplay() {
    const dateObj = new Date(currentDate + 'T00:00:00');
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (currentMonthDisplay) {
      currentMonthDisplay.textContent = monthName;
    }
  }

  function initDatePickers() {
    dateInput.value = currentDate;
    historyDatePicker.value = historyDate;
    updateDateBadge();
    updateMonthDisplay();
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
    updateMonthDisplay();
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
      headerBrandEmoji.textContent = settings.orgLogo || '🎓';

      loginLogoImg.classList.add('hidden');
      loginLogoEmoji.classList.remove('hidden');
      loginLogoEmoji.textContent = settings.orgLogo || '🎓';

      settingsLogoImg.classList.add('hidden');
      settingsLogoEmoji.classList.remove('hidden');
      settingsLogoEmoji.textContent = settings.orgLogo || '🎓';
      btnRemoveOrgLogo.classList.add('hidden');
    }

    headerOrgTitle.innerHTML = `${escapeHtml(settings.orgName || 'Apex Coaching Institute')}`;
    headerOrgSubtitle.textContent = settings.orgBranch || 'Main Campus';

    // Settings Inputs
    settingOrgName.value = settings.orgName || '';
    settingOrgBranch.value = settings.orgBranch || '';

    // Render Filter Chips and Dropdowns
    renderCourseAndBatchUI(settings.courses || [], settings.batchTimings || []);
  }

  function renderCourseAndBatchUI(courses, batchTimings) {
    // 1. Batch Filter Chips
    batchFilterChips.innerHTML = `
      <button class="chip ${currentBatchFilter === 'all' ? 'active bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'} text-[11px] px-3 py-1 rounded-full font-bold whitespace-nowrap" data-batch="all">All Batches</button>
      ${batchTimings.map(b => {
        const shortName = b.split('(')[1] ? b.split('(')[1].replace(')', '') : b.substring(0, 15);
        return `
          <button class="chip ${currentBatchFilter === b ? 'active bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'} text-[11px] px-3 py-1 rounded-full font-bold whitespace-nowrap" data-batch="${escapeHtml(b)}">
            ${escapeHtml(shortName)}
          </button>
        `;
      }).join('')}
    `;

    batchFilterChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        currentBatchFilter = chip.getAttribute('data-batch');
        renderCourseAndBatchUI(courses, batchTimings);
        renderAttendanceList();
        renderStats();
      });
    });

    // 2. Course Filter Chips
    courseFilterChips.innerHTML = `
      <button class="chip ${currentCourseFilter === 'all' ? 'active bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'} text-[11px] px-3 py-1 rounded-full font-bold whitespace-nowrap" data-course="all">All Courses</button>
      ${courses.map(c => `
        <button class="chip ${currentCourseFilter === c ? 'active bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'} text-[11px] px-3 py-1 rounded-full font-bold whitespace-nowrap" data-course="${escapeHtml(c)}">
          ${escapeHtml(c)}
        </button>
      `).join('')}
    `;

    courseFilterChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        currentCourseFilter = chip.getAttribute('data-course');
        renderCourseAndBatchUI(courses, batchTimings);
        renderAttendanceList();
        renderStats();
      });
    });

    // 3. Populate Registration Selects
    studentCourse.innerHTML = courses.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    studentBatch.innerHTML = batchTimings.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');

    // 4. Settings Course List
    settingsDeptTags.innerHTML = courses.map(c => `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
        ${escapeHtml(c)}
        <button class="btn-remove-dept text-slate-400 hover:text-rose-600 transition" data-course="${escapeHtml(c)}" title="Remove Course">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </span>
    `).join('');

    settingsDeptTags.querySelectorAll('.btn-remove-dept').forEach(btn => {
      btn.addEventListener('click', () => {
        const course = btn.getAttribute('data-course');
        if (confirm(`Remove "${course}" from courses?`)) {
          window.attendanceStore.removeCourse(course);
          showToast(`Course removed`, 'trash-2');
        }
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Avatar / Photo Renderer Helper
  // ----------------------------------------------------
  function renderAvatar(student) {
    if (student.photoUrl) {
      return `<img src="${escapeHtml(student.photoUrl)}" alt="${escapeHtml(student.name)}" class="student-avatar-img">`;
    }
    return `<span>${student.avatar || '👨‍🎓'}</span>`;
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

        if (targetTab === 'tab-student-history') {
          renderStudentHistoryDropdown();
          renderIndividualStudentHistory();
        }

        if (window.lucide) lucide.createIcons();
      });
    });
  }

  // ----------------------------------------------------
  // Rendering Logic (Coaching Students)
  // ----------------------------------------------------
  function getFilteredStudents() {
    const students = window.attendanceStore.getStudents() || [];
    const q = (searchQuery || '').trim().toLowerCase();

    return students.filter(s => {
      const matchBatch = currentBatchFilter === 'all' || s.batchTime === currentBatchFilter;
      const matchCourse = currentCourseFilter === 'all' || s.courseName === currentCourseFilter;
      const matchSearch = !q || 
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.rollNo && String(s.rollNo).toLowerCase().includes(q)) ||
        (s.fatherName && s.fatherName.toLowerCase().includes(q)) ||
        (s.courseName && s.courseName.toLowerCase().includes(q));
      return matchBatch && matchCourse && matchSearch;
    });
  }

  function renderAll() {
    updateMonthDisplay();
    renderAttendanceList();
    renderStats();
    renderCandidatesDirectory();
    renderStudentHistoryDropdown();
    renderIndividualStudentHistory();
    renderHistory();
    if (window.lucide) lucide.createIcons();
  }

  function renderStats() {
    const filtered = getFilteredStudents();
    const stats = window.attendanceStore.getStatsForDate(currentDate, filtered);
    statTotal.textContent = stats.total;
    statPresent.textContent = stats.present;
    statAbsent.textContent = stats.absent;
    statLeave.textContent = stats.leave;

    if (gaugeCircleStroke) {
      gaugeCircleStroke.setAttribute('stroke-dasharray', `${stats.rate}, 100`);
      gaugePercentText.textContent = `${stats.rate}%`;
      const markedCount = stats.present + stats.absent + stats.leave;
      gaugeStatusSubtext.textContent = `${markedCount} of ${stats.total} students marked today`;
    }
  }

  function renderAttendanceList() {
    const filtered = getFilteredStudents();
    const attendanceMap = window.attendanceStore.getAttendanceForDate(currentDate);

    if (filtered.length === 0) {
      attendanceList.innerHTML = `
        <div class="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <i data-lucide="user-x" class="w-6 h-6"></i>
          </div>
          <p class="text-sm font-bold text-slate-800">No students match filter</p>
          <p class="text-xs text-slate-500 mt-1">Adjust your search or register a new student.</p>
        </div>
      `;
      return;
    }

    attendanceList.innerHTML = filtered.map(student => {
      const status = attendanceMap[student.rollNo] || 'unmarked';
      
      const isPresent = status === 'present';
      const isAbsent = status === 'absent';
      const isLeave = status === 'leave';

      let statusCardClass = '';
      if (isPresent) statusCardClass = 'status-present';
      else if (isAbsent) statusCardClass = 'status-absent';
      else if (isLeave) statusCardClass = 'status-leave';

      return `
        <div class="student-card ${statusCardClass}" data-roll="${student.rollNo}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 cursor-pointer student-info-trigger" data-roll="${student.rollNo}">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-sm overflow-hidden shrink-0">
                ${renderAvatar(student)}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-mono font-black border border-indigo-200">Roll: ${student.rollNo}</span>
                  <h4 class="font-extrabold text-sm text-slate-900">${escapeHtml(student.name)}</h4>
                </div>
                
                <!-- Father's Name (Distinct differentiator) -->
                <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span class="father-name-badge">
                    👨 S/o ${escapeHtml(student.fatherName)}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span class="batch-pill">${escapeHtml(student.batchTime.split('(')[0])}</span>
                  <span class="course-pill">${escapeHtml(student.courseName)}</span>
                </div>
              </div>
            </div>

            <div class="text-right">
              ${renderStatusBadge(status)}
            </div>
          </div>

          <!-- 3D Attendance Buttons -->
          <div class="attendance-actions">
            <button class="btn-status btn-present ${isPresent ? 'active' : ''}" data-status="present" data-roll="${student.rollNo}">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> Present
            </button>
            <button class="btn-status btn-absent ${isAbsent ? 'active' : ''}" data-status="absent" data-roll="${student.rollNo}">
              <i data-lucide="x" class="w-3.5 h-3.5"></i> Absent
            </button>
            <button class="btn-status btn-leave ${isLeave ? 'active' : ''}" data-status="leave" data-roll="${student.rollNo}">
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
        const rollNo = btn.getAttribute('data-roll');
        const status = btn.getAttribute('data-status');
        window.attendanceStore.markAttendance(rollNo, currentDate, status);
      });
    });

    attendanceList.querySelectorAll('.student-info-trigger').forEach(el => {
      el.addEventListener('click', () => {
        const roll = el.getAttribute('data-roll');
        openCandidateDetailModal(roll);
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
    const students = window.attendanceStore.getStudents();
    candidateCountBadge.textContent = students.length;

    const filtered = students.filter(s => {
      if (!candidateSearchQuery) return true;
      const q = candidateSearchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
             String(s.rollNo).toLowerCase().includes(q) ||
             s.fatherName.toLowerCase().includes(q) ||
             s.courseName.toLowerCase().includes(q) ||
             s.batchTime.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      candidatesDirectoryList.innerHTML = `
        <div class="text-center py-10 text-slate-400 text-xs bg-white border border-slate-200 rounded-3xl shadow-sm">
          No students match "${escapeHtml(candidateSearchQuery)}"
        </div>
      `;
      return;
    }

    candidatesDirectoryList.innerHTML = filtered.map(s => {
      const history = window.attendanceStore.getCandidateAttendanceHistory(s.rollNo);
      const totalDays = history.length;
      const presentDays = history.filter(h => h.status === 'present').length;
      const rate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

      return `
        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between hover:border-slate-300 transition shadow-3d-card">
          <div class="flex items-center gap-3 cursor-pointer student-row" data-roll="${s.rollNo}">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl overflow-hidden shrink-0 shadow-sm">
              ${renderAvatar(s)}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-black">Roll: ${s.rollNo}</span>
                <h4 class="font-extrabold text-sm text-slate-900">${escapeHtml(s.name)}</h4>
              </div>
              <p class="text-xs text-slate-600 font-semibold mt-0.5">👨 S/o ${escapeHtml(s.fatherName)}</p>
              <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span>📞 ${escapeHtml(s.contactNo || 'No phone')}</span>
                <span>•</span>
                <span class="text-emerald-700 font-bold">${rate}% attendance</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button class="btn-view-student-log p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm" data-roll="${s.rollNo}" title="View Individual History">
              <i data-lucide="calendar-search" class="w-4 h-4"></i>
            </button>
            <button class="btn-delete-candidate p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-sm" data-roll="${s.rollNo}" title="Delete Student">
              <i data-lucide="trash" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    candidatesDirectoryList.querySelectorAll('.student-row').forEach(el => {
      el.addEventListener('click', () => {
        const roll = el.getAttribute('data-roll');
        openCandidateDetailModal(roll);
      });
    });

    candidatesDirectoryList.querySelectorAll('.btn-view-student-log').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const roll = el.getAttribute('data-roll');
        selectedStudentRollNo = roll;
        // Switch to Student History Tab
        document.querySelector('.dock-item[data-tab="tab-student-history"]').click();
      });
    });

    candidatesDirectoryList.querySelectorAll('.btn-delete-candidate').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const roll = el.getAttribute('data-roll');
        const s = window.attendanceStore.getStudentByRollNo(roll);
        if (confirm(`Remove student ${s?.name || ''} (Roll: ${roll})?`)) {
          window.attendanceStore.deleteStudent(roll);
          showToast(`Student removed`, 'trash-2');
        }
      });
    });
  }

  // ----------------------------------------------------
  // Dedicated Individual Student History View Engine
  // ----------------------------------------------------
  function renderStudentHistoryDropdown() {
    const students = window.attendanceStore.getStudents();
    if (students.length === 0) {
      historyStudentSelect.innerHTML = `<option value="">No students registered</option>`;
      return;
    }

    if (!selectedStudentRollNo || !students.some(s => String(s.rollNo) === String(selectedStudentRollNo))) {
      selectedStudentRollNo = students[0].rollNo;
    }

    historyStudentSelect.innerHTML = students.map(s => `
      <option value="${s.rollNo}" ${String(s.rollNo) === String(selectedStudentRollNo) ? 'selected' : ''}>
        Roll ${s.rollNo}: ${s.name} (S/o ${s.fatherName}) - ${s.courseName}
      </option>
    `).join('');
  }

  function renderIndividualStudentHistory() {
    const student = window.attendanceStore.getStudentByRollNo(selectedStudentRollNo);
    if (!student) {
      historyStudentCard.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">Please select a student to view attendance history.</p>`;
      individualHistoryContent.innerHTML = '';
      return;
    }

    // Clean Phone number for WhatsApp & Call
    const rawPhone = student.contactNo.replace(/[^0-9]/g, '');

    // 1. Header Card
    historyStudentCard.innerHTML = `
      <div class="flex items-center gap-3.5">
        <div class="w-16 h-16 rounded-2xl bg-white border-2 border-indigo-200 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-3xl">
          ${renderAvatar(student)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-mono font-bold">Roll: ${student.rollNo}</span>
            <h3 class="text-base font-extrabold text-slate-900 truncate">${escapeHtml(student.name)}</h3>
          </div>
          <p class="text-xs font-bold text-slate-700 mt-0.5">👨 Father: ${escapeHtml(student.fatherName)}</p>
          <p class="text-[11px] text-slate-500 truncate">${escapeHtml(student.courseName)} • ${escapeHtml(student.batchTime.split('(')[0])}</p>
        </div>
      </div>

      <!-- Quick Action Buttons: Call & WhatsApp Parent -->
      <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-indigo-100">
        <a href="tel:${student.contactNo}" class="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <i data-lucide="phone-call" class="w-3.5 h-3.5 text-emerald-600"></i> Call Parent
        </a>
        <a href="https://wa.me/${rawPhone}?text=Hello%2C%20Attendance%20Report%20for%20${encodeURIComponent(student.name)}%20(Roll%20${student.rollNo})" target="_blank" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp Parent
        </a>
      </div>
    `;

    // 2. Timeline Breakdown (Weekly vs Monthly)
    if (historyViewMode === 'weekly') {
      const weekly = window.attendanceStore.getStudentHistoryWeekly(student.rollNo, currentDate);
      
      individualHistoryContent.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-700">Week: ${weekly.weekRange}</span>
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">${weekly.rate}% Rate</span>
          </div>

          <div class="grid grid-cols-4 gap-2 text-center mb-4">
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-indigo-700 font-extrabold text-sm">${weekly.totalClasses}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Classes</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-emerald-600 font-extrabold text-sm">${weekly.present}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Present</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-rose-600 font-extrabold text-sm">${weekly.absent}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Absent</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-amber-600 font-extrabold text-sm">${weekly.leave}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Leave</span>
            </div>
          </div>

          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Weekly Day Log</h4>
          <div class="space-y-2">
            ${weekly.logs.map(log => `
              <div class="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-10 font-bold text-slate-700">${log.dayName}</span>
                  <span class="text-slate-500 font-mono text-[11px]">${log.date}</span>
                </div>
                <div>
                  ${renderStatusBadge(log.status)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      // Monthly View Matrix
      const currentYearMonth = currentDate.substring(0, 7); // 'YYYY-MM'
      const monthly = window.attendanceStore.getStudentHistoryMonthly(student.rollNo, currentYearMonth);

      individualHistoryContent.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-900">Month: ${monthly.monthName}</span>
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">${monthly.rate}% Attendance</span>
          </div>

          <div class="grid grid-cols-4 gap-2 text-center mb-4">
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-indigo-700 font-extrabold text-sm">${monthly.totalClasses}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Held</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-emerald-600 font-extrabold text-sm">${monthly.present}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Present</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-rose-600 font-extrabold text-sm">${monthly.absent}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Absent</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-amber-600 font-extrabold text-sm">${monthly.leave}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Leave</span>
            </div>
          </div>

          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Monthly Matrix (Day 1 - 31)</h4>
          <div class="history-month-grid mb-4">
            ${monthly.logs.map(log => {
              let cellClass = 'day-unmarked';
              let char = '·';
              if (log.status === 'present') { cellClass = 'day-present'; char = 'P'; }
              else if (log.status === 'absent') { cellClass = 'day-absent'; char = 'A'; }
              else if (log.status === 'leave') { cellClass = 'day-leave'; char = 'L'; }

              return `
                <div class="history-day-cell ${cellClass}" title="${log.date}: ${log.status.toUpperCase()}">
                  <span class="text-[10px] leading-tight">${log.day}</span>
                  <span class="text-[8px] font-black">${char}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Present</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Absent</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Leave</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span> Unmarked</span>
          </div>
        </div>
      `;
    }

    if (window.lucide) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Date-wise Logs
  // ----------------------------------------------------
  function renderHistory() {
    historySummaryDate.textContent = formatDateHuman(historyDate);
    const stats = window.attendanceStore.getStatsForDate(historyDate);
    const attendanceMap = window.attendanceStore.getAttendanceForDate(historyDate);
    const students = window.attendanceStore.getStudents();

    histPresent.textContent = stats.present;
    histAbsent.textContent = stats.absent;
    histLeave.textContent = stats.leave;
    historySummaryRate.textContent = `${stats.rate}% Rate`;

    const records = students.map(s => {
      return {
        ...s,
        status: attendanceMap[s.rollNo] || 'unmarked'
      };
    }).filter(item => {
      if (historyStatusFilter === 'all') return true;
      return item.status === historyStatusFilter;
    });

    if (records.length === 0) {
      historyRecordsList.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl shadow-sm">
          No records matching selected status for this date.
        </div>
      `;
      return;
    }

    historyRecordsList.innerHTML = records.map(r => `
      <div class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base overflow-hidden shrink-0 shadow-sm">
            ${renderAvatar(r)}
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">Roll ${r.rollNo}: ${escapeHtml(r.name)} <span class="text-[10px] text-slate-500 font-normal">(S/o ${escapeHtml(r.fatherName)})</span></p>
            <p class="text-[11px] text-slate-500">${escapeHtml(r.courseName)} • ${escapeHtml(r.batchTime.split('(')[0])}</p>
          </div>
        </div>
        <div>
          ${renderStatusBadge(r.status)}
        </div>
      </div>
    `).join('');
  }

  // ----------------------------------------------------
  // Student Detail Profile Modal
  // ----------------------------------------------------
  function openCandidateDetailModal(rollNo) {
    const student = window.attendanceStore.getStudentByRollNo(rollNo);
    if (!student) return;

    const history = window.attendanceStore.getCandidateAttendanceHistory(student.rollNo);
    const totalDays = history.length;
    const presentCount = history.filter(h => h.status === 'present').length;
    const absentCount = history.filter(h => h.status === 'absent').length;
    const leaveCount = history.filter(h => h.status === 'leave').length;
    const rate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 100;

    candidateProfileContent.innerHTML = `
      <div class="text-center pb-3 border-b border-slate-200">
        <div class="w-20 h-20 rounded-3xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-3xl mx-auto mb-2 shadow-md overflow-hidden">
          ${renderAvatar(student)}
        </div>
        <h3 class="text-lg font-extrabold text-slate-900">${escapeHtml(student.name)}</h3>
        <p class="text-xs font-bold text-indigo-700">👨 Father's Name: ${escapeHtml(student.fatherName)}</p>
        <span class="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono font-bold border border-slate-200">Roll No: ${student.rollNo}</span>
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

      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
        <div class="flex items-center justify-between text-slate-700">
          <span class="text-slate-500 font-medium">Course:</span>
          <span class="font-bold text-indigo-700">${escapeHtml(student.courseName)}</span>
        </div>
        <div class="flex items-center justify-between text-slate-700">
          <span class="text-slate-500 font-medium">Batch:</span>
          <span class="font-bold">${escapeHtml(student.batchTime)}</span>
        </div>
        <div class="flex items-center justify-between text-slate-700">
          <span class="text-slate-500 font-medium">Contact No:</span>
          <span>${escapeHtml(student.contactNo || 'Not provided')}</span>
        </div>
        <div class="flex items-center justify-between text-slate-700">
          <span class="text-slate-500 font-medium">Address:</span>
          <span>${escapeHtml(student.address || 'Not provided')}</span>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="btn-profile-id-badge flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <i data-lucide="qr-code" class="w-4 h-4"></i> ID Card
        </button>
        <button class="btn-profile-open-history flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <i data-lucide="calendar" class="w-4 h-4"></i> View Log
        </button>
      </div>
    `;

    candidateProfileContent.querySelector('.btn-profile-id-badge').addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
      open3DIdBadgeModal(rollNo);
    });

    candidateProfileContent.querySelector('.btn-profile-open-history').addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
      selectedStudentRollNo = rollNo;
      document.querySelector('.dock-item[data-tab="tab-student-history"]').click();
    });

    modalCandidateDetail.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  // ----------------------------------------------------
  // 3D Digital Candidate ID Badge Modal
  // ----------------------------------------------------
  function open3DIdBadgeModal(rollNo) {
    const student = window.attendanceStore.getStudentByRollNo(rollNo);
    const settings = window.attendanceStore.getSettings();
    if (!student) return;

    const qrData = encodeURIComponent(`STUDENT:${student.rollNo}:${student.name}:${student.fatherName}`);
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrData}&color=1e1b4b`;

    const logoHtml = settings.orgLogoUrl ? 
      `<img src="${settings.orgLogoUrl}" class="w-8 h-8 rounded-lg object-cover">` : 
      `<span class="text-2xl">${settings.orgLogo || '🎓'}</span>`;

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
            <h4 class="text-xs font-black text-slate-900 uppercase tracking-tight">${escapeHtml(settings.orgName || 'Apex Coaching Institute')}</h4>
            <p class="text-[9px] text-slate-500 font-semibold">${escapeHtml(settings.orgBranch || 'Campus HQ')} • Student ID</p>
          </div>
        </div>

        <!-- Student Photo & Details -->
        <div class="flex items-center gap-4 mb-3.5">
          <div class="w-20 h-20 rounded-2xl bg-white border-2 border-indigo-200 overflow-hidden shadow-md shrink-0 flex items-center justify-center text-3xl">
            ${renderAvatar(student)}
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[9px] font-mono font-black px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">Roll: ${student.rollNo}</span>
            <h3 class="text-base font-extrabold text-slate-900 truncate mt-1">${escapeHtml(student.name)}</h3>
            <p class="text-xs text-slate-700 font-bold truncate">👨 S/o ${escapeHtml(student.fatherName)}</p>
            <p class="text-[11px] text-indigo-600 font-bold truncate">${escapeHtml(student.courseName)}</p>
          </div>
        </div>

        <!-- QR Code -->
        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 shadow-inner">
          <div>
            <span class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Attendance QR Pass</span>
            <p class="text-[10px] text-slate-700 font-mono font-bold">BATCH: ${escapeHtml(student.batchTime.split('(')[0])}</p>
            <p class="text-[9px] text-emerald-600 font-bold mt-1">✓ ENROLLED 2026-2027</p>
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
  // Photo Processing
  // ----------------------------------------------------
  function processCandidatePhoto(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select an image file', 'alert-circle');
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

        showToast('Student photo attached!', 'image');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function processOrgLogo(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select an image file', 'alert-circle');
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
        showToast('Institute Logo updated!', 'sparkles');
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

    // Quick 1-Click Demo Login Bypass
    const btnQuickBypassLogin = document.getElementById('btn-quick-bypass-login');
    if (btnQuickBypassLogin) {
      btnQuickBypassLogin.addEventListener('click', () => {
        window.attendanceStore.loginAdmin('admin', 'admin123');
        adminLockscreen.classList.add('hidden');
        playTactileClick();
        showToast('Dashboard Unlocked!', 'sparkles');
      });
    }

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
      renderStats();
    });

    // Mark All Present
    btnMarkAllPresent.addEventListener('click', () => {
      playTactileClick();
      const filtered = getFilteredStudents();
      window.attendanceStore.markAllAttendance(currentDate, 'present', filtered);
      showToast('Filtered students marked Present!', 'check-check');
    });

    // Student Directory Search
    candidateDirectorySearch.addEventListener('input', (e) => {
      candidateSearchQuery = e.target.value;
      renderCandidatesDirectory();
    });

    // Dedicated Student History Select Change
    historyStudentSelect.addEventListener('change', (e) => {
      selectedStudentRollNo = e.target.value;
      renderIndividualStudentHistory();
    });

    // Weekly vs Monthly Toggle Buttons
    btnViewWeekly.addEventListener('click', () => {
      historyViewMode = 'weekly';
      btnViewWeekly.className = 'flex-1 py-2 rounded-xl text-xs font-extrabold transition bg-white text-indigo-700 shadow-sm';
      btnViewMonthly.className = 'flex-1 py-2 rounded-xl text-xs font-extrabold transition text-slate-600 hover:text-slate-900';
      renderIndividualStudentHistory();
    });

    btnViewMonthly.addEventListener('click', () => {
      historyViewMode = 'monthly';
      btnViewMonthly.className = 'flex-1 py-2 rounded-xl text-xs font-extrabold transition bg-white text-indigo-700 shadow-sm';
      btnViewWeekly.className = 'flex-1 py-2 rounded-xl text-xs font-extrabold transition text-slate-600 hover:text-slate-900';
      renderIndividualStudentHistory();
    });

    // Photo Upload Picker
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

    // Org Logo Upload
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

    // Open Add Student Modal
    const openAddCandidateModal = () => {
      formAddCandidate.reset();
      candidatePhotoData.value = '';
      photoPreviewImg.src = '';
      photoPreviewImg.classList.add('hidden');
      photoPreviewEmoji.classList.remove('hidden');
      btnRemovePhoto.classList.add('hidden');

      // Auto-suggest next roll number
      const students = window.attendanceStore.getStudents();
      const maxRoll = students.reduce((max, s) => {
        const num = parseInt(s.rollNo, 10);
        return (!isNaN(num) && num > max) ? num : max;
      }, 100);
      studentRollNo.value = String(maxRoll + 1);

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

    // Form Add Student Submit
    formAddCandidate.addEventListener('submit', (e) => {
      e.preventDefault();
      const roll = studentRollNo.value.trim();
      const name = studentName.value.trim();
      const fatherName = studentFatherName.value.trim();
      const contactNo = studentContactNo.value.trim();
      const email = studentEmail.value.trim();
      const courseName = studentCourse.value;
      const batchTime = studentBatch.value;
      const address = studentAddress.value.trim();
      const photoUrl = candidatePhotoData.value || null;

      if (!name || !fatherName || !contactNo) {
        alert('Please fill Student Name, Father Name, and Contact Number.');
        return;
      }

      const newStudent = window.attendanceStore.addStudent({
        rollNo: roll,
        name,
        fatherName,
        contactNo,
        email,
        courseName,
        batchTime,
        address,
        photoUrl
      });

      modalAddCandidate.classList.remove('open');
      playTactileClick();
      showToast(`Enrolled ${newStudent.name} (Roll: ${newStudent.rollNo})`, 'user-check');
    });

    // Close Detail Modal
    btnCloseDetailModal.addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
    });
    modalCandidateDetail.addEventListener('click', (e) => {
      if (e.target === modalCandidateDetail) modalCandidateDetail.classList.remove('open');
    });

    // Close ID Badge Modal
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
      const name = settingOrgName.value || 'Apex Coaching Institute';
      const branch = settingOrgBranch.value || 'Main Campus';

      window.attendanceStore.updateSettings({
        orgName: name,
        orgBranch: branch
      });

      showToast('Institute Details updated!', 'check');
    });

    // Add Course Modal
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
        window.attendanceStore.addCourse(val);
        modalAddDept.classList.remove('open');
        showToast(`Course "${val}" added!`, 'plus');
      }
    });

    // Backup & Restore
    btnExportBackup.addEventListener('click', () => {
      const json = window.attendanceStore.exportFullDataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Coaching_Attendance_Backup_${getTodayDateStr()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Full backup JSON downloaded', 'file-down');
    });

    inputImportBackup.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = window.attendanceStore.importFullDataJSON(event.target.result);
        if (res.success) {
          showToast('Coaching records restored successfully!', 'check-circle');
        } else {
          showToast('Failed to import backup: ' + res.error, 'alert-triangle');
        }
      };
      reader.readAsText(file);
    });

    // Reset Data
    const handleReset = () => {
      localStorage.clear();
      window.location.reload();
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
  // CSV Export with Strict Coaching Fields
  // ----------------------------------------------------
  function exportAttendanceCSV(dateStr) {
    const students = window.attendanceStore.getStudents();
    const attendanceMap = window.attendanceStore.getAttendanceForDate(dateStr);

    let csv = 'Roll No,Student Name,Father Name,Contact No,Address,Batch Time,Course Name,Date,Status\n';
    students.forEach(s => {
      const status = (attendanceMap[s.rollNo] || 'unmarked').toUpperCase();
      csv += `"${s.rollNo}","${s.name}","${s.fatherName}","${s.contactNo}","${s.address}","${s.batchTime}","${s.courseName}","${dateStr}","${status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Coaching_Attendance_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported attendance for ${dateStr}`, 'file-check');
  }

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

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
