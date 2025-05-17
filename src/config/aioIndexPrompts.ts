/**
 * Specialized prompts for indexing and processing specific components
 */

export const aioIndexPrompts = {
  // Prompt for building MCP (Modular Capability Provider) index
  build_mcp_index: `You are an MCP Capability Indexer. Your task is to analyze the help response and 'Describe Content' to generate a standardized MCP Capability Index.

CRITICAL REQUIREMENTS:
1. Output MUST be a single, valid JSON object with no additional text
2. ALL text content MUST be in English
3. For each method:
   - Preserve the EXACT structure of inputSchema
   - Include complete inputSchema if it exists
   - Translate all descriptions to English
   - each methods[n].name should be put into the method_name field in the inverted index output directly
     don't modify the method_name, just copy it avoid to be empty
   
   

JSON STRUCTURE:
{
  "description": "string",          
  "capability_tags": ["string"],    // e.g. ["memory", "nlp", "retrieval"]
  "functional_keywords": ["string"],// e.g. ["search", "filter", "sort"]
  "scenario_phrases": ["string"],   // natural language use cases
  "methods": [
    {
      "name": "string",            // will be used as method_name in the inverted index output
      "description": "string",
      "inputSchema": {
        "type": "object",
        "properties": {
          "param1": {
            "type": "string",
            "description": "string"
          }
        },
        "required": ["string"]
      },
      "parameters": ["string"]
    }
  ],
  "source": {
    "author": "string",
    "version": "string",
    "github": "string"
  },
  "evaluation_metrics": {
    "completeness_score": number,   // 0-1
    "accuracy_score": number,       // 0-1
    "relevance_score": number,      // 0-1
    "translation_quality": number   // 0-1
  }
}

VALIDATION RULES:
1. No template placeholders in output
2. No text after closing brace
3. All JSON properties must be properly closed
4. All descriptions must be in English
5. All numeric values must be between 0-1
6. No empty strings or null values

--Input help JSON response:
help_response

--Input Describe Content:
describe_content`,

  // Prompt for reconstructing JSON responses
  reconstruct_json: `You are a JSON Response Reconstructor. Your task is to fix and reconstruct a JSON response while preserving ALL information from the original response.

Given an invalid or malformed JSON response, you must:
1. Carefully analyze the entire response, including any text before or after the JSON structure
2. Preserve ALL information from the original response - do not omit or modify any data
3. Return a properly formatted JSON object that maintains the exact same data structure and values
4. If there are any non-JSON text elements, include them in appropriate JSON fields
5. Ensure the output is valid JSON that can be parsed without errors

The response must be a single, valid JSON object with no additional text or explanations.
Do not add, remove, or modify any information from the original response.

Here is the response that needs reconstruction:

invalid_response`,

  // Prompt for creating inverted index for MCP services
  aioInvertedIndexPrompts: `You are an AI indexing assistant for the AIO-2030 protocol. Your task is to analyze MCP service metadata and generate an inverted index.

---

🧩 Core Rules:

1. JSON Format Requirements:
   - Output MUST be a valid JSON array starting with '[' and ending with ']'
   - Each object in the array MUST be separated by a comma
   - NO trailing comma after the last object
   - ALL string values MUST be enclosed in double quotes
   - ALL property names MUST be enclosed in double quotes
   - NO comments or additional text outside the JSON structure
   - NO line breaks within string values
   - NO special characters except hyphen (-) in keywords
   - NO trailing spaces or tabs
   - NO BOM or other invisible characters
   - CRITICAL: Output MUST be wrapped in square brackets '[' and ']'
   - CRITICAL: Output MUST be a valid JSON array that can be parsed by JSON.parse()
   - CRITICAL: NO text before '[' or after ']'
   - CRITICAL: NO curly braces '{' or '}' at the root level

2. Method Name Requirements:
   - method_name MUST be EXACTLY copied from MCP_JSON_INPUT.methods[n].name
   - method_name CANNOT be empty or null
   - method_name CANNOT be modified or generated
   - Each method_name can be associated with multiple keywords (N:1 relationship)
   - EVERY method from MCP_JSON_INPUT.methods MUST be included in the output
   - NO method should be left without at least one keyword mapping
   - each mcp_name or method_name can match different keywords in the inverted index output
   - mcp_name,method_name and keywords can be duplicate in the inverted index output

3. Keyword Generation Requirements:
   - For EACH method in MCP_JSON_INPUT.methods:
     * MUST generate at least 2-3 relevant keywords
     * MUST analyze the method's:
       - name
       - description
       - inputSchema.description
       - parameters
     * MUST consider the method's context from:
       - parent MCP description
       - capability_tags
       - functional_keywords
       - scenario_phrases
   - STRICT FORMAT REQUIREMENTS:
     * ALL keywords MUST be in prefix-suffix format using hyphen (-) as separator
     * Examples: "voice-detect", "text-extract", "image-analyze"
     * NO single word keywords allowed
     * NO underscore (_) separators allowed
     * NO camelCase or PascalCase allowed
     * NO spaces allowed
     * NO special characters allowed except hyphen (-)
     * NO duplicate keywords (case-insensitive)
     * primary_keyword MUST match the keyword for primary type entries
   - Avoid hallucination: only generate keywords that are directly related to the input context
   - Each keyword can map to multiple method_names (N:1 relationship)

4. Standard Categories (just example,them can be extended with proper logic):
   - Voice: ["detect-language", "transcribe-speech", "extract-phrases", "analyze-emotion"]
   - Document: ["extract-text", "parse-structure", "analyze-content", "convert-format"]
   - Image: ["detect-objects", "extract-text", "analyze-scene", "classify-content"]
   - Video: ["extract-frames", "generate-caption", "detect-scene", "analyze-motion"]
   - Text: ["detect-language", "extract-entities", "analyze-sentiment", "rewrite-content"]
   - Action: ["search-content", "summarize-text", "translate-content", "extract-data"]
   - Intent: ["understand-query", "identify-goal", "match-service", "validate-input"]

5. Keyword Groups (just example,them can be extended with proper logic):
   - voice_processing
   - document_processing
   - image_processing
   - video_processing
   - text_processing
   - action_processing
   - intent_processing
   - general_action
   - data_format
   - method
   - input_param

6. Match Rules:
   - standard_match must be a string value of "true" or "false":
     * Use "true" for:
       - Direct matches from method name
       - Direct matches from method description
       - Direct matches from inputSchema.description
       - Direct matches from capability_tags
       - Direct matches from functional_keywords
       - Core API action words from method name
       - Standard category matches (if applicable)
     * Use "false" for:
       - Inferred keywords from scenario_phrases
       - Semantic variations of method name
       - Contextual keywords from parent MCP description
       - Extended keywords based on method parameters
       - Cross-category semantic overlaps
       - LLM-suggested variations with high confidence

   - confidence scoring rules:
     * 0.95-1.0: Direct matches from method name or core functionality
     * 0.90-0.94: Direct matches from method description or inputSchema
     * 0.85-0.89: Matches from capability_tags or functional_keywords
     * 0.80-0.84: Inferred matches from scenario_phrases or parameters
     * < 0.80: Not recommended, avoid using

   - keyword_types rules:
     * "primary": Direct matches from method name or core functionality
     * "related": Semantic variations or contextual matches
     * "extended": Cross-category or parameter-based matches
     * "contextual": Derived from parent MCP or scenario context

   - source_field rules:
     * Use exact path for direct matches (e.g., "methods[0].name")
     * Use category name for standard category matches
     * Use "inferred" for LLM-generated matches
     * Use "context" for parent MCP derived matches

---

📦 Output Format and Type Validation:

[
  {
    "keyword": "string",           // REQUIRED: Must be a string in prefix-suffix format (e.g., "voice-detect")
    "primary_keyword": "string",   // REQUIRED: Must be a string in prefix-suffix format (e.g., "voice-detect")
    "keyword_group": "string",     // REQUIRED: Must be one of the predefined keyword groups
    "mcp_name": "string",         // REQUIRED: Must be a non-empty string
    "method_name": "string",     // REQUIRED: Must be EXACTLY copied from MCP_JSON_INPUT.methods[n].name
    "source_field": "string",     // REQUIRED: Must be a non-empty string
    "confidence": 0.95,           // REQUIRED: Must be a float type representation of a float between 0.0 and 1.0
    "standard_match": "true",     // REQUIRED: Must be a string "true" or "false"
    "keyword_types": ["string"]   // REQUIRED: Must be an array of strings
  }
]

Example of valid response:
[
  {
    "keyword": "voice-detect",
    "primary_keyword": "voice-detect",
    "keyword_group": "voice_processing",
    "mcp_name": "voice_service",
    "method_name": "voice_identify_language",
    "source_field": "methods[0].name",
    "confidence": 0.95,
    "standard_match": "true",
    "keyword_types": ["primary"]
  },
  {
    "keyword": "language-identify",
    "primary_keyword": "voice-detect",
    "keyword_group": "text_processing",
    "mcp_name": "voice_service",
    "method_name": "voice_identify_language",
    "source_field": "methods[0].description",
    "confidence": 0.92,
    "standard_match": "true",
    "keyword_types": ["related"]
  }
]

---

⚠️ JSON Validation Steps:
1. Verify array structure:
   - Starts with '['
   - Ends with ']'
   - Objects separated by commas
   - No trailing comma

2. Verify object structure:
   - All properties enclosed in double quotes
   - All string values enclosed in double quotes
   - No missing commas between properties
   - No trailing commas after last property

3. Verify data types:
   - Strings: Must be enclosed in double quotes
   - Numbers: Must be unquoted float values
   - Arrays: Must be properly formatted with square brackets
   - Booleans: Must be string values "true" or "false"

4. Verify content:
   - No null values
   - No undefined values
   - No empty strings
   - No invalid characters
   - No line breaks in strings
   - No trailing spaces
   - No duplicate keywords (case-insensitive)
   - primary_keyword matches keyword for primary type entries

Additional Constraints:
- Valid JSON array only
- Keywords MUST be in prefix-suffix format with hyphen (-) separator
- English only
- Float confidence value >= 0.8 for exact matches
- Generate multiple action sequences from scenarios
- Consider keyword source for standard_match value
- Keywords field must contain at least one primary keyword
- Related keywords should be semantically relevant
- Contextual keywords should be derived from input context
- Extended keywords should be based on Standard Categories
- Avoid generating keywords unrelated to the input context
- Ensure complete coverage of all methods in the input
- Each method must have multiple keyword perspectives
- MUST validate final JSON output before returning

---

🔽 Input:
<MCP_JSON_INPUT>`
};