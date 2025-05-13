// Helper functions for environment-related utilities

/**
 * Determines if we're running in the local network environment
 */
export const isLocalNet = (): boolean => {
  // Check for Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) { 
    console.log('ENV: Using Vite environment', import.meta.env.VITE_DFX_NETWORK);
    return import.meta.env.VITE_DFX_NETWORK === 'local';
  }
  // Check for Node environment
  if (typeof process !== 'undefined' && process.env) {
    console.log('ENV: Using Node environment');
    return process.env.DFX_NETWORK === 'local';
  }
  // Default to false if neither environment variable system is available
  console.log('ENV: No environment detected, defaulting to false');
  return false;
};

/**
 * Gets a canister ID based on the current environment
 * @param localId The canister ID for local development
 * @param prodId The canister ID for production
 */
export const getCanisterId = (localId: string, prodId: string): string => {
  return isLocalNet() ? localId : prodId;
};

/**
 * Gets an environment variable safely across different environments
 * @param name The name of the environment variable
 * @param defaultValue Optional default value if not found
 */
export const getEnvVar = (name: string, defaultValue: string = ''): string => {
  // Check for Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name] || defaultValue;
  }
  // Check for Node environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue;
  }
  // Return default if neither environment variable system is available
  return defaultValue;
};

/**
 * Safely get a boolean environment variable
 * @param name The name of the environment variable
 * @param defaultValue Default value if not found
 */
export const getBoolEnvVar = (name: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(name, String(defaultValue));
  return value === 'true' || value === '1';
};
