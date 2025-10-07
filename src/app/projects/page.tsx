'use client';

import { useState, useEffect } from 'react';
import { projectsService, type Project } from '@/services/projects.service';
import styles from './page.module.scss';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsService.getProjects();
      
      if (result.success) {
        // Ensure we have an array by default
        const projectsData = Array.isArray(result.data) ? result.data : [];
        setProjects(projectsData);
      } else {
        setError(result.error || 'Failed to load projects');
        setProjects([]); // Set empty array on error
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setProjects([]); // Set empty array, on error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <div className={styles.actions}>
          <button onClick={loadProjects} className={styles.btn}>
            Retry
          </button>
          <button onClick={handleLogout} className={styles.btnSecondary}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Projects</h1>
        <p>Manage your LCA and circularity projects</p>
      </div>

      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <h3>Total Projects</h3>
            <span className={styles.statNumber}>{projects.length}</span>
          </div>
          <div className={styles.stat}>
            <h3>Active Projects</h3>
            <span className={styles.statNumber}>0</span>
          </div>
          <div className={styles.stat}>
            <h3>Completed</h3>
            <span className={styles.statNumber}>0</span>
          </div>
        </div>

        <div className={styles.projects}>
          <div className={styles.projectsHeader}>
            <h2>Recent Projects</h2>
            <button className={styles.btnPrimary}>
              Create New Project
            </button>
          </div>

          <div className={styles.projectsList}>
            {!projects || !Array.isArray(projects) || projects.length === 0 ? (
              <div className={styles.empty}>
                <h3>No projects yet</h3>
                <p>Create your first project to start analyzing LCA scenarios</p>
                <button className={styles.btnPrimary}>
                  Get Started
                </button>
              </div>
            ) : (
              projects.map((project, index) => {
                const name = project.name ?? `Project ${index + 1}`;
                const status = project.status ?? 'Unknown';
                const owner = '—';
                const createdAt = project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—';
                const description = project.description || '';
                return (
                  <div key={index} className={styles.projectCard}>
                    <h3>{name}</h3>
                    {description && <p>{description}</p>}
                    <div className={styles.meta}>
                      <span><strong>Status:</strong> {status}</span>
                      <span><strong>Owner:</strong> {owner}</span>
                      <span><strong>Created:</strong> {createdAt}</span>
                    </div>
                    <details>
                      <summary>Details</summary>
                      <pre className={styles.codeBlock}>{JSON.stringify(project, null, 2)}</pre>
                    </details>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
