import { AIProvider } from "./AIProvider";
import { ChatMessage, EMCModel } from "@/services/emcNetworkService";
import { aioIndexPrompts } from "@/config/aiPrompts";
import { 
  fixMalformedJson, 
  safeJsonParse, 
  fixBackslashEscapeIssues, 
  aggressiveBackslashFix 
} from "@/util/json/jsonParser";
import { cleanJsonString } from "@/util/json/jsonExtractor";

/**
 * LLM Studio provider implementation using OpenAI-compatible HTTP API
 */
export class LLMStudioProvider implements AIProvider {
  private readonly baseUrl = 'http://127.0.0.1:1234/v1';
  private readonly thinkPattern = /<think>(.*?)<\/think>/gs;
  private readonly MCP_INDEXER_ROLE = 'You are an MCP Capability Indexer';
  private readonly MCP_INVERT_INDEX_ROLE = "You are an AI indexing assistant";
  private availableModels: string[] = [];
  private modelsLastFetched: number = 0;
  private readonly MODELS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  private readonly REQUEST_TIMEOUT = 600000; // 600 seconds timeout
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds delay between retries
  private isServiceHealthy: boolean = false;
  private lastHealthCheck: number = 0;
  private readonly HEALTH_CHECK_INTERVAL = 30 * 1000; // 30 seconds
  
  getName(): string {
    return "LLM Studio";
  }
  
  getSupportedModels(): string[] {
    return [EMCModel.LLM_STUDIO];
  }
  
  supportsModel(model: string): boolean {
    return true; // 始终返回 true，不再进行模型匹配检查
  }

