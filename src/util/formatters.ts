
/**
 * Main exports file for formatting utilities
 * @deprecated This file is kept for backward compatibility.
 * Please import directly from the specific utility files.
 */

// Re-export all necessary functions from the specific utility files
export * from './json/jsonParser';
export * from './json/jsonExtractor';
export * from './json/responseFormatter';
export * from './json/codeBlockExtractor';

// Export formatters.js functions through local implementations
// to avoid circular dependencies
export function removeJsonComments(jsonString: string): string {
  if (!jsonString || typeof jsonString !== 'string') return jsonString;
  
  let inString = false;
  let escaped = false;
  let result = '';
  let i = 0;
  
  while (i < jsonString.length) {
    const current = jsonString[i];
    const next = i < jsonString.length - 1 ? jsonString[i + 1] : '';
    
    // Handle string literals
    if (current === '"' && !escaped) {
      inString = !inString;
      result += current;
      i++;
      continue;
    }
    
    // Handle escape character
    if (current === '\\' && !escaped) {
      escaped = true;
      result += current;
      i++;
      continue;
    } else {
      escaped = false;
    }
    
    // Skip comments (only when not inside a string)
    if (!inString && current === '/' && next === '/') {
      // Single-line comment
      i += 2; // Skip the "//"
      while (i < jsonString.length && jsonString[i] !== '\n') {
        i++;
      }
      // Add a space to replace the comment
      result += ' ';
      continue;
    }
    
    if (!inString && current === '/' && next === '*') {
      // Multi-line comment
      i += 2; // Skip the "/*"
      while (i < jsonString.length && !(jsonString[i] === '*' && jsonString[i + 1] === '/')) {
        i++;
      }
      if (i < jsonString.length) {
        i += 2; // Skip the "*/"
      }
      // Add a space to replace the comment
      result += ' ';
      continue;
    }
    
    // Add current character to result
    result += current;
    i++;
  }
  
  return result;
}

export function formatJsonForCanister(data: any): string {
  if (!data) return '';
  
  try {
    // If data is already a string, ensure it's valid JSON
    if (typeof data === 'string') {
      // Try to parse and re-stringify to ensure valid JSON
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed);
    }
    
    // If it's an object, stringify it
    return JSON.stringify(data);
  } catch (error) {
    console.error("[formatters] Error formatting JSON for canister:", error);
    
    // If all else fails, try to convert to string
    return String(data);
  }
}

export function formatProtocolMetadata(metadata: any): any {
  if (!metadata) return null;
  
  try {
    // Format for protocol step data
    if (metadata.protocolStep) {
      const step = metadata.protocolStep;
      
      return {
        type: 'protocol',
        step: {
          index: step.index || 0,
          total: step.total || 1,
          name: step.name || 'Protocol Step',
          action: step.action || 'process',
          status: step.status || 'completed',
          timing: step.timing || { start: Date.now(), end: Date.now(), duration: 0 }
        }
      };
    }
    
    // Format for AIO protocol data
    if (metadata.aioProtocol) {
      const protocol = metadata.aioProtocol;
      
      return {
        type: 'aio-protocol',
        protocol: {
          name: protocol.name || 'AIO Protocol',
          contextId: protocol.contextId || null,
          step: protocol.currentStep || 0,
          totalSteps: protocol.totalSteps || 1,
          operation: protocol.operation || 'process',
          status: protocol.status || 'active'
        }
      };
    }
    
    // Generic protocol data
    if (metadata.protocol) {
      return {
        type: 'generic-protocol',
        data: metadata.protocol
      };
    }
    
    return null;
  } catch (error) {
    console.log("[formatters] Error formatting protocol metadata:", error);
    return null;
  }
}

export function isAIOProtocolMessage(message: any): boolean {
  if (!message) return false;
  
  // Check metadata for protocol markers
  if (message.metadata) {
    if (message.metadata.protocolStep || 
        message.metadata.aioProtocol || 
        message.metadata.protocol) {
      return true;
    }
  }
  
  // Check for protocol content markers
  if (message.content) {
    const protocolMarkers = [
      "Protocol step",
      "Protocol execution",
      "Step execution",
      "Executing protocol",
      "Protocol completed",
      "Protocol failed",
      "Starting execution",
      "AIO protocol"
    ];
    
    for (const marker of protocolMarkers) {
      if (message.content.includes(marker)) {
        return true;
      }
    }
  }
  
  // Check for protocol message type
  if (message.messageType === 'protocol') {
    return true;
  }
  
  return false;
}

// Export a safe JSON parser that can be used throughout the application
export function safeJsonParse(jsonString: string): any {
  if (!jsonString) return null;
  
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("[formatters] Error parsing JSON:", e);
    return null;
  }
}
