import { useState, useEffect } from 'react';
import { exportAioIndexToJson } from '@/services/can/mcpOperations';
import type { AioIndex, Method } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';

// Define the method structure for frontend use
interface AioMethod {
  name: string;
  description: string;
  inputSchema?: {
    type: string;
    properties: Record<string, AioMethodProperty>;
    required?: string[];
  };
}

interface AioMethodProperty {
  type: string;
  description?: string;
  default?: any;
  enum?: string[];
  items?: any;
}

// Extended AioIndex interface
interface ExtendedAioIndex {
  id: string;
  description: string;
  capability_tags?: string[];
  functional_keywords?: string[];
  scenario_phrases?: string[];
  methods?: AioMethod[];
  // Preserve other potential fields from the original AioIndex
  source?: any;
  transport?: string[];
  scenarios?: string[];
  keywords?: string[];
  github?: string;
  author?: string;
  version?: string;
}

interface UseAioProtocolResult {
  description: string;
  isLoading: boolean;
  error: string | null;
  aioIndex: ExtendedAioIndex | null;
  capabilityTags: string[];
  functionalKeywords: string[];
  scenarioPhrases: string[];
  methodsList: AioMethod[];
  getMethodSchemaDescription: (methodName: string) => string;
  getMethodRequiredParams: (methodName: string) => string[];
  getMethodDefaultParams: (methodName: string) => Record<string, any>;
  formatScenarioText: () => string;
}

/**
 * Get method schema description
 * @param methods List of methods
 * @param methodName Method name
 * @returns Method object or undefined
 */
const getMethodSchema = (methods: AioMethod[] = [], methodName: string): AioMethod | undefined => {
  return methods.find(method => method.name === methodName);
};

/**
 * Format scenario description text
 * @param scenarios Array of scenario descriptions
 * @returns Formatted scenario description text
 */
const formatScenarios = (scenarios: string[] = []): string => {
  if (!scenarios || scenarios.length === 0) {
    return 'No scenario descriptions available.';
  }
  return scenarios.map((scenario, index) => `${index + 1}. ${scenario}`).join('\n');
};

/**
 * Convert backend Method to frontend AioMethod
 * @param methods Array of backend methods
 * @returns Array of frontend methods
 */
const convertMethodsFormat = (methods: any[]): AioMethod[] => {
  if (!methods || !Array.isArray(methods)) {
    return [];
  }
  
  return methods.map(method => ({
    name: method.name,
    description: method.description,
    inputSchema: method.inputSchema || method.input_schema
  }));
};

/**
 * Custom hook to fetch and process AIO protocol index information
 * @param serverName The name of the MCP server
 * @returns Object containing AIO protocol data and loading state
 */
export const useAioProtocol = (serverName: string): UseAioProtocolResult => {
  const [aioIndex, setAioIndex] = useState<ExtendedAioIndex | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [capabilityTags, setCapabilityTags] = useState<string[]>([]);
  const [functionalKeywords, setFunctionalKeywords] = useState<string[]>([]);
  const [scenarioPhrases, setScenarioPhrases] = useState<string[]>([]);
  const [methodsList, setMethodsList] = useState<AioMethod[]>([]);

  useEffect(() => {
    const fetchAioIndex = async () => {
      if (!serverName) {
        setError('No server name provided');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await exportAioIndexToJson(serverName);
        
        if ('Ok' in result) {
          try {
            const parsedData = JSON.parse(result.Ok) as ExtendedAioIndex;
            setAioIndex(parsedData);
            
            // Extract various fields
            if (parsedData.description) {
              console.log(`[AIO-INDEX] 📝 MCP Server Description:`, parsedData.description);
              setDescription(parsedData.description);
            } else {
              setDescription('No description available for this MCP server.');
            }
            
            // Extract tags, keywords and scenario descriptions
            setCapabilityTags(parsedData.capability_tags || []);
            setFunctionalKeywords(parsedData.functional_keywords || []);
            setScenarioPhrases(parsedData.scenario_phrases || []);
            
            // Convert and extract method list
            const convertedMethods = convertMethodsFormat(parsedData.methods || []);
            setMethodsList(convertedMethods);
            
          } catch (parseError) {
            console.error('Error parsing AIO index JSON:', parseError);
            setError('Invalid AIO index data format');
          }
        } else {
          setError(`Failed to get AIO index: ${result.Err}`);
        }
      } catch (fetchError) {
        console.error('Error fetching AIO index:', fetchError);
        setError('Failed to fetch AIO protocol data');
      } finally {
        setIsLoading(false);
      }
    };

    if (serverName) {
      fetchAioIndex();
    }
  }, [serverName]);

  /**
   * Get description for a specific method
   * @param methodName Method name
   * @returns Method description
   */
  const getMethodSchemaDescription = (methodName: string): string => {
    const method = getMethodSchema(methodsList, methodName);
    return method?.description || 'No description available for this method.';
  };

  /**
   * Get required parameters list for a specific method
   * @param methodName Method name
   * @returns Array of required parameters
   */
  const getMethodRequiredParams = (methodName: string): string[] => {
    const method = getMethodSchema(methodsList, methodName);
    return method?.inputSchema?.required || [];
  };

  /**
   * Get default parameters object for a specific method
   * @param methodName Method name
   * @returns Default parameters object
   */
  const getMethodDefaultParams = (methodName: string): Record<string, any> => {
    const method = getMethodSchema(methodsList, methodName);
    if (!method?.inputSchema?.properties) {
      return {};
    }
    
    const defaultParams: Record<string, any> = {};
    const properties = method.inputSchema.properties;
    
    Object.keys(properties).forEach(key => {
      if (properties[key].default !== undefined) {
        defaultParams[key] = properties[key].default;
      }
    });
    
    return defaultParams;
  };

  /**
   * Format scenario descriptions array as text
   * @returns Formatted scenario description text
   */
  const formatScenarioText = (): string => {
    return formatScenarios(scenarioPhrases);
  };

  return {
    description,
    isLoading,
    error,
    aioIndex,
    capabilityTags,
    functionalKeywords,
    scenarioPhrases,
    methodsList,
    getMethodSchemaDescription,
    getMethodRequiredParams,
    getMethodDefaultParams,
    formatScenarioText
  };
}; 