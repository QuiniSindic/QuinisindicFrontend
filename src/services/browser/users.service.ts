import { PublicProfile } from '@/types/auth/auth';
import { createClient } from '@/utils/supabase/client';
import { mapProfileRow } from '@/services/shared/users.mapper';

interface RawProfileRow {
  id: string;
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}

export const getUserUsernames = async (
  userIds: string[],
): Promise<Record<string, PublicProfile>> => {
  if (userIds.length === 0) return {};

  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, avatar_url')
    .in('id', userIds);

  if (error) {
    console.error('Error fetching profiles:', error);
    throw new Error(error.message);
  }

  const record: Record<string, PublicProfile> = {};

  (data as RawProfileRow[] | null)?.forEach((user) => {
    if (!user.id) return;
    record[user.id] = mapProfileRow(user);
  });

  return record;
};
