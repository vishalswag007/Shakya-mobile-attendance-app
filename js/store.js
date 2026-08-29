/**
 * AttendEase Data Store & Auth Engine
 * Handles Candidate Photos, Organization Logo, Admin Authentication,
 * 3D Badges, Customization Settings, and Multi-Device Cloud Sync.
 */

const STORAGE_KEYS = {
  CANDIDATES: 'attendease_candidates',
  ATTENDANCE: 'attendease_attendance',
  SETTINGS: 'attendease_settings',
  AUTH: 'attendease_admin_auth'
};

const DEFAULT_AUTH = {
  username: 'admin',
  password: 'admin123',
  isLoggedIn: false,
  role: 'Super Admin',
  lastLogin: null
};

const DEFAULT_SETTINGS = {
  orgName: 'AttendEase Systems',
  orgBranch: 'HQ - Silicon Campus',
  orgLogo: '⚡',
  orgLogoUrl: null, // Custom uploaded logo image
  themeAccent: 'indigo',
  workingHours: '09:00 - 18:00',
  gracePeriod: 15,
  soundFeedback: true,
  defaultBulkAction: 'present',
  remoteApiUrl: 'https://api.attendease.app/v1',
  cloudRoomId: 'GLOBAL-CAMPUS-2026',
  isCloudSyncActive: false,
  departments: [
    'Engineering',
    'Product & Design',
    'Quality Assurance',
    'Human Resources',
    'Marketing',
    'Finance',
    'Operations'
  ]
};

const INITIAL_CANDIDATES = [
  {
    id: 'CAN-101',
    name: 'Aarav Sharma',
    department: 'Engineering',
    role: 'Full Stack Dev',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    avatar: '👨‍💻',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01'
  },
  {
    id: 'CAN-102',
    name: 'Priya Patel',
    department: 'Product & Design',
    role: 'UI/UX Designer',
    email: 'priya.patel@example.com',
    phone: '+91 98765 43211',
    avatar: '👩‍🎨',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-02'
  },
  {
    id: 'CAN-103',
    name: 'Rohan Mehta',
    department: 'Engineering',
    role: 'Backend Architect',
    email: 'rohan.mehta@example.com',
    phone: '+91 98765 43212',
    avatar: '👨‍💼',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-03'
  },
  {
    id: 'CAN-104',
    name: 'Ananya Gupta',
    department: 'Quality Assurance',
    role: 'QA Engineer',
    email: 'ananya.gupta@example.com',
    phone: '+91 98765 43213',
    avatar: '👩‍💻',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-05'
  },
  {
    id: 'CAN-105',
    name: 'Vikram Verma',
    department: 'Human Resources',
    role: 'HR Specialist',
    email: 'vikram.verma@example.com',
    phone: '+91 98765 43214',
    avatar: '🧑‍💼',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-10'
  },
  {
    id: 'CAN-106',
    name: 'Sneha Reddy',
    department: 'Marketing',
    role: 'Content Strategist',
    email: 'sneha.reddy@example.com',
    phone: '+91 98765 43215',
    avatar: '👩‍💼',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-12'
  }
];

class AttendanceStore {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(DEFAULT_AUTH));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_CANDIDATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      const seedAttendance = {
        [yesterday]: {
          'CAN-101': 'present',
          'CAN-102': 'present',
          'CAN-103': 'absent',
          'CAN-104': 'present',
          'CAN-105': 'leave',
          'CAN-106': 'present'
        },
        [today]: {
          'CAN-101': 'present',
          'CAN-102': 'present',
          'CAN-103': 'leave'
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
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
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

  addDepartment(deptName) {
    if (!deptName || !deptName.trim()) return;
    const settings = this.getSettings();
    const clean = deptName.trim();
    if (!settings.departments.includes(clean)) {
      settings.departments.push(clean);
      this.updateSettings({ departments: settings.departments });
    }
  }

  removeDepartment(deptName) {
    const settings = this.getSettings();
    settings.departments = settings.departments.filter(d => d !== deptName);
    this.updateSettings({ departments: settings.departments });
  }

  // --- Candidate Methods ---
  getCandidates() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES)) || [];
    } catch (e) {
      return [];
    }
  }

  getCandidateById(id) {
    return this.getCandidates().find(c => c.id === id);
  }

  addCandidate(candidateData) {
    const candidates = this.getCandidates();
    const newCandidate = {
      id: candidateData.id ? candidateData.id.trim() : `CAN-${Math.floor(100 + Math.random() * 900)}`,
      name: candidateData.name.trim(),
      department: candidateData.department || 'General',
      role: candidateData.role || 'Member',
      email: candidateData.email || '',
      phone: candidateData.phone || '',
      avatar: candidateData.avatar || '👤',
      photoUrl: candidateData.photoUrl || null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    candidates.unshift(newCandidate);
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    this.notify();
    return newCandidate;
  }

  deleteCandidate(id) {
    let candidates = this.getCandidates();
    candidates = candidates.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    this.notify();
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

  markAttendance(candidateId, dateStr, status) {
    const all = this.getAllAttendanceRecords();
    if (!all[dateStr]) {
      all[dateStr] = {};
    }
    
    if (all[dateStr][candidateId] === status) {
      delete all[dateStr][candidateId];
    } else {
      all[dateStr][candidateId] = status;
    }

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    this.notify();
    return all[dateStr][candidateId] || 'unmarked';
  }

  markAllAttendance(dateStr, status) {
    const all = this.getAllAttendanceRecords();
    if (!all[dateStr]) {
      all[dateStr] = {};
    }

    const candidates = this.getCandidates();
    candidates.forEach(c => {
      all[dateStr][c.id] = status;
    });

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    this.notify();
  }

  getStatsForDate(dateStr) {
    const candidates = this.getCandidates();
    const attendance = this.getAttendanceForDate(dateStr);
    const total = candidates.length;

    let present = 0;
    let absent = 0;
    let leave = 0;

    Object.values(attendance).forEach(status => {
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;
    });

    const unmarked = Math.max(0, total - (present + absent + leave));
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, leave, unmarked, rate };
  }

  getCandidateAttendanceHistory(candidateId) {
    const all = this.getAllAttendanceRecords();
    const history = [];

    Object.keys(all).sort().reverse().forEach(date => {
      if (all[date][candidateId]) {
        history.push({
          date,
          status: all[date][candidateId]
        });
      }
    });

    return history;
  }

  // --- Multi-Device Cloud Room ---
  setCloudRoomId(roomId) {
    this.updateSettings({ cloudRoomId: roomId.trim() });
  }

  // --- Backup & Restore ---
  exportFullDataJSON() {
    const data = {
      version: '1.4.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      candidates: this.getCandidates(),
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
      if (parsed.candidates && Array.isArray(parsed.candidates)) {
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(parsed.candidates));
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
