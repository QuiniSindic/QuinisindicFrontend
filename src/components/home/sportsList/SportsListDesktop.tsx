import {
  LeagueName,
  SportName,
  SPORTS_LIST_ITEMS,
} from '@/utils/domain/sports';
import { useMemo } from 'react';
import { LeagueFilterOption } from '../../filters/LeagueFilter';

interface SportsListDesktopProps {
  selectedSport: SportName | null;
  selectedLeague: LeagueName | null;
  selectedCompetitionId: number | null;
  leagueOptions: LeagueFilterOption[];
  toggleSport: (sport: SportName) => void;
  handleLeagueSelect: (league: LeagueName | null, leagueId?: number) => void;
}

export const SportsListDesktop = ({
  selectedSport,
  selectedLeague,
  selectedCompetitionId,
  leagueOptions,
  toggleSport,
  handleLeagueSelect,
}: SportsListDesktopProps) => {
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

            {selectedSport === sport.name && groupedLeagueOptions.length > 0 ? (
              <div className="ml-4 mt-1 border-l border-border pl-2 max-h-80 overflow-y-auto">
                <button
                  onClick={() => handleLeagueSelect(null)}
                  className={`py-1 pl-2 w-full text-left text-md rounded transition-colors duration-200 ${
                    !selectedCompetitionId
                      ? 'text-brand font-semibold'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  Todas
                </button>

                {groupedLeagueOptions.map((group) => (
                  <div key={group.country} className="mt-2">
                    <p className="text-xs tracking-wide text-muted/80 font-semibold">
                      {group.country}
                    </p>
                    <ul>
                      {group.options.map((league) => (
                        <li
                          key={league.id}
                          onClick={() =>
                            handleLeagueSelect(league.name, league.id)
                          }
                          className={`py-1 pl-2 cursor-pointer text-md rounded transition-colors duration-200 ${
                            selectedCompetitionId === league.id ||
                            (selectedLeague === league.name &&
                              !selectedCompetitionId)
                              ? 'text-brand font-semibold'
                              : 'text-muted hover:text-text'
                          }`}
                        >
                          {league.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        ))}
      </main>
    </div>
  );
};
