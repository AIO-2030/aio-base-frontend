
import axios, { AxiosRequestConfig, AxiosResponse, RawAxiosResponseHeaders, AxiosResponseHeaders } from 'axios';

/**
 * Creates an axios instance configured for making CORS-friendly requests
 * by ensuring proper headers are set
 */
export const createCorsProxyClient = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    // Disable credentials for cross-origin requests unless specifically needed
    withCredentials: false
  });

  // Request interceptor to enforce proper CORS headers
  instance.interceptors.request.use((config) => {
    // Ensure we're using HTTP (not HTTPS) for these specific external servers
    if (config.url?.startsWith('https://8.141.81.75')) {
      config.url = config.url.replace('https://', 'http://');
    }
    
    // Add CORS headers to every request
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
    
    return config;
  });

  // Add a response interceptor for better error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Special handling for CORS errors
      if (error.message && error.message.includes('Network Error')) {
        console.error('CORS Error Detected:', error);
        console.log('This is likely a CORS issue. The server at', baseURL, 'needs to allow requests from your origin.');
        
        return Promise.reject({
          ...error,
          isCorsError: true,
          message: `CORS Error: Unable to access ${baseURL}. The server needs to allow cross-origin requests from your application.`
        });
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Makes a CORS-friendly POST request for file upload
 * @param url The URL to post to
 * @param formData FormData object containing the file
 * @param config Additional axios configuration
 */
export const corsProxyUpload = async (
  url: string, 
  formData: FormData, 
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  try {
    // First make an OPTIONS preflight request manually to check CORS
    console.log(`Making manual OPTIONS preflight request to: ${url}`);
    
    try {
      await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, X-Requested-With',
          'Origin': window.location.origin
        }
      });
      console.log('Preflight request succeeded');
    } catch (preflightErr) {
      console.log('Preflight request failed (expected). Continuing with service worker proxy:', preflightErr);
    }
    
    // Create a temporary axios instance just for this request
    const instance = axios.create({
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
        // In browsers, this header can help with CORS preflight
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': window.location.origin
      },
      // Disable credentials for cross-origin requests
      withCredentials: false
    });
    
    // Log the request details for debugging
    console.log(`Making CORS-friendly upload request to: ${url}`, {
      method: 'POST',
      contentType: 'multipart/form-data',
      formDataKeys: Array.from(formData.keys())
    });
    
    // Try the request with service worker enabled first
    try {
      const response = await instance.post(url, formData);
      return response;
    } catch (error) {
      console.error('Upload failed with service worker, falling back to direct fetch:', error);
      
      // If service worker fails, try a direct fetch as a fallback
      const fetchResponse = await fetch(url, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit'
      });
      
      // Convert fetch response to axios-like response
      const data = await fetchResponse.json();
      
      // Create a proper Axios-compatible headers object from fetch Headers
      const headersObj: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      
      // Return a properly typed AxiosResponse
      return {
        data,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: headersObj as RawAxiosResponseHeaders,
        config: {},
        request: {} // Add request property to match AxiosResponse structure
      } as AxiosResponse;
    }
  } catch (error) {
    console.error('Error in CORS proxy upload (all methods failed):', error);
    throw error;
  }
};
