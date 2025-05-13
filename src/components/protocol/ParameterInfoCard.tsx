import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileJson, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
interface ParameterInfoCardProps {
  type: 'agent' | 'mcp';
}
const ParameterInfoCard = ({
  type
}: ParameterInfoCardProps) => {
  const isAgent = type === 'agent';
  return <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson size={18} />
          {isAgent ? 'Agent Parameter Reference' : 'MCP Server Parameter Reference'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <ArrowDownToLine className="text-primary" size={18} />
              Input Parameters
            </h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap bg-gray-800">
                {isAgent ? `{
  "jsonrpc": "2.0",
  "method": "agent_name::method_name",
  "inputs": [
    {
      "type": "text",
      "value": "Your input text here"
    },
    // Optional multimodal inputs
    {
      "type": "image",
      "value": "base64-encoded-image-data or URL"
    }
  ],
  "id": 1,
  "trace_id": "AIO-TR-20250326-0001"
}` : `{
  "jsonrpc": "2.0",
  "method": "mcp_server::resources.list",
  "params": {
    // Method-specific parameters
  },
  "id": 1,
  "trace_id": "AIO-TR-20250326-0001"
}`}
              </pre>
            </div>
          </div>
          
          <div className="bg-gray-800">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <ArrowUpFromLine className="text-primary" size={18} />
              Output Format
            </h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {isAgent ? `{
  "jsonrpc": "2.0",
  "id": 1,
  "trace_id": "AIO-TR-20250326-0001",
  "outputs": [
    {
      "type": "text",
      "value": "Processing result"
    },
    // Optional additional outputs
    {
      "type": "image",
      "value": "base64-encoded-image-data"
    }
  ]
}` : `{
  "jsonrpc": "2.0",
  "id": 1,
  "trace_id": "AIO-TR-20250326-0001",
  "result": {
    // Method-specific response
    "resources": [
      { "id": "doc-001", "title": "Document 1", "type": "pdf" }
    ]
  }
}`}
              </pre>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              {isAgent ? "Your agent must correctly parse input parameters and return output in the expected format to ensure proper integration with the AIO ecosystem." : "Your MCP server must conform to these parameter and response formats to ensure proper operation within the MCP ecosystem."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ParameterInfoCard;