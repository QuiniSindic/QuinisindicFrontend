import { User } from '@/types/auth/auth';

interface SupabaseAuthUserLike {
  id: string;
  email?: string | null;
  user_metadata?: {
    username?: string | null;
  } | null;
}

export const mapSupabaseAuthUser = (user: SupabaseAuthUserLike): User => ({
  id: user.id,
  email: user.email || '',
  username:
    user.user_metadata?.username || user.email?.split('@')[0] || 'Usuario',
  password: '',
  provider: 'local',
  createdAt: undefined,
  updatedAt: undefined,
});
