/**
 * Apex / Shakya Coaching Institute - Data Store Engine with Google Firebase Firestore
 * Features: Real-time Multi-Device Cloud Sync, Offline-first Fallback, Admin Authentication,
 * Email OTP Recovery, Candidate DOB, Batch Manager, Holiday Calendar.
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
  projectId: "shakya-attendance",
  storageBucket: "shakya-attendance.firebasestorage.app",
  messagingSenderId: "574539374438",
  appId: "1:574539374438:web:e00d262a2a6ba4aa9732a7",
  measurementId: "G-VN4F7RNWQM"
};

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

class AttendanceStore {
  constructor() {
    this.listeners = [];
    this.firestoreDb = null;
    this.cloudConnected = false;
    this.isSyncing = false;
    
    this.init();
    this.initFirebase();
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
      const today = new Date().toISOString().split('T')[0];
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
  // Google Firebase Firestore Real-Time Integration
  // ----------------------------------------------------
  initFirebase() {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.firestoreDb = firebase.firestore();
        this.cloudConnected = true;
        console.log('⚡ Firebase Cloud Firestore Initialized Successfully!');
        
        this.listenToFirestoreRealtime();
      } catch (err) {
        console.warn('Firebase init notice:', err);
      }
    } else {
      console.log('Firebase SDK running in local storage fallback mode.');
    }
  }

  listenToFirestoreRealtime() {
    if (!this.firestoreDb) return;

    try {
      const docRef = this.firestoreDb.collection('institutes').doc('shakya_attendance_data');

      // Real-time snapshot listener: any phone update reflects instantly on all devices
      docRef.onSnapshot((doc) => {
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData && !this.isSyncing) {
            if (cloudData.students && Array.isArray(cloudData.students)) {
              localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(cloudData.students));
            }
            if (cloudData.attendance && typeof cloudData.attendance === 'object') {
              localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(cloudData.attendance));
            }
            if (cloudData.holidays && Array.isArray(cloudData.holidays)) {
              localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(cloudData.holidays));
            }
            if (cloudData.settings && typeof cloudData.settings === 'object') {
              const currentSettings = this.getSettings();
              localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
                ...currentSettings,
                ...cloudData.settings,
                // keep local admin password safe
                adminPassword: currentSettings.adminPassword
              }));
            }

            localStorage.setItem(STORAGE_KEYS.LAST_CLOUD_SYNC, new Date().toISOString());
            this.listeners.forEach(fn => fn());
          }
        } else {
          // If first time, seed Firestore with initial data
          this.pushToFirestore();
        }
      }, (error) => {
        console.warn('Firestore real-time sync notice (Please ensure Firestore is created in test mode):', error);
      });
    } catch (e) {
      console.warn('Firestore listener setup exception:', e);
    }
  }

  async pushToFirestore() {
    if (!this.firestoreDb) return;

    try {
      this.isSyncing = true;
      const payload = {
        settings: this.getSettings(),
        students: this.getStudents(),
        attendance: this.getAllAttendanceRecords(),
        holidays: this.getHolidays(),
        updatedAt: new Date().toISOString(),
        cloudKey: 'SHAKYA-ACADEMY-2026'
      };

      await this.firestoreDb.collection('institutes').doc('shakya_attendance_data').set(payload, { merge: true });
      localStorage.setItem(STORAGE_KEYS.LAST_CLOUD_SYNC, new Date().toISOString());
    } catch (err) {
      console.warn('Firestore push notice:', err);
    } finally {
      setTimeout(() => {
        this.isSyncing = false;
      }, 500);
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
    this.pushToFirestore();
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
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
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
        courses: Array.isArray(s?.courses) && s.courses.length > 0 ? s.courses : DEFAULT_COURSES,
        batchTimings: Array.isArray(s?.batchTimings) && s.batchTimings.length > 0 ? s.batchTimings : DEFAULT_BATCH_TIMINGS,
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
  // Batch Timings Management (Add, Edit, Delete)
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
      return Array.isArray(h) ? h : DEFAULT_HOLIDAYS;
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
      const d = new Date(dateStr + 'T00:00:00');
      if (d.getDay() === 0) {
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
      if (!Array.isArray(data) || data.length === 0) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_STUDENTS;
      }
      return data.map(s => ({
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
      createdAt: new Date().toISOString().split('T')[0]
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

    // If Roll No changed, migrate attendance history
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
    const ref = new Date(referenceDateStr + 'T00:00:00');
    const dayOfWeek = ref.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(ref);
    monday.setDate(ref.getDate() + mondayOffset);

    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let present = 0, absent = 0, leave = 0, holidaysCount = 0;

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const dStr = current.toISOString().split('T')[0];
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

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const totalClasses = present + absent + leave;
    const rate = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 100;

    return {
      weekRange: `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
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
    const [yearStr, monthStr] = yearMonthStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const daysInMonth = new Date(year, month, 0).getDate();
    const logs = [];

    let present = 0, absent = 0, leave = 0, holidaysCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
        date: dStr,
        status,
        holidayName: holInfo.isHoliday ? holInfo.name : null
      });
    }

    const totalClasses = present + absent + leave;
    const rate = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 100;
    const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return {
      monthName,
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
      version: '4.0-firebase-cloud',
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
      if (data.students && Array.isArray(data.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      }
      if (data.attendance && typeof data.attendance === 'object') {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data.attendance));
      }
      if (data.holidays && Array.isArray(data.holidays)) {
        localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(data.holidays));
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
