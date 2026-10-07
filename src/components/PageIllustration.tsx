import React from 'react';

export function PageIllustration() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="max-w-none"
        width="1440"
        height="570"
        viewBox="0 0 1440 570"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="720"
          cy="-180"
          r="480"
          fill="url(#paint0_radial)"
          fillOpacity="0.4"
        />
        <circle
          cx="720"
          cy="-80"
          r="600"
          stroke="#E2E8F0"
          strokeOpacity="0.8"
          strokeWidth="1"
        />
        <circle
          cx="720"
          cy="-80"
          r="420"
          stroke="#E2E8F0"
          strokeOpacity="0.6"
          strokeWidth="1"
        />
        <circle
          cx="720"
          cy="-80"
          r="260"
          stroke="#E2E8F0"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <defs>
          <radialGradient
            id="paint0_radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(720 -180) rotate(90) scale(480)"
          >
            <stop stopColor="#3B82F6" stopOpacity="0.12" />
            <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
