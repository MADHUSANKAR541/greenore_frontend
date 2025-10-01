'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiPlay, FiEdit, FiTrash2, FiMoreVertical, FiClock, FiTarget } from 'react-icons/fi';
import styles from './scenario-card.module.scss';

interface Scenario {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'running' | 'draft';
  circularityScore: number;
  lastModified: string;
  tags: string[];
}

interface ScenarioCardProps {
  scenario: Scenario;
  viewMode: 'grid' | 'list';
}

export function ScenarioCard({ scenario, viewMode }: ScenarioCardProps) {
  const statusColors = {
    completed: 'green',
    running: 'orange',
    draft: 'gray'
  };

  const statusLabels = {
    completed: 'Completed',
    running: 'Running',
    draft: 'Draft'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${styles.card} ${styles[`card--${viewMode}`]}`}
    >
      <div className={styles.card__header}>
        <div className={styles.card__title}>
          <h3 className={styles.card__name}>{scenario.name}</h3>
          <span className={`${styles.card__status} ${styles[`card__status--${scenario.status}`]}`}>
            {statusLabels[scenario.status]}
          </span>
        </div>
        <button className={styles.card__menu}>
          <FiMoreVertical size={16} />
        </button>
      </div>

      <p className={styles.card__description}>{scenario.description}</p>

      <div className={styles.card__metrics}>
        <div className={styles.card__metric}>
          <FiTarget size={16} />
          <span className={styles['card__metric-label']}>Circularity</span>
          <span className={styles['card__metric-value']}>
            {scenario.circularityScore}%
          </span>
        </div>
        <div className={styles.card__metric}>
          <FiClock size={16} />
          <span className={styles['card__metric-label']}>Modified</span>
          <span className={styles['card__metric-value']}>
            {scenario.lastModified}
          </span>
        </div>
      </div>

      <div className={styles.card__tags}>
        {scenario.tags.map((tag) => (
          <span key={tag} className={styles.card__tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.card__actions}>
        <Link href={`/scenarios/${scenario.id}`} className={styles.card__action}>
          <FiPlay size={16} />
          {scenario.status === 'completed' ? 'View Results' : 'Continue'}
        </Link>
        <button className={styles.card__action}>
          <FiEdit size={16} />
          Edit
        </button>
        <button className={styles.card__action}>
          <FiTrash2 size={16} />
          Delete
        </button>
      </div>
    </motion.div>
  );
}

