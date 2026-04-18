'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/format';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('kids_shop_cart') || '[]');
  } catch {
    return [];
  }
}

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener('cart-updated', sync);
    return () => window.removeEventListener('cart-updated', sync);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  function updateQuantity(id, change) {
    const next = readCart()
      .map((item) => {
        if (item.id !== id) return item;
        return { ...item, quantity: item.quantity + change };
      })
      .filter((item) => item.quantity > 0);

    localStorage.setItem('kids_shop_cart', JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event('cart-updated'));
  }

  function removeItem(id) {
    const next = readCart().filter((item) => item.id !== id);
    localStorage.setItem('kids_shop_cart', JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event('cart-updated'));
  }

  return (
    <div className="page-section">
      <div className="container">
        <div className="section-head">
          <div>
            <h1>Your cart</h1>
            <p>Review the handmade pieces before you place the order.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card empty-state">
            <h3>Your cart is empty.</h3>
            <p className="muted">Add some creations from the home page.</p>
            <div className="cta-row" style={{ justifyContent: 'center' }}>
              <Link href="/" className="btn">Go shopping</Link>
            </div>
          </div>
        ) : (
          <div className="product-layout">
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.id} className="card cart-item">
                  <img src={item.image_url} alt={item.title} />
                  <div>
                    <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                    <p className="muted small">
                      {formatCurrency(item.price)} each
                    </p>
                    <div className="inline-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="tag">Qty {item.quantity}</span>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <aside className="card summary-box">
              <h3>Order summary</h3>
              <p className="muted">Total items: {items.length}</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {formatCurrency(total)}
              </p>
              <p className="muted small">
                Payment is collected offline after we contact the customer.
              </p>
              <div className="cta-row">
                <Link href="/checkout" className="btn">Order now</Link>
                <Link href="/" className="btn-secondary">Continue browsing</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
