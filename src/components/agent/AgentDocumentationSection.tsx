
import React from 'react';
import AgentCard from '@/components/agent/AgentCard';
import AgentSection from '@/components/agent/AgentSection';
import type { AgentItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';

interface AgentDocumentationSectionProps {
  agent: AgentItem;
}

// Function to truncate text to a specific word count
const truncateToWords = (text: string, wordCount: number): string => {
  const words = text.split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '...';
};

const AgentDocumentationSection = ({ agent }: AgentDocumentationSectionProps) => {
  return (
    <AgentCard title="Agent Documentation">
      <div className="space-y-6">
        <AgentSection title="About this Agent">
          <p className="text-muted-foreground">
            {truncateToWords(agent.description, 20)}
          </p>
        </AgentSection>
        
        <AgentSection title="Usage Instructions">
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Format your input according to the AIO protocol JSON-RPC 2.0 specification.</li>
            <li>Send the JSON input to the agent via stdin.</li>
            <li>Receive the JSON output from the agent via stdout.</li>
            <li>The agent will process each input and return corresponding outputs.</li>
          </ol>
        </AgentSection>
        
        <AgentSection title="Input Types Supported">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>text</strong>: Plain text input</li>
            <li><strong>file</strong>: Base64-encoded file data</li>
            <li><strong>image</strong>: Base64-encoded image data</li>
          </ul>
        </AgentSection>
        
        <AgentSection title="Output Types">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>text</strong>: Plain text results</li>
            <li><strong>file</strong>: Base64-encoded file data</li>
          </ul>
        </AgentSection>
      </div>
    </AgentCard>
  );
};

export default AgentDocumentationSection;
