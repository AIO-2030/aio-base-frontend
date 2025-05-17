import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { AIMessage, getInitialMessage, sendMessage, createDirectMessage } from '@/services/types/aiTypes';
import { AttachedFile } from '@/components/chat/ChatFileUploader';
import { toast } from '@/components/ui/use-toast';
import { AIOProtocolHandler } from '@/runtime/AIOProtocolHandler';
import { v4 as uuidv4 } from 'uuid';
import { 
  cleanJsonString, 
  fixMalformedJson, 
  safeJsonParse,
  extractJsonFromMarkdownSections,
  extractResponseFromRawJson
} from '@/util/formatters';

interface PendingProtocolData {
  inputValue: any;
  rawContent:string;
  operationKeywords: string[];
  executionPlan?: any;
  stepCount: number;
}

export interface ChatContextType {
  message: string;
  setMessage: (message: string) => void;
  messages: AIMessage[];
  setMessages: (messages: AIMessage[]) => void;
  handleSendMessage: (message: string, files?: AttachedFile[]) => Promise<void>;
  addDirectMessage: (content: string) => void;
  handleProtocolStep: (contextId: string, apiEndpoint: string) => Promise<void>;
  initProtocolContext: (inputValue: any, rawContent: string, operationKeywords?: string[], executionPlan?: any) => Promise<string | null>;
  activeProtocolContextId: string | null;
  setActiveProtocolContextId: (id: string | null) => void;
  pendingProtocolData: PendingProtocolData | null;
  setPendingProtocolData: (data: PendingProtocolData | null) => void;
  confirmAndRunProtocol: () => void;
  handleProtocolReset: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const extractOperationKeywords = (aiResponse: AIMessage): string[] => {
  try {
    if (aiResponse.execution_plan?.steps) {
      const steps = aiResponse.execution_plan.steps;
      if (Array.isArray(steps) && steps.length > 0) {
        console.log("[ChatContext] Extracting operations from execution_plan steps:", steps);
        
        return steps.map((step: any) => {
          if (step.action) {
            return step.mcp ? `${step.mcp}:${step.action}` : step.action;
          }
          return step.mcp || "process";
        });
      }
    }
    
    if (aiResponse.content && aiResponse.content.includes("execution_plan")) {
      try {
        // Use the already processed JSON content if available
        if (aiResponse._rawJsonContent) {
          const parsedJson = JSON.parse(aiResponse._rawJsonContent);
          if (parsedJson.execution_plan?.steps && Array.isArray(parsedJson.execution_plan.steps)) {
            console.log("[ChatContext] Extracted execution_plan from processed JSON");
            return parsedJson.execution_plan.steps.map((step: any) => {
              return step.action || step.mcp || "process";
            });
          }
        }
      } catch (error) {
        console.log("[ChatContext] Could not parse JSON from content:", error);
      }
    }
    
    if (aiResponse.content && aiResponse.content.includes("intent_analysis")) {
      try {
        // Use the already processed JSON content if available
        if (aiResponse._rawJsonContent) {
          const parsedJson = JSON.parse(aiResponse._rawJsonContent);
          if (parsedJson.intent_analysis?.task_decomposition) {
            return parsedJson.intent_analysis.task_decomposition.map((task: any) => {
              return task.action || "process";
            });
          }
        }
      } catch (error) {
        console.log("[ChatContext] Could not parse intent_analysis from content:", error);
      }
    }
    
    return ["process"];
  } catch (error) {
    console.error("[ChatContext] Error extracting operation keywords:", error);
    return ["process"];
  }
};

const isIntentAnalysisMessage = (message: AIMessage): boolean => {
  if (message.sender !== 'ai') return false;
  
  if (message.intent_analysis) {
    return true;
  }
  
  if (message.content) {
    return (
      message.content.includes("Intent Analysis:") ||
      message.content.includes("intent_analysis") ||
      message.content.includes("Understanding your request") ||
      message.content.includes("request_understanding")
    );
  }
  
  return false;
};

const extractSummaryFromIntentAnalysis = (aiResponse: AIMessage): string => {
  try {
    if (aiResponse.intent_analysis) {
      const intentAnalysis = aiResponse.intent_analysis;
      
      if (intentAnalysis.request_understanding?.primary_goal) {
        return `I understand your goal is ${intentAnalysis.request_understanding.primary_goal}. How can I help?`;
      }
      
      if (intentAnalysis.primary_goal) {
        return `I understand your goal is ${intentAnalysis.primary_goal}. How can I help?`;
      }
      
      if (intentAnalysis.request_understanding) {
        return `I understand your request. How can I help?`;
      }
    }
    
    if (aiResponse.content && (aiResponse.content.includes('"intent_analysis"') || aiResponse.content.includes('"request_understanding"'))) {
      try {
        // Use the already processed JSON content if available
        if (aiResponse._rawJsonContent) {
          const parsedJson = JSON.parse(aiResponse._rawJsonContent);
          
          if (parsedJson.response) {
            return parsedJson.response;
          }
          
          if (parsedJson.intent_analysis?.request_understanding?.primary_goal) {
            return `I understand your goal is ${parsedJson.intent_analysis.request_understanding.primary_goal}. How can I help?`;
          }
          
          if (parsedJson.intent_analysis?.primary_goal) {
            return `I understand your goal is ${parsedJson.intent_analysis.primary_goal}. How can I help?`;
          }
        }
      } catch (error) {
        console.log("[ChatContext] Error extracting from JSON content:", error);
      }
    }
    
    return aiResponse.content;
  } catch (error) {
    console.error("[ChatContext] Error extracting summary from intent analysis:", error);
    return aiResponse.content;
  }
};

const enhanceAIMessageWithSummary = (aiResponse: AIMessage): AIMessage => {
  if (!isIntentAnalysisMessage(aiResponse)) {
    return aiResponse;
  }
  
  const summaryContent = extractSummaryFromIntentAnalysis(aiResponse);
  
  return {
    ...aiResponse,
    content: aiResponse.content,
    _displayContent: summaryContent,
  };
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([getInitialMessage()]);
  const [activeProtocolContextId, setActiveProtocolContextId] = useState<string | null>(null);
  const [pendingProtocolData, setPendingProtocolData] = useState<PendingProtocolData | null>(null);

  const handleSendMessage = async (
    currentMessage: string, 
    currentFiles: AttachedFile[]
  ): Promise<void> => {
    if (currentMessage.trim() === '' && currentFiles.length === 0) return;

    let messageContent = currentMessage.trim();
    
    if (currentFiles.length > 0) {
      const fileNames = currentFiles.map(file => file.name).join(', ');
      
      if (messageContent) {
        messageContent += `\n\nAttached files: ${fileNames}`;
      } else {
        messageContent = `[Attached files: ${fileNames}]`;
      }
    }

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageContent,
      timestamp: new Date(),
      attachedFiles: currentFiles.length > 0 ? [...currentFiles] : undefined
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const aiResponse = await sendMessage(messageContent, currentFiles);
      console.log('[ChatContext] AI response:', aiResponse);
      
      // Process JSON content in the AI response
      if (aiResponse.content) {
        try {
          console.log('[ChatContext] Starting JSON content processing');
          
          // First check if the content is already valid JSON
          try {
            const directParse = JSON.parse(aiResponse.content);
            console.log('[ChatContext] Content is already valid JSON, skipping format processing');
            aiResponse._rawJsonContent = aiResponse.content;
            if (directParse.intent_analysis) {
              aiResponse.intent_analysis = directParse.intent_analysis;
            }
            if (directParse.execution_plan) {
              aiResponse.execution_plan = directParse.execution_plan;
            }
            if (directParse.response) {
              aiResponse._displayContent = directParse.response;
            }
          } catch (error) {
            console.log('[ChatContext] Content is not valid JSON, proceeding with format processing');
            
            // Clean and fix JSON content
            console.log('[ChatContext] Cleaning JSON content');
            const cleanedContent = cleanJsonString(aiResponse.content);
            
            // Check if cleaned content is valid JSON
            try {
              const cleanedParse = JSON.parse(cleanedContent);
              console.log('[ChatContext] Cleaned content is valid JSON, skipping malformed fixes');
              aiResponse._rawJsonContent = cleanedContent;
              if (cleanedParse.intent_analysis) {
                aiResponse.intent_analysis = cleanedParse.intent_analysis;
              }
              if (cleanedParse.execution_plan) {
                aiResponse.execution_plan = cleanedParse.execution_plan;
              }
              if (cleanedParse.response) {
                aiResponse._displayContent = cleanedParse.response;
              }
            } catch (cleanedError) {
              console.log('[ChatContext] Cleaned content is not valid JSON, proceeding with malformed fixes');
              
              console.log('[ChatContext] Fixing malformed JSON');
              const fixedJson = fixMalformedJson(cleanedContent);
              
              // Check if fixed JSON is valid
              try {
                const fixedParse = JSON.parse(fixedJson);
                console.log('[ChatContext] Fixed JSON is valid, skipping safe parse');
                aiResponse._rawJsonContent = fixedJson;
                if (fixedParse.intent_analysis) {
                  aiResponse.intent_analysis = fixedParse.intent_analysis;
                }
                if (fixedParse.execution_plan) {
                  aiResponse.execution_plan = fixedParse.execution_plan;
                }
                if (fixedParse.response) {
                  aiResponse._displayContent = fixedParse.response;
                }
              } catch (fixedError) {
                console.log('[ChatContext] Fixed JSON is not valid, attempting safe parse');
                const parsed = safeJsonParse(fixedJson);
                if (parsed) {
                  aiResponse._rawJsonContent = fixedJson;
                  if (parsed.intent_analysis) {
                    aiResponse.intent_analysis = parsed.intent_analysis;
                  }
                  if (parsed.execution_plan) {
                    aiResponse.execution_plan = parsed.execution_plan;
                  }
                  if (parsed.response) {
                    aiResponse._displayContent = parsed.response;
                  }
                }
              }
            }
          }
          
          // Extract structured data from markdown sections if present
           console.log("none valid json, so we need to extract the json from the markdown sections");
          if (!aiResponse._rawJsonContent) {
            console.log('[ChatContext] Checking for markdown sections');
            const markdownData = extractJsonFromMarkdownSections(aiResponse.content);
            if (markdownData) {

              console.log('[ChatContext] Found markdown sections:', markdownData);
              if (markdownData.intent_analysis) {
                aiResponse.intent_analysis = markdownData.intent_analysis;
              }
              if (markdownData.execution_plan) {
                aiResponse.execution_plan = markdownData.execution_plan;
              }
              if (markdownData.response) {
                aiResponse._displayContent = markdownData.response;
              }
            }
          }
          // Extract response from raw JSON if not already set
          if (!aiResponse._displayContent) {
            console.log('[ChatContext] Extracting response from raw JSON');
            const response = extractResponseFromRawJson(aiResponse.content);
            if (response) {
              aiResponse._displayContent = response;
              console.log('[ChatContext] Extracted response from raw JSON:', response);
            }
          }
        } catch (error) {
          console.error('[ChatContext] Error processing JSON content:', error);
        }
      }
      
      if (isIntentAnalysisMessage(aiResponse)) {
        console.log('[ChatContext] Detected intent analysis');
        
        let executionPlan = aiResponse.execution_plan;
        console.log('[ChatContext] Execution plan:', executionPlan);
        
        if (!executionPlan && aiResponse.content && aiResponse.content.includes("execution_plan")) {
          try {
            console.log('[ChatContext] Extracting execution plan from content');
            if (aiResponse._rawJsonContent) {
              const parsedJson = JSON.parse(aiResponse._rawJsonContent);
              if (parsedJson.execution_plan) {
                executionPlan = parsedJson.execution_plan;
                console.log('[ChatContext] Extracted execution_plan from processed JSON');
              }
            }
          } catch (error) {
            console.log("[ChatContext] Could not parse JSON from content:", error);
          }
        }
        
        const operationKeywords = extractOperationKeywords(aiResponse);
        console.log('[ChatContext] Extracted operation keywords:', operationKeywords);
        
        if (operationKeywords.length > 0) {
          const newPendingData: PendingProtocolData = {
            inputValue: messageContent,
            rawContent: aiResponse.content,
            operationKeywords,
            executionPlan,
            stepCount: operationKeywords.length
          };
          
          setPendingProtocolData(newPendingData);
          
          const enhancedResponse = enhanceAIMessageWithSummary(aiResponse);
          setMessages((prev) => [...prev, enhancedResponse]);
          
          addDirectMessage(
            `A protocol with ${operationKeywords.length} steps is ready. Type "/run" to execute it or click the "Execute" button.`
          );
          
          return;
        }
      }
      
      setMessages((prev) => [...prev, aiResponse]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        variant: "destructive"
      });
    }
  };

  const confirmAndRunProtocol = async () => {
    if (!pendingProtocolData) {
      addDirectMessage("No pending protocol to run. Please send a request first.");
      return;
    }
    
    const { inputValue, rawContent, operationKeywords, executionPlan } = pendingProtocolData;
    
    const contextId = await initProtocolContext(inputValue, rawContent, operationKeywords, executionPlan);
    
    if (contextId) {
      setActiveProtocolContextId(contextId);
      
      addDirectMessage(`Protocol initialized with ${operationKeywords.length} steps. Starting execution...`);
      
      setPendingProtocolData(null);
    }
  };

  const addDirectMessage = (content: string, attachedFiles?: AttachedFile[]): void => {
    const directMessage = createDirectMessage(content, attachedFiles);
    setMessages((prev) => [...prev, directMessage]);
  };

  const initProtocolContext = async (
    inputValue: any,
    rawContent: string,
    operationKeywords?: string[],
    executionPlan?: any
  ): Promise<string | null> => {
    try {
      const contextId = `aio-ctx-${Date.now()}`;
      const protocolHandler = AIOProtocolHandler.getInstance();
      console.log('[ChatContext] Initializing protocol context:', contextId);
      addDirectMessage(`Initializing protocol context: ${contextId}`);
      
      const context = await protocolHandler.init_calling_context(
        contextId,
        inputValue,
        rawContent,
        operationKeywords,
        executionPlan
      );
      
      if (!context) {
        throw new Error("Failed to initialize protocol context");
      }
      
      console.log('[ChatContext] Initialized protocol context:', contextId, 'with operations:', operationKeywords);
      if (executionPlan) {
        console.log('[ChatContext] Using execution plan:', executionPlan);
      }
      
      return contextId;
    } catch (error) {
      console.error("Error initializing protocol context:", error);
      toast({
        title: "Protocol Error",
        description: "Failed to initialize AIO protocol context",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleProtocolStep = async (
    contextId: string,
    apiEndpoint: string
  ): Promise<void> => {
    try {
      const protocolHandler = AIOProtocolHandler.getInstance();
      const context = protocolHandler.getContext(contextId);
      
      if (!context) {
        console.error("[ChatContext] Protocol context not found:", contextId);
        toast({
          title: "Protocol Error",
          description: "Protocol context not found",
          variant: "destructive"
        });
        throw new Error("Protocol context not found");
      }
      
      const isLastStep = context.curr_call_index === context.opr_keywd.length - 1;
      
      console.log(`[ChatContext] Executing protocol step ${context.curr_call_index + 1} of ${context.opr_keywd.length}`);
      
      const aiMessage = await protocolHandler.calling_step_by_step(
        contextId, 
        apiEndpoint,
        isLastStep,
        addDirectMessage
      );
      
      if (!aiMessage) {
        const errorMsg = "No response message returned from protocol step";
        console.error(`[ChatContext] ${errorMsg}`);
        
        toast({
          title: "Protocol Error",
          description: `Error in step ${context.curr_call_index + 1}: ${errorMsg}`,
          variant: "destructive"
        });
        
        throw new Error(errorMsg);
      }
      
      console.log('[ChatContext] Adding protocol message:', aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
      
    } catch (error) {
      console.error("[ChatContext] Error handling protocol step:", error);
      
      if (error.message !== "Protocol context not found") {
        toast({
          title: "Protocol Error",
          description: `Error in protocol step: ${error.message}`,
          variant: "destructive"
        });
        
        addDirectMessage(`Error in protocol step: ${error.message}`);
      }
      
      throw error;
    }
  };

  const handleProtocolReset = () => {
    if (activeProtocolContextId) {
      // Delete the context to reset it
      const protocolHandler = AIOProtocolHandler.getInstance();
      protocolHandler.deleteContext(activeProtocolContextId);
      
      // Clear the active protocol context ID
      setActiveProtocolContextId(null);
      
      addDirectMessage(`Protocol context ${activeProtocolContextId} has been reset`);
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        message, 
        setMessage, 
        messages, 
        setMessages, 
        handleSendMessage,
        addDirectMessage,
        initProtocolContext,
        handleProtocolStep,
        activeProtocolContextId,
        setActiveProtocolContextId,
        pendingProtocolData,
        setPendingProtocolData,
        confirmAndRunProtocol,
        handleProtocolReset
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    console.error('useChat must be used within a ChatProvider');
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}
