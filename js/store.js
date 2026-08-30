/**
 * Apex Coaching Institute - Data Store Engine
 * Features: LocalStorage Cache, Cloud Sync, Multi-Device Replication,
 * WhatsApp Report Generator, and Detailed Student Attendance Analytics.
 */

const STORAGE_KEYS = {
  STUDENTS: 'apex_students',
  ATTENDANCE: 'apex_attendance',
  SETTINGS: 'apex_settings',
  CLOUD_SYNC: 'apex_cloud_sync_config'
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

const DEFAULT_SETTINGS = {
  orgName: 'Apex Coaching Institute',
  orgBranch: 'Main Academic Campus',
  orgLogo: '🎓',
  orgLogoUrl: null,
  academicYear: '2026-2027',
  courses: DEFAULT_COURSES,
  batchTimings: DEFAULT_BATCH_TIMINGS,
  cloudSyncUrl: '', // Free Firebase or REST API Endpoint for multi-phone sync
  lastCloudSyncTime: null
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
    name: 'Aarav Sharma', // Duplicate name to prove Father's Name differentiation
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
    this.init();
    this.startAutoCloudSync();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
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

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
    this.dispatchCloudSync();
  }

  // ----------------------------------------------------
  // Settings Management
  // ----------------------------------------------------
  getSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
      return {
        ...DEFAULT_SETTINGS,
        ...s,
        courses: Array.isArray(s?.courses) && s.courses.length > 0 ? s.courses : DEFAULT_COURSES,
        batchTimings: Array.isArray(s?.batchTimings) && s.batchTimings.length > 0 ? s.batchTimings : DEFAULT_BATCH_TIMINGS
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
  // Students Management
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
        fatherName: s.fatherName || s.department || 'Not Provided',
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
    const dayOfWeek = ref.getDay(); // 0 is Sunday
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(ref);
    monday.setDate(ref.getDate() + mondayOffset);

    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let present = 0, absent = 0, leave = 0, unmarked = 0;

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const dStr = current.toISOString().split('T')[0];
      const att = this.getAttendanceForDate(dStr);
      const status = att[rollNo] || 'unmarked';

      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;
      else unmarked++;

      weekDays.push({
        date: dStr,
        dayName: dayNames[i],
        status
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
      totalClasses,
      rate
    };
  }

  getStudentHistoryMonthly(rollNo, yearMonthStr) {
    const [yearStr, monthStr] = yearMonthStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1-12

    const daysInMonth = new Date(year, month, 0).getDate();
    const logs = [];

    let present = 0, absent = 0, leave = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const att = this.getAttendanceForDate(dStr);
      const status = att[rollNo] || 'unmarked';

      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;

      logs.push({
        day,
        date: dStr,
        status
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
      msg += `\n✨ *100% Attendance - No Absentees!*\n`;
    }

    if (leaveList.length > 0) {
      msg += `\n⏳ *ON LEAVE (${leaveList.length}):*\n`;
      msg += leaveList.join('\n') + '\n';
    }

    msg += `\n_Generated via Apex Attendance System_`;
    return msg;
  }

  // ----------------------------------------------------
  // Cloud Database Sync Engine (Multi-Device Anywhere)
  // ----------------------------------------------------
  async dispatchCloudSync() {
    const settings = this.getSettings();
    if (!settings.cloudSyncUrl || !settings.cloudSyncUrl.startsWith('http')) return;

    try {
      const payload = {
        settings,
        students: this.getStudents(),
        attendance: this.getAllAttendanceRecords(),
        lastSync: new Date().toISOString()
      };

      await fetch(settings.cloudSyncUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('Cloud sync completed successfully');
    } catch (err) {
      console.warn('Cloud sync offline / failed:', err);
    }
  }

  async pullFromCloud() {
    const settings = this.getSettings();
    if (!settings.cloudSyncUrl || !settings.cloudSyncUrl.startsWith('http')) return false;

    try {
      const res = await fetch(settings.cloudSyncUrl);
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.students && data.attendance) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data.attendance));
        if (data.settings) {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...DEFAULT_SETTINGS, ...data.settings }));
        }
        this.notify();
        return true;
      }
    } catch (err) {
      console.warn('Cloud pull failed:', err);
    }
    return false;
  }

  startAutoCloudSync() {
    // Poll cloud every 30 seconds if configured
    setInterval(() => {
      this.pullFromCloud();
    }, 30000);
  }

  // ----------------------------------------------------
  // Backup & Restore
  // ----------------------------------------------------
  exportFullDataJSON() {
    return JSON.stringify({
      version: '2.0-coaching',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      students: this.getStudents(),
      attendance: this.getAllAttendanceRecords()
    }, null, 2);
  }

  importFullDataJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.students && Array.isArray(data.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      }
      if (data.attendance && typeof data.attendance === 'object') {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data.attendance));
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
