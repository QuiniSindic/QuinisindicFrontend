import { LeagueListButton } from '@/components/ui/buttons/LeagueListButton';
import { OptionsListButton } from '@/components/ui/buttons/OptionsListButton';
import {
  COMPETITIONS_ID_MAP,
  LeagueName,
  SportName,
  SPORTS_LIST_ITEMS,
} from '@/utils/domain/sports';
import { SportsFilter } from '../../filters/SportsFilter';
import { CarouselScrollContainer } from '../../ui/CarouselScrollContainer';

interface SportsListMobileProps {
  selectedSport: SportName | null;
  selectedLeague: LeagueName | null;
  toggleSport: (sport: SportName) => void;
  handleLeagueSelect: (league: LeagueName) => void;
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

  const PLAYOFF_LEAGUE_IDS = [42, 73, 77, 138];

  const isPlayoffLeague =
    selectedLeague &&
    COMPETITIONS_ID_MAP[selectedLeague] &&
    PLAYOFF_LEAGUE_IDS.includes(COMPETITIONS_ID_MAP[selectedLeague]);

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
