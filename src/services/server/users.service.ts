import { PublicProfile } from '@/types/auth/auth';
import { serverApiFetch } from '@/utils/api/server';

export async function getServerUsernames(
  userIds: string[],
): Promise<Record<string, PublicProfile>> {
  if (userIds.length === 0) return {};

  try {
    const profiles = await serverApiFetch<PublicProfile[]>({
      path: '/api/v2/users/profiles',
      query: { ids: userIds },
      auth: false,
    });

    return profiles.reduce<Record<string, PublicProfile>>((acc, profile) => {
      if (profile.id) {
        acc[profile.id] = profile;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching server profiles from backend:', error);
    return {};
  }
}
