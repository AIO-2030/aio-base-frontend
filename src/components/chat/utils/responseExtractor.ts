
import { fixMalformedJson } from '@/util/formatters';
import { extractJsonFromChatMessage, isLikelyJson } from '@/util/json/chatJsonHandler';

/**
 * Checks if content likely contains AIO protocol structures
 */
const isLikelyAIOProtocolJSON = (content: string): boolean => {
  if (!content) return false;
  
  // Check for protocol indicators
  return content.includes('"protocol"') || 
         content.includes('"aioProtocol"') || 
         content.includes('"protocolStep"') ||
         content.includes('"trace_id"');
};

/**
 * Extract response text from structured content
 */
const extractResponseText = (content: string): string | null => {
  try {
    if (!content) return null;
    
    // Try to find response field in JSON
    if (content.includes('"response"')) {
      const match = content.match(/"response"\s*:\s*"([^"]+)"/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Check for markdown response section
    if (content.includes("**Response:**")) {
      const parts = content.split("**Response:**");
      if (parts.length > 1) {
        return parts[1].trim();
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting response text:", error);
    return null;
  }
};

export const extractResponseFromContent = (content: string): string => {
  if (!content) return "No response content available.";

  // Check for structured format with markdown sections
  if (content.includes("**Response:**")) {
    const parts = content.split("**Response:**");
    if (parts.length > 1) {
      return parts[1].trim();
    }
  }

  // Try our specialized check for AIO protocol format
  if (isLikelyAIOProtocolJSON(content)) {
    const responseText = extractResponseText(content);
    if (responseText) {
      return responseText;
    }
  }

  // Fallback to our robust chat JSON extractor
  const result = extractJsonFromChatMessage(content);
  if (result.success && result.response) {
    return result.response;
  }

  // Return original content if no special format is detected
  return content;
};
