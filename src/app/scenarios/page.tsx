'use client';

import { motion } from 'framer-motion';
import { ScenariosPage } from '@/components/scenarios/scenarios-page';
import styles from './page.module.scss';

export default function Scenarios() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.page}
    >
      <ScenariosPage />
    </motion.div>
  );
}

