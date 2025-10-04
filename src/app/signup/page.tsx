'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, RegisterCredentials } from '@/services/auth.service';
import styles from '../auth/auth.module.scss';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const credentials: RegisterCredentials = {
        name,
        email,
        password,
        confirmPassword,
      };

      const result = await authService.register(credentials);
      
      if (result.success && result.data) {
        // Redirect to dashboard on successful registration
        router.push('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authWrap}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.sub}>Start your sustainable metals journey</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error} style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <label className={styles.label}>
            Name
            <input 
              type="text" 
              required 
              placeholder="Jane Doe" 
              className={styles.input} 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </label>
          <label className={styles.label}>
            Email
            <input 
              type="email" 
              required 
              placeholder="you@company.com" 
              className={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </label>
          <label className={styles.label}>
            Password
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className={styles.input} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </label>
          <label className={styles.label}>
            Confirm Password
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className={styles.input} 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </label>
          <button 
            className={styles.primaryBtn} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className={styles.meta}>Already have an account? <Link href="/login" className={styles.link}>Sign in</Link></p>
        <Link href="/" className={styles.linkSmall}>← Back to landing</Link>
      </motion.div>
    </div>
  );
}