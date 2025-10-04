import { apiService } from '@/utils/api';

export interface ProjectData {
  name: string;
  description?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  scenarios?: number[];
}

export interface Project extends ProjectData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto extends ProjectData {}
export interface UpdateProjectDto extends Partial<ProjectData> {}

class ProjectsService {
  async getProjects(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await apiService.get('/projects');
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      // Backend returns an array of projects directly
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch projects' 
      };
    }
  }

  async getProject(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.get(`/projects/${id}`);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch project' 
      };
    }
  }

  async createProject(data: CreateProjectDto): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.post('/projects', data);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create project' 
      };
    }
  }

  async updateProject(id: number, data: UpdateProjectDto): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.put(`/projects/${id}`, data);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update project' 
      };
    }
  }

  async deleteProject(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.delete(`/projects/${id}`);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete project' 
      };
    }
  }
}

export const projectsService = new ProjectsService();
