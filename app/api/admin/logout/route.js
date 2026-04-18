import { clearAdminSession } from '@/lib/auth';

export async function POST() {
  clearAdminSession();
  return Response.json({ ok: true });
}
