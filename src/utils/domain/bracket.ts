import { MatchData } from '@/types/domain/events';

export interface BracketRound {
  id: string;
  name: string;
  matches: MatchData[];
}

export const organizeBracket = (matches: MatchData[]): BracketRound[] => {
  const roundsMap: Record<string, MatchData[]> = {
    playoff: [], // Nueva ronda preliminar Champions
    '16': [],
    '8': [],
    '4': [],
    '2': [],
  };

  matches.forEach((match) => {
    if (!match.round) return;

    // Normalizamos a minúsculas y string
    const round = String(match.round).toLowerCase();

    // --- LÓGICA DE MAPEO ---

    // 1. Play-offs (Ronda previa a Octavos en Champions nueva)
    if (round === 'playoff' || round.includes('preliminar')) {
      roundsMap['playoff'].push(match);
    }

    // 2. Octavos de Final ("1/8" es el código de FotMob para Round of 16)
    else if (
      round === '1/8' ||
      round.includes('16') ||
      round.includes('octavos')
    ) {
      roundsMap['16'].push(match);
    }

    // 3. Cuartos ("1/4")
    else if (
      round === '1/4' ||
      round.includes('quarter') ||
      round.includes('cuartos')
    ) {
      roundsMap['8'].push(match);
    }

    // 4. Semis ("1/2")
    else if (round === '1/2' || round.includes('semi')) {
      roundsMap['4'].push(match);
    }

    // 5. Final
    else if (
      round === 'final' ||
      (round.includes('final') && !round.includes('1/'))
    ) {
      roundsMap['2'].push(match);
    }
  });

  // Devolvemos el array ordenado cronológicamente
  return [
    { id: 'playoff', name: 'Play-offs', matches: roundsMap['playoff'] },
    { id: '16', name: 'Octavos', matches: roundsMap['16'] },
    { id: '8', name: 'Cuartos', matches: roundsMap['8'] },
    { id: '4', name: 'Semis', matches: roundsMap['4'] },
    { id: '2', name: 'Final', matches: roundsMap['2'] },
  ];
};
