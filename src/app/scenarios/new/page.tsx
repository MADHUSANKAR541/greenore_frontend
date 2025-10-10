'use client';

import { useMemo, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { scenariosService, type CreateScenarioDto } from '@/services/scenarios.service';
import styles from './page.module.scss';

export default function NewScenarioPage() {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [jsonText, setJsonText] = useState('');
  const [form, setForm] = useState<{ name: string; description: string; tags: string[] }>({
    name: '',
    description: '',
    tags: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState('');
  // Material
  const [materialType, setMaterialType] = useState('');
  const [materialComposition, setMaterialComposition] = useState<Array<{ element: string; fraction: string }>>([
    { element: '', fraction: '' }
  ]);
  const [materialProperties, setMaterialProperties] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ]);
  // Route
  const [routeProcess, setRouteProcess] = useState('');
  const [routeEfficiency, setRouteEfficiency] = useState('');
  const [routeParameters, setRouteParameters] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ]);
  // Energy
  const [energySources, setEnergySources] = useState<Array<{ type: string; percentage: string; carbonIntensity: string }>>([
    { type: '', percentage: '', carbonIntensity: '' }
  ]);
  const [energyRenewable, setEnergyRenewable] = useState('');
  // Transport
  const [transportDistance, setTransportDistance] = useState('');
  const [transportMethod, setTransportMethod] = useState('');
  const [transportCarbonIntensity, setTransportCarbonIntensity] = useState('');
  // End of Life
  const [eolRecyclingRate, setEolRecyclingRate] = useState('');
  const [eolDisposalMethod, setEolDisposalMethod] = useState('');
  const [eolRecoveryEfficiency, setEolRecoveryEfficiency] = useState('');
  // UX: stepper and advanced toggle
  const steps = ['Basics', 'Material', 'Route', 'Energy', 'Logistics', 'End of Life', 'Review'] as const;
  const [activeStep, setActiveStep] = useState<(typeof steps)[number]>('Basics');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const moveStep = (delta: number) => {
    const idx = steps.indexOf(activeStep);
    const next = Math.min(steps.length - 1, Math.max(0, idx + delta));
    setActiveStep(steps[next]);
  };

  const applyTemplate = (key: 'steel-eaf' | 'aluminum-recycled' | 'default') => {
    if (key === 'default') {
      // reset to blanks
      setMaterialType('');
      setMaterialComposition([{ element: '', fraction: '' }]);
      setMaterialProperties([{ key: '', value: '' }]);
      setRouteProcess('');
      setRouteEfficiency('');
      setRouteParameters([{ key: '', value: '' }]);
      setEnergySources([{ type: '', percentage: '', carbonIntensity: '' }]);
      setEnergyRenewable('');
      setTransportDistance('');
      setTransportMethod('');
      setTransportCarbonIntensity('');
      setEolRecyclingRate('');
      setEolDisposalMethod('');
      setEolRecoveryEfficiency('');
      return;
    }
    if (key === 'steel-eaf') {
      setMaterialType('Steel');
      setMaterialComposition([{ element: 'Fe', fraction: '0.98' }, { element: 'C', fraction: '0.02' }]);
      setMaterialProperties([{ key: 'grade', value: 'EAF' }]);
      setRouteProcess('EAF');
      setRouteEfficiency('0.9');
      setRouteParameters([{ key: 'temp', value: '1600' }]);
      setEnergySources([{ type: 'grid', percentage: '100', carbonIntensity: '400' }]);
      setEnergyRenewable('20');
      setTransportDistance('100');
      setTransportMethod('truck');
      setTransportCarbonIntensity('120');
      setEolRecyclingRate('0.7');
      setEolDisposalMethod('recycle');
      setEolRecoveryEfficiency('0.6');
      return;
    }
    if (key === 'aluminum-recycled') {
      setMaterialType('Aluminum');
      setMaterialComposition([{ element: 'Al', fraction: '0.95' }]);
      setMaterialProperties([{ key: 'content', value: 'recycled' }]);
      setRouteProcess('Remelting');
      setRouteEfficiency('0.85');
      setRouteParameters([{ key: 'flux', value: 'NaCl' }]);
      setEnergySources([{ type: 'grid', percentage: '70', carbonIntensity: '300' }, { type: 'solar', percentage: '30', carbonIntensity: '50' }]);
      setEnergyRenewable('30');
      setTransportDistance('50');
      setTransportMethod('rail');
      setTransportCarbonIntensity('30');
      setEolRecyclingRate('0.8');
      setEolDisposalMethod('recycle');
      setEolRecoveryEfficiency('0.65');
      return;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onAddTag = () => {
    const newTag = tagInput.trim();
    if (!newTag) return;
    setForm(prev => ({ ...prev, tags: Array.from(new Set([...(prev.tags || []), newTag])) }));
    setTagInput('');
  };

  const onRemoveTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }));
  };

  const energyTotal = useMemo(() => energySources.reduce((sum, s) => sum + (Number(s.percentage) || 0), 0), [energySources]);

  const parsedJson: CreateScenarioDto | null = useMemo(() => {
    if (mode !== 'json') return null;
    try {
      const obj = JSON.parse(jsonText);
      if (!obj || typeof obj !== 'object') return null;
      const hasRequired = typeof obj.name === 'string' && obj.material && obj.route && obj.energy && obj.transport && obj.endOfLife;
      return hasRequired ? obj as CreateScenarioDto : null;
    } catch {
      return null;
    }
  }, [mode, jsonText]);

  const isValid = useMemo(() => {
    if (mode === 'json') return !!parsedJson;
    if (!form.name.trim()) return false;
    // Material
    if (!materialType.trim()) return false;
    const compValid = materialComposition.every(r => r.element.trim() && r.fraction.trim() && !Number.isNaN(Number(r.fraction)));
    if (!compValid) return false;
    // Route
    if (!routeProcess.trim()) return false;
    if (routeEfficiency.trim() === '' || Number.isNaN(Number(routeEfficiency))) return false;
    // Energy
    const sourcesValid = energySources.every(s => s.type.trim() && s.percentage.trim() !== '' && !Number.isNaN(Number(s.percentage)) && s.carbonIntensity.trim() !== '' && !Number.isNaN(Number(s.carbonIntensity)));
    if (!sourcesValid) return false;
    if (energyRenewable.trim() === '' || Number.isNaN(Number(energyRenewable))) return false;
    if (energyTotal !== 100) return false;
    // Transport
    if (transportMethod.trim() === '') return false;
    if (transportDistance.trim() === '' || Number.isNaN(Number(transportDistance))) return false;
    if (transportCarbonIntensity.trim() === '' || Number.isNaN(Number(transportCarbonIntensity))) return false;
    // End of Life
    if (eolDisposalMethod.trim() === '') return false;
    if (eolRecyclingRate.trim() === '' || Number.isNaN(Number(eolRecyclingRate))) return false;
    if (eolRecoveryEfficiency.trim() === '' || Number.isNaN(Number(eolRecoveryEfficiency))) return false;
    return true;
  }, [mode, parsedJson, form.name, materialType, materialComposition, routeProcess, routeEfficiency, energySources, energyRenewable, transportMethod, transportDistance, transportCarbonIntensity, eolDisposalMethod, eolRecyclingRate, eolRecoveryEfficiency, energyTotal]);

  const canSubmit = mode === 'json' || (mode === 'form' && activeStep === 'Review');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setCreatedId(null);
    try {
      if (mode === 'json') {
        const payload = parsedJson as CreateScenarioDto;
        const resp = await scenariosService.createScenario(payload);
        if (!resp.success || !resp.data) throw new Error(resp.error || 'Create failed');
        setCreatedId(resp.data.id);
        return;
      }
      const composition: Record<string, number> = {};
      materialComposition.forEach(r => { composition[r.element.trim()] = Number(r.fraction); });
      const properties: Record<string, unknown> = {};
      materialProperties.filter(p => p.key.trim()).forEach(p => { properties[p.key.trim()] = tryCoerce(p.value); });

      const routeParams: Record<string, unknown> = {};
      routeParameters.filter(p => p.key.trim()).forEach(p => { routeParams[p.key.trim()] = tryCoerce(p.value); });

      const payload: CreateScenarioDto = {
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        material: {
          type: materialType.trim(),
          composition,
          properties
        },
        route: {
          process: routeProcess.trim(),
          parameters: routeParams,
          efficiency: Number(routeEfficiency)
        },
        energy: {
          sources: energySources.map(s => ({ type: s.type.trim(), percentage: Number(s.percentage), carbonIntensity: Number(s.carbonIntensity) })),
          renewable: Number(energyRenewable)
        },
        transport: {
          distance: Number(transportDistance),
          method: transportMethod.trim(),
          carbonIntensity: Number(transportCarbonIntensity)
        },
        endOfLife: {
          recyclingRate: Number(eolRecyclingRate),
          disposalMethod: eolDisposalMethod.trim(),
          recoveryEfficiency: Number(eolRecoveryEfficiency)
        },
        tags: form.tags
      };
      const resp = await scenariosService.createScenario(payload);
      if (!resp.success || !resp.data) throw new Error(resp.error || 'Create failed');
      setCreatedId(resp.data.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Create failed';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Create New Scenario</h1>
            <p>Provide core configuration values required for LCA.</p>
          </div>
          <Link href="/scenarios" className={styles.buttonGhost}>Back to Scenarios</Link>
        </div>
        <div className={styles.card}>
          <form onSubmit={onSubmit} className={styles.form}>
            {/* Quick templates */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Quick start</h3>
                <span className={styles.badge}>Optional</span>
              </div>
              <div className={styles.templates}>
                <button type="button" className={styles.template} onClick={() => applyTemplate('steel-eaf')}>Steel (EAF)</button>
                <button type="button" className={styles.template} onClick={() => applyTemplate('aluminum-recycled')}>Aluminum (Recycled)</button>
                <button type="button" className={styles.template} onClick={() => applyTemplate('default')}>Blank Template</button>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className={styles.tabs}>
              <button type="button" className={`${styles.tab} ${mode === 'form' ? styles.tabActive : ''}`} onClick={() => setMode('form')}>Form mode</button>
              <button type="button" className={`${styles.tab} ${mode === 'json' ? styles.tabActive : ''}`} onClick={() => setMode('json')}>JSON mode</button>
            </div>

            {mode === 'json' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="json">Scenario JSON</label>
                  <textarea id="json" className={styles.textarea} rows={14} placeholder='{"name":"My Scenario","material":{...},"route":{...},"energy":{...},"transport":{...},"endOfLife":{...},"tags":["..."]}' value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
                  {!parsedJson && jsonText && <div className={styles.error}>Invalid JSON or missing required fields.</div>}
                  <div className={styles.jsonHelp}>Required keys: name, material, route, energy, transport, endOfLife. Tags optional.</div>
                </div>
              </div>
            )}

            {mode === 'form' && (
            <div>
            {/* Stepper */}
            <div className={styles.stepper}>
              <div className={styles.stepper__tabs}>
                {steps.map(step => (
                  <button key={step} type="button" className={`${styles.stepper__tab} ${activeStep === step ? styles['stepper__tab--active'] : ''}`} onClick={() => setActiveStep(step)}>{step}</button>
                ))}
              </div>
            </div>
            {activeStep === 'Basics' && (
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">Name</label>
                    <input id="name" name="name" className={styles.input} value={form.name} onChange={onChange} placeholder="e.g., Titanium Spoon Lifecycle" required />
                    <div className={styles.hint}>A concise, descriptive title.</div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="description">Description</label>
                    <input id="description" name="description" className={styles.input} value={form.description} onChange={onChange} placeholder="What does this scenario model?" />
                  </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.toggleRow}>
                  <input id="advanced" type="checkbox" checked={showAdvanced} onChange={(e) => setShowAdvanced(e.target.checked)} />
                  <label htmlFor="advanced">Show advanced fields (properties, parameters)</label>
                </div>
              </div>
            )}

            {activeStep === 'Material' && (
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="materialType">Type</label>
                    <input id="materialType" className={styles.input} value={materialType} onChange={(e) => setMaterialType(e.target.value)} placeholder="e.g., Steel" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Composition (element → fraction)</label>
                  {materialComposition.map((row, idx) => (
                    <div key={idx} className={styles.row}>
                      <input className={styles.input} placeholder="Element (e.g., Fe)" value={row.element} onChange={(e) => updateRow(setMaterialComposition, materialComposition, idx, { element: e.target.value })} />
                      <div className={styles.inputGroup}>
                        <input className={styles.input} placeholder="Fraction (e.g., 0.98)" value={row.fraction} onChange={(e) => updateRow(setMaterialComposition, materialComposition, idx, { fraction: e.target.value })} />
                        <span className={styles.addon}>0-1</span>
                      </div>
                    </div>
                  ))}
                  <div className={styles.actions}>
                    <button type="button" className={styles.buttonGhost} onClick={() => setMaterialComposition(prev => [...prev, { element: '', fraction: '' }])}>Add row</button>
                    {materialComposition.length > 1 && (
                      <button type="button" className={styles.buttonGhost} onClick={() => setMaterialComposition(prev => prev.slice(0, -1))}>Remove last</button>
                    )}
                  </div>
                </div>
                {showAdvanced && (
                  <div className={styles.field}>
                    <label className={styles.label}>Properties (key → value)</label>
                    {materialProperties.map((row, idx) => (
                      <div key={idx} className={styles.row}>
                        <input className={styles.input} placeholder="Key" value={row.key} onChange={(e) => updateRow(setMaterialProperties, materialProperties, idx, { key: e.target.value })} />
                        <input className={styles.input} placeholder="Value" value={row.value} onChange={(e) => updateRow(setMaterialProperties, materialProperties, idx, { value: e.target.value })} />
                      </div>
                    ))}
                    <div className={styles.actions}>
                      <button type="button" className={styles.buttonGhost} onClick={() => setMaterialProperties(prev => [...prev, { key: '', value: '' }])}>Add row</button>
                      {materialProperties.length > 1 && (
                        <button type="button" className={styles.buttonGhost} onClick={() => setMaterialProperties(prev => prev.slice(0, -1))}>Remove last</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 'Route' && (
              <div className={styles.section}>
                <div className={styles.row}>
                  <input className={styles.input} placeholder="Process (e.g., EAF)" value={routeProcess} onChange={(e) => setRouteProcess(e.target.value)} />
                  <div className={styles.inputGroup}>
                    <input className={styles.input} placeholder="Efficiency (e.g., 0.9)" value={routeEfficiency} onChange={(e) => setRouteEfficiency(e.target.value)} />
                    <span className={styles.addon}>0-1</span>
                  </div>
                </div>
                {showAdvanced && (
                  <div className={styles.field}>
                    <label className={styles.label}>Parameters (key → value)</label>
                    {routeParameters.map((row, idx) => (
                      <div key={idx} className={styles.row}>
                        <input className={styles.input} placeholder="Key" value={row.key} onChange={(e) => updateRow(setRouteParameters, routeParameters, idx, { key: e.target.value })} />
                        <input className={styles.input} placeholder="Value" value={row.value} onChange={(e) => updateRow(setRouteParameters, routeParameters, idx, { value: e.target.value })} />
                      </div>
                    ))}
                    <div className={styles.actions}>
                      <button type="button" className={styles.buttonGhost} onClick={() => setRouteParameters(prev => [...prev, { key: '', value: '' }])}>Add row</button>
                      {routeParameters.length > 1 && (
                        <button type="button" className={styles.buttonGhost} onClick={() => setRouteParameters(prev => prev.slice(0, -1))}>Remove last</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 'Energy' && (
              <div className={styles.section}>
                {energySources.map((row, idx) => (
                  <div key={idx} className={styles.row}>
                    <input className={styles.input} placeholder="Type (e.g., grid)" value={row.type} onChange={(e) => updateRow(setEnergySources, energySources, idx, { type: e.target.value })} />
                    <div className={styles.inputGroup}>
                      <input className={styles.input} placeholder="Percentage" value={row.percentage} onChange={(e) => updateRow(setEnergySources, energySources, idx, { percentage: e.target.value })} />
                      <span className={styles.addon}>%</span>
                    </div>
                    <input className={styles.input} placeholder="Carbon Intensity" value={row.carbonIntensity} onChange={(e) => updateRow(setEnergySources, energySources, idx, { carbonIntensity: e.target.value })} />
                  </div>
                ))}
                <div className={styles.actions}>
                  <button type="button" className={styles.buttonGhost} onClick={() => setEnergySources(prev => [...prev, { type: '', percentage: '', carbonIntensity: '' }])}>Add source</button>
                  {energySources.length > 1 && (
                    <button type="button" className={styles.buttonGhost} onClick={() => setEnergySources(prev => prev.slice(0, -1))}>Remove last</button>
                  )}
                </div>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <input className={styles.input} placeholder="Renewable (%)" value={energyRenewable} onChange={(e) => setEnergyRenewable(e.target.value)} />
                    <span className={styles.addon}>%</span>
                  </div>
                </div>
                <div className={energyTotal !== 100 ? styles.warning : styles.hint}>Energy sources total: {energyTotal}% {energyTotal !== 100 ? '(should equal 100%)' : ''}</div>
              </div>
            )}

            {activeStep === 'Logistics' && (
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <input className={styles.input} placeholder="Distance" value={transportDistance} onChange={(e) => setTransportDistance(e.target.value)} />
                    <span className={styles.addon}>km</span>
                  </div>
                  <input className={styles.input} placeholder="Method (e.g., truck)" value={transportMethod} onChange={(e) => setTransportMethod(e.target.value)} />
                  <div className={styles.inputGroup}>
                    <input className={styles.input} placeholder="Carbon Intensity" value={transportCarbonIntensity} onChange={(e) => setTransportCarbonIntensity(e.target.value)} />
                    <span className={styles.addon}>gCO₂e/t-km</span>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 'End of Life' && (
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <input className={styles.input} placeholder="Recycling Rate" value={eolRecyclingRate} onChange={(e) => setEolRecyclingRate(e.target.value)} />
                    <span className={styles.addon}>0-1</span>
                  </div>
                  <input className={styles.input} placeholder="Disposal Method" value={eolDisposalMethod} onChange={(e) => setEolDisposalMethod(e.target.value)} />
                  <div className={styles.inputGroup}>
                    <input className={styles.input} placeholder="Recovery Efficiency" value={eolRecoveryEfficiency} onChange={(e) => setEolRecoveryEfficiency(e.target.value)} />
                    <span className={styles.addon}>0-1</span>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 'Review' && (
              <div className={styles.section}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="tags">Tags</label>
                  <div className={styles.row}>
                    <input id="tags" className={styles.input} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag and press Add" />
                    <button type="button" className={styles.buttonGhost} onClick={onAddTag}>Add</button>
                  </div>
                  {(form.tags && form.tags.length > 0) && (
                    <div className={styles.tagsPreview}>
                      {form.tags.map(tag => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                          <button type="button" className={styles.removeTag} aria-label={`Remove ${tag}`} onClick={() => onRemoveTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            </div>
            )}

            {error && <div className={styles.error}>{error}</div>}
            {createdId && <div className={styles.success}>Created scenario #{createdId}. <Link href={`/scenarios?newId=${createdId}`}>Go to scenarios</Link></div>}

            <div className={styles.stickyFooter}>
              <div className={styles.stepper__actions}>
                <div>
                  {mode === 'form' && (
                    <button type="button" className={styles.buttonGhost} onClick={() => moveStep(-1)} disabled={steps.indexOf(activeStep) === 0}>Back</button>
                  )}
                </div>
                <div className={styles.actions}>
                  {mode === 'form' && activeStep !== 'Review' && (
                    <button type="button" className={styles.buttonPrimary} onClick={() => moveStep(1)}>Next</button>
                  )}
                  {canSubmit && (
                    <button className={styles.buttonPrimary} type="submit" disabled={saving || !isValid}>{saving ? 'Creating…' : 'Create Scenario'}</button>
                  )}
                  <Link href="/scenarios" className={styles.buttonGhost}>Cancel</Link>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

function updateRow<T extends Record<string, unknown>>(setRows: (updater: (prev: T[]) => T[]) => void, rows: T[], index: number, changes: Partial<T>) {
  setRows(prev => prev.map((r, i) => (i === index ? { ...r, ...changes } : r)));
}

function tryCoerce(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  const num = Number(trimmed);
  if (!Number.isNaN(num) && trimmed.match(/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i)) return num;
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'object') return parsed;
  } catch {}
  return value;
}


