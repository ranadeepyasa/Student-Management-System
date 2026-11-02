import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, Users, AlertCircle, GitPullRequest } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { useDevFlow } from '../../context/DevFlowContext';

export const StatCardsGrid = () => {
  const navigate = useNavigate();
  const { dashboardStats, repositories, teamMembers, issues, pullRequests } = useDevFlow();

  const totalRepos = dashboardStats?.stats?.totalProjects ?? repositories?.length ?? 1;
  const activeDevs = dashboardStats?.stats?.activeDevelopers ?? 5;
  const totalDevs = dashboardStats?.stats?.totalDevelopers ?? teamMembers?.length ?? 5;
  const openIssues = dashboardStats?.stats?.openIssues ?? issues?.filter((i) => i.status !== 'Closed' && i.status !== 'closed')?.length ?? 4;
  const pendingPrs = dashboardStats?.stats?.pendingPrs ?? pullRequests?.filter((p) => p.status === 'Open' || p.status === 'open')?.length ?? 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Projects / Repos"
        value={totalRepos}
        subtitle="1 primary GitHub repository"
        icon={FolderGit2}
        iconBg="bg-orange-50 text-orange-600"
        trend="Database Synced"
        trendDirection="up"
        onClick={() => navigate('/repositories')}
      />

      <StatCard
        title="Active Developers"
        value={`${activeDevs} / ${totalDevs}`}
        subtitle="5-role concurrent laptop simulation"
        icon={Users}
        iconBg="bg-orange-50 text-orange-600"
        trend="100% online"
        trendDirection="up"
        onClick={() => navigate('/team')}
      />

      <StatCard
        title="Open Issues"
        value={openIssues}
        subtitle="Active bugs & feature requests"
        icon={AlertCircle}
        iconBg="bg-orange-50 text-orange-600"
        trend="High priority tracked"
        trendDirection="up"
        onClick={() => navigate('/issues')}
      />

      <StatCard
        title="Pending Pull Requests"
        value={pendingPrs}
        subtitle="Awaiting peer review & merge"
        icon={GitPullRequest}
        iconBg="bg-orange-50 text-orange-600"
        trend="Strict review mode"
        trendDirection="up"
        onClick={() => navigate('/pull-requests')}
      />
    </div>
  );
};
