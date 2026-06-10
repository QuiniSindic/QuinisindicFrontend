import { createClient as createSupabaseClient } from '@/utils/supabase/client';
import { apiFetch, type ApiRequestOptions } from './shared';

async function getBrowserAccessToken() {
  const supabase = createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

export async function browserApiFetch<T>(
  options: ApiRequestOptions & { path: string; auth?: boolean },
) {
  const accessToken = options.auth === false ? null : await getBrowserAccessToken();

  return apiFetch<T>({
    ...options,
    accessToken,
  });
}
