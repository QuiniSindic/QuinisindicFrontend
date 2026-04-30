import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const HUMAN_KICKOFF_FORMAT = 'HH:mm DD/MM/YYYY';

export const parseDateTime = (
  value?: string | number | Dayjs | null,
): Dayjs | null => {
  if (value === null || value === undefined) return null;

  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const humanReadableUtc = dayjs.utc(trimmed, HUMAN_KICKOFF_FORMAT, true);
    if (humanReadableUtc.isValid()) return humanReadableUtc.local();

    const parsed = dayjs(trimmed);
    return parsed.isValid() ? parsed : null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export const parseKickoff = (
  kickoff?: string | number | Dayjs,
  kickoffIso?: string | null,
): Dayjs | null => {
  const fromIso = parseDateTime(kickoffIso);
  if (fromIso) return fromIso;

  return parseDateTime(kickoff);
};

export function formatMatchWidget(dateStr: string, dateIso?: string | null): string {
  const djs = parseKickoff(dateStr, dateIso);
  if (!djs) return dateStr;

  const formatted = djs
    .locale('es')
    .format('dddd DD [de] MMMM [a las] HH:mm[h]');

  return formatted
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/ de (\w)/g, (_match, monthInitial) => ` de ${monthInitial.toUpperCase()}`);
}

export function formatKickoffBadge(
  kickoff?: string | Dayjs | number,
  kickoffIso?: string | null,
): string | null {
  const d = parseKickoff(kickoff, kickoffIso);
  if (!d) return null;

  const today = dayjs().startOf('day');
  const diff = d.startOf('day').diff(today, 'day');

  let prefix: string;
  if (diff === 0) prefix = 'Hoy';
  else if (diff === 1) prefix = 'Mañana';
  else prefix = d.locale('es').format('ddd D MMM');

  return `${prefix} • ${d.locale('es').format('HH:mm')}`;
}

export const formatKickoff = (kickoff: string, kickoffIso?: string | null) => {
  const parsed = parseKickoff(kickoff, kickoffIso);
  if (!parsed) return '-';
  return parsed.locale('es').format('DD/MM/YY HH:mm');
};

export const getTimestamp = (value?: string | number | Dayjs | null) => {
  const parsed = parseDateTime(value);
  if (!parsed) return 0;
  return parsed.valueOf();
};

export const formatDateShort = (dateStr: string) => {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
};
