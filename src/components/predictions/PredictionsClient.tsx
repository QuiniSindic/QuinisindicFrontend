'use client';

import { LocalDateTime } from '@/components/common/LocalDateTime';
import { PredictionGroup, PredictionView } from '@/types/domain/prediction';
import {
  getResultDisplay,
  getStatusBucket,
  getStatusLabel,
} from '@/utils/domain/events';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  Filter,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

type FilterState = {
  view: 'mine' | 'community';
  status: 'all' | 'live' | 'ns' | 'finished';
  sort: 'status' | 'kickoff_asc' | 'kickoff_desc';
};

type Props = {
  groups: PredictionGroup[];
  filters: FilterState;
  canShowMine: boolean;
};

const statusConfig = {
  all: { label: 'Todos', icon: Filter },
  live: { label: 'En vivo', icon: Zap },
  ns: { label: 'Proximos', icon: Clock },
  finished: { label: 'Finalizados', icon: Trophy },
} as const;

const sortOptions = [
  { id: 'status', label: 'Estado' },
  { id: 'kickoff_asc', label: 'Proximos' },
  { id: 'kickoff_desc', label: 'Recientes' },
] as const;

export function PredictionsClient({ groups, filters, canShowMine }: Props) {
  const searchParams = useSearchParams();
  const [expandedSports, setExpandedSports] = useState<Set<number>>(
    new Set(groups.map((g) => g.sportId))
  );
  const [expandedLeagues, setExpandedLeagues] = useState<Set<number>>(
    new Set(groups.flatMap((g) => g.leagues.map((l) => l.competitionId)))
  );

  const buildUrl = (patch: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries({ ...filters, ...patch }).forEach(([key, value]) => {
      if (value && value !== 'community' && value !== 'all' && value !== 'status') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    const query = params.toString();
    return query ? `/predictions?${query}` : '/predictions';
  };

  const toggleSport = (sportId: number) => {
    setExpandedSports((prev) => {
      const next = new Set(prev);
      if (next.has(sportId)) {
        next.delete(sportId);
      } else {
        next.add(sportId);
      }
      return next;
    });
  };

  const toggleLeague = (competitionId: number) => {
    setExpandedLeagues((prev) => {
      const next = new Set(prev);
      if (next.has(competitionId)) {
        next.delete(competitionId);
      } else {
        next.add(competitionId);
      }
      return next;
    });
  };

  const totalPredictions = groups.reduce(
    (acc, sport) =>
      acc + sport.leagues.reduce((a, l) => a + l.predictions.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-text">Predicciones</h1>
        <p className="mt-1 text-sm text-muted">
          {totalPredictions} predicciones encontradas
        </p>
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border pb-3 px-4">
        {/* View Toggle Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border">
          <Link
            href={canShowMine ? buildUrl({ view: 'mine' }) : '/login'}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.view === 'mine'
                ? 'bg-brand text-brand-contrast shadow-lg shadow-brand/25'
                : 'text-muted hover:text-text hover:bg-background/50'
            } ${!canShowMine ? 'opacity-50' : ''}`}
          >
            <Trophy className="w-4 h-4" />
            <span>Mis picks</span>
          </Link>
          <Link
            href={buildUrl({ view: 'community' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.view === 'community'
                ? 'bg-brand text-brand-contrast shadow-lg shadow-brand/25'
                : 'text-muted hover:text-text hover:bg-background/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Comunidad</span>
          </Link>
        </div>

        {/* Status Filter Pills */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(Object.entries(statusConfig) as [keyof typeof statusConfig, typeof statusConfig[keyof typeof statusConfig]][]).map(
            ([id, config]) => {
              const Icon = config.icon;
              const isActive = filters.status === id;
              return (
                <Link
                  key={id}
                  href={buildUrl({ status: id })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-brand text-brand-contrast shadow-md'
                      : 'bg-surface border border-border text-muted hover:text-text hover:border-brand/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </Link>
              );
            }
          )}
        </div>

        {/* Sort Options */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted">Ordenar:</span>
          <div className="flex gap-1.5">
            {sortOptions.map((option) => (
              <Link
                key={option.id}
                href={buildUrl({ sort: option.id })}
                className={`px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                  filters.sort === option.id
                    ? 'bg-brand/15 text-brand border border-brand/30'
                    : 'bg-surface border border-border text-muted hover:text-text'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Login Prompt */}
      {!canShowMine && filters.view === 'mine' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-4 rounded-2xl bg-surface border border-border"
        >
          <p className="text-sm text-muted text-center">
            Inicia sesion para ver tus predicciones
          </p>
          <Link
            href="/login"
            className="mt-3 block w-full py-3 rounded-xl bg-brand text-brand-contrast text-center text-sm font-medium"
          >
            Iniciar sesion
          </Link>
        </motion.div>
      )}

      {/* Empty State */}
      {groups.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-4 mt-8 p-8 rounded-2xl bg-surface border border-border text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-brand" />
          </div>
          <p className="text-text font-medium">Sin predicciones</p>
          <p className="mt-1 text-sm text-muted">
            {filters.view === 'mine'
              ? 'Aun no has hecho ninguna prediccion'
              : 'No hay predicciones de la comunidad'}
          </p>
        </motion.div>
      )}

      {/* Predictions List */}
      <div className="px-4 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {groups.map((sportGroup) => (
            <motion.section
              key={sportGroup.sportId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-surface border border-border overflow-hidden"
            >
              {/* Sport Header */}
              <button
                onClick={() => toggleSport(sportGroup.sportId)}
                className="w-full flex items-center justify-between p-4 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-brand" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-text">
                      {sportGroup.sportName}
                    </h2>
                    <p className="text-xs text-muted">
                      {sportGroup.leagues.reduce(
                        (acc, l) => acc + l.predictions.length,
                        0
                      )}{' '}
                      predicciones
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{
                    rotate: expandedSports.has(sportGroup.sportId) ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted" />
                </motion.div>
              </button>

              {/* Leagues */}
              <AnimatePresence>
                {expandedSports.has(sportGroup.sportId) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {sportGroup.leagues.map((league) => (
                        <div
                          key={league.competitionId}
                          className="rounded-xl border border-border/60 bg-background overflow-hidden"
                        >
                          {/* League Header */}
                          <button
                            onClick={() => toggleLeague(league.competitionId)}
                            className="w-full flex items-center justify-between p-3 hover:bg-surface/50 transition-colors"
                          >
                            <span className="text-sm font-medium text-muted">
                              {league.competitionName}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-full">
                                {league.predictions.length}
                              </span>
                              <motion.div
                                animate={{
                                  rotate: expandedLeagues.has(league.competitionId)
                                    ? 180
                                    : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-4 h-4 text-muted" />
                              </motion.div>
                            </div>
                          </button>

                          {/* Predictions */}
                          <AnimatePresence>
                            {expandedLeagues.has(league.competitionId) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 space-y-2">
                                  {league.predictions.map((prediction) => (
                                    <PredictionCard
                                      key={prediction.id}
                                      prediction={prediction}
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Spacer */}
      <div className="h-20" />
    </div>
  );
}

function PredictionCard({ prediction }: { prediction: PredictionView }) {
  const result = getResultDisplay(prediction);
  const statusBucket = getStatusBucket(prediction.matchStatus);

  const statusColors = {
    live: 'bg-green-500/20 text-green-400 border-green-500/30',
    ns: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    finished: 'bg-muted/20 text-muted border-border',
  };

  return (
    <Link
      href={`/event/${prediction.matchId}?returnTo=/predictions`}
      className="block"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="p-4 rounded-xl bg-surface border border-border hover:border-brand/40 transition-all duration-200"
      >
        {/* Match Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">
              {prediction.homeTeam}
            </p>
            <p className="text-xs text-muted">vs</p>
            <p className="text-sm font-semibold text-text truncate">
              {prediction.awayTeam}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                statusColors[statusBucket as keyof typeof statusColors] ||
                statusColors.ns
              }`}
            >
              {getStatusLabel(prediction.matchStatus)}
            </span>
            <span className="text-[10px] text-muted">
              <LocalDateTime
                value={prediction.kickoffIso ?? prediction.kickoff}
                format="DD/MM HH:mm"
                fallback="-"
              />
            </span>
          </div>
        </div>

        {/* User */}
        <div className="mt-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-brand">
              {prediction.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-muted">{prediction.username}</span>
        </div>

        {/* Prediction & Result */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-background border border-border">
            <p className="text-[10px] text-muted uppercase tracking-wide">
              Prediccion
            </p>
            <p className="mt-1 text-lg font-bold text-text">
              {prediction.predicted}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border">
            <p className="text-[10px] text-muted uppercase tracking-wide">
              {result.label}
            </p>
            <p className={`mt-1 text-lg font-bold ${result.tone}`}>
              {result.value}
            </p>
          </div>
        </div>

        {/* Points */}
        {prediction.points !== null && (
          <div className="mt-2 flex items-center justify-end gap-1">
            <Trophy className="w-3.5 h-3.5 text-brand" />
            <span className="text-xs font-semibold text-brand">
              +{prediction.points} pts
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
