import { toast } from "@/components/ui/use-toast";
import { AttachedFile } from "@/components/chat/ChatFileUploader";
import { generateEMCNetworkResponse,generateActionEMCNetWorkResponse, DEFAULT_MODEL, generateSampleofAIOEntity, generateInvertedIndex, generateIntentDetection, generateMcp2AIOOutputAdapter } from "./emcAIService";
import { generateMockAIResponse } from "./mockAIService";
import { generateRealAIResponse } from "./openAIService";
import { ChatMessage, EMCModel } from "../emcNetworkService";
import { aioIndexPrompts, createInvertedIndexMessage } from "@/config/aiPrompts";
import { DialogAction } from "../speech/tempateconfig/dialogPromptsTemplate";

/**
 * Handles text-based LLM interactions (EMC Network, SiliconFlow, or fallbacks)
 * This function encapsulates all LLM calling logic for text messages
 */
export async function handleTextLLMInteraction(
  message: string, 
  attachedFiles?: AttachedFile[], 
  useEMCNetwork: boolean = true,
  useMockApi: boolean = true,
  model: EMCModel = DEFAULT_MODEL
): Promise<string> {
  console.log(`[AI-AGENT] 🔄 Starting LLM interaction with model ${model} and message (${message.length} chars)${attachedFiles?.length ? ` and ${attachedFiles.length} files` : ''}`);
  
  // Try EMC Network/SiliconFlow first if enabled
  if (useEMCNetwork) {
    try {
      console.log(`[AI-AGENT] 🌐 Network services are enabled, attempting to use model: ${model}`);
      return await generateEMCNetworkResponse(message, attachedFiles, model);
    } catch (error) {
      console.warn("[AI-AGENT] ⚠️ Network services completely failed, falling back to alternative:", error);
      
      // Only reach this if something catastrophic happened in the network services
      if (useMockApi) {
        console.log('[AI-AGENT] 🔄 Falling back to mock AI service');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using mock AI instead.",
          variant: "destructive"
        });
        return await generateMockAIResponse(message, attachedFiles);
      } else {
        console.log('[AI-AGENT] 🔄 Falling back to OpenAI service');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using OpenAI instead.",
          variant: "destructive"
        });
        return await generateRealAIResponse(message, attachedFiles);
      }
    }
  } else if (useMockApi) {
    // Use mock API if network services are disabled and mock is enabled
    console.log('[AI-AGENT] 🎭 Using mock AI service (Network services disabled)');
    return await generateMockAIResponse(message, attachedFiles);
  } else {
    // Use real OpenAI API if both network services and mock are disabled
    console.log('[AI-AGENT] 🧠 Using OpenAI service (Network services and mock disabled)');
    return await generateRealAIResponse(message, attachedFiles);
  }
}

export async function handleActionLLMInteraction(
  message: string, 
  action: DialogAction,
  attachedFiles?: AttachedFile[], 
  useEMCNetwork: boolean = true,
  useMockApi: boolean = true,
  model: EMCModel = DEFAULT_MODEL
): Promise<string> {
  console.log(`[AI-AGENT] 🔄 Starting LLM interaction with model ${model} and message (${message.length} chars)${attachedFiles?.length ? ` and ${attachedFiles.length} files` : ''}`);
  
  // Try EMC Network/SiliconFlow first if enabled
  if (useEMCNetwork) {
    try {
      console.log(`[AI-AGENT] 🌐 Network for action ${action} services are enabled, attempting to use model: ${model}`);
      // Convert string message to ChatMessage array if needed
      const chatMessages: ChatMessage[] = typeof message === 'string' 
        ? [{ role: 'user', content: message, attachedFiles }] 
        : Array.isArray(message) 
          ? message 
          : [{ role: 'user', content: String(message), attachedFiles }];
      
      console.log(`[AI-AGENT] 📝 Prepared ${chatMessages.length} chat messages for action ${action}`);
      return await generateActionEMCNetWorkResponse(chatMessages, action, attachedFiles, model);
    } catch (error) {
      console.warn("[AI-AGENT] ⚠️ Network services completely failed, falling back to alternative:", error);
      
      // Only reach this if something catastrophic happened in the network services
      if (useMockApi) {
        console.log('[AI-AGENT] 🔄 Falling back to mock AI service');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using mock AI instead.",
          variant: "destructive"
        });
        return await generateMockAIResponse(message, attachedFiles);
      } else {
        console.log('[AI-AGENT] 🔄 Falling back to OpenAI service');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using OpenAI instead.",
          variant: "destructive"
        });
        return await generateRealAIResponse(message, attachedFiles);
      }
    }
  } else if (useMockApi) {
    // Use mock API if network services are disabled and mock is enabled
    console.log('[AI-AGENT] 🎭 Using mock AI service (Network services disabled)');
    return await generateMockAIResponse(message, attachedFiles);
  } else {
    // Use real OpenAI API if both network services and mock are disabled
    console.log('[AI-AGENT] 🧠 Using OpenAI service (Network services and mock disabled)');
    return await generateRealAIResponse(message, attachedFiles);
  }
}

