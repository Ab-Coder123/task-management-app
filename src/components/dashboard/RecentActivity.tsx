import React from 'react';
import { formatDate } from '@/lib/utils';
import { User, CheckSquare, MessageSquare, UserCheck } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'register' | 'complete' | 'comment' | 'approve';
  user: string;
  target: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'register':
        return <User className="h-4 w-4 text-sky-500" />;
      case 'complete':
        return <CheckSquare className="h-4 w-4 text-emerald-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-violet-500" />;
      case 'approve':
        return <UserCheck className="h-4 w-4 text-amber-500" />;
    }
  };

  const getBgColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'register':
        return 'bg-sky-500/10 border-sky-500/20';
      case 'complete':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'comment':
        return 'bg-violet-500/10 border-violet-500/20';
      case 'approve':
        return 'bg-amber-500/10 border-amber-500/20';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl shadow-2xl  bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No recent activities found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow-lg shadow-gray-600 bg-card p-6 shadow-sm">
      <h3 className="text-base font-semibold text-foreground mb-6">Recent Activity</h3>

      <div className="relative pl-6 shadow-lg shadow-gray-600 space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex flex-col md:flex-row md:items-center md:justify-between space-y-1 md:space-y-0">
            {/* Timeline Dot Icon */}
            <div className={`absolute -left-[37px] flex h-8 w-8 items-center justify-center rounded-full border bg-card ${getBgColor(activity.type)}`}>
              {getIcon(activity.type)}
            </div>

            {/* Log Details */}
            <div>
              <p className="text-sm text-foreground">
                <span className="font-semibold">{activity.user}</span>{' '}
                {activity.type === 'register' && 'registered a new account'}
                {activity.type === 'complete' && `completed task "${activity.target}"`}
                {activity.type === 'comment' && `commented on task "${activity.target}"`}
                {activity.type === 'approve' && `approved user "${activity.target}"`}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatDate(activity.timestamp, 'PPpp')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
