type OrderTruckIconProps = {
  className?: string;
};

export default function OrderTruckIcon({ className }: OrderTruckIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        stroke="currentColor"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M112 39h181l-14 139h-60" />
        <path d="M157 178h-36" />
        <path d="M293 89h58l47 58v31h-25" />
        <path d="M293 89v89h25" />
        <path d="M348 92v54h47" />
        <path d="M20 91h83" />
        <path d="M39 128h60" />
        <path d="M62 165h48" />
        <circle cx="188" cy="187" r="31" />
        <circle cx="345" cy="187" r="31" />
      </g>
    </svg>
  );
}
