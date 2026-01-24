import { memo } from 'react';

type SportListButtonProps = {
  sport: { name: string };
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  roleType?: 'toggle' | 'tab';
  className?: string;
};

export const SportListButton = memo(function SportListButton({
  sport,
  isSelected,
  onClick,
  disabled = false,
  roleType = 'toggle',
  className = '',
}: SportListButtonProps) {
  const ariaProps =
    roleType === 'tab'
      ? { role: 'tab', 'aria-selected': isSelected }
      : { 'aria-pressed': isSelected };

  const baseClasses = `flex-1 snap-center h-11 px-4
    rounded-lg font-semibold 
    transition-colors duration-300 
    transition-transform duration-150 
    sm:hover:shadow-lg sm:hover:scale-[1.02] 
    active:scale-[0.98] sm:active:scale-100 
    focus-visible:outline-hidden focus-visible:ring-2 
    focus-visible:ring-offset-2 focus-visible:ring-focus/70 
    ring-offset-background cursor-pointer
    motion-reduce:transition-none motion-reduce:transform-none `;

  const colorClasses = isSelected
    ? 'bg-focus text-secondary'
    : 'bg-secondary text-white';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={sport.name}
      {...ariaProps}
      className={`${baseClasses} ${colorClasses} ${disabledClasses} ${className}`}
    >
      {sport.name}
    </button>
  );
});
