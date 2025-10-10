'use client';

import { useRef, useState } from 'react';
import { mlService, type MiningData, type SustainabilityPrediction } from '@/services/ml.service';
import styles from './page.module.scss';

export default function MlAnalysisPage() {
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState<MiningData>(mlService.createSampleMiningData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SustainabilityPrediction | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.match(/tonnes|percent|mwh|m3|km|generated|inr/) ? Number(value) : value,
    } as MiningData));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    // Ensure results section is visible while skeleton loads
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      const start = Date.now();
      const resp = await mlService.predictSustainability(form);
      const elapsed = Date.now() - start;
      if (elapsed < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - elapsed));
      }
      setResult(resp.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Prediction failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score?: number) => (typeof score === 'number' ? mlService.getScoreColor(score) : '#999');

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>ML Analysis</h1>
        <div className={styles.grid}>
          <form onSubmit={onSubmit} className={styles.card} style={{ display: 'grid', gap: 12 }}>
            <div className={styles.formGrid}>
          <input name="mine_id" value={form.mine_id} onChange={onChange} placeholder="Mine ID" />
          <input name="mine_name" value={form.mine_name} onChange={onChange} placeholder="Mine Name" />
          <input name="state" value={form.state} onChange={onChange} placeholder="State" />
          <input name="mineral" value={form.mineral} onChange={onChange} placeholder="Mineral" />
          <input name="mine_status" value={form.mine_status} onChange={onChange} placeholder="Status" />
          <input name="life_cycle_stage" value={form.life_cycle_stage} onChange={onChange} placeholder="Life Cycle Stage" />
          <input name="production_tonnes" value={form.production_tonnes ?? ''} onChange={onChange} type="number" placeholder="Production (tonnes)" />
          <input name="recycled_input_percent" value={form.recycled_input_percent ?? ''} onChange={onChange} type="number" placeholder="Recycled Input %" />
          <input name="energy_source" value={form.energy_source ?? ''} onChange={onChange} placeholder="Energy Source" />
          <input name="energy_consumption_mwh" value={form.energy_consumption_mwh ?? ''} onChange={onChange} type="number" placeholder="Energy (MWh)" />
          <input name="co2_emissions_tonnes" value={form.co2_emissions_tonnes ?? ''} onChange={onChange} type="number" placeholder="CO2 (tonnes)" />
          <input name="water_usage_m3" value={form.water_usage_m3 ?? ''} onChange={onChange} type="number" placeholder="Water (m3)" />
          <input name="waste_generated_tonnes" value={form.waste_generated_tonnes ?? ''} onChange={onChange} type="number" placeholder="Waste (tonnes)" />
          <input name="transport_distance_km" value={form.transport_distance_km ?? ''} onChange={onChange} type="number" placeholder="Transport (km)" />
          <input name="employment_generated" value={form.employment_generated ?? ''} onChange={onChange} type="number" placeholder="Employment" />
          <input name="local_community_investment_inr" value={form.local_community_investment_inr ?? ''} onChange={onChange} type="number" placeholder="Community Investment (INR)" />
            </div>
            <button className={styles.buttonPrimary} type="submit" disabled={loading}>{loading ? 'Predicting…' : 'Predict'}</button>
            {error && <div className={styles.error}>{error}</div>}
          </form>

          <div ref={resultsRef} className={styles.card}>
            <h2>Result</h2>
            {!result && !loading && <p>Submit the form to see predictions.</p>}
            {loading && (
              <div className={styles.resultList}>
                <div className={`${styles.skeleton} ${styles.skeletonCard}`}></div>
                <div className={styles.metrics}>
                  <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
                  <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
                  <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
                </div>
                <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
                <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
              </div>
            )}
            {result && (
              <div className={styles.resultList}>
                <div className={styles.metrics}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Recyclability</div>
                    <div className={styles.metricValue}>{result.recyclability_score}</div>
                    <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${result.recyclability_score}%` }} /></div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Reuse Potential</div>
                    <div className={styles.metricValue}>{result.reuse_potential_score}</div>
                    <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${result.reuse_potential_score}%` }} /></div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Product Life Extension</div>
                    <div className={styles.metricValue}>{result.product_life_extension_years} yrs</div>
                    <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${Math.min(100, (result.product_life_extension_years / 10) * 100)}%` }} /></div>
                  </div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Confidence</div>
                  <div className={styles.metricValue}>{Math.round(result.confidence * 100)}% ({mlService.getConfidenceLevel(result.confidence)})</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Recommendations</div>
                  <ul className={styles.recList}>
                    {result.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

