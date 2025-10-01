'use client';

import { motion } from 'framer-motion';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import { getMetalFactor, type MetalFactor } from '@/utils/datasets';

export default function Compare() {
  const [leftMaterial, setLeftMaterial] = useState('Aluminium');
  const [leftProcess, setLeftProcess] = useState('Primary');
  const [rightMaterial, setRightMaterial] = useState('Aluminium');
  const [rightProcess, setRightProcess] = useState('Secondary');
  const [left, setLeft] = useState<MetalFactor | null>(null);
  const [right, setRight] = useState<MetalFactor | null>(null);

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
      </div>
    </motion.div>
  );
}
