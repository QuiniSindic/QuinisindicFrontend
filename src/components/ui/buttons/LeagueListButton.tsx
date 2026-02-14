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

  const baseClasses = `
    h-10 px-4 rounded-lg whitespace-nowrap text-sm 
    font-medium snap-center cursor-pointer
    transition-colors duration-200 active:scale-95
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-ring focus-visible:ring-offset-2
    focus-visible:ring-offset-background
  `;

  const stateClasses = isSelected
    ? 'bg-surface text-brand border border-brand shadow-sm'
    : 'bg-surface text-text border border-border hover:bg-background';

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
