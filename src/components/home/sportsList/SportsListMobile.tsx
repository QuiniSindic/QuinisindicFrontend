import { OptionsListButton } from '@/components/ui/buttons/OptionsListButton';
import {
  getCompetitionIdByLeagueName,
  LeagueName,
  SportName,
} from '@/utils/domain/sports';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LeagueFilterOption } from '../../filters/LeagueFilter';
import { SportsFilter } from '../../filters/SportsFilter';
import { CarouselScrollContainer } from '../../ui/CarouselScrollContainer';

interface SportsListMobileProps {
  selectedSport: SportName | null;
  selectedLeague: LeagueName | null;
  selectedCompetitionId: number | null;
  leagueOptions: LeagueFilterOption[];
  toggleSport: (sport: SportName) => void;
  handleLeagueSelect: (league: LeagueName | null, leagueId?: number) => void;
}

export const SportsListMobile = ({
  selectedSport,
  selectedLeague,
  selectedCompetitionId,
  leagueOptions,
  toggleSport,
  handleLeagueSelect,
}: SportsListMobileProps) => {
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const PLAYOFF_LEAGUE_IDS = [42, 73, 77, 138];

  const groupedLeagueOptions = useMemo(() => {
    const groups = new Map<string, LeagueFilterOption[]>();

    leagueOptions.forEach((option) => {
      const key = option.country?.trim() || 'Otros';
      const current = groups.get(key) || [];
      current.push(option);
      groups.set(key, current);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
      .map(([country, options]) => ({
        country,
        options: [...options].sort((a, b) =>
          a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
        ),
      }));
  }, [leagueOptions]);

  const selectedLeagueId =
    selectedCompetitionId ?? getCompetitionIdByLeagueName(selectedLeague);
  const isPlayoffLeague = !!(
    selectedLeagueId && PLAYOFF_LEAGUE_IDS.includes(selectedLeagueId)
  );

  return (
    <div className="block lg:hidden">
      <SportsFilter
        selectedSport={selectedSport}
        onSelect={(sport) => {
          if (sport) toggleSport(sport);
        }}
        showAllOption={false}
      />

      {selectedSport && (
        <div className="mt-2 relative">
          <select
            onFocus={() => setIsSelectFocused(true)}
            onBlur={() => setIsSelectFocused(false)}
            value={selectedCompetitionId || ''}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!value) {
                handleLeagueSelect(null);
                return;
              }

              const option = leagueOptions.find((item) => item.id === value);
              if (option) {
                handleLeagueSelect(option.name, option.id);
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
      )}

      {/* clasificación en mobile (+ results?) */}
      {selectedSport && selectedLeague && (
        <CarouselScrollContainer
          className="mt-3 animate-appearance-in"
          contentClassName="gap-2"
        >
          <OptionsListButton
            title="Clasificación"
            isSelected={false}
            className={isPlayoffLeague ? 'w-[calc(50%-4px)]' : 'w-full'}
            onClick={() =>
              window.dispatchEvent(new CustomEvent('open-standings'))
            }
          />

          {isPlayoffLeague && (
            <OptionsListButton
              title="Cuadro"
              isSelected={false}
              className="w-[calc(50%-4px)]"
              onClick={() =>
                // Emitimos un evento distinto para abrir el bracket
                window.dispatchEvent(new CustomEvent('open-bracket'))
              }
            />
          )}
        </CarouselScrollContainer>
      )}
    </div>
  );
};
