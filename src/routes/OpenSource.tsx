import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, GitBranch, Star, GitFork } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProjectTag {
  name: string;
  icon?: string;
}

interface GitProject {
  project_name: string;
  summary: string;
  repo_url: string;
  image_url: string;
  tags: string[];
  stars?: number;
  forks?: number;
  lastUpdated?: string;
}

const projects: GitProject[] = [
  {
    project_name: "aio-pod",
    summary: "The aio-pod repository provides a streamlined virtual machine environment for deploying and managing AIO-MCP servers. It handles MCP executable files, sets permissions, and executes them securely using subprocesses. The project also includes test scripts and sample data to support development, validation, and lifecycle management of modular AI capabilities in the AIO-2030 ecosystem.",
    repo_url: "https://github.com/AIO-2030/aio-pod",
    image_url: "/lovable-uploads/e68cde0c-7e5a-48a4-a902-7cb133626cdd.png",
    tags: ["Agent Runtime", "VM", "MCP", "DevTools"],
    stars: 56,
    forks: 12,
    lastUpdated: "2025-04-12"
  },
  {
    project_name: "mcp_server_memory",
    summary: "mcp_server_memory is a lightweight Python-based MCP server that enables contextual memory management within the AIO-2030 protocol. It provides runtime memory context features, including file-based storage and retrieval, and is designed to support memory-aware AI agents. Developers can extend this base to implement persistent agent state and interaction history tracking.",
    repo_url: "https://github.com/AIO-2030/mcp_server_memory",
    image_url: "/lovable-uploads/e68cde0c-7e5a-48a4-a902-7cb133626cdd.png",
    tags: ["Memory", "Agent Context", "MCP", "Python"],
    stars: 72,
    forks: 26,
    lastUpdated: "2025-04-28"
  },
  {
    project_name: "mcp_voice_identify",
    summary: "mcp_voice_identify is an audio processing MCP Server offering voice recognition and transcription services. It supports audio input via file or base64 encoding and outputs structured results for downstream tasks. Designed for multimodal pipelines, it's compatible with AIO stdio/MCP protocols and includes test assets for verification.",
    repo_url: "https://github.com/AIO-2030/mcp_voice_identify",
    image_url: "/lovable-uploads/e68cde0c-7e5a-48a4-a902-7cb133626cdd.png",
    tags: ["Voice", "Speech", "Transcription", "Multimodal"],
    stars: 83,
    forks: 31,
    lastUpdated: "2025-05-01"
  },
  {
    project_name: "aio-base-frontend",
    summary: "aio-base-frontend serves as the foundational frontend framework for building user interfaces in the AIO-2030 ecosystem. It includes preconfigured templates, routing logic, environment setup, and integration patterns designed to work seamlessly with AI Agent backends and MCP protocol services. Ideal for building decentralized AI dashboards and interfaces.",
    repo_url: "https://github.com/AIO-2030/aio-base-frontend",
    image_url: "/lovable-uploads/e68cde0c-7e5a-48a4-a902-7cb133626cdd.png",
    tags: ["Frontend", "Web3 UI", "AIO Dashboard", "Vite+React"],
    stars: 124,
    forks: 47,
    lastUpdated: "2025-05-04"
  },
  {
    project_name: "univoice-agent",
    summary: "univoice-agent is the primary publishing layer of the Univoice project, an AI-driven voice protocol built for the AIO-2030 platform. This agent handles voice data pipeline integration, user-agent interaction orchestration, and supports developer workflows for speech processing, prompt tuning, and multimodal learning.",
    repo_url: "https://github.com/AIO-2030/univoice-agent",
    image_url: "/lovable-uploads/e68cde0c-7e5a-48a4-a902-7cb133626cdd.png",
    tags: ["Voice AI", "Prompt Learning", "Agent", "Univoice"],
    stars: 97,
    forks: 29,
    lastUpdated: "2025-04-19"
  },
  {
    project_name: "ic-oss-aio",
    summary: "ic-oss-aio is a decentralized object storage service built on the Internet Computer Protocol (ICP). Funded by the DFINITY Dev Grant, it provides open-source, on-chain file storage for the AIO-2030 ecosystem. It supports upload, fetch, and file pinning via smart contract-powered APIs with high resilience and scalability.",
    repo_url: "https://github.com/AIO-2030/ic-oss-aio",
    image_url: "/lovable-uploads/e68cde0c-7e5a-48a4-a902-7cb133626cdd.png",
    tags: ["Storage", "ICP", "Canister", "Web3 Infra"],
    stars: 142,
    forks: 53,
    lastUpdated: "2025-05-08"
  }
];

