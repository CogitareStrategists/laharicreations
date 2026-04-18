import { cookies } from 'next/headers';

const COOKIE_NAME = 'kids_shop_admin';

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'change-this-password'
  };
}

export function isValidAdminLogin(username, password) {
  const creds = getAdminCredentials();
  console.log("EXPECTED USERNAME:", creds.username);
  console.log("EXPECTED PASSWORD:", creds.password);
  return username === creds.username && password === creds.password;
}

export function setAdminSession() {
  cookies().set(COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export function clearAdminSession() {
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export function isAdminAuthenticated() {
  return cookies().get(COOKIE_NAME)?.value === '1';
}
