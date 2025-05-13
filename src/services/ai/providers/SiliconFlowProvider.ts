
/**
 * SiliconFlow provider implementation
 */

import { toast } from "@/components/ui/use-toast";
import { AIProvider } from "./AIProvider";
import { ChatMessage, EMCModel } from "@/services/emcNetworkService";

// SiliconFlow endpoint
const SILICONFLOW_ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions";

// API key
const SILICONFLOW_API_KEY = "sk-sizdciquzgledafoqeguebohudunufoztppywmclondftwij";

// Timeout for API calls in milliseconds
const REQUEST_TIMEOUT = 15000; // 15 seconds

/**
 * SiliconFlow provider implementation
 */
export class SiliconFlowProvider implements AIProvider {
  getName(): string {
    return "SiliconFlow";
  }
  
  getSupportedModels(): string[] {
    return [EMCModel.QWEN_CODER];
  }
  
  supportsModel(model: string): boolean {
    return this.getSupportedModels().includes(model);
  }
  
  async generateCompletion(messages: ChatMessage[], model: string): Promise<string> {
    if (!this.supportsModel(model)) {
      throw new Error(`Model ${model} is not supported by SiliconFlow provider`);
    }
    
    console.log(`[SILICONFLOW] 🚀 Starting SiliconFlow completion request with model: ${model}`);
    
    try {
      const requestBody = JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        response_format: { type: "text" }
      });
      
      console.log(`[SILICONFLOW] 📊 Request payload size: ${requestBody.length} bytes`);
      
      const response = await this.fetchWithTimeout(
        SILICONFLOW_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
            "accept": "application/json"
          },
          body: requestBody
        },
        REQUEST_TIMEOUT
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch((jsonError) => {
          console.log(`[SILICONFLOW] ⚠️ Failed to parse error response: ${jsonError}`);
          return { error: { message: "Network error" } };
        });
        
        console.error(`[SILICONFLOW] 🛑 SiliconFlow failed with status ${response.status}:`, errorData);
        throw new Error(`SiliconFlow error: ${errorData.error?.message || response.statusText}`);
      }
      
      console.log(`[SILICONFLOW] 📥 Parsing response`);
      const data = await response.json();
      
      // Check if the expected data structure is present
      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error(`[SILICONFLOW] 🧩 Invalid response format:`, data);
        throw new Error("Invalid response format from SiliconFlow");
      }
      
      const resultContent = data.choices[0].message.content.trim();
      console.log(`[SILICONFLOW] ✅ SiliconFlow succeeded, response length: ${resultContent.length} chars`);
      
      return resultContent;
    } catch (error) {
      console.warn(`[SILICONFLOW] ⚠️ SiliconFlow request failed:`, error);
      throw error;
    }
  }
  
  /**
   * Function to fetch with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const { signal } = controller;
    
    console.log(`[SILICONFLOW] 📡 Setting up fetch with timeout: ${timeout}ms`);
    const timeoutId = setTimeout(() => {
      console.log(`[SILICONFLOW] ⏱️ Request timed out after ${timeout}ms`);
      controller.abort();
    }, timeout);
    
    try {
      console.log(`[SILICONFLOW] 🔄 Starting fetch request to: ${url}`);
      const response = await fetch(url, { 
        ...options, 
        signal
      });
      console.log(`[SILICONFLOW] ✅ Fetch completed with status: ${response.status}`);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      console.log(`[SILICONFLOW] ❌ Fetch error: ${error instanceof Error ? error.message : String(error)}`);
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
