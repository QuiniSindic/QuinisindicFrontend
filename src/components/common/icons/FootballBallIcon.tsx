import { SVGProps } from 'react';

const FootballBall = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: '16px', display: 'inline-block', ...props.style }}
      {...props}
    >
      <g clipPath="url(#clip0_1_842)">
        <path d="M9.49999 5.83008L6.73999 6.83008V9.85008L8.81999 10.6601L10.89 8.37008L9.49999 5.83008Z" />
        <path d="M7 0C3.14 0 0 3.14 0 7C0 10.86 3.14 14 7 14C10.86 14 14 10.86 14 7C14 3.14 10.86 0 7 0ZM7 12.26C6.03 12.26 5.12 11.99 4.34 11.53L4.59 10.15L3.04 8.42L2.1 8.9C1.87 8.31 1.74 7.67 1.74 7C1.74 6.94 1.74 6.88 1.74 6.83L3.75 6.11L4.41 3.63L3.49 3.08C4.42 2.25 5.64 1.73 6.99 1.73C7.09 1.73 7.18 1.73 7.28 1.74L6.99 2.81L9.71 3.96L10.59 3.15C11.61 4.11 12.26 5.47 12.26 6.98C12.26 9.88 9.9 12.25 7 12.25V12.26Z" />
      </g>
      <defs>
        <clipPath id="clip0_1_842">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FootballBall;
