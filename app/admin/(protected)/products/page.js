'use client';

import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadProducts() {
    setLoading(true);
    const response = await fetch('/api/admin/products');
    const data = await response.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    const formEl = event.currentTarget;

    setSaving(true);
    setMessage('');

    const formData = new FormData(formEl);
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Could not save product.');
      setSaving(false);
      return;
    }

    formEl.reset();
    setMessage('Product added.');
    setSaving(false);
    loadProducts();
  }

  async function toggleField(id, field, value) {
    await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [field]: value })
    });
    loadProducts();
  }

  async function removeProduct(id) {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;

    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    loadProducts();
  }

  return (
    <div className="form-grid">
      <div className="section-head">
        <div>
          <h1>Products</h1>
          <p>Add creations and control what appears on the website.</p>
        </div>
      </div>

      <form className="card form-card form-grid" onSubmit={handleCreate}>
        <h3>Add new creative</h3>
        <div className="two-col">
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Price in INR
            <input name="price" type="number" min="1" required />
          </label>
        </div>

        <label>
          Description
          <textarea name="description" required />
        </label>

        <div className="two-col">
          <label>
            Product image
            <input name="image" type="file" accept="image/*" required />
          </label>
          <div className="form-grid">
            <label>
              Visible on website
              <select name="is_visible" defaultValue="true">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label>
              Featured on top
              <select name="is_featured" defaultValue="true">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        </div>

        {message ? <div className="notice">{message}</div> : null}

        <div className="cta-row">
          <button className="btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save product'}
          </button>
        </div>
      </form>

      <div className="card info-card">
        <h3>Existing products</h3>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : products.length === 0 ? (
          <p className="muted">No products yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Visible</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image_url}
                        alt={product.title}
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 14 }}
                      />
                    </td>
                    <td>
                      <strong>{product.title}</strong>
                      <div className="muted small">/{product.slug}</div>
                    </td>
                    <td>₹{product.price}</td>
                    <td>{product.is_visible ? 'Yes' : 'No'}</td>
                    <td>{product.is_featured ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="inline-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => toggleField(product.id, 'is_visible', !product.is_visible)}
                        >
                          {product.is_visible ? 'Hide' : 'Show'}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => toggleField(product.id, 'is_featured', !product.is_featured)}
                        >
                          {product.is_featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => removeProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
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
