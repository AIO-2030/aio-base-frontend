import { ChatMessage } from "@/services/emcNetworkService";

/**
 * Interface for AI provider implementations
 */
export interface AIProvider {
  /**
   * Get the name of the provider
   */
  getName(): string;
  
  /**
   * Get supported models by this provider
   */
  getSupportedModels(): string[];
  
  /**
   * Generate a completion using the provider
   */
  generateCompletion(messages: ChatMessage[], model: string): Promise<string>;
  
  /**
   * Check if the provider supports a specific model
   */
  supportsModel(model: string): boolean;
}

// Import the provider implementations
import { EMCNetworkProvider } from './EMCNetworkProvider';
import { SiliconFlowProvider } from './SiliconFlowProvider';
import { LLMStudioProvider } from './LLMStudioProvider';

/**
 * Factory to get provider implementation by model name
 */
export function getProviderForModel(model: string): AIProvider {
  const allProviders = [
    new EMCNetworkProvider(),
    new SiliconFlowProvider(),
    new LLMStudioProvider()
  ];
  
  // Find the first provider that supports this model
  const provider = allProviders.find(p => p.supportsModel(model));
  
  if (!provider) {
    throw new Error(`No provider supports model: ${model}`);
  }
  
  return provider;
}

// Re-export provider implementations
export { EMCNetworkProvider } from './EMCNetworkProvider';
export { SiliconFlowProvider } from './SiliconFlowProvider';
export { LLMStudioProvider } from './LLMStudioProvider';
