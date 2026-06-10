import { createClient as createSupabaseClient } from '@/utils/supabase/server';
import { apiFetch, type ApiRequestOptions } from './shared';

async function getServerAccessToken() {
  const supabase = await createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

export async function serverApiFetch<T>(
  options: ApiRequestOptions & { path: string; auth?: boolean },
) {
  const accessToken = options.auth === false ? null : await getServerAccessToken();

  return apiFetch<T>({
    ...options,
    accessToken,
  });
}
