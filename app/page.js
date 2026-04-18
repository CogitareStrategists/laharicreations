import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import { query } from '@/lib/db';

async function getProducts() {
  const result = await query(
    `SELECT id, title, slug, description, price, image_url
     FROM products
     WHERE is_visible = true
     ORDER BY is_featured DESC, created_at DESC`
  );
  return result.rows;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="page-section">
      <div className="container">
        <section className="hero">
          <div className="hero-card hero-copy">
            <span className="kicker">A young maker's shop</span>
            <h1>Creative handmade treasures by a kid entrepreneur.</h1>
            <p>
              Discover bookmarks, tiny clay toys, micro art, and other joyful
              handmade creations. Orders are collected online and confirmed
              personally offline so every customer gets a warm human touch.
            </p>
            <div className="cta-row">
              <Link href="#shop" className="btn">Browse creations</Link>
              <Link href="/cart" className="btn-secondary">View cart</Link>
            </div>
          </div>
          <div className="hero-card hero-art">
            <div className="sticker-grid">
              <div className="sticker one">Clay toys</div>
              <div className="sticker two">Tiny art</div>
              <div className="sticker three">Bookmarks</div>
              <div className="sticker four">Handmade joy</div>
            </div>
          </div>
        </section>

        <section id="shop" className="page-section" style={{ paddingTop: 10 }}>
          <div className="section-head">
            <div>
              <h2>Available creations</h2>
              <p>
                Each item is handmade, so quantities are naturally limited.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="card empty-state">
              <h3>No creations are live yet.</h3>
              <p className="muted">
                Add products from the admin panel and mark them visible.
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
