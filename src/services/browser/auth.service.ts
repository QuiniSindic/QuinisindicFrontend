import { User } from '@/types/auth/auth';
import { IResponse } from '@/types/common/api';
import { browserApiFetch } from '@/utils/api/browser';
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

export const getMe = async (): Promise<IResponse<User | null>> => {
  try {
    const profile = await browserApiFetch<CurrentUserApiResponse>({
      path: '/api/v2/users/me',
    });

    return { ok: true, data: mapCurrentUser(profile) };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { ok: true, data: null };
    }

    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error al obtener el usuario',
      data: null,
    };
  }
};
