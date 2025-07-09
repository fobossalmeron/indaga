import { SVGProps } from "react";

interface StarProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Star({ size = 24, ...props }: StarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.75 0V31.5174"
        stroke="currentColor"
        strokeWidth="1.87296"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M4.61328 4.61621L26.8874 26.9012"
        stroke="currentColor"
        strokeWidth="1.87296"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M26.8874 4.61621L4.61328 26.9012"
        stroke="currentColor"
        strokeWidth="1.87296"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M31.4995 15.7588H0"
        stroke="currentColor"
        strokeWidth="1.87296"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
