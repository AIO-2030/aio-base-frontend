import { AIOProtocolStepInfo } from './AIOProtocolHandler';
import { AIOProtocalFramework } from './AIOProtocalFramework';
import { executeRpc } from '../services/ExecFileCommonBuss';
import { generateParamsFromSchema, InputSchema } from './AIOProtocalAdapoter';
import { adaptMcp2AI } from '@/services/aiAgentService';

interface StepExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Executes a single step in the protocol using JSON-RPC
 * @param apiEndpoint The API endpoint to call
 * @param contextId Unique identifier for the calling context
 * @param currentValue Current value from the context
 * @param operation Current operation keyword
 * @param callIndex Current call index
 * @param stepInfo Information about the current step
 * @returns Promise with the execution result
 */
export async function exec_step(
  apiEndpoint: string,
  contextId: string,
  currentValue: any,
  operation: string,
  callIndex: number,
  stepInfo: AIOProtocolStepInfo
): Promise<StepExecutionResult> {
  const framework = AIOProtocalFramework.getInstance();
  const startTime = Date.now();

  // Check if running in production environment
  const isProduction = import.meta.env.PROD || window.location.protocol === 'https:';
  
  let baseApiUrl;
  if (isProduction) {
    // Production environment uses remote MCP service directly
    baseApiUrl = 'https://mcp.univoices.club/api/v1/rpc';
    console.log(`[exec_step] Using production MCP server: ${baseApiUrl}`);
      } else {
      // Development environment uses environment variables
      baseApiUrl = import.meta.env.VITE_AIO_MCP_API_URL;
      if (!baseApiUrl) {
        const error = 'VITE_AIO_MCP_API_URL is not defined in environment variables';
        console.error(`[exec_step] ${error}`);
        return {
          success: false,
          error
        };
      }
      
      // Ensure HTTPS for development environment too
      if (baseApiUrl.startsWith('http://')) {
        baseApiUrl = baseApiUrl.replace('http://', 'https://');
        console.log(`[exec_step] Converted HTTP to HTTPS for development: ${baseApiUrl}`);
      }
      console.log(`[exec_step] Using URL: ${baseApiUrl}`);
    }
  console.log(`[exec_step] stepInfo: ${JSON.stringify(stepInfo)}`);

  // Extract MCP name and type from stepInfo.mcp (format: "mcpname::action")
  const mcpName = stepInfo.mcp ? stepInfo.mcp.split('::')[0] : '';
  console.log(`[exec_step] MCP name: ${stepInfo.mcp} ${mcpName}`);
  
  console.log(`[exec_step] Starting execution for context ${contextId}, callIndex ${callIndex}`);
  console.log(`[exec_step] Base API URL: ${baseApiUrl}`);
  console.log(`[exec_step] Operation: ${operation}`);
  
  try {
    const fileType = 'mcp';
    const filename = mcpName;


    console.log(`[exec_step] Extracted file type: ${fileType}, filename: ${filename}`);

    // Generate parameters based on input schema using the adapter
    const generatedParams = generateParamsFromSchema(stepInfo.inputSchema as InputSchema, currentValue);

    // Execute the RPC call
    console.log(`[exec_step] Initiating RPC call with action: ${stepInfo.action}`);
    console.log(`[exec_step] Generated parameters:`, generatedParams);
    const rpcResponse = await executeRpc(
      fileType,
      filename,
      stepInfo.action || 'help',
      generatedParams,
      `${contextId}_${callIndex}`
    );

    console.log(`[exec_step] RPC response received:`, rpcResponse);

    // Handle RPC error response
    if (rpcResponse.error) {
      console.error(`[exec_step] RPC error occurred:`, rpcResponse.error);
      throw new Error(rpcResponse.error.message);
    }
    // Adapt MCP response to AIO protocol format
    console.log(`[exec_step] Adapting MCP response to AIO protocol format`);
    
    // Convert the RPC response to a string for the adapter
    const mcpJsonString = JSON.stringify(rpcResponse.output);
    
    try {
      // Call the adaptMcp2AI function from aiAgentService to transform the MCP response
      // const adaptedResponse = await adaptMcp2AI(mcpJsonString);
       console.log(`[exec_step] Successfully adapted MCP response to AIO protocol:`, mcpJsonString);
      
      // Parse the adapted response and update the RPC response result data
      const parsedAdaptedResponse = JSON.parse(mcpJsonString);
      rpcResponse.output.data = parsedAdaptedResponse;
      
      console.log(`[exec_step] Updated result data with adapted response:`, parsedAdaptedResponse);
    } catch (adaptError) {
      console.warn(`[exec_step] Failed to adapt MCP response to AIO protocol format:`, adaptError);
      console.log(`[exec_step] Continuing with original MCP response`);
      // Continue with the original response if adaptation fails
    }

    // Validate the response data
    if (!rpcResponse.output || !rpcResponse.output.data) {
      console.error(`[exec_step] Invalid RPC response:`, rpcResponse);
      throw new Error('RPC returned invalid or empty response');
    }

    const executionTime = Date.now() - startTime;
    console.log(`[exec_step] Execution completed successfully in ${executionTime}ms`);
    console.log(`[exec_step] Result data:`, rpcResponse.output.data);

    // Record successful trace
    framework.recordTrace(
      contextId,
      { ...stepInfo, stepIndex: callIndex },
      currentValue,
      rpcResponse.output.data,
      'ok'
    );

    // Return the successful result
    return {
      success: true,
      data: rpcResponse.output.data
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[exec_step] Execution failed after ${executionTime}ms:`, error);

    // Record error trace
    framework.recordTrace(
      contextId,
      { ...stepInfo, stepIndex: callIndex },
      currentValue,
      null,
      'error',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );

    // Return the error result
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
