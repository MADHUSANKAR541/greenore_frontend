'use client';

import React from 'react';

type GlobeProps = {
  className?: string;
};

export function Globe({ className }: GlobeProps) {
  return (
    <div className={className} aria-hidden>
      <svg
        className="globeSvg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <radialGradient id="metal" cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="var(--globe-spec)" stopOpacity="0.9" />
            <stop offset="35%" stopColor="var(--globe-mid)" stopOpacity="1" />
            <stop offset="70%" stopColor="var(--globe-deep)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--globe-edge)" stopOpacity="1" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* clip to sphere */}
          <clipPath id="sphereClip">
            <circle cx="100" cy="100" r="84" />
          </clipPath>
        </defs>

        {/* Rotating group (sphere + nodes + flows) */}
        <g className="globeRotate">
          {/* Sphere */}
          <circle cx="100" cy="100" r="84" fill="url(#metal)" />

          {/* Specular sweep */}
          <g clipPath="url(#sphereClip)">
            <ellipse cx="80" cy="72" rx="36" ry="16" fill="var(--globe-spec)" opacity="0.18" className="specular" />
          </g>

          {/* Equator highlight ring */}
          <g filter="url(#softGlow)">
            <ellipse cx="100" cy="100" rx="74" ry="24" fill="none" stroke="var(--globe-ring)" strokeOpacity="0.35" />
          </g>
          {/* Circular flows */}
          <g filter="url(#strongGlow)">
            <circle cx="100" cy="100" r="40" fill="none" stroke="var(--flow-color)" strokeWidth="1.2" opacity="0.65" className="flowDash flow1" />
            <circle cx="100" cy="100" r="54" fill="none" stroke="var(--flow-color-alt)" strokeWidth="1.2" opacity="0.55" className="flowDash flow2" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="var(--flow-color)" strokeWidth="1" opacity="0.4" className="flowDash flow3" />
          </g>

          {/* Nodes */}
          {[ 
            { x: 145, y: 86 },
            { x: 128, y: 128 },
            { x: 72, y: 120 },
            { x: 64, y: 80 },
            { x: 100, y: 56 },
          ].map((n, idx) => (
            <g key={idx} className="node" filter="url(#strongGlow)">
              <circle cx={n.x} cy={n.y} r="2.6" fill="var(--node-core)" />
              <circle cx={n.x} cy={n.y} r="6.5" fill="none" stroke="var(--node-glow)" strokeOpacity="0.7" />
              <circle cx={n.x} cy={n.y} r="5" fill="none" stroke="var(--flow-color)" strokeWidth="0.8" className="ripple" />
            </g>
          ))}

          {/* Simple connection arcs */}
          <g strokeLinecap="round" filter="url(#softGlow)">
            <path d="M145 86 A48 48 0 0 1 128 128" fill="none" stroke="var(--flow-color)" strokeWidth="1.5" className="pulse" />
            <path d="M72 120 A60 60 0 0 0 64 80" fill="none" stroke="var(--flow-color-alt)" strokeWidth="1.5" className="pulse delay" />
          </g>

          {/* Orbiting particles */}
          <g className="orbit orbitA" transform="rotate(0 100 100)">
            <circle cx="100" cy="32" r="2.4" fill="var(--node-core)" />
          </g>
          <g className="orbit orbitB" transform="rotate(90 100 100)">
            <circle cx="100" cy="32" r="2" fill="var(--node-core)" />
          </g>
          <g className="orbit orbitC" transform="rotate(200 100 100)">
            <circle cx="100" cy="32" r="1.8" fill="var(--node-core)" />
          </g>
        </g>

        {/* Subtle outer glow (static frame) */}
        <g opacity="0.35">
          <circle cx="100" cy="100" r="86" fill="none" stroke="var(--globe-ring)" />
        </g>
      </svg>
    </div>
  );
}

export default Globe;


