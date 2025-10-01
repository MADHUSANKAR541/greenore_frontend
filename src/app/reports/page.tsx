'use client';

import { motion } from 'framer-motion';
import styles from './page.module.scss';
import { useMemo, useState } from 'react';
import { FiDownload, FiFileText, FiSearch } from 'react-icons/fi';

type ReportItem = {
  id: string;
  name: string;
  scenario: string;
  createdAt: string;
  sizeMb: number;
  format: 'PDF' | 'CSV';
};

const mockReports: ReportItem[] = [
  { id: 'r1', name: 'Aluminium Recycling — Summary', scenario: 'Aluminium Recycling Analysis', createdAt: '2025-09-12 14:20', sizeMb: 1.2, format: 'PDF' },
  { id: 'r2', name: 'Steel Production — Full LCA', scenario: 'Steel Production Optimization', createdAt: '2025-09-10 09:02', sizeMb: 2.7, format: 'PDF' },
  { id: 'r3', name: 'Copper Supply — KPIs', scenario: 'Copper Supply Chain LCA', createdAt: '2025-09-08 17:41', sizeMb: 0.6, format: 'CSV' },
];

export default function Reports() {
  const [q, setQ] = useState('');

  const reports = useMemo(() => {
    const t = q.toLowerCase();
    return mockReports.filter(r => r.name.toLowerCase().includes(t) || r.scenario.toLowerCase().includes(t));
  }, [q]);

  function download(r: ReportItem) {
    // Mock download: generate a tiny blob
    const blob = new Blob([`Report: ${r.name}\nScenario: ${r.scenario}\nGenerated: ${r.createdAt}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.name}.${r.format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.page}
    >
      <div className={styles.content}>
        <h1>Reports</h1>
        <p>View and download your generated reports</p>

        <div className={styles.actions}>
          <div className={styles.search}>
            <FiSearch size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reports or scenarios" />
          </div>
        </div>

        <div className={styles.list}>
          {reports.map((r) => (
            <div key={r.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.icon}><FiFileText size={18} /></div>
                <div>
                  <div className={styles.title}>{r.name}</div>
                  <div className={styles.meta}>{r.scenario} • {r.createdAt}</div>
                </div>
              </div>
              <div className={styles.itemActions}>
                <span className={styles.badge}>{r.format}</span>
                <span className={styles.badgeMuted}>{r.sizeMb.toFixed(1)} MB</span>
                <button className={styles.download} onClick={() => download(r)}>
                  <FiDownload size={16} /> Download
                </button>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className={styles.empty}>No reports found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

