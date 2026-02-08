import { SVGProps } from 'react';

const PenaltyMissedIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 14 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: 16, display: 'inline-block', ...(props.style || {}) }}
      {...props}
    >
      <title>Penal fallado</title>
      <path d="M12.6667 0H12H1.33333H0V6H1.33333V1.33333H12V6H13.3333V0H12.6667Z" />
      <path d="M9.27328 5.44666L6.65995 8.06666L4.07328 5.47999L3.13328 6.42666L5.71328 9.00666L3.11328 11.6133L4.05995 12.5533L6.65995 9.95332L9.25995 12.5533L10.1999 11.6133L7.59995 9.00666L10.2199 6.39332L9.27328 5.44666Z" />
    </svg>
  );
};

export default PenaltyMissedIcon;
