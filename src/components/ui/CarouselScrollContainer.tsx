import { ReactNode } from 'react';

interface CarouselScrollContainerProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const CarouselScrollContainer = ({
  children,
  className = '',
  contentClassName = 'gap-3',
}: CarouselScrollContainerProps) => {
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex items-center overflow-x-auto pb-3 scrollbar-hide snap-x sm:px-1 lg:px-0 touch-pan-x ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
