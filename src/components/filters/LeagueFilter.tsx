import { LeagueListButton } from '@/src/components/ui/buttons/LeagueListButton';
import { CarouselScrollContainer } from '../ui/CarouselScrollContainer';

interface LeaguesFilterProps {
  leagues: string[];
  selectedLeague: string | null;
  onSelect: (league: string | null) => void;
  showLabel?: boolean;
}

export const LeaguesFilter = ({
  leagues,
  selectedLeague,
  onSelect,
  showLabel = false,
}: LeaguesFilterProps) => (
  <div className="w-full animate-appearance-in">
    {showLabel && (
      <p className="text-xs text-default-500 font-bold uppercase tracking-wider mb-2 px-1">
        Ligas disponibles
      </p>
    )}

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
            onClick={() => onSelect(league)}
            className="flex-1 min-w-fit shrink-0"
          />
        </div>
      ))}
    </CarouselScrollContainer>
  </div>
);