/**
 * Handles AIO sample generation interactions
 * This function encapsulates all AIO sample generation logic similar to text LLM interactions
 */
export async function handleAIOSampleInteraction(
  helpResponse: string,
  describeContent: string,
  useEMCNetwork: boolean = true,
  useMockApi: boolean = true,
  model: EMCModel = DEFAULT_MODEL
): Promise<string> {
  console.log(`[AI-AGENT] 🔄 Starting AIO sample generation with model ${model}`);
  
  // Try EMC Network/SiliconFlow first if enabled
  if (useEMCNetwork) {
    try {
      console.log(`[AI-AGENT] 🌐 Network services are enabled, attempting to generate sample using model: ${model}`);
      // Use the generateSampleofAIOEntity implementation
      return await generateSampleofAIOEntity(helpResponse, describeContent, model);
    } catch (error) {
      console.warn("[AI-AGENT] ⚠️ Network services completely failed for sample generation, falling back to alternative:", error);
      
      // Only reach this if something catastrophic happened in the network services
      if (useMockApi) {
        console.log('[AI-AGENT] 🔄 Falling back to mock AI service for sample generation');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using mock AI instead for sample generation.",
          variant: "destructive"
        });
        // Fall back to mock service with sample request
        return await generateMockAIResponse(`Generate sample based on: ${helpResponse}`);
      } else {
        console.log('[AI-AGENT] 🔄 Falling back to OpenAI service for sample generation');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using OpenAI instead for sample generation.",
          variant: "destructive"
        });
        // Fall back to OpenAI with sample request
        return await generateRealAIResponse(`Generate sample based on: ${helpResponse}`);
      }
    }
  } else if (useMockApi) {
    // Use mock API if network services are disabled and mock is enabled
    console.log('[AI-AGENT] 🎭 Using mock AI service for sample generation (Network services disabled)');
    return await generateMockAIResponse(`Generate sample based on: ${helpResponse}`);
  } else {
    // Use real OpenAI API if both network services and mock are disabled
    console.log('[AI-AGENT] 🧠 Using OpenAI service for sample generation (Network services and mock disabled)');
    return await generateRealAIResponse(`Generate sample based on: ${helpResponse}`);
  }
}

/**
 * Process messages with the specified model
 */
async function processWithModel(messages: any[], model: EMCModel): Promise<string> {
  // Implementation of model processing logic
  // This should be replaced with actual model processing code
  return JSON.stringify([]);
}

/**
 * Handle inverted index generation interaction
 */
export async function handleInvertedIndexInteraction(
  mcpJson: string,
  useEMCNetwork: boolean = true,
  useMockApi: boolean = true,
  model: EMCModel = DEFAULT_MODEL
): Promise<string> {
  console.log(`[AI-AGENT] 🔄 Starting inverted index generation with model ${model}`);
  
  // Try EMC Network/SiliconFlow first if enabled
  if (useEMCNetwork) {
    try {
      console.log(`[AI-AGENT] 🌐 Network services are enabled, attempting to generate inverted index using model: ${model}`);
      // Use the generateInvertedIndex implementation
      return await generateInvertedIndex(mcpJson, model);
    } catch (error) {
      console.warn("[AI-AGENT] ⚠️ Network services completely failed for inverted index generation, falling back to alternative:", error);
      
      // Only reach this if something catastrophic happened in the network services
      if (useMockApi) {
        console.log('[AI-AGENT] 🔄 Falling back to mock AI service for inverted index generation');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using mock AI instead for inverted index generation.",
          variant: "destructive"
        });
        // Fall back to mock service with inverted index request
        return JSON.stringify([
          {
            keyword: "example",
            keyword_group: "general_action",
            mcp_name: "test-mcp",
            source_field: "description",
            confidence: 0.9
          }
        ]);
      } else {
        console.log('[AI-AGENT] 🔄 Falling back to OpenAI service for inverted index generation');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using OpenAI instead for inverted index generation.",
          variant: "destructive"
        });
        // Fall back to OpenAI with inverted index request
        return await generateRealAIResponse(`Generate inverted index based on: ${mcpJson}`);
      }
    }
  } else if (useMockApi) {
    // Use mock API if network services are disabled and mock is enabled
    console.log('[AI-AGENT] 🎭 Using mock AI service for inverted index generation (Network services disabled)');
    return JSON.stringify([
      {
        keyword: "example",
        keyword_group: "general_action",
        mcp_name: "test-mcp",
        source_field: "description",
        confidence: 0.9
      }
    ]);
  } else {
    // Use real OpenAI API if both network services and mock are disabled
    console.log('[AI-AGENT] 🧠 Using OpenAI service for inverted index generation (Network services and mock disabled)');
    return await generateRealAIResponse(`Generate inverted index based on: ${mcpJson}`);
  }
}