  /**
   * Fetch available models from LLM Studio server
   */
  private async fetchAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data.map((model: any) => model.id);
    } catch (error) {
      console.error(`[LLM-STUDIO] ❌ Failed to fetch models:`, error);
      return [];
    }
  }

  /**
   * Get available models with caching
   */
  private async getAvailableModels(): Promise<string[]> {
    const now = Date.now();
    if (this.availableModels.length === 0 || now - this.modelsLastFetched > this.MODELS_CACHE_DURATION) {
      console.log(`[LLM-STUDIO] 🔄 Fetching available models...`);
      this.availableModels = await this.fetchAvailableModels();
      this.modelsLastFetched = now;
      console.log(`[LLM-STUDIO] ✅ Available models:`, this.availableModels);
    }
    return this.availableModels;
  }

  /**
   * Helper method to process text by removing think tags and logging think content
   * @param text The text to process
   * @returns The cleaned text with think tags removed
   */
  private processText(text: string): string {
    // Extract and log think tags
    const thinkMatches = text.matchAll(this.thinkPattern);
    //Remove think tags and their contents
    return text.replace(this.thinkPattern, '').trim();
  }

  /**
   * Helper method to validate and clean JSON content
   * @param text The text containing JSON
   * @returns The cleaned and validated JSON string
   */
  extractAndValidateJson(text: string): string {
    // 查找第一个[或{作为JSON的开始
    const startIndex = Math.min(
      text.indexOf('[') !== -1 ? text.indexOf('[') : Infinity,
      text.indexOf('{') !== -1 ? text.indexOf('{') : Infinity
    );
    
    if (startIndex === Infinity) {
      throw new Error('No JSON found in response');
    }
    
    // 根据开始字符确定结束字符
    const endChar = text[startIndex] === '[' ? ']' : '}';
    const endIndex = text.lastIndexOf(endChar);
    
    if (endIndex === -1) {
      throw new Error('No complete JSON found in response');
    }
    
    // 提取JSON内容
    const jsonContent = text.slice(startIndex, endIndex + 1);
    
    // 验证JSON
    JSON.parse(jsonContent);
    return jsonContent;
  }
  
  private isBuildMcpIndexPrompt(messages: ChatMessage[]): boolean {
    return messages.some(msg => 
      msg.role === 'system' && 
        msg.content.includes(this.MCP_INDEXER_ROLE)
    );
  }

  private isInvertIndexPrompt(messages: ChatMessage[]): boolean {
    return messages.some(msg => 
      msg.role === 'system' && 
        msg.content.includes(this.MCP_INVERT_INDEX_ROLE)
    );
  }

  async reconstructJsonResponse(text: string): Promise<string> {
    console.log(`[LLM-STUDIO] 🔄 Attempting JSON reconstruction`);
    console.log(`[LLM-STUDIO] 📝 Original content:`, text);
    
    try {
      // Step 1: Try direct JSON parse first
      try {
        const directParsed = JSON.parse(text);
        if (directParsed) {
          console.log('[LLM-STUDIO] ✅ Direct JSON parse successful');
          return JSON.stringify(directParsed);
        }
      } catch (directError) {
        console.log('[LLM-STUDIO] Direct JSON parse failed, trying cleanup...');
      }

      // Step 2: Try cleaning the JSON content
      const cleanedContent = cleanJsonString(text);
      try {
        const cleanParsed = JSON.parse(cleanedContent);
        if (cleanParsed) {
          console.log('[LLM-STUDIO] ✅ Clean JSON parse successful');
          return JSON.stringify(cleanParsed);
        }
      } catch (cleanError) {
        console.log('[LLM-STUDIO] Clean JSON parse failed, trying malformed fixes...');
      }

      // Step 3: Try fixing malformed JSON
      const fixedJson = fixMalformedJson(cleanedContent);
      try {
        const fixedParsed = JSON.parse(fixedJson);
        if (fixedParsed) {
          console.log('[LLM-STUDIO] ✅ Fixed JSON parse successful');
          return JSON.stringify(fixedParsed);
        }
      } catch (fixError) {
        console.log('[LLM-STUDIO] Fixed JSON parse failed, trying safe parser...');
      }

      // Step 4: Try safe parser
      const safeParsed = safeJsonParse(fixedJson);
      if (safeParsed) {
        console.log('[LLM-STUDIO] ✅ Safe JSON parse successful');
        return JSON.stringify(safeParsed);
      }

      // Step 5: Try backslash escape fixes
      const backslashFixed = fixBackslashEscapeIssues(fixedJson);
      try {
        const backslashParsed = JSON.parse(backslashFixed);
        if (backslashParsed) {
          console.log('[LLM-STUDIO] ✅ Backslash fix parse successful');
          return JSON.stringify(backslashParsed);
        }
      } catch (backslashError) {
        console.log('[LLM-STUDIO] Backslash fix parse failed, trying aggressive fix...');
      }

      // Step 6: Try aggressive backslash fix as final attempt
      const aggressiveFixed = aggressiveBackslashFix(backslashFixed);
      try {
        const aggressiveParsed = JSON.parse(aggressiveFixed);
        if (aggressiveParsed) {
          console.log('[LLM-STUDIO] ✅ Aggressive fix parse successful');
          return JSON.stringify(aggressiveParsed);
        }
      } catch (aggressiveError) {
        console.log('[LLM-STUDIO] Aggressive fix parse failed');
      }

      // If all fixes fail, throw error
      throw new Error('Failed to fix JSON format after all attempts');

    } catch (error) {
      console.error(`[LLM-STUDIO] ❌ JSON reconstruction failed:`, error);
      console.log('[LLM-STUDIO] 📝 Failed JSON content, so return as plain text:', text);
      return text;
    }
  }

  private async cleanJsonResponse(text: string, messages: ChatMessage[]): Promise<string> {
    try {
      // First process the text to remove think tags
      const processedText = this.processText(text);
      
      // Only attempt JSON reconstruction for MCP Indexer prompts
      if (this.isBuildMcpIndexPrompt(messages) || this.isInvertIndexPrompt(messages)) {
        console.log('[LLM-STUDIO] 🔍 Detected MCP Indexer prompt, attempting JSON validation...');
        try {
          // Try to extract and validate JSON
          return this.extractAndValidateJson(processedText);
        } catch (error) {
          console.log('[LLM-STUDIO] ⚠️ Invalid JSON format, attempting reconstruction...');
          // If parsing fails, try to reconstruct the JSON
          return await this.reconstructJsonResponse(processedText);
        }
      }
      
      // For other prompts, return the processed text directly
      console.log('[LLM-STUDIO] 📝 Non-MCP Indexer prompt, returning processed text directly');
      return processedText;
    } catch (error) {
      console.error('[LLM-STUDIO] ❌ Error processing response:', error);
      console.log('[LLM-STUDIO] 📝 Failed to process response, so return as plain text:', text);
      return text;
    }
  }
  
  /**
   * Check if LLM Studio service is healthy
   */
  private async checkServiceHealth(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.HEALTH_CHECK_INTERVAL) {
      return this.isServiceHealthy;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout for health check

      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      this.isServiceHealthy = response.ok;
      this.lastHealthCheck = now;
      
      if (!this.isServiceHealthy) {
        console.error(`[LLM-STUDIO] ❌ Service health check failed with status: ${response.status}`);
      }
      
      return this.isServiceHealthy;
    } catch (error) {
      console.error(`[LLM-STUDIO] ❌ Service health check failed:`, error);
      this.isServiceHealthy = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  async generateCompletion(messages: ChatMessage[], model: string): Promise<string> {
    // Check service health before proceeding
    const isHealthy = await this.checkServiceHealth();
    if (!isHealthy) {
      throw new Error('LLM Studio service is not available. Please check if the service is running and accessible at http://localhost:1234');
    }

    // Validate messages array
    if (!Array.isArray(messages)) {
      throw new Error('Invalid messages format: messages must be an array');
    }

    if (messages.length === 0) {
      throw new Error('Invalid messages format: messages array cannot be empty');
    }

    console.log(`[LLM-STUDIO] 🚀 Starting LLM Studio completion request with model: ${model}`);
    
    let retryCount = 0;
    while (retryCount < this.MAX_RETRIES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.error(`[LLM-STUDIO] ⚠️ Request timeout after ${this.REQUEST_TIMEOUT/1000} seconds`);
        }, this.REQUEST_TIMEOUT);
        
        // Prepare request body
        const requestBody: any = {
          model: model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          stream: false
        };
        // print request messages
        console.log(`[LLM-STUDIO] 📨 Request messages:`, JSON.stringify(messages, null, 2));
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          credentials: 'omit',
          mode: 'cors',
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[LLM-STUDIO] ❌ Server error response:`, errorText);
          
          // 如果是 502 错误，可能是服务未启动
          if (response.status === 502) {
            this.isServiceHealthy = false;
            throw new Error(`LLM Studio service is not available (502 Bad Gateway). Please check if the service is running and accessible at http://localhost:1234`);
          }
          
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        const completion = data.choices[0].message.content;
        
        // Clean and validate the JSON response
        const finalResponse = await this.cleanJsonResponse(completion, messages);
        
        console.log(`[LLM-STUDIO] ✅ Completion succeeded, response length: ${finalResponse.length} chars`);
        return finalResponse;
      } catch (error) {
        retryCount++;
        console.error(`[LLM-STUDIO] ❌ Attempt ${retryCount}/${this.MAX_RETRIES} failed:`, error);
        console.log(`[LLM-STUDIO] 📝 Error with prompts message:`, messages);
        if (retryCount < this.MAX_RETRIES) {
          console.log(`[LLM-STUDIO] 🔄 Retrying in ${this.RETRY_DELAY/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          continue;
        }
        
        // 如果是超时错误，提供更详细的错误信息
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(`LLM Studio request timeout after ${this.REQUEST_TIMEOUT/1000} seconds. Please check if the LLM Studio service is running and accessible.`);
        }
        
        throw new Error(`LLM Studio error after ${retryCount} attempts: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    throw new Error('This should never be reached');
  }
} 