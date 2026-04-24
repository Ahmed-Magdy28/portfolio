export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="brand-gradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#0F2027" />
        </linearGradient>
      </defs>

      <path
        d="M35 20 L15 50 L35 80"
        stroke="url(#brand-gradient)"
        strokeWidth={8}
        fill="none"
      />
      <path
        d="M65 20 L85 50 L65 80"
        stroke="url(#brand-gradient)"
        strokeWidth={8}
        fill="none"
      />

      <path d="M42 65 L50 35 L58 65 Z" fill="#1FA463" />
    </svg>
  );
}
