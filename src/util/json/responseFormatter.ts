import { safeJsonParse } from './jsonParser';
import { cleanJsonString, extractJsonFromMarkdownSections } from './jsonExtractor';
import { fixBackslashEscapeIssues, aggressiveBackslashFix, fixMalformedJson } from './jsonParser';

// Cache and limit to prevent infinite processing loops
const processedCache = new Map<string, {result: string, timestamp: number}>();
const MAX_CACHE_SIZE = 100;
const CACHE_TTL = 60000; // 1 minute
let processingStack: string[] = [];
const MAX_PROCESSING_DEPTH = 3;

// Clear old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of processedCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      processedCache.delete(key);
    }
  }
}, 30000); // Check every 30 seconds

/**
 * Process AI response content to extract the response field if available
 */
export const processAIResponseContent = (content: string): string => {
  if (!content) return "No response content available.";
  
  // Generate a hash for the content to track processing and caching
  const contentHash = hashContent(content);
  
  // Check cache first
  if (processedCache.has(contentHash)) {
    return processedCache.get(contentHash)!.result;
  }
  
  // Prevent infinite recursion by checking processing stack
  if (processingStack.includes(contentHash)) {
    console.log("[Response Formatter] Cyclic processing detected, breaking loop");
    return "Processing complete. Please click Execute if you'd like to proceed with this operation.";
  }
  
  // Add to processing stack and limit stack size
  processingStack.push(contentHash);
  if (processingStack.length > MAX_PROCESSING_DEPTH) {
    const result = "Processing limit reached. Please click Execute if needed.";
    cacheResult(contentHash, result);
    processingStack = [];
    return result;
  }
  
  // Check if content is already plain text (not JSON)
  if (!content.trim().startsWith('{') && 
      !content.includes('```json') && 
      !content.includes('**Response:**')) {
    cacheResult(contentHash, content);
    processingStack.pop();
    return content;
  }
  
  // Check for direct response content
  const directResponse = extractResponseFromJson(content);
  if (directResponse) {
    cacheResult(contentHash, directResponse);
    processingStack.pop();
    return directResponse;
  }
  
  // Default fallback
  processingStack.pop();
  cacheResult(contentHash, content);
  return content;
};

/**
 * Extract response field from JSON content
 */
export const extractResponseFromJson = (jsonStr: string): string | null => {
  try {
    if (!jsonStr) return null;
    
    // Additional safety check before parsing
    if (typeof jsonStr !== 'string') {
      console.error("[Response Extraction] Expected string but got:", typeof jsonStr);
      return null;
    }
    
    // Detect plain text with URLs and return immediately
    if ((jsonStr.includes('http://') || jsonStr.includes('https://')) &&
        !jsonStr.includes('```') &&
        !jsonStr.trim().startsWith('{')) {
      console.log("[Response Extraction] Detected plain text with URLs, returning as is");
      return jsonStr;
    }
    
    // First check for markdown-style response section
    if (jsonStr.includes("**Response:**")) {
      const parts = jsonStr.split("**Response:**");
      if (parts.length > 1) {
        return parts[1].trim();
      }
    }
    
    // Don't proceed with JSON parsing if content is clearly plain text
    const trimmed = jsonStr.trim();
    if (!trimmed.startsWith('{') && !trimmed.includes('```json')) {
      console.log("[Response Extraction] Content appears to be plain text");
      return jsonStr;
    }
    
    // Try to parse as JSON directly first without any modifications
    try {
      const parsed = JSON.parse(jsonStr);
      
      if (parsed.response && typeof parsed.response === 'string') {
        return parsed.response;
      }
      
      // Check for nested response in AIO protocol structure
      if (parsed.intent_analysis || parsed.execution_plan) {
        return getResponseFromModalJson(parsed) || null;
      }
    } catch (initialError) {
      // Only proceed with fixes if direct parsing fails
      console.log("[Response Extraction] Initial JSON parse failed, attempting fixes");
    }
    
    // Try to parse as JSON with enhanced error handling
    try {
      console.log("[Response Extraction] Attempting to parse JSON response");
      
      // Parse with safe method that applies fixes only when needed
      const parsed = safeJsonParse(jsonStr);
      if (parsed) {
        if (parsed.response && typeof parsed.response === 'string') {
          console.log("[Response Extraction] Found direct response field");
          return parsed.response;
        }
        
        // Check for nested response in AIO protocol structure
        if (parsed.intent_analysis || parsed.execution_plan) {
          return getResponseFromModalJson(parsed) || null;
        }
      }
      
      return null;
    } catch (error) {
      console.error("[Response Extraction] JSON parsing failed:", error);
      return null;
    }
  } catch (error) {
    console.error("[Response Extraction] Unexpected error:", error);
    return null;
  }
};

