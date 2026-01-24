type OptionsListButtonProps = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  roleType?: 'toggle' | 'tab'; // según uses toggle o tabs
  variant?: 'solid' | 'outline-solid'; // estilo base
  size?: 'sm' | 'md'; // tamaños
};

export const OptionsListButton = ({
  title,
  isSelected,
  onClick,
  disabled = false,
  roleType = 'toggle',
  variant = 'outline-solid',
  size = 'md',
}: OptionsListButtonProps) => {
  const ariaProps =
    roleType === 'tab'
      ? { role: 'tab', 'aria-selected': isSelected }
      : { 'aria-pressed': isSelected };

  const sizeCls =
    size === 'sm' ? 'h-9 px-3 text-sm' : 'h-10 px-3 text-[0.95rem]';

  const base = `
    snap-center rounded-lg font-semibold whitespace-nowrap truncate
    transition-colors duration-200 transition-transform duration-150
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-ring focus-visible:ring-offset-2
    focus-visible:ring-offset-background
    motion-reduce:transition-none motion-reduce:transform-none
  `;

  const stateHover =
    'sm:hover:shadow-lg sm:hover:scale-[1.02] active:scale-[0.98] sm:active:scale-100';

  const outlineUnselected =
    'bg-transparent text-text border border-border hover:bg-background';
  const outlineSelected =
    'bg-brand text-brand-contrast border border-transparent';

  const solidUnselected =
    'bg-surface text-text border border-border hover:bg-background';
  const solidSelected =
    'bg-brand text-brand-contrast border border-transparent';

  const selected =
    variant === 'outline-solid' ? outlineSelected : solidSelected;
  const unselected =
    variant === 'outline-solid' ? outlineUnselected : solidUnselected;

  return (
    <div className="snap-center shrink-0">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        {...ariaProps}
        className={[
          base,
          stateHover,
          sizeCls,
          isSelected ? selected : unselected,
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        {title}
      </button>
    </div>
  );
};
