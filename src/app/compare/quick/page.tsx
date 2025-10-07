'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMetalFactor, type MetalFactor } from '@/utils/datasets';
import styles from './page.module.scss';

export default function QuickComparePage() {
  const [aMaterial, setAMaterial] = useState('Aluminium');
  const [aProcess, setAProcess] = useState('Primary');
  const [bMaterial, setBMaterial] = useState('Steel');
  const [bProcess, setBProcess] = useState('Secondary');
  const [a, setA] = useState<MetalFactor | null>(null);
  const [b, setB] = useState<MetalFactor | null>(null);

  useEffect(() => { getMetalFactor(aMaterial, aProcess).then(setA); }, [aMaterial, aProcess]);
  useEffect(() => { getMetalFactor(bMaterial, bProcess).then(setB); }, [bMaterial, bProcess]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Quick Compare</h1>
        <div className={styles.controls}>
          <div>
            <div><strong>Left</strong></div>
            <div className={styles.row}>
          <strong>Left</strong>
              <select value={aMaterial} onChange={(e) => setAMaterial(e.target.value)}>
                {['Aluminium','Steel','Copper'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={aProcess} onChange={(e) => setAProcess(e.target.value)}>
                {['Primary','Secondary'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.card}>
            {a ? (
              <ul style={{ margin: 0 }}>
                <li>CO₂e: {a.co2e_kg_per_kg} kg/kg</li>
                <li>Energy: {a.energy_mj_per_kg} MJ/kg</li>
                <li>Water: {a.water_l_per_kg} L/kg</li>
              </ul>
            ) : 'Loading…'}
            </div>
          </div>

          <div>
            <div><strong>Right</strong></div>
            <div className={styles.row}>
              <select value={bMaterial} onChange={(e) => setBMaterial(e.target.value)}>
                {['Aluminium','Steel','Copper'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={bProcess} onChange={(e) => setBProcess(e.target.value)}>
                {['Primary','Secondary'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.card}>
            {b ? (
              <ul style={{ margin: 0 }}>
                <li>CO₂e: {b.co2e_kg_per_kg} kg/kg</li>
                <li>Energy: {b.energy_mj_per_kg} MJ/kg</li>
                <li>Water: {b.water_l_per_kg} L/kg</li>
              </ul>
            ) : 'Loading…'}
            </div>
          </div>
        </div>

        <Link href="/compare">Go to full Compare</Link>
      </div>
    </div>
  );
}


