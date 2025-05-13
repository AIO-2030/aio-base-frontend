import { AIMessage } from '@/services/types/aiTypes';
import { toast } from '@/components/ui/use-toast';
import { exec_step } from './AIOProtocalExecutor';
import { extractStepKeywordsByExecution, getAIOIndexByMcpId, getMethodByName } from './AIOProtocalAdapoter';
import { extractJsonResponseToList, extractJsonResponseToValueString } from '../util/json/responseFormatter';

// Protocol calling context
export interface AIOProtocolCallingContext {
  input_value: any; // Initial input value (string, blob, base64, url, json)
  curr_value: any; // Current value after processing
  output_value: any; // Final output value
  opr_keywd: string[]; // Operation keywords
  curr_call_index: number; // Current step in the calling sequence
  step_schemas?: Record<string, any>; // Input schemas for each step (key is methodName)
  step_mcps?: string[]; // MCP for each step (optional)
  execution_plan?: any; // Original execution plan (optional)
  method_index_map?: Record<string, number>; // Maps method names to their step indices
  // New tracing fields
  trace_logs?: ProtocolTraceLog[]; // Array of trace logs for each step
  last_trace_time?: number; // Timestamp of the last trace
}

// New interface for trace logs
export interface ProtocolTraceLog {
  trace_id: string;
  calls: ProtocolTraceCall[];
}

export interface ProtocolTraceCall {
  id: number;
  protocol: string;
  agent: string;
  type: 'stdio' | 'mcp';
  method: string;
  input: {
    type: string;
    value: any;
  };
  output: {
    type: string;
    value: any;
  };
  status: 'ok' | 'error';
  error_message?: string;
}

// Result type for protocol calls
export interface AIOProtocolCallResult {
  success: boolean;
  message?: string;
  data?: any;
}

// Step information for protocol calling
export interface AIOProtocolStepInfo {
  mcp?: string;
  action?: string;
  inputSchema?: any;  // Keep internal protocol using inputSchema
  dependencies?: string[];
  stepIndex?: number;
}

export class AIOProtocolHandler {
  private static instance: AIOProtocolHandler;
  private contexts: Map<string, AIOProtocolCallingContext> = new Map();
  
  private constructor() {}
  
  public static getInstance(): AIOProtocolHandler {
    if (!AIOProtocolHandler.instance) {
      AIOProtocolHandler.instance = new AIOProtocolHandler();
    }
    return AIOProtocolHandler.instance;
  }
  
