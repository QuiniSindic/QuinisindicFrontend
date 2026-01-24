type LeagueListButtonProps = {
  league: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  roleType?: 'tab' | 'toggle';
  className?: string;
};

export const LeagueListButton = ({
  league,
  isSelected,
  onClick,
  disabled = false,
  roleType = 'tab',
  className = '',
}: LeagueListButtonProps) => {
  const ariaProps =
    roleType === 'tab'
      ? { role: 'tab', 'aria-selected': isSelected }
      : { 'aria-pressed': isSelected };

  const baseClasses =
    'h-10 px-4 rounded-lg whitespace-nowrap text-sm font-medium snap-center transition-all duration-200 active:scale-95';

  const stateClasses = isSelected
    ? 'bg-focus text-secondary shadow-md'
    : 'bg-secondary text-white border border-white/10 hover:bg-secondary/80';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={league}
      {...ariaProps}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
    >
      {league}
    </button>
  );
};
