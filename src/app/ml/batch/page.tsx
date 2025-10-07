'use client';

import { useMemo, useRef, useState } from 'react';
import { mlService, type MiningData, type SustainabilityPrediction } from '@/services/ml.service';
import styles from './page.module.scss';

export default function MlBatchPage() {
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const sample = useMemo(() => mlService.createSampleMiningData(), []);
  const [rows, setRows] = useState<MiningData[]>([sample]);
  const [input, setInput] = useState<string>(JSON.stringify([sample], null, 2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Array<{ mine_id: string; predictions: SustainabilityPrediction; error?: string }>>([]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult([]);
    // Ensure results section is visible while skeleton loads (defer to next paint)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
    try {
      const parsed: MiningData[] = mode === 'json' ? JSON.parse(input) : rows;
      const start = Date.now();
      const resp = await mlService.batchPredict(parsed);
      const elapsed = Date.now() - start;
      if (elapsed < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - elapsed));
      }
      setResult(resp.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Batch prediction failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (index: number, field: keyof MiningData, value: string) => {
    setRows(prev => {
      const next = [...prev];
      const nextRow: MiningData = { ...next[index] };
      const isNumericField = /tonnes|percent|mwh|m3|km|generated|inr/.test(String(field));
      if (isNumericField) {
        (nextRow[field] as unknown as number | undefined) = Number(value);
      } else {
        (nextRow[field] as unknown as string | undefined) = value;
      }
      next[index] = nextRow;
      return next;
    });
  };

  const addRow = () => setRows(prev => [...prev, sample]);
  const removeRow = (index: number) => setRows(prev => prev.filter((_, i) => i !== index));

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Batch ML</h1>
        <form onSubmit={onSubmit} className={styles.card} style={{ display: 'grid', gap: 12 }}>
          <div className={styles.toolbar}>
            <div className={styles.tabs}>
              <button type="button" className={`${styles.tab} ${mode === 'form' ? styles.tabActive : ''}`} onClick={() => setMode('form')}>Form</button>
              <button type="button" className={`${styles.tab} ${mode === 'json' ? styles.tabActive : ''}`} onClick={() => setMode('json')}>JSON</button>
            </div>
            {mode === 'form' && (
              <div className={styles.rowControls}>
                <button type="button" className={styles.buttonAdd} onClick={addRow}>Add Row</button>
              </div>
            )}
          </div>

          {mode === 'form' ? (
            <div className={styles.rows}>
              {rows.map((row, idx) => (
                <div key={idx} className={styles.row}>
                  <input className={styles.input} placeholder="Mine ID" value={row.mine_id} onChange={e => updateRow(idx, 'mine_id', e.target.value)} />
                  <input className={styles.input} placeholder="Mine Name" value={row.mine_name} onChange={e => updateRow(idx, 'mine_name', e.target.value)} />
                  <input className={styles.input} placeholder="State" value={row.state} onChange={e => updateRow(idx, 'state', e.target.value)} />
                  <input className={styles.input} placeholder="Mineral" value={row.mineral} onChange={e => updateRow(idx, 'mineral', e.target.value)} />
                  <input className={styles.input} placeholder="Status" value={row.mine_status} onChange={e => updateRow(idx, 'mine_status', e.target.value)} />
                  <div className={styles.rowControls}>
                    <button type="button" className={styles.buttonRemove} onClick={() => removeRow(idx)}>Remove</button>
                  </div>
                  <input className={styles.input} placeholder="Life Cycle Stage" value={row.life_cycle_stage} onChange={e => updateRow(idx, 'life_cycle_stage', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Production (tonnes)" value={row.production_tonnes ?? ''} onChange={e => updateRow(idx, 'production_tonnes', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Recycled Input %" value={row.recycled_input_percent ?? ''} onChange={e => updateRow(idx, 'recycled_input_percent', e.target.value)} />
                  <input className={styles.input} placeholder="Energy Source" value={row.energy_source ?? ''} onChange={e => updateRow(idx, 'energy_source', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Energy (MWh)" value={row.energy_consumption_mwh ?? ''} onChange={e => updateRow(idx, 'energy_consumption_mwh', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="CO2 (tonnes)" value={row.co2_emissions_tonnes ?? ''} onChange={e => updateRow(idx, 'co2_emissions_tonnes', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Water (m3)" value={row.water_usage_m3 ?? ''} onChange={e => updateRow(idx, 'water_usage_m3', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Waste (tonnes)" value={row.waste_generated_tonnes ?? ''} onChange={e => updateRow(idx, 'waste_generated_tonnes', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Transport (km)" value={row.transport_distance_km ?? ''} onChange={e => updateRow(idx, 'transport_distance_km', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Employment" value={row.employment_generated ?? ''} onChange={e => updateRow(idx, 'employment_generated', e.target.value)} />
                  <input className={styles.input} type="number" placeholder="Community Investment (INR)" value={row.local_community_investment_inr ?? ''} onChange={e => updateRow(idx, 'local_community_investment_inr', e.target.value)} />
                </div>
              ))}
            </div>
          ) : (
            <label>
              JSON array of MiningData
              <textarea
                className={styles.textarea}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={16}
              />
            </label>
          )}
          <button className={styles.buttonPrimary} type="submit" disabled={loading}>{loading ? 'Predicting…' : 'Run Batch Prediction'}</button>
          {error && <div className={styles.error}>{error}</div>}
        </form>

        {/* Anchor to scroll into view */}
        <div ref={resultsRef} />
        {loading && (
          <div className={styles.results}>
            <div className={`${styles.card} ${styles.skeleton} ${styles.skeletonCard}`}></div>
            <div className={styles.metrics}>
              <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
              <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
              <div className={`${styles.metricCard} ${styles.skeleton} ${styles.skeletonMetric}`}></div>
            </div>
          </div>
        )}
        {result.length > 0 && !loading && (
          <div className={styles.results}>
            <h2>Results</h2>
            {result.map((r, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.resultHeader}>
                  <div className={styles.resultMeta}>
                    <span className={styles.scoreChip}><span className={styles.scoreDot} style={{ background: '#10b981' }} /> Prediction</span>
                    <span>Mine ID: <strong>{r.mine_id}</strong></span>
                  </div>
                  {r.error && <span className={styles.badgeError}>Error</span>}
                </div>
                {r.error ? (
                  <div className={styles.error}><strong>Error:</strong> {r.error}</div>
                ) : (
                  <>
                    <div className={styles.metrics}>
                      <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Recyclability</div>
                        <div className={styles.metricValue}>{r.predictions.recyclability_score}</div>
                        <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${r.predictions.recyclability_score}%` }} /></div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Reuse Potential</div>
                        <div className={styles.metricValue}>{r.predictions.reuse_potential_score}</div>
                        <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${r.predictions.reuse_potential_score}%` }} /></div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Product Life Extension</div>
                        <div className={styles.metricValue}>{r.predictions.product_life_extension_years} yrs</div>
                        <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${Math.min(100, (r.predictions.product_life_extension_years / 10) * 100)}%` }} /></div>
                      </div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricLabel}>Confidence</div>
                      <div className={styles.metricValue}>{Math.round(r.predictions.confidence * 100)}% ({mlService.getConfidenceLevel(r.predictions.confidence)})</div>
                    </div>
                    <div className={styles.metricCard}>
                      <div className={styles.metricLabel}>Recommendations</div>
                      <ul className={styles.recList}>
                        {r.predictions.recommendations.map((rec: string, i: number) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <details>
                      <summary>Raw response</summary>
                      <pre className={styles.code}>{JSON.stringify(r.predictions, null, 2)}</pre>
                    </details>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

