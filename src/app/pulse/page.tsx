import { redirect } from 'next/navigation';

// Pulse content now lives at the homepage (/)
// This redirect ensures backward compatibility for /pulse links
export default function PulsePage() {
  redirect('/');
}
