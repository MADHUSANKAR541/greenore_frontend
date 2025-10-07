const API_BASE_URL = 'http://localhost:8080';

export interface MiningData {
  mine_id: string;
  mine_name: string;
  state: string;
  mineral: string;
  mine_status: string;
  life_cycle_stage: string;
  production_tonnes?: number;
  recycled_input_percent?: number;
  energy_source?: string;
  energy_consumption_mwh?: number;
  co2_emissions_tonnes?: number;
  water_usage_m3?: number;
  waste_generated_tonnes?: number;
  transport_distance_km?: number;
  employment_generated?: number;
  local_community_investment_inr?: number;
}

export interface SustainabilityPrediction {
  recyclability_score: number;
  reuse_potential_score: number;
  product_life_extension_years: number;
  confidence: number;
  recommendations: string[];
}

export interface MLResponse {
  success: boolean;
  data: SustainabilityPrediction;
  message: string;
}

export interface BatchMLResponse {
  success: boolean;
  data: Array<{
    mine_id: string;
    predictions: SustainabilityPrediction;
    error?: string;
  }>;
  message: string;
}

export interface ModelInfoResponse {
  success: boolean;
  data: {
    model_type: string;
    n_features: number;
    n_estimators: number;
    boosting_type: string;
  };
  message: string;
}

class MLService {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async predictSustainability(data: MiningData): Promise<MLResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/predict`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('ML Prediction error:', error);
      throw error;
    }
  }

  async batchPredict(operations: MiningData[]): Promise<BatchMLResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/batch-predict`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ operations }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Batch prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('ML Batch Prediction error:', error);
      throw error;
    }
  }

  async getModelInfo(): Promise<ModelInfoResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/model-info`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get model info');
      }

      return await response.json();
    } catch (error) {
      console.error('ML Model Info error:', error);
      throw error;
    }
  }

  // Helper method to create sample mining data
  createSampleMiningData(): MiningData {
    return {
      mine_id: 'M00001',
      mine_name: 'Aluminium Block-2 (Rajasthan)',
      state: 'Rajasthan',
      mineral: 'Aluminium',
      mine_status: 'Active',
      life_cycle_stage: 'Extraction',
      production_tonnes: 711925.0,
      recycled_input_percent: 19.49,
      energy_source: 'Grid',
      energy_consumption_mwh: 7030.52,
      co2_emissions_tonnes: 108593.07,
      water_usage_m3: 253778.0,
      waste_generated_tonnes: 2540733.0,
      transport_distance_km: 127.0,
      employment_generated: 38913.0,
      local_community_investment_inr: 190593266.0,
    };
  }

  // Helper method to get sustainability score color
  getScoreColor(score: number): string {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  // Helper method to get confidence level
  getConfidenceLevel(confidence: number): string {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.7) return 'Medium';
    if (confidence >= 0.6) return 'Low';
    return 'Very Low';
  }
}

export const mlService = new MLService();
