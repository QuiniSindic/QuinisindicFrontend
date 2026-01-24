import { SportListButton } from '@/src/components/ui/buttons/SportsListButton';
import { SPORTS_LIST_ITEMS } from '@/src/utils/sports.utils';
import { CarouselScrollContainer } from '../ui/CarouselScrollContainer';

interface SportsFilterProps {
  selectedSport: string | null;
  onSelect: (sport: string | null) => void;
  showAllOption?: boolean;
}

export const SportsFilter = ({
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

    {SPORTS_LIST_ITEMS.map((sport) => (
      <SportListButton
        key={sport.name}
        sport={sport}
        isSelected={selectedSport === sport.name}
        onClick={() => onSelect(sport.name)}
      />
    ))}
  </CarouselScrollContainer>
);
