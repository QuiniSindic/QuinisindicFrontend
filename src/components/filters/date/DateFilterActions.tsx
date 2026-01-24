'use client';

import { DateFilterButton } from '../../ui/buttons/DateFilterButton';

interface DateFilterActionsProps {
  setToday: () => void;
  setYesterday: () => void;
  setLast7Days: () => void;

  closePopover: () => void;
}

export const DateFilterActions = ({
  setToday,
  setYesterday,
  setLast7Days,
  closePopover,
}: DateFilterActionsProps) => {
  return (
    <>
      <DateFilterButton
        label="Hoy"
        onClick={() => {
          setToday();
          closePopover();
        }}
      />
      <DateFilterButton
        label="Ayer"
        onClick={() => {
          setYesterday();
          closePopover();
        }}
      />
      <DateFilterButton
        label="Últimos 7 días"
        onClick={() => {
          setLast7Days();
          closePopover();
        }}
      />
    </>
  );
};
