'use client';

import React, { useEffect, useState } from 'react';

export function DashboardMock({ className }: { className?: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % 6);
    }, 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className} aria-hidden>
      <div className="dashMock">
        {/* Top bar */}
        <div className="dashMock__top">
          <div className="dashMock__logo" />
          <div className="dashMock__tabs">
            <span className={step % 6 < 3 ? 'active' : ''}>Scenario</span>
            <span className={step % 6 >= 3 ? 'active' : ''}>Results</span>
          </div>
        </div>

        <div className="dashMock__grid">
          {/* Left form */}
          <div className="dashMock__panel dashMock__form">
            {[
              { label: 'Material', placeholder: 'Aluminium, Copper…' },
              { label: 'Process Route', placeholder: 'Primary, Secondary…' },
              { label: 'Energy Mix', placeholder: 'Grid, Gas, Renewables…' },
              { label: 'Transport', placeholder: 'Road, Sea, Rail…' },
            ].map((f, i) => (
              <div key={f.label} className={`dashMock__field ${step === i ? 'filling' : ''}`}>
                <div className="dashMock__label">{f.label}</div>
                <div className="dashMock__input">
                  <span>{f.placeholder}</span>
                </div>
              </div>
            ))}
            <div className={`dashMock__btn ${step === 4 ? 'pulse' : ''}`}>Estimate</div>
          </div>

          {/* Right charts */}
          <div className="dashMock__panel dashMock__charts">
            {/* Sankey-like flow */}
            <div className="dashMock__chartTitle">Material Flow</div>
            <svg className="dashMock__sankey" viewBox="0 0 200 120">
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--flow-color)" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="var(--flow-color-alt)" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path d={step % 6 < 3 ? 'M10 30 C 60 30, 60 90, 120 90 S 190 90, 190 60' : 'M10 40 C 60 40, 60 80, 120 80 S 190 80, 190 50'} fill="none" stroke="url(#flowGrad)" strokeWidth="10" strokeLinecap="round" className="dashMock__flow" />
            </svg>

            {/* Bars */}
            <div className="dashMock__bars">
              {[0,1,2,3].map((i) => (
                <div key={i} className="dashMock__bar">
                  <div
                    className="dashMock__barFill"
                    style={{ height: `${step % 6 < 3 ? [42, 68, 36, 54][i] : [58, 44, 62, 38][i]}%` }}
                  />
                  <span className="dashMock__barLabel">{['CO₂e','Energy','Water','Waste'][i]}</span>
                </div>
              ))}
            </div>

            {/* Export pulse */}
            <div className={`dashMock__export ${step === 5 ? 'exporting' : ''}`}>
              <span />
              <span />
              <em>Export PDF</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMock;
