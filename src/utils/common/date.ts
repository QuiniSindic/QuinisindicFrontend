import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function formatMatchWidget(dateStr: string): string {
  const djs = dayjs(dateStr, 'HH:mm DD/MM/YYYY', 'es', true).isValid()
    ? dayjs(dateStr, 'HH:mm DD/MM/YYYY')
    : dayjs(dateStr);

  const formatted = djs
    .locale('es')
    .format('dddd DD [de] MMMM [a las] HH:mm[h]');

  // Corregido: Capitaliza la primera letra de la frase y
  // la primera letra que va DESPUÉS de " de "
  return formatted
    .replace(/^\w/, (c) => c.toUpperCase()) // Primera letra (Domingo)
    .replace(/ de (\w)/g, (match, p1) => ` de ${p1.toUpperCase()}`); // Letra tras " de " (Febrero)
}

export const parseKickoff = (
  kickoff?: string | number | Dayjs,
): Dayjs | null => {
  if (kickoff === null || kickoff === undefined) return null;

  let d: Dayjs;

  // 1. Si ya es un objeto Dayjs
  if (dayjs.isDayjs(kickoff)) {
    d = kickoff;
  }
  // 2. Si es un formato específico 'HH:mm DD/MM/YYYY'
  else if (
    typeof kickoff === 'string' &&
    /^\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}$/.test(kickoff.trim())
  ) {
    d = dayjs(kickoff.trim(), 'HH:mm DD/MM/YYYY');
  }
  // 3. Fallback para ISO strings, números (timestamps) o Date nativo
  else {
    d = dayjs(kickoff);
  }

  return d.isValid() ? d : null;
};

export function formatKickoffBadge(
  kickoff?: string | Dayjs | number,
): string | null {
  const d = parseKickoff(kickoff);
  if (!d) return null;

  const dj = dayjs(d);
  const today = dayjs().startOf('day');
  const diff = dj.startOf('day').diff(today, 'day');

  let prefix: string;
  if (diff === 0) prefix = 'Hoy';
  else if (diff === 1) prefix = 'Mañana';
  else prefix = dj.locale('es').format('ddd D MMM'); // ej: "sáb. 30 ago"

  return `${prefix} • ${dj.locale('es').format('HH:mm')}`;
}
