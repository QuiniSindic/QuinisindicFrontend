import { ProfileRow } from '@/types/database';
import { PublicProfile } from '@/types/auth/auth';

type ProfileSummaryRow = Pick<
  ProfileRow,
  'id' | 'username' | 'email' | 'avatar_url'
>;

export const mapProfileRow = (profile: ProfileSummaryRow): PublicProfile => ({
  id: profile.id,
  username: profile.username || profile.email?.split('@')[0] || 'Usuario',
  email: profile.email || undefined,
  img: profile.avatar_url || null,
});
