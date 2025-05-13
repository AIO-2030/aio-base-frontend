
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AgentItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';
import { useAgentTesting } from '@/hooks/useAgentTesting';
import AgentCard from '@/components/agent/AgentCard';
import AgentCodeBlock from '@/components/agent/AgentCodeBlock';

interface AgentTestSectionProps {
  agent: AgentItem;
}

const AgentTestSection = ({ agent }: AgentTestSectionProps) => {
  const { inputData, setInputData, outputData, isExecuting, handleExecute } = useAgentTesting(agent);

  const example1 = `{
  "jsonrpc": "2.0",
  "method": "${agent.name}::process",
  "inputs": [
    {
      "type": "text",
      "value": "Analyze this document"
    }
  ],
  "id": 1,
  "trace_id": "example-1"
}`;

  const example2 = `{
  "jsonrpc": "2.0",
  "method": "${agent.name}::process",
  "inputs": [
    {
      "type": "text",
      "value": "Compare these two items"
    },
    {
      "type": "file",
      "value": "base64-encoded-file-data"
    }
  ],
  "id": 2,
  "trace_id": "example-2"
}`;

  return (
    <AgentCard 
      title="Test Agent" 
      description="Send inputs to the agent and see outputs in real-time"
    >
      <Tabs defaultValue="test">
        <TabsList className="mb-4">
          <TabsTrigger value="test">Test Agent</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="test" className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Input JSON (AIO Protocol Format)</label>
            <Textarea 
              value={inputData} 
              onChange={e => setInputData(e.target.value)} 
              className="font-mono text-sm"
              size="lg"
            />
          </div>
          
          <Button onClick={handleExecute} disabled={isExecuting} className="w-full">
            {isExecuting ? 'Executing...' : 'Execute Agent'}
          </Button>
          
          {outputData && (
            <div>
              <label className="text-sm font-medium mb-2 block">Output</label>
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-auto h-40 text-sm">
                {outputData}
              </pre>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="examples">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Example 1: Basic Text Input</h3>
              <AgentCodeBlock code={example1} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Example 2: Multiple Inputs</h3>
              <AgentCodeBlock code={example2} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AgentCard>
  );
};

export default AgentTestSection;
