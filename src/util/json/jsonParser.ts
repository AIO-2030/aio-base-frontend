/**
 * Core JSON parsing and validation utilities
 */

/**
 * Check if a string is valid JSON
 */
export const isValidJson = (text: string): boolean => {
  try {
    // Quick check to avoid unnecessary parsing attempts
    if (!text || typeof text !== 'string') return false;
    
    // Simple heuristic - JSON objects/arrays must start with { or [
    const trimmed = text.trim();
    if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
      return false;
    }
    
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * More aggressive fix for complex backslash escaping issues
 */
export const aggressiveBackslashFix = (jsonString: string): string => {
  // First remove all backslashes
  let result = jsonString.replace(/\\/g, '');
  
  // Then properly re-escape property name quotes
  result = result.replace(/({|,)\s*"([^"]+)"\s*:/g, (match, prefix, propName) => {
    return `${prefix}"${propName}":`;
  });
  
  // Ensure string values have proper quotes
  result = result.replace(/:\s*"([^"]*)"/g, (match, value) => {
    return `: "${value.replace(/"/g, '\\"')}"`;
  });
  
  return result;
};

/**
 * Fix issues with backslash escaping in JSON strings
 */
export const fixBackslashEscapeIssues = (jsonString: string): string => {
  return jsonString
    // Fix common backslash escape issues
    .replace(/\\"/g, '"')  // First remove escaped quotes
    .replace(/(?<!")(")((?=.*:))/g, '\\"')  // Then properly escape property name quotes
    .replace(/(?<=:\s*").*?(?<!\\)"(?=.*")/g, (match) => match.replace(/"/g, '\\"'));  // Fix unescaped quotes in values
};

/**
 * Special emergency fix for missing colons after property names
 */
export const emergencyFixMissingColons = (jsonString: string): string => {
  // Find property name patterns without colons
  return jsonString.replace(/("[\w\s]+")\s+("[\w\s]+"|\{|\[)/g, '$1: $2');
};

/**
 * Fix quotes and backslashes in a specific line of JSON
 */
export const fixQuotesAndBackslashesInLine = (json: string, lineStart: number, lineEnd: number): string => {
  const beforeLine = json.substring(0, lineStart);
  const line = json.substring(lineStart, lineEnd);
  const afterLine = json.substring(lineEnd);
  
  // Fix common backslash and quote issues in the problematic line
  let fixedLine = line
    // Fix escaped quotes that shouldn't be escaped (common in malformed JSON)
    .replace(/\\"/g, '"')
    // Then properly escape any quotes that need it
    .replace(/(?<!")(")((?=.*:))/, '\\"')
    // Fix double backslashes
    .replace(/\\\\/g, '\\')
    // Fix any remaining unescaped quotes in string values
    .replace(/(?<=:\s*").*?(?<!\\)"(?=.*")/g, (match) => match.replace(/"/g, '\\"'));
  
  return beforeLine + fixedLine + afterLine;
};

/**
 * Attempt to fix common JSON syntax errors
 */
export const fixMalformedJson = (jsonString: string): string => {
  try {
    if (!jsonString) return jsonString;
    
    // First validate if the string is already valid JSON - if so, return it unmodified
    console.log('[fixMalformedJson] Checking if JSON is valid');
    try {
      JSON.parse(jsonString);
      console.log('[fixMalformedJson] JSON is valid, returning unmodified');
      return jsonString; // Already valid JSON, don't modify it
    } catch (error) {
      console.log('[fixMalformedJson] JSON is not valid, continuing with fixes');
      // Not valid JSON, continue with fixes
    }
    
    // Clean up code block syntax first (handle ```json prefix/suffix)
    console.log('[fixMalformedJson] Cleaning up code block syntax');
    let fixedJson = jsonString;
    if (fixedJson.includes('```json')) {
      const parts = fixedJson.split('```json');
      if (parts.length > 1) {
        fixedJson = parts[1].split('```')[0].trim();
      }
    } else if (fixedJson.includes('```')) {
      const parts = fixedJson.split('```');
      if (parts.length > 1) {
        fixedJson = parts[1].trim();
      }
    }
    
    // Remove comments (//...)
    console.log('[fixMalformedJson] Removing comments');
    fixedJson = fixedJson.replace(/\/\/.*$/gm, '');
    
    // Don't try to parse non-JSON content
    console.log('[fixMalformedJson] Checking if JSON is valid after removing comments');
    if (!fixedJson.includes('{') && !fixedJson.includes('[')) {
      return fixedJson;
    }
    
    // Log original content for debugging
    console.log('Original JSON before fixes:', fixedJson.substring(0, 100) + '...');
    
    // First step: Fix the problematic backslash patterns that are causing the errors
    // This is the most critical fix for the "intent\": \"value" pattern
    fixedJson = fixedJson.replace(/"([^"]+)\\": \\"([^"]+)"/g, '"$1": "$2"');
    
    // Fix incorrect backslash escaping in property names with spaces
    fixedJson = fixedJson.replace(/("[\w\s-]+)\\(":\s*")/g, '$1$2');
    fixedJson = fixedJson.replace(/("[\w\s-]+)\\(":\s*\\?")/g, '$1$2');
    
    // Fix unescaped quotes within string values
    fixedJson = fixedJson.replace(/(?<=([:,]\s*").*?)(?<!\\)"(?=.*?")/g, '\\"');
    
    // Fix missing quotes around property names
    fixedJson = fixedJson.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
    
    // Fix missing commas between array items - more precise version
    fixedJson = fixedJson.replace(/(?<=\]|"|true|false|null|\d+|\})\s+(?=\[|"|true|false|null|\d+|\{)/g, ', ');
    
    // Fix missing commas between object properties - more precise version
    fixedJson = fixedJson.replace(/(?<=\})\s+(?=")/g, ', ');
    
    // Fix missing colons after property names - more precise version
    fixedJson = fixedJson.replace(/(?<=")\s+(?="|\{|\[|true|false|null|-?\d+(?:\.\d+)?)/g, ': ');
    
    // Fix missing commas in nested objects - more precise version
    fixedJson = fixedJson.replace(/(?<=\})\s+(?="|\{|\[)/g, ', ');
    
    // Fix array elements that are objects - this is the key fix for the current issue
    fixedJson = fixedJson.replace(/\[\s*:\s*\{/g, '[{');
    fixedJson = fixedJson.replace(/}\s*,\s*"dependencies"\s*:\s*\[\s*"/g, '}, "dependencies": ["');
    
    // Fix array elements with complex nested structures
    fixedJson = fixedJson.replace(/\[\s*{\s*"action"/g, '[{"action"');
    fixedJson = fixedJson.replace(/}\s*,\s*{\s*"action"/g, '},{"action"');
    fixedJson = fixedJson.replace(/}\s*,\s*"mcp"/g, '},"mcp"');
    
    // Fix nested array items
    fixedJson = fixedJson.replace(/"items"\s*:\s*\[\s*"string"\s*\]/g, '"items": ["string"]');
    fixedJson = fixedJson.replace(/"items"\s*:\s*\[\s*"URL"\s*\]/g, '"items": ["URL"]');
    
    // Fix array closing brackets
    fixedJson = fixedJson.replace(/\}\s*\]/g, '}]');
    fixedJson = fixedJson.replace(/"\s*\]/g, '"]');
    
    // Fix object closing braces
    fixedJson = fixedJson.replace(/\}\s*\}/g, '}}');
    
    // Remove trailing commas
    fixedJson = fixedJson.replace(/,(\s*[\}\]])/g, '$1');
    
    // Fix any remaining malformed array elements
    fixedJson = fixedJson.replace(/\[\s*{\s*"([^"]+)"\s*:\s*"([^"]+)"\s*}/g, '[{"$1": "$2"}]');
    fixedJson = fixedJson.replace(/\[\s*{\s*"([^"]+)"\s*:\s*(\d+)\s*}/g, '[{"$1": $2}]');
    
    // Fix any remaining malformed object properties
    fixedJson = fixedJson.replace(/"([^"]+)"\s*:\s*"([^"]+)"\s*}/g, '"$1": "$2"}');
    fixedJson = fixedJson.replace(/"([^"]+)"\s*:\s*(\d+)\s*}/g, '"$1": $2}');
    
    // Add missing closing braces/brackets
    let openBraces = (fixedJson.match(/{/g) || []).length;
    let closeBraces = (fixedJson.match(/}/g) || []).length;
    let openBrackets = (fixedJson.match(/\[/g) || []).length;
    let closeBrackets = (fixedJson.match(/\]/g) || []).length;
    
    while (openBraces > closeBraces) {
      fixedJson += '}';
      closeBraces++;
    }
    
    while (openBrackets > closeBrackets) {
      fixedJson += ']';
      closeBrackets++;
    }
    
    // Log the fixed JSON for debugging
    console.log('Fixed JSON after processing:', fixedJson.substring(0, 100) + '...');
    
    return fixedJson;
  } catch (error) {
    console.error("Error in JSON fixing:", error);
    return jsonString;
  }
};

/**
 * Safely parse JSON with error handling
 */
export const safeJsonParse = (jsonString: string): any => {
  try {
    if (!jsonString) return null;
    
    // Improved check for non-JSON content
    const trimmed = jsonString.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.log("[JSON Parser] Input doesn't appear to be JSON:", trimmed.substring(0, 50) + "...");
      return null;
    }
    
    // First try direct parsing without any modifications
    try {
      return JSON.parse(jsonString);
    } catch (initialError) {
      console.log("Initial JSON parsing failed, attempting fixes:", initialError.message);
    }
    
    // Try with basic fixes first
    const fixedJson = fixMalformedJson(jsonString);
    try {
      return JSON.parse(fixedJson);
    } catch (fixError) {
      console.log("Basic JSON fix failed, trying more specific fixes:", fixError.message);
    }
    
    // Try with specialized line fixes for specific errors
    if (fixedJson.includes('\\\"')) {
      const lineStart = 0;
      const lineEnd = fixedJson.length;
      const specialFixedJson = fixQuotesAndBackslashesInLine(fixedJson, lineStart, lineEnd);
      try {
        return JSON.parse(specialFixedJson);
      } catch (lineFixError) {
        console.log("Line-specific fix failed:", lineFixError.message);
      }
    }
    
    // Try with emergency fixes for missing colons
    if (fixedJson.includes('"') && !fixedJson.includes(':')) {
      const emergencyFixedJson = emergencyFixMissingColons(fixedJson);
      try {
        return JSON.parse(emergencyFixedJson);
      } catch (emergencyError) {
        console.log("Emergency colon fix failed:", emergencyError.message);
      }
    }
    
    // Try with backslash escape fixes
    const backslashFixedJson = fixBackslashEscapeIssues(fixedJson);
    try {
      return JSON.parse(backslashFixedJson);
    } catch (backslashError) {
      console.log("Backslash fix failed:", backslashError.message);
    }
    
    // Try with aggressive backslash fix as last resort
    const aggressiveFixed = aggressiveBackslashFix(fixedJson);
    try {
      return JSON.parse(aggressiveFixed);
    } catch (finalError) {
      console.error("[JSON Parser] All fixes failed:", finalError);
      return null;
    }
  } catch (error) {
    console.error("[JSON Parser] Unexpected error:", error);
    return null;
  }
};
