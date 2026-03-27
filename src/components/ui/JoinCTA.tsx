import Link from 'next/link';

interface JoinCTAProps {
  action: string; // e.g. "vote", "comment", "post"
  context?: string; // e.g. "Player of the Week", "this article", "the forum"
  compact?: boolean; // smaller inline version
}

export default function JoinCTA({ action, context, compact = false }: JoinCTAProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gold/10 border border-gold/30 rounded-lg text-sm text-slate-200">
        <span>Want to {action}{context ? ` on ${context}` : ''}?</span>
        <Link
          href="/signup"
          className="ml-auto font-bold text-gold hover:text-gold/80 transition whitespace-nowrap"
        >
          Join Free &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-lg border border-gold/30 bg-gradient-to-br from-navy/40 to-navy-mid/40 p-6 text-center backdrop-blur-sm">
      <h3 className="mb-2 psp-h3 text-white">
        Join the PhillySportsPack Community
      </h3>
      <p className="mb-4 text-sm text-slate-300">
        {action === 'vote' && `Sign up to vote for ${context || 'Player of the Week'} and make your voice heard.`}
        {action === 'comment' && `Create a free account to comment on ${context || 'articles'} and join the conversation.`}
        {action === 'post' && `Join free to post in ${context || 'the forum'}, share your takes, and connect with other fans.`}
        {!['vote', 'comment', 'post'].includes(action) && `Sign up free to ${action}${context ? ` on ${context}` : ''}.`}
      </p>
      <Link
        href="/signup"
        className="inline-block bg-gold px-6 py-2.5 font-bold text-navy transition hover:bg-gold/90 rounded-lg"
      >
        Join Free
      </Link>
      <p className="mt-3 text-xs text-slate-400">
        Free forever � No credit card required
      </p>
    </div>
  );
}
