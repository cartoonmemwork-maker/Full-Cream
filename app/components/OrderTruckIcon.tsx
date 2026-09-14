type OrderTruckIconProps = {
  className?: string;
};

export default function OrderTruckIcon({ className }: OrderTruckIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 468 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M125 55h190l-13 122h-68" />
        <path d="M169 177h-37" />
        <path d="M315 98h65l48 55v24h-37" />
        <path d="M315 98v79h17" />
        <path d="M374 101v50h49" />
        <path d="M25 100h93" />
        <path d="M45 132h65" />
        <path d="M69 164h54" />
        <circle cx="201" cy="184" r="27" />
        <circle cx="361" cy="184" r="27" />
      </g>
    </svg>
  );
}
