import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DevFlowProvider } from './context/DevFlowContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { StudentDetailPage } from './pages/StudentDetailPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { IssuesPage } from './pages/IssuesPage';
import { BranchesPage } from './pages/BranchesPage';
import { PullRequestsPage } from './pages/PullRequestsPage';
import { CodeReviewsPage } from './pages/CodeReviewsPage';
import { ReleasesPage } from './pages/ReleasesPage';
import { TeamPage } from './pages/TeamPage';
import { ActivityLogsPage } from './pages/ActivityLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <DevFlowProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* Academic Student Management Routes */}
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentDetailPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="reports" element={<ReportsPage />} />

            {/* Collaborative GitHub Workflow Routes */}
            <Route path="repositories" element={<RepositoriesPage />} />
            <Route path="issues" element={<IssuesPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="pull-requests" element={<PullRequestsPage />} />
            <Route path="code-reviews" element={<CodeReviewsPage />} />
            <Route path="releases" element={<ReleasesPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="activities" element={<ActivityLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DevFlowProvider>
  );
}

export default App;
