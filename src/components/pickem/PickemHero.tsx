'use client';

import { Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';
import { DeadlinePill } from './DeadlinePill';
import { usePickem } from './PickemProvider';
import { PickemShareButton } from './PickemShareButton';

export function PickemHero() {
  const {
    state: { contest },
    meta: {
      isAuthenticated,
      groupsLocked,
      awardsLocked,
      savedGroupPicks,
      savedAwardPicks,
      totalTeams,
    },
  } = usePickem();

  return (
    <header className="relative overflow-hidden rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-brand/20 bg-brand/10" />
      <div className="absolute -bottom-24 left-1/2 h-52 w-52 rounded-full border border-brand/10 bg-background" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Pick&apos;em
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-none text-text sm:text-5xl">
            {contest.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Construye tu cuadro antes que empiece el torneo: ordena grupos,
            elige campeon y compite por puntos con el resto de la liga.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <DeadlinePill
              label="Grupos"
              deadline={contest.group_deadline}
              locked={groupsLocked}
            />
            <DeadlinePill
              label="Premios"
              deadline={contest.awards_deadline}
              locked={awardsLocked}
            />
          </div>
        </div>

        {isAuthenticated ? (
          <div className="rounded-lg border border-border bg-background/80 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  Mis picks
                </p>
                <p className="text-sm text-muted">
                  {savedGroupPicks}/{totalTeams} grupos - {savedAwardPicks}/4
                  premios
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-brand-contrast">
                <Trophy className="h-6 w-6" aria-hidden />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 text-center">
              <div className="rounded-lg bg-surface p-3">
                <p className="text-xs text-muted">Guardados</p>
                <p className="text-2xl font-black text-text">
                  {savedGroupPicks + savedAwardPicks}
                </p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-xs text-muted">Grupos</p>
                <p className="text-2xl font-black text-text">
                  {savedGroupPicks}
                </p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-xs text-muted">Premios</p>
                <p className="text-2xl font-black text-text">
                  {savedAwardPicks}
                </p>
              </div>
            </div>
            <PickemShareButton />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-background/80 p-4 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-text">
              Guarda tus predicciones
            </p>
            <p className="mt-1 text-sm text-muted">
              Inicia sesion para que tus picks entren en el ranking.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-brand-contrast transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Iniciar sesion
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
