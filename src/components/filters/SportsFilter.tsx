import { SportListButton } from '@/components/ui/buttons/SportsListButton';
import { SportName, SPORTS_LIST_ITEMS } from '@/utils/sports.utils';
import { CarouselScrollContainer } from '../ui/CarouselScrollContainer';

interface SportsFilterProps {
  selectedSport: SportName | null;
  onSelect: (sport: SportName | null) => void;
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
