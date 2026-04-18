import Link from 'next/link';
import { formatCurrency } from '@/lib/format';

export default function ProductCard({ product }) {
  return (
    <article className="card product-card">
      <Link href={`/product/${product.slug}`}>
        <img src={product.image_url} alt={product.title} />
      </Link>
      <div className="product-body">
        <div className="price-row">
          <h3>{product.title}</h3>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <p className="muted small">
          {product.description.length > 88
            ? `${product.description.slice(0, 88)}...`
            : product.description}
        </p>
        <div className="cta-row">
          <Link href={`/product/${product.slug}`} className="btn-secondary">
            View creative
          </Link>
        </div>
      </div>
    </article>
  );
}
