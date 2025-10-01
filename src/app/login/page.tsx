'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '../auth/auth.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.authWrap}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to continue</p>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.label}>
            Email
            <input type="email" required placeholder="you@company.com" className={styles.input} />
          </label>
          <label className={styles.label}>
            Password
            <input type="password" required placeholder="••••••••" className={styles.input} />
          </label>
          <button className={styles.primaryBtn} type="submit">Sign in</button>
        </form>
        <p className={styles.meta}>No account? <Link href="/signup" className={styles.link}>Create one</Link></p>
        <Link href="/" className={styles.linkSmall}>← Back to landing</Link>
      </motion.div>
    </div>
  );
}


