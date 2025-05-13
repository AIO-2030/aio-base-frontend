import { toast } from "@/components/ui/use-toast";
import { AttachedFile } from "@/components/chat/ChatFileUploader";
import { AIMessage } from "./types/aiTypes";
import { 
  handleTextLLMInteraction, 
  handleAIOSampleInteraction,
  handleInvertedIndexInteraction,
  handleMcpResponse
} from "./ai/textAIService";
import { processVoiceData as processVoiceAudio } from "./ai/voiceAIService";
import { DEFAULT_MODEL } from "./ai/emcAIService";
import { EMCModel } from "./emcNetworkService";
import { createTrace, addCall, updateCall, handleNetworkError } from "./aio/traceHandler";
import { createInvertedIndexMessage } from "@/config/aiPrompts";

// Configuration flags
let useMockApi = true;
let useEMCNetwork = true;
let currentModel = DEFAULT_MODEL;

/**
 * Set whether to use real AI services or mock AI
 */
export const setUseRealAI = (useReal: boolean): void => {
  useMockApi = !useReal;
  console.log(`AI Agent Service using ${useMockApi ? 'mock' : 'real'} AI`);
};

/**
 * Set whether to use network services or fall back directly to alternatives
 */
export const setUseEMCNetwork = (useEMC: boolean): void => {
  useEMCNetwork = useEMC;
  console.log(`Network services ${useEMCNetwork ? 'enabled' : 'disabled'}`);
};

/**
 * Set the current AI model to use
 */
export const setCurrentModel = (model: EMCModel): void => {
  currentModel = model;
  console.log(`Current AI model set to: ${model}`);
};

/**
 * Get the current AI model
 */
export const getCurrentModel = (): EMCModel => {
  return currentModel;
};

/**
 * Process voice data and get a response
 */
export async function processVoiceData(audioData: Blob): Promise<{ response: string, messageId: string }> {
  const trace_id = createTrace();
  const call_id = addCall(
    trace_id,
    'voice_processor',
    'aio',
    'stdio',
    'voice_processor::process_audio',
    [{ type: 'audio', value: 'audio_data_blob' }]
  );

  try {
    const result = await processVoiceAudio(audioData, useMockApi);
    
    updateCall(
      trace_id,
      call_id,
      [{ type: 'text', value: result.response }],
      'ok'
    );
    
    return result;
  } catch (error) {
    console.error("Error processing voice data:", error);
    handleNetworkError(trace_id, call_id, error);
    throw error;
  }
}

/**
 * Send a text message and get a response
 */
export async function sendMessage(message: string, attachedFiles?: AttachedFile[]): Promise<AIMessage> {
  const trace_id = createTrace();
  
  try {
    // For system messages like MCP server interactions, we bypass the LLM
    // and directly create an AI message for the chat interface
    if (!attachedFiles) {
      const systemMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: message,
        timestamp: new Date(),
        intent_analysis: {},
        execution_plan: {
          steps: [],
          constraints: [],
          quality_metrics: []
        }
      };
      
      // Record this as a direct system message in the trace
      const call_id = addCall(
        trace_id,
        'system',
        'aio',
        'stdio',
        'system::direct_message',
        [{ type: 'text', value: message }]
      );
      
      updateCall(
        trace_id,
        call_id,
        [{ type: 'text', value: 'Message delivered to chat' }],
        'ok'
      );
      
      return systemMessage;
    }
    
    // For regular user messages with or without attachments, process normally
    const call_id = addCall(
      trace_id,
      'llm_agent',
      'aio',
      'stdio',
      'llm_agent::process_message',
      [
        { type: 'text', value: message },
        { type: 'attachments', value: attachedFiles ? `${attachedFiles.length} files` : 'none' }
      ]
    );
    
    const response = await handleTextLLMInteraction(
      message, 
      attachedFiles, 
      useEMCNetwork, 
      useMockApi,
      currentModel
    );
    console.log("[AI Agent Service] AI Response content:", response);
    
    // For files mentioned in the response, the AI should reference them
    const referencedFiles = attachedFiles || [];
    
    // Parse the response to extract structured data
    let intentAnalysis = {};
    let executionPlan = {
      steps: [],
      constraints: [],
      quality_metrics: []
    };
    
    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response);
      if (parsedResponse.intent_analysis) {
        intentAnalysis = parsedResponse.intent_analysis;
      }
      if (parsedResponse.execution_plan) {
        executionPlan = parsedResponse.execution_plan;
      }
    } catch (e) {
      // If parsing fails, it's not JSON, use the response as is
      console.log("Response is not JSON, using as plain text");
    }
    
    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content: response,
      timestamp: new Date(),
      referencedFiles: referencedFiles.length > 0 ? referencedFiles : undefined,
      intent_analysis: intentAnalysis,
      execution_plan: executionPlan
    };
    
    updateCall(
      trace_id,
      call_id,
      [{ type: 'text', value: response }],
      'ok'
    );
    
    return aiMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const call_id = addCall(
      trace_id,
      'error_handler',
      'aio',
      'stdio',
      'error_handler::handle_message_error',
      [{ type: 'error', value: errorMessage }]
    );
    
    handleNetworkError(trace_id, call_id, error);
    
    // Provide a fallback response in case of error
    return {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content: `I encountered a network error while processing your request: ${errorMessage}. This might be due to connectivity issues. Please check your connection and try again later.`,
      timestamp: new Date(),
      intent_analysis: {},
      execution_plan: {
        steps: [],
        constraints: [],
        quality_metrics: []
      }
    };
  }
}

