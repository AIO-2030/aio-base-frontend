import * as mockApi from '../mockApi';
import { isUsingMockApi, API_CONFIG } from './apiConfig';
import type { FileUploadResponse } from '@/components/FileUpload';
import { uploadImageFile } from '@/services/ImgFileUpload';
import { addAgentItem } from '@/services/can/agentOperations';
import type { AgentItem, Platform } from 'declarations/aio-base-backend/aio-base-backend.did';
import { SERVER_PATHS } from '@/contexts/ApiContext';

// Add logger utility for agent service
const logAgentService = (area: string, message: string, data?: any) => {
  if (data) {
    console.log(`[AgentService][${area}] ${message}`, data);
  } else {
    console.log(`[AgentService][${area}] ${message}`);
  }
};

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

// Helper function to upload executable file using FileUpload component's core logic
const uploadExecutableFile = async (file: File, type: string, customFilename?: string): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetDir', SERVER_PATHS.AGENT_EXEC_DIR);
  formData.append('filename', customFilename || `${type}-${Date.now()}-${file.name}`);
  formData.append('fileType', 'agent');

  const uploadUrl = `${API_CONFIG.BASE_URL}/upload/agent`;

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': window.location.origin,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      filepath: data.path,
      filename: data.filename,
      downloadUrl: `${API_CONFIG.BASE_URL}/download?type=agent&filename=${encodeURIComponent(customFilename || file.name)}`,
      message: 'File uploaded successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
};

/**
 * Submit agent data to the backend
 * @param agentData Agent metadata and configuration
 * @param imageFile Optional image file for agent avatar
 * @param execFile Optional executable file for agent implementation
 * @returns Promise resolving to submission response
 */
export const submitAgent = async (
  agentData: mockApi.AgentSubmission,
  imageFile?: File | null,
  execFile?: File | null
): Promise<mockApi.SubmissionResponse> => {
  // Log submission with file information
  logAgentService('SUBMIT', 'Starting agent submission process', {
    agentData,
    hasImageFile: !!imageFile,
    hasExecFile: !!execFile
  });

  try {
    // If using mock API, delegate to mock implementation
    if (isUsingMockApi()) {
      logAgentService('SUBMIT', 'Using mock API implementation');
      return mockApi.submitAgent(agentData, imageFile, execFile);
    }

    // Real implementation follows
    logAgentService('SUBMIT', 'Using real API implementation');
    
    // Handle file uploads if needed (if paths not already provided)
    let imagePath = agentData.imagePath;
    let imageDownloadUrl = ''; // New variable to store the download URL
    let execFilePath = agentData.execFilePath;
    let execFileDownloadUrl = ''; // New variable to store the download URL

    // Only upload image if not already uploaded and an image file is provided
    if (!imagePath && imageFile) {
      logAgentService('UPLOAD', 'Uploading image file', { filename: imageFile.name });
      
      let customFilename;
      if (agentData.name && agentData.name.trim() !== '') {
        const fileExt = imageFile.name.split('.').pop() || 'png';
        customFilename = `${agentData.name.trim()}.${fileExt}`;
      }
      
      const imageUploadResult = await uploadImageFile(imageFile, customFilename);
      
      if (imageUploadResult.success) {
        imagePath = imageUploadResult.filepath || '';
        imageDownloadUrl = imageUploadResult.downloadUrl || ''; // Store the download URL
        logAgentService('UPLOAD', 'Image upload successful', { 
          filepath: imagePath,
          downloadUrl: imageDownloadUrl
        });
      } else {
        logAgentService('UPLOAD', 'Image upload failed', imageUploadResult);
        return {
          success: false,
          message: `Failed to upload image: ${imageUploadResult.message}`,
          timestamp: Date.now()
        };
      }
    }

    // Only upload executable if not already uploaded and an executable file is provided
    if (!execFilePath && execFile) {
      logAgentService('UPLOAD', 'Uploading executable file', { filename: execFile.name });
      
      const execUploadResult = await uploadExecutableFile(
        execFile, 
        'agent',
        agentData.name ? `${agentData.name}.js` : undefined
      );
      
      if (execUploadResult.success) {
        execFilePath = execUploadResult.filepath || '';
        execFileDownloadUrl = execUploadResult.downloadUrl || ''; // Store the download URL
        logAgentService('UPLOAD', 'Executable upload successful', { 
          filepath: execFilePath,
          downloadUrl: execFileDownloadUrl 
        });
      } else {
        logAgentService('UPLOAD', 'Executable upload failed', execUploadResult);
        return {
          success: false,
          message: `Failed to upload executable: ${execUploadResult.message}`,
          timestamp: Date.now()
        };
      }
    }

    // Prepare final agent data with paths
    const finalAgentData = {
      ...agentData,
      imagePath: imagePath || '',
      execFilePath: execFilePath || ''
    };

    logAgentService('SUBMIT', 'Prepared final agent data', finalAgentData);

    // Convert to AgentItem format for canister
    const agentItem: AgentItem = {
      id: BigInt(0), // Will be assigned by canister
      name: finalAgentData.name,
      description: finalAgentData.description,
      author: finalAgentData.author,
      owner: '', // Will be set by canister
      git_repo: finalAgentData.gitRepo || '',
      homepage: finalAgentData.homepage ? [finalAgentData.homepage] : [],
      platform: [{ Linux: null }], // Fixed: Properly format the Platform property as an array
      input_params: finalAgentData.inputParams ? [finalAgentData.inputParams] : [],
      output_example: finalAgentData.outputExample ? [finalAgentData.outputExample] : [],
      // Use the download URLs here instead of the file paths
      image_url: imageDownloadUrl ? [imageDownloadUrl] : (finalAgentData.imagePath ? [finalAgentData.imagePath] : []),
      exec_file_url: execFileDownloadUrl ? [execFileDownloadUrl] : (finalAgentData.execFilePath ? [finalAgentData.execFilePath] : []),
      version: '1.0.0'
    };

    logAgentService('SUBMIT', 'Converted to AgentItem format', agentItem);

    // Call agent submission endpoint via canister
    const result = await addAgentItem(agentItem);
    logAgentService('SUBMIT', 'Canister response received', result);
    
    if ('Ok' in result) {
      const agentId = result.Ok.toString();
      logAgentService('SUBMIT', 'Agent submitted successfully', { agentId });
      
      return {
        success: true,
        id: agentId,
        message: 'Agent submitted successfully',
        timestamp: Date.now()
      };
    } else {
      // Handle error response from canister
      const errorMessage = result.Err || 'Unknown error occurred';
      logAgentService('SUBMIT', 'Canister returned error', { error: errorMessage });
      
      return {
        success: false,
        message: `Failed to submit agent: ${errorMessage}`,
        timestamp: Date.now()
      };
    }
  } catch (error) {
    logAgentService('SUBMIT', 'Exception during agent submission', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit agent',
      timestamp: Date.now()
    };
  }
};
