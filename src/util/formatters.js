// Enhanced function to fix common JSON syntax errors
export function fixMalformedJson(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') return jsonString;
  
  // First remove any potential markdown code block markers
  let cleaned = jsonString;
  
  // Extract JSON from code blocks if present
  if (cleaned.includes('```json')) {
    const parts = cleaned.split('```json');
    if (parts.length > 1) {
      cleaned = parts[1].split('```')[0].trim();
    }
  } else if (cleaned.includes('```')) {
    const parts = cleaned.split('```');
    if (parts.length > 1) {
      cleaned = parts[1].trim();
    }
  }
  
  // Remove JavaScript-style comments before processing
  cleaned = removeJsonComments(cleaned);
  
  // Fix common JSON formatting issues
  
  // 1. Fix missing quotes around property names
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
  
  // 2. Fix missing colons after property names
  cleaned = cleaned.replace(/(?<=")\s+(?="|\{|\[|true|false|null|-?\d+(?:\.\d+)?)/g, ': ');
  
  // 3. Fix missing commas between array items
  cleaned = cleaned.replace(/(?<=\]|"|true|false|null|\d+|\})\s+(?=\[|"|true|false|null|\d+|\{)/g, ', ');
  
  // 4. Fix missing commas between object properties
  cleaned = cleaned.replace(/(?<=\})\s+(?="|\{|\[)/g, ', ');
  
  // 5. Fix array elements that are objects
  cleaned = cleaned.replace(/\[\s*:\s*\{/g, '[{');
  cleaned = cleaned.replace(/}\s*,\s*"dependencies"\s*:\s*\[\s*"/g, '}, "dependencies": ["');
  
  // 6. Fix nested array items
  cleaned = cleaned.replace(/"items"\s*:\s*\[\s*"string"\s*\]/g, '"items": ["string"]');
  
  // 7. Fix array closing brackets
  cleaned = cleaned.replace(/\}\s*\]/g, '}]');
  cleaned = cleaned.replace(/"\s*\]/g, '"]');
  
  // 8. Fix object closing braces
  cleaned = cleaned.replace(/\}\s*\}/g, '}}');
  
  // 9. Remove trailing commas
  cleaned = cleaned.replace(/,(\s*[\}\]])/g, '$1');
  
  // 10. Fix any remaining malformed array elements
  cleaned = cleaned.replace(/\[\s*{\s*"([^"]+)"\s*:\s*"([^"]+)"\s*}/g, '[{"$1": "$2"}]');
  cleaned = cleaned.replace(/\[\s*{\s*"([^"]+)"\s*:\s*(\d+)\s*}/g, '[{"$1": $2}]');
  
  // 11. Fix any remaining malformed object properties
  cleaned = cleaned.replace(/"([^"]+)"\s*:\s*"([^"]+)"\s*}/g, '"$1": "$2"}');
  cleaned = cleaned.replace(/"([^"]+)"\s*:\s*(\d+)\s*}/g, '"$1": $2}');
  
  // 12. Fix backslash escape issues
  cleaned = cleaned.replace(/\\"/g, '"');
  cleaned = cleaned.replace(/"([^"]+)\\"/g, '"$1"');
  
  // 13. Add missing closing braces/brackets
  let openBraces = (cleaned.match(/{/g) || []).length;
  let closeBraces = (cleaned.match(/}/g) || []).length;
  let openBrackets = (cleaned.match(/\[/g) || []).length;
  let closeBrackets = (cleaned.match(/\]/g) || []).length;
  
  while (openBraces > closeBraces) {
    cleaned += '}';
    closeBraces++;
  }
  
  while (openBrackets > closeBrackets) {
    cleaned += ']';
    closeBrackets++;
  }
  
  return cleaned;
}

/**
 * Removes JavaScript-style comments from JSON strings
 * Handles both single-line and multi-line comments
 */
export function removeJsonComments(jsonString) {
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

// Function to format JSON data for IC canister storage
// This ensures proper formatting compatible with the Motoko/Rust canister backend
export function formatJsonForCanister(data) {
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
    
    // If we can't parse it as JSON but it's a string, return it with fixes
    if (typeof data === 'string') {
      return fixMalformedJson(data);
    }
    
    // If all else fails, try to convert to string
    return String(data);
  }
}

