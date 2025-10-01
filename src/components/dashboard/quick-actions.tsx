'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiPlus, 
  FiGitMerge, 
  FiFileText, 
  FiTrendingUp,
  FiZap,
  FiTarget,
  FiBarChart2
} from 'react-icons/fi';
import styles from './quick-actions.module.scss';

const actions = [
  {
    title: 'New Scenario',
    description: 'Create a new LCA scenario',
    icon: FiPlus,
    href: '/scenarios/new',
    color: 'blue'
  },
  {
    title: 'Quick Compare',
    description: 'Compare existing scenarios',
    icon: FiGitMerge,
    href: '/compare/quick',
    color: 'green'
  },
  {
    title: 'Generate Report',
    description: 'Create detailed reports',
    icon: FiFileText,
    href: '/reports/new',
    color: 'purple'
  },
  {
    title: 'Optimize',
    description: 'AI-powered optimization',
    icon: FiZap,
    href: '/optimize',
    color: 'orange'
  }
];

export function QuickActions() {
  return (
    <div className={styles.actions}>
      <div className={styles.actions__header}>
        <h2 className={styles.actions__title}>
          <FiTarget size={20} />
          Quick Actions
        </h2>
      </div>

      <div className={styles.actions__grid}>
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={action.href} className={`${styles.action} ${styles[`action--${action.color}`]}`}>
              <div className={styles.action__icon}>
                <action.icon size={24} />
              </div>
              <div className={styles.action__content}>
                <h3 className={styles.action__title}>{action.title}</h3>
                <p className={styles.action__description}>{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className={styles.actions__footer}>
        <Link href="/analytics" className={styles.actions__analytics}>
          <FiBarChart2 size={16} />
          View Analytics Dashboard
        </Link>
      </div>
    </div>
  );
}
