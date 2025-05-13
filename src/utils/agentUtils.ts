
import type { AgentItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';

/**
 * Generate default input JSON based on agent name
 */
export const generateDefaultInput = (agentName: string) => {
  return {
    jsonrpc: "2.0",
    method: `${agentName}::process`,
    inputs: [
      {
        type: "text",
        value: "This is a test input"
      }
    ],
    id: 1,
    trace_id: `test-${Date.now()}`
  };
};

/**
 * Process agent input and generate sample output
 */
export const parseAgentInputOutput = (agent: AgentItem, inputJson: any) => {
  return {
    jsonrpc: "2.0",
    id: inputJson.id,
    trace_id: inputJson.trace_id,
    outputs: [
      {
        type: "text",
        value: `Processed by ${agent.name}: ${inputJson.inputs?.[0]?.value || 'No input provided'}`
      }
    ]
  };
};

/**
 * Get agent communication type based on agent configuration
 */
export const getAgentCommunicationType = (agent: AgentItem) => {
  // This is a placeholder for future implementation
  // Could return 'stdio', 'http', or 'mcp' based on agent configuration
  return 'stdio'; // Default to stdio since communication_type property doesn't exist
};

/**
 * Format JSON with consistent indentation for display
 */
export const formatJsonForDisplay = (jsonData: any) => {
  try {
    if (typeof jsonData === 'string') {
      return JSON.stringify(JSON.parse(jsonData), null, 2);
    }
    return JSON.stringify(jsonData, null, 2);
  } catch (error) {
    console.error('Error formatting JSON:', error);
    return typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData);
  }
};
