import React, { createContext, useContext, ReactNode } from 'react';

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback: string): string => {
  return import.meta.env[name] || fallback;
};

// Check if running in production environment
const isProduction = () => {
  return import.meta.env.PROD || window.location.protocol === 'https:';
};

interface ApiConfig {
  baseUrl: string;
  apiVersion: string;
  rpcBaseUrl: string;
  endpoints: {
    upload: {
      mcp: string;
      agent: string;
      img: string;
    };
    rpc: string;
    files: string;
  };
  headers: {
    'Accept': string;
    'Content-Type'?: string;
  };
  getFullUploadUrl: (type: 'mcp' | 'agent' | 'img') => string;
}

export const SERVER_PATHS = {
  AGENT_EXEC_DIR: '/opt/aio/agents',
  MCP_EXEC_DIR: '/opt/aio/mcp-servers',
  AGENT_IMAGE_DIR: '/opt/aio/agent-images',
};

const defaultConfig: ApiConfig = {
  baseUrl: isProduction() 
    ? 'https://mcp.univoices.club/api/v1'  // Production environment uses remote file service with HTTPS
    : getEnvVar('VITE_AIO_MCP_FILE_URL', 'https://mcp.univoices.club/api/v1'),  // Development also uses HTTPS
  apiVersion: 'v1',
  rpcBaseUrl: isProduction()
    ? 'https://mcp.univoices.club/api/v1/rpc'  // Production environment uses remote MCP service with HTTPS
    : getEnvVar('VITE_AIO_MCP_API_URL', 'https://mcp.univoices.club/api/v1/rpc'),  // Development also uses HTTPS
  endpoints: {
    upload: {
      mcp: '/upload/mcp',
      agent: '/upload/agent',
      img: '/upload/img'
    },
    rpc: '/api/v1',
    files: '/files',
  },
  headers: {
    'Accept': 'application/json'
  },
  getFullUploadUrl(type: 'mcp' | 'agent' | 'img'): string {
    // Use direct upload URL format: https://mcp.univoices.club/upload/{type}
    const uploadBaseUrl = isProduction() 
      ? 'https://mcp.univoices.club/upload'
      : getEnvVar('VITE_FILE_SERVICE_URL', 'https://mcp.univoices.club/upload');
    return `${uploadBaseUrl}/${type}`;
  }
};

const ApiContext = createContext<ApiConfig>(defaultConfig);

interface ApiProviderProps {
  children: ReactNode;
  config?: Partial<ApiConfig>;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children, config = {} }) => {
  const mergedConfig = { ...defaultConfig, ...config };
  return (
    <ApiContext.Provider value={mergedConfig}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Mock API utilities
export const setUseMockApi = (usesMock: boolean): void => {
  localStorage.setItem('useMockApi', usesMock.toString());
};

export const isUsingMockApi = (): boolean => {
  return localStorage.getItem('useMockApi') === 'true';
}; 