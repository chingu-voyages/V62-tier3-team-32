import { SignupView } from '@/features/auth/views/signup-view';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole = role === 'farmer' ? 'farmer' : 'consumer';

  return <SignupView defaultRole={defaultRole} />;
}