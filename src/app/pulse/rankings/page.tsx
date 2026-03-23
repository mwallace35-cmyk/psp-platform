import { redirect } from 'next/navigation';

export default function PulseRankingsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  // Preserve query params through the redirect
  // Note: redirect() is a server action that throws, so we call it directly
  redirect('/rankings');
}
