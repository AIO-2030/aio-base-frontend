import { toast } from "@/components/ui/use-toast";
import { getProviderForModel } from "./ai/providers/AIProvider";
import { MockProvider } from "./ai/providers/MockProvider";
import { DialogAction } from "./speech/tempateconfig/dialogPromptsTemplate";
import { AttachedFile } from "@/components/chat/ChatFileUploader";

// Define the model options for EMC Network and SiliconFlow
export enum EMCModel {
  DEEPSEEK_CHAT = "deepseek-chat",
  QWEN_CODER = "Qwen/Qwen2.5-Coder-7B-Instruct",
  //LLM_STUDIO = "bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF"
  LLM_STUDIO = "deepseek-r1-distill-qwen-7b"
}

// Define message type for chat completions
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  attachedFiles?: AttachedFile[];
}

/**
 * Generates a completion using the appropriate provider based on the model
 * Falls back to mock response if all providers fail
 */
export const generateEMCCompletion = async (
  messages: ChatMessage[],
  model: EMCModel = EMCModel.DEEPSEEK_CHAT
): Promise<string> => {
  try {
    // Get the appropriate provider for this model
    const provider = getProviderForModel(model);
    console.log(`[AI-PROVIDER] 🔍 Using ${provider.getName()} for model: ${model}`);
    
    // Generate completion using the selected provider
    return await provider.generateCompletion(messages, model);
  } catch (error) {
    console.error(`[AI-PROVIDER] ❌ All providers failed:`, error);
    
    // Show error toast to the user
    toast({
      title: "AI services unavailable",
      description: "All endpoints failed to respond. Using local fallback service.",
      variant: "destructive"
    });
    
    // Use mock provider as last resort
    const mockProvider = new MockProvider();
    return mockProvider.generateCompletion(messages, model);
  }
};
