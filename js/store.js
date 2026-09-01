/**
 * Shakya Coaching Institute - Data Store Engine with Google Firebase Realtime Database
 * Features: Multi-Device Auto-Sync with Array Normalization, Admin Authentication,
 * Email OTP Recovery, Clear All Data / Reset Option, Full Backup & Restore.
 */

const STORAGE_KEYS = {
  STUDENTS: 'apex_students',
  ATTENDANCE: 'apex_attendance',
  SETTINGS: 'apex_settings',
  HOLIDAYS: 'apex_holidays',
  ADMIN_SESSION: 'apex_admin_session',
  PASSWORD_RESET_OTP: 'apex_pwd_reset_otp',
  LAST_CLOUD_SYNC: 'apex_last_cloud_sync'
};

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAGYXGuytbiEs-vjCzrCA1jZQyM2R7PxMw",
  authDomain: "shakya-attendance.firebaseapp.com",
  databaseURL: "https://shakya-attendance-default-rtdb.firebaseio.com",
  projectId: "shakya-attendance",
  storageBucket: "shakya-attendance.firebasestorage.app",
  messagingSenderId: "574539374438",
  appId: "1:574539374438:web:e00d262a2a6ba4aa9732a7",
  measurementId: "G-VN4F7RNWQM"
};

const FIREBASE_REST_URL = "https://shakya-attendance-default-rtdb.firebaseio.com/shakya_attendance.json";

const DEFAULT_COURSES = [
  'JEE Mains & Advanced',
  'NEET Medical Batch',
  'Class 12th Physics & Chemistry',
  'Class 10th Board Foundation',
  'Crash Course 2026'
];

const DEFAULT_BATCH_TIMINGS = [
  '08:00 AM - 10:00 AM (Morning Batch 1)',
  '10:30 AM - 12:30 PM (Morning Batch 2)',
  '04:00 PM - 06:00 PM (Evening Batch 1)',
  '06:30 PM - 08:30 PM (Evening Batch 2)'
];

const DEFAULT_HOLIDAYS = [
  { id: 'h1', date: '2026-08-15', name: 'Independence Day (Swatantrata Diwas)', type: 'national' },
  { id: 'h2', date: '2026-08-28', name: 'Raksha Bandhan Break', type: 'festival' },
  { id: 'h3', date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national' },
  { id: 'h4', date: '2026-11-08', name: 'Diwali Festival Break', type: 'festival' },
  { id: 'h5', date: '2026-12-25', name: 'Christmas Day', type: 'national' }
];

const DEFAULT_SETTINGS = {
  orgName: 'Shakya Coaching Institute',
  orgBranch: 'Main Academic Campus',
  orgLogo: '🎓',
  orgLogoUrl: null,
  academicYear: '2026-2027',
  courses: DEFAULT_COURSES,
  batchTimings: DEFAULT_BATCH_TIMINGS,
  autoSundaysHoliday: true,
  inbuiltCloudKey: 'SHAKYA-ACADEMY-2026',
  adminPassword: 'admin',
  adminRecoveryEmail: 'director@apexcoaching.com',
  requireLoginOnStart: true
};

const INITIAL_STUDENTS = [
  {
    id: '101',
    rollNo: '101',
    name: 'Aarav Sharma',
    fatherName: 'Rajesh Sharma',
    dob: '2008-06-15',
    contactNo: '+91 98765 43210',
    address: '42, Civil Lines, Kanpur',
    batchTime: '08:00 AM - 10:00 AM (Morning Batch 1)',
    courseName: 'JEE Mains & Advanced',
    email: 'aarav.sharma@example.com',
    role: 'Student',
    avatar: '👨‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01'
  },
  {
    id: '102',
    rollNo: '102',
    name: 'Aarav Sharma',
    fatherName: 'Suresh Kumar Sharma',
    dob: '2008-09-22',
    contactNo: '+91 98765 43211',
    address: '15/A, Mall Road, Kanpur',
    batchTime: '04:00 PM - 06:00 PM (Evening Batch 1)',
    courseName: 'NEET Medical Batch',
    email: '',
    role: 'Student',
    avatar: '👨‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01'
  },
  {
    id: '103',
    rollNo: '103',
    name: 'Priya Patel',
    fatherName: 'Mahesh Patel',
    dob: '2009-02-18',
    contactNo: '+91 98765 43212',
    address: '78, Swaroop Nagar, Kanpur',
    batchTime: '08:00 AM - 10:00 AM (Morning Batch 1)',
    courseName: 'Class 12th Physics & Chemistry',
    email: 'priya.patel@example.com',
    role: 'Student',
    avatar: '👩‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-02'
  },
  {
    id: '104',
    rollNo: '104',
    name: 'Rohan Mehta',
    fatherName: 'Dinesh Mehta',
    dob: '2008-11-05',
    contactNo: '+91 98765 43213',
    address: '102, Kakadeo Hub',
    batchTime: '04:00 PM - 06:00 PM (Evening Batch 1)',
    courseName: 'JEE Mains & Advanced',
    email: 'rohan.mehta@example.com',
    role: 'Student',
    avatar: '👨‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-03'
  },
  {
    id: '105',
    rollNo: '105',
    name: 'Ananya Gupta',
    fatherName: 'Sunil Gupta',
    dob: '2010-04-12',
    contactNo: '+91 98765 43214',
    address: '56, Shastri Nagar',
    batchTime: '10:30 AM - 12:30 PM (Morning Batch 2)',
    courseName: 'Class 10th Board Foundation',
    email: 'ananya.gupta@example.com',
    role: 'Student',
    avatar: '👩‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-03'
  },
  {
    id: '106',
    rollNo: '106',
    name: 'Vikram Singh',
    fatherName: 'Balwant Singh',
    dob: '2007-12-30',
    contactNo: '+91 98765 43215',
    address: '12/4, Govind Nagar',
    batchTime: '06:30 PM - 08:30 PM (Evening Batch 2)',
    courseName: 'Crash Course 2026',
    email: 'vikram.singh@example.com',
    role: 'Student',
    avatar: '👨‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-04'
  }
];

function normalizeArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean);
  if (typeof data === 'object') return Object.values(data).filter(Boolean);
  return [];
}

