'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './sidenav.module.scss';
import { 
  FiHome, 
  FiLayers, 
  FiGitMerge, 
  FiFileText, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiTrendingUp,
  FiBarChart2,
  FiCpu,
  FiActivity
} from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Scenarios', href: '/scenarios', icon: FiLayers },
  { name: 'Projects', href: '/projects', icon: FiBarChart2 },
  { name: 'ML Analysis', href: '/ml', icon: FiCpu },
  { name: 'Batch ML', href: '/ml/batch', icon: FiActivity },
  { name: 'Reports', href: '/reports', icon: FiFileText },
  { name: 'Compare', href: '/compare', icon: FiGitMerge },
  { name: 'Settings', href: '/settings', icon: FiSettings },
];

const quickActions = [
  { name: 'New Scenario', href: '/scenarios/new', icon: FiPlus },
  { name: 'Quick Compare', href: '/compare/quick', icon: FiTrendingUp },
  { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
];

interface SideNavProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SideNav({ isCollapsed, onToggle }: SideNavProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: isCollapsed ? '4rem' : '16rem' }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, // less aggressive
        damping: 25,    // smoother
        mass: 0.5       // more natural feel
      }}
      className={`${styles.sidenav} ${isCollapsed ? styles['sidenav--collapsed'] : styles['sidenav--open']}`}
      style={{ overflow: 'hidden', willChange: 'width' }}
    >
      {/* Inline toggle row */}

      {/* Navigation */}
      <nav className={styles['sidenav__nav']} role="navigation" aria-label="Sidebar">
        
        <div className={styles['sidenav__nav-section']}>
          <div className={styles['sidenav__section-header']}>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={styles['sidenav__section-title']}
                >
                  Navigation
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={onToggle}
              className={styles['sidenav__toggle']}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 26 }}
              >
                {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
              </motion.div>
            </button>
          </div>
          <ul className={styles['sidenav__nav-list']}>
            {navigation.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={styles['sidenav__nav-item']}
              >
                <Link
                  href={item.href}
                  className={`${styles['sidenav__nav-link']} ${
                    pathname === item.href ? styles['sidenav__nav-link--active'] : ''
                  }`}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon size={20} className={styles['sidenav__nav-icon']} />
                  <AnimatePresence>
                    {!isCollapsed && (
              <motion.span
                layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                transition={{ type: 'spring', stiffness: 520, damping: 32 }}
                        className={styles['sidenav__nav-text']}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className={styles['sidenav__nav-section']}>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className={styles['sidenav__section-title']}
              >
                Quick Actions
              </motion.div>
            )}
          </AnimatePresence>

          <ul className={styles['sidenav__nav-list']}>
            {quickActions.map((action, index) => (
              <motion.li
                key={action.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + navigation.length) * 0.05 }}
                className={styles['sidenav__nav-item']}
              >
                <Link
                  href={action.href}
                  className={`${styles['sidenav__nav-link']} ${styles['sidenav__nav-link--action']}`}
                  aria-current={pathname === action.href ? 'page' : undefined}
                  title={isCollapsed ? action.name : undefined}
                >
                  <action.icon size={20} className={styles['sidenav__nav-icon']} />
                  <AnimatePresence>
                    {!isCollapsed && (
              <motion.span
                layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                transition={{ type: 'spring', stiffness: 520, damping: 32 }}
                        className={styles['sidenav__nav-text']}
                      >
                        {action.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className={styles['sidenav__footer']}>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className={styles['sidenav__footer-content']}
            >
              <div className={styles['sidenav__footer-text']}>
                <div className={styles['sidenav__footer-title']}>GreenOre</div>
                <div className={styles['sidenav__footer-subtitle']}>AI-powered Circularity</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
