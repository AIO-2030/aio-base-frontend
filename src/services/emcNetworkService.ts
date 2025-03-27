
import { toast } from "@/components/ui/use-toast";

// Define the model options for EMC Network
export enum EMCModel {
  DEEPSEEK_CHAT = "deepseek-chat"
}

// Define message type for chat completions
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// API endpoints for EMC Network
const EMC_ENDPOINTS = [
  "http://162.218.231.180:50005/edge/16Uiu2HAm9oMkh29oyQaLRjVNn7dFxUqfHrG3xtmdFo1xmoKRPd6r/8001/v1/chat/completions",
  "http://162.218.231.180:50005/edge/16Uiu2HAmSodeWgMsMN9TWYo3QhtdC1s9TkGtaFdWqCqxwMcq3R3s/8002/v1/chat/completions",
  "http://18.167.51.1:50005/edge/16Uiu2HAmQnkL58V215wZUDCLBTxeUQZeCXUwzPZKLAQKyvBQ7c3a/8002/v1/chat/completions"
];

// Define CORS proxies
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/",
  "https://api.allorigins.win/raw?url="
];

// API key for EMC Network
const EMC_API_KEY = "833_txLiSbJibu160317539183112192";

// Timeout for API calls in milliseconds
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Function to fetch with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;
  
  console.log(`[EMC-NETWORK] 📡 Setting up fetch with timeout: ${timeout}ms`);
  const timeoutId = setTimeout(() => {
    console.log(`[EMC-NETWORK] ⏱️ Request timed out after ${timeout}ms`);
    controller.abort();
  }, timeout);
  
  try {
    console.log(`[EMC-NETWORK] 🔄 Starting fetch request to: ${url}`);
    const response = await fetch(url, { ...options, signal });
    console.log(`[EMC-NETWORK] ✅ Fetch completed with status: ${response.status}`);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.log(`[EMC-NETWORK] ❌ Fetch error: ${error instanceof Error ? error.message : String(error)}`);
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Applies a CORS proxy to a URL
 */
const applyProxy = (url: string, proxyIndex: number = 0): string => {
  if (proxyIndex >= CORS_PROXIES.length) {
    return url; // If we've tried all proxies, return the original URL
  }
  return `${CORS_PROXIES[proxyIndex]}${encodeURIComponent(url)}`;
};

/**
 * Generates a completion using the EMC Network
 * Falls back to other endpoints if one fails
 */
export const generateEMCCompletion = async (
  messages: ChatMessage[],
  model: EMCModel = EMCModel.DEEPSEEK_CHAT
): Promise<string> => {
  // Try each endpoint in order until one succeeds
  let lastError: Error | null = null;
  
  console.log(`[EMC-NETWORK] 🚀 Starting EMC completion request with model: ${model}`);
  console.log(`[EMC-NETWORK] 📝 Message count: ${messages.length}`);
  
  // We'll try each endpoint with each proxy in sequence
  for (let i = 0; i < EMC_ENDPOINTS.length; i++) {
    const baseEndpoint = EMC_ENDPOINTS[i];
    
    // Try each CORS proxy for this endpoint
    for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length + 1; proxyIndex++) {
      const endpoint = proxyIndex < CORS_PROXIES.length 
        ? applyProxy(baseEndpoint, proxyIndex)
        : baseEndpoint; // Last attempt without proxy
      
      try {
        console.log(`[EMC-NETWORK] 🔍 Trying EMC endpoint ${i + 1}/${EMC_ENDPOINTS.length} with proxy ${proxyIndex}/${CORS_PROXIES.length}: ${endpoint}`);
        
        const requestBody = JSON.stringify({
          model,
          messages,
          stream: false
        });
        
        console.log(`[EMC-NETWORK] 📊 Request payload size: ${requestBody.length} bytes`);
        
        const response = await fetchWithTimeout(
          endpoint,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${EMC_API_KEY}`
            },
            body: requestBody
          },
          REQUEST_TIMEOUT
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch((jsonError) => {
            console.log(`[EMC-NETWORK] ⚠️ Failed to parse error response: ${jsonError}`);
            return { error: { message: "Network error" } };
          });
          
          console.error(`[EMC-NETWORK] 🛑 EMC endpoint ${i + 1} with proxy ${proxyIndex} failed with status ${response.status}:`, errorData);
          throw new Error(`EMC Network error: ${errorData.error?.message || response.statusText}`);
        }
        
        console.log(`[EMC-NETWORK] 📥 Parsing response from endpoint ${i + 1} with proxy ${proxyIndex}`);
        const data = await response.json();
        
        // Check if the expected data structure is present
        if (!data.choices || !data.choices[0]?.message?.content) {
          console.error(`[EMC-NETWORK] 🧩 Invalid response format:`, data);
          throw new Error("Invalid response format from EMC Network");
        }
        
        const resultContent = data.choices[0].message.content.trim();
        console.log(`[EMC-NETWORK] ✅ EMC endpoint ${i + 1} with proxy ${proxyIndex} succeeded, response length: ${resultContent.length} chars`);
        
        return resultContent;
      } catch (error) {
        console.warn(`[EMC-NETWORK] ⚠️ EMC endpoint ${i + 1} with proxy ${proxyIndex} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Continue to the next proxy or endpoint
        continue;
      }
    }
    
    // Display a toast only when we've tried all proxies for an endpoint
    toast({
      title: `EMC endpoint ${i + 1} failed`,
      description: "Trying next endpoint...",
      variant: "default"
    });
  }
  
  // If we've tried all endpoints and proxies and none succeeded, throw the last error
  console.error("[EMC-NETWORK] ❌ All EMC endpoints failed");
  toast({
    title: "EMC Network unavailable",
    description: "All endpoints failed to respond",
    variant: "destructive"
  });
  
  throw lastError || new Error("All EMC Network endpoints failed");
};

