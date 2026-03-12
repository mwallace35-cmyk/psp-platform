import { createClient } from '@/lib/supabase/server';

interface BadgeDisplayProps {
  userId: string;
  className?: string;
}

const BADGE_STYLES = {
  'top_scout': { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '🔍' },
  'potw_expert': { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', icon: '🏆' },
  'school_historian': { bg: '#e9d5ff', border: '#a78bfa', text: '#5b21b6', icon: '📚' },
  'forum_contributor': { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: '💬' },
  'connector': { bg: '#fecaca', border: '#ef4444', text: '#7f1d1d', icon: '🤝' },
};

export async function BadgeDisplay({ userId, className = '' }: BadgeDisplayProps) {
  const supabase = await createClient();

  const { data: badges, error } = await supabase
    .from('user_badges')
    .select('badge_type, badge_name')
    .eq('user_id', userId);

  if (error || !badges || badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge) => {
        const style = BADGE_STYLES[badge.badge_type as keyof typeof BADGE_STYLES] || {
          bg: '#f3f4f6',
          border: '#d1d5db',
          text: '#374151',
          icon: '⭐',
        };

        return (
          <div
            key={badge.badge_type}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: style.bg,
              borderLeft: `3px solid ${style.border}`,
              color: style.text,
            }}
          >
            <span>{style.icon}</span>
            <span>{badge.badge_name}</span>
          </div>
        );
      })}
    </div>
  );
}
