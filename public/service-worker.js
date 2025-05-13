
// Service worker for handling audio permissions and CORS for EMC Network and SiliconFlow requests
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service worker installed successfully');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  console.log('Service worker activated and claimed clients');
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  // Log received messages but don't attempt to use bridge messenger
  console.log('Service worker received message:', event.data);
  
  // Send response back to main thread
  if (event.source) {
    event.source.postMessage({
      type: 'SW_RESPONSE',
      payload: 'Message received by service worker'
    });
  }
});

// Create a network status tracker
let isOnline = true;
let networkStatusClients = new Set();

// Function to broadcast network status to all clients
function broadcastNetworkStatus(status) {
  isOnline = status;
  
  networkStatusClients.forEach(client => {
    client.postMessage({
      type: 'NETWORK_STATUS',
      online: status
    });
  });
  
  console.log(`[Service Worker] Network status: ${status ? 'ONLINE' : 'OFFLINE'}`);
}

// Set up network status monitoring
self.addEventListener('online', () => {
  broadcastNetworkStatus(true);
});

self.addEventListener('offline', () => {
  broadcastNetworkStatus(false);
});

// Subscribe clients to network status updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SUBSCRIBE_NETWORK_STATUS') {
    networkStatusClients.add(event.source);
    
    // Send immediate status
    event.source.postMessage({
      type: 'NETWORK_STATUS',
      online: isOnline
    });
    
    console.log('[Service Worker] Client subscribed to network status updates');
  }
  
  if (event.data && event.data.type === 'UNSUBSCRIBE_NETWORK_STATUS') {
    networkStatusClients.delete(event.source);
    console.log('[Service Worker] Client unsubscribed from network status updates');
  }
});

