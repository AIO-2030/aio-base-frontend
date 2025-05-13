
/**
 * Processing Tracker
 * Tracks and caches processed content to prevent redundant operations
 */

// Cache system to avoid redundant processing
const processedCache = new Map<string, {result: any, timestamp: number}>();
const MAX_CACHE_SIZE = 100;
const CACHE_TTL = 60000; // 1 minute
const processingAttempts = new Map<string, number>();
const MAX_ATTEMPTS = 3;

/**
 * Create a fingerprint for content to use as cache key 
 */
export const createContentFingerprint = (content: string): string => {
  if (!content) return "";
  
  // Use first and last 20 chars plus length for a simple but effective fingerprint
  const sample = content.length > 50 ? 
    content.substring(0, 20) + content.substring(content.length - 20) : content;
  
  let hash = 0;
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return String(hash) + String(content.length);
};

/**
 * Get cached result for content if available
 */
export const getCachedResult = (content: string): any => {
  if (!content) return null;
  
  const fingerprint = createContentFingerprint(content);
  const cached = processedCache.get(fingerprint);
  
  if (cached) {
    return cached.result;
  }
  
  return null;
};

/**
 * Store processed result in cache
 */
export const storeProcessedResult = (content: string, result: any): void => {
  if (!content || !result) return;
  
  const fingerprint = createContentFingerprint(content);
  
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
  
  processedCache.set(fingerprint, {
    result,
    timestamp: Date.now()
  });
  
  // Reset processing attempts when we successfully process
  processingAttempts.delete(fingerprint);
};

/**
 * Check if content is currently being processed
 */
export const isContentBeingProcessed = (content: string): boolean => {
  if (!content) return false;
  
  const fingerprint = createContentFingerprint(content);
  return processingAttempts.has(fingerprint);
};

/**
 * Mark content as being processed
 */
export const startContentProcessing = (content: string): void => {
  if (!content) return;
  
  const fingerprint = createContentFingerprint(content);
  const currentAttempts = processingAttempts.get(fingerprint) || 0;
  processingAttempts.set(fingerprint, currentAttempts + 1);
};

/**
 * Check if we've reached max processing attempts
 */
export const hasReachedMaxAttempts = (content: string): boolean => {
  if (!content) return false;
  
  const fingerprint = createContentFingerprint(content);
  const attempts = processingAttempts.get(fingerprint) || 0;
  return attempts >= MAX_ATTEMPTS;
};

/**
 * Check if content has complex execution plan
 */
export const hasComplexExecutionPlan = (content: string): boolean => {
  if (!content) return false;
  
  // Check for multiple steps in execution plan
  const stepMatches = content.match(/"steps"\s*:\s*\[/g);
  if (stepMatches && stepMatches.length > 0) {
    // Count actual steps
    const stepsMatch = content.match(/"action"\s*:\s*"[^"]+"/g);
    if (stepsMatch && stepsMatch.length > 2) {
      return true;
    }
  }
  
  return false;
};

/**
 * Reset processing status for content
 */
export const resetProcessingStatus = (content: string): void => {
  if (!content) return;
  
  const fingerprint = createContentFingerprint(content);
  processingAttempts.delete(fingerprint);
};
