import { PublicProfile } from '@/types/auth/auth';
import { createClient } from '@/utils/supabase/server';
import { mapProfileRow } from '@/services/shared/users.mapper';

interface RawProfileRow {
  id: string;
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}

export async function getServerUsernames(
  userIds: string[],
): Promise<Record<string, PublicProfile>> {
  if (userIds.length === 0) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, avatar_url')
    .in('id', userIds);

  if (error) {
    console.error('Error fetching server profiles:', error);
    return {};
  }

  const record: Record<string, PublicProfile> = {};

  (data as RawProfileRow[] | null)?.forEach((profile) => {
    if (!profile.id) return;
    record[profile.id] = mapProfileRow(profile);
  });

  return record;
}
