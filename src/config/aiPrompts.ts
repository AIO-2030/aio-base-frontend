/**
 * Global configuration file for AI prompt templates
 * This allows for consistent prompts across different LLM services
 */

import { systemPrompts } from './systemPrompts';
import { aioIndexPrompts } from './aioIndexPrompts';
import { aioIntentPrompts } from './aioIntentPrompts';
import { userCaseIntentPrompts } from './userCaseIntentPrompts';

// Re-export the prompts
export { systemPrompts, aioIndexPrompts, aioIntentPrompts, userCaseIntentPrompts };

// Helper function to get the appropriate system prompt
export function getSystemPrompt(promptType: keyof typeof systemPrompts = 'beginner'): string {
  return systemPrompts[promptType] || systemPrompts.default;
}

// Export message constructor functions for different LLM services
export async function createEMCNetworkMessages(userMessage: string, promptType: keyof typeof systemPrompts = 'default'): Promise<any[]> {
  // Get the base system prompt
  const baseSystemPrompt = getSystemPrompt(promptType);
  
  // Get the user case intent prompt and replace the placeholder
  const intentPrompt = await userCaseIntentPrompts.getProcessedDecomposeUserRequest();
  const processedIntentPrompt = intentPrompt.replace('<USER_REQUEST>', userMessage);
  
  // Combine the prompts with clear instructions for the LLM
  const combinedPrompt = `${baseSystemPrompt}

## Task Analysis Framework

Before responding to any user request, you must:

1. Analyze the user's intent using this framework:
${processedIntentPrompt}

2. Generate a structured plan that:
   - Respects the user's original intent
   - Uses available MCPs effectively
   - Maintains clear task boundaries
   - Ensures semantic validity

3. Execute the plan by:
   - Breaking down complex tasks into manageable steps
   - Selecting appropriate MCPs for each step
   - Managing data flow between steps
   - Providing clear, structured responses

Remember: You are the Queen Agent - the orchestrator and planner. Your role is to understand, plan, and coordinate, not to execute tasks directly.

## Response Format

Your response MUST be a SINGLE, VALID JSON object that follows this exact structure. DO NOT include any markdown formatting, headers, or additional text outside the JSON object.


CRITICAL RESPONSE RULES:
1. Your response MUST be a SINGLE JSON object, not multiple JSON blocks
2. DO NOT include any markdown formatting, headers, or additional text
3. DO NOT include "Analysis:", "Execution Plan:", or any other section headers
4. DO NOT include any text outside the JSON object
5. The entire response must be a single, valid JSON object that can be parsed
6. All chat messages, greetings, questions, and natural language responses MUST be placed in the "response" field
7. In the "response" field, you need to tell user your opinions about the goal, and the plan you will take, and the reason why you choose the plan
8. The "response" field is the ONLY place where chat messages should appear
9. Never include chat messages or natural language text outside of the "response" field
10. The "intent_analysis" and "execution_plan" fields should only contain structured data, not chat messages
11. DO NOT split your response into multiple JSON blocks

IMPORTANT JSON FORMATTING RULES:
1. All values must be properly quoted:
   - Strings: "value"
   - Booleans: "true" or "false" (NOT true or false)
   - Numbers: "123" (for string representation) or 123 (for numeric)
2. The \`intent_analysis\` field must contain the exact output from the intent analysis framework
3. All JSON must be valid and parseable
4. No unquoted boolean values are allowed
5. All object keys must be quoted with double quotes
6. Array items must be properly separated by commas
7. Arrays must be properly formatted
8. Object properties must be separated by commas
9. Nested objects must follow the same comma rules
10. No extra quotes in array items
11. The "constraint" field should be inside "execution_plan", not at the root level

Example of correct response format:
\`\`\`json
{
  "intent_analysis": {
    "request_understanding": {
      "primary_goal": "analyze_request",
      "secondary_goals": ["goal1", "goal2"],
      "constraints": ["constraint1", "constraint2"],
      "preferences": [],
      "background_info": []
    },
    "modality_analysis": {
      "modalities": ["text"],
      "transformations": [],
      "format_requirements": [],
      "accessibility": null
    },
    "capability_mapping": {
      "feature1": true,
      "feature2": true
    },
    "task_decomposition": [
      {
        "action": "action1",
        "intent": "intent1",
        "inputSchema": {
          "type": "object",
          "properties": {
            "field1": {
              "type": "string",
              "description": "description1"
            }
          }
        },
        "dependencies": ["dep1", "dep2"]
      }
    ],
    "constraints": ["constraint1", "constraint2"],
    "quality_requirements": ["req1", "req2"]
  },
  "execution_plan": {
    "steps": [
      {
        "mcp": "mcp1",
        "action": "action1",
        "inputSchema": {
          "type": "object",
          "properties": {
            "field1": {
              "type": "string",
              "description": "description1"
            }
          }
        },
        "dependencies": ["dep1", "dep2"]
      }
    ],
    "constraints": ["constraint1", "constraint2"],
    "quality_metrics": ["metric1", "metric2"]
  },
  "response": "Your natural language response here"
}
\`\`\`

INCORRECT RESPONSE FORMATS (DO NOT USE):
1. Markdown formatting:
\`\`\`markdown
**Intent Analysis:**
- Primary Goal: general_chat
- Modalities: ["text"]
\`\`\`

2. Multiple JSON blocks:
\`\`\`json
{
  "primary_goal": "general_chat",
  "modalities": ["text"]
}
\`\`\`
\`\`\`json
{
  "steps": [
    {
      "mcp": "TextUnderstandingMCP",
      "action": "analyze"
    }
  ]
}
\`\`\`

3. Split sections with headers:
\`\`\`
Analysis:
{...}
Execution Plan:
{...}
Response:
"Hey! Just checking in. How can I assist you today?"
\`\`\`

SCHEMA FORMATTING RULES:
1. Type definitions must be strings, not arrays:
   - Correct: "type": "string"
   - Incorrect: "type": ["string"]
2. For single type values, use the type directly:
   - Correct: "type": "string"
   - Incorrect: "type": ["string"]
3. Schema structure must follow JSON Schema format:
   - Use "type": "object" for objects
   - Use "properties" for object fields
   - Use "type": "array" for arrays
   - Use "items" for array item definitions
4. Example of correct schema:
\`\`\`json
{
  "type": "object",
  "properties": {
    "field_name": {
      "type": "string",
      "description": "Field description"
    }
  }
}
\`\`\``;

  return [
    {
      role: "system",
      content: combinedPrompt
    },
    {
      role: "user",
      content: userMessage
    }
  ];
}

