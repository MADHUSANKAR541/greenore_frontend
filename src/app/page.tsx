"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import styles from "./page.module.scss";
import {
  FiArrowRight,
  FiCheckCircle,
  FiBarChart2,
  FiZap,
  FiFileText,
  FiGlobe,
  FiShuffle,
  FiX,
} from "react-icons/fi";
import { DashboardMock } from "@/components/landing/dashboard-mock";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const router = useRouter();
  const { loginGuest } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  useEffect(() => {
    // Ping backend health on every visit to keep Render dyno warm
    fetch("https://greenore-backend.onrender.com/api/health", {
      method: "GET",
      cache: "no-store",
      keepalive: true,
    }).catch(() => {
      // Intentionally ignore errors; purpose is just to wake the server
    });
    const t = setTimeout(() => setShowGuestModal(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Interactive tilt for orb
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useTransform(mx, [-120, 120], [-12, 12]);
  const rotateX = useTransform(my, [-120, 120], [12, -12]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - (rect.left + rect.width / 2));
    my.set(e.clientY - (rect.top + rect.height / 2));
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleGuestLogin = async () => {
    setGuestError(null);
    setGuestLoading(true);
    const ok = await loginGuest();
    setGuestLoading(false);
    if (ok) {
      router.push('/dashboard');
    } else {
      setGuestError('Guest login failed. Please try again.');
    }
  };
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5 }}
              className={styles.heroTitle}
            >
              GreenOre — AI‑powered LCA for metals
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6 }}
              className={styles.heroSub}
            >
              Go from data gaps to circularity insights in seconds.
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7 }}
              className={styles.ctaRow}
            >
              <button className={styles.ctaPrimary} onClick={() => setShowGuestModal(true)}>
                Guest Access <FiArrowRight size={16} />
              </button>
              <Link href="/login" className={styles.ctaSecondary}>
                Login
              </Link>
            </motion.div>
          </div>
          <div
            className={styles.heroMock}
            aria-hidden
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            {/* Interactive Dashboard Preview */}
            <motion.div
              className={styles.orbWrap}
              style={{ rotateX, rotateY }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <DashboardMock className={styles.globeSvg} />
            </motion.div>
            <motion.div
              className={styles.mockBadge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FiArrowRight /> AI Estimation
            </motion.div>
            <motion.div
              className={styles.mockBadgeAlt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Optimizer ▶
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showGuestModal && (
          <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <button className={styles.modalClose} aria-label="Close" onClick={() => setShowGuestModal(false)}>
                <FiX size={18} />
              </button>
              <h3>Guest Access</h3>
              <p>✨ Welcome, SIH Evaluator</p>
              <p>We know your time is valuable, and you have many teams to review.</p>
              <p>A quick guest access has been provided so you can immediately explore Optimetro&apos;s features with no sign-up required!</p>
              {guestError ? <p style={{ color: 'var(--error)', marginTop: 4 }}>{guestError}</p> : null}
              <div className={styles.modalActions}>
                <button className={styles.ctaPrimary} onClick={handleGuestLogin} disabled={guestLoading}>
                  {guestLoading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span className={styles.spinner} aria-hidden /> Starting...
                    </span>
                  ) : (
                    'Guest Login'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why */}
      <section className={styles.why}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>Why GreenOre</span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.sectionTitle}
          >
            Measurable impact, faster decisions
          </motion.h2>
          <p className={styles.sectionSub}>
            Ship analyses your stakeholders trust. Reduce footprint while
            improving margins.
          </p>
        </header>
        <div className={styles.cards}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={styles.card}
          >
            <FiCheckCircle />
            <h3>Cut CO₂e by up to 30%</h3>
            <p>Find low‑carbon routes and circular alternatives fast.</p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className={styles.card}
          >
            <FiShuffle />
            <h3>Turn messy data into insight</h3>
            <p>AI estimation fills gaps with confidence bands (p05–p95).</p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={styles.card}
          >
            <FiZap />
            <h3>70% faster analysis</h3>
            <p>Automated pipelines from input to report.</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>Platform</span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.sectionTitle}
          >
            Everything you need, end‑to‑end
          </motion.h2>
        </header>
        <div className={styles.cardsGrid}>
          <Feature
            icon={<FiGlobe />}
            title="AI‑powered estimation"
            desc="Fill missing parameters with model confidence and drivers."
          />
          <Feature
            icon={<FiBarChart2 />}
            title="LCA & Circularity"
            desc="CO₂e, water, energy, waste and circularity scorecards."
          />
          <Feature
            icon={<FiZap />}
            title="Optimizer"
            desc="Compare conventional vs circular and see Pareto trade‑offs."
          />
          <Feature
            icon={<FiFileText />}
            title="Reporting"
            desc="One‑click PDF/CSV exports with methods and assumptions."
          />
        </div>
      </section>

      {/* How it works */}
      <section className={styles.workflow}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>Workflow</span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.sectionTitle}
          >
            From inputs to audit‑ready reports
          </motion.h2>
          <p className={styles.sectionSub}>
            Built‑in guardrails and transparent assumptions at every step.
          </p>
        </header>
        <ol className={styles.steps}>
          {[
            { t: "Input", d: "Add material, route, energy, transport, EoL." },
            { t: "Estimate", d: "AI fills gaps with p05–p95 and drivers." },
            { t: "Calculate", d: "Compute LCA impacts across stages." },
            { t: "Compare", d: "Conventional vs circular, see deltas." },
            { t: "Visualize", d: "Charts, scorecards, Sankey flows." },
            { t: "Report", d: "Export audit‑ready PDF/CSV." },
          ].map((s, i) => (
            <motion.li
              key={s.t}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <span className={styles.stepIndex}>{i + 1}</span>
              <div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Impact counters */}
      <section className={styles.impact}>
        <header className={styles.sectionHeadCentered}>
          <span className={styles.eyebrow}>Proof</span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.sectionTitle}
          >
            Outcomes our customers achieve
          </motion.h2>
        </header>
        <div className={styles.counters}>
          {[
            { n: "20–30%", l: "Emissions reduction" },
            { n: "<60s", l: "Scenario turnaround" },
            { n: "80%", l: "Faster analysis" },
          ].map((c, i) => (
            <motion.div
              key={c.l}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={styles.counter}
            >
              <div className={styles.counterNum}>{c.n}</div>
              <div className={styles.counterLabel}>{c.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className={styles.usecases}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>Use cases</span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.sectionTitle}
          >
            Where GreenOre excels
          </motion.h2>
        </header>
        <div className={styles.tiles}>
          {[
            "Aluminium plants",
            "Copper supply chains",
            "ESG & policy",
            "Recycling optimization",
          ].map((u, i) => (
            <motion.div
              key={u}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={styles.tile}
            >
              {u}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partners / trust */}
      <section className={styles.partners}>
        <div className={styles.partnerRow}>
          <span>ISO‑aligned</span>
          <span>IPCC</span>
          <span>Ecoinvent</span>
          <span>OpenLCA</span>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={styles.sectionTitle}
        >
          Start your sustainable metals journey today
        </motion.h2>
        <p className={styles.sectionSub}>
          Run your first scenario in under a minute — no setup required.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/dashboard" className={styles.ctaPrimary}>
            Get Started <FiArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={styles.feature}
    >
      <div className={styles.featureIcon}>{icon}</div>
      <div className={styles.featureText}>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </motion.div>
  );
}