// Helper function to balance brackets and quotes
function balanceBrackets(text) {
  if (!text) return text;
  
  const stack = [];
  let result = text;
  let inString = false;
  let escaped = false;
  let lastOpenBracket = -1;
  
  // First pass: Check for unclosed strings, brackets, braces
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    
    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    
    if (char === '"' && !escaped) {
      inString = !inString;
      if (inString) {
        stack.push({ char: '"', pos: i });
      } else {
        stack.pop(); // Remove the matching open quote
      }
    } else if (!inString) {
      if (char === '{' || char === '[') {
        stack.push({ char, pos: i });
        lastOpenBracket = i;
      } else if (char === '}' || char === ']') {
        if (stack.length > 0) {
          const last = stack.pop();
          const matching = last.char === '{' ? '}' : ']';
          if (char !== matching) {
            // Mismatched brackets - replace with correct one
            result = result.substring(0, i) + matching + result.substring(i + 1);
          }
        } else {
          // Extra closing bracket - remove it
          result = result.substring(0, i) + result.substring(i + 1);
          i--; // Adjust index as we've modified the string
        }
      }
    }
    
    escaped = false;
  }
  
  // Second pass: Fix any unclosed constructs
  while (stack.length > 0) {
    const unclosed = stack.pop();
    if (unclosed.char === '"') {
      // Add missing close quote
      result += '"';
    } else if (unclosed.char === '{') {
      // Add missing close brace
      result += '}';
    } else if (unclosed.char === '[') {
      // Add missing close bracket
      result += ']';
    }
  }
  
  return result;
}

// Safe JSON parsing with advanced error recovery
export function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.log("[formatters] Initial JSON parse failed:", error.message);
    
    try {
      // First try removing comments
      const commentsRemoved = removeJsonComments(jsonString);
      try {
        return JSON.parse(commentsRemoved);
      } catch (commentError) {
        console.log("[formatters] JSON parse failed after comment removal:", commentError.message);
      }
      
      // Then try with our enhanced fixing method
      const enhancedFixed = fixMalformedJson(jsonString);
      try {
        return JSON.parse(enhancedFixed);
      } catch (enhancedError) {
        console.log("[formatters] Enhanced JSON fix failed:", enhancedError.message);
      }
      
      // Progressive recovery attempts
      
      // Try with aggressive backslash fixing
      try {
        const backslashFixed = aggressiveBackslashFix(jsonString);
        return JSON.parse(backslashFixed);
      } catch (backslashError) {
        console.log("[formatters] Backslash fix failed:", backslashError.message);
      }
      
      // Try with manual bracket balancing
      try {
        const balanced = balanceBrackets(jsonString);
        return JSON.parse(balanced);
      } catch (balanceError) {
        console.log("[formatters] Balance fix failed:", balanceError.message);
      }
      
      // Extract and try to parse just the JSON part
      try {
        const extracted = extractJsonFromText(jsonString);
        if (extracted) {
          return JSON.parse(extracted);
        }
      } catch (extractError) {
        console.log("[formatters] Extraction failed:", extractError.message);
      }
      
      // Last attempt - try to eval the string (ONLY for controlled inputs)
      try {
        // Only for JSON-like strings that we control - ensure it's object literal syntax
        if (jsonString.trim().startsWith('{') && jsonString.trim().endsWith('}')) {
          const cleaned = jsonString
            .replace(/\\"/g, '"') // Fix escaped quotes
            .replace(/\\n/g, ' ') // Replace newlines with spaces
            .replace(/\\t/g, ' ') // Replace tabs with spaces
            .replace(/\\/g, '\\\\'); // Escape remaining backslashes
            
          const evalSafe = `(${cleaned})`;
          // Using indirect eval for safety - still only for controlled inputs!
          const indirectEval = eval;
          return indirectEval(evalSafe);
        }
      } catch (evalError) {
        console.log("[formatters] Final recovery failed:", evalError.message);
      }
      
      // If all our fixes fail, return null
      return null;
    } catch (outerError) {
      console.error("[formatters] JSON parse recovery failed completely:", outerError);
      return null;
    }
  }
}

