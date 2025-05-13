
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Terminal, FileCode } from 'lucide-react';

interface ProtocolStepProps {
  number: number;
  title: string;
  description: string;
  codeExample?: string;
}

const ProtocolStep = ({ number, title, description, codeExample }: ProtocolStepProps) => (
  <div className="mb-6">
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 text-primary font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground mb-3">{description}</p>
        {codeExample && (
          <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto mb-2">
            <pre className="text-sm"><code>{codeExample}</code></pre>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface ProtocolDetailsProps {
  type: 'agent' | 'mcp';
}

const ProtocolDetails = ({ type }: ProtocolDetailsProps) => {
  const isAgent = type === 'agent';
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{isAgent ? 'AIO' : 'MCP'} Protocol Implementation Guide</CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            v1.2.1
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isAgent 
              ? 'Follow these steps to create an AIO-compatible Agent that can be invoked via stdio mode:'
              : 'Follow these steps to create an MCP Server that can be integrated with the protocol:'}
          </p>
        </div>
        
        {isAgent ? (
          // Agent Protocol Steps
          <>
            <ProtocolStep 
              number={1}
              title="Create an executable file with stdio support"
              description="Your agent must read input from stdin and write output to stdout. Make sure your executable has the proper permissions."
              codeExample={"#!/usr/bin/env node\n\nprocess.stdin.setEncoding('utf-8');\n\nprocess.stdin.on('data', (data) => {\n  const input = JSON.parse(data.toString());\n  // Process the input\n  const output = { result: 'Processed: ' + input.value };\n  console.log(JSON.stringify(output));\n});"}
            />
            
            <ProtocolStep 
              number={2}
              title="Handle JSON-RPC formatted requests"
              description="Your agent should be able to parse and respond to JSON-RPC requests with the specified method format."
              codeExample={"// Input format\n{\n  \"jsonrpc\": \"2.0\",\n  \"method\": \"agent_name::method_name\",\n  \"inputs\": [...],\n  \"id\": 1,\n  \"trace_id\": \"AIO-TR-20250326-0001\"\n}\n\n// Output format\n{\n  \"jsonrpc\": \"2.0\",\n  \"id\": 1,\n  \"trace_id\": \"AIO-TR-20250326-0001\",\n  \"outputs\":[...]\n}"}
            />
            
            <ProtocolStep 
              number={3}
              title="Support multimodal inputs and outputs"
              description="Your agent should be able to process various input types and produce multimodal outputs as needed."
              codeExample={"// Example multimodal output\n{\n  \"outputs\": [\n    {\n      \"type\": \"text\",\n      \"value\": \"Analysis complete.\"\n    },\n    {\n      \"type\": \"image\",\n      \"value\": \"base64-encoded-image-data\"\n    }\n  ]\n}"}
            />
            
            <ProtocolStep 
              number={4}
              title="Package and upload your agent"
              description="Name your executable file the same as your agent name. The executable will be stored in a dedicated directory on the server."
            />
          </>
        ) : (
          // MCP Protocol Steps
          <>
            <ProtocolStep 
              number={1}
              title="Implement core MCP interfaces"
              description="Your MCP server must implement the required interfaces: resources, prompts, tools, and sampling."
              codeExample={"// MCP modules and methods\nresources.list, resources.get\nprompts.list, prompts.get\ntools.list, tools.call\nsampling.start, sampling.step"}
            />
            
            <ProtocolStep 
              number={2}
              title="Support namespaced method calls"
              description="All method calls use the namespace format for consistent invocation across the ecosystem."
              codeExample={"// Method call format\n{\n  \"method\": \"mcp_server::resources.list\",\n  \"params\": {...}\n}\n\n// Tool call example\n{\n  \"method\": \"math_agent::tools.call\",\n  \"params\": {\n    \"tool\": \"calculate_area\",\n    \"args\": { \"x\": 3, \"y\": 4 }\n  }\n}"}
            />
            
            <ProtocolStep 
              number={3}
              title="Implement trace_id support"
              description="Your server should properly handle and propagate trace_id for request tracking and accounting."
              codeExample={"// Trace structure\n{\n  \"trace_id\": \"AIO-TR-20250326-0001\",\n  \"id\": 2,\n  \"protocol\": \"mcp\",\n  \"agent\": \"summarizer\",\n  \"type\": \"mcp\",\n  \"method\": \"summarizer::sampling.start\",\n  \"inputs\": [...],\n  \"outputs\": [...],\n  \"status\": \"ok\"\n}"}
            />
            
            <ProtocolStep 
              number={4}
              title="Package and upload your MCP server"
              description="Name your executable file the same as your MCP server name. The executable will be stored in a dedicated directory on the server."
            />
          </>
        )}

        <div className="flex justify-end mt-4">
          <div className="flex items-center text-primary gap-1 text-sm">
            <span>{isAgent ? 'View full AIO protocol documentation' : 'View full MCP protocol documentation'}</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtocolDetails;
