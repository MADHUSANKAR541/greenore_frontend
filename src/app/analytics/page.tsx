'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';

type KPI = { label: string; value: string };

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pie, setPie] = useState<Array<{ label: string; value: number; color: string }>>([]);
  const [markers, setMarkers] = useState<Array<{ index: number; label: string; color?: string }>>([]);

  useEffect(() => {
    // Placeholder KPIs until backend endpoints are defined
    setKpis([
      { label: 'Total Scenarios', value: '12' },
      { label: 'Avg. Circularity', value: '63%' },
      { label: 'CO₂ Saved (YTD)', value: '18.2 t' },
    ]);

    // Demo time series
    setCategories(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);
    setSeries([42, 55, 48, 60, 71, 69, 75, 82, 78, 90, 95, 102]);

    // Demo pie segments
    setPie([
      { label: 'Aluminium', value: 36, color: '#60a5fa' },
      { label: 'Steel', value: 28, color: '#34d399' },
      { label: 'Copper', value: 18, color: '#f59e0b' },
      { label: 'Other', value: 18, color: '#f472b6' },
    ]);

    // Demo markers on the line chart
    setMarkers([
      { index: 3, label: 'Policy launch', color: '#f59e0b' }, // Apr
      { index: 7, label: 'Optimization', color: '#34d399' },   // Aug
      { index: 10, label: 'Peak', color: '#60a5fa' },          // Nov
    ]);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Analytics</h1>
        <div className={styles.kpis}>
          {kpis.map((k) => (
            <div key={k.label} className={styles.kpi}>
              <div className={styles.kpiLabel}>{k.label}</div>
              <div className={styles.kpiValue}>{k.value}</div>
            </div>
          ))}
        </div>
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Trends</h2>
          {/* Interactive line chart with mock annotations */}
          <LineChart categories={categories} values={series} markers={markers} />
        </div>
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Breakdown</h2>
          <PieChart data={pie} />
        </div>
      </div>
    </div>
  );
}

function LineChart({ categories, values, markers = [] as Array<{ index: number; label: string; color?: string }> }: { categories: string[]; values: number[]; markers?: Array<{ index: number; label: string; color?: string }> }) {
  if (!categories.length || !values.length) return null;
  const width = 720;
  const height = 240;
  const padding = 32;
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values) * 0.9;
  const toX = (i: number) => padding + (i / (values.length - 1)) * (width - padding * 2);
  const toY = (v: number) => padding + (1 - (v - min) / (max - min)) * (height - padding * 2);

  const points = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const gradientId = 'lineGradient';

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trend of scenarios over time">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-primary)" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--border-primary)" />
      {/* Labels */}
      {categories.map((c, i) => (
        <text key={c} x={toX(i)} y={height - padding + 16} fontSize="10" fill="var(--text-secondary)" textAnchor="middle">{c}</text>
      ))}
      {/* Area fill */}
      <polyline points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`} fill={`url(#${gradientId})`} stroke="none" />
      {/* Line */}
      <polyline points={points} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {/* Dots */}
      {values.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill="#60a5fa">
          <title>{categories[i]}: {v}</title>
        </circle>
      ))}
      {/* Markers with labels */}
      {markers.filter(m => m.index >= 0 && m.index < values.length).map((m, idx) => (
        <g key={`m-${idx}`}> 
          <line x1={toX(m.index)} y1={padding} x2={toX(m.index)} y2={height - padding} stroke={m.color || 'var(--text-secondary)'} strokeDasharray="4 4" opacity={0.6} />
          <circle cx={toX(m.index)} cy={toY(values[m.index])} r={5} fill={m.color || '#ef4444'} />
          <text x={toX(m.index)} y={toY(values[m.index]) - 8} fontSize="10" fill={m.color || 'var(--text-secondary)'} textAnchor="middle">{m.label}</text>
        </g>
      ))}
    </svg>
  );
}

function PieChart({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 90;
  const cx = 120;
  const cy = 120;
  let acc = 0;

  const arcs = data.map((d, i) => {
    const startAngle = (acc / total) * Math.PI * 2;
    acc += d.value;
    const endAngle = (acc / total) * Math.PI * 2;
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
    return { path, color: d.color, label: d.label, value: d.value };
  });

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <svg width="240" height="240" role="img" aria-label="Breakdown by material">
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill={a.color}>
            <title>{a.label}: {a.value}</title>
          </path>
        ))}
      </svg>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {data.map((d) => (
          <li key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: d.color }} />
            <span>{d.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


