'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './navbar.module.scss';
import { 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon, 
  FiUser, 
  FiSettings,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';

// Sidebar handles navigation; keep navbar minimal (brand + actions)
const navigation: never[] = [];

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const update = () => setIsAuthed(!!(typeof window !== 'undefined' && localStorage.getItem('jwt_token')));
    update();
    const onStorage = (e: StorageEvent) => { if (e.key === 'jwt_token') update(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => {
    setTheme((resolvedTheme ?? 'system') === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar__container']}>
        {/* Logo */}
        <div className={styles['navbar__brand']}>
          <Link href="/" className={styles['navbar__logo']}>
            <span className={styles['navbar__logo-text']}>GreenOre</span>
          </Link>
        </div>

        {/* Desktop Navigation removed (handled by SideNav) */}
        <div className={styles['navbar__nav-desktop']} />

        {/* Right side actions */}
        <div className={styles['navbar__actions']}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={styles['navbar__theme-toggle']}
            aria-label="Toggle theme"
          >
            <motion.div
              key={mounted ? resolvedTheme : 'initial'}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {mounted ? (resolvedTheme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />) : null}
            </motion.div>
          </button>

          {/* Auth-aware actions */}
          {isAuthed ? (
            <div className={styles['navbar__user-menu']}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={styles['navbar__user-button']}
                aria-label="User menu"
              >
                <FiUser size={20} />
                <FiChevronDown 
                  size={16} 
                  className={`${styles['navbar__user-chevron']} ${
                    isUserMenuOpen ? styles['navbar__user-chevron--open'] : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={styles['navbar__user-dropdown']}
                  >
                    <Link href="/settings" className={styles['navbar__user-item']}>
                      <FiSettings size={16} />
                      Settings
                    </Link>
                    <button className={styles['navbar__user-item']} onClick={() => { localStorage.removeItem('jwt_token'); setIsUserMenuOpen(false); setIsAuthed(false); router.push('/'); }}>
                      <FiLogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={styles['navbar__auth']}>
              <Link href="/login" className={styles['navbar__auth-btn']}>Login</Link>
              <Link href="/signup" className={`${styles['navbar__auth-btn']} ${styles['navbar__auth-primary']}`}>Sign up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles['navbar__mobile-toggle']}
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation removed (handled by SideNav) */}
    </nav>
  );
}
