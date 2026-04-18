'use client';

import { useState } from 'react';

function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('kids_shop_cart') || '[]');
  } catch {
    return [];
  }
}

export default function AddToCartButton({ product }) {
  const [label, setLabel] = useState('Add to cart');

  function handleAdd() {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      });
    }

    localStorage.setItem('kids_shop_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setLabel('Added');
    setTimeout(() => setLabel('Add to cart'), 1500);
  }

  return (
    <button type="button" className="btn" onClick={handleAdd}>
      {label}
    </button>
  );
}
