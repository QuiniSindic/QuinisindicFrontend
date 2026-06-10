'use client';

import { PickemAwardCandidate } from '@/types/domain/pickem';
import { Check, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  formatAwardCandidate,
  normalizeSearch,
  positionLabels,
} from './pickem.utils';

type AwardCandidatePickerProps = {
  label: string;
  candidates: PickemAwardCandidate[];
  selectedId?: number | null;
  disabled: boolean;
  onChange: (candidateId: number) => void;
};

export function AwardCandidatePicker({
  label,
  candidates,
  selectedId,
  disabled,
  onChange,
}: AwardCandidatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === selectedId,
  );
  const teams = useMemo(
    () =>
      Array.from(
        new Set(
          candidates
            .map((candidate) => candidate.team_name)
            .filter((team): team is string => Boolean(team)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [candidates],
  );
  const positions = useMemo(
    () =>
      Array.from(
        new Set(
          candidates
            .map((candidate) => candidate.position_desc)
            .filter((position): position is string => Boolean(position)),
        ),
      ).sort(),
    [candidates],
  );
  const filteredCandidates = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim());

    return candidates.filter((candidate) => {
      if (teamFilter && candidate.team_name !== teamFilter) return false;
      if (positionFilter && candidate.position_desc !== positionFilter) {
        return false;
      }
      if (!normalizedQuery) return true;

      return normalizeSearch(
        `${candidate.display_name} ${candidate.team_name ?? ''} ${
          candidate.position_desc ?? ''
        }`,
      ).includes(normalizedQuery);
    });
  }, [candidates, positionFilter, query, teamFilter]);

  const selectCandidate = (candidateId: number) => {
    onChange(candidateId);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-text outline-none transition-colors hover:border-brand hover:bg-surface focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="min-w-0 truncate">
          {selectedCandidate
            ? formatAwardCandidate(selectedCandidate)
            : candidates.length === 0
              ? 'Sin candidatos'
              : 'Seleccionar'}
        </span>
        <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/45 p-0 sm:items-center sm:justify-center sm:p-4">
          <div className="flex max-h-[88vh] w-full flex-col rounded-t-lg border border-border bg-surface shadow-xl sm:max-w-2xl sm:rounded-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text">{label}</p>
                <p className="text-xs text-muted">
                  {filteredCandidates.length} de {candidates.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="space-y-3 border-b border-border p-4">
              <label className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-ring">
                <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  name="pickem-award-search"
                  autoComplete="off"
                  placeholder="Buscar jugador..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
                />
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <select
                  value={teamFilter}
                  onChange={(event) => setTeamFilter(event.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Todas las selecciones</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                <select
                  value={positionFilter}
                  onChange={(event) => setPositionFilter(event.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Todas las posiciones</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {positionLabels[position] ?? position}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {filteredCandidates.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No hay jugadores con esos filtros.
                </p>
              ) : (
                filteredCandidates.map((candidate) => {
                  const isSelected = candidate.id === selectedId;

                  return (
                    <button
                      key={`${candidate.award_key}-${candidate.id}`}
                      type="button"
                      onClick={() => selectCandidate(candidate.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-background"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text">
                          {candidate.display_name}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {candidate.team_name ?? 'Seleccion'} -{' '}
                          {positionLabels[candidate.position_desc ?? ''] ??
                            candidate.position_desc}
                        </span>
                      </span>
                      {isSelected && (
                        <Check
                          className="h-4 w-4 shrink-0 text-brand"
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
