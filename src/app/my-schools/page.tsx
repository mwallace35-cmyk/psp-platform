import { Metadata } from 'next';
import MySchoolsPageClient from './MySchoolsPageClient';

export const metadata: Metadata = {
  title: 'My Schools | PhillySportsPack',
  description: 'Manage your bookmarked schools and personalize your PhillySportsPack experience.',
};

export default function MySchoolsPage() {
  return <MySchoolsPageClient />;
}
