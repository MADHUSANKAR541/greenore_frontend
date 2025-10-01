'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiLayers, FiClock, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import styles from './recent-scenarios.module.scss';

const scenarios = [
  {
    id: '1',
    name: 'Steel Production Optimization',
    status: 'completed',
    circularityScore: 85,
    lastRun: '2 hours ago',
    impact: '+12% efficiency'
  },
  {
    id: '2',
    name: 'Aluminum Recycling Analysis',
    status: 'running',
    circularityScore: 72,
    lastRun: 'Currently running',
    impact: 'In progress'
  },
  {
    id: '3',
    name: 'Copper Supply Chain LCA',
    status: 'completed',
    circularityScore: 91,
    lastRun: '1 day ago',
    impact: '+8% circularity'
  }
];

export function RecentScenarios() {
  return (
    <div className={styles.scenarios}>
      <div className={styles.scenarios__header}>
        <h2 className={styles.scenarios__title}>
          <FiLayers size={20} />
          Recent Scenarios
        </h2>
        <Link href="/scenarios" className={styles.scenarios__link}>
          View All
          <FiArrowRight size={16} />
        </Link>
      </div>

      <div className={styles.scenarios__list}>
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={styles.scenario}
          >
            <div className={styles.scenario__header}>
              <h3 className={styles.scenario__name}>{scenario.name}</h3>
              <span className={`${styles.scenario__status} ${styles[`scenario__status--${scenario.status}`]}`}>
                {scenario.status}
              </span>
            </div>
            
            <div className={styles.scenario__metrics}>
              <div className={styles.scenario__metric}>
                <span className={styles['scenario__metric-label']}>Circularity Score</span>
                <span className={styles['scenario__metric-value']}>{scenario.circularityScore}%</span>
              </div>
              <div className={styles.scenario__metric}>
                <span className={styles['scenario__metric-label']}>Last Run</span>
                <span className={styles['scenario__metric-value']}>
                  <FiClock size={14} />
                  {scenario.lastRun}
                </span>
              </div>
            </div>

            <div className={styles.scenario__impact}>
              <FiTrendingUp size={16} />
              <span>{scenario.impact}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.scenarios__footer}>
        <Link href="/scenarios/new" className={styles.scenarios__create}>
          <FiLayers size={16} />
          Create New Scenario
        </Link>
      </div>
    </div>
  );
}
