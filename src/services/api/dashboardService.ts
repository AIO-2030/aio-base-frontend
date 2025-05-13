
import * as mockApi from '../mockApi';
import { isUsingMockApi } from './apiConfig';

/**
 * Fetch statistics for the dashboard
 * @returns Promise resolving to dashboard statistics
 */
export const getDashboardStats = async (): Promise<mockApi.DashboardStats> => {
  console.log('Fetching dashboard statistics');
  
  if (isUsingMockApi()) {
    return mockApi.getDashboardStats();
  }
  
  // Real implementation would aggregate data from multiple canisters
  return mockApi.getDashboardStats();
};
