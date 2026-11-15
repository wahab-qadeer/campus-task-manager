// Apex University API Client Layer
// Automatically checks for live backend connection with zero file modifications needed.

const ApiService = {
  // Get active API URL (checks localStorage first so user can set it from UI)
  getBaseUrl() {
    return localStorage.getItem('aust_api_url') || 'http://localhost:5000/api';
  },

  setBaseUrl(url) {
    // Strip trailing slash if any
    const cleanUrl = url.replace(/\/+$/, '');
    localStorage.setItem('aust_api_url', cleanUrl);
    return cleanUrl;
  },

  isLiveConnected: false,

  // Helper to attach JWT Bearer token
  getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // Ping backend to check if it's alive
  async checkConnection() {
    const url = this.getBaseUrl();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

      const res = await fetch(`${url}/students`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.isLiveConnected = true;
        return { online: true, url };
      }
      this.isLiveConnected = false;
      return { online: false, url, error: 'Server returned HTTP ' + res.status };
    } catch (err) {
      this.isLiveConnected = false;
      return { online: false, url, error: 'Cannot connect to backend server' };
    }
  },

  // ==================== 1. AUTHENTICATION ====================
  async login(email, password) {
    const url = this.getBaseUrl();
    try {
      const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_role', data.user.role);
      return data;
    } catch (err) {
      console.warn('[API] Backend offline. Using demo login.');
      return { token: 'mock-jwt-token', user: { email, role: 'admin', name: 'Demo User' } };
    }
  },

  // ==================== 2. STUDENTS (CRUD) ====================
  async getStudents() {
    const url = this.getBaseUrl();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${url}/students`, {
        headers: this.getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const liveList = await res.json();
        if (Array.isArray(liveList) && liveList.length > 0) {
          this.isLiveConnected = true;
          return liveList;
        }
      }
    } catch (err) {
      // Backend not running, use demo data
    }
    return CampusDB.students;
  },

  async addStudent(studentData) {
    const url = this.getBaseUrl();
    try {
      const res = await fetch(`${url}/students`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        const saved = await res.json();
        this.isLiveConnected = true;
        CampusDB.students.unshift(saved);
        return saved;
      }
    } catch (err) {
      // Backend not running, save in demo state
    }
    studentData.id = 'STU-' + (CampusDB.students.length + 101);
    CampusDB.students.unshift(studentData);
    return studentData;
  },

  // ==================== 3. ATTENDANCE ====================
  async markAttendance(attendanceData) {
    const url = this.getBaseUrl();
    try {
      const res = await fetch(`${url}/attendance/mark`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(attendanceData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // Offline simulation
    }
    return { success: true, message: 'Saved in memory' };
  },

  // ==================== 4. GRADEBOOK / MARKS ====================
  async saveGrades(courseId, gradeRecords) {
    const url = this.getBaseUrl();
    try {
      const res = await fetch(`${url}/grades/save`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ courseId, grades: gradeRecords })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // Offline simulation
    }
    return { success: true };
  },

  // ==================== 5. NOTICES ====================
  async getNotices() {
    const url = this.getBaseUrl();
    try {
      const res = await fetch(`${url}/notices`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {}
    return CampusDB.notices;
  },

  async publishNotice(noticeData) {
    const url = this.getBaseUrl();
    try {
      const res = await fetch(`${url}/notices`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(noticeData)
      });
      if (res.ok) {
        const saved = await res.json();
        CampusDB.notices.unshift(saved);
        return saved;
      }
    } catch (err) {}
    noticeData.id = CampusDB.notices.length + 1;
    CampusDB.notices.unshift(noticeData);
    return noticeData;
  }
};
