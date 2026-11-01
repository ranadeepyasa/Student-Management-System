import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DevFlowProvider } from './context/DevFlowContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
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
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
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
