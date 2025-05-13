// Mock data
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
}

interface Repository {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

interface LLMModel {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
}

// New data types for form submissions
export interface AgentSubmission {
  name: string;
  description: string;
  author: string;
  gitRepo: string;
  homepage?: string;
  serverEndpoint?: string;
  inputParams?: string;
  outputExample?: string;
  imageUrl?: string;
  execFileUrl?: string;
  imagePath?: string;
  execFilePath?: string;
}

export interface MCPServerSubmission {
  name: string;
  description: string;
  author: string;
  gitRepo: string;
  homepage?: string;
  remoteEndpoint?: string;
  type: 'stdio' | 'http' | 'sse';
  communityBody?: string;
  // MCP capabilities
  resources: boolean;
  prompts: boolean; 
  tools: boolean;
  sampling: boolean;
}

export interface SubmissionResponse {
  success: boolean;
  id?: string;
  message: string;
  timestamp: number;
}

export interface UserAsset {
  id: string;
  name: string;
  type: 'agent' | 'server' | 'opensource';
  description: string;
  createdAt: number;
  usageCount: number;
}

export interface CallLog {
  id: string;
  assetId: string;
  assetName: string;
  assetType: 'agent' | 'server';
  calledAt: number;
  status: 'success' | 'failed';
  cyclesUsed: number;
}

export interface UserAssets {
  agents: UserAsset[];
  servers: UserAsset[];
  openSourceContributions: UserAsset[];
  callLogs: CallLog[];
}

export interface TokenReward {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
  claimed: boolean;
}

export interface UserTokens {
  balance: number;
  pendingRewards: number;
  rewardHistory: TokenReward[];
}

export interface ClaimResponse {
  success: boolean;
  amount: number;
  transactionId: string;
  message: string;
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  transactionsPerSecond: number;
  cyclesConsumed: number;
}

export interface AssetStats {
  totalAgents: number;
  totalServers: number;
  activeAgents: number;
  activeServers: number;
}

export interface DashboardStats {
  networkStats: NetworkStats;
  assetStats: AssetStats;
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    timestamp: number;
  }[];
  dailyActivity: {
    date: string;
    agents: number;
    servers: number;
  }[];
}

const MOCK_DELAY = 800; // ms

// Mock project data
const projects: Project[] = [
  {
    id: '1',
    title: 'Neural Interface',
    category: 'AI Projects',
    description: 'A revolutionary neural network interface for seamless human-machine interaction.',
  },
  {
    id: '2',
    title: 'Quantum OS',
    category: 'Open Source',
    description: 'Open-source distributed operating system with quantum computing capabilities.',
  },
  {
    id: '3',
    title: 'PaLM Assistant',
    category: 'LLM Demos',
    description: 'Conversational AI assistant powered by Google\'s PaLM architecture.',
  },
  // Add more projects as needed
];

// Mock repository data
const repositories: Repository[] = [
  {
    id: '1',
    name: 'aio-neural-interface',
    description: 'Neural network interface for seamless human-machine interaction.',
    stars: 325,
    forks: 87,
    language: 'Python',
  },
  {
    id: '2',
    name: 'quantum-os',
    description: 'Distributed operating system with quantum computing capabilities.',
    stars: 1243,
    forks: 352,
    language: 'Rust',
  },
  // Add more repositories as needed
];

// Mock LLM models
const llmModels: LLMModel[] = [
  {
    id: 'palm',
    name: 'PaLM',
    version: '2.0',
    capabilities: ['Text generation', 'Code generation', 'Translation'],
  },
  {
    id: 'llama',
    name: 'Llama',
    version: '2.0',
    capabilities: ['Text generation', 'Few-shot learning', 'Reasoning'],
  },
  {
    id: 'claude',
    name: 'Claude',
    version: '2.0',
    capabilities: ['Text generation', 'Summarization', 'Question answering'],
  },
  // Add more models as needed
];

// Mock user assets
const userAssets: UserAssets = {
  agents: [
    {
      id: 'agent-1',
      name: 'Code Assistant',
      type: 'agent',
      description: 'AI agent that helps with code completion and refactoring',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
      usageCount: 152
    },
    {
      id: 'agent-2',
      name: 'Data Analyzer',
      type: 'agent',
      description: 'Analyzes data sets and provides statistical insights',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
      usageCount: 87
    }
  ],
  servers: [
    {
      id: 'server-1',
      name: 'Memory Store',
      type: 'server',
      description: 'MCP server for storing and retrieving context memory',
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
      usageCount: 324
    }
  ],
  openSourceContributions: [
    {
      id: 'opensource-1',
      name: 'MCP Protocol',
      type: 'opensource',
      description: 'Contributions to the Model Context Protocol specification',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      usageCount: 0
    }
  ],
  callLogs: [
    {
      id: 'log-1',
      assetId: 'agent-1',
      assetName: 'Code Assistant',
      assetType: 'agent',
      calledAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      status: 'success',
      cyclesUsed: 1250000
    },
    {
      id: 'log-2',
      assetId: 'server-1',
      assetName: 'Memory Store',
      assetType: 'server',
      calledAt: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
      status: 'success',
      cyclesUsed: 750000
    },
    {
      id: 'log-3',
      assetId: 'agent-2',
      assetName: 'Data Analyzer',
      assetType: 'agent',
      calledAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
      status: 'failed',
      cyclesUsed: 500000
    }
  ]
};

