/**
 * AttendEase Data Store & Auth Engine
 * Specialized for Coaching Institutes (100+ Students Scalability)
 * Tracks Roll No, Student Name, Father's Name, Contact No, Address, Batch Time, Course Name, and Photo.
 */

const STORAGE_KEYS = {
  STUDENTS: 'attendease_students',
  ATTENDANCE: 'attendease_attendance',
  SETTINGS: 'attendease_settings',
  AUTH: 'attendease_admin_auth'
};

const DEFAULT_AUTH = {
  username: 'admin',
  password: 'admin123',
  isLoggedIn: true,
  role: 'Institute Admin',
  lastLogin: null
};

const DEFAULT_SETTINGS = {
  orgName: 'Apex Coaching Institute',
  orgBranch: 'Main Campus - Academic Block',
  orgLogo: '🎓',
  orgLogoUrl: null,
  themeAccent: 'indigo',
  workingHours: '08:00 AM - 08:30 PM',
  gracePeriod: 15,
  soundFeedback: true,
  defaultBulkAction: 'present',
  remoteApiUrl: 'https://api.attendease.app/v1',
  cloudRoomId: 'APEX-COACHING-2026',
  isCloudSyncActive: false,
  courses: [
    'Class 10th Maths & Science',
    'Class 11th Science (PCM)',
    'Class 11th Science (PCB)',
    'Class 12th Physics & Chemistry',
    'Class 12th Mathematics',
    'JEE Mains & Advanced',
    'NEET Medical Batch',
    'Foundation Olympiad'
  ],
  batchTimings: [
    '08:00 AM - 10:00 AM (Morning Batch 1)',
    '10:30 AM - 12:30 PM (Morning Batch 2)',
    '04:00 PM - 06:00 PM (Evening Batch 1)',
    '06:30 PM - 08:30 PM (Evening Batch 2)'
  ]
};

const INITIAL_STUDENTS = [
  {
    id: '101',
    rollNo: '101',
    name: 'Aarav Sharma',
    fatherName: 'Rajesh Sharma',
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
    name: 'Aarav Sharma', // Same student name to demonstrate Father's Name differentiation!
    fatherName: 'Suresh Kumar Sharma',
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
    contactNo: '+91 98765 43213',
    address: '102, Kakadeo, Coaching Hub',
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
    contactNo: '+91 98765 43214',
    address: '56, Shastri Nagar',
    batchTime: '10:30 AM - 12:30 PM (Morning Batch 2)',
    courseName: 'Class 10th Maths & Science',
    email: '',
    role: 'Student',
    avatar: '👩‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-05'
  },
  {
    id: '106',
    rollNo: '106',
    name: 'Vikram Singh Verma',
    fatherName: 'Harish Verma',
    contactNo: '+91 98765 43215',
    address: '22/4, Kidwai Nagar',
    batchTime: '06:30 PM - 08:30 PM (Evening Batch 2)',
    courseName: 'NEET Medical Batch',
    email: '',
    role: 'Student',
    avatar: '👨‍🎓',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-10'
  }
];

