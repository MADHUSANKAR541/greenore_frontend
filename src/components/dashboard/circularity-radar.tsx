'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiRefreshCw } from 'react-icons/fi';
import styles from './circularity-radar.module.scss';

const radarData = [
  { category: 'Material Efficiency', value: 85, max: 100 },
  { category: 'Energy Recovery', value: 72, max: 100 },
  { category: 'Waste Reduction', value: 91, max: 100 },
  { category: 'Recycling Rate', value: 78, max: 100 },
  { category: 'Circular Design', value: 68, max: 100 },
  { category: 'Supply Chain', value: 82, max: 100 }
];

export function CircularityRadar() {
  return (
    <div className={styles.radar}>
      <div className={styles.radar__header}>
        <h2 className={styles.radar__title}>
          <FiTarget size={20} />
          Circularity Analysis
        </h2>
        <button className={styles.radar__refresh}>
          <FiRefreshCw size={16} />
        </button>
      </div>

      <div className={styles.radar__content}>
        <div className={styles.radar__chart}>
          {/* Placeholder for actual radar chart - will be implemented with Plotly */}
          <div className={styles.radar__placeholder}>
            <div className={styles['radar__chart-area']}>
              <div className={styles.radar__center}>
                <span className={styles.radar__score}>79%</span>
                <span className={styles.radar__label}>Overall Score</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.radar__legend}>
          {radarData.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={styles['radar__legend-item']}
            >
              <div className={styles['radar__legend-dot']} />
              <div className={styles['radar__legend-content']}>
                <span className={styles['radar__legend-label']}>{item.category}</span>
                <span className={styles['radar__legend-value']}>{item.value}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.radar__footer}>
        <div className={styles.radar__insights}>
          <h4 className={styles['radar__insights-title']}>Key Insights</h4>
          <ul className={styles['radar__insights-list']}>
            <li>Waste Reduction is your strongest area at 91%</li>
            <li>Circular Design needs improvement (68%)</li>
            <li>Overall circularity score: 79%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

