/**
 * Specialized prompts for intent generation and processing
 */

export const aioIntentPrompts = {
  // Prompt for generating intent keywords based on input modality
  generate_intent_keywords: `You are Queen AI, an advanced AI system that processes multimodal inputs.

Your task is to analyze the input modality and generate a sequence of processing steps that would be required to handle the input effectively.

Input Processing:
- Analyze the provided modality type
- Consider the natural processing flow for this modality
- Generate a sequence of processing steps
- Ensure steps are logical and follow a natural progression
- Include both basic processing and advanced analysis steps
- Use the provided default keywords as reference but feel free to modify or enhance them

Output Format:
- Must be a valid JSON array of lowercase strings
- No explanations, comments, or markdown
- Up to 8 lowercase English intent keywords
- Keywords should represent sequential processing steps

Example Output:
["detect language", "transcribe speech", "extract entities", "analyze sentiment"]

Input Modality: <MODALITY_NAME>
Default Keywords for Reference: <INTENT_KEYWORDS>`,

  // Prompt for validating and normalizing intent keywords
  validate_intent_keywords: `You are an intent keyword validator for the AIO-2030 protocol.

Your task is to validate and normalize a list of intent keywords to ensure they meet the required standards.

Input Processing:
- Check if keywords are in lowercase
- Verify keywords are in English
- Ensure keywords are specific and actionable
- Remove duplicates
- Limit to maximum 8 keywords
- Normalize similar keywords to standard forms

Output Format:
- Must be a valid JSON array of normalized keywords
- No explanations, comments, or markdown
- All keywords must be lowercase English
- Maximum 8 keywords

Current Keywords we already have,you should match with them first: <CURRENT_KEYWORDS>

Input Keywords as example output you can follow and extend or match:
<INTENT_KEYWORDS>`,

  // Default intent keyword reference table
  default_intent_keywords: {
    "voice": [
      "detect-language",
      "transcribe-speech",
      "extract-key-phrases",
      "analyze-emotion",
      "generate-summary",
      "translate-content",
      "match-to-visual",
      "create-transcript"
    ],
    "pdf": [
      "extract-text",
      "detect-language",
      "parse-structure",
      "extract-references",
      "analyze-content",
      "generate-summary",
      "extract-tables",
      "convert-format"
    ],
    "doc": [
      "parse-structure",
      "extract-text",
      "detect-language",
      "analyze-content",
      "extract-references",
      "generate-summary",
      "check-grammar",
      "convert-format"
    ],
    "markdown": [
      "parse-structure",
      "extract-content",
      "analyze-sections",
      "extract-code",
      "generate-preview",
      "convert-format",
      "validate-syntax",
      "analyze-links"
    ],
    "image": [
      "detect-objects",
      "extract-text",
      "analyze-scene",
      "detect-faces",
      "generate-caption",
      "match-to-audio",
      "classify-content",
      "extract-metadata"
    ],
    "video": [
      "extract-frames",
      "generate-caption",
      "detect-scene-changes",
      "summarize-content",
      "transcribe-speech",
      "analyze-motion",
      "detect-speakers",
      "match-to-text"
    ],
    "text": [
      "detect-language",
      "extract-entities",
      "analyze-sentiment",
      "generate-summary",
      "translate-content",
      "extract-key-points",
      "check-grammar",
      "rewrite-content"
    ],
    "spreadsheet": [
      "parse-structure",
      "extract-data",
      "analyze-patterns",
      "detect-anomalies",
      "generate-charts",
      "summarize-data",
      "validate-format",
      "convert-format"
    ],
    "webpage": [
      "extract-article",
      "summarize-content",
      "analyze-layout",
      "detect-ads",
      "extract-metadata",
      "convert-to-markdown",
      "analyze-links",
      "detect-paywall"
    ],
    "action": [
      "search",
      "summarize",
      "translate",
      "extract",
      "classify",
      "visualize",
      "rewrite",
      "compare",
      "invoke-agent",
      "evaluate-result"
    ],
    "intent": [
      "understand-query",
      "identify-goal",
      "decompose-request",
      "match-to-service",
      "select-tool",
      "validate-input",
      "rank-relevance",
      "compose-answer"
    ],
    "target": [
      "user-question",
      "uploaded-file",
      "live-stream",
      "conversation-history",
      "remote-api",
      "personal-knowledge-base",
      "agent-chain",
      "task-outcome"
    ],
    "plan": [
      "decompose-task",
      "assign-subtasks",
      "select-tools",
      "determine-sequence",
      "track-progress",
      "handle-fallback",
      "generate-report",
      "finalize-result"
    ],
    "tool": [
      "search-engine",
      "pdf-parser",
      "ocr-engine",
      "transcriber",
      "image-captioner",
      "code-interpreter",
      "table-summarizer",
      "agent-router"
    ]
  }
  
}; 

export function getDefaultIntentKeywords() {
  return aioIntentPrompts.default_intent_keywords;
}
