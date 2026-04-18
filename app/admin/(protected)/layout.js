import { redirect } from 'next/navigation';
import AdminSidebar from '@/app/components/AdminSidebar';
import { isAdminAuthenticated } from '@/lib/auth';

export default function AdminProtectedLayout({ children }) {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }

  return (
    <div className="page-section">
      <div className="container admin-shell">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
