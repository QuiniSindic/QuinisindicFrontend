import { IResponse } from '@/types/common/api';
import { User } from '@/types/auth/auth';
import { createClient } from '@/utils/supabase/client';
import { mapSupabaseAuthUser } from '@/services/shared/auth.mapper';

export const getMe = async (): Promise<IResponse<User | null>> => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: true, data: null };
  }

  return { ok: true, data: mapSupabaseAuthUser(user) };
};
