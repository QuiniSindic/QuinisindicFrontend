import dayjs from 'dayjs';
import { useCallback } from 'react';

export const useDateFilters = (
  setFrom: (d: string) => void,
  setTo: (d: string) => void,
) => {
  const format = 'YYYY-MM-DD';

  const setToday = useCallback(() => {
    const today = dayjs().format(format);
    setFrom(today);
    setTo(today);
  }, [setFrom, setTo]);

  const setYesterday = useCallback(() => {
    const yesterday = dayjs().subtract(1, 'day').format(format);
    setFrom(yesterday);
    setTo(yesterday);
  }, [setFrom, setTo]);

  const setLast7Days = useCallback(() => {
    const end = dayjs();
    const start = dayjs().subtract(6, 'day'); // 6 días atrás + hoy = 7 días

    setFrom(start.format(format));
    setTo(end.format(format));
  }, [setFrom, setTo]);

  return { setToday, setYesterday, setLast7Days };
};
