import { apiFetch } from '@/lib/api';

export async function login(email: string, password: string) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('token', data.token);

  return data;
}

export function logout() {
  localStorage.removeItem('token');
}