// Enhanced function to directly extract JSON from any text
export function extractJsonFromText(text) {
  if (!text) return null;
  
  // Look for JSON objects that start with { and end with }
  const jsonObjectMatch = text.match(/({[\s\S]*?})/g);
  if (jsonObjectMatch && jsonObjectMatch.length > 0) {
    // Try each match until we find valid JSON
    for (const match of jsonObjectMatch) {
      try {
        const fixedJson = fixMalformedJson(match);
        JSON.parse(fixedJson); // Test if it's valid
        return fixedJson;
      } catch (e) {
        continue; // Try next match
      }
    }
  }
  
  return null;
}

// Add a self-test function to validate our JSON parser
export function testJsonParser() {
  console.log("[formatters] Running JSON parser test...");
  
  const testCases = [
    // Test case 1: Basic syntax error (missing comma)
    {
      name: "Missing comma",
      input: '{"a": 1 "b": 2}',
      expectedValid: true
    },
    
    // Test case 2: Unclosed string
    {
      name: "Unclosed string",
      input: '{"a": "unclosed}',
      expectedValid: true
    },
    
    // Test case 3: Array format error (similar to position 241 issue)
    {
      name: "Array format error",
      input: '{"intent_analysis": {"request_understanding": {"primary_goal": "create_video", "secondary_goals": [prompts_to_video, video_quality], "constraints": []}}}',
      expectedValid: true
    },
    
    // Test case 4: Multiple nested errors
    {
      name: "Multiple nested errors",
      input: '{"a": {"b": [1, 2, {"c": "d" "e": f}]}}',
      expectedValid: true
    },
    
    // Test case 5: Unquoted property name and value
    {
      name: "Unquoted property and value",
      input: '{property: value}',
      expectedValid: true
    },
    
    // Test case 6: Mismatched brackets
    {
      name: "Mismatched brackets",
      input: '{"a": [1, 2, 3}}',
      expectedValid: true
    },
    
    // Test case 7: Fully valid JSON
    {
      name: "Valid JSON",
      input: '{"a": 1, "b": "2", "c": true, "d": null, "e": [1, 2, 3], "f": {"g": "h"}}',
      expectedValid: true
    },
    
    // Test case 8: Position 241-like error (actual real-world example)
    {
      name: "Position 241-like error",
      input: `{
  "intent_analysis": {
    "request_understanding": {
      "primary_goal": "create_video",
      "secondary_goals": [prompts_to_video, video_quality],
      "constraints": [],
      "preferences": [],
      "background_info": []
    },
    "modality_analysis": {
      "modalities": ["text", "video"],
      "transformations": [{"text": "video"}],
      "format_requirements": []
    }
  },
  "execution_plan": {
    "steps": [
      {
        "mcp": "TextUnderstandingMCP",
        "action": "generate_prompts"
      }
    ]
  },
  "response": "I'll help you create video with prompts."
}`,
      expectedValid: true
    }
  ];
  
  // Run the tests
  let passCount = 0;
  
  for (const test of testCases) {
    try {
      console.log(`[formatters] Testing: ${test.name}`);
      
      // Try parsing with our enhanced JSON parser
      const fixed = fixMalformedJson(test.input);
      const result = safeJsonParse(fixed);
      
      const isValid = result !== null;
      
      if (isValid === test.expectedValid) {
        console.log(`[formatters] ✅ PASS: ${test.name}`);
        passCount++;
      } else {
        console.log(`[formatters] ❌ FAIL: ${test.name}. Expected ${test.expectedValid}, got ${isValid}`);
      }
      
      if (isValid) {
        console.log(`[formatters] Parsed result:`, result);
      }
    } catch (error) {
      console.log(`[formatters] ❌ ERROR in test "${test.name}": ${error.message}`);
    }
  }
  
  console.log(`[formatters] Test results: ${passCount}/${testCases.length} passed`);
  return passCount === testCases.length;
}

