export type MetalFactor = {
  material: string;
  process: string;
  co2e_kg_per_kg: number;
  energy_mj_per_kg: number;
  water_l_per_kg: number;
};

export async function fetchUSEEIOImpact(material: string): Promise<Partial<MetalFactor> | null> {
  try {
    // Placeholder for USEEIO; many endpoints require sector codes. Keep minimal and resilient.
    // Returning null to prefer local factors for now.
    return null;
  } catch {
    return null;
  }
}

export async function loadLocalMetalFactors(): Promise<MetalFactor[]> {
  const res = await fetch('/data/metals-factors.csv');
  const text = await res.text();
  const lines = text.trim().split('\n');
  const [header, ...rows] = lines;
  return rows.map((row) => {
    const [material, process, co2e, energy, water] = row.split(',');
    return {
      material,
      process,
      co2e_kg_per_kg: Number(co2e),
      energy_mj_per_kg: Number(energy),
      water_l_per_kg: Number(water),
    } as MetalFactor;
  });
}

export async function getMetalFactor(material: string, process: string): Promise<MetalFactor | null> {
  const useeio = await fetchUSEEIOImpact(material);
  if (useeio) {
    // If we had partials from USEEIO, we'd merge them. For now, continue to local
  }
  const local = await loadLocalMetalFactors();
  const match = local.find((m) => m.material === material && m.process === process);
  return match ?? null;
}


