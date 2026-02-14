import { SVGProps } from "react";

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 24"
    {...props}
    className={`${props.className ?? ""} fill-current`}
  >
    <g clipPath="url(#a)">
      <path
        className="text-[#4285F4]"
        d="M24.266 12.276c0-.816-.066-1.636-.207-2.438H12.74v4.62h6.482a5.554 5.554 0 0 1-2.399 3.647v2.999h3.867c2.27-2.09 3.576-5.177 3.576-8.828Z"
      />
      <path
        className="text-[#34A853]"
        d="M12.74 24c3.236 0 5.966-1.062 7.954-2.896l-3.867-2.998c-1.075.731-2.464 1.146-4.083 1.146-3.13 0-5.785-2.112-6.737-4.952h-3.99v3.091a12.002 12.002 0 0 0 10.723 6.61Z"
      />
      <path
        className="text-[#FBBC04]"
        d="M6.003 14.3a7.188 7.188 0 0 1 0-4.594V6.615H2.016a12.01 12.01 0 0 0 0 10.776l3.987-3.09Z"
      />
      <path
        className="text-[#EA4335]"
        d="M12.74 4.75a6.52 6.52 0 0 1 4.603 1.799l3.426-3.426A11.533 11.533 0 0 0 12.74 0 11.998 11.998 0 0 0 2.016 6.615l3.987 3.09C6.95 6.863 9.609 4.75 12.74 4.75Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h25v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default GoogleIcon;
