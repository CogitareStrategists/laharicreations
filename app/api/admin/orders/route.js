import { isAdminAuthenticated } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await query(
    `SELECT id, customer_name, email, mobile, address, city, state, pincode,
            notes, items, total_amount, status, created_at
     FROM orders
     ORDER BY created_at DESC`
  );

  return Response.json({ orders: result.rows });
}

export async function PATCH(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await query(
      `UPDATE orders
       SET status = $2,
           updated_at = NOW()
       WHERE id = $1`,
      [body.id, body.status]
    );
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
