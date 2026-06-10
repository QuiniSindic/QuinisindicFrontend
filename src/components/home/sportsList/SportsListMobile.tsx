import { OptionsListButton } from '@/components/ui/buttons/OptionsListButton';
import { SportOption } from '@/types/domain/sports';
import { groupCompetitionOptionsByCountry } from '@/utils/domain/competition';
import { LeagueName } from '@/utils/domain/sports';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LeagueFilterOption } from '../../filters/LeagueFilter';
import { SportsFilter } from '../../filters/SportsFilter';
import { CarouselScrollContainer } from '../../ui/CarouselScrollContainer';

interface SportsListMobileProps {
  sports: SportOption[];
  selectedSport: string | null;
  selectedLeague: LeagueName | null;
  selectedCompetitionId: number | null;
  leagueOptions: LeagueFilterOption[];
  toggleSport: (sport: SportOption) => void;
  handleLeagueSelect: (league: LeagueName | null, leagueId?: number) => void;
}

export const SportsListMobile = ({
  sports,
  selectedSport,
  selectedLeague,
  selectedCompetitionId,
  leagueOptions,
  toggleSport,
  handleLeagueSelect,
}: SportsListMobileProps) => {
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const groupedLeagueOptions = useMemo(
    () => groupCompetitionOptionsByCountry(leagueOptions),
    [leagueOptions],
  );

  return (
    <div className="block lg:hidden">
      <SportsFilter
        sports={sports}
        selectedSport={selectedSport}
        onSelect={(sport) => {
          if (sport) toggleSport(sport);
        }}
        showAllOption={false}
      />

      {selectedSport && (
        <div className="relative mt-2">
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

      {selectedSport && selectedLeague && selectedCompetitionId && (
        <CarouselScrollContainer
          className="mt-3 animate-appearance-in"
          contentClassName="gap-2"
        >
          <OptionsListButton
            title="Competicion"
            isSelected={false}
            className="w-full"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('open-competition-panel'))
            }
          />
        </CarouselScrollContainer>
      )}
    </div>
  );
};
