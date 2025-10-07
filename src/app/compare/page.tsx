'use client';

import { motion } from 'framer-motion';
import styles from './page.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { getMetalFactor, type MetalFactor } from '@/utils/datasets';

export default function Compare() {
  const [leftMaterial, setLeftMaterial] = useState('Aluminium');
  const [leftProcess, setLeftProcess] = useState('Primary');
  const [rightMaterial, setRightMaterial] = useState('Aluminium');
  const [rightProcess, setRightProcess] = useState('Secondary');
  const [left, setLeft] = useState<MetalFactor | null>(null);
  const [right, setRight] = useState<MetalFactor | null>(null);
  const co2Delta = useDelta(left?.co2e_kg_per_kg, right?.co2e_kg_per_kg);
  const energyDelta = useDelta(left?.energy_mj_per_kg, right?.energy_mj_per_kg);
  const waterDelta = useDelta(left?.water_l_per_kg, right?.water_l_per_kg);
  const [tab, setTab] = useState<'summary' | 'details' | 'radar'>('summary');
  const query = useMemo(() => ({ l: leftMaterial, lp: leftProcess, r: rightMaterial, rp: rightProcess }), [leftMaterial, leftProcess, rightMaterial, rightProcess]);

  useEffect(() => {
    getMetalFactor(leftMaterial, leftProcess).then(setLeft);
  }, [leftMaterial, leftProcess]);

  useEffect(() => {
    getMetalFactor(rightMaterial, rightProcess).then(setRight);
  }, [rightMaterial, rightProcess]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.page}
    >
      <div className={styles.content}>
        <h1>Compare Scenarios</h1>
        <p>Select material and process to compare impacts</p>

        <div className={styles.controls}>
          <div>
            <label>Left</label>
            <div className={styles.row}>
              <select value={leftMaterial} onChange={(e) => setLeftMaterial(e.target.value)}>
                {['Aluminium','Steel','Copper'].map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
              <select value={leftProcess} onChange={(e) => setLeftProcess(e.target.value)}>
                {['Primary','Secondary'].map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label>Right</label>
            <div className={styles.row}>
              <select value={rightMaterial} onChange={(e) => setRightMaterial(e.target.value)}>
                {['Aluminium','Steel','Copper'].map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
              <select value={rightProcess} onChange={(e) => setRightProcess(e.target.value)}>
                {['Primary','Secondary'].map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button type="button" className={`${styles.tab} ${tab === 'summary' ? styles.tabActive : ''}`} onClick={() => setTab('summary')}>Summary</button>
          <button type="button" className={`${styles.tab} ${tab === 'details' ? styles.tabActive : ''}`} onClick={() => setTab('details')}>Details</button>
          <button type="button" className={`${styles.tab} ${tab === 'radar' ? styles.tabActive : ''}`} onClick={() => setTab('radar')}>Radar</button>
        </div>

        {/* Summary KPIs */}
        {tab === 'summary' && (
        <div className={styles.summary}>
          <div className={styles.kpis}>
            <div className={styles.kpi}>
              <div className={styles.kpi__label}>CO₂e (kg/kg)</div>
              <div className={styles.kpi__value}>{fmt(left?.co2e_kg_per_kg)} vs {fmt(right?.co2e_kg_per_kg)}</div>
              <div className={`${styles.kpi__delta} ${deltaClass(co2Delta)}`}>{deltaText(co2Delta)}</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpi__label}>Energy (MJ/kg)</div>
              <div className={styles.kpi__value}>{fmt(left?.energy_mj_per_kg)} vs {fmt(right?.energy_mj_per_kg)}</div>
              <div className={`${styles.kpi__delta} ${deltaClass(energyDelta)}`}>{deltaText(energyDelta)}</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpi__label}>Water (L/kg)</div>
              <div className={styles.kpi__value}>{fmt(left?.water_l_per_kg)} vs {fmt(right?.water_l_per_kg)}</div>
              <div className={`${styles.kpi__delta} ${deltaClass(waterDelta)}`}>{deltaText(waterDelta)}</div>
            </div>
          </div>
          <div className={styles.legend}>
            <span><i className={styles.dotLeft}></i> Left</span>
            <span><i className={styles.dotRight}></i> Right</span>
          </div>
          <div className={styles.bars}>
            <BarRow label="CO₂e" left={left?.co2e_kg_per_kg} right={right?.co2e_kg_per_kg} maxAxis={Math.max(left?.co2e_kg_per_kg || 0, right?.co2e_kg_per_kg || 0)} />
            <BarRow label="Energy" left={left?.energy_mj_per_kg} right={right?.energy_mj_per_kg} maxAxis={Math.max(left?.energy_mj_per_kg || 0, right?.energy_mj_per_kg || 0)} />
            <BarRow label="Water" left={left?.water_l_per_kg} right={right?.water_l_per_kg} maxAxis={Math.max(left?.water_l_per_kg || 0, right?.water_l_per_kg || 0)} />
          </div>
        </div>
        )}

        {/* Details Table */}
        {tab === 'details' && (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Metric</th>
                <th className={styles.th}>Left</th>
                <th className={styles.th}>Right</th>
                <th className={styles.th}>Delta</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.rowHover}>
                <td className={styles.td}>CO₂e (kg/kg)</td>
                <td className={styles.td}>{fmt(left?.co2e_kg_per_kg)}</td>
                <td className={styles.td}>{fmt(right?.co2e_kg_per_kg)}</td>
                <td className={styles.td}>{badge(co2Delta)}</td>
              </tr>
              <tr className={styles.rowHover}>
                <td className={styles.td}>Energy (MJ/kg)</td>
                <td className={styles.td}>{fmt(left?.energy_mj_per_kg)}</td>
                <td className={styles.td}>{fmt(right?.energy_mj_per_kg)}</td>
                <td className={styles.td}>{badge(energyDelta)}</td>
              </tr>
              <tr className={styles.rowHover}>
                <td className={styles.td}>Water (L/kg)</td>
                <td className={styles.td}>{fmt(left?.water_l_per_kg)}</td>
                <td className={styles.td}>{fmt(right?.water_l_per_kg)}</td>
                <td className={styles.td}>{badge(waterDelta)}</td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Radar */}
        {tab === 'radar' && (
          <div className={styles.radarWrap}>
            <div className={styles.radarCard}>
              <RadarChart left={left} right={right} />
              <div className={styles.radarLegend}>
                <span><i className={styles.dotLeft}></i> Left</span>
                <span><i className={styles.dotRight}></i> Right</span>
              </div>
            </div>
            <div>
              <p className={styles.hint}>Radar shows normalized scores (0-1) across metrics for quick shape comparison.</p>
            </div>
          </div>
        )}

        <div className={styles.compareGrid}>
          <div className={styles.card}>
            <h3>{leftMaterial} — {leftProcess}</h3>
            {left ? (
              <ul>
                <li>CO₂e: {left.co2e_kg_per_kg} kg/kg</li>
                <li>Energy: {left.energy_mj_per_kg} MJ/kg</li>
                <li>Water: {left.water_l_per_kg} L/kg</li>
              </ul>
            ) : <p>Loading…</p>}
          </div>
          <div className={styles.card}>
            <h3>{rightMaterial} — {rightProcess}</h3>
            {right ? (
              <ul>
                <li>CO₂e: {right.co2e_kg_per_kg} kg/kg</li>
                <li>Energy: {right.energy_mj_per_kg} MJ/kg</li>
                <li>Water: {right.water_l_per_kg} L/kg</li>
              </ul>
            ) : <p>Loading…</p>}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsBar}>
          <button className={styles.copyBtn} type="button" onClick={() => copyShareLink(query)}>Copy share link</button>
        </div>
      </div>
    </motion.div>
  );
}

