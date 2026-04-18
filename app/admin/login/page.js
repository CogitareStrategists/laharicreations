'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.get('username'),
        password: form.get('password')
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Login failed.');
      setLoading(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="card form-card">
          <span className="kicker">Admin access</span>
          <h1>Login</h1>
          <p className="muted">
            Use the admin username and password from your environment file.
          </p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Username
              <input name="username" required />
            </label>
            <label>
              Password
              <input name="password" type="password" required />
            </label>
            {error ? <div className="notice">{error}</div> : null}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
