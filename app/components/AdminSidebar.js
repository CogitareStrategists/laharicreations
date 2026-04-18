'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/orders', label: 'Orders' }
  ];

  return (
    <aside className="card sidebar">
      <strong>Admin panel</strong>
      <nav>
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ fontWeight: pathname === item.href ? 800 : 500 }}
          >
            {item.label}
          </Link>
        ))}
        <button type="button" onClick={logout}>Logout</button>
      </nav>
    </aside>
  );
}
