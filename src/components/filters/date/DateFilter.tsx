'use client';

import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DateFilterContent } from './DateFilterContent';

export const DateFilter = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [placement, setPlacement] = useState<'bottom-start' | 'bottom-end'>(
    'bottom-end',
  );

  const {
    selectedFrom,
    selectedTo,
    clearDates,
    selectedSport,
    selectedLeague,
  } = useSportsFilter();

  const desktopContainerRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = !!(selectedFrom || selectedTo);

  useEffect(() => {
    const calculatePlacement = () => {
      if (desktopContainerRef.current) {
        const rect = desktopContainerRef.current.getBoundingClientRect();
        const screenCenter = window.innerWidth / 2;

        // Si el borde izquierdo del botón está en la mitad izquierda de la pantalla,
        // alineamos el popover al inicio (start). Si no, al final (end).
        setPlacement(rect.left < screenCenter ? 'bottom-start' : 'bottom-end');
      }
    };

    const timeoutId = setTimeout(calculatePlacement, 100);

    // Calcular al montar
    calculatePlacement();

    // Recalcular si se redimensiona la ventana
    window.addEventListener('resize', calculatePlacement);
    return () => {
      window.removeEventListener('resize', calculatePlacement);
      clearTimeout(timeoutId);
    };
  }, [selectedSport, selectedLeague]);

  // Helper para acortar el texto de la fecha (DD/MM) y ahorrar espacio
  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    const [_, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  };

  const summaryLabel = hasActiveFilters
    ? selectedFrom === selectedTo
      ? formatDateShort(selectedFrom!)
      : `${formatDateShort(selectedFrom!)} - ${formatDateShort(selectedTo!)}`
    : 'Fechas';

  // const summaryLabel = hasActiveFilters
  //   ? selectedFrom === selectedTo
  //     ? `Día: ${selectedFrom}`
  //     : `${selectedFrom} -> ${selectedTo}`
  //   : 'Filtrar por fecha';
  return (
    <>
      {/* --- VERSIÓN MÓVIL (Acordeón) --- */}
      <div className="md:hidden w-full bg-surface border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between p-3 hover:bg-background transition-colors"
        >
          <div className="flex items-center gap-2 text-text overflow-hidden">
            <CalendarDays size={16} className="shrink-0" />
            <span className="text-sm font-semibold truncate">
              {hasActiveFilters ? summaryLabel : 'Filtrar por fecha'}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`transition-transform shrink-0 text-muted ${
              isMobileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isMobileOpen && (
          <div className="p-3 pt-0 border-t border-border">
            <DateFilterContent closeWrapper={() => setIsMobileOpen(false)} />
          </div>
        )}
      </div>

      {/* --- VERSIÓN PC (Popover Compacto) --- */}
      <div className="hidden md:block" ref={desktopContainerRef}>
        <Popover
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          placement={placement}
          showArrow={true}
          offset={10}
          classNames={{
            content:
              'bg-surface text-text border border-border p-4 outline-none rounded-lg shadow-lg',
          }}
        >
          <PopoverTrigger>
            <button
              className={`
                flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium
                transition-colors cursor-pointer select-none max-w-40
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${
                  hasActiveFilters || isPopoverOpen
                    ? 'bg-brand text-brand-contrast'
                    : 'bg-surface text-text border border-border hover:bg-background'
                }
              `}
            >
              <CalendarDays size={16} className="shrink-0" />

              {/* Texto truncado para que no rompa el layout */}
              <span className="truncate min-w-0 flex-1 text-left">
                {summaryLabel}
              </span>

              {hasActiveFilters ? (
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDates();
                  }}
                  className="shrink-0 ml-1 p-0.5 rounded-full hover:bg-background"
                  aria-label="Limpiar fechas"
                  title="Limpiar fechas"
                >
                  <X size={12} />
                </div>
              ) : (
                <ChevronDown size={14} className="shrink-0 text-muted" />
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent>
            <DateFilterContent closeWrapper={() => setIsPopoverOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
