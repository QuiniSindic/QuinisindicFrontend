import { LeagueListButton } from '@/src/components/ui/buttons/LeagueListButton';
import { OptionsListButton } from '@/src/components/ui/buttons/OptionsListButton';
import { SPORTS_LIST_ITEMS } from '@/src/utils/sports.utils';
import { SportsFilter } from '../../filters/SportsFilter';
import { CarouselScrollContainer } from '../../ui/CarouselScrollContainer';

interface SportsListMobileProps {
  selectedSport: string | null;
  selectedLeague: string | null;
  toggleSport: (sport: string) => void;
  handleLeagueSelect: (league: string) => void;
}

export const SportsListMobile = ({
  selectedSport,
  selectedLeague,
  toggleSport,
  handleLeagueSelect,
}: SportsListMobileProps) => {
  const currentSport = SPORTS_LIST_ITEMS.find(
    (sport) => sport.name === selectedSport,
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

      {selectedSport && currentSport && (
        <CarouselScrollContainer
          className="animate-appearance-in"
          contentClassName="gap-2"
        >
          {currentSport.leagues.map((league) => (
            <div key={league} className="snap-center shrink-0">
              <LeagueListButton
                league={league}
                isSelected={selectedLeague === league}
                onClick={() => handleLeagueSelect(league)}
              />
            </div>
          ))}
        </CarouselScrollContainer>
      )}

      {/* clasificación en mobile (+ results?) */}
      {selectedSport && selectedLeague && (
        <CarouselScrollContainer
          className="animate-appearance-in"
          contentClassName="gap-2"
        >
          <OptionsListButton
            title="Clasificación"
            isSelected={false}
            onClick={() =>
              window.dispatchEvent(new CustomEvent('open-standings'))
            }
          />

          <OptionsListButton
            title="Resultados"
            isSelected={false}
            onClick={() =>
              window.dispatchEvent(new CustomEvent('open-results'))
            }
          />
        </CarouselScrollContainer>
      )}
    </div>
  );
};
