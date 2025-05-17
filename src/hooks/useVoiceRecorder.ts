import { useReactMediaRecorder } from 'react-media-recorder';
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { processVoiceData } from '@/services/ai/voiceAIService';
import { AIMessage, sendMessage } from '@/services/types/aiTypes';
import { registerMessageAudio } from '@/services/speechService';
import { AIOProtocolHandler } from '@/runtime/AIOProtocolHandler';
import { 
  cleanJsonString, 
  fixMalformedJson, 
  safeJsonParse,
  extractJsonFromMarkdownSections,
  extractResponseFromRawJson
} from '@/util/formatters';
import { 
  extractJsonResponseToList,
  extractJsonResponseToValueString 
} from '@/util/json/responseFormatter';
import { useChat } from '@/contexts/ChatContext';
import { AttachedFile } from '@/components/chat/ChatFileUploader';

// Function to convert audio blob to WAV format
async function convertToWav(audioBlob: Blob): Promise<Blob> {
  // Create an audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Read the blob as array buffer
  const arrayBuffer = await audioBlob.arrayBuffer();
  
  // Decode the audio data
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Create an offline context for rendering
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );
  
  // Create a buffer source
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();
  
  // Render the audio
  const renderedBuffer = await offlineContext.startRendering();
  
  // Convert to WAV
  const wavBlob = await new Promise<Blob>((resolve) => {
    const length = renderedBuffer.length;
    const channels = renderedBuffer.numberOfChannels;
    const sampleRate = renderedBuffer.sampleRate;
    
    // Create the WAV file
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Write audio data
    const volume = 1;
    let index = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = Math.max(-1, Math.min(1, renderedBuffer.getChannelData(channel)[i]));
        view.setInt16(index, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        index += 2;
      }
    }
    
    resolve(new Blob([buffer], { type: 'audio/wav' }));
  });
  
  return wavBlob;
}

// Helper function to write strings to DataView
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Function that mimics shell's base64 -w 0 command
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    // Use a FileReader to read as Data URL (which includes base64)
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // Get the result as string
        const dataUrl = reader.result as string;
        // Extract the base64 part (remove the data:audio/wav;base64, prefix)
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file data'));
    };
    
    // Read as Data URL which gives us a base64 representation
    reader.readAsDataURL(blob);
  });
}