  /**
   * Initialize a calling context for the protocol
   * @param contextId Unique identifier for this calling context
   * @param inputValue Initial input value
   * @param operationKeywords Array of operation keywords
   * @param executionPlan Optional execution plan from LLM
   * @returns The context object or null if initialization failed
   */
  public async init_calling_context(
    contextId: string,
    inputValue: any,
    operationKeywords: string[] = [],
    executionPlan?: any
  ): Promise<AIOProtocolCallingContext | null> {
    try {
      // Extract step schemas and MCPs from execution plan if available
      const stepSchemas: Record<string, any> = {};
      const stepMcps: string[] = [];
      const methodIndexMap: Record<string, number> = {};
      // Extract step keywords from execution plan
      let stepKeywords: { step: number; keywords: string[] }[] = [];
      if (executionPlan) {
        try {
          // restructure detail:
          // [
          // { step: 0, keywords: ["text", "image-generator"] },
          // { step: 1, keywords: ["generate-image", "create_image", "image-generator"] }
          // ]
          stepKeywords = extractStepKeywordsByExecution(inputValue);
          console.log('[AIOProtocolHandler] subscribed step keywords:', stepKeywords);
        } catch (error) {
          console.error('[AIOProtocolHandler] Error extracting step keywords:', error);
        }
      }
      // Create step information array
      const stepInfos: { step: number; mcpName: string; methodName: string }[] = [];
      
    
      
      console.log('[AIOProtocolHandler] Step infos:', stepInfos);

      if (executionPlan?.steps && Array.isArray(executionPlan.steps)) {
        // Process each step to get schemas from AIO index
        for (let i = 0; i < executionPlan.steps.length; i++) {
          const step = executionPlan.steps[i];
          const mcpName = step.mcp;
          const methodName = step.action;

          if (mcpName && methodName) {
            try {
              // Fetch AIO index for this MCP
              const aioIndex = await getAIOIndexByMcpId(mcpName);
              
              if (aioIndex) {
                // Get the method details from AIO index
                const method = getMethodByName(aioIndex, methodName);
                
                if (method) {
                  // Store the input schema using method name as key, adapting from AIO Index format
                  stepMcps[i] = mcpName;
                  // Convert from input_schema to inputSchema for internal protocol use
                  stepSchemas[methodName] = method.input_schema;
                  methodIndexMap[methodName] = i;
                  console.log(`[AIOProtocolHandler] Found schema for method ${methodName}:`, method.input_schema);
                  
                  // Adapt the operation keyword format if needed
                  if (operationKeywords[i]) {
                    operationKeywords[i] = `${mcpName}::${methodName}`;
                  }
                } else {
                  console.log(`[AIOProtocolHandler] Method ${methodName} not found in AIO index`);
                  continue;
                }
              } else {
                console.log(`[AIOProtocolHandler] AIO index not found for MCP ${mcpName}`);
                continue;
              }
            } catch (error) {
              console.log(`[AIOProtocolHandler] Skipping method ${methodName} due to error:`, error);
              continue;
            }
          }
        }
      }

      // Filter out any undefined or null entries from operation keywords
      const validOperationKeywords = operationKeywords.filter((_, index) => 
        stepMcps[index] !== undefined || stepSchemas[operationKeywords[index]?.split('::')[1]]
      );
      
      console.log(`[AIOProtocolHandler] Extracted schemas and MCPs from execution plan:`, 
        { stepSchemas, stepMcps, methodIndexMap, validOperationKeywords }
      );
      
      // Create a new context with filtered operations
      const context: AIOProtocolCallingContext = {
        input_value: inputValue,
        curr_value: inputValue,
        output_value: null,
        opr_keywd: validOperationKeywords.length > 0 ? validOperationKeywords : operationKeywords,
        curr_call_index: 0,
        step_schemas: Object.keys(stepSchemas).length > 0 ? stepSchemas : undefined,
        step_mcps: stepMcps.filter(mcp => mcp !== undefined),
        method_index_map: Object.keys(methodIndexMap).length > 0 ? methodIndexMap : undefined,
        execution_plan: executionPlan
      };
      
      // Store the context
      this.contexts.set(contextId, context);
      console.log(`[AIOProtocolHandler] Initialized context ${contextId}`, context);
      
      return context;
    } catch (error) {
      console.error('[AIOProtocolHandler] Error initializing context:', error);
      return null;
    }
  }
  
  /**
   * Get information about the current step in the protocol
   * @param contextId Unique identifier for the calling context
   * @returns Information about the current step or null if not found
   */
  public getCurrentStepInfo(contextId: string): AIOProtocolStepInfo | null {
    try {
      const context = this.contexts.get(contextId);
      
      if (!context) {
        console.error(`[AIOProtocolHandler] Context ${contextId} not found`);
        return null;
      }
      
      const currentIndex = context.curr_call_index;
      const currentStep = context.execution_plan?.steps?.[currentIndex];
      
      if (!currentStep) {
        return null;
      }

      const methodName = currentStep.action;
      
      // Get the current operation keyword
      const action = methodName;
      
      // Get schema using method name
      const inputSchema = context.step_schemas?.[methodName];
      
      // Check if we have an MCP for this step
      const mcp = context.step_mcps?.[currentIndex];
      
      // Get dependencies from execution plan if available
      let dependencies: string[] | undefined;
      if (currentStep.dependencies) {
        dependencies = currentStep.dependencies;
      }
      
      return {
        action,
        inputSchema,  // Keep using inputSchema in internal protocol
        mcp,
        dependencies,
        stepIndex: currentIndex
      };
    } catch (error) {
      console.error('[AIOProtocolHandler] Error getting step info:', error);
      return null;
    }
  }
  
