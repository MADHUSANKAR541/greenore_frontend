'use client';

import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import styles from './kpi-card.module.scss';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: IconType;
  color: 'blue' | 'green' | 'emerald' | 'purple' | 'orange' | 'red';
}

export function KpiCard({ title, value, change, trend, icon: Icon, color }: KpiCardProps) {
  const colorClasses = {
    blue: styles['kpi-card--blue'],
    green: styles['kpi-card--green'],
    emerald: styles['kpi-card--emerald'],
    purple: styles['kpi-card--purple'],
    orange: styles['kpi-card--orange'],
    red: styles['kpi-card--red'],
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${styles['kpi-card']} ${colorClasses[color]}`}
    >
      <div className={styles['kpi-card__header']}>
        <div className={styles['kpi-card__icon']}>
          <Icon size={24} />
        </div>
        <div className={styles['kpi-card__trend']}>
          <span className={`${styles['kpi-card__change']} ${styles[`kpi-card__change--${trend}`]}`}>
            {change}
          </span>
        </div>
      </div>
      
      <div className={styles['kpi-card__content']}>
        <h3 className={styles['kpi-card__title']}>{title}</h3>
        <p className={styles['kpi-card__value']}>{value}</p>
      </div>
    </motion.div>
  );
}