// Helper functions
const isIntentAnalysisMessage = (message: AIMessage): boolean => {
  if (message.sender !== 'ai' && message.sender !== 'mcp') return false;
  
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

const extractOperationKeywords = (aiResponse: AIMessage): string[] => {
  try {
    if (aiResponse.execution_plan?.steps) {
      const steps = aiResponse.execution_plan.steps;
      if (Array.isArray(steps) && steps.length > 0) {
        console.log("[useVoiceRecorder] Extracting operations from execution_plan steps:", steps);
        
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
        if (aiResponse._rawJsonContent) {
          const parsedJson = JSON.parse(aiResponse._rawJsonContent);
          if (parsedJson.execution_plan?.steps && Array.isArray(parsedJson.execution_plan.steps)) {
            console.log("[useVoiceRecorder] Extracted execution_plan from processed JSON");
            return parsedJson.execution_plan.steps.map((step: any) => {
              return step.action || step.mcp || "process";
            });
          }
        }
      } catch (error) {
        console.log("[useVoiceRecorder] Could not parse JSON from content:", error);
      }
    }
    
    if (aiResponse.content && aiResponse.content.includes("intent_analysis")) {
      try {
        if (aiResponse._rawJsonContent) {
          const parsedJson = JSON.parse(aiResponse._rawJsonContent);
          if (parsedJson.intent_analysis?.task_decomposition) {
            return parsedJson.intent_analysis.task_decomposition.map((task: any) => {
              return task.action || "process";
            });
          }
        }
      } catch (error) {
        console.log("[useVoiceRecorder] Could not parse intent_analysis from content:", error);
      }
    }
    
    return ["process"];
  } catch (error) {
    console.error("[useVoiceRecorder] Error extracting operation keywords:", error);
    return ["process"];
  }
};

const extractSummaryFromIntentAnalysis = (aiResponse: AIMessage): string => {
  try {
    if (aiResponse.intent_analysis) {
      const intentAnalysis = aiResponse.intent_analysis;
      
      if (intentAnalysis.request_understanding?.primary_goal) {
        return `I understand your goal is ${intentAnalysis.request_understanding.primary_goal}. How can I help you?`;
      }
      
      if (intentAnalysis.primary_goal) {
        return `I understand your goal is ${intentAnalysis.primary_goal}. How can I help you?`;
      }
      
      if (intentAnalysis.request_understanding) {
        return `I understand your request. How can I help you?`;
      }
    }
    
    if (aiResponse.content && (aiResponse.content.includes('"intent_analysis"') || aiResponse.content.includes('"request_understanding"'))) {
      try {
        if (aiResponse._rawJsonContent) {
          const parsedJson = JSON.parse(aiResponse._rawJsonContent);
          
          if (parsedJson.response) {
            return parsedJson.response;
          }
          
          if (parsedJson.intent_analysis?.request_understanding?.primary_goal) {
            return `I understand your goal is ${parsedJson.intent_analysis.request_understanding.primary_goal}. How can I help you?`;
          }
          
          if (parsedJson.intent_analysis?.primary_goal) {
            return `I understand your goal is ${parsedJson.intent_analysis.primary_goal}. How can I help you?`;
          }
        }
      } catch (error) {
        console.log("[useVoiceRecorder] Error extracting from JSON content:", error);
      }
    }
    
    return aiResponse.content;
  } catch (error) {
    console.error("[useVoiceRecorder] Error extracting summary from intent analysis:", error);
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

// Helper function to check if a string is valid JSON
const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const useVoiceRecorder = () => {
  const { addDirectMessage } = useChat();
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(true);
  const blobUrlRef = useRef<string | null>(null);
  const [pendingProtocolData, setPendingProtocolData] = useState<any>(null);

  // Check if microphone is supported
  useEffect(() => {
    const checkMicSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setIsMicSupported(true);
      } catch (err) {
        console.error("Microphone access error:", err);
        setIsMicSupported(false);
      }
    };
    
    checkMicSupport();
  }, []);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/webm" }
  });

  // Track changes to mediaBlobUrl with a ref
  useEffect(() => {
    if (mediaBlobUrl) {
      console.log("[useVoiceRecorder] mediaBlobUrl updated:", mediaBlobUrl);
      blobUrlRef.current = mediaBlobUrl;
    }
  }, [mediaBlobUrl]);

  const isRecording = status === "recording";

  const handleStartRecording = () => {
    console.log("[useVoiceRecorder] Starting recording");
    setRecordingComplete(false);
    blobUrlRef.current = null;
    clearBlobUrl();
    startRecording();
    
    toast({
      title: "Recording started",
      description: "Speak now and click Finish when done.",
    });
  };

  const handleStopRecording = async (): Promise<AIMessage[] | null> => {
    console.log("[useVoiceRecorder] Stopping recording, status:", status, "mediaBlobUrl:", mediaBlobUrl, "blobUrlRef:", blobUrlRef.current);
    
    if (status !== "recording" && !mediaBlobUrl && !blobUrlRef.current) {
      console.log("[useVoiceRecorder] No recording to process");
      return null;
    }

    setIsProcessing(true);
    
    try {
      // If still recording, stop it
      if (status === "recording") {
        stopRecording();
        
        // Wait for mediaBlobUrl to be available with progressive timeouts
        let attempts = 0;
        const maxAttempts = 30;
        const initialDelay = 200;
        
        while (!mediaBlobUrl && !blobUrlRef.current && attempts < maxAttempts) {
          console.log(`[useVoiceRecorder] Waiting for mediaBlobUrl, attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(1.2, attempts)));
          attempts++;
        }
      }

      // Use either the current mediaBlobUrl or the one stored in the ref
      const currentBlobUrl = mediaBlobUrl || blobUrlRef.current;
      
      if (!currentBlobUrl) {
        console.error("[useVoiceRecorder] No mediaBlobUrl available after recording");
        toast({
          title: "Recording error",
          description: "Could not process the audio recording. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      console.log("[useVoiceRecorder] Fetching audio blob from URL:", currentBlobUrl);
      
      // Get the blob from the media URL
      const audioBlob = await fetch(currentBlobUrl).then(r => r.blob());
      
      if (audioBlob.size < 100) {
        console.error("[useVoiceRecorder] Audio blob too small:", audioBlob.size);
        toast({
          title: "Recording too short",
          description: "The recording was too short to process. Please try again.",
          variant: "destructive"
        });
        return null;
      }
      
      console.log("[useVoiceRecorder] Audio blob size:", audioBlob.size);
      console.log("[useVoiceRecorder] Audio blob type:", audioBlob.type);
      
      try {
        // Convert to WAV format
        const wavBlob = await convertToWav(audioBlob);
        console.log("[useVoiceRecorder] Converted to WAV, size:", wavBlob.size);
        
        // Convert WAV blob to base64 using simplified method
        console.log("[useVoiceRecorder] Converting WAV to base64 (mimicking base64 -w 0 command)");
        const base64Data = await blobToBase64(wavBlob);
        console.log("[useVoiceRecorder] Base64 conversion successful, length:", base64Data.length);
        
        const { response, messageId, transcript } = await processVoiceData(wavBlob, false);
        console.log("[useVoiceRecorder] Voice processed successfully, messageId:", messageId);
        
        setRecordingComplete(true);

        // Register the audio URL with the legacy system so it can be played back
        if (currentBlobUrl && messageId) {
          registerMessageAudio(messageId, currentBlobUrl);
        }

        // Create user voice message
        const userMessage: AIMessage = {
          id: messageId,
          sender: 'user',
          content: transcript ? `🎤 Voice Input: "${transcript}"` : "🎤 [Voice message recorded]",
          timestamp: new Date(),
          isVoiceMessage: true,
          audioProgress: 0,
          isPlaying: false,
          transcript,
          voiceData: base64Data,
          messageType: 'voice',
          metadata: {
            audioFormat: 'audio/wav',
            recordingTimestamp: Date.now(),
            hasTranscript: !!transcript,
            voiceDataSize: base64Data.length,
            messageRole: 'voice_input'
          }
        };

        // Process AI response to extract execution plan and other structured data
        let processedResponse = response;
        let executionPlan;
        let intentAnalysis;
        let displayContent;

        try {
          // Clean and process the response similar to ChatContext
          const cleanedContent = cleanJsonString(response);
          const fixedJson = fixMalformedJson(cleanedContent);
          const parsedJson = safeJsonParse(fixedJson);

          if (parsedJson) {
            // Store the processed JSON content
            processedResponse = fixedJson;

            // Extract structured data
            if (parsedJson.execution_plan) {
              executionPlan = parsedJson.execution_plan;
            }
            if (parsedJson.intent_analysis) {
              intentAnalysis = parsedJson.intent_analysis;
            }
            if (parsedJson.response) {
              displayContent = parsedJson.response;
            }
          }
        } catch (error) {
          console.error("[useVoiceRecorder] Error processing AI response:", error);
        }

        // Create AI response message with structured data
        const aiMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: processedResponse,
          timestamp: new Date(),
          messageType: 'text',
          _displayContent: displayContent,
          _rawJsonContent: processedResponse,
          execution_plan: executionPlan,
          intent_analysis: intentAnalysis,
          metadata: {
            responseType: 'voice_processing',
            processingTimestamp: Date.now(),
            messageRole: 'voice_response'
          }
        };

        console.log("[useVoiceRecorder] Created messages:", {
          voiceMessage: {
            id: userMessage.id,
            type: userMessage.messageType,
            hasTranscript: !!userMessage.transcript,
            hasVoiceData: !!userMessage.voiceData
          },
          aiResponse: {
            id: aiMessage.id,
            type: aiMessage.messageType,
            hasExecutionPlan: !!aiMessage.execution_plan,
            hasIntentAnalysis: !!aiMessage.intent_analysis,
            hasDisplayContent: !!aiMessage._displayContent
          }
        });

        return [userMessage, aiMessage];
      } catch (error) {
        console.error("[useVoiceRecorder] Error converting audio to base64:", error);
        toast({
          title: "Conversion Error",
          description: "Failed to convert audio recording. Please try again.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("[useVoiceRecorder] Error processing voice:", error);
      toast({
        title: "Error processing voice",
        description: "There was an error processing your voice recording",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    console.log("[useVoiceRecorder] Canceling recording");
    if (status === "recording") {
      stopRecording();
    }
    blobUrlRef.current = null;
    clearBlobUrl();
    setRecordingComplete(false);
    setIsProcessing(false);
    
    toast({
      title: "Recording cancelled",
      description: "Voice recording has been cancelled",
    });
  };

  /**
   * Initialize and start a protocol with voice data
   * @param voiceData The processed voice data
   * @param aiMessage The AI message containing execution plan
   * @returns The initialized context ID and first protocol message if successful, null otherwise
   */
  const protocolStarting = async (voiceData: any, aiMessage: AIMessage): Promise<{ contextId: string; message: AIMessage } | null> => {
    try {
      console.log("[useVoiceRecorder] Starting protocol with voice data");
      
      // Ensure we have the base64 voice data
      if (!voiceData.voiceData) {
        console.error("[useVoiceRecorder] No base64 voice data available");
        toast({
          title: "Protocol Error",
          description: "Voice data not properly formatted for protocol",
          variant: "destructive"
        });
        return null;
      }

      // Extract operation keywords from execution plan
      const operationKeywords = aiMessage.execution_plan?.steps?.map(step => {
        if (step.mcp && step.action) {
          return `${step.mcp}::${step.action}`;
        }
        return step.action || 'process';
      }) || ['process'];

      console.log("[useVoiceRecorder] Operation keywords:", operationKeywords);

      // Initialize protocol context with raw voice data
      const protocolHandler = AIOProtocolHandler.getInstance();
      const contextId = `voice-protocol-${Date.now()}`;
      
      const context = await protocolHandler.init_stable_context(
        contextId,
        voiceData.voiceData,
        operationKeywords.join(','),
        aiMessage.execution_plan
      );

      if (!context) {
        console.error("[useVoiceRecorder] Failed to initialize protocol context");
        toast({
          title: "Protocol Error",
          description: "Failed to initialize protocol with voice data",
          variant: "destructive"
        });
        return null;
      }

      console.log("[useVoiceRecorder] Will execute protocol step by step with context:", context);
      addDirectMessage(`Starting voice protocol execution (ID: ${contextId})`);

      // 执行每个步骤
      let finalResult = null;
      for (let i = 0; i < operationKeywords.length; i++) {
        const stepResult = await protocolHandler.calling_next(contextId, "", addDirectMessage);
        if (!stepResult.success) {
          throw new Error(stepResult.message);
        }
        
        // 更新步骤结果
        const updatedContext = await protocolHandler.calling_step_by_step(contextId, "" ,addDirectMessage);
        if (!updatedContext) {
          throw new Error("Failed to update step result");
        }
        finalResult = stepResult.data;
      }

      // 创建最终消息
      const finalMessage: AIMessage = {
        id: `aio-protocol-result-${Date.now()}`,
        sender: 'ai',
        content: typeof finalResult === 'string' ? finalResult : extractJsonResponseToList(finalResult.output),
        timestamp: new Date(),
        protocolContext: {
          contextId,
          currentStep: operationKeywords.length,
          totalSteps: operationKeywords.length,
          isComplete: true,
          status: 'completed',
          metadata: {
            operation: context.opr_keywd[context.curr_call_index - 1] || '',
            mcp: context.step_mcps?.[context.curr_call_index - 1] || '',
            intentLLMInput: extractJsonResponseToValueString(finalResult.output)
          }
        }
      };

      // 调用 LLM 获取意图分析结果
      if (finalMessage.protocolContext?.metadata?.intentLLMInput) {
        console.log("[useVoiceRecorder] LLM intent analysis input:", finalMessage.protocolContext.metadata.intentLLMInput);
        let intentResult = await sendMessage(finalMessage.protocolContext.metadata.intentLLMInput, new Array<AttachedFile>());
        console.log("[useVoiceRecorder] LLM intent analysis result:", intentResult);
        finalMessage.content = intentResult.content;
      }

      console.log("[useVoiceRecorder] Protocol started successfully:", contextId);
      handleVoiceIntentResponse(finalMessage);
      return {
        contextId,
        message: finalMessage
      };
    } catch (error) {
      console.error("[useVoiceRecorder] Error starting protocol:", error);
      toast({
        title: "Protocol Error",
        description: "Failed to start protocol: " + error.message,
        variant: "destructive"
      });
      return null;
    }
  };
  
  const handleVoiceIntentResponse = async (aiResponse: AIMessage) => {
    console.log('[useVoiceRecorder-intent] Processing voice intent response:', aiResponse);
    
    try {
      // Process JSON content in the AI response
      if (aiResponse.content) {
        try {
          console.log('[useVoiceRecorder-intent] Starting JSON content processing');
          
          let processedContent = aiResponse.content;
          let parsed = null;

          // First check if the content is already valid JSON
          if (isValidJson(processedContent)) {
            console.log('[useVoiceRecorder-intent] Content is already valid JSON');
            parsed = JSON.parse(processedContent);
          } else {
            // If not valid JSON, try cleaning and fixing
            console.log('[useVoiceRecorder-intent] Content needs cleaning and fixing');
            const cleanedContent = cleanJsonString(processedContent);
            console.log('[useVoiceRecorder-intent] Cleaned content:', cleanedContent);
            
            // Check if cleaned content is valid JSON
            if (isValidJson(cleanedContent)) {
              console.log('[useVoiceRecorder-intent] Cleaned content is valid JSON');
              parsed = JSON.parse(cleanedContent);
            } else {
              // If still not valid, try fixing malformed JSON
              console.log('[useVoiceRecorder-intent] Attempting to fix malformed JSON');
              const fixedJson = fixMalformedJson(cleanedContent);
              console.log('[useVoiceRecorder-intent] Fixed JSON:', fixedJson);
              
              // Check if fixed content is valid JSON
              if (isValidJson(fixedJson)) {
                console.log('[useVoiceRecorder-intent] Fixed content is valid JSON');
                parsed = JSON.parse(fixedJson);
              } else {
                // If still not valid, try safe parsing
                console.log('[useVoiceRecorder-intent] Attempting safe JSON parse');
                parsed = safeJsonParse(fixedJson);
              }
            }
          }
          
          if (parsed) {
            console.log('[useVoiceRecorder-intent] Successfully parsed JSON');
            // Store the processed JSON content
            aiResponse._rawJsonContent = JSON.stringify(parsed);
            
            // Extract structured data from markdown sections
            const markdownData = extractJsonFromMarkdownSections(aiResponse.content);
            if (markdownData) {
              console.log('[useVoiceRecorder-intent] Found markdown sections:', markdownData);
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
              const response = extractResponseFromRawJson(aiResponse.content);
              if (response) {
                aiResponse._displayContent = response;
              }
            }
          }
        } catch (error) {
          console.error('[useVoiceRecorder-intent] Error processing JSON content:', error);
        }
      }
      
      if (isIntentAnalysisMessage(aiResponse)) {
        console.log('[useVoiceRecorder-intent] Detected intent analysis');
        
        let executionPlan = aiResponse.execution_plan;
        console.log('[useVoiceRecorder-intent] Execution plan:', executionPlan);
        
        if (!executionPlan && aiResponse.content && aiResponse.content.includes("execution_plan")) {
          try {
            if (aiResponse._rawJsonContent) {
              const parsedJson = JSON.parse(aiResponse._rawJsonContent);
              if (parsedJson.execution_plan) {
                executionPlan = parsedJson.execution_plan;
                console.log('[useVoiceRecorder-intent] Extracted execution_plan from processed JSON');
              }
            }
          } catch (error) {
            console.log("[useVoiceRecorder-intent] Could not parse JSON from content:", error);
          }
        }
        
        const operationKeywords = extractOperationKeywords(aiResponse);
        console.log('[useVoiceRecorder-intent] Extracted operation keywords:', operationKeywords);
        
        if (operationKeywords.length > 0) {
          const newPendingData = {
            operationKeywords,
            executionPlan,
            stepCount: operationKeywords.length
          };
          
          setPendingProtocolData(newPendingData);
          
          const enhancedResponse = enhanceAIMessageWithSummary(aiResponse);
          addDirectMessage(
            `Voice protocol is ready with ${operationKeywords.length} steps. Type "/run" or click the "Execute" button to start.`
          );
          
          return enhancedResponse;
        }
      }
      
      return aiResponse;
      
    } catch (error) {
      console.error("[useVoiceRecorder] Error processing voice intent response:", error);
      toast({
        title: "Processing Error",
        description: "Error processing voice intent response",
        variant: "destructive"
      });
      return aiResponse;
    }
  };

  return {
    isRecording,
    isMicSupported,
    isProcessing,
    recordingComplete,
    mediaBlobUrl: mediaBlobUrl || blobUrlRef.current,
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    cancelRecording: handleCancel,
    protocolStarting,
    handleVoiceIntentResponse,
    pendingProtocolData
  };
};
