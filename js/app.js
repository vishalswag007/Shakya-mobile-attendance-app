/**
 * Apex Coaching Institute - Professional Mobile-First Web Application Controller
 * Features: Real-Time OTP Email Password Recovery, Clean SaaS Toolbar, Candidate DOB,
 * Admin Security Gate, Student Edit, Batch Timings Manager, Holiday Calendar, Inbuilt Cloud Sync, WhatsApp Sharing.
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

  // Admin Login Overlay DOM
  const adminLoginOverlay = document.getElementById('admin-login-overlay');
  const formAdminLogin = document.getElementById('form-admin-login');
  const inputAdminPassword = document.getElementById('input-admin-password');
  const btnToggleLoginPass = document.getElementById('btn-toggle-login-pass');
  const loginBrandEmoji = document.getElementById('login-brand-emoji');
  const loginBrandImg = document.getElementById('login-brand-img');
  const loginOrgTitle = document.getElementById('login-org-title');
  const btnHeaderLock = document.getElementById('btn-header-lock');
  const btnOpenForgotPass = document.getElementById('btn-open-forgot-pass');

  // Forgot Password & OTP Recovery DOM
  const modalForgotPassword = document.getElementById('modal-forgot-password');
  const btnCloseForgotModal = document.getElementById('btn-close-forgot-modal');
  const recoveryStep1 = document.getElementById('recovery-step-1');
  const recoveryStep2 = document.getElementById('recovery-step-2');
  const recoveryStep3 = document.getElementById('recovery-step-3');
  const displayMaskedRecoveryEmail = document.getElementById('display-masked-recovery-email');
  const btnSendRecoveryOtp = document.getElementById('btn-send-recovery-otp');
  const liveGeneratedOtpDisplay = document.getElementById('live-generated-otp-display');
  const btnAutofillOtp = document.getElementById('btn-autofill-otp');
  const formVerifyOtp = document.getElementById('form-verify-otp');
  const inputRecoveryOtp = document.getElementById('input-recovery-otp');
  const btnResendOtp = document.getElementById('btn-resend-otp');
  const otpTimerBadge = document.getElementById('otp-timer-badge');
  const formResetNewPassword = document.getElementById('form-reset-new-password');
  const inputResetNewPass = document.getElementById('input-reset-new-pass');
  const inputResetConfirmPass = document.getElementById('input-reset-confirm-pass');
  let otpTimerInterval = null;
  let currentActiveOtp = '';

  // Change Password Form & Recovery Email in Settings DOM
  const formChangePassword = document.getElementById('form-change-password');
  const inputCurrentPass = document.getElementById('input-current-pass');
  const inputNewPass = document.getElementById('input-new-pass');
  const inputConfirmPass = document.getElementById('input-confirm-pass');
  const btnSettingsLock = document.getElementById('btn-settings-lock');
  const inputSettingsRecoveryEmail = document.getElementById('input-settings-recovery-email');
  const btnSaveRecoveryEmail = document.getElementById('btn-save-recovery-email');

  // Header Brand & Logo DOM
  const headerBrandEmoji = document.getElementById('header-brand-emoji');
  const headerBrandImg = document.getElementById('header-brand-img');
  const headerOrgTitle = document.getElementById('header-org-title');
  const headerOrgSubtitle = document.getElementById('header-org-subtitle');

  // WhatsApp Share Buttons
  const btnShareWhatsappToday = document.getElementById('btn-share-whatsapp-today');
  const btnShareWhatsappReport = document.getElementById('btn-share-whatsapp-report');

  // Logo Upload DOM
  const inputOrgLogoFile = document.getElementById('input-org-logo-file');
  const settingsLogoImg = document.getElementById('settings-logo-img');
  const settingsLogoEmoji = document.getElementById('settings-logo-emoji');
  const btnRemoveOrgLogo = document.getElementById('btn-remove-org-logo');

  // Month Display & Holiday Banner
  const currentMonthDisplay = document.getElementById('current-month-display');
  const holidayAlertBanner = document.getElementById('holiday-alert-banner');
  const holidayBannerTitle = document.getElementById('holiday-banner-title');
  const holidayBannerDesc = document.getElementById('holiday-banner-desc');

  // Attendance Tab DOM
  const dateInput = document.getElementById('attendance-date-input');
  const datePrevBtn = document.getElementById('date-prev');
  const dateNextBtn = document.getElementById('date-next');
  const dateBadgeToday = document.getElementById('date-badge-today');
  const attendanceList = document.getElementById('attendance-list');
  const attendanceSearch = document.getElementById('attendance-search');
  const btnMarkAllPresent = document.getElementById('btn-mark-all-present');
  
  // Clean Professional Dropdowns & Quick Strip
  const filterBatchSelect = document.getElementById('filter-batch-select');
  const filterCourseSelect = document.getElementById('filter-course-select');
  const quickFilterStrip = document.getElementById('quick-filter-strip');

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
  const historySummaryRate = document.getElementById('history-summary-rate');
  const historyRecordsList = document.getElementById('history-records-list');

  // Student Registration & Edit Form DOM
  const modalAddCandidate = document.getElementById('modal-add-candidate');
  const modalStudentFormTitle = document.getElementById('modal-student-form-title');
  const formAddCandidate = document.getElementById('form-add-candidate');
  const editOriginalRollNo = document.getElementById('edit-original-roll-no');
  const btnOpenAddCandidate = document.getElementById('btn-open-add-candidate');
  const btnCloseCandidateModal = document.getElementById('btn-close-candidate-modal');
  const btnSaveStudentSubmit = document.getElementById('btn-save-student-submit');
  const candidatePhotoFile = document.getElementById('candidate-photo-file');
  const photoPreviewImg = document.getElementById('photo-preview-img');
  const photoPreviewEmoji = document.getElementById('photo-preview-emoji');
  const btnRemovePhoto = document.getElementById('btn-remove-photo');
  const candidatePhotoData = document.getElementById('candidate-photo-data');
  const studentRollNo = document.getElementById('student-roll-no');
  const studentName = document.getElementById('student-name');
  const studentFatherName = document.getElementById('student-father-name');
  const studentDob = document.getElementById('student-dob');
  const studentContactNo = document.getElementById('student-contact-no');
  const studentEmail = document.getElementById('student-email');
  const studentCourse = document.getElementById('student-course');
  const studentBatch = document.getElementById('student-batch');
  const studentAddress = document.getElementById('student-address');

  // Batch Management DOM
  const settingsBatchesList = document.getElementById('settings-batches-list');
  const btnOpenAddBatch = document.getElementById('btn-open-add-batch');
  const modalManageBatch = document.getElementById('modal-manage-batch');
  const btnCloseBatchModal = document.getElementById('btn-close-batch-modal');
  const formManageBatch = document.getElementById('form-manage-batch');
  const modalBatchTitle = document.getElementById('modal-batch-title');
  const inputBatchOldVal = document.getElementById('input-batch-old-val');
  const inputBatchStart = document.getElementById('input-batch-start');
  const inputBatchEnd = document.getElementById('input-batch-end');
  const inputBatchLabel = document.getElementById('input-batch-label');

  // Inbuilt Cloud DOM
  const displayCloudKey = document.getElementById('display-cloud-key');
  const btnCopyCloudKey = document.getElementById('btn-copy-cloud-key');
  const inputCustomCloudKey = document.getElementById('input-custom-cloud-key');
  const btnConnectCloudKey = document.getElementById('btn-connect-cloud-key');

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

  // Holiday Calendar DOM
  const toggleSundayHoliday = document.getElementById('toggle-sunday-holiday');
  const formAddHoliday = document.getElementById('form-add-holiday');
  const inputHolidayDate = document.getElementById('input-holiday-date');
  const inputHolidayName = document.getElementById('input-holiday-name');
  const settingsHolidaysList = document.getElementById('settings-holidays-list');

  // Settings DOM
  const settingOrgName = document.getElementById('setting-org-name');
  const settingOrgBranch = document.getElementById('setting-org-branch');
  const btnSaveBranding = document.getElementById('btn-save-branding');
  const btnExportBackup = document.getElementById('btn-export-backup');
  const inputImportBackup = document.getElementById('input-import-backup');

  // Export Buttons
  const btnExportExcel = document.getElementById('btn-export-excel');

  // ----------------------------------------------------
  // Initialization & Admin Gate
  // ----------------------------------------------------
  checkAdminAuth();
  initDatePickers();
  applySettingsToUI();
  bindNavigation();
  bindEvents();
  renderAll();

  // Subscribe to store updates
  window.attendanceStore.subscribe(() => {
    applySettingsToUI();
    renderAll();
  });

  function checkAdminAuth() {
    if (window.attendanceStore.isAdminLoggedIn()) {
      adminLoginOverlay.classList.add('hidden');
    } else {
      adminLoginOverlay.classList.remove('hidden');
    }
  }

  // ----------------------------------------------------
  // Date Helpers (Real-Time Indian Standard Time IST)
  // ----------------------------------------------------
  function getTodayDateStr() {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatter.format(new Date());
    } catch {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }

  function parseDateParts(dateStr) {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function formatDateParts(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDateHuman(dateStr) {
    if (!dateStr) return '';
    try {
      const dateObj = parseDateParts(dateStr);
      return dateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  function updateMonthDisplay() {
    const dateObj = parseDateParts(currentDate);
    const monthName = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (currentMonthDisplay) {
      currentMonthDisplay.textContent = monthName;
    }

    // Check Holiday Banner
    const holInfo = window.attendanceStore.getHolidayInfo(currentDate);
    if (holInfo.isHoliday) {
      holidayAlertBanner.classList.remove('hidden');
      holidayBannerTitle.textContent = holInfo.name;
      holidayBannerDesc.textContent = holInfo.type === 'sunday' ? 'Weekly Sunday Off • No classes scheduled' : 'Institute Holiday • Attendance relaxed';
    } else {
      holidayAlertBanner.classList.add('hidden');
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
      dateBadgeToday.className = 'text-[9px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full font-black';
    } else {
      const d = parseDateParts(currentDate);
      const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      dateBadgeToday.textContent = formatted.toUpperCase();
      dateBadgeToday.className = 'text-[9px] bg-white text-indigo-950 px-2 py-0.5 rounded-full font-black';
    }
    updateMonthDisplay();
  }

  function changeDate(delta) {
    const d = parseDateParts(currentDate);
    d.setDate(d.getDate() + delta);
    currentDate = formatDateParts(d);
    dateInput.value = currentDate;
    updateDateBadge();
    renderAttendanceList();
    renderStats();
  }

  // ----------------------------------------------------
  // Navigation
  // ----------------------------------------------------
  function switchTab(targetTab) {
    document.querySelectorAll('.bottom-tab-btn-3d, .nav-link-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.tab-content-panel').forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(targetTab);
    if (activePane) {
      activePane.classList.add('active');
    }

    if (targetTab === 'tab-student-history') {
      renderStudentHistoryDropdown();
      renderIndividualStudentHistory();
    }

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function bindNavigation() {
    document.querySelectorAll('.bottom-tab-btn-3d, .nav-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });
  }

  // ----------------------------------------------------
  // Settings & Theme
  // ----------------------------------------------------
  function applySettingsToUI() {
    const settings = window.attendanceStore.getSettings();

    // Branding Logo
    if (settings.orgLogoUrl) {
      headerBrandImg.src = settings.orgLogoUrl;
      headerBrandImg.classList.remove('hidden');
      headerBrandEmoji.classList.add('hidden');

      loginBrandImg.src = settings.orgLogoUrl;
      loginBrandImg.classList.remove('hidden');
      loginBrandEmoji.classList.add('hidden');

      settingsLogoImg.src = settings.orgLogoUrl;
      settingsLogoImg.classList.remove('hidden');
      settingsLogoEmoji.classList.add('hidden');
      btnRemoveOrgLogo.classList.remove('hidden');
    } else {
      headerBrandImg.classList.add('hidden');
      headerBrandEmoji.classList.remove('hidden');
      headerBrandEmoji.textContent = settings.orgLogo || '🎓';

      loginBrandImg.classList.add('hidden');
      loginBrandEmoji.classList.remove('hidden');
      loginBrandEmoji.textContent = settings.orgLogo || '🎓';

      settingsLogoImg.classList.add('hidden');
      settingsLogoEmoji.classList.remove('hidden');
      settingsLogoEmoji.textContent = settings.orgLogo || '🎓';
      btnRemoveOrgLogo.classList.add('hidden');
    }

    headerOrgTitle.textContent = settings.orgName || 'Apex Coaching';
    loginOrgTitle.textContent = settings.orgName || 'Apex Coaching';
    headerOrgSubtitle.textContent = (settings.orgBranch || 'Attendance & Holiday Portal');

    settingOrgName.value = settings.orgName || '';
    settingOrgBranch.value = settings.orgBranch || '';
    toggleSundayHoliday.checked = !!settings.autoSundaysHoliday;
    if (displayCloudKey) {
      displayCloudKey.textContent = settings.inbuiltCloudKey || 'APEX-COACHING-2026';
    }

    if (inputSettingsRecoveryEmail) {
      inputSettingsRecoveryEmail.value = settings.adminRecoveryEmail || 'director@apexcoaching.com';
    }

    if (displayMaskedRecoveryEmail) {
      displayMaskedRecoveryEmail.textContent = window.attendanceStore.maskEmail(settings.adminRecoveryEmail || 'director@apexcoaching.com');
    }

    renderCourseAndBatchUI(settings.courses || [], settings.batchTimings || []);
    renderBatchesList();
    renderHolidaysList();
  }

  function renderCourseAndBatchUI(courses, batchTimings) {
    // 1. Sleek Dropdowns
    filterBatchSelect.innerHTML = `
      <option value="all" ${currentBatchFilter === 'all' ? 'selected' : ''}>⏰ All Batches (${batchTimings.length})</option>
      ${batchTimings.map(b => `
        <option value="${escapeHtml(b)}" ${currentBatchFilter === b ? 'selected' : ''}>⏰ ${escapeHtml(b)}</option>
      `).join('')}
    `;

    filterCourseSelect.innerHTML = `
      <option value="all" ${currentCourseFilter === 'all' ? 'selected' : ''}>📚 All Courses (${courses.length})</option>
      ${courses.map(c => `
        <option value="${escapeHtml(c)}" ${currentCourseFilter === c ? 'selected' : ''}>📚 ${escapeHtml(c)}</option>
      `).join('')}
    `;

    // 2. Clean Quick Filter Strip
    const isFiltered = currentBatchFilter !== 'all' || currentCourseFilter !== 'all' || searchQuery;
    quickFilterStrip.innerHTML = `
      <button class="filter-pill-3d ${!isFiltered ? 'active' : ''}" id="quick-reset-pill">
        All (${window.attendanceStore.getStudents().length})
      </button>
      ${batchTimings.slice(0, 3).map(b => {
        const shortName = b.split('(')[1] ? b.split('(')[1].replace(')', '') : (b ? b.substring(0, 12) : '');
        return `
          <button class="filter-pill-3d ${currentBatchFilter === b ? 'active' : ''}" data-type="batch" data-val="${escapeHtml(b)}">
            ${escapeHtml(shortName)}
          </button>
        `;
      }).join('')}
      ${courses.slice(0, 2).map(c => `
        <button class="filter-pill-3d ${currentCourseFilter === c ? 'active' : ''}" data-type="course" data-val="${escapeHtml(c)}">
          ${escapeHtml(c)}
        </button>
      `).join('')}
      ${isFiltered ? `
        <button class="filter-pill-3d text-rose-600 bg-rose-50 border-rose-200" id="btn-clear-all-filters">
          ✕ Clear Filters
        </button>
      ` : ''}
    `;

    // Quick Pill Clicks
    const resetPill = document.getElementById('quick-reset-pill');
    if (resetPill) {
      resetPill.addEventListener('click', () => {
        currentBatchFilter = 'all';
        currentCourseFilter = 'all';
        searchQuery = '';
        attendanceSearch.value = '';
        filterBatchSelect.value = 'all';
        filterCourseSelect.value = 'all';
        renderCourseAndBatchUI(courses, batchTimings);
        renderAttendanceList();
        renderStats();
      });
    }

    const clearBtn = document.getElementById('btn-clear-all-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        currentBatchFilter = 'all';
        currentCourseFilter = 'all';
        searchQuery = '';
        attendanceSearch.value = '';
        filterBatchSelect.value = 'all';
        filterCourseSelect.value = 'all';
        renderCourseAndBatchUI(courses, batchTimings);
        renderAttendanceList();
        renderStats();
      });
    }

    quickFilterStrip.querySelectorAll('.filter-pill-3d[data-type]').forEach(pill => {
      pill.addEventListener('click', () => {
        const type = pill.getAttribute('data-type');
        const val = pill.getAttribute('data-val');
        if (type === 'batch') {
          currentBatchFilter = (currentBatchFilter === val) ? 'all' : val;
          filterBatchSelect.value = currentBatchFilter;
        } else if (type === 'course') {
          currentCourseFilter = (currentCourseFilter === val) ? 'all' : val;
          filterCourseSelect.value = currentCourseFilter;
        }
        renderCourseAndBatchUI(courses, batchTimings);
        renderAttendanceList();
        renderStats();
      });
    });

    // 3. Dropdowns in Student Modals
    studentCourse.innerHTML = courses.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    studentBatch.innerHTML = batchTimings.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');

    // 4. Settings Course Tags
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

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Batch Timings Manager Renderer
  // ----------------------------------------------------
  function renderBatchesList() {
    const batches = window.attendanceStore.getBatchTimings();
    if (!settingsBatchesList) return;

    if (batches.length === 0) {
      settingsBatchesList.innerHTML = `<p class="text-xs text-slate-400 text-center py-2">No batch timings configured.</p>`;
      return;
    }

    settingsBatchesList.innerHTML = batches.map(b => `
      <div class="batch-item-card">
        <div>
          <p class="text-xs font-extrabold text-slate-900">${escapeHtml(b)}</p>
          <span class="text-[10px] text-indigo-600 font-bold">Active Batch</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="btn-edit-batch p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition" data-batch="${escapeHtml(b)}" title="Edit Batch Timing">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          </button>
          <button class="btn-delete-batch p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition" data-batch="${escapeHtml(b)}" title="Delete Batch">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('');

    settingsBatchesList.querySelectorAll('.btn-edit-batch').forEach(btn => {
      btn.addEventListener('click', () => {
        const batchStr = btn.getAttribute('data-batch');
        openEditBatchModal(batchStr);
      });
    });

    settingsBatchesList.querySelectorAll('.btn-delete-batch').forEach(btn => {
      btn.addEventListener('click', () => {
        const batchStr = btn.getAttribute('data-batch');
        if (confirm(`Delete batch "${batchStr}"?`)) {
          window.attendanceStore.removeBatchTiming(batchStr);
          showToast('Batch timing removed', 'trash-2');
        }
      });
    });

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function openEditBatchModal(existingBatchStr = null) {
    if (existingBatchStr) {
      modalBatchTitle.textContent = 'Edit Batch Timing';
      inputBatchOldVal.value = existingBatchStr;

      const parts = existingBatchStr.split('(');
      const timePart = parts[0] ? parts[0].trim() : '';
      const labelPart = parts[1] ? parts[1].replace(')', '').trim() : '';
      const times = timePart.split('-');

      inputBatchStart.value = times[0] ? times[0].trim() : '08:00 AM';
      inputBatchEnd.value = times[1] ? times[1].trim() : '10:00 AM';
      inputBatchLabel.value = labelPart || 'Morning Batch';
    } else {
      modalBatchTitle.textContent = 'Add New Batch Timing';
      inputBatchOldVal.value = '';
      formManageBatch.reset();
      inputBatchStart.value = '08:00 AM';
      inputBatchEnd.value = '10:00 AM';
      inputBatchLabel.value = 'Morning Batch';
    }

    modalManageBatch.classList.add('open');
  }

  // ----------------------------------------------------
  // Holiday Calendar Renderer
  // ----------------------------------------------------
  function renderHolidaysList() {
    const holidays = window.attendanceStore.getHolidays();
    if (!settingsHolidaysList) return;

    if (holidays.length === 0) {
      settingsHolidaysList.innerHTML = `<p class="text-xs text-slate-400 text-center py-2">No special holidays scheduled yet.</p>`;
      return;
    }

    settingsHolidaysList.innerHTML = holidays.map(h => `
      <div class="flex items-center justify-between p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-sm">🎉</span>
          <div>
            <p class="font-extrabold text-slate-900">${escapeHtml(h.name)}</p>
            <p class="text-[10px] text-purple-700 font-mono font-bold">${h.date}</p>
          </div>
        </div>
        <button class="btn-delete-holiday p-1.5 text-slate-400 hover:text-rose-600 transition" data-id="${h.id}" title="Delete Holiday">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');

    settingsHolidaysList.querySelectorAll('.btn-delete-holiday').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.attendanceStore.removeHoliday(id);
        showToast('Holiday removed from calendar', 'calendar-x');
      });
    });

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Avatar Renderer
  // ----------------------------------------------------
  function renderAvatar(student) {
    if (student.photoUrl) {
      return `<img src="${escapeHtml(student.photoUrl)}" alt="${escapeHtml(student.name)}" class="w-full h-full object-cover rounded-inherit">`;
    }
    return `<span>${student.avatar || '👨‍🎓'}</span>`;
  }

  // ----------------------------------------------------
  // Candidate (Student) Edit Modal
  // ----------------------------------------------------
  function openEditCandidateModal(rollNo) {
    const student = window.attendanceStore.getStudentByRollNo(rollNo);
    if (!student) return;

    modalStudentFormTitle.textContent = `Edit Student: ${student.name} (Roll ${student.rollNo})`;
    btnSaveStudentSubmit.textContent = `Update Student Details`;
    editOriginalRollNo.value = student.rollNo;

    studentRollNo.value = student.rollNo;
    studentName.value = student.name;
    studentFatherName.value = student.fatherName || '';
    studentDob.value = student.dob || '';
    studentContactNo.value = student.contactNo || '';
    studentEmail.value = student.email || '';
    studentCourse.value = student.courseName || '';
    studentBatch.value = student.batchTime || '';
    studentAddress.value = student.address || '';

    if (student.photoUrl) {
      photoPreviewImg.src = student.photoUrl;
      photoPreviewImg.classList.remove('hidden');
      photoPreviewEmoji.classList.add('hidden');
      btnRemovePhoto.classList.remove('hidden');
      candidatePhotoData.value = student.photoUrl;
    } else {
      photoPreviewImg.src = '';
      photoPreviewImg.classList.add('hidden');
      photoPreviewEmoji.classList.remove('hidden');
      btnRemovePhoto.classList.add('hidden');
      candidatePhotoData.value = '';
    }

    modalAddCandidate.classList.add('open');
  }

  // ----------------------------------------------------
  // Rendering Logic
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
    renderBatchesList();
    renderHolidaysList();
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function renderStats() {
    const filtered = getFilteredStudents();
    const stats = window.attendanceStore.getStatsForDate(currentDate, filtered);
    statTotal.textContent = stats.total;
    statPresent.textContent = stats.present;
    statAbsent.textContent = stats.absent;
    statLeave.textContent = stats.leave;
  }

  function renderAttendanceList() {
    const filtered = getFilteredStudents();
    const attendanceMap = window.attendanceStore.getAttendanceForDate(currentDate);

    if (filtered.length === 0) {
      attendanceList.innerHTML = `
        <div class="text-center py-10 px-4 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2 text-indigo-600">
            <i data-lucide="users" class="w-5 h-5"></i>
          </div>
          <h3 class="text-xs font-bold text-slate-800">No students match current filters</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Reset filters or add new student.</p>
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
        <div class="student-card-3d ${statusCardClass}" data-roll="${student.rollNo}">
          <div>
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3 cursor-pointer student-info-trigger" data-roll="${student.rollNo}">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl overflow-hidden shrink-0 shadow-sm">
                  ${renderAvatar(student)}
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-mono font-black border border-indigo-200">Roll ${student.rollNo}</span>
                    <h4 class="font-black text-sm text-slate-900 leading-tight">${escapeHtml(student.name)}</h4>
                  </div>
                  
                  <!-- Father's Name Badge -->
                  <div class="mt-1">
                    <span class="father-name-badge-3d">
                      👨‍👦 S/o ${escapeHtml(student.fatherName)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                ${renderStatusBadge(status)}
              </div>
            </div>

            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">${escapeHtml(student.batchTime.split('(')[0])}</span>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">${escapeHtml(student.courseName)}</span>
              ${student.dob ? `<span class="text-[10px] text-slate-500 font-semibold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">🎂 ${escapeHtml(student.dob)}</span>` : ''}
            </div>
          </div>

          <!-- Attendance Buttons -->
          <div class="attendance-3d-btn-group pt-1 border-t border-slate-100">
            <button class="btn-3d-status btn-present ${isPresent ? 'active' : ''}" data-status="present" data-roll="${student.rollNo}">
              <i data-lucide="check" class="w-4 h-4"></i> Present
            </button>
            <button class="btn-3d-status btn-absent ${isAbsent ? 'active' : ''}" data-status="absent" data-roll="${student.rollNo}">
              <i data-lucide="x" class="w-4 h-4"></i> Absent
            </button>
            <button class="btn-3d-status btn-leave ${isLeave ? 'active' : ''}" data-status="leave" data-roll="${student.rollNo}">
              <i data-lucide="clock" class="w-4 h-4"></i> Leave
            </button>
          </div>
        </div>
      `;
    }).join('');

    attendanceList.querySelectorAll('.btn-3d-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
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
      return `<span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">PRESENT</span>`;
    }
    if (status === 'absent') {
      return `<span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">ABSENT</span>`;
    }
    if (status === 'leave') {
      return `<span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">LEAVE</span>`;
    }
    return `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">UNMARKED</span>`;
  }

  function renderCandidatesDirectory() {
    const students = window.attendanceStore.getStudents() || [];
    candidateCountBadge.textContent = students.length;

    const filtered = students.filter(s => {
      if (!candidateSearchQuery) return true;
      const q = candidateSearchQuery.trim().toLowerCase();
      return (s.name && s.name.toLowerCase().includes(q)) ||
             (s.rollNo && String(s.rollNo).toLowerCase().includes(q)) ||
             (s.fatherName && s.fatherName.toLowerCase().includes(q)) ||
             (s.courseName && s.courseName.toLowerCase().includes(q)) ||
             (s.batchTime && s.batchTime.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      candidatesDirectoryList.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400 text-sm bg-white border border-slate-200 rounded-2xl shadow-sm">
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
        <div class="student-card-3d flex flex-col justify-between gap-3">
          <div class="flex items-start gap-3.5 cursor-pointer student-row" data-roll="${s.rollNo}">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl overflow-hidden shrink-0 shadow-sm">
              ${renderAvatar(s)}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-black">Roll ${s.rollNo}</span>
                <h4 class="font-black text-sm text-slate-900">${escapeHtml(s.name)}</h4>
              </div>
              <div class="mt-1">
                <span class="father-name-badge-3d">
                  👨‍👦 S/o ${escapeHtml(s.fatherName)}
                </span>
              </div>
              <div class="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-medium flex-wrap">
                <span>📞 ${escapeHtml(s.contactNo || 'No phone')}</span>
                ${s.dob ? `<span>•</span><span>🎂 ${escapeHtml(s.dob)}</span>` : ''}
                <span>•</span>
                <span class="text-emerald-700 font-black">${rate}% Rate</span>
              </div>
            </div>
          </div>

          <!-- Actions: Edit, View Log, Delete -->
          <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button class="btn-edit-candidate py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition" data-roll="${s.rollNo}" title="Edit Student Details">
              <i data-lucide="edit" class="w-3.5 h-3.5 text-indigo-600"></i> Edit
            </button>
            <button class="btn-view-student-log flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition" data-roll="${s.rollNo}">
              <i data-lucide="calendar-search" class="w-3.5 h-3.5"></i> History
            </button>
            <button class="btn-delete-candidate p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition" data-roll="${s.rollNo}" title="Delete Student">
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

    candidatesDirectoryList.querySelectorAll('.btn-edit-candidate').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const roll = el.getAttribute('data-roll');
        openEditCandidateModal(roll);
      });
    });

    candidatesDirectoryList.querySelectorAll('.btn-view-student-log').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const roll = el.getAttribute('data-roll');
        selectedStudentRollNo = roll;
        switchTab('tab-student-history');
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
    const students = window.attendanceStore.getStudents() || [];
    if (students.length === 0) {
      historyStudentSelect.innerHTML = `<option value="">No students registered</option>`;
      return;
    }

    if (!selectedStudentRollNo || !students.some(s => String(s.rollNo) === String(selectedStudentRollNo))) {
      selectedStudentRollNo = students[0].rollNo;
    }

    historyStudentSelect.innerHTML = students.map(s => `
      <option value="${s.rollNo}" ${String(s.rollNo) === String(selectedStudentRollNo) ? 'selected' : ''}>
        Roll ${s.rollNo}: ${s.name} (S/o ${s.fatherName})
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

    const rawPhone = (student.contactNo || '').replace(/[^0-9]/g, '');

    // Profile Card with DOB & Edit Option
    historyStudentCard.innerHTML = `
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-3.5">
          <div class="w-16 h-16 rounded-2xl bg-white border-2 border-indigo-200 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-3xl">
            ${renderAvatar(student)}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-mono font-black">Roll ${student.rollNo}</span>
              <h3 class="text-base font-black text-slate-900">${escapeHtml(student.name)}</h3>
            </div>
            <div class="mt-1">
              <span class="father-name-badge-3d">
                👨‍👦 Father: ${escapeHtml(student.fatherName)}
              </span>
            </div>
            <p class="text-xs text-indigo-700 font-bold mt-1">${escapeHtml(student.courseName || '')}</p>
          </div>
        </div>

        <button class="btn-card-edit-student p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition" title="Edit Student Details">
          <i data-lucide="edit" class="w-4 h-4 text-indigo-600"></i>
        </button>
      </div>

      <div class="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
        <div><span class="font-bold text-slate-500">Date of Birth:</span> ${student.dob ? formatDateHuman(student.dob) : 'Not specified'}</div>
        <div><span class="font-bold text-slate-500">Batch:</span> ${escapeHtml(student.batchTime || '')}</div>
        <div><span class="font-bold text-slate-500">Phone:</span> ${escapeHtml(student.contactNo || 'N/A')}</div>
        <div><span class="font-bold text-slate-500">Address:</span> ${escapeHtml(student.address || 'N/A')}</div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-2">
        <a href="tel:${student.contactNo || ''}" class="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition">
          <i data-lucide="phone-call" class="w-3.5 h-3.5 text-emerald-600"></i> Call Parent
        </a>
        <a href="https://wa.me/${rawPhone}?text=Hello%2C%20Attendance%20Report%20for%20${encodeURIComponent(student.name)}%20(Roll%20${student.rollNo})" target="_blank" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp
        </a>
      </div>
    `;

    const editBtn = historyStudentCard.querySelector('.btn-card-edit-student');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        openEditCandidateModal(student.rollNo);
      });
    }

    // History Content
    if (historyViewMode === 'weekly') {
      const weekly = window.attendanceStore.getStudentHistoryWeekly(student.rollNo, currentDate);
      
      individualHistoryContent.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700">Week: ${weekly.weekRange}</span>
            <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">${weekly.rate}% Rate</span>
          </div>

          <div class="grid grid-cols-4 gap-2 text-center">
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-indigo-700 font-black text-base">${weekly.totalClasses}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Classes</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-emerald-600 font-black text-base">${weekly.present}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Present</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-rose-600 font-black text-base">${weekly.absent}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Absent</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-amber-600 font-black text-base">${weekly.leave}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Leave</span>
            </div>
          </div>

          <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400 pt-1">Day-by-Day Status</h4>
          <div class="space-y-1.5">
            ${weekly.logs.map(log => {
              let badge = renderStatusBadge(log.status);
              if (log.status === 'holiday') {
                badge = `<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">HOLIDAY</span>`;
              }
              return `
                <div class="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-10 font-black text-slate-800">${log.dayName}</span>
                    <span class="text-slate-500 font-mono text-[11px]">${log.date}</span>
                    ${log.holidayName ? `<span class="text-[10px] text-purple-700 font-bold truncate max-w-[120px]">(${escapeHtml(log.holidayName)})</span>` : ''}
                  </div>
                  <div>
                    ${badge}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else {
      const currentYearMonth = currentDate.substring(0, 7);
      const monthly = window.attendanceStore.getStudentHistoryMonthly(student.rollNo, currentYearMonth);

      individualHistoryContent.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-900">${monthly.monthName}</span>
            <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">${monthly.rate}% Rate</span>
          </div>

          <div class="grid grid-cols-4 gap-2 text-center">
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-indigo-700 font-black text-base">${monthly.totalClasses}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Held</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-emerald-600 font-black text-base">${monthly.present}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Present</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-rose-600 font-black text-base">${monthly.absent}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Absent</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="block text-amber-600 font-black text-base">${monthly.leave}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold">Leave</span>
            </div>
          </div>

          <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400 pt-1">Monthly Calendar Matrix</h4>
          <!-- Weekday Headers (Mon to Sun) -->
          <div class="grid grid-cols-7 gap-1.5 text-center text-[9px] font-black text-slate-400 uppercase mb-1">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span class="text-rose-500 font-extrabold">Sun</span>
          </div>
          <div class="grid grid-cols-7 gap-1.5 mb-2">
            ${Array.from({ length: monthly.startOffset || 0 }).map(() => `
              <div class="aspect-square rounded-lg border border-dashed border-slate-100 bg-slate-50/30"></div>
            `).join('')}
            ${monthly.logs.map(log => {
              let bg = 'bg-slate-50 text-slate-400 border-slate-200';
              let char = '·';
              if (log.status === 'present') { bg = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black'; char = 'P'; }
              else if (log.status === 'absent') { bg = 'bg-rose-100 text-rose-800 border-rose-300 font-black'; char = 'A'; }
              else if (log.status === 'leave') { bg = 'bg-amber-100 text-amber-800 border-amber-300 font-black'; char = 'L'; }
              else if (log.status === 'holiday') { bg = 'bg-purple-100 text-purple-800 border-purple-300 font-black'; char = 'H'; }

              return `
                <div class="aspect-square rounded-lg border flex flex-col items-center justify-center p-1 ${bg}" title="${log.date} (${log.dayName}): ${log.status.toUpperCase()} ${log.holidayName ? '(' + log.holidayName + ')' : ''}">
                  <span class="text-[10px] leading-none font-bold">${log.day}</span>
                  <span class="text-[9px] font-black">${char}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Date-wise Logs
  // ----------------------------------------------------
  function renderHistory() {
    const stats = window.attendanceStore.getStatsForDate(historyDate);
    const attendanceMap = window.attendanceStore.getAttendanceForDate(historyDate);
    const students = window.attendanceStore.getStudents() || [];

    historySummaryRate.textContent = `${stats.rate}% Rate (${stats.present} Present / ${stats.absent} Absent)`;

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
        <div class="text-center py-8 text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl">
          No records matching selected status for this date.
        </div>
      `;
      return;
    }

    historyRecordsList.innerHTML = records.map(r => `
      <div class="student-card-3d flex items-center justify-between p-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base overflow-hidden shrink-0 shadow-sm">
            ${renderAvatar(r)}
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">Roll ${r.rollNo}</span>
              <p class="text-xs font-black text-slate-900">${escapeHtml(r.name)}</p>
            </div>
            <div class="mt-0.5">
              <span class="father-name-badge-3d text-[10px] py-0.5">
                👨‍👦 S/o ${escapeHtml(r.fatherName)}
              </span>
            </div>
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
      <div class="text-center pb-3 border-b border-slate-100">
        <div class="w-18 h-18 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-3xl mx-auto mb-2 shadow-md overflow-hidden">
          ${renderAvatar(student)}
        </div>
        <h3 class="text-base font-black text-slate-900">${escapeHtml(student.name)}</h3>
        <div class="mt-1">
          <span class="father-name-badge-3d">
            👨‍👦 Father: ${escapeHtml(student.fatherName)}
          </span>
        </div>
        <span class="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono font-bold border border-slate-200">Roll No: ${student.rollNo}</span>
      </div>

      <div class="grid grid-cols-4 gap-2 text-center my-2">
        <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span class="block text-indigo-700 font-black text-sm">${rate}%</span>
          <span class="text-[9px] text-slate-400 uppercase font-bold">Rate</span>
        </div>
        <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span class="block text-emerald-600 font-black text-sm">${presentCount}</span>
          <span class="text-[9px] text-slate-400 uppercase font-bold">Present</span>
        </div>
        <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span class="block text-rose-600 font-black text-sm">${absentCount}</span>
          <span class="text-[9px] text-slate-400 uppercase font-bold">Absent</span>
        </div>
        <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span class="block text-amber-600 font-black text-sm">${leaveCount}</span>
          <span class="text-[9px] text-slate-400 uppercase font-bold">Leave</span>
        </div>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 text-xs">
        <div><span class="text-slate-500 font-bold">Date of Birth:</span> <span class="font-bold text-slate-800">${student.dob ? formatDateHuman(student.dob) : 'Not specified'}</span></div>
        <div><span class="text-slate-500 font-bold">Course:</span> <span class="font-bold text-indigo-700">${escapeHtml(student.courseName)}</span></div>
        <div><span class="text-slate-500 font-bold">Batch:</span> <span class="font-bold">${escapeHtml(student.batchTime)}</span></div>
        <div><span class="text-slate-500 font-bold">Phone:</span> ${escapeHtml(student.contactNo || 'N/A')}</div>
        <div><span class="text-slate-500 font-bold">Address:</span> ${escapeHtml(student.address || 'N/A')}</div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <button class="btn-profile-edit py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition">
          <i data-lucide="edit" class="w-3.5 h-3.5 text-indigo-600"></i> Edit
        </button>
        <button class="btn-profile-id-badge py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition">
          <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> ID Card
        </button>
        <button class="btn-profile-open-history py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition">
          <i data-lucide="calendar" class="w-3.5 h-3.5"></i> Log
        </button>
      </div>
    `;

    candidateProfileContent.querySelector('.btn-profile-edit').addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
      openEditCandidateModal(rollNo);
    });

    candidateProfileContent.querySelector('.btn-profile-id-badge').addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
      open3DIdBadgeModal(rollNo);
    });

    candidateProfileContent.querySelector('.btn-profile-open-history').addEventListener('click', () => {
      modalCandidateDetail.classList.remove('open');
      selectedStudentRollNo = rollNo;
      switchTab('tab-student-history');
    });

    modalCandidateDetail.classList.add('open');
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  // ----------------------------------------------------
  // ID Badge Modal
  // ----------------------------------------------------
  function open3DIdBadgeModal(rollNo) {
    const student = window.attendanceStore.getStudentByRollNo(rollNo);
    const settings = window.attendanceStore.getSettings();
    if (!student) return;

    const qrData = encodeURIComponent(`APEX:${student.rollNo}:${student.name}:${student.fatherName}:${student.dob || ''}`);
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrData}&color=1e1b4b`;

    const logoHtml = settings.orgLogoUrl ? 
      `<img src="${settings.orgLogoUrl}" class="w-9 h-9 rounded-lg object-cover">` : 
      `<span class="text-2xl">${settings.orgLogo || '🎓'}</span>`;

    idBadgeContainer.innerHTML = `
      <div class="id-card-3d">
        <div class="flex items-center gap-2.5 pb-2.5 border-b border-indigo-100 mb-3">
          <div class="w-9 h-9 rounded-xl bg-white border border-indigo-200 flex items-center justify-center shadow-sm shrink-0">
            ${logoHtml}
          </div>
          <div>
            <h4 class="text-xs font-black text-slate-900 uppercase">${escapeHtml(settings.orgName || 'Apex Coaching')}</h4>
            <p class="text-[9px] text-slate-500 font-bold">${escapeHtml(settings.orgBranch || 'Campus HQ')} • Student Smart ID</p>
          </div>
        </div>

        <div class="flex items-center gap-3 mb-3">
          <div class="w-16 h-16 rounded-xl bg-white border-2 border-indigo-200 overflow-hidden shadow-md shrink-0 flex items-center justify-center text-3xl">
            ${renderAvatar(student)}
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">Roll: ${student.rollNo}</span>
            <h3 class="text-sm font-black text-slate-900 truncate mt-0.5">${escapeHtml(student.name)}</h3>
            <div class="mt-0.5">
              <span class="father-name-badge-3d text-[10px]">
                👨‍👦 S/o ${escapeHtml(student.fatherName)}
              </span>
            </div>
            <p class="text-[10px] text-slate-500 font-bold mt-0.5">🎂 DOB: ${student.dob ? formatDateHuman(student.dob) : 'N/A'}</p>
            <p class="text-[11px] text-indigo-600 font-bold truncate mt-0.5">${escapeHtml(student.courseName)}</p>
          </div>
        </div>

        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2.5">
          <div>
            <span class="text-[9px] uppercase font-bold text-slate-400 block">Attendance Pass</span>
            <p class="text-[11px] text-slate-700 font-mono font-bold">${escapeHtml(student.batchTime.split('(')[0])}</p>
            <p class="text-[9px] text-emerald-600 font-black mt-0.5">✓ 2026-2027 ACTIVE</p>
          </div>
          <div class="w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center">
            <img src="${qrImgUrl}" alt="QR" class="w-full h-full object-contain">
          </div>
        </div>
      </div>
    `;

    modalIdBadge.classList.add('open');
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  // ----------------------------------------------------
  // Forgot Password & Real-Time OTP Flow
  // ----------------------------------------------------
  function startOtpCountdown(seconds = 300) {
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    let remaining = seconds;

    const updateTimerText = () => {
      const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
      const secs = String(remaining % 60).padStart(2, '0');
      otpTimerBadge.textContent = `${mins}:${secs}`;
      if (remaining <= 0) {
        clearInterval(otpTimerInterval);
        otpTimerBadge.textContent = 'EXPIRED';
        otpTimerBadge.className = 'font-mono font-bold text-rose-500';
      }
    };

    updateTimerText();
    otpTimerInterval = setInterval(() => {
      remaining--;
      updateTimerText();
    }, 1000);
  }

  function triggerSendRecoveryOtp() {
    const res = window.attendanceStore.generatePasswordResetOTP();
    currentActiveOtp = res.otp;
    liveGeneratedOtpDisplay.textContent = res.otp;

    // Transition from Step 1 to Step 2
    recoveryStep1.classList.add('hidden');
    recoveryStep2.classList.remove('hidden');
    recoveryStep3.classList.add('hidden');
    inputRecoveryOtp.value = '';

    startOtpCountdown(300);
    showToast(`OTP ${res.otp} sent to ${res.maskedEmail}`, 'mail');
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
    // Admin Login Gate Form Submit
    formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = inputAdminPassword.value;
      const res = window.attendanceStore.loginAdmin(pass);

      if (res.success) {
        adminLoginOverlay.classList.add('hidden');
        inputAdminPassword.value = '';
        showToast('Welcome back, Admin!', 'shield-check');
      } else {
        showToast(res.error || 'Incorrect Password', 'alert-triangle');
      }
    });

    // Toggle Password Visibility
    btnToggleLoginPass.addEventListener('click', () => {
      const isPass = inputAdminPassword.type === 'password';
      inputAdminPassword.type = isPass ? 'text' : 'password';
      btnToggleLoginPass.innerHTML = isPass ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' : '<i data-lucide="eye" class="w-4 h-4"></i>';
      if (window.lucide && lucide.createIcons) lucide.createIcons();
    });

    // Forgot Password Trigger
    btnOpenForgotPass.addEventListener('click', () => {
      const settings = window.attendanceStore.getSettings();
      displayMaskedRecoveryEmail.textContent = window.attendanceStore.maskEmail(settings.adminRecoveryEmail || 'director@apexcoaching.com');
      
      recoveryStep1.classList.remove('hidden');
      recoveryStep2.classList.add('hidden');
      recoveryStep3.classList.add('hidden');
      modalForgotPassword.classList.add('open');
    });

    btnCloseForgotModal.addEventListener('click', () => {
      modalForgotPassword.classList.remove('open');
      if (otpTimerInterval) clearInterval(otpTimerInterval);
    });

    modalForgotPassword.addEventListener('click', (e) => {
      if (e.target === modalForgotPassword) {
        modalForgotPassword.classList.remove('open');
        if (otpTimerInterval) clearInterval(otpTimerInterval);
      }
    });

    // Send Recovery OTP Button Click
    btnSendRecoveryOtp.addEventListener('click', () => {
      btnSendRecoveryOtp.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> Sending OTP...`;
      setTimeout(() => {
        btnSendRecoveryOtp.innerHTML = `<i data-lucide="send" class="w-3.5 h-3.5"></i> <span>Send 6-Digit OTP</span>`;
        triggerSendRecoveryOtp();
        if (window.lucide && lucide.createIcons) lucide.createIcons();
      }, 500);
    });

    // Auto-fill OTP
    btnAutofillOtp.addEventListener('click', () => {
      if (currentActiveOtp) {
        inputRecoveryOtp.value = currentActiveOtp;
        showToast('OTP auto-filled!', 'check');
      }
    });

    // Resend OTP
    btnResendOtp.addEventListener('click', () => {
      triggerSendRecoveryOtp();
    });

    // Verify OTP Form
    formVerifyOtp.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = inputRecoveryOtp.value.trim();
      const res = window.attendanceStore.verifyPasswordResetOTP(code);

      if (res.success) {
        if (otpTimerInterval) clearInterval(otpTimerInterval);
        recoveryStep2.classList.add('hidden');
        recoveryStep3.classList.remove('hidden');
        showToast('OTP Verified! Enter new password.', 'shield-check');
      } else {
        showToast(res.error || 'Invalid OTP code', 'alert-triangle');
      }
    });

    // Reset Password Form
    formResetNewPassword.addEventListener('submit', (e) => {
      e.preventDefault();
      const newP = inputResetNewPass.value.trim();
      const confP = inputResetConfirmPass.value.trim();
      const code = inputRecoveryOtp.value.trim();

      if (newP !== confP) {
        showToast('New passwords do not match!', 'alert-triangle');
        return;
      }

      const res = window.attendanceStore.resetAdminPasswordWithOTP(code, newP);
      if (res.success) {
        modalForgotPassword.classList.remove('open');
        adminLoginOverlay.classList.add('hidden');
        formResetNewPassword.reset();
        showToast('Password reset successful! Logged in as Admin.', 'check-circle');
      } else {
        showToast(res.error || 'Failed to reset password', 'alert-triangle');
      }
    });

    // Save Recovery Email in Settings
    btnSaveRecoveryEmail.addEventListener('click', () => {
      const email = inputSettingsRecoveryEmail.value.trim();
      if (!email || !email.includes('@')) {
        showToast('Please enter a valid recovery email address', 'alert-circle');
        return;
      }

      window.attendanceStore.updateSettings({ adminRecoveryEmail: email });
      showToast('Admin Recovery Email saved!', 'mail-check');
    });

    // Admin Logout / Lock Portal
    const lockPortal = () => {
      window.attendanceStore.logoutAdmin();
      adminLoginOverlay.classList.remove('hidden');
      showToast('Portal locked safely', 'lock');
    };

    btnHeaderLock.addEventListener('click', lockPortal);
    btnSettingsLock.addEventListener('click', lockPortal);

    // Change Password Form in Settings
    formChangePassword.addEventListener('submit', (e) => {
      e.preventDefault();
      const curr = inputCurrentPass.value;
      const newP = inputNewPass.value;
      const conf = inputConfirmPass.value;

      if (newP !== conf) {
        showToast('New passwords do not match!', 'alert-triangle');
        return;
      }

      const res = window.attendanceStore.changeAdminPassword(curr, newP);
      if (res.success) {
        formChangePassword.reset();
        showToast('Admin password updated successfully!', 'check-circle');
      } else {
        showToast(res.error || 'Failed to update password', 'alert-triangle');
      }
    });

    // WhatsApp Sharing
    const shareWhatsApp = (dateStr) => {
      const text = window.attendanceStore.generateWhatsAppReport(dateStr);
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    };

    btnShareWhatsappToday.addEventListener('click', () => shareWhatsApp(currentDate));
    btnShareWhatsappReport.addEventListener('click', () => shareWhatsApp(historyDate));

    // Batch Timings Management Modal
    btnOpenAddBatch.addEventListener('click', () => {
      openEditBatchModal(null);
    });

    btnCloseBatchModal.addEventListener('click', () => {
      modalManageBatch.classList.remove('open');
    });

    modalManageBatch.addEventListener('click', (e) => {
      if (e.target === modalManageBatch) modalManageBatch.classList.remove('open');
    });

    formManageBatch.addEventListener('submit', (e) => {
      e.preventDefault();
      const startVal = inputBatchStart.value.trim();
      const endVal = inputBatchEnd.value.trim();
      const labelVal = inputBatchLabel.value.trim();
      const oldVal = inputBatchOldVal.value;

      if (!startVal || !endVal || !labelVal) return;

      const formattedBatchStr = `${startVal} - ${endVal} (${labelVal})`;

      if (oldVal) {
        window.attendanceStore.editBatchTiming(oldVal, formattedBatchStr);
        showToast(`Batch updated to "${formattedBatchStr}"`, 'check');
      } else {
        window.attendanceStore.addBatchTiming(formattedBatchStr);
        showToast(`New batch "${formattedBatchStr}" added!`, 'plus');
      }

      modalManageBatch.classList.remove('open');
    });

    // Inbuilt Cloud Buttons (with null safety)
    if (btnCopyCloudKey && displayCloudKey) {
      btnCopyCloudKey.addEventListener('click', () => {
        const key = displayCloudKey.textContent;
        navigator.clipboard.writeText(key).then(() => {
          showToast('Cloud Key copied to clipboard!', 'copy');
        });
      });
    }

    if (btnConnectCloudKey && inputCustomCloudKey) {
      btnConnectCloudKey.addEventListener('click', () => {
        const customKey = inputCustomCloudKey.value.trim();
        if (customKey) {
          window.attendanceStore.updateSettings({ inbuiltCloudKey: customKey });
          if (displayCloudKey) displayCloudKey.textContent = customKey;
          inputCustomCloudKey.value = '';
          showToast(`Connected to Cloud Key: ${customKey}`, 'cloud');
        }
      });
    }

    // Holiday Form Submit
    formAddHoliday.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = inputHolidayDate.value;
      const nameVal = inputHolidayName.value.trim();

      if (dateVal && nameVal) {
        window.attendanceStore.addHoliday(dateVal, nameVal);
        formAddHoliday.reset();
        showToast(`Holiday "${nameVal}" added!`, 'calendar-plus');
      }
    });

    // Sunday Toggle Change
    toggleSundayHoliday.addEventListener('change', (e) => {
      window.attendanceStore.updateSettings({ autoSundaysHoliday: e.target.checked });
      showToast(e.target.checked ? 'Sundays set as Official Holiday' : 'Sundays set as normal working days', 'calendar');
    });

    // Date Navigation
    datePrevBtn.addEventListener('click', () => changeDate(-1));
    dateNextBtn.addEventListener('click', () => changeDate(1));

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

    // Dropdowns Filter Change
    filterBatchSelect.addEventListener('change', (e) => {
      currentBatchFilter = e.target.value;
      const settings = window.attendanceStore.getSettings();
      renderCourseAndBatchUI(settings.courses || [], settings.batchTimings || []);
      renderAttendanceList();
      renderStats();
    });

    filterCourseSelect.addEventListener('change', (e) => {
      currentCourseFilter = e.target.value;
      const settings = window.attendanceStore.getSettings();
      renderCourseAndBatchUI(settings.courses || [], settings.batchTimings || []);
      renderAttendanceList();
      renderStats();
    });

    // Mark All Present
    btnMarkAllPresent.addEventListener('click', () => {
      const filtered = getFilteredStudents();
      window.attendanceStore.markAllAttendance(currentDate, 'present', filtered);
      showToast('Filtered students marked Present!', 'check-check');
    });

    // Student Directory Search
    candidateDirectorySearch.addEventListener('input', (e) => {
      candidateSearchQuery = e.target.value;
      renderCandidatesDirectory();
    });

    // Student History Select Change
    historyStudentSelect.addEventListener('change', (e) => {
      selectedStudentRollNo = e.target.value;
      renderIndividualStudentHistory();
    });

    // Weekly vs Monthly Toggle
    btnViewWeekly.addEventListener('click', () => {
      historyViewMode = 'weekly';
      btnViewWeekly.className = 'flex-1 py-1.5 rounded-lg text-xs font-black transition bg-white text-indigo-700 shadow-sm';
      btnViewMonthly.className = 'flex-1 py-1.5 rounded-lg text-xs font-black transition text-slate-600';
      renderIndividualStudentHistory();
    });

    btnViewMonthly.addEventListener('click', () => {
      historyViewMode = 'monthly';
      btnViewMonthly.className = 'flex-1 py-1.5 rounded-lg text-xs font-black transition bg-white text-indigo-700 shadow-sm';
      btnViewWeekly.className = 'flex-1 py-1.5 rounded-lg text-xs font-black transition text-slate-600';
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
      editOriginalRollNo.value = '';
      modalStudentFormTitle.textContent = 'Student Admission / Registration';
      btnSaveStudentSubmit.textContent = 'Save & Register Student';
      studentDob.value = '';
      candidatePhotoData.value = '';
      photoPreviewImg.src = '';
      photoPreviewImg.classList.add('hidden');
      photoPreviewEmoji.classList.remove('hidden');
      btnRemovePhoto.classList.add('hidden');

      const students = window.attendanceStore.getStudents() || [];
      const maxRoll = students.reduce((max, s) => {
        const num = parseInt(s.rollNo, 10);
        return (!isNaN(num) && num > max) ? num : max;
      }, 100);
      studentRollNo.value = String(maxRoll + 1);

      modalAddCandidate.classList.add('open');
    };

    btnOpenAddCandidate.addEventListener('click', openAddCandidateModal);

    btnCloseCandidateModal.addEventListener('click', () => {
      modalAddCandidate.classList.remove('open');
    });

    modalAddCandidate.addEventListener('click', (e) => {
      if (e.target === modalAddCandidate) modalAddCandidate.classList.remove('open');
    });

    // Form Add / Edit Student Submit
    formAddCandidate.addEventListener('submit', (e) => {
      e.preventDefault();
      const originalRoll = editOriginalRollNo.value;
      const roll = studentRollNo.value.trim();
      const name = studentName.value.trim();
      const fatherName = studentFatherName.value.trim();
      const dob = studentDob.value;
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

      if (originalRoll) {
        // Edit flow
        const updated = window.attendanceStore.updateStudent(originalRoll, {
          rollNo: roll,
          name,
          fatherName,
          dob,
          contactNo,
          email,
          courseName,
          batchTime,
          address,
          photoUrl
        });
        modalAddCandidate.classList.remove('open');
        showToast(`Updated details for ${updated.name}`, 'user-check');
      } else {
        // Add flow
        const newStudent = window.attendanceStore.addStudent({
          rollNo: roll,
          name,
          fatherName,
          dob,
          contactNo,
          email,
          courseName,
          batchTime,
          address,
          photoUrl
        });
        modalAddCandidate.classList.remove('open');
        showToast(`Enrolled ${newStudent.name} (S/o ${newStudent.fatherName})`, 'user-check');
      }
    });

    // Modal Closes
    btnCloseDetailModal.addEventListener('click', () => modalCandidateDetail.classList.remove('open'));
    modalCandidateDetail.addEventListener('click', (e) => {
      if (e.target === modalCandidateDetail) modalCandidateDetail.classList.remove('open');
    });

    btnCloseIdBadge.addEventListener('click', () => modalIdBadge.classList.remove('open'));
    modalIdBadge.addEventListener('click', (e) => {
      if (e.target === modalIdBadge) modalIdBadge.classList.remove('open');
    });

    btnPrintIdCard.addEventListener('click', () => window.print());

    // History Date Change
    historyDatePicker.addEventListener('change', (e) => {
      historyDate = e.target.value || getTodayDateStr();
      renderHistory();
    });

    // History Filters
    document.querySelectorAll('.hist-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hist-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        historyStatusFilter = btn.getAttribute('data-status');
        renderHistory();
      });
    });

    // Save Branding
    btnSaveBranding.addEventListener('click', () => {
      const name = settingOrgName.value || 'Apex Coaching';
      const branch = settingOrgBranch.value || 'Attendance & Holiday Portal';

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

    btnCloseDeptModal.addEventListener('click', () => modalAddDept.classList.remove('open'));
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
      link.download = `Apex_Attendance_Backup_${getTodayDateStr()}.json`;
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

    // Directory Add Student Button
    const btnDirectoryAddStudent = document.getElementById('btn-directory-add-student');
    if (btnDirectoryAddStudent) {
      btnDirectoryAddStudent.addEventListener('click', openAddCandidateModal);
    }

    // Danger Zone: Clear Attendance Only
    const btnClearAttendanceLogs = document.getElementById('btn-clear-attendance-logs');
    if (btnClearAttendanceLogs) {
      btnClearAttendanceLogs.addEventListener('click', () => {
        if (confirm('⚠️ Are you sure you want to clear ALL past attendance history? Enrolled students will NOT be deleted.')) {
          window.attendanceStore.clearAllAttendanceHistory();
          showToast('All attendance history cleared', 'calendar-x');
        }
      });
    }

    // Danger Zone: Delete All Students
    const btnDeleteAllStudents = document.getElementById('btn-delete-all-students');
    if (btnDeleteAllStudents) {
      btnDeleteAllStudents.addEventListener('click', () => {
        if (confirm('🚨 DANGER: Are you sure you want to delete ALL students and their attendance records? This action cannot be undone.')) {
          window.attendanceStore.deleteAllStudents();
          showToast('All students deleted', 'trash-2');
        }
      });
    }

    // Danger Zone: Factory Reset
    const btnFactoryReset = document.getElementById('btn-factory-reset');
    if (btnFactoryReset) {
      btnFactoryReset.addEventListener('click', () => {
        const confirmText = prompt('Type RESET to confirm complete factory reset:');
        if (confirmText === 'RESET') {
          window.attendanceStore.resetAllDataToDefault();
          showToast('Application reset to factory defaults', 'rotate-ccw');
        } else if (confirmText !== null) {
          showToast('Factory reset cancelled', 'info');
        }
      });
    }

    // Export Excel / CSV with DOB
    btnExportExcel.addEventListener('click', () => {
      exportAttendanceCSV(historyDate);
    });
  }

  // ----------------------------------------------------
  // CSV Export with DOB
  // ----------------------------------------------------
  function exportAttendanceCSV(dateStr) {
    const students = window.attendanceStore.getStudents() || [];
    const attendanceMap = window.attendanceStore.getAttendanceForDate(dateStr);

    let csv = 'Roll No,Student Name,Father Name,DOB,Contact No,Address,Batch Time,Course Name,Date,Status\n';
    students.forEach(s => {
      const status = (attendanceMap[s.rollNo] || 'unmarked').toUpperCase();
      csv += `"${s.rollNo}","${s.name}","${s.fatherName}","${s.dob || ''}","${s.contactNo}","${s.address}","${s.batchTime}","${s.courseName}","${dateStr}","${status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Coaching_Attendance_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported attendance with DOB for ${dateStr}`, 'file-check');
  }

  function showToast(message, icon = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-3d';
    toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 text-emerald-400"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    if (window.lucide && lucide.createIcons) lucide.createIcons();

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
});
