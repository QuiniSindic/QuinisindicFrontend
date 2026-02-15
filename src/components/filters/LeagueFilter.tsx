import { LeagueListButton } from '@/components/ui/buttons/LeagueListButton';
import { CompetitionOption } from '@/hooks/useCompetitionOptions';
import { groupCompetitionOptionsByCountry } from '@/utils/domain/competition';
import { LeagueName } from '@/utils/domain/sports';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CarouselScrollContainer } from '../ui/CarouselScrollContainer';

export type LeagueFilterOption = CompetitionOption;

interface LeaguesFilterProps {
  leagues: readonly string[] | string[];
  leagueOptions?: LeagueFilterOption[];
  selectedLeague: LeagueName | null;
  selectedCompetitionId?: number | null;
  onSelect: (league: LeagueName | null, leagueId?: number) => void;
  showLabel?: boolean;
}

export const LeaguesFilter = ({
  leagues,
  leagueOptions = [],
  selectedLeague,
  selectedCompetitionId,
  onSelect,
  showLabel = false,
}: LeaguesFilterProps) => {
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const groupedLeagueOptions = useMemo(
    () => groupCompetitionOptionsByCountry(leagueOptions),
    [leagueOptions],
  );

  const useCountryGroupedSelect = leagueOptions.length > 0;

  return (
    <div className="w-full animate-appearance-in">
      {showLabel && (
        <p className="text-xs text-muted font-bold uppercase tracking-wider mb-2 px-1">
          Ligas disponibles
        </p>
      )}

      {useCountryGroupedSelect ? (
        <div className="w-full">
          <div className="relative">
            <select
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              value={selectedCompetitionId || ''}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!value) {
                  onSelect(null);
                  return;
                }

                const option = leagueOptions.find((item) => item.id === value);
                if (option) {
                  onSelect(option.name, option.id);
                }
              }}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="">Todas</option>
              {groupedLeagueOptions.map((group) => (
                <optgroup key={group.country} label={group.country}>
                  {group.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown
              className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-transform duration-200 ${
                isSelectFocused ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </div>
      ) : (
        <CarouselScrollContainer contentClassName="gap-2">
          <LeagueListButton
            league="Todas"
            isSelected={!selectedLeague}
            onClick={() => onSelect(null)}
            className="flex-1 min-w-20 shrink-0"
          />

          {leagues.map((league) => (
            <div key={league} className="snap-center shrink-0">
              <LeagueListButton
                league={league}
                isSelected={selectedLeague === league}
                onClick={() => onSelect(league as LeagueName)}
                className="flex-1 min-w-fit shrink-0"
              />
            </div>
          ))}
        </CarouselScrollContainer>
      )}
    </div>
  );
};
