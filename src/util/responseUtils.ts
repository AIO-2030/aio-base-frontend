
import { 
  cleanJsonString, 
  fixMalformedJson,
  safeJsonParse,
  hasModalStructure,
  getResponseFromModalJson,
  extractJsonFromMarkdownSections,
  fixBackslashEscapeIssues,
  aggressiveBackslashFix
} from './formatters';

import {
  createContentFingerprint,
  getCachedResult,
  isContentBeingProcessed,
  startContentProcessing,
  storeProcessedResult,
  hasReachedMaxAttempts
} from './json/processingTracker';

export const getResponseContent = (content: string): string => {
  if (!content) return "No response content available.";
  
  console.log("[ResponseUtils] Processing response content");
  
  // Check for cached result first (most efficient)
  const cachedResult = getCachedResult(content);
  if (cachedResult) {
    console.log("[ResponseUtils] Using cached result");
    return cachedResult;
  }
  
  // Check if content is already being processed
  if (isContentBeingProcessed(content)) {
    if (hasReachedMaxAttempts(content)) {
      console.log("[ResponseUtils] Maximum processing attempts reached");
      return "Processing complete. Please click Execute if you'd like to proceed with this operation.";
    }
  }
  
  // Mark this content as being processed
  startContentProcessing(content);
  
  // Check if content is already plain text (not a JSON object)
  if (!content.trim().startsWith('{') && !content.includes('```json') && !content.includes('**Response:**')) {
    storeProcessedResult(content, content);
    return content;
  }

  // Always try direct parsing first without modifications
  try {
    if (content.trim().startsWith('{')) {
      const parsed = JSON.parse(content);
      if (parsed && parsed.response) {
        console.log("[ResponseUtils] Found response in direct JSON parse");
        storeProcessedResult(content, parsed.response);
        return parsed.response;
      }
    }
  } catch (initialError) {
    // Continue with other methods if direct parsing fails
  }

  // Try direct markdown sections (most reliable format)
  if (content.includes("**Response:**")) {
    console.log("[ResponseUtils] Found **Response:** section");
    const parts = content.split("**Response:**");
    if (parts.length > 1) {
      const result = parts[1].trim();
      storeProcessedResult(content, result);
      return result;
    }
  }

  // Extract from structured data with markdown sections
  const structuredData = extractJsonFromMarkdownSections(content);
  if (structuredData?.response) {
    console.log("[ResponseUtils] Found response in structured markdown");
    storeProcessedResult(content, structuredData.response);
    return structuredData.response;
  }

  try {
    // Try JSON parsing with our enhanced parser (only apply fixes if needed)
    if (content.trim().startsWith('{')) {
      console.log("[ResponseUtils] Attempting JSON parsing");
      
      const parsed = safeJsonParse(content);
      
      if (parsed) {
        if (parsed.response) {
          console.log("[ResponseUtils] Found response field in parsed JSON");
          storeProcessedResult(content, parsed.response);
          return parsed.response;
        }
        
        // Fallback for modal structure
        const responseFromModal = getResponseFromModalJson(parsed);
        if (responseFromModal) {
          console.log("[ResponseUtils] Found response in modal structure");
          storeProcessedResult(content, responseFromModal);
          return responseFromModal;
        }
      }
    }
    
    // Handle code block JSON parsing
    if (content.includes('```json') || content.includes('```')) {
      console.log("[ResponseUtils] Attempting code block JSON parsing");
      
      // Extract JSON from code blocks
      let codeBlockContent = content;
      if (content.includes('```json')) {
        const parts = content.split('```json');
        if (parts.length > 1) {
          codeBlockContent = parts[1].split('```')[0].trim();
        }
      } else if (content.includes('```')) {
        const parts = content.split('```');
        if (parts.length > 1) {
          codeBlockContent = parts[1].trim();
        }
      }
      
      // Get the clean JSON
      const cleanJson = cleanJsonString(codeBlockContent);
      
      // Try parsing with safe parser
      try {
        const parsed = JSON.parse(cleanJson);
        if (parsed && parsed.response) {
          console.log("[ResponseUtils] Found response in clean JSON parse");
          storeProcessedResult(content, parsed.response);
          return parsed.response;
        }
      } catch (parseError) {
        // Try with our more robust parser if direct parsing fails
        const parsed = safeJsonParse(cleanJson);
        
        if (parsed) {
          if (parsed.response) {
            console.log("[ResponseUtils] Found response in code block JSON");
            storeProcessedResult(content, parsed.response);
            return parsed.response;
          }
          
          const responseFromModal = getResponseFromModalJson(parsed);
          if (responseFromModal) {
            console.log("[ResponseUtils] Found response in modal code block structure");
            storeProcessedResult(content, responseFromModal);
            return responseFromModal;
          }
        }
      }
    }
    
    // Last resort - check for simple text after a colon
    const colonMatch = content.match(/response\s*:\s*["']?([^"'\n]+)["']?/i);
    if (colonMatch && colonMatch[1]) {
      console.log("[ResponseUtils] Found response in text pattern");
      storeProcessedResult(content, colonMatch[1].trim());
      return colonMatch[1].trim();
    }
  } catch (error) {
    console.warn("[ResponseUtils] Failed to parse response:", error);
  }
  
  // Final fallback - if nothing else worked and we're looking at raw JSON
  // extract the `response` field if it exists
  if (content.includes('"response":') || content.includes("'response':")) {
    try {
      // Use regex to extract the response value
      const responseRegex = /"response"\s*:\s*"([^"]+)"/;
      const matches = content.match(responseRegex);
      if (matches && matches[1]) {
        console.log("[ResponseUtils] Extracted response using regex");
        storeProcessedResult(content, matches[1]);
        return matches[1];
      }
    } catch (regexError) {
      console.warn("[ResponseUtils] Regex extraction failed:", regexError);
    }
  }

  console.log("[ResponseUtils] Returning original content (no special format detected)");
  
  // Store and return original content if no special format is detected
  storeProcessedResult(content, content);
  return content;
};
