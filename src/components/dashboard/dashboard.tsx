'use client';

import { circIn, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FiTrendingUp, 
  FiLayers, 
  FiFileText,
  FiPlus,
  FiArrowRight,
  FiActivity,
  FiTarget,
  FiZap
} from 'react-icons/fi';
import { KpiCard } from '@/components/dashboard/kpi-card';
import type { IconType } from 'react-icons';
import type { } from 'react';
import { RecentScenarios } from '@/components/dashboard/recent-scenarios';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { CircularityRadar } from '@/components/dashboard/circularity-radar';
import styles from './dashboard.module.scss';
import { useRouter } from 'next/navigation';

interface KpiCardData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: IconType;
  color: 'blue' | 'green' | 'emerald' | 'purple' | 'orange' | 'red';
}


const kpiData: KpiCardData[] = [
  {
    title: 'Total Scenarios',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: FiLayers,
    color: 'blue'
  },
  {
    title: 'Avg. Circularity Score',
    value: '78%',
    change: '+5%',
    trend: 'up',
    icon: FiTarget,
    color: 'green'
  },
  {
    title: 'CO₂ Saved (kg)',
    value: '2,847',
    change: '+18%',
    trend: 'up',
    icon: FiActivity,
    color: 'emerald'
  },
  {
    title: 'Optimizations',
    value: '156',
    change: '+23%',
    trend: 'up',
    icon: FiZap,
    color: 'purple'
  }
];

export function Dashboard() {
  const router = useRouter();
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className={styles.dashboard}>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className={styles.hero}
      >
        <div className={styles.hero__content}>
          <motion.h1 
            className={styles.hero__title}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Welcome to GreenOre
          </motion.h1>
          <motion.p 
            className={styles.hero__subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered circularity and LCA analysis for sustainable metals
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.hero__actions}
          >
            <button className={styles.hero__primary} onClick={() => router.push('/scenarios/new')}>
              <FiPlus size={20} />
              New Scenario
            </button>
            <button className={styles.hero__secondary}>
              Learn More
              <FiArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* KPI Cards */}
      <motion.section
        ref={statsRef}
        initial={{ opacity: 0, y: 30 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className={styles.stats}
      >
        <div className={styles.stats__grid}>
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <KpiCard {...kpi} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Content Grid */}
      <div className={styles.content}>
        <div className={styles.content__grid}>
          {/* Recent Scenarios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={styles.content__item}
          >
            <RecentScenarios />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={styles.content__item}
          >
            <QuickActions />
          </motion.div>

          {/* Circularity Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`${styles.content__item} ${styles['content__item--wide']}`}
          >
            <CircularityRadar />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
