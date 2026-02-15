import { PublicProfile } from '@/types/auth/auth';
import { createClient } from '@/utils/supabase/client';

export const getUserUsernamesV2 = async (
  userIds: string[],
): Promise<Record<string, PublicProfile>> => {
  if (!userIds || userIds.length === 0) return {};

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

  data?.forEach((user: any) => {
    if (user.id) {
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
