
import axios from 'axios';
import { SERVER_PATHS } from './api/apiConfig';
import { FileType } from './ExecFileCommonBuss';

// File service API base URL
const FILE_SERVICE_URL = import.meta.env.VITE_FILE_SERVICE_URL || 'http://localhost:8001';

// Setup logger for file operations
const logFileOp = (operation: string, message: string, data?: any) => {
  if (data) {
    console.log(`[FILE_SERVICE][${operation}] ${message}`, data);
  } else {
    console.log(`[FILE_SERVICE][${operation}] ${message}`);
  }
};

// Response interfaces
export interface ExecutableFileUploadResponse {
  success: boolean;
  filepath?: string;
  filename?: string;
  downloadUrl?: string;
  message: string;
}

export interface ExecutableFileDownloadResponse {
  success: boolean;
  data?: Blob;
  filename?: string;
  message: string;
}

/**
 * Uploads an executable file to external file service
 * @param file The executable file to upload
 * @param type The type of file ('agent' or 'mcp')
 * @param customFilename Optional custom filename
 */
export const uploadExecutableFile = async (
  file: File,
  type: FileType,
  customFilename?: string
): Promise<ExecutableFileUploadResponse> => {
  logFileOp('UPLOAD', 'Starting executable upload process', { 
    filename: file?.name, 
    size: file?.size, 
    type, 
    customFilename 
  });
  
  if (!file) {
    logFileOp('UPLOAD', 'Upload aborted: No file provided');
    return { success: false, message: 'No file provided' };
  }

  // Get target directory based on file type
  const targetDir = type === 'agent' 
    ? SERVER_PATHS.AGENT_EXEC_DIR 
    : SERVER_PATHS.MCP_EXEC_DIR;
  
  logFileOp('UPLOAD', `Target directory determined for ${type}`, { targetDir });
  
  // Use custom filename if provided, or generate one with timestamp
  let filename;
  if (customFilename && customFilename.trim() !== '') {
    // Use the custom filename directly (should already include extension)
    filename = customFilename.trim();
    logFileOp('UPLOAD', `Using custom filename`, { filename });
  } else {
    // Generate default filename with timestamp
    filename = `${type}-${Date.now()}-${file.name}`;
    logFileOp('UPLOAD', `Generated default filename`, { filename });
  }

  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetDir', targetDir);
    formData.append('filename', filename);
    formData.append('fileType', type);
    
    logFileOp('UPLOAD', 'FormData created and populated', { 
      hasFile: formData.has('file'),
      targetDir,
      filename,
      type 
    });

    logFileOp('UPLOAD', `Sending POST request to ${FILE_SERVICE_URL}/upload/${type}`);
    
    // Send file to external service with type in URL path
    const response = await axios.post(
      `${FILE_SERVICE_URL}/upload/${type}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          logFileOp('UPLOAD', `Upload progress: ${percentCompleted}%`, { 
            loaded: progressEvent.loaded,
            total: progressEvent.total
          });
        }
      }
    );

    logFileOp('UPLOAD', 'Received response from server', response);

    if (response.status === 200 
        && response.statusText === 'OK' 
        && response.data) {
      // Get download URL for the uploaded file
      const filepath = response.data.path;
      logFileOp('UPLOAD', 'Upload successful, retrieving download URL', { filepath });
      
      const downloadUrl = await getFileDownloadUrl(filepath);
      logFileOp('UPLOAD', 'Got download URL', { downloadUrl });
      
      const result = {
        success: true,
        filepath: filepath,
        filename: response.data.filename,
        downloadUrl: downloadUrl,
        message: 'File uploaded successfully'
      };
      
      logFileOp('UPLOAD', 'Upload operation completed successfully', result);
      return result;
    } else {
      const errorResult = {
        success: false,
        message: response.data.message || 'Failed to upload file'
      };
      logFileOp('UPLOAD', 'Upload operation failed', { 
        responseData: response.data,
        errorResult
      });
      return errorResult;
    }
  } catch (error) {
    logFileOp('UPLOAD', 'Exception during upload', error);
    console.error('Error uploading file:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
};

/**
 * Downloads an executable file from external file service
 * @param filepath The path of the file to download
 */
export const downloadExecutableFile = async (
  filepath: string
): Promise<ExecutableFileDownloadResponse> => {
  logFileOp('DOWNLOAD', 'Starting file download process', { filepath });
  
  if (!filepath) {
    logFileOp('DOWNLOAD', 'Download aborted: No filepath provided');
    return { success: false, message: 'No filepath provided' };
  }

  try {
    // Parse filepath to extract file information
    const pathParts = filepath.split('/');
    
    // Detect file type from path
    const fileType = filepath.includes('/agent/') ? 'agent' : 'mcp';
    
    // Last part is the filename
    const filename = pathParts[pathParts.length - 1] || 'unknown';
    
    logFileOp('DOWNLOAD', 'Parsed filepath components', { fileType, filename, originalPath: filepath });
    
    // Use port 8001 for downloads as specified
    const downloadBaseUrl = import.meta.env.VITE_DOWNLOAD_BASE_URL || 'http://localhost:8001';
    
    // Construct the URL according to required pattern
    const downloadUrl = `${downloadBaseUrl}?type=${fileType}&filename=${encodeURIComponent(filename)}`;
    
    logFileOp('DOWNLOAD', `Sending GET request to ${downloadUrl}`);
    
    // Request file download using URL format required by file service
    const response = await axios.get(
      downloadUrl,
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          logFileOp('DOWNLOAD', `Download progress: ${percentCompleted}%`, { 
            loaded: progressEvent.loaded,
            total: progressEvent.total
          });
        }
      }
    );
    
    logFileOp('DOWNLOAD', 'Received response from server', { 
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers['content-type'],
      contentLength: response.headers['content-length']
    });
    
    // Extract filename from headers if available, otherwise use the one from filepath
    const contentDisposition = response.headers['content-disposition'];
    logFileOp('DOWNLOAD', 'Processing content-disposition header', { contentDisposition });
    
    const downloadedFilename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : filename;
    
    logFileOp('DOWNLOAD', 'Determined filename for downloaded file', { downloadedFilename });
    
    const result = {
      success: true,
      data: response.data,
      filename: downloadedFilename,
      message: 'File downloaded successfully'
    };
    
    logFileOp('DOWNLOAD', 'Download operation completed successfully', { 
      filename: downloadedFilename,
      blobSize: response.data.size,
      blobType: response.data.type
    });
    
    return result;
  } catch (error) {
    logFileOp('DOWNLOAD', 'Exception during download', error);
    console.error('Error downloading file:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to download file'
    };
  }
};

/**
 * Checks if an executable file exists on the external file service
 * @param filepath The path of the file to check
 */
export const checkFileExists = async (filepath: string): Promise<boolean> => {
  logFileOp('CHECK_EXISTS', 'Starting file existence check', { filepath });
  
  try {
    logFileOp('CHECK_EXISTS', `Sending GET request to ${FILE_SERVICE_URL}/exists`);
    
    // Check if file exists via service API
    const response = await axios.get(`${FILE_SERVICE_URL}/exists`, {
      params: { filepath }
    });
    
    const exists = response.data.exists === true;
    logFileOp('CHECK_EXISTS', `File existence check result: ${exists ? 'File exists' : 'File does not exist'}`, {
      responseStatus: response.status,
      responseData: response.data
    });
    
    return exists;
  } catch (error) {
    logFileOp('CHECK_EXISTS', 'Exception during file existence check', error);
    console.error('Error checking file existence:', error);
    return false;
  }
};

/**
 * Gets a direct download URL for a file from the external service
 * @param filepath The path of the file
 */
export const getFileDownloadUrl = async (filepath: string): Promise<string> => {
  logFileOp('GET_URL', 'Starting to get file download URL', { filepath });
  
  if (!filepath) {
    logFileOp('GET_URL', 'No filepath provided, returning empty URL');
    return '';
  }
  
  try {
    // Parse filepath to extract file information
    const pathParts = filepath.split('/');
    
    // Detect file type from path
    const fileType = filepath.includes('/agent/') ? 'agent' : 'mcp';
    
    // Last part is the filename
    const filename = pathParts[pathParts.length - 1] || 'unknown';
    
    logFileOp('GET_URL', 'Parsed filepath components', { fileType, filename, originalPath: filepath });
    
    // Use port 8001 for downloads as specified
    const downloadBaseUrl = import.meta.env.VITE_DOWNLOAD_BASE_URL || 'http://localhost:8001';
    
    // Format the URL according to required pattern
    const url = `${downloadBaseUrl}?type=${fileType}&filename=${encodeURIComponent(filename)}`;
    
    logFileOp('GET_URL', 'Created file download URL', { url });
    
    return url;
  } catch (error) {
    logFileOp('GET_URL', 'Exception while constructing download URL', error);
    console.error('Error creating download URL:', error);
    
    // Return basic fallback URL in case of error
    const fallbackUrl = `http://localhost:8001?filepath=${encodeURIComponent(filepath)}`;
    logFileOp('GET_URL', 'Using fallback URL format', { fallbackUrl });
    
    return fallbackUrl;
  }
};
