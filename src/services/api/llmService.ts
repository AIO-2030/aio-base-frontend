
import * as mockApi from '../mockApi';
import { isUsingMockApi } from './apiConfig';

/**
 * Fetch list of available LLM models
 * @returns Promise resolving to array of LLM models
 */
export const getLLMModels = () => {
  if (isUsingMockApi()) {
    return mockApi.getLLMModels();
  }
  
  // Real implementation would go here
  return mockApi.getLLMModels();
};

/**
 * Generate a response from a specified LLM model
 * @param modelId Model identifier to use for generation
 * @param prompt User prompt to send to the model
 * @returns Promise resolving to generated text
 */
export const generateLLMResponse = (modelId: string, prompt: string) => {
  if (isUsingMockApi()) {
    return mockApi.generateLLMResponse(modelId, prompt);
  }
  
  // Real implementation would go here
  return mockApi.generateLLMResponse(modelId, prompt);
};
