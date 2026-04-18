import { isValidAdminLogin, setAdminSession } from '@/lib/auth';

export async function POST(request) {
  const body = await request.json();

  if (!isValidAdminLogin(body.username, body.password)) {
    return Response.json(
      { error: 'Invalid username or password.' },
      { status: 401 }
    );
  }

  setAdminSession();
  return Response.json({ ok: true });
}
