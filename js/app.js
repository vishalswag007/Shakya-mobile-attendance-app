/**
 * Apex Coaching Institute - 3D Mobile-First Web Application Controller
 * Handles 3D Touch Interactions, WhatsApp Attendance Sharing, Cloud Sync,
 * Individual Student History & Directory.
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

  // Month Display
  const currentMonthDisplay = document.getElementById('current-month-display');

  // Attendance Tab DOM
  const dateInput = document.getElementById('attendance-date-input');
  const datePrevBtn = document.getElementById('date-prev');
  const dateNextBtn = document.getElementById('date-next');
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
  const historySummaryRate = document.getElementById('history-summary-rate');
  const historyRecordsList = document.getElementById('history-records-list');

  // Student Registration Form DOM
  const modalAddCandidate = document.getElementById('modal-add-candidate');
  const formAddCandidate = document.getElementById('form-add-candidate');
  const btnOpenAddCandidate = document.getElementById('btn-open-add-candidate');
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
  const inputCloudUrl = document.getElementById('input-cloud-url');
  const btnSaveCloudSync = document.getElementById('btn-save-cloud-sync');
  const btnPullCloudData = document.getElementById('btn-pull-cloud-data');

  // Export Buttons
  const btnExportExcel = document.getElementById('btn-export-excel');
  const resetDataBtn = document.getElementById('reset-data-btn');

  // ----------------------------------------------------
  // Initialization
  // ----------------------------------------------------
  initDatePickers();
  applySettingsToUI();
  bindNavigation();
  bindEvents();
  renderAll();

  // Try initial background pull from cloud if configured
  window.attendanceStore.pullFromCloud();

  // Subscribe to store updates
  window.attendanceStore.subscribe(() => {
    applySettingsToUI();
    renderAll();
  });

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
      dateBadgeToday.className = 'text-[9px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full font-black';
    } else {
      const d = new Date(currentDate + 'T00:00:00');
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateBadgeToday.textContent = formatted.toUpperCase();
      dateBadgeToday.className = 'text-[9px] bg-white text-indigo-950 px-2 py-0.5 rounded-full font-black';
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

  // ----------------------------------------------------
  // Navigation (3D Tabs)
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

      settingsLogoImg.src = settings.orgLogoUrl;
      settingsLogoImg.classList.remove('hidden');
      settingsLogoEmoji.classList.add('hidden');
      btnRemoveOrgLogo.classList.remove('hidden');
    } else {
      headerBrandImg.classList.add('hidden');
      headerBrandEmoji.classList.remove('hidden');
      headerBrandEmoji.textContent = settings.orgLogo || '🎓';

      settingsLogoImg.classList.add('hidden');
      settingsLogoEmoji.classList.remove('hidden');
      settingsLogoEmoji.textContent = settings.orgLogo || '🎓';
      btnRemoveOrgLogo.classList.add('hidden');
    }

    headerOrgTitle.textContent = settings.orgName || 'Apex Coaching';
    headerOrgSubtitle.textContent = (settings.orgBranch || 'Attendance Portal');

    settingOrgName.value = settings.orgName || '';
    settingOrgBranch.value = settings.orgBranch || '';
    inputCloudUrl.value = settings.cloudSyncUrl || '';

    renderCourseAndBatchUI(settings.courses || [], settings.batchTimings || []);
  }

  function renderCourseAndBatchUI(courses, batchTimings) {
    // 1. Batch Filter Chips
    batchFilterChips.innerHTML = `
      <button class="pill-filter-btn ${currentBatchFilter === 'all' ? 'active' : ''}" data-batch="all">All Batches</button>
      ${batchTimings.map(b => {
        const shortName = b.split('(')[1] ? b.split('(')[1].replace(')', '') : (b ? b.substring(0, 14) : '');
        return `
          <button class="pill-filter-btn ${currentBatchFilter === b ? 'active' : ''}" data-batch="${escapeHtml(b)}">
            ${escapeHtml(shortName)}
          </button>
        `;
      }).join('')}
    `;

    batchFilterChips.querySelectorAll('.pill-filter-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        currentBatchFilter = chip.getAttribute('data-batch');
        renderCourseAndBatchUI(courses, batchTimings);
        renderAttendanceList();
        renderStats();
      });
    });

    // 2. Course Filter Chips
    courseFilterChips.innerHTML = `
      <button class="pill-filter-btn ${currentCourseFilter === 'all' ? 'active' : ''}" data-course="all">All Courses</button>
      ${courses.map(c => `
        <button class="pill-filter-btn ${currentCourseFilter === c ? 'active' : ''}" data-course="${escapeHtml(c)}">
          ${escapeHtml(c)}
        </button>
      `).join('')}
    `;

    courseFilterChips.querySelectorAll('.pill-filter-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        currentCourseFilter = chip.getAttribute('data-course');
        renderCourseAndBatchUI(courses, batchTimings);
        renderAttendanceList();
        renderStats();
      });
    });

    // 3. Dropdowns
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
  // Avatar Renderer
  // ----------------------------------------------------
  function renderAvatar(student) {
    if (student.photoUrl) {
      return `<img src="${escapeHtml(student.photoUrl)}" alt="${escapeHtml(student.name)}" class="w-full h-full object-cover rounded-inherit">`;
    }
    return `<span>${student.avatar || '👨‍🎓'}</span>`;
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
          <p class="text-[11px] text-slate-400 mt-0.5">Reset filter or add new student.</p>
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
                  
                  <!-- 3D Father's Name Badge -->
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
            </div>
          </div>

          <!-- 3D Tactile Attendance Buttons -->
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
        <div class="col-span-full text-center py-12 text-slate-400 text-sm bg-white border border-slate-200 rounded-3xl shadow-sm">
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
              <div class="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-medium">
                <span>📞 ${escapeHtml(s.contactNo || 'No phone')}</span>
                <span>•</span>
                <span class="text-emerald-700 font-black">${rate}% Rate</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button class="btn-view-student-log flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition" data-roll="${s.rollNo}">
              <i data-lucide="calendar-search" class="w-3.5 h-3.5"></i> View History
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

    const rawPhone = student.contactNo.replace(/[^0-9]/g, '');

    // Profile Card
    historyStudentCard.innerHTML = `
      <div class="flex items-center gap-3.5 mb-3">
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
          <p class="text-xs text-indigo-700 font-bold mt-1">${escapeHtml(student.courseName)}</p>
        </div>
      </div>

      <div class="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
        <div><span class="font-bold text-slate-500">Batch:</span> ${escapeHtml(student.batchTime)}</div>
        <div><span class="font-bold text-slate-500">Phone:</span> ${escapeHtml(student.contactNo || 'N/A')}</div>
        <div><span class="font-bold text-slate-500">Address:</span> ${escapeHtml(student.address || 'N/A')}</div>
      </div>

      <!-- Quick Parent Communication -->
      <div class="grid grid-cols-2 gap-2">
        <a href="tel:${student.contactNo}" class="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition">
          <i data-lucide="phone-call" class="w-3.5 h-3.5 text-emerald-600"></i> Call Parent
        </a>
        <a href="https://wa.me/${rawPhone}?text=Hello%2C%20Attendance%20Report%20for%20${encodeURIComponent(student.name)}%20(Roll%20${student.rollNo})" target="_blank" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp
        </a>
      </div>
    `;

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
            ${weekly.logs.map(log => `
              <div class="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-10 font-black text-slate-800">${log.dayName}</span>
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

          <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400 pt-1">Monthly 31-Day Matrix</h4>
          <div class="grid grid-cols-7 gap-1.5 mb-2">
            ${monthly.logs.map(log => {
              let bg = 'bg-slate-50 text-slate-400 border-slate-200';
              let char = '·';
              if (log.status === 'present') { bg = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black'; char = 'P'; }
              else if (log.status === 'absent') { bg = 'bg-rose-100 text-rose-800 border-rose-300 font-black'; char = 'A'; }
              else if (log.status === 'leave') { bg = 'bg-amber-100 text-amber-800 border-amber-300 font-black'; char = 'L'; }

              return `
                <div class="aspect-square rounded-lg border flex flex-col items-center justify-center p-1 ${bg}" title="${log.date}: ${log.status}">
                  <span class="text-[10px] leading-none">${log.day}</span>
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
        <div><span class="text-slate-500 font-bold">Course:</span> <span class="font-bold text-indigo-700">${escapeHtml(student.courseName)}</span></div>
        <div><span class="text-slate-500 font-bold">Batch:</span> <span class="font-bold">${escapeHtml(student.batchTime)}</span></div>
        <div><span class="text-slate-500 font-bold">Phone:</span> ${escapeHtml(student.contactNo || 'N/A')}</div>
        <div><span class="text-slate-500 font-bold">Address:</span> ${escapeHtml(student.address || 'N/A')}</div>
      </div>

      <div class="flex gap-2">
        <button class="btn-profile-id-badge flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
          <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> Smart ID
        </button>
        <button class="btn-profile-open-history flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
          <i data-lucide="calendar" class="w-3.5 h-3.5"></i> Full Log
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
      switchTab('tab-student-history');
    });

    modalCandidateDetail.classList.add('open');
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  // ----------------------------------------------------
  // 3D ID Badge Modal
  // ----------------------------------------------------
  function open3DIdBadgeModal(rollNo) {
    const student = window.attendanceStore.getStudentByRollNo(rollNo);
    const settings = window.attendanceStore.getSettings();
    if (!student) return;

    const qrData = encodeURIComponent(`APEX:${student.rollNo}:${student.name}:${student.fatherName}`);
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
            <p class="text-[11px] text-indigo-600 font-bold truncate mt-1">${escapeHtml(student.courseName)}</p>
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
    // WhatsApp Sharing
    const shareWhatsApp = (dateStr) => {
      const text = window.attendanceStore.generateWhatsAppReport(dateStr);
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    };

    btnShareWhatsappToday.addEventListener('click', () => shareWhatsApp(currentDate));
    btnShareWhatsappReport.addEventListener('click', () => shareWhatsApp(historyDate));

    // Cloud Sync Buttons
    btnSaveCloudSync.addEventListener('click', () => {
      const url = inputCloudUrl.value.trim();
      window.attendanceStore.updateSettings({ cloudSyncUrl: url });
      window.attendanceStore.dispatchCloudSync();
      showToast('Cloud Sync Configured & Synced!', 'cloud');
    });

    btnPullCloudData.addEventListener('click', async () => {
      showToast('Pulling latest from Cloud...', 'refresh-cw');
      const ok = await window.attendanceStore.pullFromCloud();
      if (ok) {
        showToast('Synced with Cloud successfully!', 'check-circle');
      } else {
        showToast('Cloud sync offline or invalid URL', 'alert-triangle');
      }
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
      showToast(`Enrolled ${newStudent.name} (S/o ${newStudent.fatherName})`, 'user-check');
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
      const branch = settingOrgBranch.value || 'Attendance Portal';

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

    // Reset Mock Data
    resetDataBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.reload();
    });

    // Export Excel / CSV
    btnExportExcel.addEventListener('click', () => {
      exportAttendanceCSV(historyDate);
    });
  }

  // ----------------------------------------------------
  // CSV Export
  // ----------------------------------------------------
  function exportAttendanceCSV(dateStr) {
    const students = window.attendanceStore.getStudents() || [];
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
