import { User } from '@/types/auth/auth.types';
import { BACKEND_URL } from 'core/config';

export const getUserUsernames = async (
  userIds: string[],
): Promise<Record<string, User>> => {
  const response = await fetch(`${BACKEND_URL}/users/get-ids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userIds }),
    credentials: 'include',
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || !json) {
    throw new Error('No se pudo obtener usuarios');
  }

  const list: User[] = Array.isArray(json) ? json : json.data;

  if (!Array.isArray(list)) {
    throw new Error('Respuesta de usuarios inválida');
  }

  const record: Record<string, User> = {};
  for (const u of list) {
    if (u?.id) record[u.id] = u;
  }

  return record;
};
