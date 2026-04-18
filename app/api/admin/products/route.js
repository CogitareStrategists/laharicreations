import cloudinary from '@/lib/cloudinary';
import { isAdminAuthenticated } from '@/lib/auth';
import { query } from '@/lib/db';
import { slugify } from '@/lib/slug';

async function uploadImage(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'kids-creative-shop'
  });
  return result.secure_url;
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await query(
    `SELECT id, title, slug, description, price, image_url,
            is_visible, is_featured, created_at
     FROM products
     ORDER BY created_at DESC`
  );

  return Response.json({ products: result.rows });
}

export async function POST(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const title = String(form.get('title') || '').trim();
    const description = String(form.get('description') || '').trim();
    const price = Number(form.get('price') || 0);
    const isVisible = form.get('is_visible') === 'true';
    const isFeatured = form.get('is_featured') === 'true';
    const imageFile = form.get('image');

    if (!title || !description || !price || !imageFile || !imageFile.name) {
      return Response.json(
        { error: 'Title, description, price, and image are required.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
    const imageUrl = await uploadImage(imageFile);

    const result = await query(
      `INSERT INTO products (
        title, slug, description, price, image_url, is_visible, is_featured
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id`,
      [title, slug, description, price, imageUrl, isVisible, isFeatured]
    );

    return Response.json({ ok: true, id: result.rows[0].id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await query(
      `UPDATE products
       SET is_visible = COALESCE($2, is_visible),
           is_featured = COALESCE($3, is_featured),
           updated_at = NOW()
       WHERE id = $1`,
      [body.id, body.is_visible, body.is_featured]
    );
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await query('DELETE FROM products WHERE id = $1', [body.id]);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
