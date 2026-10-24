import { cn } from "@/lib/utils";

type RobotPosterProps = {
  /** Increments on each click/tap to replay the hop animation. */
  hopKey: number;
  className?: string;
};

/**
 * Lightweight SVG version of the AI companion for phones, tablets and
 * low-power devices: no WebGL, no per-frame JS — just a few compositor-friendly
 * CSS transforms. Hover (on the parent `.group`) makes it smile; a tap hops.
 */
export function RobotPoster({ hopKey, className }: RobotPosterProps) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", className)} aria-hidden>
      <svg viewBox="0 0 400 300" className="h-full max-h-[22rem] w-full max-w-[34rem] overflow-visible">
        <defs>
          <linearGradient id="robot-shell" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#e3e8f6" />
            <stop offset="1" stopColor="#b9c4e2" />
          </linearGradient>
          <linearGradient id="robot-visor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#151c33" />
            <stop offset="1" stopColor="#02040a" />
          </linearGradient>
          <radialGradient id="robot-glow">
            <stop offset="0" stopColor="#7d9bff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#3866f2" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="robot-pad">
            <stop offset="0" stopColor="#3866f2" stopOpacity="0.55" />
            <stop offset="1" stopColor="#3866f2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Hover pad */}
        <ellipse cx="200" cy="268" rx="120" ry="26" fill="url(#robot-pad)" />
        <ellipse cx="200" cy="268" rx="78" ry="13" fill="none" stroke="#7d9bff" strokeOpacity="0.75" strokeWidth="2" />
        <ellipse cx="200" cy="268" rx="52" ry="8" fill="none" stroke="#3866f2" strokeOpacity="0.5" strokeWidth="1.5" />

        {/* Orbiting workflow cards (static positions, gentle bob) */}
        {[
          { x: 38, y: 126, delay: "0s" },
          { x: 300, y: 92, delay: "-1.2s" },
          { x: 290, y: 208, delay: "-2.4s" },
        ].map((card) => (
          <g key={card.x} className="robot-bob" style={{ animationDelay: card.delay }}>
            <rect x={card.x} y={card.y} width="66" height="42" rx="8" fill="#0b1024" fillOpacity="0.92" stroke="#3866f2" strokeOpacity="0.55" />
            <circle cx={card.x + 12} cy={card.y + 13} r="4" fill="#9db3ff" />
            <rect x={card.x + 21} y={card.y + 10} width="34" height="5" rx="2.5" fill="#3866f2" fillOpacity="0.8" />
            <rect x={card.x + 9} y={card.y + 22} width="46" height="4" rx="2" fill="#3866f2" fillOpacity="0.55" />
            <rect x={card.x + 9} y={card.y + 30} width="32" height="4" rx="2" fill="#3866f2" fillOpacity="0.55" />
          </g>
        ))}
        <g stroke="#3866f2" strokeOpacity="0.25" strokeWidth="1">
          <line x1="200" y1="198" x2="104" y2="147" />
          <line x1="200" y1="198" x2="300" y2="113" />
          <line x1="200" y1="198" x2="290" y2="229" />
        </g>

        {/* key forces the hop animation to restart on each tap */}
        <g key={hopKey} className={cn("robot-body", hopKey > 0 && "robot-hop")}>
          <g className="robot-float">
            {/* Floating hands */}
            <circle className="robot-bob" cx="128" cy="206" r="13" fill="url(#robot-shell)" />
            <circle className="robot-bob" style={{ animationDelay: "-1.1s" }} cx="272" cy="206" r="13" fill="url(#robot-shell)" />

            {/* Body + AI core */}
            <rect x="150" y="166" width="100" height="74" rx="36" fill="url(#robot-shell)" />
            <circle cx="200" cy="198" r="22" fill="url(#robot-glow)" className="robot-pulse" />
            <circle cx="200" cy="198" r="14" fill="none" stroke="#2138b8" strokeWidth="4" />
            <circle cx="200" cy="198" r="8" fill="#9db3ff" />
            <rect x="187" y="152" width="26" height="16" rx="5" fill="#2138b8" />

            {/* Head */}
            <circle cx="200" cy="30" r="16" fill="url(#robot-glow)" className="robot-pulse" />
            <line x1="200" y1="52" x2="200" y2="33" stroke="#2138b8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="200" cy="30" r="6" fill="#9db3ff" />
            <circle cx="128" cy="104" r="15" fill="#2138b8" />
            <circle cx="272" cy="104" r="15" fill="#2138b8" />
            <circle cx="128" cy="104" r="9" fill="none" stroke="#7d9bff" strokeWidth="2.5" />
            <circle cx="272" cy="104" r="9" fill="none" stroke="#7d9bff" strokeWidth="2.5" />
            <ellipse cx="200" cy="102" rx="74" ry="58" fill="url(#robot-shell)" />
            <ellipse cx="200" cy="106" rx="58" ry="39" fill="url(#robot-visor)" />
            <path d="M152 92 Q170 74 205 72" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="5" strokeLinecap="round" />

            {/* Eyes: blink on a loop, squint happily on hover */}
            <g className="robot-eyes">
              <circle cx="181" cy="104" r="20" fill="url(#robot-glow)" opacity="0.6" />
              <circle cx="219" cy="104" r="20" fill="url(#robot-glow)" opacity="0.6" />
              <rect x="173" y="91" width="16" height="26" rx="8" fill="#a9bdff" />
              <rect x="211" y="91" width="16" height="26" rx="8" fill="#a9bdff" />
            </g>
            <path
              className="robot-smile"
              d="M187 124 Q200 135 213 124"
              fill="none"
              stroke="#a9bdff"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
