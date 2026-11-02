const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('sms_auth_token') || localStorage.getItem('devflow_auth_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  async switchPersona(roleOrId) {
    const body = typeof roleOrId === 'number' ? { userId: roleOrId } : { role: roleOrId };
    const res = await fetch(`${API_BASE}/auth/switch-persona`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    return res.json();
  },

  async getAllUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  // Student Management API
  async getStudents(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/students?${q}`, { headers: getHeaders() });
    return res.json();
  },

  async getStudentById(id) {
    const res = await fetch(`${API_BASE}/students/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async createStudent(studentData) {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(studentData),
    });
    return res.json();
  },

  async updateStudent(id, studentData) {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(studentData),
    });
    return res.json();
  },

  async deleteStudent(id) {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Department Management API
  async getDepartments() {
    const res = await fetch(`${API_BASE}/departments`, { headers: getHeaders() });
    return res.json();
  },

  async getDepartmentById(id) {
    const res = await fetch(`${API_BASE}/departments/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async createDepartment(departmentData) {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(departmentData),
    });
    return res.json();
  },

  async updateDepartment(id, departmentData) {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(departmentData),
    });
    return res.json();
  },

  async deleteDepartment(id) {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Academic Reports & Analytics
  async getStudentDashboardStats() {
    const res = await fetch(`${API_BASE}/reports/dashboard-stats`, { headers: getHeaders() });
    return res.json();
  },

  async getDepartmentReport() {
    const res = await fetch(`${API_BASE}/reports/departments`, { headers: getHeaders() });
    return res.json();
  },

  async getYearReport() {
    const res = await fetch(`${API_BASE}/reports/years`, { headers: getHeaders() });
    return res.json();
  },

  getExportCsvUrl() {
    return `${API_BASE}/reports/export/students.csv`;
  },

  // Projects & Collaborative DevFlow Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/projects/dashboard-stats`, { headers: getHeaders() });
    return res.json();
  },

  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() });
    return res.json();
  },

  // Issues
  async getIssues(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/issues?${q}`, { headers: getHeaders() });
    return res.json();
  },

  async createIssue(issueData) {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(issueData),
    });
    return res.json();
  },

  async updateIssue(id, updateData) {
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    return res.json();
  },

  async closeIssue(id) {
    return this.updateIssue(id, { status: 'Closed' });
  },

  // Branches
  async getBranches() {
    const res = await fetch(`${API_BASE}/branches`, { headers: getHeaders() });
    return res.json();
  },

  async createBranch(branchData) {
    const res = await fetch(`${API_BASE}/branches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(branchData),
    });
    return res.json();
  },

  // Pull Requests
  async getPullRequests(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/pull-requests?${q}`, { headers: getHeaders() });
    return res.json();
  },

  async createPullRequest(prData) {
    const res = await fetch(`${API_BASE}/pull-requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(prData),
    });
    return res.json();
  },

  async mergePullRequest(id) {
    const res = await fetch(`${API_BASE}/pull-requests/${id}/merge`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Code Reviews
  async getCodeReviews(prId) {
    const url = prId ? `${API_BASE}/code-reviews?prId=${prId}` : `${API_BASE}/code-reviews`;
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  async submitCodeReview(reviewData) {
    const res = await fetch(`${API_BASE}/code-reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });
    return res.json();
  },

  // Releases
  async getReleases() {
    const res = await fetch(`${API_BASE}/releases`, { headers: getHeaders() });
    return res.json();
  },

  async createRelease(releaseData) {
    const res = await fetch(`${API_BASE}/releases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(releaseData),
    });
    return res.json();
  },

  // Activity Logs
  async getActivities(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/activities?${q}`, { headers: getHeaders() });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return res.json();
  },

  // GitHub Live Status
  async getGitHubStatus() {
    const res = await fetch(`${API_BASE}/github/status`, { headers: getHeaders() });
    return res.json();
  },
};
