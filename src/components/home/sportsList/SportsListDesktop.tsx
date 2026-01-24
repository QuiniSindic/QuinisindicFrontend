import { SPORTS_LIST_ITEMS } from '@/src/utils/sports.utils';

interface SportsListDesktopProps {
  selectedSport: string | null;
  selectedLeague: string | null;
  toggleSport: (sport: string) => void;
  handleLeagueSelect: (league: string) => void;
}

export const SportsListDesktop = ({
  selectedSport,
  selectedLeague,
  toggleSport,
  handleLeagueSelect,
}: SportsListDesktopProps) => {
  return (
    <div className="hidden lg:flex gap-4 w-1/5">
      <main className="flex-1 bg-secondary text-white p-4 rounded-lg w-60">
        <h1 className="text-2xl font-bold text-center border-b-2 border-white mb-4">
          Deportes
        </h1>

        {SPORTS_LIST_ITEMS.map((sport) => (
          <div key={sport.name} className="mb-4">
            <button
              onClick={() => toggleSport(sport.name)}
              className={`w-full text-left py-2 px-2 rounded-md font-bold text-xl transition-colors duration-300 ${
                selectedSport === sport.name
                  ? 'bg-focus text-white'
                  : 'hover:bg-white/10 text-gray-200'
              }`}
            >
              {sport.name}
            </button>

            <ul className="ml-4 mt-1 border-l border-white/20 pl-2">
              {sport.leagues.map((league) => (
                <li
                  key={league}
                  onClick={() => handleLeagueSelect(league)}
                  className={`py-1 pl-2 cursor-pointer text-md transition-colors duration-300 ${
                    selectedLeague === league
                      ? 'text-focus font-semibold'
                      : 'text-gray-300 hover:text-white'
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
