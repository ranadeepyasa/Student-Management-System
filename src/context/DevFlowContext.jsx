import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { getSocket, updateSocketAuth } from '../services/socket';
import {
  INITIAL_REPOSITORIES,
  INITIAL_BRANCHES,
  INITIAL_COMMITS,
  INITIAL_ISSUES,
  INITIAL_PULL_REQUESTS,
  INITIAL_CODE_REVIEWS,
  INITIAL_RELEASES,
  INITIAL_TEAM_MEMBERS,
  INITIAL_ACTIVITIES,
  NOTIFICATIONS_DATA,
} from '../data/mockData';

const INITIAL_STUDENTS = [
  {
    id: 1,
    student_id: '24WU0104081',
    first_name: 'Ranadeep Reddy',
    last_name: 'Yasa',
    email: 'ranadeep.yasa@woxsen.edu.in',
    phone: '+91 94401 23456',
    gender: 'Male',
    department_id: 1,
    department_name: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    year_of_study: 3,
    admission_date: '2024-08-01',
    gpa: 3.92,
    status: 'Active',
    address: 'Hyderabad, Telangana, India',
    emergency_contact: '+91 98480 11223',
  },
  {
    id: 2,
    student_id: '24WU0102210',
    first_name: 'Dharan',
    last_name: 'G.',
    email: 'dharan.g@woxsen.edu.in',
    phone: '+91 94401 23457',
    gender: 'Male',
    department_id: 1,
    department_name: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    year_of_study: 3,
    admission_date: '2024-08-01',
    gpa: 3.85,
    status: 'Active',
    address: 'Secunderabad, Telangana, India',
    emergency_contact: '+91 98480 11224',
  },
  {
    id: 3,
    student_id: '24WU0102213',
    first_name: 'Rishyant',
    last_name: 'CH.',
    email: 'rishyant.ch@woxsen.edu.in',
    phone: '+91 94401 23458',
    gender: 'Male',
    department_id: 2,
    department_name: 'Artificial Intelligence & Data Science',
    course: 'B.Tech AI & Data Science',
    year_of_study: 3,
    admission_date: '2024-08-01',
    gpa: 3.88,
    status: 'Active',
    address: 'Warangal, Telangana, India',
    emergency_contact: '+91 98480 11225',
  },
  {
    id: 4,
    student_id: '24WU0102224',
    first_name: 'Abhinav',
    last_name: 'B.',
    email: 'abhinav.b@woxsen.edu.in',
    phone: '+91 94401 23459',
    gender: 'Male',
    department_id: 1,
    department_name: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    year_of_study: 3,
    admission_date: '2024-08-01',
    gpa: 3.79,
    status: 'Active',
    address: 'Karimnagar, Telangana, India',
    emergency_contact: '+91 98480 11226',
  },
  {
    id: 5,
    student_id: '24WU0101006',
    first_name: 'Muneswar Reddy',
    last_name: 'P.',
    email: 'muneswar.p@woxsen.edu.in',
    phone: '+91 94401 23460',
    gender: 'Male',
    department_id: 3,
    department_name: 'Electronics & Communication Engineering',
    course: 'B.Tech ECE',
    year_of_study: 3,
    admission_date: '2024-08-01',
    gpa: 3.81,
    status: 'Active',
    address: 'Kurnool, Andhra Pradesh, India',
    emergency_contact: '+91 98480 11227',
  },
  {
    id: 6,
    student_id: 'STU-2026-001',
    first_name: 'Aanya',
    last_name: 'Sharma',
    email: 'aanya.sharma@woxsen.edu.in',
    phone: '+91 98111 22334',
    gender: 'Female',
    department_id: 2,
    department_name: 'Artificial Intelligence & Data Science',
    course: 'B.Tech AI & Data Science',
    year_of_study: 2,
    admission_date: '2025-08-15',
    gpa: 3.95,
    status: 'Active',
    address: 'New Delhi, India',
    emergency_contact: '+91 98111 99887',
  },
  {
    id: 7,
    student_id: 'STU-2026-002',
    first_name: 'Rohan',
    last_name: 'Verma',
    email: 'rohan.verma@woxsen.edu.in',
    phone: '+91 98222 33445',
    gender: 'Male',
    department_id: 1,
    department_name: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    year_of_study: 4,
    admission_date: '2023-08-10',
    gpa: 3.65,
    status: 'Active',
    address: 'Mumbai, Maharashtra, India',
    emergency_contact: '+91 98222 88776',
  },
  {
    id: 8,
    student_id: 'STU-2026-003',
    first_name: 'Pooja',
    last_name: 'Iyer',
    email: 'pooja.iyer@woxsen.edu.in',
    phone: '+91 98333 44556',
    gender: 'Female',
    department_id: 4,
    department_name: 'Mechanical & Automation Engineering',
    course: 'B.Tech Mechanical Engineering',
    year_of_study: 1,
    admission_date: '2026-08-20',
    gpa: 3.70,
    status: 'Active',
    address: 'Chennai, Tamil Nadu, India',
    emergency_contact: '+91 98333 77665',
  },
  {
    id: 9,
    student_id: 'STU-2026-004',
    first_name: 'Karthik',
    last_name: 'Nair',
    email: 'karthik.nair@woxsen.edu.in',
    phone: '+91 98444 55667',
    gender: 'Male',
    department_id: 5,
    department_name: 'School of Business & Management',
    course: 'BBA Data Analytics',
    year_of_study: 2,
    admission_date: '2025-08-12',
    gpa: 3.55,
    status: 'Active',
    address: 'Kochi, Kerala, India',
    emergency_contact: '+91 98444 66554',
  },
  {
    id: 10,
    student_id: 'STU-2026-005',
    first_name: 'Sneha',
    last_name: 'Patel',
    email: 'sneha.patel@woxsen.edu.in',
    phone: '+91 98555 66778',
    gender: 'Female',
    department_id: 1,
    department_name: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    year_of_study: 4,
    admission_date: '2023-08-10',
    gpa: 3.40,
    status: 'Inactive',
    address: 'Ahmedabad, Gujarat, India',
    emergency_contact: '+91 98555 55443',
  },
  {
    id: 11,
    student_id: 'STU-2026-006',
    first_name: 'Aditya',
    last_name: 'Rao',
    email: 'aditya.rao@woxsen.edu.in',
    phone: '+91 98666 77889',
    gender: 'Male',
    department_id: 3,
    department_name: 'Electronics & Communication Engineering',
    course: 'B.Tech ECE',
    year_of_study: 3,
    admission_date: '2024-08-01',
    gpa: 3.30,
    status: 'Suspended',
    address: 'Bengaluru, Karnataka, India',
    emergency_contact: '+91 98666 44332',
  },
  {
    id: 12,
    student_id: 'STU-2026-007',
    first_name: 'Meera',
    last_name: 'Kapoor',
    email: 'meera.kapoor@woxsen.edu.in',
    phone: '+91 98777 88990',
    gender: 'Female',
    department_id: 2,
    department_name: 'Artificial Intelligence & Data Science',
    course: 'B.Tech AI & Data Science',
    year_of_study: 4,
    admission_date: '2022-08-01',
    gpa: 3.98,
    status: 'Graduated',
    address: 'Chandigarh, India',
    emergency_contact: '+91 98777 33221',
  },
];