  /**
   * Process the next step in the protocol calling sequence
   * @param contextId Unique identifier for the calling context
   * @param apiEndpoint The API endpoint to call
   * @param addDirectMessage Optional function to send status messages to the chatbox
   * @returns Result of the calling step
   */
  public async calling_next(
    contextId: string,
    apiEndpoint: string,
    addDirectMessage?: (content: string) => void
  ): Promise<AIOProtocolCallResult> {
    try {
      const context = this.contexts.get(contextId);
      
      if (!context) {
        console.error(`[AIOProtocolHandler] Context ${contextId} not found`);
        return { success: false, message: 'Context not found' };
      }

      const currentStep = context.curr_call_index + 1;
      const totalSteps = Math.max(
        context.step_mcps?.length || 0,
        context.step_schemas ? Object.keys(context.step_schemas).length : 0
      );

      // Get current step info
      const stepInfo = this.getCurrentStepInfo(contextId);
      
      // Send step start message to chatbox
      if (addDirectMessage) {
        addDirectMessage(`Executing step ${currentStep}/${totalSteps}: ${stepInfo?.action || 'Processing'}...`);
      }

      // Execute the step using the executor
      const result = await exec_step(
        apiEndpoint,
        contextId,
        context.curr_value,
        context.opr_keywd[context.curr_call_index] || '',
        context.curr_call_index,
        stepInfo || {}
      );

      if (!result.success) {
        throw new Error(result.error || 'Step execution failed');
      }

      // Update the context with the result
      context.curr_value = result.data;
      context.curr_call_index += 1;

      // Send step completion message to chatbox
      if (addDirectMessage) {
        addDirectMessage(`Step ${currentStep}/${totalSteps} completed successfully.`);
      }

      return { 
        success: true, 
        message: 'Step processed successfully', 
        data: result.data 
      };
    } catch (error) {
      console.error('[AIOProtocolHandler] Error in calling_next:', error);
      return { 
        success: false, 
        message: `Error processing step: ${error.message}` 
      };
    }
  }
  
