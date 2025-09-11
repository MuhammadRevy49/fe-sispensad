// components/LoadingDots.jsx
"use client";

export default function LoadingDots({ color = "var(--armycolor)", size = "2xl" }) {
  return (
    <div className="flex space-x-2">
      <span
        className="inline-block opacity-0 animate-pingDot"
        style={{ animationDelay: "0s", color: color, fontSize: `2.5rem` }}
      >
        •
      </span>
      <span
        className="inline-block opacity-0 animate-pingDot"
        style={{ animationDelay: "0.2s", color: color, fontSize: `2.5rem` }}
      >
        •
      </span>
      <span
        className="inline-block opacity-0 animate-pingDot"
        style={{ animationDelay: "0.4s", color: color, fontSize: `2.5rem` }}
      >
        •
      </span>

      {/* Animasi Dot */}
      <style jsx>{`
        @keyframes pingDot {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-pingDot {
          animation: pingDot 1s infinite;
        }
      `}</style>
    </div>
  );
}
