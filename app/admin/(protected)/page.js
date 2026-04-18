import Link from 'next/link';
import { query } from '@/lib/db';

async function getStats() {
  const [products, visible, orders] = await Promise.all([
    query('SELECT COUNT(*)::int AS count FROM products'),
    query('SELECT COUNT(*)::int AS count FROM products WHERE is_visible = true'),
    query('SELECT COUNT(*)::int AS count FROM orders')
  ]);

  return {
    products: products.rows[0].count,
    visible: visible.rows[0].count,
    orders: orders.rows[0].count
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="form-grid">
      <div className="section-head">
        <div>
          <h1>Dashboard</h1>
          <p>Manage creations and review customer orders.</p>
        </div>
      </div>

      <div className="product-grid">
        <div className="card info-card">
          <h3>Total products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.products}</p>
        </div>
        <div className="card info-card">
          <h3>Visible products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.visible}</p>
        </div>
        <div className="card info-card">
          <h3>Total orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.orders}</p>
        </div>
      </div>

      <div className="card info-card">
        <h3>Quick actions</h3>
        <div className="cta-row">
          <Link href="/admin/products" className="btn">Add or manage products</Link>
          <Link href="/admin/orders" className="btn-secondary">View orders</Link>
        </div>
      </div>
    </div>
  );
}
