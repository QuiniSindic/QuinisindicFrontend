import { PublicProfile } from '@/types/auth/auth';
import { createClient } from '@/utils/supabase/client';

// export const getUserUsernames = async (
//   userIds: string[],
// ): Promise<Record<string, User>> => {
//   const response = await fetch(`${BACKEND_URL}/users/get-ids`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ userIds }),
//     credentials: 'include',
//   });

//   const json = await response.json().catch(() => ({}));

//   if (!response.ok || !json) {
//     throw new Error('No se pudo obtener usuarios');
//   }

//   const list: User[] = Array.isArray(json) ? json : json.data;

//   if (!Array.isArray(list)) {
//     throw new Error('Respuesta de usuarios inválida');
//   }

//   const record: Record<string, User> = {};
//   for (const u of list) {
//     if (u?.id) record[u.id] = u;
//   }

//   return record;
// };
export const getUserUsernamesV2 = async (
  userIds: string[],
): Promise<Record<string, PublicProfile>> => {
  if (!userIds || userIds.length === 0) return {};

  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles') // ⚠️ Asegúrate de que tu tabla se llama así
    .select('id, username, email, avatar_url') // Selecciona lo que necesites
    .in('id', userIds);

  console.log({ data });

  if (error) {
    console.error('Error fetching profiles:', error);
    throw new Error(error.message);
  }

  const record: Record<string, PublicProfile> = {};

  data?.forEach((user: any) => {
    if (user.id) {
      // Mapeamos a tu tipo User si es necesario
      record[user.id] = {
        id: user.id,
        username: user.username || user.email?.split('@')[0] || 'Usuario',
        email: user.email,
        img: user.avatar_url,
      } as PublicProfile;
    }
  });

  return record;
};
