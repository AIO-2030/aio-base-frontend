
/**
 * Utilities for network requests in voice processing
 */

/**
 * Helper function to fetch with timeout
 */
export async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  
  console.log(`[VOICE-AI] 🔄 Setting up fetch with URL: ${url}`);
  console.log(`[VOICE-AI] ⏱️ Timeout set to: ${timeout}ms`);
  
  const timeoutId = setTimeout(() => {
    console.log(`[VOICE-AI] ⏱️ Request timed out after ${timeout}ms`);
    controller.abort();
  }, timeout);
  
  try {
    console.log(`[VOICE-AI] 📡 Starting fetch request`);
    const startFetch = performance.now();
    
    const response = await fetch(url, { 
      ...options, 
      signal 
    });
    
    const fetchTime = (performance.now() - startFetch).toFixed(2);
    console.log(`[VOICE-AI] ⏱️ Fetch completed in ${fetchTime}ms with status: ${response.status}`);
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      console.error(`[VOICE-AI] ❌ Fetch error: ${error.name} - ${error.message}`);
      if (error.name === 'AbortError') {
        console.error(`[VOICE-AI] ❌ Request was aborted due to timeout (${timeout}ms)`);
      }
    } else {
      console.error(`[VOICE-AI] ❌ Unknown fetch error:`, error);
    }
    throw error;
  }
}
