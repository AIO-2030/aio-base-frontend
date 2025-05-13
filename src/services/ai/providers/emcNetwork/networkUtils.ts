
/**
 * Network utilities for EMC Network provider
 */

/**
 * Fetch with timeout for EMC Network
 */
export async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  
  console.log(`[EMC-NETWORK] 📡 Setting up fetch with timeout: ${timeout}ms`);
  console.log(`[EMC-NETWORK] 🔄 Request URL: ${url}`);
  console.log(`[EMC-NETWORK] 🔄 Request method: ${options.method}`);
  
  // Log headers for debugging
  if (options.headers) {
    console.log(`[EMC-NETWORK] 🔄 Request headers:`, options.headers);
  }
  
  const timeoutId = setTimeout(() => {
    console.log(`[EMC-NETWORK] ⏱️ Request timed out after ${timeout}ms`);
    controller.abort();
  }, timeout);
  
  try {
    console.log(`[EMC-NETWORK] 🔄 Starting fetch request to: ${url}`);
    
    // Let the service worker handle the actual CORS issues
    const response = await fetch(url, { 
      ...options, 
      signal,
      // Note: These settings are handled by the service worker
      mode: 'cors', 
      credentials: 'omit'
    });
    
    console.log(`[EMC-NETWORK] ✅ Fetch completed with status: ${response.status}`);
    console.log(`[EMC-NETWORK] 🔄 Response headers:`, Object.fromEntries([...response.headers.entries()]));
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.log(`[EMC-NETWORK] ❌ Fetch error: ${error instanceof Error ? error.message : String(error)}`);
    console.log(`[EMC-NETWORK] ❌ Error details:`, error);
    clearTimeout(timeoutId);
    throw error;
  }
}
