// src/components/event/form/teamHeader/TeamBadgeForm.tsx
'use client';

import Image from 'next/image';

interface Props {
  name: string;
  logo?: string;
  teamId?: number;
  align: 'left' | 'right';
}

export default function TeamBadgeForm({ name, logo, teamId, align }: Props) {
  const isRight = align === 'right'; // True = Local, False = Visitante

  return (
    <div
      // --- CLASES RESPONSIVE CLAVE ---
      // flex-col: En móvil, vertical (escudo arriba, texto abajo).
      // sm:flex-row: En tablet/pc, horizontal.
      // items-center: Centrado vertical siempre.
      // justify-center: Centrado horizontal en móvil.
      // sm:justify-[end/start]: Alineación específica en escritorio.
      className={`
        flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 w-full max-w-27.5 sm:max-w-none
        ${isRight ? 'sm:justify-end sm:text-right' : 'sm:justify-start sm:text-left'}
      `}
    >
      {/* CONTENEDOR DE LOGO */}
      {/* MÓVIL: Siempre arriba (sin order). ESCRITORIO: Cambia orden con flex. */}
      <div
        className={`
        relative shrink-0 size-14 sm:size-14 md:size-14 
        bg-surface rounded-full p-1
        ${isRight ? 'sm:order-last' : 'sm:order-first'}
      `}
      >
        {logo ? (
          <Image
            src={logo}
            alt={name}
            fill
            className="object-contain p-1"
            sizes="(max-width: 768px) 40px, 56px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background rounded-full text-muted font-bold text-xs sm:text-sm">
            {name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* CONTENEDOR DE TEXTO (Nombre) */}
      {/* MÓVIL: Debajo del logo, centrado, texto pequeño, permite 2 líneas. */}
      {/* ESCRITORIO: Al lado, alineado izq/der, texto más grande, truncado en 1 línea. */}
      <div
        className={`
          flex flex-col min-w-0 flex-1 mt-1 sm:mt-0 text-center
          ${isRight ? 'sm:items-end' : 'sm:items-start'} 
        `}
      >
        <span
          className="text-[14px] leading-tight sm:text-base md:text-lg font-bold text-text w-full line-clamp-2 sm:truncate sm:line-clamp-1"
          title={name} // Tooltip nativo para ver el nombre completo si se corta
        >
          {name}
        </span>
      </div>
    </div>
  );
}
