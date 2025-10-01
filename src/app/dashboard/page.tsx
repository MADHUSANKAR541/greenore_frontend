'use client';

import { motion } from 'framer-motion';
import { Dashboard } from '@/components/dashboard/dashboard';

export default function DashboardPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Dashboard />
    </motion.div>
  );
}


