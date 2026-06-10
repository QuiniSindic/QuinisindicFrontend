import { User } from '@/types/auth/auth';
import { serverApiFetch } from '@/utils/api/server';
import { ApiError } from '@/utils/api/shared';

interface CurrentUserApiResponse {
  id: string;
  username: string;
  email?: string | null;
  img?: string | null;
}

const mapCurrentUser = (user: CurrentUserApiResponse): User => ({
  id: user.id,
  username: user.username,
  email: user.email ?? '',
  password: '',
  provider: 'local',
  createdAt: undefined,
  updatedAt: undefined,
});

export async function getServerCurrentUser(): Promise<User | null> {
  try {
    const profile = await serverApiFetch<CurrentUserApiResponse>({
      path: '/api/v2/users/me',
    });

    return mapCurrentUser(profile);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    console.error('Error fetching current user from backend:', error);
    return null;
  }
}
