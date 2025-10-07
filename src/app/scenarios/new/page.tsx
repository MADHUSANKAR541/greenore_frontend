'use client';

import { useState } from 'react';
import Link from 'next/link';
import { scenariosService, type CreateScenarioDto } from '@/services/scenarios.service';
import styles from './page.module.scss';

export default function NewScenarioPage() {
  const [form, setForm] = useState<CreateScenarioDto>({
    name: '',
    description: '',
    status: 'Draft',
    circularityScore: 50,
    carbonFootprint: 0,
    energyConsumption: 0,
    waterConsumption: 0,
    tags: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setForm(prev => ({ ...prev, tags: value.split(',').map(t => t.trim()).filter(Boolean) }));
      return;
    }
    const numeric = ['circularityScore','carbonFootprint','energyConsumption','waterConsumption'];
    setForm(prev => ({
      ...prev,
      [name]: numeric.includes(name) ? Number(value) : value
    } as CreateScenarioDto));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setCreatedId(null);
    try {
      const resp = await scenariosService.createScenario(form);
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
        <div className={styles.card}>
          <div className={styles.grid}>
            <h1>Create New Scenario</h1>
            <form onSubmit={onSubmit} className={styles.grid} style={{ maxWidth: 720 }}>
              <input name="name" value={form.name} onChange={onChange} placeholder="Name" />
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" rows={3} />
              <input name="status" value={form.status} onChange={onChange} placeholder="Status" />
              <div className={styles.inputs}>
                <input name="circularityScore" type="number" value={form.circularityScore} onChange={onChange} placeholder="Circularity Score" />
                <input name="carbonFootprint" type="number" value={form.carbonFootprint} onChange={onChange} placeholder="Carbon Footprint" />
                <input name="energyConsumption" type="number" value={form.energyConsumption} onChange={onChange} placeholder="Energy Consumption" />
                <input name="waterConsumption" type="number" value={form.waterConsumption} onChange={onChange} placeholder="Water Consumption" />
              </div>
              <input name="tags" value={(form.tags || []).join(', ')} onChange={onChange} placeholder="Tags (comma separated)" />
              <button className={styles.buttonPrimary} type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Scenario'}</button>
              {error && <div className={styles.error}>{error}</div>}
              {createdId && <div className={styles.success}>Created scenario #{createdId}. <Link href={`/scenarios`}>Go to scenarios</Link></div>}
            </form>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Link href="/scenarios">Back to Scenarios</Link>
        </div>
      </div>
    </div>
  );
}


