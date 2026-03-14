'use client';

import { LeaderboardFilterOption } from '@/types/domain/leaderboard';
import { LeaderboardScope } from '@/types/domain/filters';
import { toSpanishSportName } from '@/utils/ui/sportName';

interface FiltersProps {
  currentScope: LeaderboardScope;
  currentFilterId: number | null;
  items: LeaderboardFilterOption[];
  onScopeChange: (scope: LeaderboardScope) => void;
  onFilterChange: (id: number | null) => void;
}

export function LeaderboardFilters({
  currentScope,
  currentFilterId,
  items,
  onScopeChange,
  onFilterChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl shadow-sm border border-border">
      <div className="flex p-1 rounded-lg bg-background border border-border self-start w-full sm:w-auto overflow-x-auto">
        {(['global', 'sport', 'competition'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onScopeChange(tab)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              currentScope === tab
                ? 'bg-brand text-white shadow-sm'
                : 'text-muted hover:text-text hover:bg-surface'
            }`}
          >
            {tab === 'global'
              ? 'Global'
              : tab === 'sport'
                ? 'Por Deporte'
                : 'Por Liga'}
          </button>
        ))}
      </div>

      {currentScope !== 'global' && (
        <div className="relative w-full sm:w-64">
          <select
            value={currentFilterId || ''}
            className="w-full appearance-none bg-background border border-border text-text text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all cursor-pointer"
            onChange={(event) =>
              onFilterChange(Number(event.target.value) || null)
            }
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {currentScope === 'sport'
                  ? toSpanishSportName(item.name)
                  : item.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
