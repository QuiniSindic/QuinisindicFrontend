import { LeagueName, SportName, SPORTS_LIST_ITEMS } from '@/utils/sports.utils';

interface SportsListDesktopProps {
  selectedSport: SportName | null;
  selectedLeague: LeagueName | null;
  toggleSport: (sport: SportName) => void;
  handleLeagueSelect: (league: LeagueName) => void;
}

export const SportsListDesktop = ({
  selectedSport,
  selectedLeague,
  toggleSport,
  handleLeagueSelect,
}: SportsListDesktopProps) => {
  return (
    <div className="hidden lg:flex gap-4 w-1/5">
      <main className="flex-1 bg-surface text-text p-4 rounded-lg w-60">
        <h1 className="text-2xl font-bold text-center border-b border-border mb-4">
          Deportes
        </h1>

        {SPORTS_LIST_ITEMS.map((sport) => (
          <div key={sport.name} className="mb-4">
            <button
              onClick={() => toggleSport(sport.name)}
              className={`w-full text-left py-2 px-2 rounded-md font-bold text-xl
                transition-colors duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
                ${
                  selectedSport === sport.name
                    ? 'bg-brand text-brand-contrast'
                    : 'text-text hover:bg-background'
                }`}
            >
              {sport.name}
            </button>

            <ul className="ml-4 mt-1 border-l border-border pl-2">
              {sport.leagues.map((league) => (
                <li
                  key={league}
                  onClick={() => handleLeagueSelect(league)}
                  className={`py-1 pl-2 cursor-pointer text-md rounded
                    transition-colors duration-200
                    ${
                      selectedLeague === league
                        ? 'text-brand font-semibold'
                        : 'text-muted hover:text-text'
                    }`}
                >
                  {league}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
};
