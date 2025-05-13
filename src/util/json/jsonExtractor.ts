import { fixMalformedJson, safeJsonParse } from './jsonParser';

/**
 * Extract JSON from markdown sections, such as **Analysis:** ```json { ... } ```
 */
export const extractJsonFromMarkdownSections = (content: string): Record<string, any> | null => {
  try {
    if (!content) return null;
    
    const result: Record<string, any> = {};
    
    // Match patterns like **Analysis:** ```json { ... } ```
    const analysisMatch = content.match(/\*\*Analysis:\*\*\s*```json\s*([\s\S]*?)```/);
    if (analysisMatch && analysisMatch[1]) {
      try {
        const fixedJson = fixMalformedJson(analysisMatch[1]);
        result.intent_analysis = JSON.parse(fixedJson);
      } catch (e) {
        console.warn("Failed to parse Analysis section:", e);
      }
    }
    
    // Match patterns like **Execution Plan:** ```json { ... } ```
    const executionMatch = content.match(/\*\*Execution Plan:\*\*\s*```json\s*([\s\S]*?)```/);
    if (executionMatch && executionMatch[1]) {
      try {
        const fixedJson = fixMalformedJson(executionMatch[1]);
        result.execution_plan = JSON.parse(fixedJson);
      } catch (e) {
        console.warn("Failed to parse Execution Plan section:", e);
      }
    }
    
    // Match patterns like **Response:** "text"
    const responseMatch = content.match(/\*\*Response:\*\*\s*(?:"([^"]*)"|([\s\S]*?)(?:```|$))/);
    if (responseMatch) {
      const responseText = (responseMatch[1] || responseMatch[2] || '').trim();
      result.response = responseText;
    }
    
    if (Object.keys(result).length > 0) {
      return result;
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting JSON from markdown sections:", error);
    return null;
  }
};

/**
 * Extract JSON from text content
 */
export const extractJsonFromText = (text: string): string | null => {
  try {
    if (!text) return null;
    
    // Special handling for ```json format
    if (text && text.includes('```json')) {
      const parts = text.split('```json');
      if (parts.length > 1) {
        const jsonPart = parts[1].split('```')[0].trim();
        try {
          const fixedJsonPart = fixMalformedJson(jsonPart);
          JSON.parse(fixedJsonPart);
          return fixedJsonPart;
        } catch (e) {
          // If direct parsing fails, try with the validator
          return extractAndValidateJson(text);
        }
      }
    }
    
    return extractAndValidateJson(text);
  } catch (error) {
    console.error("[JSON Extraction] Error in extractJsonFromText:", error);
    return null;
  }
};

/**
 * Clean JSON string for proper parsing by removing markdown code blocks
 */
export const cleanJsonString = (jsonString: string): string => {
  if (!jsonString) return '';
  
  // Early return for obvious plain text
  if ((jsonString.includes('http://') || jsonString.includes('https://')) &&
      !jsonString.includes('```') && 
      !jsonString.includes('{')) {
    console.log("[JSON Cleaning] Plain text with URLs detected, skipping JSON cleaning");
    return jsonString;
  }
  
  // Remove markdown code blocks
  if (jsonString.includes('```json')) {
    const parts = jsonString.split('```json');
    if (parts.length > 1) {
      const content = parts[1].split('```')[0].trim();
      return fixMalformedJson(content);
    }
  }
  
  // Remove other code block formats
  if (jsonString.includes('```')) {
    const parts = jsonString.split('```');
    if (parts.length > 1) {
      const content = parts[1].trim();
      // Verify the extracted content looks like JSON before fixing
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        return fixMalformedJson(content);
      } else {
        console.log("[JSON Cleaning] Code block content doesn't appear to be JSON");
        return content;
      }
    }
  }
  
  // For raw JSON format with no code blocks
  if (jsonString.trim().startsWith('{') || jsonString.trim().startsWith('[')) {
    return fixMalformedJson(jsonString);
  }
  
  // If we can't identify clear JSON structure, return as is
  if (!jsonString.includes('{') && !jsonString.includes('[')) {
    return jsonString;
  }
  
  return fixMalformedJson(jsonString);
};

/**
 * Extract and validate JSON from text content
 */
export const extractAndValidateJson = (text: string): string | null => {
  try {
    if (!text) return null;
    
    // First, sanitize and clean the input text
    const cleanedText = text.trim()
      .replace(/\n/g, ' ')  // Remove newlines
      .replace(/\s+/g, ' ')  // Normalize whitespaces
      .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
      .replace(/,\s*\]/g, ']');  // Remove trailing commas in arrays

    console.log("[JSON Extraction] Cleaned text:", cleanedText.substring(0, 500) + (cleanedText.length > 500 ? "..." : ""));

    // Try extracting JSON using regex
    const jsonRegex = /\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\})*)*\}))*\}/g;
    const matches = cleanedText.match(jsonRegex);

    if (matches && matches.length > 0) {
      for (const jsonCandidate of matches) {
        try {
          const fixedJson = fixMalformedJson(jsonCandidate);
          const parsedJson = JSON.parse(fixedJson);
          return JSON.stringify(parsedJson);  // Return a canonicalized version
        } catch (parseError) {
          console.warn("[JSON Extraction] Parse attempt failed:", parseError);
        }
      }
    }

    console.error("[JSON Extraction] No valid JSON found in text");
    return null;
  } catch (error) {
    console.error("[JSON Extraction] Unexpected error:", error);
    return null;
  }
};