/**
 * Extract response field from raw JSON
 */
export const extractResponseFromRawJson = (content: string): string | null => {
  if (!content) return null;
  
  // Special case for create_video intent
  if (content && content.includes('"primary_goal": "create_video"')) {
    console.log("[Response Extraction] Detected create_video intent, providing simple response");
    return "Processing video creation request. Please use the Execute button if you wish to proceed.";
  }
  
  try {
    // Check for JSON format
    if (content.includes('{') && content.includes('}')) {
      // Enhanced pattern for primary_goal in intent_analysis
      if (content.includes('"intent_analysis"') && 
          content.includes('"primary_goal"') && 
          !content.includes('"response"')) {
        
        try {
          const cleaned = cleanJsonString(content);
          const fixedJson = fixMalformedJson(cleaned);
          const parsed = safeJsonParse(fixedJson);
          
          if (parsed && parsed.intent_analysis && 
              parsed.intent_analysis.request_understanding && 
              parsed.intent_analysis.request_understanding.primary_goal) {
            const goal = parsed.intent_analysis.request_understanding.primary_goal;
            
            // Special handling for create_video intent
            if (goal === "create_video") {
              return "Processing video creation request. Please use the Execute button if you wish to proceed.";
            }
            
            return `I'll help you with your ${goal.replace(/_/g, ' ')} request.`;
          }
        } catch (e) {
          console.log("[formatters] Error extracting from intent analysis:", e);
        }
      }
      
      // Look for a "response" field pattern with regex first
      const responsePattern = /"response"\s*:\s*"([^"]+)"/;
      const match = content.match(responsePattern);
      
      if (match && match[1]) {
        return match[1];
      }
      
      // Try extracting from a JSON object directly
      try {
        const cleaned = cleanJsonString(content);
        const fixedJson = fixMalformedJson(cleaned);
        const parsed = safeJsonParse(fixedJson);
        
        if (parsed) {
          // Try direct response field
          if (parsed.response) {
            return parsed.response;
          }
          
          return null;
        }
      } catch (e) {
        console.log("[formatters] Error extracting response:", e);
      }
    }
    
    return null;
  } catch (error) {
    console.log("[formatters] Error in extractResponseFromRawJson:", error);
    return null;
  }
};

/**
 * Determine if a JSON structure matches the modal display format
 */
export const hasModalStructure = (obj: any): boolean => {
  if (!obj) return false;
  
  // First check for response field (simplest indicator)
  if (obj.response && typeof obj.response === 'string') {
    return true;
  }
  
  // Check for AIO protocol structure (new format from the example)
  const hasIntentAnalysis = obj.intent_analysis || 
    (typeof obj === 'object' && Object.keys(obj).some(key => 
      key.includes('intent') || 
      key.includes('analysis') || 
      key === 'request_understanding' || 
      key === 'modality_analysis' || 
      key === 'capability_mapping' ||
      key === 'primary_goal' ||
      key === 'tasks'
    ));
  
  const hasExecutionPlan = obj.execution_plan || 
    (typeof obj === 'object' && Object.keys(obj).some(key => 
      key.includes('execution') || 
      key.includes('plan') || 
      key.includes('steps') ||
      key === 'quality_metrics'
    ));
  
  return hasIntentAnalysis || hasExecutionPlan;
};

/**
 * Extract the response string from a modal-structured JSON object
 */
export const getResponseFromModalJson = (jsonObj: any): string | null => {
  if (!jsonObj) return null;
  
  // Priority handling for create_video intent to prevent infinite loops
  if (jsonObj.intent_analysis?.request_understanding?.primary_goal === "create_video") {
    console.log("[Response Modal] Detected create_video intent, providing simple response");
    return "Processing video creation request. Please use the Execute button if you wish to proceed.";
  }
  
  // Log the structure for better debugging
  console.log("Processing JSON object structure:", 
    Object.keys(jsonObj).length > 0 ? Object.keys(jsonObj) : "empty object");
  
  // Direct response field
  if (jsonObj.response && typeof jsonObj.response === 'string') {
    console.log("Found direct response field");
    return jsonObj.response;
  }
  
  // Check inside execution_plan
  if (jsonObj.execution_plan?.response) {
    console.log("Found response in execution_plan");
    return jsonObj.execution_plan.response;
  }
  
  // Check inside intent_analysis
  if (jsonObj.intent_analysis?.response) {
    console.log("Found response in intent_analysis");
    return jsonObj.intent_analysis.response;
  }
  
  // Check for the new AIO protocol structure fields
  if (jsonObj.intent_analysis?.request_understanding?.primary_goal) {
    console.log("Found primary_goal in request_understanding");
    const goal = jsonObj.intent_analysis.request_understanding.primary_goal;
    
    // Special handling for create_video intent
    if (goal === "create_video") {
      return "Processing video creation request. Please use the Execute button if you wish to proceed.";
    }
    
    return `I understand your goal: ${goal}. How can I help you further with this?`;
  }
  
  // Check nested inside intent_analysis objects
  if (jsonObj.intent_analysis) {
    console.log("Checking nested intent_analysis fields");
    const keys = Object.keys(jsonObj.intent_analysis);
    for (const key of keys) {
      if (typeof jsonObj.intent_analysis[key] === 'object' && 
          jsonObj.intent_analysis[key]?.response) {
        console.log(`Found response in intent_analysis.${key}`);
        return jsonObj.intent_analysis[key].response;
      }
    }
  }
  
  console.log("No response field found in structured data");
  return null;
};

