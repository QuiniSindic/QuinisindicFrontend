'use client';
import { createClient } from '@/utils/supabase/client';
import { toSpanishSportName } from '@/utils/ui/sportName';
import { useEffect, useState } from 'react';

interface Props {
  currentScope: 'global' | 'sport' | 'competition';
  onScopeChange: (scope: 'global' | 'sport' | 'competition') => void;
  onFilterChange: (id: number | null) => void;
}

export default function LeaderboardFilters({
  currentScope,
  onScopeChange,
  onFilterChange,
}: Props) {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      setItems([]);
      onFilterChange(null);

      if (currentScope === 'sport') {
        const { data } = await supabase.from('sports').select('id, name');
        if (data) {
          setItems(data);
          if (data.length > 0) onFilterChange(data[0].id);
        }
      } else if (currentScope === 'competition') {
        const { data } = await supabase
          .from('competitions')
          .select('id, name')
          .order('name');
        if (data) {
          setItems(data);
          if (data.length > 0) onFilterChange(data[0].id);
        }
      }
    }
    fetchOptions();
  }, [currentScope]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl shadow-sm border border-border">
      {/* Selector de TIPO (Tabs) */}
      <div className="flex p-1 rounded-lg bg-background border border-border self-start w-full sm:w-auto overflow-x-auto">
        {(['global', 'sport', 'competition'] as const).map((tab) => (
          <button
            key={tab}
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

      {/* Selector secundario (Dropdown) */}
      {currentScope !== 'global' && (
        <div className="relative w-full sm:w-64">
          <select
            className="w-full appearance-none bg-background border border-border text-text text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all cursor-pointer"
            onChange={(e) => onFilterChange(Number(e.target.value))}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {currentScope === 'sport'
                  ? toSpanishSportName(item.name)
                  : item.name}
              </option>
            ))}
          </select>
          {/* Icono de flecha personalizado para el select */}
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
