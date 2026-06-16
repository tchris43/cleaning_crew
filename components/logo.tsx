import React from "react";

type LogoProps = {
  className?: string;
  variant?: "dark" | "white";
};

export default function Logo({ className = "h-[68px] w-auto md:h-[78px]", variant = "dark" }: LogoProps) {
  const color = variant === "white" ? "#FFFFFF" : "#20263F";
  const bubbleColor = variant === "white" ? "rgba(255, 255, 255, 0.4)" : "rgba(32, 38, 63, 0.2)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 350 140"
      role="img"
      aria-label="Clean Crew Detail"
      className={className}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <style>{`
          .logo-word {
            fill: ${color};
            font-family: 'Inter', sans-serif;
            font-size: 64px;
            font-weight: 800;
            letter-spacing: -2px;
            text-transform: uppercase;
            line-height: 1;
          }
          .logo-sub {
            fill: ${color};
            font-family: 'Inter', sans-serif;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 4px;
            text-transform: uppercase;
            opacity: 0.9;
          }
        `}</style>
      </defs>

      <g stroke={color} strokeOpacity="0.4" strokeWidth="1.6" fill="none">
        <circle cx="280" cy="50" r="22" stroke={bubbleColor} />
        <circle cx="310" cy="40" r="14" stroke={bubbleColor} />
        <circle cx="295" cy="20" r="10" stroke={bubbleColor} />
        <circle cx="320" cy="70" r="18" stroke={bubbleColor} />
      </g>

      <text x="4" y="52" className="logo-word">
        Clean
      </text>
      <text x="4" y="104" className="logo-word">
        Crew
      </text>
      <text x="6" y="136" className="logo-sub">
        Detail
      </text>
    </svg>
  );
}