// Run the tests during initialization in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    try {
      testJsonParser();
    } catch (e) {
      console.error("[formatters] Error running tests:", e);
    }
  }, 2000); // Wait 2s to not block other initialization
}

// Enhanced function to extract JSON from markdown sections
export function extractJsonFromMarkdownSections(content) {
  if (!content) return null;
  
  try {
    // Initialize result object
    const result = {
      intent_analysis: {},
      execution_plan: {}
    };
    
    // Extract Analysis/Intent section
    if (content.includes("**Analysis:**") || content.includes("Intent Analysis:")) {
      const analysisMarker = content.includes("**Analysis:**") ? "**Analysis:**" : "Intent Analysis:";
      const parts = content.split(analysisMarker);
      
      if (parts.length > 1) {
        let analysisPart = parts[1];
        
        // Trim to next section if exists
        if (analysisPart.includes("**Execution Plan:**") || analysisPart.includes("Execution Steps:")) {
          const nextMarker = analysisPart.includes("**Execution Plan:**") 
            ? "**Execution Plan:**" 
            : "Execution Steps:";
          analysisPart = analysisPart.split(nextMarker)[0].trim();
        } else if (analysisPart.includes("**Response:**")) {
          analysisPart = analysisPart.split("**Response:**")[0].trim();
        }
        
        // Try to find JSON objects in the analysis section
        const jsonMatch = analysisPart.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          try {
            const parsedJson = safeJsonParse(jsonMatch[0]);
            if (parsedJson) {
              result.intent_analysis = parsedJson;
            }
          } catch (e) {
            console.log("[formatters] Error parsing JSON in analysis section:", e);
          }
        }
        
        // If no structured JSON, use the entire section as a text representation
        if (Object.keys(result.intent_analysis).length === 0) {
          result.intent_analysis = { text_representation: analysisPart.trim() };
        }
      }
    }
    
    // Extract Execution Plan section
    if (content.includes("**Execution Plan:**") || content.includes("Execution Steps:")) {
      const planMarker = content.includes("**Execution Plan:**") 
        ? "**Execution Plan:**" 
        : "Execution Steps:";
      const parts = content.split(planMarker);
      
      if (parts.length > 1) {
        let planPart = parts[1];
        
        // Trim to next section if exists
        if (planPart.includes("**Response:**")) {
          planPart = planPart.split("**Response:**")[0].trim();
        }
        
        // Try to find JSON objects in the execution plan section
        const jsonMatch = planPart.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          try {
            const parsedJson = safeJsonParse(jsonMatch[0]);
            if (parsedJson) {
              result.execution_plan = parsedJson;
            }
          } catch (e) {
            console.log("[formatters] Error parsing JSON in execution plan section:", e);
          }
        }
        
        // If no structured JSON, extract steps as an array if they are numbered
        if (Object.keys(result.execution_plan).length === 0) {
          const stepsMatch = planPart.match(/\d+\.\s+([^\n]+)/g);
          if (stepsMatch && stepsMatch.length > 0) {
            result.execution_plan = {
              steps: stepsMatch.map(step => ({
                description: step.replace(/^\d+\.\s+/, '').trim()
              }))
            };
          } else {
            // Fall back to text representation
            result.execution_plan = { text_representation: planPart.trim() };
          }
        }
      }
    }
    
    // Extract Response section (useful for protocol messages)
    if (content.includes("**Response:**")) {
      const parts = content.split("**Response:**");
      if (parts.length > 1) {
        const responsePart = parts[1].trim();
        result.response = responsePart;
      }
    }
    
    return result;
  } catch (error) {
    console.log("[formatters] Error extracting JSON from markdown sections:", error);
    return null;
  }
}

