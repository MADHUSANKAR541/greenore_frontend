'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authService, LoginCredentials } from '@/services/auth.service';
import styles from '../auth/auth.module.scss';

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.data) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.authWrap}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to continue</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error} style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <label className={styles.label}>
            Email
            <input 
              type="email" 
              name="email"
              required 
              placeholder="you@company.com" 
              className={styles.input}
              value={credentials.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </label>
          <label className={styles.label}>
            Password
            <input 
              type="password" 
              name="password"
              required 
              placeholder="••••••••" 
              className={styles.input}
              value={credentials.password}
              onChange={handleInputChange}
              disabled={loading}
            />
          </label>
          <button 
            className={styles.primaryBtn} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className={styles.meta}>No account? <Link href="/signup" className={styles.link}>Create one</Link></p>
        <Link href="/" className={styles.linkSmall}>← Back to landing</Link>
      </motion.div>
    </div>
  );
}


