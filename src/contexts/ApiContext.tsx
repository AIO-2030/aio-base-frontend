import React, { createContext, useContext, ReactNode } from 'react';

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback: string): string => {
  return import.meta.env[name] || fallback;
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
  baseUrl: getEnvVar('VITE_AIO_MCP_FILE_URL', 'https://localhost:8001'),
  apiVersion: 'v1',
  rpcBaseUrl: getEnvVar('VITE_AIO_MCP_API_URL', 'https://localhost:8000'),
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
    return `${this.baseUrl}${this.endpoints.upload[type] || this.endpoints.upload.agent}`;
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