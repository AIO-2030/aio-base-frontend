
/**
 * EMC Network provider implementation
 */

import { AIProvider } from "../AIProvider";
import { ChatMessage, EMCModel } from "@/services/emcNetworkService";
import { processCompletionRequest } from "./completionHandler";

/**
 * EMC Network provider implementation
 */
export class EMCNetworkProvider implements AIProvider {
  getName(): string {
    return "EMC Network";
  }
  
  getSupportedModels(): string[] {
    return [EMCModel.DEEPSEEK_CHAT];
  }
  
  supportsModel(model: string): boolean {
    return this.getSupportedModels().includes(model);
  }
  
  async generateCompletion(messages: ChatMessage[], model: string): Promise<string> {
    if (!this.supportsModel(model)) {
      throw new Error(`Model ${model} is not supported by EMC Network provider`);
    }
    
    return await processCompletionRequest(messages, model);
  }
}
