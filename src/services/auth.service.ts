import { User } from '@/types/auth/auth';
import { IResponse } from '@/types/common/api';
import { createClient } from '@/utils/supabase/client';

// Helper para mapear el usuario de Supabase a tu tipo 'User' del frontend
const mapSupabaseUser = (u: any): User => ({
  id: u.id,
  email: u.email!,
  username: u.user_metadata?.username || u.email?.split('@')[0] || 'Usuario',
  password: '',
  provider: 'local',
  createdAt: undefined,
  updatedAt: undefined,
});

export const getMeV2 = async (): Promise<IResponse<User | null>> => {
  const supabase = createClient();
  // getUser valida el token contra Supabase real (más seguro que getSession)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // No hay sesión activa o hubo error
    return { ok: true, data: null };
  }

  return { ok: true, data: mapSupabaseUser(user) };
};
