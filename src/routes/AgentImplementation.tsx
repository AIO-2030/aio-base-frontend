
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Check, Upload, FileCode, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProtocolDetails from '@/components/protocol/ProtocolDetails';
import ParameterInfoCard from '@/components/protocol/ParameterInfoCard';

const AgentImplementation = () => {
  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <Link to="/home/agent-store" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Agent Implementation Guide</h1>
      </div>
      
      <ProtocolDetails type="agent" />
      
      <ParameterInfoCard type="agent" />
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Implementation Workflow</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <Terminal size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">1. Develop Your Agent</h3>
                <p className="text-muted-foreground">
                  Create an executable that can process JSON-RPC formatted inputs via stdin/stdout. 
                  Your agent should follow the AIO protocol specifications.
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>Support for JSON-RPC 2.0 format</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>Proper handling of namespaced methods</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>Support for trace_id propagation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileCode size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">2. Test Your Agent Locally</h3>
                <p className="text-muted-foreground">
                  Verify that your agent correctly processes inputs and produces outputs according to the protocol specification.
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md mt-3">
                  <code className="text-sm whitespace-pre">
                    {`echo '{"jsonrpc":"2.0","method":"agent::method","inputs":[{"type":"text","value":"test"}],"id":1,"trace_id":"test-123"}' | ./your_agent`}
                  </code>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <PenTool size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">3. Fill Out Agent Information</h3>
                <p className="text-muted-foreground">
                  Add metadata about your agent including name, description, and example inputs/outputs
                  to help users understand how to use it.
                </p>
                <div className="mt-3">
                  <Button variant="outline" asChild>
                    <Link to="/home/add-agent">Add Agent Information</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <Upload size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">4. Upload Your Agent</h3>
                <p className="text-muted-foreground">
                  Upload your agent executable. The file name <strong>must match</strong> your agent name. 
                  The executable will be stored in a dedicated directory on our servers.
                </p>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                  <strong>Important:</strong> The executable file must be compiled for Linux and have appropriate permissions (chmod +x).
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button asChild>
          <Link to="/home/add-agent">Add Your Agent</Link>
        </Button>
      </div>
    </div>
  );
};

export default AgentImplementation;
