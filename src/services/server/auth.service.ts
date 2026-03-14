import { User } from '@/types/auth/auth';
import { createClient } from '@/utils/supabase/server';
import { mapSupabaseAuthUser } from '@/services/shared/auth.mapper';

export async function getServerCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? mapSupabaseAuthUser(user) : null;
}