class AttendanceStore {
  constructor() {
    this.listeners = [];
    this.firebaseDb = null;
    this.isSyncing = false;
    this.pushTimeout = null;

    this.init();
    this.initFirebase();
  }

  getTodayDateStr() {
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

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOLIDAYS)) {
      localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(DEFAULT_HOLIDAYS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      const today = this.getTodayDateStr();
      const initialAttendance = {
        [today]: {
          '101': 'present',
          '102': 'present',
          '103': 'present',
          '104': 'absent',
          '105': 'present',
          '106': 'leave'
        }
      };
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));
    }
  }

  // ----------------------------------------------------
  // Firebase Realtime Database Auto-Sync Engine
  // ----------------------------------------------------
  initFirebase() {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.firebaseDb = firebase.database();
        console.log('⚡ Firebase Realtime Database Initialized!');
        this.listenToFirebaseRealtime();
      } catch (err) {
        console.warn('Firebase SDK init notice:', err);
        this.startRestPollingSync();
      }
    } else {
      this.startRestPollingSync();
    }
  }

  listenToFirebaseRealtime() {
    if (!this.firebaseDb) return;

    try {
      const ref = this.firebaseDb.ref('shakya_attendance');
      ref.on('value', (snapshot) => {
        const cloudData = snapshot.val();
        if (cloudData && !this.isSyncing) {
          this.applyCloudPayload(cloudData);
        } else if (!cloudData) {
          this.pushToCloud();
        }
      }, (error) => {
        console.warn('Firebase Realtime Database Notice:', error);
        this.fetchFromCloudRest();
      });
    } catch (e) {
      console.warn('Realtime listener notice:', e);
      this.fetchFromCloudRest();
    }
  }

  pushToCloud() {
    if (this.pushTimeout) clearTimeout(this.pushTimeout);

    this.pushTimeout = setTimeout(async () => {
      const payload = {
        settings: this.getSettings(),
        students: this.getStudents(),
        attendance: this.getAllAttendanceRecords(),
        holidays: this.getHolidays(),
        updatedAt: new Date().toISOString()
      };

      if (this.firebaseDb) {
        try {
          this.isSyncing = true;
          await this.firebaseDb.ref('shakya_attendance').set(payload);
          localStorage.setItem(STORAGE_KEYS.LAST_CLOUD_SYNC, new Date().toISOString());
        } catch (err) {
          this.pushToCloudRest(payload);
        } finally {
          setTimeout(() => { this.isSyncing = false; }, 500);
        }
      } else {
        this.pushToCloudRest(payload);
      }
    }, 200);
  }

  async pushToCloudRest(payload) {
    try {
      this.isSyncing = true;
      await fetch(FIREBASE_REST_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      localStorage.setItem(STORAGE_KEYS.LAST_CLOUD_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn('REST push notice:', e);
    } finally {
      setTimeout(() => { this.isSyncing = false; }, 500);
    }
  }

  async fetchFromCloudRest() {
    try {
      const res = await fetch(FIREBASE_REST_URL);
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && typeof cloudData === 'object') {
          this.applyCloudPayload(cloudData);
        }
      }
    } catch (e) {
      console.warn('REST fetch notice:', e);
    }
  }

  startRestPollingSync() {
    this.fetchFromCloudRest();
    setInterval(() => {
      if (!this.isSyncing) {
        this.fetchFromCloudRest();
      }
    }, 15000);
  }

  applyCloudPayload(cloudData) {
    let changed = false;

    if (cloudData.students) {
      const list = normalizeArray(cloudData.students);
      if (list.length > 0) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
        changed = true;
      }
    }

    if (cloudData.attendance && typeof cloudData.attendance === 'object') {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(cloudData.attendance));
      changed = true;
    }

    if (cloudData.holidays) {
      const holidaysList = normalizeArray(cloudData.holidays);
      if (holidaysList.length > 0) {
        localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidaysList));
        changed = true;
      }
    }

    if (cloudData.settings && typeof cloudData.settings === 'object') {
      const current = this.getSettings();
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
        ...current,
        ...cloudData.settings,
        adminPassword: current.adminPassword
      }));
      changed = true;
    }

    if (changed) {
      localStorage.setItem(STORAGE_KEYS.LAST_CLOUD_SYNC, new Date().toISOString());
      this.listeners.forEach(fn => fn());
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
    this.pushToCloud();
  }

  // ----------------------------------------------------
  // Admin Authentication & Password Engine
  // ----------------------------------------------------
  isAdminLoggedIn() {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  }

  loginAdmin(password) {
    const settings = this.getSettings();
    const correctPassword = settings.adminPassword || 'admin';
    if (password === correctPassword) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      return { success: true };
    }
    return { success: false, error: 'Incorrect Admin Password!' };
  }

  logoutAdmin() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    this.notify();
  }

  changeAdminPassword(oldPassword, newPassword) {
    const settings = this.getSettings();
    const currentPass = settings.adminPassword || 'admin';

    if (oldPassword !== currentPass) {
      return { success: false, error: 'Current password does not match!' };
    }

    if (!newPassword || newPassword.trim().length < 3) {
      return { success: false, error: 'New password must be at least 3 characters long.' };
    }

    this.updateSettings({ adminPassword: newPassword.trim() });
    return { success: true };
  }

  // ----------------------------------------------------
  // Real-Time Forgot Password & OTP Recovery Engine
  // ----------------------------------------------------
  getRecoveryEmail() {
    const settings = this.getSettings();
    return settings.adminRecoveryEmail || 'director@apexcoaching.com';
  }

  maskEmail(email) {
    if (!email || !email.includes('@')) return email || '***@apexcoaching.com';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}***${name.substring(name.length - 1)}@${domain}`;
  }

  generatePasswordResetOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const recoveryEmail = this.getRecoveryEmail();

    const otpPayload = {
      otp,
      email: recoveryEmail,
      expiresAt,
      createdAt: Date.now()
    };

    sessionStorage.setItem(STORAGE_KEYS.PASSWORD_RESET_OTP, JSON.stringify(otpPayload));
    return {
      success: true,
      otp,
      email: recoveryEmail,
      maskedEmail: this.maskEmail(recoveryEmail),
      expiresInSeconds: 300
    };
  }

  verifyPasswordResetOTP(inputOtp) {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.PASSWORD_RESET_OTP);
      if (!raw) {
        return { success: false, error: 'No active OTP request found. Please request a new OTP.' };
      }

      const { otp, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt) {
        sessionStorage.removeItem(STORAGE_KEYS.PASSWORD_RESET_OTP);
        return { success: false, error: 'OTP has expired. Please request a new OTP.' };
      }

      if (String(inputOtp).trim() !== String(otp).trim()) {
        return { success: false, error: 'Invalid 6-digit OTP code. Please check and retry.' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'OTP verification failed. Please try again.' };
    }
  }

  resetAdminPasswordWithOTP(inputOtp, newPassword) {
    const verification = this.verifyPasswordResetOTP(inputOtp);
    if (!verification.success) {
      return verification;
    }

    if (!newPassword || newPassword.trim().length < 3) {
      return { success: false, error: 'New password must be at least 3 characters long.' };
    }

    this.updateSettings({ adminPassword: newPassword.trim() });
    sessionStorage.removeItem(STORAGE_KEYS.PASSWORD_RESET_OTP);
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    this.notify();

    return { success: true };
  }

  // ----------------------------------------------------
  // Settings & Branding
  // ----------------------------------------------------
  getSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
      return {
        ...DEFAULT_SETTINGS,
        ...s,
        courses: normalizeArray(s?.courses).length > 0 ? normalizeArray(s.courses) : DEFAULT_COURSES,
        batchTimings: normalizeArray(s?.batchTimings).length > 0 ? normalizeArray(s.batchTimings) : DEFAULT_BATCH_TIMINGS,
        autoSundaysHoliday: s?.autoSundaysHoliday !== undefined ? !!s.autoSundaysHoliday : true,
        inbuiltCloudKey: s?.inbuiltCloudKey || 'SHAKYA-ACADEMY-2026',
        adminPassword: s?.adminPassword || 'admin',
        adminRecoveryEmail: s?.adminRecoveryEmail || 'director@apexcoaching.com'
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  updateSettings(updates) {
    const current = this.getSettings();
    const merged = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    this.notify();
    return merged;
  }

  updateOrgLogo(logoUrl) {
    return this.updateSettings({ orgLogoUrl: logoUrl });
  }

  removeOrgLogo() {
    return this.updateSettings({ orgLogoUrl: null, orgLogo: '🎓' });
  }

  // ----------------------------------------------------
  // Course Management
  // ----------------------------------------------------
  addCourse(courseName) {
    if (!courseName || !courseName.trim()) return;
    const settings = this.getSettings();
    const clean = courseName.trim();
    if (!settings.courses.includes(clean)) {
      settings.courses.push(clean);
      this.updateSettings({ courses: settings.courses });
    }
  }

  removeCourse(courseName) {
    const settings = this.getSettings();
    settings.courses = settings.courses.filter(c => c !== courseName);
    this.updateSettings({ courses: settings.courses });
  }

  // ----------------------------------------------------
  // Batch Timings Management
  // ----------------------------------------------------
  getBatchTimings() {
    const settings = this.getSettings();
    return settings.batchTimings || DEFAULT_BATCH_TIMINGS;
  }

  addBatchTiming(timingStr) {
    if (!timingStr || !timingStr.trim()) return;
    const settings = this.getSettings();
    const clean = timingStr.trim();
    if (!settings.batchTimings.includes(clean)) {
      settings.batchTimings.push(clean);
      this.updateSettings({ batchTimings: settings.batchTimings });
    }
  }

  editBatchTiming(oldTimingStr, newTimingStr) {
    if (!oldTimingStr || !newTimingStr || !newTimingStr.trim()) return;
    const settings = this.getSettings();
    const index = settings.batchTimings.indexOf(oldTimingStr);
    if (index >= 0) {
      settings.batchTimings[index] = newTimingStr.trim();
      
      const students = this.getStudents();
      let updatedStudents = false;
      students.forEach(s => {
        if (s.batchTime === oldTimingStr) {
          s.batchTime = newTimingStr.trim();
          updatedStudents = true;
        }
      });
      if (updatedStudents) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      }

      this.updateSettings({ batchTimings: settings.batchTimings });
    }
  }

  removeBatchTiming(timingStr) {
    const settings = this.getSettings();
    settings.batchTimings = settings.batchTimings.filter(b => b !== timingStr);
    this.updateSettings({ batchTimings: settings.batchTimings });
  }

  // ----------------------------------------------------
  // Holiday & Calendar Management
  // ----------------------------------------------------
  getHolidays() {
    try {
      const h = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLIDAYS));
      const list = normalizeArray(h);
      return list.length > 0 ? list : DEFAULT_HOLIDAYS;
    } catch {
      return DEFAULT_HOLIDAYS;
    }
  }

  addHoliday(dateStr, name, type = 'festival') {
    if (!dateStr || !name) return;
    const holidays = this.getHolidays();
    const newH = {
      id: 'h_' + Date.now(),
      date: dateStr,
      name: name.trim(),
      type
    };
    holidays.push(newH);
    holidays.sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));
    this.notify();
    return newH;
  }

  removeHoliday(id) {
    let holidays = this.getHolidays();
    holidays = holidays.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));
    this.notify();
  }

  getHolidayInfo(dateStr) {
    if (!dateStr) return { isHoliday: false };
    
    const holidays = this.getHolidays();
    const found = holidays.find(h => h.date === dateStr);
    if (found) {
      return { isHoliday: true, name: found.name, type: found.type };
    }

    const settings = this.getSettings();
    if (settings.autoSundaysHoliday) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dayObj = new Date(y, m - 1, d);
      if (dayObj.getDay() === 0) { // 0 is Sunday
        return { isHoliday: true, name: 'Sunday (Weekly Off)', type: 'sunday' };
      }
    }

    return { isHoliday: false };
  }

  // ----------------------------------------------------
  // Students Management (Add, Edit, Delete with DOB)
  // ----------------------------------------------------
  getStudents() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS));
      const list = normalizeArray(data);
      if (list.length === 0) {
        return [];
      }
      return list.map(s => ({
        id: s.id || s.rollNo || String(Date.now()),
        rollNo: s.rollNo || s.id || '101',
        name: s.name || 'Student',
        fatherName: s.fatherName || s.department || 'Parent',
        dob: s.dob || '',
        contactNo: s.contactNo || s.phone || '',
        address: s.address || '',
        batchTime: s.batchTime || DEFAULT_BATCH_TIMINGS[0],
        courseName: s.courseName || s.department || DEFAULT_COURSES[0],
        email: s.email || '',
        role: 'Student',
        avatar: s.avatar || '👨‍🎓',
        photoUrl: s.photoUrl || null,
        createdAt: s.createdAt || new Date().toISOString()
      }));
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  getStudentByRollNo(rollNo) {
    const students = this.getStudents();
    return students.find(s => String(s.rollNo) === String(rollNo));
  }

  addStudent(studentData) {
    const students = this.getStudents();
    const rollNo = studentData.rollNo ? String(studentData.rollNo).trim() : String(Date.now()).slice(-4);

    const existingIndex = students.findIndex(s => String(s.rollNo) === rollNo);
    const newStudent = {
      id: rollNo,
      rollNo,
      name: studentData.name.trim(),
      fatherName: (studentData.fatherName || '').trim() || 'Parent',
      dob: (studentData.dob || '').trim(),
      contactNo: (studentData.contactNo || '').trim(),
      address: (studentData.address || '').trim(),
      batchTime: studentData.batchTime || DEFAULT_BATCH_TIMINGS[0],
      courseName: studentData.courseName || DEFAULT_COURSES[0],
      email: (studentData.email || '').trim(),
      role: 'Student',
      avatar: studentData.avatar || '👨‍🎓',
      photoUrl: studentData.photoUrl || null,
      createdAt: this.getTodayDateStr()
    };

    if (existingIndex >= 0) {
      students[existingIndex] = newStudent;
    } else {
      students.push(newStudent);
    }

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.notify();
    return newStudent;
  }

  updateStudent(originalRollNo, updatedData) {
    const students = this.getStudents();
    const index = students.findIndex(s => String(s.rollNo) === String(originalRollNo));
    if (index < 0) return null;

    const newRollNo = updatedData.rollNo ? String(updatedData.rollNo).trim() : String(originalRollNo);

    if (String(originalRollNo) !== newRollNo) {
      const allAttendance = this.getAllAttendanceRecords();
      Object.keys(allAttendance).forEach(date => {
        if (allAttendance[date] && allAttendance[date][originalRollNo] !== undefined) {
          allAttendance[date][newRollNo] = allAttendance[date][originalRollNo];
          delete allAttendance[date][originalRollNo];
        }
      });
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(allAttendance));
    }

    const updated = {
      ...students[index],
      id: newRollNo,
      rollNo: newRollNo,
      name: updatedData.name.trim(),
      fatherName: (updatedData.fatherName || '').trim() || 'Parent',
      dob: (updatedData.dob !== undefined ? updatedData.dob : (students[index].dob || '')).trim(),
      contactNo: (updatedData.contactNo || '').trim(),
      address: (updatedData.address || '').trim(),
      batchTime: updatedData.batchTime || students[index].batchTime,
      courseName: updatedData.courseName || students[index].courseName,
      email: (updatedData.email || '').trim(),
      photoUrl: updatedData.photoUrl !== undefined ? updatedData.photoUrl : students[index].photoUrl
    };

    students[index] = updated;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.notify();
    return updated;
  }

  deleteStudent(rollNo) {
    let students = this.getStudents();
    students = students.filter(s => String(s.rollNo) !== String(rollNo));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.notify();
  }

  // ----------------------------------------------------
  // Attendance Management
  // ----------------------------------------------------
  getAllAttendanceRecords() {
    try {
      const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE));
      return records && typeof records === 'object' ? records : {};
    } catch {
      return {};
    }
  }

  getAttendanceForDate(dateStr) {
    const all = this.getAllAttendanceRecords();
    return all[dateStr] || {};
  }

  markAttendance(rollNo, dateStr, status) {
    const all = this.getAllAttendanceRecords();
    if (!all[dateStr]) {
      all[dateStr] = {};
    }

    if (all[dateStr][rollNo] === status) {
      delete all[dateStr][rollNo];
    } else {
      all[dateStr][rollNo] = status;
    }

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    this.notify();
    return all[dateStr][rollNo] || 'unmarked';
  }

  markAllAttendance(dateStr, status, filteredStudents = null) {
    const all = this.getAllAttendanceRecords();
    if (!all[dateStr]) {
      all[dateStr] = {};
    }

    const students = filteredStudents || this.getStudents();
    students.forEach(s => {
      all[dateStr][s.rollNo] = status;
    });

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    this.notify();
  }

  getStatsForDate(dateStr, filteredStudents = null) {
    const students = filteredStudents || this.getStudents();
    const attendanceMap = this.getAttendanceForDate(dateStr);

    let present = 0;
    let absent = 0;
    let leave = 0;

    students.forEach(s => {
      const status = attendanceMap[s.rollNo];
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;
    });

    const total = students.length;
    const marked = present + absent + leave;
    const rate = marked > 0 ? Math.round((present / marked) * 100) : 0;

    return { total, present, absent, leave, marked, rate };
  }

  // ----------------------------------------------------
  // Analytics: Individual Student Weekly & Monthly History
  // ----------------------------------------------------
  getCandidateAttendanceHistory(rollNo) {
    const all = this.getAllAttendanceRecords();
    const history = [];
    const dates = Object.keys(all).sort().reverse();

    dates.forEach(date => {
      const dayRecord = all[date];
      if (dayRecord && dayRecord[rollNo]) {
        history.push({
          date,
          status: dayRecord[rollNo]
        });
      }
    });

    return history;
  }

  getStudentHistoryWeekly(rollNo, referenceDateStr) {
    const [y, m, d] = (referenceDateStr || this.getTodayDateStr()).split('-').map(Number);
    const ref = new Date(y, m - 1, d);
    const dayOfWeek = ref.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
    // Monday as the starting day of the week
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(y, m - 1, d + mondayOffset);

    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let present = 0, absent = 0, leave = 0, holidaysCount = 0;

    for (let i = 0; i < 7; i++) {
      const cur = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const cy = cur.getFullYear();
      const cm = String(cur.getMonth() + 1).padStart(2, '0');
      const cd = String(cur.getDate()).padStart(2, '0');
      const dStr = `${cy}-${cm}-${cd}`;

      const holInfo = this.getHolidayInfo(dStr);
      const att = this.getAttendanceForDate(dStr);
      let status = att[rollNo] || 'unmarked';

      if (holInfo.isHoliday && status === 'unmarked') {
        status = 'holiday';
        holidaysCount++;
      } else if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;

      weekDays.push({
        date: dStr,
        dayName: dayNames[i],
        status,
        holidayName: holInfo.isHoliday ? holInfo.name : null
      });
    }

    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);

    const totalClasses = present + absent + leave;
    const rate = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 100;

    const mondayFormatted = monday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const sundayFormatted = sunday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      weekRange: `${mondayFormatted} – ${sundayFormatted}`,
      logs: weekDays,
      present,
      absent,
      leave,
      holidaysCount,
      totalClasses,
      rate
    };
  }

  getStudentHistoryMonthly(rollNo, yearMonthStr) {
    const [yearStr, monthStr] = (yearMonthStr || this.getTodayDateStr().substring(0, 7)).split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const daysInMonth = new Date(year, month, 0).getDate();
    const logs = [];
    const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Day of week for the 1st day of month (0: Sun, 1: Mon, ... 6: Sat)
    // Convert to Monday-start offset (0: Mon ... 6: Sun)
    const firstDaySundayBased = new Date(year, month - 1, 1).getDay();
    const startOffsetMondayBased = firstDaySundayBased === 0 ? 6 : firstDaySundayBased - 1;

    let present = 0, absent = 0, leave = 0, holidaysCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayDate = new Date(year, month - 1, day);
      const dayName = dayNamesShort[dayDate.getDay()];

      const holInfo = this.getHolidayInfo(dStr);
      const att = this.getAttendanceForDate(dStr);
      let status = att[rollNo] || 'unmarked';

      if (holInfo.isHoliday && status === 'unmarked') {
        status = 'holiday';
        holidaysCount++;
      } else if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;

      logs.push({
        day,
        dayName,
        date: dStr,
        status,
        holidayName: holInfo.isHoliday ? holInfo.name : null
      });
    }

    const totalClasses = present + absent + leave;
    const rate = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 100;
    const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    return {
      monthName,
      startOffset: startOffsetMondayBased,
      daysInMonth,
      logs,
      present,
      absent,
      leave,
      holidaysCount,
      totalClasses,
      rate
    };
  }

  // ----------------------------------------------------
  // Clear All Data / Danger Zone Engine
  // ----------------------------------------------------
  clearAllAttendanceHistory() {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify({}));
    this.notify();
    return { success: true };
  }

  deleteAllStudents() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify({}));
    this.notify();
    return { success: true };
  }

  resetAllDataToDefault() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(DEFAULT_HOLIDAYS));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify({}));
    this.notify();
    return { success: true };
  }

  // ----------------------------------------------------
  // WhatsApp Report Formatter
  // ----------------------------------------------------
  generateWhatsAppReport(dateStr) {
    const settings = this.getSettings();
    const students = this.getStudents();
    const attendanceMap = this.getAttendanceForDate(dateStr);
    const stats = this.getStatsForDate(dateStr);
    const holInfo = this.getHolidayInfo(dateStr);

    if (holInfo.isHoliday) {
      return `🎓 *${settings.orgName}*\n📅 *Date:* ${dateStr}\n🎉 *OFFICIAL HOLIDAY:* ${holInfo.name}\n\n_No classes conducted today. Enjoy your day!_`;
    }

    const absentList = [];
    const leaveList = [];

    students.forEach(s => {
      const st = attendanceMap[s.rollNo];
      if (st === 'absent') {
        absentList.push(`• *Roll ${s.rollNo}*: ${s.name} (S/o ${s.fatherName}) - ${s.courseName}`);
      } else if (st === 'leave') {
        leaveList.push(`• *Roll ${s.rollNo}*: ${s.name} (S/o ${s.fatherName})`);
      }
    });

    let msg = `🎓 *${settings.orgName}*\n`;
    msg += `📅 *Date:* ${dateStr}\n`;
    msg += `📊 *Summary:* Total: ${stats.total} | Present: ${stats.present} ✅ | Absent: ${stats.absent} ❌ | Leave: ${stats.leave} ⏳\n`;
    msg += `📈 *Attendance Rate:* ${stats.rate}%\n`;
    msg += `--------------------------------\n`;

    if (absentList.length > 0) {
      msg += `\n❌ *ABSENT STUDENTS (${absentList.length}):*\n`;
      msg += absentList.join('\n') + '\n';
    } else {
      msg += `\n✨ *100% Attendance - All Students Present!*\n`;
    }

    if (leaveList.length > 0) {
      msg += `\n⏳ *ON LEAVE (${leaveList.length}):*\n`;
      msg += leaveList.join('\n') + '\n';
    }

    msg += `\n_Generated via Shakya Attendance System_`;
    return msg;
  }

  // ----------------------------------------------------
  // Backup & Restore
  // ----------------------------------------------------
  exportFullDataJSON() {
    return JSON.stringify({
      version: '4.5-shakya-cloud',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      students: this.getStudents(),
      attendance: this.getAllAttendanceRecords(),
      holidays: this.getHolidays()
    }, null, 2);
  }

  importFullDataJSON(jsonStr) {
    try {
      const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      if (data.students) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(normalizeArray(data.students)));
      }
      if (data.attendance && typeof data.attendance === 'object') {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data.attendance));
      }
      if (data.holidays) {
        localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(normalizeArray(data.holidays)));
      }
      if (data.settings && typeof data.settings === 'object') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      this.notify();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

window.attendanceStore = new AttendanceStore();
