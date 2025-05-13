
import * as mockApi from '../mockApi';
import { isUsingMockApi } from './apiConfig';

/**
 * Fetch list of all projects
 * @returns Promise resolving to array of projects
 */
export const getProjects = (): Promise<mockApi.Project[]> => {
  if (isUsingMockApi()) {
    return mockApi.getProjects();
  }
  
  // This would be the real ICP Canister call
  // For now, return mock data
  console.log('Using ICP Canister would be implemented here');
  return mockApi.getProjects();
};

/**
 * Fetch a specific project by ID
 * @param id Project identifier
 * @returns Promise resolving to project or undefined
 */
export const getProject = (id: string): Promise<mockApi.Project | undefined> => {
  if (isUsingMockApi()) {
    return mockApi.getProject(id);
  }
  
  // Real implementation would go here
  return mockApi.getProject(id);
};

/**
 * Fetch list of all repositories
 * @returns Promise resolving to array of repositories
 */
export const getRepositories = () => {
  if (isUsingMockApi()) {
    return mockApi.getRepositories();
  }
  
  // Real implementation would go here
  return mockApi.getRepositories();
};

/**
 * Fetch a specific repository by ID
 * @param id Repository identifier
 * @returns Promise resolving to repository or undefined
 */
export const getRepository = (id: string) => {
  if (isUsingMockApi()) {
    return mockApi.getRepository(id);
  }
  
  // Real implementation would go here
  return mockApi.getRepository(id);
};
