import { PublicProfile } from '@/types/auth/auth';
import { browserApiFetch } from '@/utils/api/browser';

export const getUserUsernames = async (
  userIds: string[],
): Promise<Record<string, PublicProfile>> => {
  if (userIds.length === 0) return {};

  const profiles = await browserApiFetch<PublicProfile[]>({
    path: '/api/v2/users/profiles',
    query: { ids: userIds },
    auth: false,
  });

  const record: Record<string, PublicProfile> = {};
  profiles.forEach((user) => {
    if (!user.id) return;
    record[user.id] = user;
  });

  return record;
};
