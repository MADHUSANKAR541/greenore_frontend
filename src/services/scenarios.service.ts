import { apiService } from '@/utils/api';

export interface ScenarioData {
  name: string;
  description?: string;
  status?: string;
  circularityScore: number;
  carbonFootprint: number;
  energyConsumption: number;
  waterConsumption: number;
  tags?: string[];
}

export interface Scenario extends ScenarioData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
}

export interface CreateScenarioDto extends ScenarioData {}
export interface UpdateScenarioDto extends Partial<ScenarioData> {}

export interface ScenarioResponse {
  scenarios: Scenario[];
  total: number;
  page: number;
  limit: number;
}

export interface ScenarioAnalysisResponse {
  message: string;
  jobId: string;
}

export interface ScenarioStatusResponse {
  status: string;
  progress: number;
  results?: any;
}

class ScenariosService {
  async getScenarios(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ success: boolean; data?: ScenarioResponse; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);

      const endpoint = `/scenarios${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<ScenarioResponse>(endpoint);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch scenarios' 
      };
    }
  }

  async getScenario(id: number): Promise<{ success: boolean; data?: Scenario; error?: string }> {
    try {
      const response = await apiService.get<Scenario>(`/scenarios/${id}`);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch scenario' 
      };
    }
  }

  async createScenario(data: CreateScenarioDto): Promise<{ success: boolean; data?: Scenario; error?: string }> {
    try {
      const response = await apiService.post<Scenario>('/scenarios', data);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create scenario' 
      };
    }
  }

  async updateScenario(id: number, data: UpdateScenarioDto): Promise<{ success: boolean; data?: Scenario; error?: string }> {
    try {
      const response = await apiService.put<Scenario>(`/scenarios/${id}`, data);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update scenario' 
      };
    }
  }

  async deleteScenario(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.delete(`/scenarios/${id}`);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete scenario' 
      };
    }
  }

  async runAnalysis(id: number): Promise<{ success: boolean; data?: ScenarioAnalysisResponse; error?: string }> {
    try {
      const response = await apiService.post<ScenarioAnalysisResponse>(`/scenarios/${id}/run`);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to run analysis' 
      };
    }
  }

  async getStatus(id: number): Promise<{ success: boolean; data?: ScenarioStatusResponse; error?: string }> {
    try {
      const response = await apiService.get<ScenarioStatusResponse>(`/scenarios/${id}/status`);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get status' 
      };
    }
  }
}

export const scenariosService = new ScenariosService();
