
// Utility functions for canister calls

/**
 * Logger utility for canister calls
 */
export const logger = {
  info: (context: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}][INFO][${context}] ${message}`, data || '');
  },
  error: (context: string, message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}][ERROR][${context}] ${message}`, error || '');
  },
  debug: (context: string, message: string, data?: any) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      console.debug(`[${timestamp}][DEBUG][${context}] ${message}`, data || '');
    }
  }
};

/**
 * Wrapper function for canister calls to add logging
 * @param functionName Name of the function being called
 * @param params Parameters passed to the function
 * @param callFn Function that makes the actual canister call
 * @returns Result of the canister call
 */
export const loggedCanisterCall = async <T>(
  functionName: string, 
  params: any, 
  callFn: () => Promise<T>
): Promise<T> => {
  logger.debug(functionName, 'Calling canister function', params);
  
  try {
    const result = await callFn();
    logger.debug(functionName, 'Canister call successful', { result });
    return result;
  } catch (error) {
    logger.error(functionName, 'Canister call failed', error);
    throw error;
  }
};
