import { PublicProfile } from '@/types/auth/auth';

interface ProfileRowLike {
  id: string;
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}

export const mapProfileRow = (profile: ProfileRowLike): PublicProfile => ({
  id: profile.id,
  username: profile.username || profile.email?.split('@')[0] || 'Usuario',
  email: profile.email || undefined,
  img: profile.avatar_url || null,
});
