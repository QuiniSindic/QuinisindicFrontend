import { forwardRef, KeyboardEvent } from 'react';

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  title: string;
  tabId: string;
  panelId: string;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ isActive, onClick, onKeyDown, title, tabId, panelId }, ref) => {
    return (
      <button
        ref={ref}
        id={tabId}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={`
          flex-1 py-2 text-center transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2 focus-visible:ring-offset-background
          ${
            isActive
              ? 'text-text border-b-2 border-brand font-semibold'
              : 'text-muted hover:text-text'
          }`}
      >
        {title}
      </button>
    );
  },
);

Tab.displayName = 'Tab';
