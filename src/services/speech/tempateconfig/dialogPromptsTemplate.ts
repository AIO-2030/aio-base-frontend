import { createIntentDetectMessage } from '../../../config/aiPrompts';

// Define action types enum
export enum DialogAction {
  RUN_COMMAND = 'RUN_COMMAND',
  STORE_TO_MEMORY = 'STORE_TO_MEMORY',
  VOICE_SENSE = 'VOICE_SENSE'
}

/**
 * Maps action types to their corresponding modalities for intent detection
 */
const actionToModality: Record<DialogAction, string> = {
  [DialogAction.RUN_COMMAND]: 'command',
  [DialogAction.STORE_TO_MEMORY]: 'mcp_memory',
  [DialogAction.VOICE_SENSE]: 'mcp_voice'
};

/**
 * Maps action types to their corresponding response templates
 */
const actionResponseMap: Record<DialogAction, any> = {
  [DialogAction.RUN_COMMAND]: {
    intent_analysis: {
      request_understanding: {
        primary_goal: "execute_command",
        secondary_goals: ["validate_command", "ensure_safety"],
        constraints: ["system_capabilities", "resource_limits"],
        preferences: ["efficient_execution", "clear_feedback"],
        background_info: []
      },
      modality_analysis: {
        modalities: ["command"],
        transformations: ["command_parsing", "safety_validation"],
        format_requirements: ["structured_command"],
        accessibility: null
      },
      capability_mapping: {
        command_execution: true,
        safety_checks: true,
        resource_management: true
      },
      task_decomposition: [
        {
          action: "parse_command",
          intent: "understand_user_command",
          inputSchema: {
            type: "object",
            properties: {
              command: {
                type: "string",
                description: "User command to execute"
              }
            }
          },
          dependencies: []
        }
      ],
      constraints: ["system_safety", "resource_limits"],
      quality_requirements: ["execution_success", "performance_metrics"]
    },
    execution_plan: {
      steps: [
        {
          mcp: "mcp_command",
          action: "execute",
          inputSchema: {
            type: "object",
            properties: {
              command: {
                type: "string",
                description: "Validated command to execute"
              }
            }
          },
          dependencies: ["command_validation"]
        }
      ],
      constraints: ["safety_checks", "resource_limits"],
      quality_metrics: ["execution_time", "resource_usage"]
    },
    response: "Command execution response here"
  },

  [DialogAction.STORE_TO_MEMORY]: {
    intent_analysis: {
      request_understanding: {
        primary_goal: "store_information",
        secondary_goals: ["optimize_storage", "ensure_retrievability"],
        constraints: ["storage_capacity", "data_integrity"],
        preferences: ["fast_access", "efficient_storage"],
        background_info: []
      },
      modality_analysis: {
        modalities: ["memory"],
        transformations: ["data_structuring", "indexing"],
        format_requirements: ["structured_data"],
        accessibility: null
      },
      capability_mapping: {
        data_storage: true,
        indexing: true,
        retrieval: true
      },
      task_decomposition: [
        {
          action: "process_data",
          intent: "prepare_for_storage",
          inputSchema: {
            type: "object",
            properties: {
              data: {
                type: "string",
                description: "Information to store"
              }
            }
          },
          dependencies: []
        }
      ],
      constraints: ["storage_limits", "data_integrity"],
      quality_requirements: ["storage_efficiency", "retrieval_speed"]
    },
    execution_plan: {
      steps: [
        {
          mcp: "mcp_memory",
          action: "store",
          inputSchema: {
            type: "object",
            properties: {
              data: {
                type: "string",
                description: "Processed data for storage"
              }
            }
          },
          dependencies: ["data_processing"]
        }
      ],
      constraints: ["storage_capacity", "data_integrity"],
      quality_metrics: ["storage_time", "retrieval_efficiency"]
    },
    response: "Memory storage response here"
  },

  [DialogAction.VOICE_SENSE]: {
    intent_analysis: {
      request_understanding: {
        primary_goal: "voice_processing",
        secondary_goals: ["intent_detection", "context_understanding"],
        constraints: ["audio_quality", "processing_time"],
        preferences: ["accuracy", "natural_interaction"],
        background_info: []
      },
      modality_analysis: {
        modalities: ["voice"],
        transformations: ["speech_to_text", "intent_analysis"],
        format_requirements: ["audio_format"],
        accessibility: null
      },
      capability_mapping: {
        voice_processing: true,
        intent_detection: true,
        context_analysis: true
      },
      task_decomposition: [
        {
          action: "process_voice",
          intent: "understand_speech",
          inputSchema: {
            type: "object",
            properties: {
              audio: {
                type: "string",
                description: "Voice input in base64 format"
              }
            }
          },
          dependencies: []
        }
      ],
      constraints: ["processing_time", "accuracy"],
      quality_requirements: ["recognition_accuracy", "response_time"]
    },
    execution_plan: {
      steps: [
        {
          mcp: "mcp_voice",
          action: "identify_voice_base64",
          inputSchema: {
            type: "object",
            properties: {
              base64_data: {
                type: "string",
                description: "Voice input to process"
              }
            }
          },
          dependencies: ["audio_validation"]
        },
        {
          mcp: "mcp_intent_prompts",
          action: "get_intent_prompt",
          inputSchema: {
            type: "object",
            properties: {
              intent_text: {
                type: "string",
                description: "text need to be wrapped into a prompt"
              }
            }
          },
          dependencies: []
        }
      ],
      constraints: ["processing_time", "resource_usage"],
      quality_metrics: ["accuracy", "latency"]
    },
    response: "Voice processing Executing..."
  }
};

/**
 * Creates formatted messages for LLM processing using intent detection
 * @param action The type of action
 * @param userInput The user's input
 * @returns Formatted messages array for LLM
 */
export function createActionMessages(action: DialogAction, userInput: string): string {
  // Return the response template directly from the action map
  return JSON.stringify(actionResponseMap[action]);
}
