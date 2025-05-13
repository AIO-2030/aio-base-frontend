
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { AgentItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';
import { generateDefaultInput, parseAgentInputOutput } from '@/utils/agentUtils';

export function useAgentTesting(agent: AgentItem) {
  const { toast } = useToast();
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Initialize default input data based on agent info
  useEffect(() => {
    initializeInputData();
  }, [agent]);

  const initializeInputData = () => {
    const defaultInput = generateDefaultInput(agent.name);
    
    // Use agent's input_params if available, otherwise use default
    if (agent.input_params.length > 0) {
      try {
        const parsedInput = JSON.parse(agent.input_params[0]);
        setInputData(JSON.stringify(parsedInput, null, 2));
      } catch {
        setInputData(JSON.stringify(defaultInput, null, 2));
      }
    } else {
      setInputData(JSON.stringify(defaultInput, null, 2));
    }
  };

  const processAgentExecution = (inputJson: any) => {
    const outputJson = parseAgentInputOutput(agent, inputJson);
    
    // Use agent's output_example if available
    if (agent.output_example.length > 0) {
      try {
        const parsedOutput = JSON.parse(agent.output_example[0]);
        setOutputData(JSON.stringify(parsedOutput, null, 2));
      } catch {
        setOutputData(JSON.stringify(outputJson, null, 2));
      }
    } else {
      setOutputData(JSON.stringify(outputJson, null, 2));
    }
    
    toast({
      title: "Agent executed successfully",
      description: "The agent has processed your input"
    });
  };

  const handleExecute = () => {
    setIsExecuting(true);

    // Simulate API call to execute agent
    setTimeout(() => {
      try {
        const inputJson = JSON.parse(inputData);
        processAgentExecution(inputJson);
      } catch (error) {
        console.error('Error parsing input JSON:', error);
        toast({
          title: "Invalid JSON",
          description: "Please provide valid JSON input",
          variant: "destructive"
        });
      } finally {
        setIsExecuting(false);
      }
    }, 1500);
  };

  return {
    inputData,
    setInputData,
    outputData,
    isExecuting,
    handleExecute
  };
}
