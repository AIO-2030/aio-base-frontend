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

JSON STRUCTURE:
{
  "description": "string",          // 200 words max
  "capability_tags": ["string"],    // e.g. ["memory", "nlp", "retrieval"]
  "functional_keywords": ["string"],// e.g. ["search", "filter", "sort"]
  "scenario_phrases": ["string"],   // natural language use cases
  "methods": [
    {
      "name": "string",
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

🧩 Core Rules just for example,you can extend more keywords:

1. Keyword Format:
   - Primary keyword MUST be in "noun_verb" format (e.g., "voice_detect", "text_extract")
   - For scenarios, extract and combine nouns/verbs (e.g., "voice_analyze" from "analyze voice content")
   - Each keyword set should include:
     * Primary keyword (most relevant)
     * Related keywords (semantically similar)
     * Contextual keywords (from input context)
     * Extended keywords (based on Standard Categories)

2. Standard Categories:
   - Voice: ["detect_language", "transcribe_speech", "extract_phrases", "analyze_emotion"]
   - Document: ["extract_text", "parse_structure", "analyze_content", "convert_format"]
   - Image: ["detect_objects", "extract_text", "analyze_scene", "classify_content"]
   - Video: ["extract_frames", "generate_caption", "detect_scene", "analyze_motion"]
   - Text: ["detect_language", "extract_entities", "analyze_sentiment", "rewrite_content"]
   - Action: ["search_content", "summarize_text", "translate_content", "extract_data"]
   - Intent: ["understand_query", "identify_goal", "match_service", "validate_input"]

3. Keyword Groups:
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

4. Match Rules:
   - standard_match must be a string value of "true" or "false":
     * Use "true" for:
       - Direct capability_tags matches
       - Core functional_keywords
       - Explicit API action words
     * Use "false" for:
       - Inferred from scenario_phrases
       - LLM-suggested variations
       - Semantic overlaps

---

📦 Output Format and Type Validation:

[
  {
    "keyword": "string",           // REQUIRED: Must be a string in noun_verb format
    "primary_keyword": "string",   // REQUIRED: Must be a string in noun_verb format
    "keyword_group": "string",     // REQUIRED: Must be one of the predefined keyword groups
    "mcp_name": "string",         // REQUIRED: Must be a non-empty string
    "source_field": "string",     // REQUIRED: Must be a non-empty string
    "confidence": 0.95,           // REQUIRED: Must be a float type representation of a float between 0.0 and 1.0
    "standard_match": "true",     // REQUIRED: Must be a string "true" or "false"
    "keyword_types": ["string"]   // REQUIRED: Must be an array of strings
  }
]

Example of a valid response:
[
  {
    "keyword": "voice_detect",
    "primary_keyword": "voice_detect",
    "keyword_group": "voice_processing",
    "mcp_name": "voice_service",
    "source_field": "capability_tags",
    "confidence": 0.95,
    "standard_match": "true",
    "keyword_types": ["primary", "related"]
  }
]

---

⚠️ Type Validation Constraints:

1. ALL fields are REQUIRED
2. ALL boolean values must be strings: "true" or "false"
3. ALL numeric values must be a single float value only (e.g., 0.85), without any quotation marks. The response must be a valid JSON number, not a string. Example: 0.85 ✅, "0.85" ❌.
4. Arrays must contain only string values
5. No null values allowed
6. No undefined values allowed
7. No empty strings allowed
8. confidence must be a float representation of a number between 0.0 and 1.0
9. keyword_types must be an array with at least one string element
10. All string values must be properly quoted in the JSON output

Additional Constraints:
- Valid JSON array only
- All keywords in noun_verb format
- English only
- Float confidence value >= 0.8 for exact matches
- Generate multiple action sequences from scenarios
- Consider keyword source for standard_match value
- Keywords field must contain at least one primary keyword
- Related keywords should be semantically relevant
- Contextual keywords should be derived from input context
- Extended keywords should be based on Standard Categories

---

🔽 Input:
<MCP_JSON_INPUT>`
}; 