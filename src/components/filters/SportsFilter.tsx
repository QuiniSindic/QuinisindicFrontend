import { SportListButton } from '@/components/ui/buttons/SportsListButton';
import { SportOption } from '@/types/domain/sports';
import { CarouselScrollContainer } from '../ui/CarouselScrollContainer';

interface SportsFilterProps {
  sports: SportOption[];
  selectedSport: string | null;
  onSelect: (sport: SportOption | null) => void;
  showAllOption?: boolean;
}

export const SportsFilter = ({
  sports,
  selectedSport,
  onSelect,
  showAllOption = true,
}: SportsFilterProps) => (
  <CarouselScrollContainer contentClassName="gap-3">
    {showAllOption && (
      <SportListButton
        sport={{ name: 'Todos' }}
        isSelected={!selectedSport}
        onClick={() => onSelect(null)}
      />
    )}

    {sports.map((sport) => (
      <SportListButton
        key={sport.id}
        sport={{ name: sport.displayName }}
        isSelected={selectedSport === sport.displayName}
        onClick={() => onSelect(sport)}
      />
    ))}
  </CarouselScrollContainer>
);
