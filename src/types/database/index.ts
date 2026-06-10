import type { Database } from './generated';

export type { Database, Json } from './generated';

type PublicSchema = Database['public'];

export type DbTableName = keyof PublicSchema['Tables'];
export type DbViewName = keyof PublicSchema['Views'];

export type DbTable<T extends DbTableName> = PublicSchema['Tables'][T]['Row'];
export type DbInsert<T extends DbTableName> =
  PublicSchema['Tables'][T]['Insert'];
export type DbUpdate<T extends DbTableName> =
  PublicSchema['Tables'][T]['Update'];
export type DbView<T extends DbViewName> = PublicSchema['Views'][T]['Row'];

export type CompetitionRow = DbTable<'competitions'>;
export type MatchRow = DbTable<'matches'>;
export type PredictionRow = DbTable<'predictions'>;
export type ProfileRow = DbTable<'profiles'>;
export type SportRow = DbTable<'sports'>;

export type LeaderboardCompetitionRow = DbView<'leaderboard_competition'>;
export type LeaderboardGlobalRow = DbView<'leaderboard_global'>;
export type LeaderboardSportRow = DbView<'leaderboard_sport'>;
