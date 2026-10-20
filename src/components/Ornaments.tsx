import { cn } from "@/lib/utils";

// Purely decorative, hand-printed label ornaments (olive sprig, lemon, wavy rule).

const leaves = [
  { x: 30, y: 60, r: -35 },
  { x: 52, y: 48, r: 30 },
  { x: 70, y: 74, r: -40 },
  { x: 92, y: 60, r: 25 },
  { x: 110, y: 88, r: -45 },
  { x: 132, y: 76, r: 20 },
  { x: 150, y: 104, r: -50 },
];

export function OliveSprig({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 180 140" className={cn("pointer-events-none", className)}>
      <path
        d="M8 40 C 50 55, 100 75, 172 128"
        className="stroke-olive"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx="17"
          ry="6"
          transform={`rotate(${l.r} ${l.x} ${l.y})`}
          className="fill-olive"
          opacity={i % 2 ? 0.75 : 0.95}
        />
      ))}
    </svg>
  );
}

export function Lemon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 60 60" className={cn("pointer-events-none", className)}>
      <ellipse cx="30" cy="31" rx="25" ry="23" className="fill-lemon" />
      <path
        d="M22 18 l3 6 M30 15 v7 M38 18 l-3 6"
        className="stroke-card"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WaveRule({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 240 16" className={cn("pointer-events-none", className)}>
      <path
        d="M4 8 q 14 -10 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0"
        className="stroke-primary"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