// Mock token data
const userTokens: UserTokens = {
  balance: 2500,
  pendingRewards: 750,
  rewardHistory: [
    {
      id: 'reward-1',
      amount: 500,
      reason: 'Agent usage rewards',
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
      claimed: true
    },
    {
      id: 'reward-2',
      amount: 250,
      reason: 'Server hosting incentive',
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
      claimed: true
    },
    {
      id: 'reward-3',
      amount: 750,
      reason: 'Open source contribution bonus',
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
      claimed: false
    }
  ]
};

// Mock dashboard stats
const dashboardStats: DashboardStats = {
  networkStats: {
    totalNodes: 1247,
    activeNodes: 983,
    transactionsPerSecond: 453.2,
    cyclesConsumed: 893245789012
  },
  assetStats: {
    totalAgents: 384,
    totalServers: 156,
    activeAgents: 289,
    activeServers: 132
  },
  recentTransactions: [
    {
      id: 'tx-1',
      type: 'Agent Creation',
      amount: 100,
      timestamp: Date.now() - 2 * 60 * 60 * 1000 // 2 hours ago
    },
    {
      id: 'tx-2',
      type: 'Server Call',
      amount: 50,
      timestamp: Date.now() - 5 * 60 * 60 * 1000 // 5 hours ago
    },
    {
      id: 'tx-3',
      type: 'Token Transfer',
      amount: 1000,
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago
    }
  ],
  dailyActivity: [
    { date: '2023-05-01', agents: 145, servers: 78 },
    { date: '2023-05-02', agents: 156, servers: 82 },
    { date: '2023-05-03', agents: 132, servers: 75 },
    { date: '2023-05-04', agents: 168, servers: 90 },
    { date: '2023-05-05', agents: 189, servers: 95 },
    { date: '2023-05-06', agents: 176, servers: 88 },
    { date: '2023-05-07', agents: 210, servers: 102 }
  ]
};

// Helper to simulate async API calls
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// Basic API functions
export const getProjects = (): Promise<Project[]> => {
  return simulateApiCall(projects);
};

export const getProject = (id: string): Promise<Project | undefined> => {
  const project = projects.find(p => p.id === id);
  return simulateApiCall(project);
};

export const getRepositories = (): Promise<Repository[]> => {
  return simulateApiCall(repositories);
};

export const getRepository = (id: string): Promise<Repository | undefined> => {
  const repository = repositories.find(r => r.id === id);
  return simulateApiCall(repository);
};

export const getLLMModels = (): Promise<LLMModel[]> => {
  return simulateApiCall(llmModels);
};

export const generateLLMResponse = (modelId: string, prompt: string): Promise<string> => {
  // Simulate different model responses
  const responses: Record<string, string> = {
    'palm': `Here's a response from PaLM about "${prompt}"`,
    'llama': `Here's what Llama thinks about "${prompt}"`,
    'claude': `Claude has analyzed "${prompt}" and here's the response`,
  };
  
  const response = responses[modelId] || `No response generated for model: ${modelId}`;
  return simulateApiCall(response);
};

// New mock API functions for form submissions
export const submitAgent = async (
  agentData: AgentSubmission, 
  imageFile?: File, 
  execFile?: File
): Promise<SubmissionResponse> => {
  // In a real implementation, we would upload the files and get URLs
  // Then create the agent with references to these URLs
  
  // For mock purposes, we'll pretend we've stored the files and generate fake URLs
  const mockImageUrl = imageFile ? `https://example.com/images/${imageFile.name}` : undefined;
  const mockExecFileUrl = execFile ? `https://example.com/binaries/${execFile.name}` : undefined;
  
  // Create a timestamped ID
  const id = `agent-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Simulate a successful submission
  return simulateApiCall({
    success: true,
    id,
    message: 'Agent submitted successfully',
    timestamp: Date.now()
  });
};

export const submitMCPServer = async (
  serverData: MCPServerSubmission, 
  serverFile?: File
): Promise<SubmissionResponse> => {
  // Similar to submitAgent, in a real implementation, we would upload the file
  
  // For mock purposes, generate a fake URL
  const mockServerFileUrl = serverFile ? `https://example.com/server-files/${serverFile.name}` : undefined;
  
  // Log the protocol-specific data
  console.log('Protocol submission data:', {
    ...serverData,
    serverFileUrl: mockServerFileUrl
  });
  
  // Create a timestamped ID
  const id = `server-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Simulate a successful submission with protocol validation
  return simulateApiCall({
    success: true,
    id,
    message: 'MCP Server submitted successfully with AIO-MCP protocol compliance',
    timestamp: Date.now()
  });
};

// Functions for user dashboard
export const getUserAssets = async (userId: string): Promise<UserAssets> => {
  // In a real implementation, we would query the canisters for the user's assets
  console.log(`Fetching assets for user: ${userId}`);
  
  // For mock purposes, return the predefined user assets
  return simulateApiCall(userAssets);
};

export const getUserTokens = async (userId: string): Promise<UserTokens> => {
  // In a real implementation, we would query the token ledger canister
  console.log(`Fetching tokens for user: ${userId}`);
  
  // For mock purposes, return the predefined token data
  return simulateApiCall(userTokens);
};

export const claimTokens = async (
  userId: string, 
  walletAddress: string, 
  amount: number
): Promise<ClaimResponse> => {
  // In a real implementation, we would transfer tokens to the provided wallet
  console.log(`Claiming ${amount} tokens for user ${userId} to wallet ${walletAddress}`);
  
  // Simulate a successful claim
  return simulateApiCall({
    success: true,
    amount,
    transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    message: `Successfully claimed ${amount} tokens to ${walletAddress}`
  });
};

// Dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // In a real implementation, we would aggregate data from multiple canisters
  
  // For mock purposes, return the predefined dashboard stats
  return simulateApiCall(dashboardStats);
};
