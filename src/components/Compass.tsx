export function Compass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <path d="M16 3 L18.2 16 L16 29 L13.8 16 Z" fill="#ff3b1f" />
      <path d="M3 16 L16 13.8 L29 16 L16 18.2 Z" fill="#f4e27a" opacity="0.85" />
      <circle cx="16" cy="16" r="2" fill="#08262e" stroke="#2ec4b6" />
    </svg>
  );
}