class AttendanceStore {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    // Auto-login by default for smooth local testing
    const existingAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!existingAuth) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(DEFAULT_AUTH));
    } else {
      try {
        const parsedAuth = JSON.parse(existingAuth);
        if (!parsedAuth.isLoggedIn) {
          parsedAuth.isLoggedIn = true;
          localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(parsedAuth));
        }
      } catch (e) {}
    }

    // Auto-migrate settings
    const existingSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!existingSettings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } else {
      try {
        const parsed = JSON.parse(existingSettings);
        if (!parsed.courses || !parsed.batchTimings) {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...DEFAULT_SETTINGS, ...parsed }));
        }
      } catch (e) {}
    }

    // Auto-migrate students with Father's Name
    const existingStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!existingStudents) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    } else {
      try {
        const parsed = JSON.parse(existingStudents);
        if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].fatherName) {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
        }
      } catch (e) {}
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const dayBefore = new Date(Date.now() - 172800000).toISOString().split('T')[0];
      
      const seedAttendance = {
        [dayBefore]: {
          '101': 'present',
          '102': 'present',
          '103': 'present',
          '104': 'absent',
          '105': 'present',
          '106': 'present'
        },
        [yesterday]: {
          '101': 'present',
          '102': 'absent',
          '103': 'present',
          '104': 'present',
          '105': 'leave',
          '106': 'present'
        },
        [today]: {
          '101': 'present',
          '102': 'present',
          '103': 'leave',
          '104': 'present'
        }
      };
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(seedAttendance));
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(callback => callback());
  }

  // --- Admin Authentication Methods ---
  getAuth() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)) || DEFAULT_AUTH;
    } catch (e) {
      return DEFAULT_AUTH;
    }
  }

  isLoggedIn() {
    const auth = this.getAuth();
    return !!auth.isLoggedIn;
  }

  loginAdmin(username, password) {
    const auth = this.getAuth();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === auth.username.toLowerCase() && cleanPass === auth.password) {
      auth.isLoggedIn = true;
      auth.lastLogin = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
      this.notify();
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  }

  logoutAdmin() {
    const auth = this.getAuth();
    auth.isLoggedIn = false;
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    this.notify();
  }

  updateAdminPassword(currentPass, newPass, newUsername) {
    const auth = this.getAuth();
    if (auth.password !== currentPass.trim()) {
      return { success: false, error: 'Current password is incorrect' };
    }
    if (newPass && newPass.trim().length < 4) {
      return { success: false, error: 'New password must be at least 4 characters' };
    }

    if (newPass) auth.password = newPass.trim();
    if (newUsername && newUsername.trim()) auth.username = newUsername.trim();

    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    this.notify();
    return { success: true };
  }

  // --- Settings & Organization Logo Methods ---
  getSettings() {
    let settings = DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
      if (parsed && typeof parsed === 'object') {
        settings = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      settings = DEFAULT_SETTINGS;
    }

    if (!Array.isArray(settings.courses) || settings.courses.length === 0) {
      settings.courses = [...DEFAULT_SETTINGS.courses];
    }
    if (!Array.isArray(settings.batchTimings) || settings.batchTimings.length === 0) {
      settings.batchTimings = [...DEFAULT_SETTINGS.batchTimings];
    }

    return settings;
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  updateOrgLogo(logoUrl) {
    return this.updateSettings({ orgLogoUrl: logoUrl });
  }

  removeOrgLogo() {
    return this.updateSettings({ orgLogoUrl: null });
  }

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

  addBatch(batchStr) {
    if (!batchStr || !batchStr.trim()) return;
    const settings = this.getSettings();
    const clean = batchStr.trim();
    if (!settings.batchTimings.includes(clean)) {
      settings.batchTimings.push(clean);
      this.updateSettings({ batchTimings: settings.batchTimings });
    }
  }

  removeBatch(batchStr) {
    const settings = this.getSettings();
    settings.batchTimings = settings.batchTimings.filter(b => b !== batchStr);
    this.updateSettings({ batchTimings: settings.batchTimings });
  }

  // --- Student Methods (Scalable for 100+ Students) ---
  getStudents() {
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS));
    } catch (e) {
      list = null;
    }

    if (!Array.isArray(list) || list.length === 0) {
      list = INITIAL_STUDENTS;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }

    // Auto-normalize student fields to guarantee zero runtime exceptions
    return list.map((s, idx) => ({
      id: String(s.rollNo || s.id || (101 + idx)),
      rollNo: String(s.rollNo || s.id || (101 + idx)),
      name: s.name || 'Student ' + (101 + idx),
      fatherName: s.fatherName || 'Guardian',
      contactNo: s.contactNo || s.phone || '+91 98765 43210',
      address: s.address || 'Kanpur',
      batchTime: s.batchTime || '08:00 AM - 10:00 AM (Morning Batch 1)',
      courseName: s.courseName || s.department || 'JEE Mains & Advanced',
      email: s.email || '',
      avatar: s.avatar || '👨‍🎓',
      photoUrl: s.photoUrl || null,
      role: 'Student',
      createdAt: s.createdAt || '2026-08-01'
    }));
  }

  getCandidates() {
    return this.getStudents();
  }

  getStudentByRollNo(rollNo) {
    return this.getStudents().find(s => String(s.rollNo) === String(rollNo) || String(s.id) === String(rollNo));
  }

  getCandidateById(id) {
    return this.getStudentByRollNo(id);
  }

  addStudent(studentData) {
    const students = this.getStudents();
    
    // Generate next roll number if not specified
    let rollNo = studentData.rollNo ? String(studentData.rollNo).trim() : '';
    if (!rollNo) {
      const maxRoll = students.reduce((max, s) => {
        const num = parseInt(s.rollNo, 10);
        return (!isNaN(num) && num > max) ? num : max;
      }, 100);
      rollNo = String(maxRoll + 1);
    }

    const newStudent = {
      id: rollNo,
      rollNo: rollNo,
      name: studentData.name ? studentData.name.trim() : 'Unknown Student',
      fatherName: studentData.fatherName ? studentData.fatherName.trim() : 'Guardian',
      contactNo: studentData.contactNo ? studentData.contactNo.trim() : '',
      address: studentData.address ? studentData.address.trim() : '',
      batchTime: studentData.batchTime || '08:00 AM - 10:00 AM (Morning Batch 1)',
      courseName: studentData.courseName || 'General Coaching',
      email: studentData.email ? studentData.email.trim() : '',
      avatar: studentData.avatar || '👨‍🎓',
      photoUrl: studentData.photoUrl || null,
      role: 'Student',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Remove existing if duplicate roll number to update
    const filtered = students.filter(s => String(s.rollNo) !== rollNo);
    filtered.unshift(newStudent);

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
    this.notify();
    return newStudent;
  }

  addCandidate(data) {
    return this.addStudent(data);
  }

  deleteStudent(rollNo) {
    let students = this.getStudents();
    students = students.filter(s => String(s.rollNo) !== String(rollNo) && String(s.id) !== String(rollNo));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.notify();
  }

  deleteCandidate(id) {
    this.deleteStudent(id);
  }

  // --- Attendance Methods ---
  getAllAttendanceRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || {};
    } catch (e) {
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
    const attendance = this.getAttendanceForDate(dateStr);
    const total = students.length;

    let present = 0;
    let absent = 0;
    let leave = 0;

    students.forEach(s => {
      const status = attendance[s.rollNo];
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;
    });

    const unmarked = Math.max(0, total - (present + absent + leave));
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, leave, unmarked, rate };
  }

  // --- Specialized Single Student History Methods (Weekly & Monthly) ---
  getStudentHistoryWeekly(rollNo, anchorDateStr) {
    const all = this.getAllAttendanceRecords();
    const anchor = new Date(anchorDateStr + 'T00:00:00');
    
    // Get Monday of the week
    const day = anchor.getDay();
    const diffToMonday = anchor.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(anchor.setDate(diffToMonday));

    const weekLogs = [];
    let present = 0, absent = 0, leave = 0, totalClasses = 0;

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const dateKey = current.toISOString().split('T')[0];

      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      const status = (all[dateKey] && all[dateKey][rollNo]) || 'unmarked';

      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;

      if (status !== 'unmarked') totalClasses++;

      weekLogs.push({
        date: dateKey,
        dayName,
        status
      });
    }

    const rate = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : (present > 0 ? 100 : 0);

    return {
      weekRange: `${weekLogs[0].date} to ${weekLogs[6].date}`,
      logs: weekLogs,
      present,
      absent,
      leave,
      totalClasses,
      rate
    };
  }

  getStudentHistoryMonthly(rollNo, yearMonthStr) {
    // yearMonthStr: 'YYYY-MM'
    const all = this.getAllAttendanceRecords();
    const [year, month] = yearMonthStr.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    const monthLogs = [];
    let present = 0, absent = 0, leave = 0, totalClasses = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dd = String(d).padStart(2, '0');
      const mm = String(month).padStart(2, '0');
      const dateKey = `${year}-${mm}-${dd}`;

      const dateObj = new Date(year, month - 1, d);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const status = (all[dateKey] && all[dateKey][rollNo]) || 'unmarked';

      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;

      if (status !== 'unmarked') totalClasses++;

      monthLogs.push({
        date: dateKey,
        day: d,
        dayName,
        status
      });
    }

    const rate = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : (present > 0 ? 100 : 0);

    return {
      yearMonth: yearMonthStr,
      monthName: new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      logs: monthLogs,
      present,
      absent,
      leave,
      totalClasses,
      rate
    };
  }

  getCandidateAttendanceHistory(rollNo) {
    const all = this.getAllAttendanceRecords();
    const history = [];

    Object.keys(all).sort().reverse().forEach(date => {
      if (all[date][rollNo]) {
        history.push({
          date,
          status: all[date][rollNo]
        });
      }
    });

    return history;
  }

  // --- Cloud Room & Backup ---
  setCloudRoomId(roomId) {
    this.updateSettings({ cloudRoomId: roomId.trim() });
  }

  exportFullDataJSON() {
    const data = {
      version: '2.0.0',
      type: 'Coaching Institute Attendance',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      students: this.getStudents(),
      attendance: this.getAllAttendanceRecords()
    };
    return JSON.stringify(data, null, 2);
  }

  importFullDataJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      }
      if (parsed.students && Array.isArray(parsed.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(parsed.students));
      } else if (parsed.candidates && Array.isArray(parsed.candidates)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(parsed.candidates));
      }
      if (parsed.attendance && typeof parsed.attendance === 'object') {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(parsed.attendance));
      }
      this.notify();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// Global Store Instance
window.attendanceStore = new AttendanceStore();
