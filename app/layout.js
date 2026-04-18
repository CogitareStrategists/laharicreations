import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Lahari Kids Creations',
  description: 'Creative handmade products made by a talented kid entrepreneur.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="container header-row">
              <Link href="/" className="brand">Lahari Kids Creations</Link>
              <nav className="main-nav">
                <Link href="/">Home</Link>
                <Link href="/cart">Cart</Link>
                <Link href="/admin/login">Admin</Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <div className="container footer-copy">
              Handmade with imagination, patience, and joy.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
