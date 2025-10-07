'use client';

import { motion } from 'framer-motion';
import styles from './page.module.scss';
import { useState } from 'react';

export default function Settings() {
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('you@company.com');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [apiKey, setApiKey] = useState('');

  function saveProfile(e: React.FormEvent) { e.preventDefault(); }
  function savePrefs(e: React.FormEvent) { e.preventDefault(); }
  function saveKeys(e: React.FormEvent) { e.preventDefault(); }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.page}
    >
      <div className={styles.content}>
        <h1>Settings</h1>
        <p>Manage your account and application settings</p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>Profile</h2>
            <form onSubmit={saveProfile} className={styles.form}>
              <label>
                <span>Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                <span>Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <button type="submit">Save Profile</button>
            </form>
          </section>

          <section className={styles.card}>
            <h2>Preferences</h2>
            <form onSubmit={savePrefs} className={styles.form}>
              <label>
                <span>Units</span>
                <select value={units} onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}>
                  <option value="metric">Metric (kg, MJ, L)</option>
                  <option value="imperial">Imperial (lb, BTU, gal)</option>
                </select>
              </label>
              <label>
                <span>Theme</span>
                <select value={theme} onChange={(e) => setTheme(e.target.value as 'system' | 'light' | 'dark')}>
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <button type="submit">Save Preferences</button>
            </form>
          </section>

          <section className={styles.card}>
            <h2>API Keys</h2>
            <form onSubmit={saveKeys} className={styles.form}>
              <label>
                <span>GreenOre API Key</span>
                <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk_live_***" />
              </label>
              <button type="submit">Save Keys</button>
            </form>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