  /**
   * Execute the protocol calling step by step
   * @param contextId Unique identifier for the calling context
   * @param apiEndpoint The API endpoint to call
   * @param isFinalResponseOverride Optional flag to force marking as final response
   * @param addDirectMessage Optional function to send status messages to the chatbox
   * @returns AI message that can be added to the chat
   */
  public async calling_step_by_step(
    contextId: string,
    apiEndpoint: string,
    isFinalResponseOverride?: boolean,
    addDirectMessage?: (content: string) => void
  ): Promise<AIMessage | null> {
    try {
      const context = this.contexts.get(contextId);
      
      if (!context) {
        console.error(`[AIOProtocolHandler] Context ${contextId} not found`);
        toast({
          title: "Protocol Error",
          description: "Calling context not found",
          variant: "destructive"
        });
        return null;
      }
      console.log("[AIOProtocolHandler]Executor AIO Protocol Step by Step with Context:", context);

      // Get the total number of steps
      const totalSteps = Math.max(
        context.step_mcps?.length || 0,
        context.step_schemas ? Object.keys(context.step_schemas).length : 0
      );

      if (totalSteps === 0) {
        console.error(`[AIOProtocolHandler] No steps defined for context ${contextId}`);
        toast({
          title: "Protocol Error",
          description: "No steps defined in the protocol",
          variant: "destructive"
        });
        return null;
      }

      // Reset current call index to start from the beginning
      context.curr_call_index = 0;
      let finalResult = null;

      // Send initial status message to chatbox
      if (addDirectMessage) {
        addDirectMessage(`Starting protocol execution with ${totalSteps} steps...`);
      }

      // Execute all steps in sequence
      while (context.curr_call_index < totalSteps) {
        const result = await this.calling_next(contextId, apiEndpoint, addDirectMessage);
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        finalResult = result.data;
      }

      // Set the final output value
      context.output_value = finalResult;
      
      // Send completion message to chatbox
      if (addDirectMessage) {
        addDirectMessage(`Protocol execution completed successfully. All ${totalSteps} steps have been processed.`);
      }
      let finalResultContent = typeof finalResult === 'string' 
        ? finalResult 
        : extractJsonResponseToList(finalResult.output);
      let intentLLMInput = extractJsonResponseToValueString(finalResult.output);
      console.log("[AIOProtocolHandler] Final Result Content:", finalResultContent);
      console.log("[AIOProtocolHandler] Intent LLM Input:", intentLLMInput);
     // Create final result message
      const finalMessage: AIMessage = {
        id: `aio-protocol-result-${Date.now()}`,
        sender: 'ai',
        content:finalResultContent,
        timestamp: new Date(),
        protocolContext: {
          contextId,
          currentStep: totalSteps,
          totalSteps,
          isComplete: true,
          status: 'completed',
          metadata: {
            operation: context.opr_keywd[context.curr_call_index - 1] || '',
            mcp: context.step_mcps?.[context.curr_call_index - 1] || ''   ,
            intentLLMInput: intentLLMInput
          }
        }
      };
      
      return finalMessage;
    } catch (error) {
      console.error('[AIOProtocolHandler] Error in calling_step_by_step:', error);
      toast({
        title: "Protocol Error",
        description: `Error executing protocol step: ${error.message}`,
        variant: "destructive"
      });
      
      if (addDirectMessage) {
        addDirectMessage(`Error executing protocol: ${error.message}`);
      }
      
      const currentContext = this.contexts.get(contextId);
      const currentStep = currentContext?.curr_call_index || 0;
      const totalSteps = currentContext?.step_mcps?.length || 0;
      
      return {
        id: `aio-protocol-error-${Date.now()}`,
        sender: 'ai',
        content: `Error executing protocol: ${error.message}`,
        timestamp: new Date(),
        protocolContext: {
          contextId,
          currentStep,
          totalSteps,
          isComplete: false,
          status: 'failed',
          error: error.message,
          metadata: {
            operation: currentContext?.opr_keywd[currentStep] || '',
            mcp: currentContext?.step_mcps?.[currentStep] || ''
          }
        }
      };
    }
  }
  
  /**
   * Get a specific context
   * @param contextId Unique identifier for the calling context
   * @returns The context object or null if not found
   */
  public getContext(contextId: string): AIOProtocolCallingContext | null {
    return this.contexts.get(contextId) || null;
  }
  
  /**
   * Delete a context when it's no longer needed
   * @param contextId Unique identifier for the calling context
   */
  public deleteContext(contextId: string): boolean {
    return this.contexts.delete(contextId);
  }

  /**
   * Initialize a protocol context with voice data and AI message
   * @param voiceData The voice input data
   * @param aiMessage The AI message containing execution plan
   * @returns The initialized context ID if successful, null otherwise
   */
  public async protocolStarting(voiceData: any, aiMessage: AIMessage): Promise<string | null> {
    try {
      // Generate a unique context ID using timestamp and random string
      const contextId = `protocol-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Extract operation keywords from execution plan
      const operationKeywords = aiMessage.execution_plan?.steps?.map(step => {
        return step.mcp ? `${step.mcp}:${step.action}` : step.action;
      }) || [];

      // Initialize the context with voice data as input
      const context = await this.init_calling_context(
        contextId,
        voiceData,
        operationKeywords,
        aiMessage.execution_plan
      );

      if (!context) {
        console.error('[AIOProtocolHandler] Failed to initialize protocol context');
        return null;
      }

      console.log('[AIOProtocolHandler] Successfully initialized protocol context:', contextId);
      return contextId;
    } catch (error) {
      console.error('[AIOProtocolHandler] Error in protocolStarting:', error);
      return null;
    }
  }
} 