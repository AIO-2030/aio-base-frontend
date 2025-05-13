
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
  
  // Log request details
  if (options.body instanceof ArrayBuffer) {
    console.log(`[VOICE-AI] 📝 Request contains raw binary data (ArrayBuffer)`);
    console.log(`[VOICE-AI] 📂 Body size: ${(options.body.byteLength / 1024).toFixed(2)} KB`);
  } else if (options.body instanceof FormData) {
    console.log(`[VOICE-AI] 📝 Request contains FormData`);
    
    // Log form data entries without actually extracting the file content
    try {
      for (const pair of options.body.entries()) {
        if (pair[1] instanceof Blob) {
          console.log(`[VOICE-AI] 📂 FormData entry: ${pair[0]}, type: ${pair[1].type}, size: ${(pair[1].size / 1024).toFixed(2)} KB`);
        } else {
          console.log(`[VOICE-AI] 📂 FormData entry: ${pair[0]}, value: ${pair[1]}`);
        }
      }
    } catch (formError) {
      console.warn(`[VOICE-AI] ⚠️ Could not log FormData entries:`, formError);
    }
  }
  
  // Log headers
  if (options.headers) {
    console.log(`[VOICE-AI] 📝 Request headers:`, options.headers);
  }
  
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
    console.log(`[VOICE-AI] 📝 Response headers:`, Object.fromEntries([...response.headers.entries()]));
    
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
