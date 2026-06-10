import { SportOption } from '@/types/domain/sports';
import { groupCompetitionOptionsByCountry } from '@/utils/domain/competition';
import { LeagueName } from '@/utils/domain/sports';
import { useMemo } from 'react';
import { LeagueFilterOption } from '../../filters/LeagueFilter';

interface SportsListDesktopProps {
  sports: SportOption[];
  selectedSport: string | null;
  selectedLeague: LeagueName | null;
  selectedCompetitionId: number | null;
  leagueOptions: LeagueFilterOption[];
  toggleSport: (sport: SportOption) => void;
  handleLeagueSelect: (league: LeagueName | null, leagueId?: number) => void;
}

export const SportsListDesktop = ({
  sports,
  selectedSport,
  selectedLeague,
  selectedCompetitionId,
  leagueOptions,
  toggleSport,
  handleLeagueSelect,
}: SportsListDesktopProps) => {
  const groupedLeagueOptions = useMemo(
    () => groupCompetitionOptionsByCountry(leagueOptions),
    [leagueOptions],
  );

  return (
    <div className="hidden lg:flex gap-4 w-1/5">
      <main className="flex-1 bg-surface text-text p-4 rounded-lg w-60">
        <h1 className="text-2xl font-bold text-center border-b border-border mb-4">
          Deportes
        </h1>

        {sports.map((sport) => (
          <div key={sport.id} className="mb-4">
            <button
              type="button"
              onClick={() => toggleSport(sport)}
              className={`w-full text-left py-2 px-2 rounded-md font-bold text-xl
                transition-colors duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
                ${
                  selectedSport === sport.displayName
                    ? 'bg-brand text-brand-contrast'
                    : 'text-text hover:bg-background'
                }
              `}
            >
              {sport.displayName}
            </button>

            {selectedSport === sport.displayName && (
              <div className="ml-4 mt-1 border-l border-border pl-2 max-h-80 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleLeagueSelect(null)}
                  className={`py-1 pl-2 w-full text-left text-md rounded transition-colors duration-200 ${
                    !selectedCompetitionId
                      ? 'text-brand font-semibold'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  Todas
                </button>

                {groupedLeagueOptions.length > 0 ? (
                  groupedLeagueOptions.map((group) => (
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
                  ))
                ) : (
                  <p className="py-2 pl-2 text-sm text-muted">
                    No hay competiciones cargadas para este deporte.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};
