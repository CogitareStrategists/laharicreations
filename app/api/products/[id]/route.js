import { query } from '@/lib/db';

export async function GET(_, { params }) {
  try {
    const result = await query(
      `SELECT id, title, slug, description, price, image_url
       FROM products
       WHERE slug = $1 AND is_visible = true
       LIMIT 1`,
      [params.id]
    );

    if (!result.rows[0]) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json({ product: result.rows[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
