import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { SERVER_PATHS, API_CONFIG } from './api/apiConfig';

// Create axios instance that enforces HTTP
const httpAxios = axios.create({
  baseURL: API_CONFIG.FULL_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ensure requests always use HTTP
httpAxios.interceptors.request.use((config) => {
  if (config.url?.startsWith('https://')) {
    config.url = config.url.replace('https://', 'http://');
  }
  if (config.baseURL?.startsWith('https://')) {
    config.baseURL = config.baseURL.replace('https://', 'http://');
  }
  return config;
});

// Add response interceptor to handle CORS
httpAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 0) {
      // This is likely a CORS error
      console.error('CORS Error:', error);
      throw new Error('CORS Error: Unable to access the server. Please ensure the server is configured to allow requests from this origin.');
    }
    return Promise.reject(error);
  }
);

// Export the HTTP-enforcing axios instance
export const mcpApiClient = httpAxios;

// Supported file types - Added 'img' as a valid type
export type FileType = 'agent' | 'mcp' | 'img';

// Common response interface
interface ApiResponse {
  success: boolean;
  message: string;
}

// File response interfaces
export interface FileUploadResponse extends ApiResponse {
  filepath?: string;
  filename?: string;
  download_url?: string;
}

export interface FileDownloadResponse extends ApiResponse {
  data?: Blob;
  filename?: string;
  content_type?: string;
}

export interface FileDetailsResponse extends ApiResponse {
  file_id?: string;
  filename?: string;
  file_type?: FileType;
  file_size?: number;
  created_at?: string;
  filepath?: string;
  download_url?: string;
}

export interface FileListResponse extends ApiResponse {
  files?: FileDetailsResponse[];
  total_count?: number;
  page?: number;
  page_size?: number;
}

// Execution response interfaces
export interface ExecutionResponse extends ApiResponse {
  execution_id?: string;
  stdout?: string;
  stderr?: string;
  exit_code?: number;
  runtime_ms?: number;
}

// JSON-RPC interfaces
export interface JsonRpcRequest {
  jsonrpc: string;
  method: string;
  params?: any;
  id: string | number;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0',
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: string | number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

// Execution parameters
export interface ExecutionParams {
  filepath: string;
  arguments?: string[];
  stdin_data?: string;
  timeout?: number;
  environment?: Record<string, string>;
}


/**
 * Lists all files of a specific type with pagination
 * @param fileType Type of files to list ('agent' or 'mcp')
 * @param params Pagination parameters
 */
export const listFiles = async (
  fileType?: FileType,
  params?: PaginationParams
): Promise<FileListResponse> => {
  try {
    const queryParams: Record<string, any> = { ...params };
    if (fileType) {
      queryParams.file_type = fileType;
    }

    const response = await httpAxios.get(API_CONFIG.ENDPOINTS.FILES, {
      params: queryParams
    });

    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        files: response.data.files,
        total_count: response.data.total_count,
        page: response.data.page,
        page_size: response.data.page_size,
        message: 'Files retrieved successfully'
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to retrieve files'
      };
    }
  } catch (error) {
    console.error('Error listing files:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to list files'
    };
  }
};

/**
 * Executes a remote procedure call on a file
 * @param fileType Type of file ('agent' or 'mcp')
 * @param filename Name of the file
 * @param method RPC method name
 * @param params Parameters for the RPC method
 * @param id Request ID (optional, defaults to timestamp)
 * @param timeout Optional timeout in seconds (default 30)
 */
export const executeRpc = async (
  fileType: FileType,
  filename: string,
  method: string,
  params?: any,
  id?: string | number,
  timeout: number = 30
): Promise<JsonRpcResponse> => {
  const requestId = id || Date.now();
  
  const rpcRequest: JsonRpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id: requestId
  };

  try {
    // Ensure base URL has no trailing slash
    const baseUrl = import.meta.env.VITE_AIO_MCP_API_URL.replace(/\/+$/, '');
    
    // Construct endpoint following FastAPI route pattern exactly
    const endpoint = `${baseUrl}/${fileType}/${encodeURIComponent(filename)}`;
    
    console.log('[executeRpc] Calling URL:', endpoint);
    console.log('[executeRpc] Request:', rpcRequest);

    const response = await httpAxios.post(endpoint, rpcRequest, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: {
        timeout: timeout
      }
    });

    if (!response.data) {
      throw new Error('Empty response received from server');
    }

    // Return the RPC response directly
    return response.data;
  } catch (error) {
    console.error('Error executing RPC:', error);
    
    // Construct error response in JSON-RPC format
    return {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: error instanceof Error ? error.message : 'RPC execution failed',
        data: error
      },
      id: requestId
    };
  }
};

