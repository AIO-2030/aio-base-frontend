
import { AIProvider } from "./AIProvider";
import { ChatMessage } from "@/services/emcNetworkService";

/**
 * Mock provider for fallback when all network services fail
 */
export class MockProvider implements AIProvider {
  getName(): string {
    return "Mock Provider";
  }
  
  getSupportedModels(): string[] {
    return ["mock-model"];
  }
  
  supportsModel(model: string): boolean {
    // The mock provider can support any model as a last resort
    return true;
  }
  
  async generateCompletion(messages: ChatMessage[], model: string): Promise<string> {
    const userMessage = messages.find(msg => msg.role === "user")?.content || "";
    
    console.log(`[MOCK-PROVIDER] 🎭 Generating mock response for: "${userMessage.substring(0, 50)}..."`);
    
    // Simple mock response simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `I'm currently unable to process your request due to connection issues. 
    
As a fallback, I'm providing this automated response. Your message was about: "${userMessage.substring(0, 100)}${userMessage.length > 100 ? '...' : ''}".

Please try again later when network connectivity has been restored. In the meantime, you can:
1. Check your internet connection
2. Use local features that don't require network access
3. Try using a different network if available

Thank you for your understanding.`;
  }
}
