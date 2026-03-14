import {
  EventFilters,
  EventPageMode,
  EventStatusFilter,
  LeaderboardFiltersState,
  LeaderboardScope,
  PredictionsFiltersState,
  PredictionsSortMode,
  PredictionsStatusFilter,
  PredictionsView,
} from '@/types/domain/filters';
import {
  SearchParamRecord,
  SearchParamValue,
} from '@/types/domain/search-params';
import {
  getCompetitionIdByLeagueName,
  getSportIdByName,
  getSportNameByLeagueName,
  getSportNameBySlug,
  getSportSlugByName,
} from './sports';

const getFirstValue = (value: SearchParamValue): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const normalizeString = (value: SearchParamValue): string | null => {
  const normalized = getFirstValue(value)?.trim();
  return normalized ? normalized : null;
};

const parsePositiveInteger = (value: SearchParamValue): number | null => {
  const parsed = Number(getFirstValue(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const normalizeDateValue = (value: SearchParamValue): string | null => {
  const normalized = normalizeString(value);
  return normalized && /^\d{4}-\d{2}-\d{2}$/.test(normalized)
    ? normalized
    : null;
};

export const parseEventFilters = (
  searchParams: SearchParamRecord,
  mode: EventPageMode,
): EventFilters => {
  const sportSlug = normalizeString(searchParams.sport);
  const selectedLeague = normalizeString(searchParams.league);
  const sport =
    getSportNameBySlug(sportSlug) ||
    (selectedLeague ? getSportNameByLeagueName(selectedLeague) : null);
  const competitionId =
    parsePositiveInteger(searchParams.competition_id) ??
    getCompetitionIdByLeagueName(selectedLeague) ??
    null;
  const statusParam = normalizeString(searchParams.status);
  const status: EventStatusFilter =
    mode === 'events' && (statusParam === 'live' || statusParam === 'upcoming')
      ? statusParam
      : 'all';

  return {
    mode,
    sport,
    sportSlug: sport ? getSportSlugByName(sport) : sportSlug,
    sportId: sport ? getSportIdByName(sport) : null,
    selectedLeague,
    competitionId,
    from: normalizeDateValue(searchParams.from),
    to: normalizeDateValue(searchParams.to),
    status,
  };
};

export const buildEventSearchParams = (filters: EventFilters) => {
  const params = new URLSearchParams();

  if (filters.sportSlug) params.set('sport', filters.sportSlug);
  if (filters.selectedLeague) params.set('league', filters.selectedLeague);
  if (filters.competitionId) {
    params.set('competition_id', String(filters.competitionId));
  }
  if (filters.mode === 'events' && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters.mode === 'results') {
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
  }

  return params;
};

export const parseLeaderboardFilters = (
  searchParams: SearchParamRecord,
): LeaderboardFiltersState => {
  const scopeParam = normalizeString(searchParams.scope);
  const scope: LeaderboardScope =
    scopeParam === 'sport' || scopeParam === 'competition'
      ? scopeParam
      : 'global';

  return {
    scope,
    filterId:
      scope === 'global' ? null : parsePositiveInteger(searchParams.filter_id),
  };
};

export const buildLeaderboardSearchParams = (
  filters: LeaderboardFiltersState,
) => {
  const params = new URLSearchParams();
  if (filters.scope !== 'global') params.set('scope', filters.scope);
  if (filters.filterId) params.set('filter_id', String(filters.filterId));
  return params;
};

export const parsePredictionsFilters = (
  searchParams: SearchParamRecord,
): PredictionsFiltersState => {
  const viewParam = normalizeString(searchParams.view);
  const statusParam = normalizeString(searchParams.status);
  const sortParam = normalizeString(searchParams.sort);

  const view: PredictionsView =
    viewParam === 'community' ? 'community' : 'mine';
  const status: PredictionsStatusFilter =
    statusParam === 'live' || statusParam === 'ns' || statusParam === 'finished'
      ? statusParam
      : 'all';
  const sort: PredictionsSortMode =
    sortParam === 'kickoff_asc' || sortParam === 'kickoff_desc'
      ? sortParam
      : 'status';

  return { view, status, sort };
};

export const buildPredictionsSearchParams = (
  filters: PredictionsFiltersState,
) => {
  const params = new URLSearchParams();
  if (filters.view !== 'mine') params.set('view', filters.view);
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.sort !== 'status') params.set('sort', filters.sort);
  return params;
};
