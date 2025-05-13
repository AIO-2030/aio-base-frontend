import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Server, FileCode, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMcpItemByName } from '@/services/can/mcpOperations';
import { executeRpc } from '@/services/ExecFileCommonBuss';
import { useAioProtocol } from '@/hooks/useAioProtocal';
import type { McpItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';

const log = (area: string, message: string, data?: any) => {
  if (data) {
    console.log(`[MCPServerDetails][${area}] ${message}`, data);
  } else {
    console.log(`[MCPServerDetails][${area}] ${message}`);
  }
};

const MCPServerDetails = () => {
  log('INIT', 'Component initializing');
  const params = useParams();
  log('PARAMS', 'All URL parameters', params);

  const { id } = useParams<{ id: string }>();
  log('PARAM', 'Received server name param', id);

  const { toast } = useToast();
  const [mcpServer, setMcpServer] = useState<McpItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [moduleTypes, setModuleTypes] = useState<string[]>(['start', 'help']);
  const [selectedModuleType, setSelectedModuleType] = useState('start');
  const [methodName, setMethodName] = useState('list');
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const serverNameParam = id || '';
  const { 
    description: aioDescription, 
    isLoading: aioLoading, 
    error: aioError,
    capabilityTags,
    functionalKeywords,
    methodsList,
    formatScenarioText
  } = useAioProtocol(serverNameParam);

  useEffect(() => {
    log('FETCH', 'Starting to fetch MCP server data');

    const fetchMcpServer = async () => {
      if (!id) {
        log('FETCH', 'No server name provided, skipping fetch');
        return;
      }

      try {
        log('FETCH', 'Setting loading state to true');
        setLoading(true);

        log('FETCH', `Calling getMcpItemByName with name: ${id}`);
        const serverData = await getMcpItemByName(id);

        if (serverData) {
          log('FETCH', 'Server data received successfully', serverData);
          setMcpServer(serverData);

          const availableModules = ['start', 'help'];
          
          if (serverData.resources) {
            availableModules.push('resources');
          }
          if (serverData.prompts) {
            availableModules.push('prompts');
          }
          if (serverData.tools) {
            availableModules.push('tools');
          }
          if (serverData.sampling) {
            availableModules.push('sampling');
          }
          
          log('MODULE', 'Setting available module types', availableModules);
          setModuleTypes(availableModules);

          if (serverData.resources) {
            log('MODULE', 'Server supports resources module, initializing');
            setSelectedModuleType('resources');
            updateMethodAndInput('resources', 'help', serverData.name);
            updateMethodAndInput('sampling', 'start', serverData.name);
            updateMethodAndInput('resources', 'list', serverData.name);
          } else if (serverData.prompts) {
            log('MODULE', 'Server supports prompts module, initializing');
            setSelectedModuleType('prompts');
            updateMethodAndInput('prompts', 'help', serverData.name);
            updateMethodAndInput('sampling', 'start', serverData.name);
            updateMethodAndInput('prompts', 'list', serverData.name);
          } else if (serverData.tools) {
            log('MODULE', 'Server supports tools module, initializing');
            setSelectedModuleType('tools');
            updateMethodAndInput('tools', 'help', serverData.name);
            updateMethodAndInput('sampling', 'start', serverData.name);
            updateMethodAndInput('tools', 'list', serverData.name);
          } else if (serverData.sampling) {
            log('MODULE', 'Server supports sampling module, initializing');
            setSelectedModuleType('sampling');
            updateMethodAndInput('sampling', 'help', serverData.name);
            updateMethodAndInput('sampling', 'start', serverData.name);
          } else {
            log('MODULE', 'No supported modules found on server, using default');
            setSelectedModuleType('start');
            updateMethodAndInput('start', 'help', serverData.name);
          }
        } else {
          log('FETCH', 'Server data not found', { id });
          toast({
            title: "Server not found",
            description: `No MCP server found with name ${id}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        log('FETCH', 'Error fetching MCP server data', error);
        console.error("Error fetching MCP server:", error);
        toast({
          title: "Error fetching server",
          description: "Failed to load MCP server details",
          variant: "destructive"
        });
      } finally {
        log('FETCH', 'Setting loading state to false');
        setLoading(false);
      }
    };

    fetchMcpServer();

    return () => {
      log('CLEANUP', 'Component unmounting');
    };
  }, [id, toast]);

  const updateMethodAndInput = (module: string, method: string, serverName: string = id || 'unknown-server') => {
    log('UPDATE', `Updating method and input: module=${module}, method=${method}, serverName=${serverName}`);

    setSelectedModuleType(module);
    setMethodName(method);

    const fullMethod = `${module}.${method}`;

    log('UPDATE', `Creating input data for ${fullMethod}`);

    let defaultParams = {};
    if (module === 'start') {
      log('UPDATE', 'Using start module template with port and memory_path');
      defaultParams = {
        port: 8080,
        memory_path: "./memory.json"
      };
    } else if (module === 'help') {
      log('UPDATE', 'Using help module template with minimal params');
      defaultParams = {};
    } else if (method === 'call') {
      log('UPDATE', 'Using call method template with tool params');
      defaultParams = {
        tool: 'example',
        args: {
          param1: "value1"
        }
      };
    } else if (method === 'get') {
      log('UPDATE', 'Using get method template with id param');
      defaultParams = {
        id: "example-id"
      };
    } else if (method === 'start' && module === 'sampling') {
      log('UPDATE', 'Using sampling start method template');
      defaultParams = {
        prompt: "Example prompt for sampling"
      };
    } else if (method === 'step') {
      log('UPDATE', 'Using sampling step method template');
      defaultParams = {
        sampling_id: "sampling-001"
      };
    } else {
      log('UPDATE', 'Using default empty params for list/help methods');
    }

    const requestId = Date.now();
    const traceId = `test-${requestId}`;

    let inputJson;
    
    if (module === 'start') {
      inputJson = {
        jsonrpc: "2.0",
        method: "start",
        id: requestId,
        params: defaultParams
      };
    } else if (module === 'help') {
      inputJson = {
        jsonrpc: "2.0",
        method: "help",
        id: requestId
      };
    } else {
      const currentServerName = mcpServer?.name || serverName;
      inputJson = {
        jsonrpc: "2.0",
        method: `${currentServerName}::${fullMethod}`,
        params: defaultParams,
        id: requestId,
        trace_id: traceId
      };
    }

    log('UPDATE', 'Setting input data', inputJson);
    setInputData(JSON.stringify(inputJson, null, 2));
  };

  const handleExecute = async () => {
    log('EXECUTE', 'Starting execution', { selectedModuleType, methodName });
    setIsLoading(true);
  
    try {
      const currentInputData = inputData.trim();
      
      if (!currentInputData) {
        log('EXECUTE', 'Empty input data');
        toast({
          title: "Empty input",
          description: "Please enter JSON input data",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      let inputJson;
      try {
        inputJson = JSON.parse(currentInputData);
      } catch (error) {
        log('EXECUTE', 'Error parsing input JSON', error);
        toast({
          title: "Invalid JSON",
          description: "Please enter valid JSON input",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
  
      const { method, params, id: requestId } = inputJson;
      
      log('EXECUTE', `Calling executeRpc with method: ${method}`, { params, requestId });
      
      const currentServerName = mcpServer?.name || id || 'unknown-server';
      const response = await executeRpc(
        'mcp',
        currentServerName,
        method,
        params,
        requestId
      );
      
      log('EXECUTE', 'Received response from server', response);
      
      if (response.error) {
        log('EXECUTE', 'Error in RPC response', response.error);
        toast({
          title: "Error executing MCP request",
          description: response.error.message || "Unknown error occurred",
          variant: "destructive"
        });
      } else {
        log('EXECUTE', 'RPC executed successfully', response.result);
        toast({
          title: "MCP Server executed successfully",
          description: `${selectedModuleType}.${methodName} executed successfully`
        });
      }
      
      setOutputData(JSON.stringify(response, null, 2));
    } catch (error) {
      log('EXECUTE', 'Exception executing RPC', error);
      console.error("Error executing MCP RPC:", error);
      
      const errorResponse = {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : "Internal error",
        },
        id: Date.now()
      };
      
      setOutputData(JSON.stringify(errorResponse, null, 2));
      
      toast({
        title: "Error executing MCP request",
        description: error instanceof Error ? error.message : "Failed to execute MCP request",
        variant: "destructive"
      });
    } finally {
      log('EXECUTE', 'Setting isLoading to false');
      setIsLoading(false);
    }
  };

  if (loading) {
    log('RENDER', 'Rendering loading state');
    return (
      <div className="py-8 px-4">
        <div className="flex items-center mb-8">
          <Link to="/home/mcp-store" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Loading MCP Server...</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const serverName = mcpServer?.name || id || 'unknown-server';
  log('RENDER', `Rendering details for server: ${serverName}`);

  return (
    <div className="py-8 px-4">
      <div className="flex items-center mb-8">
        <Link to="/home/mcp-store" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{serverName}</h1>
      </div>

      <div className="flex flex-col gap-8 mb-8">
        <Card className="w-full bg-card/50">
          <CardHeader>
            <CardTitle>MCP Server Information</CardTitle>
            <CardDescription>
              {aioLoading 
                ? "Loading AIO protocol information..." 
                : aioError 
                  ? "Unable to load AIO protocol description" 
                  : aioDescription || "Get more diagnostic information about the URL parameters. Handle missing parameters gracefully with clear user feedback."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mcpServer && (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2">Details</h3>
                  <div className="space-y-2 text-sm grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-muted-foreground">Author:</span>
                    <span>{mcpServer.author}</span>
                    <span className="text-muted-foreground">Type:</span>
                    <span>{mcpServer.mcp_type}</span>
                    {mcpServer.remote_endpoint && (
                      <>
                        <span className="text-muted-foreground">Endpoint:</span>
                        <span className="truncate">{mcpServer.remote_endpoint}</span>
                      </>
                    )}
                  </div>
                </div>

                {capabilityTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {capabilityTags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {functionalKeywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {functionalKeywords.map((keyword, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium mb-2">Module Support</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${mcpServer.resources ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${mcpServer.prompts ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Prompts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${mcpServer.tools ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${mcpServer.sampling ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Sampling</span>
                    </div>
                  </div>
                </div>

                {mcpServer.git_repo && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Repository</h3>
                    <a
                      href={mcpServer.git_repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline break-all"
                    >
                      {mcpServer.git_repo}
                    </a>
                  </div>
                )}
              </>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <FileCode size={14} />
                  View Source
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Server size={14} />
                  View Status
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download size={14} />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Test MCP Server</CardTitle>
            <CardDescription>
              Send MCP protocol requests to the server and receive responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="test">
              <TabsList className="mb-4">
                <TabsTrigger value="test">Test Server</TabsTrigger>
              </TabsList>

              <TabsContent value="test" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Module</label>
                    <Select
                      value={selectedModuleType}
                      onValueChange={value => updateMethodAndInput(value, methodName, serverName)}
                      disabled={!mcpServer}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        {moduleTypes.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module.charAt(0).toUpperCase() + module.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Method</label>
                    <Select
                      value={methodName}
                      onValueChange={value => updateMethodAndInput(selectedModuleType, value, serverName)}
                      disabled={!mcpServer}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedModuleType === 'start' && (
                          <SelectItem value="help">start</SelectItem>
                        )}
                        {selectedModuleType === 'help' && (
                          <SelectItem value="list">help</SelectItem>
                        )}
                        {selectedModuleType === 'resources' && <>
                          <SelectItem value="list">resources.list</SelectItem>
                          <SelectItem value="get">resources.get</SelectItem>
                          <SelectItem value="help">resources.help</SelectItem>
                        </>}
                        {selectedModuleType === 'prompts' && <>
                          <SelectItem value="list">prompts.list</SelectItem>
                          <SelectItem value="get">prompts.get</SelectItem>
                          <SelectItem value="help">prompts.help</SelectItem>
                        </>}
                        {selectedModuleType === 'tools' && <>
                          <SelectItem value="list">tools.list</SelectItem>
                          <SelectItem value="call">tools.call</SelectItem>
                          <SelectItem value="help">tools.help</SelectItem>
                        </>}
                        {selectedModuleType === 'sampling' && <>
                          <SelectItem value="start">sampling.start</SelectItem>
                          <SelectItem value="step">sampling.step</SelectItem>
                          <SelectItem value="help">sampling.help</SelectItem>
                        </>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Input JSON (MCP Protocol Format)</label>
                  <Textarea
                    value={inputData}
                    onChange={e => setInputData(e.target.value)}
                    className="font-mono text-sm h-40"
                    disabled={!mcpServer}
                  />
                </div>

                <Button
                  onClick={handleExecute}
                  disabled={isLoading || !mcpServer}
                  className="w-full"
                >
                  {isLoading ? 'Executing...' : 'Execute MCP Request'}
                </Button>

                {outputData && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Output</label>
                    <pre 
                      className="bg-slate-900 text-white/90 p-4 rounded-md overflow-auto h-40 text-sm font-mono border border-slate-700 shadow-md"
                    >
                      {outputData}
                    </pre>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MCP Server Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">About this MCP Server</h3>
            <p className="text-muted-foreground">
              {mcpServer?.community_body || aioDescription ||
                "This MCP server implements the MCP protocol specification v1.2, providing access to resources, prompts, tools, and sampling capabilities. It communicates via standard input/output (stdio) using JSON-RPC 2.0 format with MCP protocol extensions."}
            </p>
          </div>

          {methodsList.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Supported Methods</h3>
              <div className="overflow-auto max-h-60">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Method</th>
                      <th className="text-left py-2 px-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-muted-foreground">
                    {methodsList.map((method, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-2 font-medium">{method.name}</td>
                        <td className="py-2 px-2">{method.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Usage Scenarios</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {formatScenarioText()}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Usage Instructions</h3>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
              <li>Format your request according to the MCP protocol JSON-RPC 2.0 specification.</li>
              <li>Send the JSON request to the MCP server via stdin.</li>
              <li>Receive the JSON response from the server via stdout.</li>
              <li>Use the appropriate module and method for your specific task.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Module Capabilities</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Module</th>
                  <th className="text-left py-2 px-2">Description</th>
                  <th className="text-left py-2 px-2">Methods</th>
                </tr>
              </thead>
              <tbody className="text-sm text-muted-foreground">
                <tr className={`border-b ${!mcpServer?.resources ? 'opacity-50' : ''}`}>
                  <td className="py-2 px-2 font-medium">resources</td>
                  <td className="py-2 px-2">Manage and access resource objects</td>
                  <td className="py-2 px-2">list, get</td>
                </tr>
                <tr className={`border-b ${!mcpServer?.prompts ? 'opacity-50' : ''}`}>
                  <td className="py-2 px-2 font-medium">prompts</td>
                  <td className="py-2 px-2">Manage prompt templates</td>
                  <td className="py-2 px-2">list, get</td>
                </tr>
                <tr className={`border-b ${!mcpServer?.tools ? 'opacity-50' : ''}`}>
                  <td className="py-2 px-2 font-medium">tools</td>
                  <td className="py-2 px-2">Access utility functions and tools</td>
                  <td className="py-2 px-2">list, call</td>
                </tr>
                <tr className={`border-b ${!mcpServer?.sampling ? 'opacity-50' : ''}`}>
                  <td className="py-2 px-2 font-medium">sampling</td>
                  <td className="py-2 px-2">Generate content via sampling methods</td>
                  <td className="py-2 px-2">start, step</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPServerDetails;
