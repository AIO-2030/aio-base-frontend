
import React, { useEffect, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { getResponseContent } from '@/util/responseUtils';
import { safeJsonParse, removeJsonComments } from '@/util/formatters';
import {
  getCachedResult,
  createContentFingerprint,
  isContentBeingProcessed,
  startContentProcessing,
  storeProcessedResult,
  hasReachedMaxAttempts
} from '@/util/json/processingTracker';

interface ResponseSectionProps {
  content: string;
  response?: string;
  hideTitle?: boolean;
}

const ResponseSection: React.FC<ResponseSectionProps> = ({ 
  content, 
  response, 
  hideTitle = false 
}) => {
  // Generate a simple content fingerprint for caching
  const contentFingerprint = useMemo(() => {
    if (!content) return '';
    return createContentFingerprint(content);
  }, [content]);
  
  // More detailed logging to debug response extraction
  useEffect(() => {
    console.log('[ResponseSection] Rendering with:', {
      hasDirectResponse: !!response,
      contentLength: content?.length || 0,
      contentPreview: content?.substring(0, 50),
      fingerprint: contentFingerprint
    });
    
    if (response) {
      console.log('[ResponseSection] Using provided response:', response);
    } else if (getCachedResult(content)) {
      console.log('[ResponseSection] Using cached response');
    } else {
      console.log('[ResponseSection] Will extract response from content');
    }
  }, [content, response, contentFingerprint]);

  // Get the appropriate response content to display
  const displayContent = useMemo(() => {
    // If direct response was provided, use it
    if (response) {
      return response;
    }
    
    // If we have already processed this content, return cached result
    const cachedResult = getCachedResult(content);
    if (cachedResult) {
      return cachedResult;
    }
    
    // If content is empty, return placeholder
    if (!content) {
      return "No content available.";
    }
    
    // Handle common JSON patterns with primary_goal without special handling for specific types
    if (content.includes('"primary_goal"')) {
      console.log('[ResponseSection] Detected structured content with primary_goal');
      // Use a generic approach to extract response from structured data
      if (content.includes('"response"')) {
        try {
          const responseMatch = content.match(/"response"\s*:\s*"([^"]+)"/);
          if (responseMatch && responseMatch[1]) {
            const extractedResponse = responseMatch[1];
            storeProcessedResult(content, extractedResponse);
            return extractedResponse;
          }
        } catch (err) {
          console.log('[ResponseSection] Failed to extract response using pattern matching');
        }
      }
    }
    
    // If this content is already being processed and max attempts reached, return safe message
    if (isContentBeingProcessed(content) && hasReachedMaxAttempts(content)) {
      return "Processing complete. Please use Execute button if needed.";
    }
    
    // Mark as being processed
    startContentProcessing(content);
    
    // Try direct JSON parse first for complete objects
    if (content.trim().startsWith('{')) {
      try {
        // Remove any potential JS comments
        const cleanContent = removeJsonComments(content);
        
        // Try direct parsing first
        const directParsed = JSON.parse(cleanContent);
        if (directParsed && typeof directParsed.response === 'string') {
          console.log('[ResponseSection] Extracted response from direct JSON parse');
          const result = directParsed.response;
          storeProcessedResult(content, result);
          return result;
        }
      } catch (directError) {
        console.log('[ResponseSection] Direct JSON parse failed', directError.message);
      }
    }
    
    // Try to extract response from content using the utility
    const responseText = getResponseContent(content);
    
    // If the extracted response is still JSON, try to get just the 'response' field
    if (responseText.trim().startsWith('{') && responseText.includes('"response"')) {
      try {
        const parsed = safeJsonParse(responseText);
        if (parsed && typeof parsed.response === 'string') {
          console.log('[ResponseSection] Extracted response from parsed JSON');
          const result = parsed.response;
          storeProcessedResult(content, result);
          return result;
        }
      } catch (error) {
        console.warn('[ResponseSection] Failed to parse response JSON:', error);
      }
    }
    
    // Simple regex extraction as fallback
    if (content.includes('"response"')) {
      const responseMatch = content.match(/"response"\s*:\s*"([^"]+)"/);
      if (responseMatch && responseMatch[1]) {
        console.log('[ResponseSection] Extracted response using regex');
        const result = responseMatch[1];
        storeProcessedResult(content, result);
        return result;
      }
    }
    
    console.log('[ResponseSection] Using original response text');
    storeProcessedResult(content, responseText);
    return responseText;
  }, [content, response]);

  return (
    <div className="p-4 mt-auto">
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-2 text-[#9b87f5]">
          <MessageCircle size={16} />
          <h3 className="font-semibold">Response</h3>
        </div>
      )}
      <div className="prose prose-invert max-w-none whitespace-pre-wrap">
        {displayContent}
      </div>
    </div>
  );
};

export default ResponseSection;
