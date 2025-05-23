import * as mockApi from '../mockApi';
import { isUsingMockApi } from './apiConfig';
import { getMcpItemByName, addMcpItem } from '../can';
import { storeInvertedIndex } from '../can/mcpOperations';
import type { McpItem } from 'declarations/aio-base-backend/aio-base-backend.did';
import { formatJsonForCanister } from '@/util/formatters';
import type { FileUploadResponse } from '@/components/FileUpload';

// Helper function to handle file upload response
const handleFileUploadResponse = (response: FileUploadResponse): { filepath: string; downloadUrl: string } => {
  if (!response.success) {
    throw new Error(response.message || 'File upload failed');
  }
  return {
    filepath: response.filepath || '',
    downloadUrl: response.downloadUrl || ''
  };
};

/**
 * Submit MCP server data to the backend
 * @param serverData MCP server metadata and configuration
 * @param serverFile Optional executable file for MCP server implementation
 * @returns Promise resolving to submission response
 */
export const submitMCPServer = async (
  serverData: mockApi.MCPServerSubmission, 
  serverFile?: File
): Promise<mockApi.SubmissionResponse> => {
  console.log('Submitting MCP server data to backend canister:', serverData);
  console.log('Server file:', serverFile ? serverFile.name : 'No file provided');
  
  // Prepare AIO-MCP protocol compliant data
  const protocolData = {
    ...serverData,
    // Add protocol-specific fields for registration
    protocol: "aio-mcp",
    version: "1.2.1"
  };
  
  console.log('Protocol-compliant data:', protocolData);
  
  try {
    if (isUsingMockApi()) {
      return mockApi.submitMCPServer(protocolData, serverFile);
    }
    
    // Real implementation - call ICP canister directly
    console.log('Calling ICP canister to submit MCP server data');
    
    //First, check if an MCP with this name already exists
    const existingMcp = await getMcpItemByName(serverData.name);
    if (existingMcp && existingMcp.name === serverData.name) {
      return {
        success: false,
        message: `   "${serverData.name}" already exists.`,
        timestamp: Date.now()
      };
    }
    
    // Variables to store uploaded file info
    let execFilePath = '';
    let execFileDownloadUrl = '';
    
    // Note: File upload is now handled by the FileUpload component
    // We just need to handle the response here
    if (serverFile) {
      console.log('MCP server executable file will be handled by FileUpload component:', serverFile.name);
    }
    
    // Format data according to McpItem structure, with special handling for JSON data
    const mcpItem: McpItem = {
      id: BigInt(0), // This will be assigned by the canister
      name: serverData.name,
      description: serverData.description,
      author: serverData.author,
      owner: "", // Will be set by the canister based on caller principal
      git_repo: serverData.gitRepo,
      // Use the exec_file field for the filename
      exec_file: serverFile ? [serverFile.name] : [],
      homepage: serverData.homepage ? [serverData.homepage] : [],
      // Use the download URL for the remote_endpoint if we have it, otherwise use the provided endpoint
      remote_endpoint: execFileDownloadUrl ? 
        [execFileDownloadUrl] : 
        (serverData.remoteEndpoint ? [serverData.remoteEndpoint] : []),
      mcp_type: serverData.type,
      community_body: serverData.communityBody ? 
        [formatJsonForCanister(serverData.communityBody)] : [],
      resources: serverData.resources,
      prompts: serverData.prompts,
      tools: serverData.tools,
      sampling: serverData.sampling
    };
    
    console.log('Formatted MCP item for canister:', mcpItem);
    
    // Call backend canister to add the MCP item
    const result = await addMcpItem(mcpItem);
    
    if ('Ok' in result) {
      return {
        success: true,
        id: result.Ok.toString(),
        message: serverFile 
          ? 'MCP Server with executable submitted successfully' 
          : 'MCP Server data submitted successfully (no executable)',
        timestamp: Date.now()
      };
    } else {
      throw new Error(result.Err);
    }
  } catch (error) {
    console.error('Error calling ICP canister:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error submitting to canister',
      timestamp: Date.now()
    };
  }
};

/**
 * Store MCP inverted index
 * @param jsonStr JSON string representation of the inverted index
 * @returns Promise resolving to result
 */
export const storeMcpInvertIndex = async (mcpName: string, jsonStr: string): Promise<{Ok: null} | {Err: string}> => {
  console.log('Storing MCP inverted index:', jsonStr);
  try {
    // Add JSON repair logic
    let fixedJsonData = jsonStr.trim();
    
    // 1. First try to parse the original data to check if it's a valid JSON array
    let isOriginalValidArray = false;
    try {
      const parsedOriginal = JSON.parse(fixedJsonData);
      isOriginalValidArray = Array.isArray(parsedOriginal);
    } catch (e) {
      // Original data is not valid JSON, we'll try to fix it
    }

    // 2. If original data is a valid array but missing brackets, add them
    if (isOriginalValidArray) {
      if (!fixedJsonData.startsWith('[')) {
        fixedJsonData = '[' + fixedJsonData;
      }
      if (!fixedJsonData.endsWith(']')) {
        fixedJsonData = fixedJsonData + ']';
      }
    } else {
      // 3. If not a valid array, try to fix common issues
      // Remove any text before first valid JSON character and after last valid JSON character
      const firstValidChar = fixedJsonData.search(/[{[]/);
      const lastValidChar = fixedJsonData.search(/[}\]]/);
      
      if (firstValidChar === -1 || lastValidChar === -1) {
        throw new Error('Invalid JSON format: No valid JSON structure found');
      }
      
      fixedJsonData = fixedJsonData.slice(firstValidChar, lastValidChar + 1);
      
      // If data is wrapped in curly braces, convert to array
      if (fixedJsonData.startsWith('{') && fixedJsonData.endsWith('}')) {
        fixedJsonData = '[' + fixedJsonData + ']';
      }
      
      // Remove trailing commas
      fixedJsonData = fixedJsonData.replace(/,(\s*[\]}])/g, '$1');
      
      // Fix missing commas between objects
      fixedJsonData = fixedJsonData.replace(/}\s*{/g, '},{');
    }

    // 4. Final validation
    try {
      const parsedData = JSON.parse(fixedJsonData);
      if (!Array.isArray(parsedData)) {
        throw new Error('Data must be a JSON array');
      }
      console.log('[JSON_REPAIR] Successfully validated and fixed JSON array');
    } catch (parseError) {
      console.error('[JSON_REPAIR] Failed to validate JSON:', parseError);
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }

    const result = await storeInvertedIndex(mcpName, fixedJsonData);
    console.log('Store MCP inverted index result:', result);
    return result;
  } catch (error) {
    console.error('Error storing MCP inverted index:', error);
    throw error;
  }
};
