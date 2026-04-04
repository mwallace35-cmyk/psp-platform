'use client';

import { toast } from 'sonner';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  school: string;
  rank: number;
  week: string;
  votePct?: number;
  sport: string;
}

export default function ShareButton({ school, rank, week, votePct, sport }: ShareButtonProps) {
  const url = `https://phillysportspack.com/rankings?sport=${sport}&share=${encodeURIComponent(school)}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied! Share it on social media');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-[#0a1628] transition"
      title="Share this ranking"
      aria-label={`Share ${school} ranked #${rank} for ${week}`}
    >
      <Share2 size={14} />
    </button>
  );
}