/**
 * Format JSON for canister storage by normalizing and cleaning
 */
export const formatJsonForCanister = (data: any): string => {
  try {
    // If it's already a string, validate it's JSON
    if (typeof data === 'string') {
      try {
        JSON.parse(data); // Validate that it's parseable JSON
        return data;
      } catch (e) {
        // Not valid JSON, treat as an object and stringify it
        return JSON.stringify({ value: data });
      }
    }
    
    // Otherwise, stringify the object/array
    return JSON.stringify(data);
  } catch (error) {
    console.error("[Formatter] Error formatting JSON for canister:", error);
    // Return a fallback
    return JSON.stringify({ error: "Failed to format data" });
  }
};

/**
 * Simple hash function for content
 */
function hashContent(content: string): string {
  const sample = content.length > 50 ? 
    content.substring(0, 20) + content.substring(content.length - 20) : content;
  
  let hash = 0;
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return String(hash) + String(content.length);
}

/**
 * Cache a result with timestamp
 */
function cacheResult(key: string, result: string): void {
  // Enforce cache size limit
  if (processedCache.size >= MAX_CACHE_SIZE) {
    // Delete oldest entry
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [k, v] of processedCache.entries()) {
      if (v.timestamp < oldestTime) {
        oldestTime = v.timestamp;
        oldestKey = k;
      }
    }
    
    if (oldestKey) {
      processedCache.delete(oldestKey);
    }
  }
  
  processedCache.set(key, {
    result,
    timestamp: Date.now()
  });
}

/**
 * Converts JSON response to a formatted list string
 * @param jsonStr JSON string or object to be converted
 * @returns Formatted list string representation of the JSON
 */
export const extractJsonResponseToList = (jsonStr: string | object): string => {
  try {
    // Parse JSON if input is string, otherwise use as is
    const jsonObj = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    
    // Recursively process object to generate formatted list
    const processObject = (obj: any, prefix: string = ''): string => {
      let result = '';
      
      for (const [key, value] of Object.entries(obj)) {
        // Skip if value is one of the ignored values
        if (value === 'none' || value === 'unknown' || value === 'error') {
          continue;
        }
        
        if (typeof value === 'object' && value !== null) {
          // For object values, add key with asterisks and recursively process
          result += `${prefix}*****${key}****\n`;
          result += processObject(value, prefix + '  ');
        } else {
          // For primitive values, add key-value pair
          result += `${prefix}${key}:${value}\n`;
        }
      }
      
      return result;
    };
    
    return processObject(jsonObj).trim();
  } catch (error) {
    console.error('[Response List] Error converting JSON to list:', error);
    return 'Error: Invalid JSON format';
  }
};

/**
 * Converts JSON response to a concatenated string of all values
 * @param jsonStr JSON string or object to be converted
 * @returns Concatenated string of all values in the JSON
 */
export const extractJsonResponseToValueString = (jsonStr: string | object): string => {
  try {
    // Parse JSON if input is string, otherwise use as is
    const jsonObj = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    
    // Recursively process object to collect key-value pairs
    const processObject = (obj: any, prefix: string = ''): string[] => {
      let pairs: string[] = [];
      
      for (const [key, value] of Object.entries(obj)) {
        // Skip if value is one of the ignored values
        if (value === 'none' || value === 'unknown' || value === 'error') {
          continue;
        }
        
        const currentKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          // For object values, recursively process
          pairs = pairs.concat(processObject(value, currentKey));
        } else {
          // For primitive values, add key-value pair
          pairs.push(`${currentKey}:${value}`);
        }
      }
      
      return pairs;
    };
    
    const pairs = processObject(jsonObj);
    return `Now I need you help me do further steps with these informations,please check  and give me intent analyse result:\n${pairs.join('\n')}`;
  } catch (error) {
    console.error('[Response Value String] Error converting JSON to value string:', error);
    return 'Error: Invalid JSON format';
  }
};
