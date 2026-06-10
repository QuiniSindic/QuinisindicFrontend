import dayjs from 'dayjs';
import { useCallback } from 'react';

export const useDateFilters = (
  setDateRange: (from: string, to: string) => void,
) => {
  const format = 'YYYY-MM-DD';

  const setToday = useCallback(() => {
    const today = dayjs().format(format);
    setDateRange(today, today);
  }, [setDateRange]);

  const setYesterday = useCallback(() => {
    const yesterday = dayjs().subtract(1, 'day').format(format);
    setDateRange(yesterday, yesterday);
  }, [setDateRange]);

  const setLast7Days = useCallback(() => {
    const end = dayjs().format(format);
    const start = dayjs().subtract(6, 'day').format(format);

    setDateRange(start, end);
  }, [setDateRange]);

  return { setToday, setYesterday, setLast7Days };
};
