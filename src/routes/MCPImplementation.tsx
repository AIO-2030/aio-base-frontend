
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Server, Check, Upload, FileJson, PenTool, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProtocolDetails from '@/components/protocol/ProtocolDetails';
import ParameterInfoCard from '@/components/protocol/ParameterInfoCard';

const MCPImplementation = () => {
  return <div className="py-8 px-4 max-w-full">
      <div className="flex items-center mb-8">
        <Link to="/home/mcp-store" className="mr-4 flex-shrink-0">
          <Button variant="outline" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">MCP Server Implementation Guide</h1>
      </div>
      
      <ProtocolDetails type="mcp" />
      
      <ParameterInfoCard type="mcp" />
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Implementation Workflow</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Server size={24} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-medium text-lg">1. Develop Your MCP Server</h3>
                <p className="text-muted-foreground">
                  Create an executable that implements the MCP protocol modules: resources, prompts, tools, and sampling.
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Resources module (resources.list, resources.get)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Prompts module (prompts.list, prompts.get)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Tools module (tools.list, tools.call)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Sampling module (sampling.start, sampling.step)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Mic size={24} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-medium text-lg">Additional: Voice Processing Capabilities</h3>
                <p className="text-muted-foreground">
                  EMC Network also supports voice transcription through dedicated endpoints.
                </p>
                <div className="p-3 rounded-md mt-3 bg-gray-800 overflow-x-auto">
                  <code className="text-sm whitespace-pre text-break">
{`curl -X POST http://18.167.51.1:40005/edge/16Uiu2HAmQnkL58V215wZUDCLBTxeUQZeCXUwzPZKLAQKyvBQ7c3a/8003/extract_text \\
  -H 'Authorization: Bearer 833_txLiSbJibu160317539183112192' \\
  -F 'file=@recording.mp3'`}
                  </code>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <FileJson size={24} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-medium text-lg">2. Test Your MCP Server Locally</h3>
                <p className="text-muted-foreground">
                  Verify that your server correctly handles MCP protocol requests and produces conformant responses.
                </p>
                <div className="p-3 rounded-md mt-3 bg-gray-800 overflow-x-auto">
                  <code className="text-sm whitespace-pre text-break">
                    {`echo '{"jsonrpc":"2.0","method":"server::resources.list","params":{},"id":1,"trace_id":"test-123"}' | ./your_mcp_server`}
                  </code>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <PenTool size={24} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-medium text-lg">3. Fill Out MCP Server Information</h3>
                <p className="text-muted-foreground">
                  Add metadata about your MCP server including name, description, entities, relations, and observations
                  to help users understand its capabilities.
                </p>
                <div className="mt-3">
                  <Button variant="outline" asChild>
                    <Link to="/home/add-mcp-server">Add MCP Server Information</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Upload size={24} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-medium text-lg">4. Upload Your MCP Server</h3>
                <p className="text-muted-foreground">
                  Upload your MCP server executable. The file name <strong>must match</strong> your MCP server name. 
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
          <Link to="/home/add-mcp-server">Add Your MCP Server</Link>
        </Button>
      </div>
    </div>;
};

export default MCPImplementation;
