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

const DevFlowContext = createContext(null);

export const DevFlowProvider = ({ children }) => {
  // Local state with seed fallback
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
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Ranadeep Yasa',
    username: 'ranadeepyasa',
    role: 'Lead & Pull Requests Manager',
    email: 'ranadeepreddyyasa@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    status: 'online',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync with Backend
  const refreshAllData = useCallback(async () => {
    try {
      // 1. Dashboard stats
      const statsRes = await api.getDashboardStats();
      if (statsRes.success) {
        setDashboardStats(statsRes);
        if (statsRes.recentCommits?.length > 0) {
          setCommits(statsRes.recentCommits);
        }
        if (statsRes.recentActivities?.length > 0) {
          setActivities(statsRes.recentActivities);
        }
      }

      // 2. Issues
      const issuesRes = await api.getIssues();
      if (issuesRes.success && issuesRes.issues?.length > 0) {
        setIssues(issuesRes.issues);
      }

      // 3. Branches
      const branchesRes = await api.getBranches();
      if (branchesRes.success && branchesRes.branches?.length > 0) {
        setBranches(branchesRes.branches);
      }

      // 4. Pull Requests
      const prsRes = await api.getPullRequests();
      if (prsRes.success && prsRes.pullRequests?.length > 0) {
        setPullRequests(prsRes.pullRequests);
      }

      // 5. Code Reviews
      const revsRes = await api.getReviews();
      if (revsRes.success && revsRes.reviews?.length > 0) {
        setCodeReviews(revsRes.reviews);
      }

      // 6. Releases
      const relsRes = await api.getReleases();
      if (relsRes.success && relsRes.releases?.length > 0) {
        setReleases(relsRes.releases);
      }

      // 7. Team Members
      const usersRes = await api.getAllUsers();
      if (usersRes.success && usersRes.users?.length > 0) {
        setTeamMembers(usersRes.users.map(u => ({
          ...u,
          avatar: u.avatar_url,
          handle: u.username,
        })));
      }

      // 8. Notifications
      const notifsRes = await api.getNotifications();
      if (notifsRes.success && notifsRes.notifications?.length > 0) {
        setNotifications(notifsRes.notifications.map(n => ({
          id: n.id,
          title: n.title,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: !n.is_read,
          type: n.type,
          repo: 'Student-Management-System',
        })));
      }

      // 9. GitHub Status
      const ghRes = await api.getGitHubStatus();
      if (ghRes.success) {
        setGithubStatus(ghRes);
      }
    } catch (e) {
      console.warn('[DevFlow] Backend API unreachable, operating in resilient local mode:', e.message);
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

      socket.on('issue:updated', (updatedIssue) => {
        setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i));
        refreshAllData();
      });

      socket.on('branch:new', (newBranch) => {
        setBranches(prev => [newBranch, ...prev]);
        refreshAllData();
      });

      socket.on('pr:new', (newPr) => {
        setPullRequests(prev => [newPr, ...prev]);
        refreshAllData();
      });

      socket.on('pr:updated', (updatedPr) => {
        setPullRequests(prev => prev.map(p => p.id === updatedPr.id ? updatedPr : p));
        refreshAllData();
      });

      socket.on('review:new', (newReview) => {
        setCodeReviews(prev => [newReview, ...prev]);
        refreshAllData();
      });

      socket.on('release:new', (newRelease) => {
        setReleases(prev => [newRelease, ...prev]);
        refreshAllData();
      });

      socket.on('notification:new', (newNotif) => {
        setNotifications(prev => [
          {
            id: Date.now(),
            title: newNotif.title,
            time: 'Just now',
            unread: true,
            type: newNotif.type,
            repo: 'DevFlow',
          },
          ...prev,
        ]);
      });

      return () => {
        socket.off('issue:new');
        socket.off('issue:updated');
        socket.off('branch:new');
        socket.off('pr:new');
        socket.off('pr:updated');
        socket.off('review:new');
        socket.off('release:new');
        socket.off('notification:new');
      };
    } catch (err) {
      console.warn('[Socket setup]', err);
    }
  }, [refreshAllData]);

  // Auth Actions
  const loginUser = async (identifier, password) => {
    try {
      const res = await api.login(identifier, password);
      if (res.success) {
        localStorage.setItem('devflow_auth_token', res.token);
        updateSocketAuth(res.token);
        setCurrentUser({
          ...res.user,
          avatar: res.user.avatar_url,
          handle: res.user.username,
        });
        refreshAllData();
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const switchUserPersona = async (member) => {
    try {
      const res = await api.switchPersona(member.role || member.id);
      if (res.success) {
        localStorage.setItem('devflow_auth_token', res.token);
        updateSocketAuth(res.token);
        setCurrentUser({
          ...res.user,
          avatar: res.user.avatar_url,
          handle: res.user.username,
        });
        refreshAllData();
        return { success: true };
      }
    } catch (e) {
      // Local fallback
      setCurrentUser({
        ...member,
        avatar: member.avatar || member.avatar_url,
        handle: member.username || member.handle,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('devflow_auth_token');
    updateSocketAuth('');
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  // Entity Handlers
  const addRepository = async (newRepo) => {
    setRepositories(prev => [newRepo, ...prev]);
  };

  const addIssue = async (newIssue) => {
    try {
      const res = await api.createIssue(newIssue);
      if (res.success) {
        setIssues(prev => [res.issue, ...prev]);
        refreshAllData();
        return res.issue;
      }
    } catch (e) {
      // Fallback local
      const localIssue = {
        id: Date.now(),
        issue_number: Math.floor(Math.random() * 50) + 105,
        title: newIssue.title,
        description: newIssue.description || newIssue.body,
        priority: newIssue.priority || 'Medium',
        status: 'Open',
        labels: Array.isArray(newIssue.labels) ? newIssue.labels.join(', ') : newIssue.labels,
        assignee_name: currentUser?.name,
        created_at: new Date().toISOString(),
      };
      setIssues(prev => [localIssue, ...prev]);
      return localIssue;
    }
  };

  const updateIssueStatus = async (id, newStatus) => {
    try {
      await api.updateIssue(id, { status: newStatus });
      refreshAllData();
    } catch (e) {
      setIssues(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    }
  };

  const addBranch = async (newBranch) => {
    try {
      const res = await api.createBranch(newBranch);
      if (res.success) {
        setBranches(prev => [res.branch, ...prev]);
        refreshAllData();
        return res.branch;
      }
    } catch (e) {
      const localBranch = {
        id: Date.now(),
        name: newBranch.name,
        base_branch: newBranch.base_branch || 'main',
        last_commit_sha: Math.random().toString(16).substring(2, 9),
        last_commit_message: `Initialize branch ${newBranch.name}`,
        author_name: currentUser?.name,
      };
      setBranches(prev => [localBranch, ...prev]);
      return localBranch;
    }
  };

  const addPullRequest = async (newPR) => {
    try {
      const res = await api.createPullRequest(newPR);
      if (res.success) {
        setPullRequests(prev => [res.pullRequest, ...prev]);
        refreshAllData();
        return res.pullRequest;
      }
    } catch (e) {
      const localPR = {
        id: Date.now(),
        pr_number: Math.floor(Math.random() * 50) + 10,
        title: newPR.title,
        description: newPR.description,
        source_branch: newPR.source_branch || newPR.sourceBranch,
        target_branch: newPR.target_branch || newPR.targetBranch || 'main',
        status: 'Open',
        author_name: currentUser?.name,
        additions: 35,
        deletions: 8,
      };
      setPullRequests(prev => [localPR, ...prev]);
      return localPR;
    }
  };

  const addRelease = async (newRelease) => {
    try {
      const res = await api.createRelease(newRelease);
      if (res.success) {
        setReleases(prev => [res.release, ...prev]);
        refreshAllData();
        return res.release;
      }
    } catch (e) {
      const localRelease = {
        id: Date.now(),
        tag_name: newRelease.tag_name || newRelease.tag,
        name: newRelease.name,
        description: newRelease.description,
        published_by_name: currentUser?.name,
        downloads_count: 0,
      };
      setReleases(prev => [localRelease, ...prev]);
      return localRelease;
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
    } catch (e) {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
    } catch (e) {}
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const resetToDefaults = async () => {
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
  };

  return (
    <DevFlowContext.Provider
      value={{
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
        currentUser,
        setCurrentUser,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isHelpOpen,
        setIsHelpOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        switchUserPersona,
        logout,
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
