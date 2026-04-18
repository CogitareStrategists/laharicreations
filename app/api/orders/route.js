import { query } from '@/lib/db';

function normalizeItems(items) {
  return Array.isArray(items)
    ? items.map((item) => ({
        id: item.id,
        title: item.title,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        image_url: item.image_url || '',
        slug: item.slug || ''
      }))
    : [];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const items = normalizeItems(body.items);

    if (!body.customer_name || !body.email || !body.mobile || !body.address) {
      return Response.json(
        { error: 'Please fill all required customer details.' },
        { status: 400 }
      );
    }

    if (!items.length) {
      return Response.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const result = await query(
      `INSERT INTO orders (
        customer_name,
        email,
        mobile,
        address,
        city,
        state,
        pincode,
        notes,
        items,
        total_amount
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id`,
      [
        body.customer_name,
        body.email,
        body.mobile,
        body.address,
        body.city || '',
        body.state || '',
        body.pincode || '',
        body.notes || '',
        JSON.stringify(items),
        totalAmount
      ]
    );

    return Response.json({ ok: true, orderId: result.rows[0].id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