const INITIAL_DEPARTMENTS = [
  {
    id: 1,
    code: 'CSE',
    name: 'Computer Science & Engineering',
    head_of_department: 'Dr. Hemachandran K',
    email: 'hod.cse@woxsen.edu.in',
    phone: '+91 98765 43210',
    building: 'Academic Block A, 3rd Floor',
    established_year: 2014,
    student_count: 5,
    active_student_count: 4,
  },
  {
    id: 2,
    code: 'AIDS',
    name: 'Artificial Intelligence & Data Science',
    head_of_department: 'Dr. Raul Villamarin Rodriguez',
    email: 'hod.ai@woxsen.edu.in',
    phone: '+91 98765 43211',
    building: 'Technology Center, 2nd Floor',
    established_year: 2018,
    student_count: 3,
    active_student_count: 2,
  },
  {
    id: 3,
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    head_of_department: 'Dr. B. Suresh',
    email: 'hod.ece@woxsen.edu.in',
    phone: '+91 98765 43212',
    building: 'Engineering Hall B, 1st Floor',
    established_year: 2015,
    student_count: 2,
    active_student_count: 1,
  },
  {
    id: 4,
    code: 'MECH',
    name: 'Mechanical & Automation Engineering',
    head_of_department: 'Dr. P. Venkatesh',
    email: 'hod.mech@woxsen.edu.in',
    phone: '+91 98765 43213',
    building: 'Robotics & Automation Complex',
    established_year: 2014,
    student_count: 1,
    active_student_count: 1,
  },
  {
    id: 5,
    code: 'MGMT',
    name: 'School of Business & Management',
    head_of_department: 'Dr. Rajesh Nair',
    email: 'hod.mgmt@woxsen.edu.in',
    phone: '+91 98765 43214',
    building: 'Management Tower, 4th Floor',
    established_year: 2014,
    student_count: 1,
    active_student_count: 1,
  },
];

