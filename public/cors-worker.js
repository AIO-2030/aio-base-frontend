
// CORS Proxy Service Worker
// This service worker can help with CORS issues by intercepting requests
// and adding the necessary headers

self.addEventListener('install', event => {
  console.log('CORS proxy service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('CORS proxy service worker activated');
  return self.clients.claim();
});

// List of domains that need CORS handling
const corsProxyDomains = [
  'localhost',
  '127.0.0.1',
  '8.141.81.75',
  '162.218.231.180',
  '18.167.51.1'
];

// Check if a URL should be handled by our CORS proxy
function shouldHandleRequest(url) {
  return corsProxyDomains.some(domain => url.includes(domain));
}

self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Only process requests that match our target domains
  if (!shouldHandleRequest(url)) {
    return;
  }
  
  console.log('CORS proxy intercepting request to:', url);

  // Special handling for OPTIONS preflight requests
  if (event.request.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request for:', url);
    
    event.respondWith(
      new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          'Access-Control-Max-Age': '86400',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
    );
    return;
  }

  // Handle the request with added CORS headers
  event.respondWith(
    fetch(event.request, {
      mode: 'cors',
      credentials: 'omit', // Don't send cookies for cross-origin requests
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        // Add any other headers that might help bypass CORS
      }
    })
    .then(response => {
      // Clone the response so we can modify headers
      const newResponse = new Response(response.body, response);
      
      // Add CORS headers to the response
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      
      return newResponse;
    })
    .catch(error => {
      console.error('CORS proxy error:', error);
      
      // Return a friendly error response
      return new Response(
        JSON.stringify({
          error: 'CORS Proxy Error',
          message: error.message,
          url: url
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    })
  );
});
