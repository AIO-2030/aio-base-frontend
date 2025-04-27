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
  operationKeywords: string[];
  executionPlan?: any;
  stepCount: number;
}

interface ChatContextType {
  message: string;
  setMessage: (message: string) => void;
  messages: AIMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>;
  handleSendMessage: (currentMessage: string, currentFiles: AttachedFile[]) => Promise<void>;
  addDirectMessage: (content: string, attachedFiles?: AttachedFile[]) => void;
  handleProtocolStep: (contextId: string, apiEndpoint: string) => Promise<void>;
  initProtocolContext: (inputValue: any, operationKeywords: string[], executionPlan?: any) => string | null;
  activeProtocolContextId: string | null;
  setActiveProtocolContextId: React.Dispatch<React.SetStateAction<string | null>>;
  pendingProtocolData: PendingProtocolData | null;
  setPendingProtocolData: React.Dispatch<React.SetStateAction<PendingProtocolData | null>>;
  confirmAndRunProtocol: () => void;
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
          
          // Clean and fix JSON content
          console.log('[ChatContext] Cleaning JSON content');
          const cleanedContent = cleanJsonString(aiResponse.content);
          console.log('[ChatContext] Cleaned content:', cleanedContent);
          
          console.log('[ChatContext] Fixing malformed JSON');
          const fixedJson = fixMalformedJson(cleanedContent);
          console.log('[ChatContext] Fixed JSON:', fixedJson);
          
          console.log('[ChatContext] Attempting to parse JSON');
          const parsed = safeJsonParse(fixedJson);
          
          if (parsed) {
            console.log('[ChatContext] Successfully parsed JSON');
            // Store the processed JSON content
            aiResponse._rawJsonContent = fixedJson;
            
            // Extract structured data from markdown sections if present
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
            
            // Extract response from raw JSON if not already set
            if (!aiResponse._displayContent) {
              console.log('[ChatContext] Extracting response from raw JSON');
              const response = extractResponseFromRawJson(aiResponse.content);
              if (response) {
                aiResponse._displayContent = response;
              }
            }
          } else {
            console.log('[ChatContext] Failed to parse JSON, using original content');
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

  const confirmAndRunProtocol = () => {
    if (!pendingProtocolData) {
      addDirectMessage("No pending protocol to run. Please send a request first.");
      return;
    }
    
    const { inputValue, operationKeywords, executionPlan } = pendingProtocolData;
    
    const contextId = initProtocolContext(inputValue, operationKeywords, executionPlan);
    
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

  const initProtocolContext = (
    inputValue: any,
    operationKeywords: string[] = [],
    executionPlan?: any
  ): string | null => {
    try {
      const contextId = `aio-ctx-${Date.now()}`;
      const protocolHandler = AIOProtocolHandler.getInstance();
      
      const context = protocolHandler.init_calling_context(
        contextId,
        inputValue,
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
        isLastStep
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
        confirmAndRunProtocol
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