/**
 * Get AIO sample based on help response
 */
export async function getAIOSample(helpResponse: string, describeContent: string): Promise<string> {
  const trace_id = createTrace();
  const call_id = addCall(
    trace_id,
    'aio_sampler',
    'aio',
    'stdio',
    'aio_sampler::generate_sample',
    [
      { type: 'text', value: 'help_response' },
      { type: 'text', value: 'description' }
    ]
  );
  
  try {
    // Use the dedicated AIO sample interaction handler function with the current model
    const response = await handleAIOSampleInteraction(
      helpResponse,
      describeContent,
      useEMCNetwork,
      useMockApi,
      currentModel
    );
    
    updateCall(
      trace_id,
      call_id,
      [{ type: 'text', value: 'Sample generated successfully' }],
      'ok'
    );
    
    return response;
  } catch (error) {
    console.error("Error generating AIO sample:", error);
    handleNetworkError(trace_id, call_id, error);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Get initial greeting message
 */
export function getInitialMessage(): AIMessage {
  return {
    id: '1',
    sender: 'ai',
    content: "Hello! I'm AIO-2030 AI. How can I assist you with the decentralized AI agent network today?",
    timestamp: new Date(),
  };
}

/**
 * Create inverted index for MCP service
 */
export async function createAioInvertIndex(mcpJson: string): Promise<string> {
  const trace_id = createTrace();
  const call_id = addCall(
    trace_id,
    'aio_indexer',
    'aio',
    'stdio',
    'aio_indexer::create_inverted_index',
    [{ type: 'json', value: mcpJson }]
  );

  try {
    // Use the dedicated inverted index interaction handler
    const response = await handleInvertedIndexInteraction(
      mcpJson,
      useEMCNetwork,
      useMockApi,
      currentModel
    );
    
    updateCall(
      trace_id,
      call_id,
      [{ type: 'json', value: response }],
      'ok'
    );
    
    return response;
  } catch (error) {
    console.error("Error creating inverted index:", error);
    handleNetworkError(trace_id, call_id, error);
    throw error;
  }
}

/**
 * Adapt MCP response to AIO format
 */
export async function adaptMcp2AI(mcpJson: string): Promise<string> {
  const trace_id = createTrace();
  const call_id = addCall(
    trace_id,
    'mcp_adapter',
    'aio',
    'stdio',
    'mcp_adapter::adapt_response',
    [{ type: 'json', value: mcpJson }]
  );
  
  try {
    // Use the dedicated MCP response adapter handler
    const response = await handleMcpResponse(
      mcpJson,
      useEMCNetwork,
      useMockApi,
      currentModel
    );
    
    updateCall(
      trace_id,
      call_id,
      [{ type: 'json', value: 'Response adapted successfully' }],
      'ok'
    );
    
    return response;
  } catch (error) {
    console.error("Error adapting MCP response:", error);
    handleNetworkError(trace_id, call_id, error);
    throw error; // Propagate the error to the caller
  }
}