// Add fetch event listener to handle HTTP requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle LLM Studio requests
  if (url.hostname === 'localhost' && url.port === '1234') {
    console.log('Service worker intercepting LLM Studio request:', url.toString());
    
    // Handle preflight requests
    if (event.request.method === 'OPTIONS') {
      console.log('Handling OPTIONS preflight request for LLM Studio');
      event.respondWith(
        new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json'
          }
        })
      );
      return;
    }
    
    // For actual requests, create a modified request
    console.log('Forwarding request to LLM Studio:', event.request.method, 'to URL:', event.request.url);
    
    // Add timeout to the fetch request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('LLM Studio request timeout')), 30000);
    });
    
    const fetchOptions = {
      method: event.request.method,
      headers: (() => {
        // Create a new headers object
        const newHeaders = new Headers();
        
        // Copy all original headers
        for (const [key, value] of event.request.headers.entries()) {
          newHeaders.append(key, value);
        }
        
        // Ensure Content-Type is set
        if (!newHeaders.has('Content-Type')) {
          newHeaders.append('Content-Type', 'application/json');
        }
        
        return newHeaders;
      })(),
      body: event.request.method !== 'GET' ? event.request.clone().body : undefined,
      mode: 'cors', // Changed back to 'cors' for streaming requests
      credentials: 'omit',
      duplex: 'half',
      redirect: 'follow'
    };
    
    console.log('LLM Studio fetch options:', JSON.stringify({
      method: fetchOptions.method,
      headers: Array.from(fetchOptions.headers.entries()),
      mode: fetchOptions.mode,
      credentials: fetchOptions.credentials
    }));
    
    event.respondWith(
      Promise.race([
        fetch(event.request.url, fetchOptions),
        timeoutPromise
      ])
      .then(response => {
        console.log('LLM Studio response received with status:', response.status);
        
        // Create a new response with CORS headers
        const newHeaders = new Headers({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          'Content-Type': 'application/json'
        });
        
        // Process the response body to handle think labels
        return response.text().then(text => {
          // Log think labels and their contents
          const thinkMatches = text.match(/<think>([\s\S]*?)<\/think>/g);
          if (thinkMatches) {
            thinkMatches.forEach(match => {
              console.log('[LLM-STUDIO] Think label content:', match);
            });
          }
          
          // Remove think labels and their contents
          const processedText = text.replace(/<think>[\s\S]*?<\/think>/g, '');
          
          return new Response(processedText, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        });
      })
      .catch(error => {
        const errorMessage = error.toString();
        console.error('LLM Studio fetch error:', errorMessage);
        console.error('Stack trace:', error.stack || 'No stack trace available');
        
        // Return error response with CORS headers
        return new Response(JSON.stringify({ 
          error: { 
            message: 'Failed to connect to LLM Studio',
            details: errorMessage,
            url: event.request.url
          } 
        }), {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
          }
        });
      })
    );
    return;
  }
  
  // For EMC Network requests, handle CORS and proxy the request
  if (url.hostname === '162.218.231.180' || url.hostname === '18.167.51.1' || 
      url.hostname === 'openapi.emchub.ai' || url.hostname === 'api.siliconflow.cn') {
    console.log('Service worker intercepting EMC Network/API request:', url.toString());
    
    // Special handling for preflight requests - add more comprehensive headers
    if (event.request.method === 'OPTIONS') {
      console.log('Handling OPTIONS preflight request for EMC Network endpoint:', url.pathname);
      event.respondWith(
        new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Allow-Credentials': 'true'
          }
        })
      );
      return;
    }
    
    // For actual requests, create a modified request without CORS restrictions
    console.log('Forwarding request to EMC Network:', event.request.method, 'to URL:', event.request.url);
    
    // Add timeout to the fetch request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('EMC Network request timeout')), 30000);
    });
    
    const fetchOptions = {
      method: event.request.method,
      headers: (() => {
        // Create a new headers object
        const newHeaders = new Headers();
        
        // Store the original Content-Type if it's multipart/form-data
        let originalContentType = null;
        
        // Copy all original headers
        for (const [key, value] of event.request.headers.entries()) {
          if (key.toLowerCase() === 'content-type' && value.includes('multipart/form-data')) {
            // Save it to add back later
            originalContentType = value;
            console.log('Found FormData Content-Type:', value);
          } else {
            newHeaders.append(key, value);
          }
        }
        
        // Ensure Authorization is present with Bearer prefix
        if (!newHeaders.has('Authorization')) {
          newHeaders.append('Authorization', 'Bearer 833_txLiSbJibu160317539183112192');
        }
        
        // Important: Add back the multipart/form-data Content-Type if we found one
        if (originalContentType) {
          newHeaders.append('Content-Type', originalContentType);
          console.log('Added back FormData Content-Type header', originalContentType);
        }
        
        return newHeaders;
      })(),
      // Don't modify or clone the body for FormData requests
      body: event.request.method !== 'GET' && event.request.method !== 'HEAD' ? event.request.clone().body : undefined,
      mode: 'cors',
      credentials: 'omit',
      duplex: 'half', // Add this parameter for streaming body requests
      redirect: 'follow'
    };
    
    console.log('Fetch options:', JSON.stringify({
      method: fetchOptions.method,
      headers: Array.from(fetchOptions.headers.entries()),
      mode: fetchOptions.mode,
      credentials: fetchOptions.credentials
    }));
    
    event.respondWith(
      Promise.race([
        fetch(event.request.url, fetchOptions),
        timeoutPromise
      ])
      .then(response => {
        console.log('EMC Network response received with status:', response.status);
        // Clone the response and add CORS headers
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        
        // Check if the response is an error
        if (!response.ok) {
          console.error(`EMC Network error with status ${response.status}`);
          return response.text().then(text => {
            console.error('EMC Network error response:', text);
            
            // Broadcast network status (we're online but the service is returning errors)
            broadcastNetworkStatus(true);
            
            // Return a more helpful error response
            return new Response(JSON.stringify({ 
              error: { message: `EMC Network error (${response.status}): ${text}` } 
            }), {
              status: response.status,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            });
          });
        }
        
        // Broadcast that we're online
        broadcastNetworkStatus(true);
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      })
      .catch(error => {
        const errorMessage = error.toString();
        console.error('EMC Network fetch error:', errorMessage);
        console.error('Stack trace:', error.stack || 'No stack trace available');
        
        // Broadcast network status as offline if we can't reach anything
        broadcastNetworkStatus(false);
        
        // Try a direct check to diagnose network connectivity issues
        return fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' })
          .then(() => {
            // If Google is reachable but EMC isn't, it's likely an EMC-specific issue
            console.log('Internet connection is working, but EMC Network is unreachable');
            broadcastNetworkStatus(true); // We're online, but the service is down
            
            return new Response(JSON.stringify({ 
              error: { 
                message: 'Failed to connect to EMC Network while internet is available',
                details: errorMessage,
                url: event.request.url
              } 
            }), {
              status: 502, // Bad Gateway
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            });
          })
          .catch(() => {
            // If Google is also unreachable, it's likely a general network issue
            console.log('General internet connectivity issue detected');
            broadcastNetworkStatus(false);
            
            return new Response(JSON.stringify({ 
              error: { 
                message: 'Network connectivity issue detected',
                details: errorMessage,
                url: event.request.url
              } 
            }), {
              status: 503, // Service Unavailable
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            });
          });
      })
    );
    return;
  }
  
  // For all other requests, use default handling
  return;
});