// Function to extract response field from JSON with modal structure
export function getResponseFromModalJson(jsonObject) {
  if (!jsonObject) return null;
  
  // Direct response field at the root level
  if (jsonObject.response) {
    return jsonObject.response;
  }
  
  // Check in the AI response structure
  if (jsonObject.aiResponse && jsonObject.aiResponse.response) {
    return jsonObject.aiResponse.response;
  }
  
  // Check for response in metadata
  if (jsonObject.metadata && jsonObject.metadata.aiResponse && jsonObject.metadata.aiResponse.response) {
    return jsonObject.metadata.aiResponse.response;
  }
  
  // Look for a conclusion or summary field
  if (jsonObject.conclusion) {
    return jsonObject.conclusion;
  }
  
  if (jsonObject.summary) {
    return jsonObject.summary;
  }
  
  // Check nested structures
  if (jsonObject.intent_analysis && jsonObject.intent_analysis.summary) {
    return jsonObject.intent_analysis.summary;
  }
  
  // Check for response in a possible nested structure
  if (jsonObject.data && jsonObject.data.response) {
    return jsonObject.data.response;
  }
  
  // If we can't find a response, create a generic one based on primary_goal if available
  if (jsonObject.intent_analysis && 
      jsonObject.intent_analysis.request_understanding && 
      jsonObject.intent_analysis.request_understanding.primary_goal) {
    const goal = jsonObject.intent_analysis.request_understanding.primary_goal;
    return `I'll help you with your ${goal.replace(/_/g, ' ')} request.`;
  }
  
  // Last resort, return a generic message
  return "I've analyzed your request. How can I help you further?";
}

// Function to clean and extract JSON from code blocks and markdown
export function cleanJsonString(content) {
  if (!content) return '';
  
  let jsonContent = content;
  
  // Extract JSON from markdown code blocks
  if (content.includes('```json')) {
    const parts = content.split('```json');
    if (parts.length > 1) {
      jsonContent = parts[1].split('```')[0].trim();
    }
  } else if (content.includes('```')) {
    const parts = content.split('```');
    if (parts.length > 1) {
      // Get content inside the first code block
      jsonContent = parts[1].trim();
      
      // Check if it looks like JSON
      if (!jsonContent.startsWith('{') && !jsonContent.startsWith('[')) {
        // Try other code blocks
        for (let i = 3; i < parts.length; i += 2) {
          const blockContent = parts[i].trim();
          if (blockContent.startsWith('{') || blockContent.startsWith('[')) {
            jsonContent = blockContent;
            break;
          }
        }
      }
    }
  }
  
  // If we still don't have JSON content, look for JSON objects directly
  if (!jsonContent.startsWith('{') && !jsonContent.startsWith('[')) {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    }
  }
  
  // Remove JavaScript-style comments
  jsonContent = removeJsonComments(jsonContent);
  
  // Remove escaped newlines
  jsonContent = jsonContent.replace(/\\n/g, ' ');
  
  // Remove any control characters
  jsonContent = jsonContent.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  return jsonContent;
}

// Function to format protocol metadata for display
export function formatProtocolMetadata(message) {
  if (!message || !message.metadata) return null;
  
  try {
    const metadata = message.metadata;
    
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

// Function to check if a message is an AIO protocol message
export function isAIOProtocolMessage(message) {
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

// Function to check if a JSON object has a modal-like structure
export function hasModalStructure(jsonObject) {
  if (!jsonObject) return false;
  
  // Check for intent_analysis structure
  if (jsonObject.intent_analysis) {
    return true;
  }
  
  // Check for execution_plan structure
  if (jsonObject.execution_plan) {
    return true;
  }
  
  // Check for request_understanding structure
  if (jsonObject.request_understanding) {
    return true;
  }
  
  // Check for nested response structure
  if (jsonObject.aiResponse && 
      (jsonObject.aiResponse.intent_analysis || 
       jsonObject.aiResponse.execution_plan || 
       jsonObject.aiResponse.response)) {
    return true;
  }
  
  // Check for nested metadata
  if (jsonObject.metadata && 
      jsonObject.metadata.aiResponse && 
      (jsonObject.metadata.aiResponse.intent_analysis || 
       jsonObject.metadata.aiResponse.execution_plan)) {
    return true;
  }
  
  return false;
}

// Function to extract response field from raw JSON
export function extractResponseFromRawJson(content) {
  if (!content) return null;
  
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
          
          // Try the more complete extraction function
          const modalResponse = getResponseFromModalJson(parsed);
          if (modalResponse) {
            return modalResponse;
          }
        }
      } catch (e) {
        // Ignore parse errors and continue with other methods
        console.log("[formatters] Error parsing JSON for response extraction:", e);
      }
    }
    
    return null;
  } catch (error) {
    console.log("[formatters] Error extracting response from raw JSON:", error);
    return null;
  }
}

