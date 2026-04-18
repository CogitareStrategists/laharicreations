import { notFound } from 'next/navigation';
import AddToCartButton from '@/app/components/AddToCartButton';
import { query } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

async function getProduct(slug) {
  const result = await query(
    `SELECT id, title, slug, description, price, image_url
     FROM products
     WHERE slug = $1 AND is_visible = true
     LIMIT 1`,
    [slug]
  );
  return result.rows[0] || null;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="page-section">
      <div className="container">
        <div className="product-layout">
          <div className="card" style={{ overflow: 'hidden' }}>
            <img
              src={product.image_url}
              alt={product.title}
              className="product-main-image"
            />
          </div>

          <div className="card info-card">
            <span className="tag">Handmade by a young creator</span>
            <h1>{product.title}</h1>
            <p className="muted" style={{ lineHeight: 1.7 }}>
              {product.description}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {formatCurrency(product.price)}
            </p>
            <div className="notice small">
              Payment is handled offline. Place the order online and we will
              contact you before confirming it.
            </div>
            <div className="cta-row">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
