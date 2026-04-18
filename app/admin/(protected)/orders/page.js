'use client';

import { useEffect, useState } from 'react';

const statuses = ['new', 'contacted', 'confirmed', 'completed'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const response = await fetch('/api/admin/orders');
    const data = await response.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, status) {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    loadOrders();
  }

  return (
    <div className="form-grid">
      <div className="section-head">
        <div>
          <h1>Orders</h1>
          <p>Review customer details and confirm orders offline.</p>
        </div>
      </div>

      <div className="card info-card">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                      <div className="muted small">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <strong>{order.customer_name}</strong>
                      <div className="small">{order.mobile}</div>
                      <div className="small">{order.email}</div>
                      <div className="muted small">
                        {[order.address, order.city, order.state, order.pincode]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                      {order.notes ? (
                        <div className="muted small">Notes: {order.notes}</div>
                      ) : null}
                    </td>
                    <td>
                      <div className="order-items">
                        {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                          <div key={`${order.id}-${index}`} className="small">
                            <strong>{item.title}</strong>
                            <div className="muted">
                              Qty {item.quantity} × ₹{item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td><strong>₹{order.total_amount}</strong></td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(event) => updateStatus(order.id, event.target.value)}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
