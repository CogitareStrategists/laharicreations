import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT id, title, slug, description, price, image_url
       FROM products
       WHERE is_visible = true
       ORDER BY is_featured DESC, created_at DESC`
    );

    return Response.json({ products: result.rows });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
