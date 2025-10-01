'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import styles from './scenario-wizard.module.scss';

interface ScenarioWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  { id: 'material', title: 'Material Selection', description: 'Choose the primary material for your analysis' },
  { id: 'route', title: 'Production Route', description: 'Define the production process and supply chain' },
  { id: 'energy', title: 'Energy Sources', description: 'Specify energy inputs and renewable content' },
  { id: 'transport', title: 'Transportation', description: 'Define logistics and transportation methods' },
  { id: 'eol', title: 'End of Life', description: 'Configure recycling and disposal scenarios' }
];

export function ScenarioWizard({ onClose, onComplete }: ScenarioWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Handle form submission
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.overlay}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className={styles.wizard}
        >
          {/* Header */}
          <div className={styles.wizard__header}>
            <div className={styles.wizard__title}>
              <h2>Create New Scenario</h2>
              <p>Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
            </div>
            <button onClick={onClose} className={styles.wizard__close}>
              <FiX size={24} />
            </button>
          </div>

          {/* Progress */}
          <div className={styles.wizard__progress}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.wizard__step} ${
                  index <= currentStep ? styles['wizard__step--active'] : ''
                }`}
              >
                <div className={styles.wizard__step__indicator}>
                  {index < currentStep ? <FiCheck size={16} /> : index + 1}
                </div>
                <div className={styles.wizard__step__content}>
                  <span className={styles.wizard__step__title}>{step.title}</span>
                  <span className={styles.wizard__step__description}>{step.description}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className={styles.wizard__content}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={styles.wizard__content__title}>
                {steps[currentStep].title}
              </h3>
              <p className={styles.wizard__content__description}>
                {steps[currentStep].description}
              </p>
              
              {/* Placeholder form content */}
              <div className={styles.wizard__form}>
                <div className={styles.wizard__form__placeholder}>
                  <p>Form content for {steps[currentStep].title} will be implemented here</p>
                  <p>This will include material selection, route configuration, energy inputs, etc.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className={styles.wizard__footer}>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={styles.wizard__btn__secondary}
            >
              <FiArrowLeft size={16} />
              Previous
            </button>
            
            <div className={styles.wizard__footer__spacer} />
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                className={styles.wizard__btn__primary}
              >
                <FiCheck size={16} />
                Create Scenario
              </button>
            ) : (
              <button
                onClick={nextStep}
                className={styles.wizard__btn__primary}
              >
                Next
                <FiArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

