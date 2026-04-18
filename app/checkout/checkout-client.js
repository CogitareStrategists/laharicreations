'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/format';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('kids_shop_cart') || '[]');
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!items.length) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    const payload = {
      customer_name: form.get('customer_name'),
      email: form.get('email'),
      mobile: form.get('mobile'),
      address: form.get('address'),
      city: form.get('city'),
      state: form.get('state'),
      pincode: form.get('pincode'),
      notes: form.get('notes'),
      items
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Could not place the order.');
      setSubmitting(false);
      return;
    }

    localStorage.removeItem('kids_shop_cart');
    window.dispatchEvent(new Event('cart-updated'));
    router.replace(`/checkout?success=1&order=${data.orderId}`);
    router.refresh();
  }

  if (searchParams.get('success') === '1') {
    return (
      <div className="page-section">
        <div className="container">
          <div className="card success-box">
            <h1>Order received</h1>
            <p className="muted">
              Thank you. We will contact you shortly to confirm the order and
              collect payment offline.
            </p>
            <p className="tag">Order #{searchParams.get('order')}</p>
            <div className="cta-row" style={{ justifyContent: 'center' }}>
              <Link href="/" className="btn">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="container">
        <div className="section-head">
          <div>
            <h1>Submit order</h1>
            <p>Share your contact details so we can confirm the order.</p>
          </div>
        </div>

        <div className="product-layout">
          <form className="card form-card form-grid" onSubmit={handleSubmit}>
            <div className="two-col">
              <label>
                Full name
                <input name="customer_name" required />
              </label>
              <label>
                Mobile
                <input name="mobile" required />
              </label>
            </div>

            <div className="two-col">
              <label>
                Email
                <input name="email" type="email" required />
              </label>
              <label>
                Pincode
                <input name="pincode" required />
              </label>
            </div>

            <label>
              Address
              <textarea name="address" required />
            </label>

            <div className="two-col">
              <label>
                City
                <input name="city" />
              </label>
              <label>
                State
                <input name="state" />
              </label>
            </div>

            <label>
              Notes
              <textarea
                name="notes"
                placeholder="Preferred time to call, special requests, etc."
              />
            </label>

            {error ? <div className="notice">{error}</div> : null}

            <div className="cta-row">
              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit order'}
              </button>
              <Link href="/cart" className="btn-secondary">Back to cart</Link>
            </div>
          </form>

          <aside className="card summary-box">
            <h3>Cart summary</h3>
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.id} className="small">
                  <strong>{item.title}</strong>
                  <div className="muted">
                    {item.quantity} × {formatCurrency(item.price)}
                  </div>
                </div>
              ))}
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--line)' }} />
            <p style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {formatCurrency(total)}
            </p>
            <p className="muted small">
              No online payment is collected at this stage.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