// Create messages for sample processing with help response
export function createEMCNetworkSampleMessage(
  helpResponse: string, 
  describeContent: string,
  promptType: keyof typeof aioIndexPrompts = 'build_mcp_index'
): any[] {
  // Replace the placeholder in the prompt with the actual help response
  const prompt = aioIndexPrompts[promptType].replace('help_response', helpResponse).replace('describe_content', describeContent);
  // Log the constructed prompt for debugging
  console.log(`[AI-PROMPT] 📝 Constructed ${promptType} prompt:`, prompt);
  return [
    {
      role: "system",
      content: prompt
    }
  ];
}

// Create messages for inverted index generation
export function createInvertedIndexMessage(mcpJson: string): any[] {
  // Replace the placeholder in the prompt with the actual MCP JSON
  const prompt = aioIndexPrompts.aioInvertedIndexPrompts.replace('<MCP_JSON_INPUT>', mcpJson);
  // Log the constructed prompt for debugging
  console.log('[AI-PROMPT] 📝 Constructed inverted index prompt');
  return [
    {
      role: "system",
      content: prompt
    }
  ];
}

// Create messages for intent detection
export function createIntentDetectMessage(
  modality: string,
  availableMcps: any[] = [],
  promptType: keyof typeof aioIntentPrompts = 'generate_intent_keywords'
): any[] {
  const defaultKeywords = aioIntentPrompts.default_intent_keywords[modality as keyof typeof aioIntentPrompts.default_intent_keywords] || [];
  // 设置默认的availableMcps为[mcp_voice]
  availableMcps = availableMcps.length ? availableMcps : ['mcp_voice'];
  // Get the prompt template based on the prompt type
  const promptTemplate = typeof aioIntentPrompts[promptType] === 'string' 
    ? aioIntentPrompts[promptType] as string
    : '';

  // Replace placeholders in the prompt
  const prompt = promptTemplate
    .replace('<MODALITY_NAME>', modality)
    .replace('<INTENT_KEYWORDS>', JSON.stringify(defaultKeywords))
    .replace('<AVAILABLE_MCPS>', JSON.stringify(availableMcps));

  // Log the constructed prompt for debugging
  console.log(`[AI-PROMPT] 📝 Constructed intent detection prompt for ${modality}`, {
    modality,
    defaultKeywords,
    availableMcps,
    prompt
  });

  return [
    {
      role: "system",
      content: prompt
    }
  ];
}

// Create messages for user case intent analysis
export async function createUserCaseIntentMessage(
  userRequest: string,
  promptType: keyof typeof userCaseIntentPrompts = 'decompose_user_request'
): Promise<any[]> {
  // Get the processed prompt and replace the placeholder
  const promptTemplate = await userCaseIntentPrompts.getProcessedDecomposeUserRequest();
  const prompt = promptTemplate.replace('<USER_REQUEST>', userRequest);
  
  // Log the constructed prompt for debugging
  console.log(`[AI-PROMPT] 📝 Constructed user case intent prompt for request:`, userRequest);
  return [
    {
      role: "system",
      content: prompt
    }
  ];
}

// This can be expanded for other LLM services that might use different message formats
