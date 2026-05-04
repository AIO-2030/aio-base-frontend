import axios, { AxiosHeaders } from 'axios';

// Core API configuration and utilities

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback: string): string => {
  const value = import.meta.env[name] || fallback;
  return value.replace(/\/+$/, ''); // Remove trailing slashes
};

// Check if running in production environment
const isProduction = () => {
  return import.meta.env.PROD || window.location.protocol === 'https:';
};

// Configure axios defaults
const axiosInstance = axios.create({
  timeout: 300000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'  // Default to JSON for RPC calls
  }
});

// Configure axios to accept self-signed certificates
axiosInstance.interceptors.request.use((config) => {
  return {
    ...config,
    httpsAgent: {
      rejectUnauthorized: false
    }
  };
});

// Export the configured axios instance
export { axiosInstance };

// API Base URL configuration
export const API_CONFIG = {
  // Use complete URLs from environment variables - both dev and prod use HTTPS
  BASE_URL: isProduction() 
    ? 'https://mcp.univoices.club/api/v1'  // Production environment uses remote file service with HTTPS
    : getEnvVar('VITE_AIO_MCP_FILE_URL', 'https://mcp.univoices.club/api/v1'),  // Development also uses HTTPS
  API_VERSION: 'v1',
  get FULL_BASE_URL() {
    return this.BASE_URL;
  },
  get RPC_BASE_URL() {
    return isProduction()
      ? 'https://mcp.univoices.club/api/v1/rpc'  // Production environment uses remote MCP service with HTTPS
      : getEnvVar('VITE_AIO_MCP_API_URL', 'https://mcp.univoices.club/api/v1/rpc');  // Development also uses HTTPS
  },
  ENDPOINTS: {
    UPLOAD: {
      MCP: '/upload/mcp',
      AGENT: '/upload/agent',
      IMG: '/upload/img'
    },
    RPC: '',  // Keep empty as we construct full path in executeRpc
    FILES: '/files',
  },
  HEADERS: {
    JSON_RPC: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    UPLOAD: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }
  },
  getFullUploadUrl(type: 'mcp' | 'agent' | 'img'): string {
    // Use direct upload URL format: https://mcp.univoices.club/upload/{type}
    const uploadBaseUrl = isProduction() 
      ? 'https://mcp.univoices.club/upload'
      : getEnvVar('VITE_FILE_SERVICE_URL', 'https://mcp.univoices.club/upload');
    return `${uploadBaseUrl}/${type}`;
  }
};

// Flag to toggle between mock API and real ICP Canister calls
export const setUseMockApi = (usesMock: boolean): void => {
  localStorage.setItem('useMockApi', usesMock.toString());
};

export const isUsingMockApi = (): boolean => {
  return localStorage.getItem('useMockApi') === 'true';
};

// Define the server-side directories where executables will be stored
export const SERVER_PATHS = {
  AGENT_EXEC_DIR: '/opt/aio/agents',
  MCP_EXEC_DIR: '/opt/aio/mcp-servers',
  AGENT_IMAGE_DIR: '/opt/aio/agent-images',
};
