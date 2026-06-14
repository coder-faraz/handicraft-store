// FILE: src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import AdminShell from '@/components/admin/layout/AdminShell';

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Limra Admin',
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check
  const user = await getCurrentUser();

  if (!user || !user.isLoggedIn) {
    redirect('/login?redirect=/admin&reason=unauthenticated');
  }

  if (user.role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  return <AdminShell>{children}</AdminShell>;
}