const DevFlowContext = createContext(null);

export const DevFlowProvider = ({ children }) => {
  // Student Management System State
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [studentStats, setStudentStats] = useState(null);
  const [toast, setToast] = useState(null);

  // DevFlow Git Workflow State
  const [repositories, setRepositories] = useState(INITIAL_REPOSITORIES);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [commits, setCommits] = useState(INITIAL_COMMITS);
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [pullRequests, setPullRequests] = useState(INITIAL_PULL_REQUESTS);
  const [codeReviews, setCodeReviews] = useState(INITIAL_CODE_REVIEWS);
  const [releases, setReleases] = useState(INITIAL_RELEASES);
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [githubStatus, setGithubStatus] = useState(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sms_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      id: 1,
      name: 'Ranadeep Yasa',
      username: 'ranadeepyasa',
      role: 'Admin / Team Leader',
      email: 'ranadeepreddyyasa@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      status: 'online',
    };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast Helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Sync with Backend
  const refreshAllData = useCallback(async () => {
    try {
      // 1. Students
      const stdRes = await api.getStudents({ limit: 100 });
      if (stdRes.success && stdRes.data?.length > 0) {
        setStudents(stdRes.data);
      }

      // 2. Departments
      const deptRes = await api.getDepartments();
      if (deptRes.success && deptRes.data?.length > 0) {
        setDepartments(deptRes.data);
      }

      // 3. Academic Stats
      const statRes = await api.getStudentDashboardStats();
      if (statRes.success && statRes.data) {
        setStudentStats(statRes.data);
      }

      // 4. Git Dashboard stats
      const statsRes = await api.getDashboardStats();
      if (statsRes.success) {
        setDashboardStats(statsRes);
        if (statsRes.recentCommits?.length > 0) setCommits(statsRes.recentCommits);
        if (statsRes.recentActivities?.length > 0) setActivities(statsRes.recentActivities);
      }

      // 5. Issues
      const issuesRes = await api.getIssues();
      if (issuesRes.success && issuesRes.issues?.length > 0) {
        setIssues(issuesRes.issues);
      }

      // 6. Branches
      const branchesRes = await api.getBranches();
      if (branchesRes.success && branchesRes.branches?.length > 0) {
        setBranches(branchesRes.branches);
      }

      // 7. Pull Requests
      const prsRes = await api.getPullRequests();
      if (prsRes.success && prsRes.pullRequests?.length > 0) {
        setPullRequests(prsRes.pullRequests);
      }

      // 8. Releases
      const relsRes = await api.getReleases();
      if (relsRes.success && relsRes.releases?.length > 0) {
        setReleases(relsRes.releases);
      }

      // 9. GitHub Status
      const ghRes = await api.getGitHubStatus();
      if (ghRes.success) {
        setGithubStatus(ghRes);
      }
    } catch (e) {
      console.warn('[System] Backend API offline, operating in resilient local mode:', e.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAllData();

    // Socket.IO event listeners
    try {
      const socket = getSocket();
      socket.on('issue:new', (newIssue) => {
        setIssues(prev => [newIssue, ...prev]);
        refreshAllData();
      });
      socket.on('student:new', () => refreshAllData());
      socket.on('student:updated', () => refreshAllData());
      socket.on('student:deleted', () => refreshAllData());

      return () => {
        socket.off('issue:new');
        socket.off('student:new');
        socket.off('student:updated');
        socket.off('student:deleted');
      };
    } catch (err) {
      console.warn('[Socket setup]', err);
    }
  }, [refreshAllData]);

  // Student CRUD Actions
  const createStudent = async (studentData) => {
    try {
      const res = await api.createStudent(studentData);
      if (res.success) {
        setStudents(prev => [res.data, ...prev]);
        showToast(`Student ${res.data.student_id} registered successfully!`, 'success');
        refreshAllData();
        return { success: true, data: res.data };
      }
      showToast(res.error || 'Failed to create student', 'error');
      return { success: false, error: res.error };
    } catch (err) {
      // Local fallback
      const newStd = {
        ...studentData,
        id: Date.now(),
        gpa: parseFloat(studentData.gpa) || 3.5,
        year_of_study: parseInt(studentData.year_of_study, 10) || 1,
      };
      setStudents(prev => [newStd, ...prev]);
      showToast(`Student ${newStd.student_id} added (local)!`, 'success');
      return { success: true, data: newStd };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const res = await api.updateStudent(id, studentData);
      if (res.success) {
        setStudents(prev => prev.map(s => s.id === id ? res.data : s));
        showToast('Student record updated successfully!', 'success');
        refreshAllData();
        return { success: true, data: res.data };
      }
      showToast(res.error || 'Failed to update student', 'error');
      return { success: false, error: res.error };
    } catch (err) {
      // Local fallback
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...studentData } : s));
      showToast('Student record updated (local)!', 'success');
      return { success: true };
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await api.deleteStudent(id);
      if (res.success) {
        setStudents(prev => prev.filter(s => s.id !== id));
        showToast(res.message || 'Student removed successfully', 'success');
        refreshAllData();
        return { success: true };
      }
      showToast(res.error || 'Failed to delete student', 'error');
      return { success: false, error: res.error };
    } catch (err) {
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast('Student removed (local)', 'success');
      return { success: true };
    }
  };

  // Department CRUD Actions
  const createDepartment = async (deptData) => {
    try {
      const res = await api.createDepartment(deptData);
      if (res.success) {
        setDepartments(prev => [...prev, res.data]);
        showToast(`Department ${res.data.name} added successfully!`, 'success');
        refreshAllData();
        return { success: true, data: res.data };
      }
      showToast(res.error || 'Failed to create department', 'error');
      return { success: false, error: res.error };
    } catch (err) {
      const newDept = { ...deptData, id: Date.now(), student_count: 0, active_student_count: 0 };
      setDepartments(prev => [...prev, newDept]);
      showToast(`Department ${newDept.name} added (local)!`, 'success');
      return { success: true, data: newDept };
    }
  };

  const updateDepartment = async (id, deptData) => {
    try {
      const res = await api.updateDepartment(id, deptData);
      if (res.success) {
        setDepartments(prev => prev.map(d => d.id === id ? res.data : d));
        showToast('Department details updated!', 'success');
        refreshAllData();
        return { success: true, data: res.data };
      }
      showToast(res.error || 'Failed to update department', 'error');
      return { success: false, error: res.error };
    } catch (err) {
      setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...deptData } : d));
      showToast('Department updated (local)!', 'success');
      return { success: true };
    }
  };

  const deleteDepartment = async (id) => {
    try {
      const res = await api.deleteDepartment(id);
      if (res.success) {
        setDepartments(prev => prev.filter(d => d.id !== id));
        showToast('Department deleted successfully', 'success');
        refreshAllData();
        return { success: true };
      }
      showToast(res.error || 'Cannot delete department', 'error');
      return { success: false, error: res.error };
    } catch (err) {
      setDepartments(prev => prev.filter(d => d.id !== id));
      showToast('Department deleted (local)', 'success');
      return { success: true };
    }
  };

  // Auth Actions
  const loginUser = async (identifier, password) => {
    try {
      const res = await api.login(identifier, password);
      if (res.success) {
        localStorage.setItem('sms_auth_token', res.token);
        localStorage.setItem('devflow_auth_token', res.token);
        localStorage.setItem('sms_current_user', JSON.stringify(res.user));
        updateSocketAuth(res.token);
        setCurrentUser({
          ...res.user,
          avatar: res.user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
          handle: res.user.username,
        });
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        refreshAllData();
        return { success: true };
      }
      showToast(res.error || 'Invalid credentials', 'error');
      return { success: false, error: res.error };
    } catch (e) {
      showToast('Authentication error: ' + e.message, 'error');
      return { success: false, error: e.message };
    }
  };

  const switchUserPersona = async (member) => {
    try {
      const res = await api.switchPersona(member.role || member.id);
      if (res.success) {
        localStorage.setItem('sms_auth_token', res.token);
        localStorage.setItem('devflow_auth_token', res.token);
        localStorage.setItem('sms_current_user', JSON.stringify(res.user));
        updateSocketAuth(res.token);
        setCurrentUser({
          ...res.user,
          avatar: res.user.avatar_url,
          handle: res.user.username,
        });
        showToast(`Switched persona to ${res.user.name} (${res.user.role})`, 'success');
        refreshAllData();
        return { success: true };
      }
    } catch (e) {
      setCurrentUser({
        ...member,
        avatar: member.avatar || member.avatar_url,
        handle: member.username || member.handle,
      });
      showToast(`Switched persona to ${member.name}`, 'info');
    }
  };

  const logout = () => {
    localStorage.removeItem('sms_auth_token');
    localStorage.removeItem('devflow_auth_token');
    localStorage.removeItem('sms_current_user');
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  // Git & DevFlow Actions
  const addRepository = (repoData) => {
    const newRepo = {
      id: Date.now(),
      name: repoData.name,
      description: repoData.description,
      language: repoData.language || 'JavaScript',
      stars: 0,
      forks: 0,
      openIssues: 0,
      updatedAt: 'Just now',
      isPrivate: repoData.isPrivate || false,
    };
    setRepositories([newRepo, ...repositories]);
    showToast(`Repository ${repoData.name} created!`, 'success');
  };

  const addIssue = async (issueData) => {
    try {
      const res = await api.createIssue(issueData);
      if (res.success) {
        setIssues(prev => [res.issue, ...prev]);
        showToast('Issue created and synchronized!', 'success');
        refreshAllData();
        return;
      }
    } catch {
      // Fallback
    }
    const newIssue = {
      id: Date.now(),
      number: issues.length + 1,
      title: issueData.title,
      description: issueData.description,
      status: 'Open',
      priority: issueData.priority || 'Medium',
      labels: issueData.labels || ['enhancement'],
      assignee: currentUser,
      createdAt: 'Just now',
    };
    setIssues([newIssue, ...issues]);
    showToast('Issue created locally!', 'success');
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await api.updateIssue(issueId, { status: newStatus });
      refreshAllData();
    } catch {
      setIssues(issues.map(i => (i.id === issueId ? { ...i, status: newStatus } : i)));
    }
    showToast(`Issue status changed to ${newStatus}`, 'info');
  };

  const addBranch = async (branchData) => {
    try {
      const res = await api.createBranch(branchData);
      if (res.success) {
        setBranches(prev => [res.branch, ...prev]);
        showToast(`Branch ${branchData.name} created!`, 'success');
        refreshAllData();
        return;
      }
    } catch {
      // Fallback
    }
    const newBranch = {
      id: Date.now(),
      name: branchData.name,
      baseBranch: branchData.baseBranch || 'main',
      isDefault: false,
      isProtected: false,
      lastCommit: {
        hash: 'a1b2c3d',
        message: `Branch created from ${branchData.baseBranch || 'main'}`,
        author: currentUser.name,
        time: 'Just now',
      },
    };
    setBranches([...branches, newBranch]);
    showToast(`Branch ${branchData.name} created!`, 'success');
  };

  const addPullRequest = async (prData) => {
    try {
      const res = await api.createPullRequest(prData);
      if (res.success) {
        setPullRequests(prev => [res.pullRequest, ...prev]);
        showToast(`Pull Request #${res.pullRequest.number} submitted!`, 'success');
        refreshAllData();
        return;
      }
    } catch {
      // Fallback
    }
    const newPr = {
      id: Date.now(),
      number: pullRequests.length + 1,
      title: prData.title,
      description: prData.description,
      status: 'Open',
      sourceBranch: prData.sourceBranch,
      targetBranch: prData.targetBranch || 'main',
      author: currentUser,
      additions: 120,
      deletions: 15,
      createdAt: 'Just now',
    };
    setPullRequests([newPr, ...pullRequests]);
    showToast(`Pull Request #${newPr.number} submitted!`, 'success');
  };

  const addRelease = async (releaseData) => {
    try {
      const res = await api.createRelease(releaseData);
      if (res.success) {
        setReleases(prev => [res.release, ...prev]);
        showToast(`Release ${releaseData.tagName} published!`, 'success');
        refreshAllData();
        return;
      }
    } catch {
      // Fallback
    }
    const newRelease = {
      id: Date.now(),
      tagName: releaseData.tagName,
      name: releaseData.name,
      description: releaseData.description,
      publishedAt: 'Just now',
      author: currentUser,
      targetBranch: releaseData.targetBranch || 'main',
      downloads: 0,
      isDraft: releaseData.isDraft || false,
      isPrerelease: releaseData.isPrerelease || false,
    };
    setReleases([newRelease, ...releases]);
    showToast(`Release ${newRelease.tagName} published!`, 'success');
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const resetToDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    setDepartments(INITIAL_DEPARTMENTS);
    setRepositories(INITIAL_REPOSITORIES);
    setBranches(INITIAL_BRANCHES);
    setCommits(INITIAL_COMMITS);
    setIssues(INITIAL_ISSUES);
    setPullRequests(INITIAL_PULL_REQUESTS);
    setCodeReviews(INITIAL_CODE_REVIEWS);
    setReleases(INITIAL_RELEASES);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(NOTIFICATIONS_DATA);
    showToast('Reset state to factory defaults.', 'info');
  };

  return (
    <DevFlowContext.Provider
      value={{
        // Student Management
        students,
        departments,
        studentStats,
        toast,
        showToast,
        createStudent,
        updateStudent,
        deleteStudent,
        createDepartment,
        updateDepartment,
        deleteDepartment,

        // Git Workflow & Repositories
        repositories,
        branches,
        commits,
        issues,
        pullRequests,
        codeReviews,
        releases,
        teamMembers,
        activities,
        notifications,
        dashboardStats,
        githubStatus,

        // Auth
        currentUser,
        setCurrentUser,
        loginUser,
        switchUserPersona,
        logout,

        // Navigation & Modals
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isHelpOpen,
        setIsHelpOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,

        // Actions
        addRepository,
        addIssue,
        updateIssueStatus,
        addBranch,
        addPullRequest,
        addRelease,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaults,
        refreshAllData,
      }}
    >
      {children}
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium ${
              toast.type === 'error' ? 'bg-white text-red-700 border-red-300' : 'bg-white text-orange-950 border-orange-300'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-xs opacity-75 hover:opacity-100 underline ml-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </DevFlowContext.Provider>
  );
};

export const useDevFlow = () => {
  const context = useContext(DevFlowContext);
  if (!context) {
    throw new Error('useDevFlow must be used within a DevFlowProvider');
  }
  return context;
};
