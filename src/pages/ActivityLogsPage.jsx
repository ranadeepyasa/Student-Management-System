import React, { useState, useEffect } from 'react';
import {
  Activity,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Tag,
  GitBranch,
  CheckCircle2,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useDevFlow } from '../context/DevFlowContext';
import { api } from '../services/api';

export const ActivityLogsPage = () => {
  const { activities: contextActivities } = useDevFlow();
  const [activities, setActivities] = useState(contextActivities || []);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await api.getActivities({ actionType: filterType });
      if (data.success && data.activities.length > 0) {
        setActivities(data.activities);
      }
    } catch (e) {
      console.warn('Using local context activities fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filterType]);

  const getActionBadge = (type) => {
    switch (type) {
      case 'commit':
        return <Badge variant="blue" size="xs">Commit</Badge>;
      case 'issue_created':
      case 'issue_updated':
        return <Badge variant="red" size="xs">Issue</Badge>;
      case 'branch_created':
        return <Badge variant="green" size="xs">Branch</Badge>;
      case 'pr_opened':
      case 'pr_merged':
        return <Badge variant="purple" size="xs">Pull Request</Badge>;
      case 'review_submitted':
        return <Badge variant="green" size="xs">Code Review</Badge>;
      case 'release_published':
      case 'release':
        return <Badge variant="orange" size="xs">Release</Badge>;
      default:
        return <Badge variant="gray" size="xs">Action</Badge>;
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-3.5 h-3.5 text-orange-600" />;
      case 'issue_created':
      case 'issue_updated':
        return <AlertCircle className="w-3.5 h-3.5 text-[#cf222e]" />;
      case 'branch_created':
        return <GitBranch className="w-3.5 h-3.5 text-[#1a7f37]" />;
      case 'pr_opened':
      case 'pr_merged':
        return <GitPullRequest className="w-3.5 h-3.5 text-[#8250df]" />;
      case 'review_submitted':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#1a7f37]" />;
      case 'release_published':
      case 'release':
        return <Tag className="w-3.5 h-3.5 text-[#bc4c00]" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Activity Logs' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Team Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Audit trail of team commits, issues, PR merges, reviews, and releases
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            icon={RefreshCw}
            onClick={fetchActivities}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-[#656d76]" />
        <span className="text-[#656d76] font-medium">Filter by Action:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white border border-[#d0d7de] px-2.5 py-1.5 rounded-md text-[#1f2328] font-medium outline-none"
        >
          <option value="all">All Activities</option>
          <option value="commit">Commits</option>
          <option value="issue_created">Issues Created</option>
          <option value="branch_created">Branches Created</option>
          <option value="pr_opened">PRs Opened</option>
          <option value="review_submitted">Code Reviews</option>
          <option value="release_published">Releases Published</option>
        </select>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-lg border border-[#d0d7de] divide-y divide-[#d0d7de]">
        {activities.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#656d76] space-y-2">
            <Activity className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No activity logged matching filter</p>
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="p-4 hover:bg-slate-50/70 transition-colors flex items-start gap-3.5 text-xs"
            >
              <div className="p-2 rounded-md bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                {getActionIcon(act.action_type || act.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#1f2328]">
                    {act.user_name || act.user}
                  </span>
                  {act.user_role && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      ({act.user_role})
                    </span>
                  )}
                  {getActionBadge(act.action_type || act.type)}
                  <span className="font-semibold text-orange-600 truncate">
                    {act.target_name || act.target}
                  </span>
                </div>

                <p className="text-[#656d76]">
                  {act.description || act.detail}
                </p>

                <div className="text-[10px] text-slate-400">
                  {act.created_at ? new Date(act.created_at).toLocaleString() : act.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
