
import React from 'react';
import { FileCode, Terminal, Download } from 'lucide-react';
import AgentCard from '@/components/agent/AgentCard';
import AgentProperty from '@/components/agent/AgentProperty';
import AgentActionButton from '@/components/agent/AgentActionButton';
import type { AgentItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';
import { Link } from 'react-router-dom';

interface AgentInfoCardProps {
  agent: AgentItem;
}

const AgentInfoCard = ({ agent }: AgentInfoCardProps) => {
  return (
    <AgentCard 
      title="Agent Information" 
      description="AIO Protocol v1.2 Compatible"
    >
      <div className="space-y-4">
        <AgentProperty label="Author">
          {agent.author}
        </AgentProperty>
        
        <AgentProperty label="Version">
          {agent.version || '1.0.0'}
        </AgentProperty>
        
        {agent.git_repo && (
          <AgentProperty label="Repository">
            <a 
              href={agent.git_repo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {agent.git_repo}
            </a>
          </AgentProperty>
        )}
        
        {agent.homepage.length > 0 && (
          <AgentProperty label="Homepage">
            <a 
              href={agent.homepage[0]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {agent.homepage[0]}
            </a>
          </AgentProperty>
        )}
        
        <div className="pt-2">
          <AgentProperty label="Actions">
            <div className="flex flex-wrap gap-2 pt-2">
              {agent.git_repo && (
                <Link to={agent.git_repo} target="_blank" rel="noopener noreferrer">
                  <AgentActionButton icon={FileCode}>
                    View Source
                  </AgentActionButton>
                </Link>
              )}
              
              <AgentActionButton icon={Terminal} onClick={() => console.log('View logs clicked')}>
                View Logs
              </AgentActionButton>
              
              {agent.exec_file_url.length > 0 && (
                <Link to={agent.exec_file_url[0]} target="_blank" rel="noopener noreferrer">
                  <AgentActionButton icon={Download}>
                    Download
                  </AgentActionButton>
                </Link>
              )}
            </div>
          </AgentProperty>
        </div>
      </div>
    </AgentCard>
  );
};

export default AgentInfoCard;