// Helper function to get the tag icon based on tag name
const getTagIcon = (tagName: string): React.ReactNode => {
  // Map common tag names to lucide icons - can be expanded based on requirements
  const tagIconMap: {[key: string]: React.ReactNode} = {
    "Agent Runtime": <span className="mr-1">⚙️</span>,
    "VM": <span className="mr-1">💻</span>,
    "MCP": <span className="mr-1">🧠</span>,
    "DevTools": <span className="mr-1">🛠️</span>,
    "Memory": <span className="mr-1">💾</span>,
    "Agent Context": <span className="mr-1">🔄</span>,
    "Python": <span className="mr-1">🐍</span>,
    "Voice": <span className="mr-1">🎤</span>,
    "Speech": <span className="mr-1">🗣️</span>,
    "Transcription": <span className="mr-1">📝</span>,
    "Multimodal": <span className="mr-1">🔀</span>,
    "Frontend": <span className="mr-1">🖥️</span>,
    "Web3 UI": <span className="mr-1">🌐</span>,
    "AIO Dashboard": <span className="mr-1">📊</span>,
    "Vite+React": <span className="mr-1">⚛️</span>,
    "Voice AI": <span className="mr-1">🔊</span>,
    "Prompt Learning": <span className="mr-1">📚</span>,
    "Agent": <span className="mr-1">🤖</span>,
    "Univoice": <span className="mr-1">🎙️</span>,
    "Storage": <span className="mr-1">💽</span>,
    "ICP": <span className="mr-1">⛓️</span>,
    "Canister": <span className="mr-1">📦</span>,
    "Web3 Infra": <span className="mr-1">🏗️</span>,
  };

  return tagIconMap[tagName] || null;
};

const ProjectCard: React.FC<{ project: GitProject }> = ({ project }) => {
  return (
    <Card className="mb-8 overflow-hidden transition-all hover:shadow-lg border-border/40">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={project.image_url} 
          alt={`${project.project_name} preview`}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{project.project_name}</CardTitle>
          <div className="flex items-center space-x-3 text-muted-foreground">
            <div className="flex items-center">
              <Star size={16} className="mr-1" />
              <span className="text-sm">{project.stars}</span>
            </div>
            <div className="flex items-center">
              <GitFork size={16} className="mr-1" />
              <span className="text-sm">{project.forks}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {project.summary}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center">
              {getTagIcon(tag)}
              {tag}
            </Badge>
          ))}
        </div>
        
        {project.lastUpdated && (
          <div className="flex items-center text-sm text-muted-foreground mt-4">
            <GitBranch size={14} className="mr-2" />
            Last updated: {project.lastUpdated}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t px-6 py-4 bg-secondary/10">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => window.open(project.repo_url, '_blank')}
        >
          <ExternalLink size={14} className="mr-2" />
          View on GitHub
        </Button>
      </CardFooter>
    </Card>
  );
};

const OpenSource: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Open Source Projects</h1>
        <p className="text-lg text-muted-foreground">
          Explore and contribute to the AIO-2030 ecosystem's core open-source projects.
          These repositories form the foundation of our decentralized AI agent network.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Want to contribute? All projects follow our open contribution guidelines.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.open('https://github.com/AIO-2030', '_blank')}
          className="mt-4"
        >
          <GitBranch size={16} className="mr-2" />
          View all repositories
        </Button>
      </div>
    </div>
  );
};

export default OpenSource;