/**
 * Handle intent detection interaction
 */
export async function handleDetectIntent(
  modality: string,
  availableMcps: any[] = [],
  useEMCNetwork: boolean = true,
  useMockApi: boolean = true,
  model: EMCModel = DEFAULT_MODEL
): Promise<string> {
  console.log(`[AI-AGENT] 🔄 Starting intent detection for modality: ${modality}`);
  
  // Try EMC Network/SiliconFlow first if enabled
  if (useEMCNetwork) {
    try {
      console.log(`[AI-AGENT] 🌐 Network services are enabled, attempting to detect intent using model: ${model}`);
      // Use the generateIntentDetection implementation
      return await generateIntentDetection(modality, availableMcps, model);
    } catch (error) {
      console.warn("[AI-AGENT] ⚠️ Network services completely failed for intent detection, falling back to alternative:", error);
      
      // Only reach this if something catastrophic happened in the network services
      if (useMockApi) {
        console.log('[AI-AGENT] 🔄 Falling back to mock AI service for intent detection');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using mock AI instead for intent detection.",
          variant: "destructive"
        });
        // Fall back to mock service with intent detection request
        return JSON.stringify([
          "summarize",
          "translate",
          "extract key phrases",
          "detect language"
        ]);
      } else {
        console.log('[AI-AGENT] 🔄 Falling back to OpenAI service for intent detection');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using OpenAI instead for intent detection.",
          variant: "destructive"
        });
        // Fall back to OpenAI with intent detection request
        return await generateRealAIResponse(`Generate intent keywords for ${modality} modality`);
      }
    }
  } else if (useMockApi) {
    // Use mock API if network services are disabled and mock is enabled
    console.log('[AI-AGENT] 🎭 Using mock AI service for intent detection (Network services disabled)');
    return JSON.stringify([
      "summarize",
      "translate",
      "extract key phrases",
      "detect language"
    ]);
  } else {
    // Use real OpenAI API if both network services and mock are disabled
    console.log('[AI-AGENT] 🧠 Using OpenAI service for intent detection (Network services and mock disabled)');
    return await generateRealAIResponse(`Generate intent keywords for ${modality} modality`);
  }
}

/**
 * Handle MCP response adapter generation
 */
export async function handleMcpResponse(
  mcpJson: string,
  useEMCNetwork: boolean = true,
  useMockApi: boolean = true,
  model: EMCModel = DEFAULT_MODEL
): Promise<string> {
  console.log(`[AI-AGENT] 🔄 Starting MCP response adapter generation`);
  
  // Try EMC Network/SiliconFlow first if enabled
  if (useEMCNetwork) {
    try {
      console.log(`[AI-AGENT] 🌐 Network services are enabled, attempting to generate MCP adapter using model: ${model}`);
      // Use the generateMcp2AIOOutputAdapter implementation
      return await generateMcp2AIOOutputAdapter(mcpJson, model);
    } catch (error) {
      console.warn("[AI-AGENT] ⚠️ Network services completely failed for MCP adapter generation, falling back to alternative:", error);
      
      // Only reach this if something catastrophic happened in the network services
      if (useMockApi) {
        console.log('[AI-AGENT] 🔄 Falling back to mock AI service for MCP adapter generation');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using mock AI instead for MCP adapter generation.",
          variant: "destructive"
        });
        // Fall back to mock service with a sample MCP adapter output
        return JSON.stringify({
          output: {
            type: "text",
            value: "This is a mock MCP adapter response."
          }
        });
      } else {
        console.log('[AI-AGENT] 🔄 Falling back to OpenAI service for MCP adapter generation');
        toast({
          title: "Network services error",
          description: "The service encountered an unexpected error. Using OpenAI instead for MCP adapter generation.",
          variant: "destructive"
        });
        // Fall back to OpenAI with MCP adapter request
        return await generateRealAIResponse(`Generate AIO protocol output based on MCP JSON: ${mcpJson}`);
      }
    }
  } else if (useMockApi) {
    // Use mock API if network services are disabled and mock is enabled
    console.log('[AI-AGENT] 🎭 Using mock AI service for MCP adapter generation (Network services disabled)');
    return JSON.stringify({
      output: {
        type: "text",
        value: "This is a mock MCP adapter response."
      }
    });
  } else {
    // Use real OpenAI API if both network services and mock are disabled
    console.log('[AI-AGENT] 🧠 Using OpenAI service for MCP adapter generation (Network services and mock disabled)');
    return await generateRealAIResponse(`Generate AIO protocol output based on MCP JSON: ${mcpJson}`);
  }
}

