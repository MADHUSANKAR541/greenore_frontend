'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { ScenarioCard } from './scenario-card';
import { ScenarioWizard } from './scenario-wizard';
import styles from './scenarios-page.module.scss';

type ScenarioStatus = 'completed' | 'running' | 'draft';
type ScenarioItem = {
  id: string;
  name: string;
  description: string;
  status: ScenarioStatus;
  circularityScore: number;
  lastModified: string;
  tags: string[];
};

const mockScenarios: ScenarioItem[] = [
  {
    id: '1',
    name: 'Steel Production Optimization',
    description: 'Comprehensive LCA analysis for steel production with circularity focus',
    status: 'completed',
    circularityScore: 85,
    lastModified: '2 hours ago',
    tags: ['Steel', 'Production', 'Optimization']
  },
  {
    id: '2',
    name: 'Aluminum Recycling Analysis',
    description: 'End-to-end analysis of aluminum recycling processes',
    status: 'running',
    circularityScore: 72,
    lastModified: 'Currently running',
    tags: ['Aluminum', 'Recycling', 'Circularity']
  },
  {
    id: '3',
    name: 'Copper Supply Chain LCA',
    description: 'Full lifecycle assessment of copper supply chain',
    status: 'completed',
    circularityScore: 91,
    lastModified: '1 day ago',
    tags: ['Copper', 'Supply Chain', 'LCA']
  },
  {
    id: '4',
    name: 'Titanium Manufacturing',
    description: 'Advanced titanium production with sustainability metrics',
    status: 'draft',
    circularityScore: 0,
    lastModified: '3 days ago',
    tags: ['Titanium', 'Manufacturing', 'Draft']
  }
];

export function ScenariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showWizard, setShowWizard] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredScenarios = mockScenarios.filter(scenario => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scenario.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.scenarios}>
      {/* Header */}
      <div className={styles.scenarios__header}>
        <div className={styles.scenarios__title}>
          <h1 className={styles.scenarios__heading}>Scenarios</h1>
          <p className={styles.scenarios__subtitle}>
            Manage and analyze your LCA scenarios
          </p>
        </div>
        <button 
          onClick={() => setShowWizard(true)}
          className={styles.scenarios__create}
        >
          <FiPlus size={20} />
          New Scenario
        </button>
      </div>

      {/* Filters and Search */}
      <div className={styles.scenarios__filters}>
        <div className={styles.scenarios__search}>
          <FiSearch size={20} />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles['scenarios__search-input']}
          />
        </div>
        
        <div className={styles.scenarios__controls}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.scenarios__filter}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="draft">Draft</option>
          </select>
          
          <div className={styles['scenarios__view-toggle']}>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles['scenarios__view-btn']} ${viewMode === 'grid' ? styles['scenarios__view-btn--active'] : ''}`}
            >
              <FiGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles['scenarios__view-btn']} ${viewMode === 'list' ? styles['scenarios__view-btn--active'] : ''}`}
            >
              <FiList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scenarios Grid/List */}
      <div className={`${styles.scenarios__content} ${styles[`scenarios__content--${viewMode}`]}`}>
        {filteredScenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ScenarioCard scenario={scenario} viewMode={viewMode} />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredScenarios.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.scenarios__empty}
        >
          <div className={styles['scenarios__empty-content']}>
            <h3>No scenarios found</h3>
            <p>Try adjusting your search or create a new scenario</p>
            <button 
              onClick={() => setShowWizard(true)}
              className={styles['scenarios__empty-action']}
            >
              <FiPlus size={16} />
              Create First Scenario
            </button>
          </div>
        </motion.div>
      )}

      {/* Scenario Wizard Modal */}
      {showWizard && (
        <ScenarioWizard 
          onClose={() => setShowWizard(false)}
          onComplete={() => {
            setShowWizard(false);
            // Handle scenario creation completion
          }}
        />
      )}
    </div>
  );
}

