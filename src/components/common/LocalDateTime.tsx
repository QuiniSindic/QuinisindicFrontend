'use client';

import { parseDateTime } from '@/utils/common/date';

interface LocalDateTimeProps {
  value?: string | number | null;
  format: string;
  fallback?: string;
  className?: string;
  as?: 'span' | 'time';
  capitalize?: boolean;
}

const capitalizeText = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

export function LocalDateTime({
  value,
  format,
  fallback = '',
  className,
  as = 'span',
  capitalize = false,
}: LocalDateTimeProps) {
  const parsed = typeof window !== 'undefined' ? parseDateTime(value) : null;
  const formatted = parsed ? parsed.locale('es').format(format) : fallback;
  const content = capitalize ? capitalizeText(formatted) : formatted;
  const dateTime =
    typeof value === 'string' ? value : parsed ? parsed.toISOString() : undefined;

  if (as === 'time') {
    return (
      <time className={className} dateTime={dateTime} suppressHydrationWarning>
        {content}
      </time>
    );
  }

  return (
    <span className={className} suppressHydrationWarning>
      {content}
    </span>
  );
}