// Function to extract response content from JSON structures
export function extractResponseFromJson(jsonString) {
  if (!jsonString) return null;
  
  try {
    // First, try to parse the JSON
    const parsed = safeJsonParse(jsonString);
    
    if (parsed) {
      // Check for direct response field
      if (parsed.response) {
        return parsed.response;
      }
      
      // Check for nested response in aiResponse
      if (parsed.aiResponse && parsed.aiResponse.response) {
        return parsed.aiResponse.response;
      }
      
      // Check in metadata
      if (parsed.metadata && 
          parsed.metadata.aiResponse && 
          parsed.metadata.aiResponse.response) {
        return parsed.metadata.aiResponse.response;
      }
      
      // Check for conclusion or summary fields
      if (parsed.conclusion) {
        return parsed.conclusion;
      }
      
      if (parsed.summary) {
        return parsed.summary;
      }
      
      // Look for content in a data wrapper
      if (parsed.data && parsed.data.response) {
        return parsed.data.response;
      }
    }
    
    // If parsing fails or no response field found, try regex extraction
    const responseRegex = /"response"\s*:\s*"((?:\\"|[^"])+)"/;
    const match = jsonString.match(responseRegex);
    
    if (match && match[1]) {
      // Unescape any escaped quotes
      return match[1].replace(/\\"/g, '"');
    }
    
    return null;
  } catch (error) {
    console.log("[formatters] Error extracting response from JSON:", error);
    return null;
  }
}

// Function to check if a string is valid JSON
export function isValidJson(str) {
  if (!str || typeof str !== 'string') return false;
  
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Aggressively fixes backslash issues in JSON strings
 * This handles escaped characters, unicode sequences, and other backslash problems
 */
export function aggressiveBackslashFix(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') return jsonString;
  
  try {
    // First pass - fix common backslash issues
    let fixed = jsonString
      // Double backslashes that aren't already escaped
      .replace(/(?<!\\)\\(?!["\\\/bfnrtu])/g, '\\\\')
      // Fix unicode escapes that are malformed
      .replace(/\\u([0-9a-fA-F]{0,3})(?![0-9a-fA-F])/g, '\\u0000')
      // Fix common control characters that should be escaped
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t');
    
    // Second pass with regex-free approach for maximum compatibility
    let inString = false;
    let result = '';
    let escaped = false;
    
    for (let i = 0; i < fixed.length; i++) {
      const char = fixed[i];
      const nextChar = i < fixed.length - 1 ? fixed[i + 1] : '';
      
      // Toggle string mode when we see unescaped quotes
      if (char === '"' && !escaped) {
        inString = !inString;
        result += char;
        continue;
      }
      
      // Handle escape sequences
      if (char === '\\') {
        if (escaped) {
          // Two backslashes = escaped backslash
          result += '\\\\';
          escaped = false;
        } else {
          // First backslash - mark as escaped
          escaped = true;
        }
        continue;
      }
      
      // If we're escaped, handle special escape sequences
      if (escaped) {
        // Valid escape sequences
        if ('"\\/bfnrtu'.includes(char)) {
          result += '\\' + char;
        } else {
          // Invalid escape sequence - escape the backslash
          result += '\\\\' + char;
        }
        escaped = false;
        continue;
      }
      
      // Regular character
      result += char;
    }
    
    // Handle trailing escape character at end of string
    if (escaped) {
      result += '\\\\';
    }
    
    return result;
  } catch (error) {
    console.error("[formatters] Error in aggressiveBackslashFix:", error);
    return jsonString; // Return original if fixing fails
  }
} 