function fmt(value?: number | null) {
  if (value === undefined || value === null) return '—';
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

function useDelta(a?: number | null, b?: number | null) {
  const valid = typeof a === 'number' && typeof b === 'number';
  if (!valid) return null as null | { pct: number; better: 'left' | 'right' | 'equal' };
  if (a === b) return { pct: 0, better: 'equal' };
  const higherIsWorse = true;
  const diff = (Math.max(a, b) - Math.min(a, b)) / Math.max(a, b);
  const better = a < b ? 'left' : 'right';
  return { pct: diff, better };
}

function deltaClass(delta: ReturnType<typeof useDelta>) {
  if (!delta || delta.pct === 0) return '';
  return delta.better === 'left' ? styles['kpi__delta--better'] : styles['kpi__delta--worse'];
}

function deltaText(delta: ReturnType<typeof useDelta>) {
  if (!delta) return '—';
  if (delta.pct === 0) return 'Equal';
  const pct = Math.round(delta.pct * 100);
  return `${pct}% ${delta.better} better`;
}

function BarRow({ label, left, right, maxAxis }: { label: string; left?: number | null; right?: number | null; maxAxis: number }) {
  const leftPct = maxAxis > 0 && typeof left === 'number' ? (left / maxAxis) * 100 : 0;
  const rightPct = maxAxis > 0 && typeof right === 'number' ? (right / maxAxis) * 100 : 0;
  return (
    <div className={styles.barRow}>
      <div className={styles.barLabel}>{label}</div>
      <div className={styles.barTrack}>
        <div className={styles.barLeft} style={{ width: `${leftPct}%` }} />
        <div className={styles.barRight} style={{ width: `${rightPct}%` }} />
      </div>
    </div>
  );
}

function badge(delta: ReturnType<typeof useDelta>) {
  if (!delta) return '—';
  if (delta.pct === 0) return 'Equal';
  const pct = Math.round(delta.pct * 100);
  const cls = delta.better === 'left' ? 'badgeBetter' : 'badgeWorse';
  return (<span className={(styles as Record<string, string>)[cls]}>{pct}% {delta.better} better</span>);
}

function RadarChart({ left, right }: { left: MetalFactor | null; right: MetalFactor | null }) {
  const metrics = [
    { key: 'co2e_kg_per_kg', label: 'CO₂e' },
    { key: 'energy_mj_per_kg', label: 'Energy' },
    { key: 'water_l_per_kg', label: 'Water' },
  ] as const;
  const valuesL = metrics.map(m => (left ? left[m.key] as number : 0));
  const valuesR = metrics.map(m => (right ? right[m.key] as number : 0));
  const max = Math.max(1, ...valuesL, ...valuesR);
  const norm = (v: number) => (v / max);
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const angle = (i: number) => (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
  const point = (i: number, val: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * radius * val, cy + Math.sin(a) * radius * val];
  };
  const poly = (vals: number[]) => vals.map((v, i) => point(i, norm(v))).map(([x, y]) => `${x},${y}`).join(' ');
  const grid = [0.25, 0.5, 0.75, 1];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* grid */}
      {grid.map((g) => (
        <circle key={g} cx={cx} cy={cy} r={radius * g} fill="none" stroke="var(--border-primary)" strokeDasharray="4 4" />
      ))}
      {/* axes */}
      {metrics.map((m, i) => {
        const [x, y] = point(i, 1);
        return <line key={m.key} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border-primary)" />;
      })}
      {/* polygons */}
      <polygon points={poly(valuesL)} fill="#60a5fa55" stroke="#60a5fa" />
      <polygon points={poly(valuesR)} fill="#34d39955" stroke="#34d399" />
      {/* labels */}
      {metrics.map((m, i) => {
        const [x, y] = point(i, 1.1);
        return <text key={m.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--text-secondary)" fontSize="12">{m.label}</text>;
      })}
    </svg>
  );
}

function copyShareLink(query: { l: string; lp: string; r: string; rp: string }) {
  const url = new URL(window.location.href);
  url.searchParams.set('l', query.l);
  url.searchParams.set('lp', query.lp);
  url.searchParams.set('r', query.r);
  url.searchParams.set('rp', query.rp);
  navigator.clipboard.writeText(url.toString());
}
