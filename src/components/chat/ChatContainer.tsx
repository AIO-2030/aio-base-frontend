import { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import QueenLogo from '../QueenLogo';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import VoiceRecordingDialog from './VoiceRecordingDialog';
import { useChat } from '@/contexts/ChatContext';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useFileAttachments } from '@/hooks/useFileAttachments';
import { AttachedFile } from '@/components/chat/ChatFileUploader';
import { AIOProtocolHandler } from '@/runtime/AIOProtocolHandler';
import { toast } from '@/components/ui/use-toast';

const ChatContainer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);
  const executeStepRef = useRef<(stepIndex: number, consecutiveFailures?: number) => Promise<void>>();
  
  const { 
    message, 
    setMessage, 
    messages, 
    setMessages, 
    handleSendMessage,
    addDirectMessage,
    handleProtocolStep: executeProtocolStep,
    activeProtocolContextId,
    pendingProtocolData,
    setPendingProtocolData,
    confirmAndRunProtocol,
    setActiveProtocolContextId
  } = useChat();
  
  const {
    isRecording,
    isMicSupported,
    isProcessing,
    recordingComplete,
    mediaBlobUrl,
    startRecording,
    stopRecording,
    cancelRecording,
    protocolStarting
  } = useVoiceRecorder();
  
  const {
    attachedFiles,
    handleFileAttached,
    handleFileRemoved,
    clearAttachedFiles,
    updateMessagesWithFilePreview,
    removeFilePreviewFromMessages
  } = useFileAttachments();

  useEffect(() => {
    console.log("[ChatContainer] Initialized with", messages.length, "messages");
  }, []);
  
  useEffect(() => {
    console.log("[ChatContainer] Messages updated, count:", messages.length);
  }, [messages]);

  // Remove automatic protocol execution - we'll rely on user commands only
  // The old effect has been removed

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Parse for protocol commands in the message
  const checkForProtocolCommands = (message: string): boolean => {
    // Check for '/run' command to execute pending protocol
    if (message.trim() === '/run') {
      if (pendingProtocolData) {
        confirmAndRunProtocol();
        return true;
      } else if (activeProtocolContextId) {
        // Instead of showing an error, restart protocol execution
        addDirectMessage("Restarting protocol execution...");
        
        // Get the protocol handler and context
        const protocolHandler = AIOProtocolHandler.getInstance();
        const context = protocolHandler.getContext(activeProtocolContextId);
        
        if (context) {
          // Reset the step counter
          context.curr_call_index = 0;
          
          // Add a message to indicate protocol is starting
          addDirectMessage(`Starting protocol execution with ${context.opr_keywd.length} steps...`);
          
          // Start execution from the first step
          setTimeout(() => {
            executeStepRef.current?.(0, 0);
          }, 1000);
        } else {
          addDirectMessage("Protocol context not found. Please send a new request.");
        }
        return true;
      } else {
        addDirectMessage("No pending protocol to run. Please send a request first.");
        return true;
      }
    }
    
    // Check for '/stop' command to stop protocol execution
    if (message.trim() === '/stop') {
      if (activeProtocolContextId) {
        addDirectMessage("Stopping protocol execution...");
        handleProtocolReset();
        return true;
      } else if (pendingProtocolData) {
        // Clear pending protocol data
        setPendingProtocolData(null);
        addDirectMessage("Pending protocol has been cleared.");
        return true;
      } else {
        addDirectMessage("No active protocol to stop.");
        return true;
      }
    }
    
    // Protocol command format: /aio:protocol <action> [params]
    const protocolRegex = /^\/aio:protocol\s+(\w+)(?:\s+(.+))?$/i;
    const match = message.trim().match(protocolRegex);
    
    if (!match) return false;
    
    const [_, action, paramsStr] = match;
    const params = paramsStr ? paramsStr.trim().split(/\s+/) : [];
    
    console.log("[ChatContainer] Protocol command detected:", action, params);
    
    // Handle different protocol actions
    switch (action.toLowerCase()) {
      case 'step':
        handleProtocolStepCommand(params);
        break;
      case 'reset':
        handleProtocolReset();
        // Also reset any pending protocol data
        if (pendingProtocolData) {
          setPendingProtocolData(null);
          addDirectMessage("Pending protocol has been reset.");
        }
        break;
      case 'run':
        if (pendingProtocolData) {
          confirmAndRunProtocol();
        } else if (activeProtocolContextId) {
          // Reuse the same logic as the "run" command
          addDirectMessage("Restarting protocol execution...");
          
          // Get the protocol context
          const protocolHandler = AIOProtocolHandler.getInstance();
          const context = protocolHandler.getContext(activeProtocolContextId);
          
          if (context) {
            // Reset the step counter
            context.curr_call_index = 0;
            
            // Start execution
            setTimeout(() => {
              executeStepRef.current?.(0, 0);
            }, 1000);
          } else {
            addDirectMessage("Protocol context not found. Please send a new request.");
          }
        } else {
          addDirectMessage("No pending protocol to run. Please send a request first.");
        }
        break;
      default:
        addDirectMessage(`Unknown protocol command: ${action}. Available commands: step, reset, run`);
        break;
    }
    
    return true;
  };
  
  // Execute a step in the protocol sequence - this function is kept for the user to manually run steps
  const handleProtocolStepCommand = async (params: string[]) => {
    try {
      if (!activeProtocolContextId) {
        addDirectMessage("No active protocol sequence. Wait for the AI to initialize one in its response.");
        return;
      }
      
      // Get API endpoint from params or use default
      const apiEndpoint = params.length > 0 
        ? params[0] 
        : "/api/aio/protocol";
      
      addDirectMessage(`Starting protocol execution with endpoint: ${apiEndpoint}. All steps will be executed automatically.`);
      
      // Get the protocol context to check how many steps exist
      const protocolHandler = AIOProtocolHandler.getInstance();
      const context = protocolHandler.getContext(activeProtocolContextId);
      
      if (!context) {
        console.error("[ChatContainer] Protocol context not found");
        addDirectMessage("Protocol context not found. Please try again.");
        return;
      }
      
      // Reset to first step and execute all steps
      context.curr_call_index = 0;
      
      // Execute first step with retry logic
      executeStepRef.current?.(0, 0);
    } catch (error) {
      console.error("[ChatContainer] Error executing protocol step:", error);
      addDirectMessage(`Failed to execute protocol step: ${error}`);
    }
  };
  
  // Reset the active protocol
  const handleProtocolReset = () => {
    if (activeProtocolContextId) {
      // Delete the context to reset it
      const protocolHandler = AIOProtocolHandler.getInstance();
      protocolHandler.deleteContext(activeProtocolContextId);
      
      // Clear the active protocol context ID
      setActiveProtocolContextId(null);
      
      addDirectMessage(`Protocol context ${activeProtocolContextId} has been reset`);
    } else {
      addDirectMessage("No active protocol to reset");
    }
  };

  // Define the step execution function, but don't auto-run it
  useEffect(() => {
    const executeStep = async (stepIndex: number, consecutiveFailures = 0) => {
      try {
        if (!activeProtocolContextId) {
          return; // No active context, don't proceed
        }
        
        const protocolHandler = AIOProtocolHandler.getInstance();
        const context = protocolHandler.getContext(activeProtocolContextId);
        
        if (!context || stepIndex >= context.opr_keywd.length) {
          console.log("[ChatContainer] Protocol execution complete or context lost");
          return;
        }
        
        console.log(`[ChatContainer] Executing protocol step ${stepIndex + 1} of ${context.opr_keywd.length}`);
        
        // Set the current step in the context
        context.curr_call_index = stepIndex;
        
        // Check if this is the last step
        const isLastStep = stepIndex === context.opr_keywd.length - 1;
        
        // Execute the current step
        try {
          await executeProtocolStep(activeProtocolContextId, "/api/aio/protocol");
        
          // Wait for UI to update
          await new Promise(resolve => setTimeout(resolve, 500));
        
          // Continue to next step if not the last step
          if (!isLastStep) {
            // Add a progress message that shows current step number and total steps
            addDirectMessage(`Continuing to step ${stepIndex + 2} of ${context.opr_keywd.length}...`);
          
            // Continue with the next step after a short delay
            setTimeout(() => {
              executeStep(stepIndex + 1, 0); // Reset consecutive failures counter for next step
            }, 1000);
          } else {
            addDirectMessage("Protocol execution completed.");
          }
        } catch (stepError) {
          // Step failed, check the error message
          console.error(`[ChatContainer] Error executing protocol step ${stepIndex + 1}:`, stepError);
          
          // Check if this is a "No response message" error
          const isNoResponseError = stepError.message && 
            stepError.message.includes("No response message returned from protocol step");
          
          // Increment failure counter if it's a no response error
          const newFailureCount = isNoResponseError ? consecutiveFailures + 1 : consecutiveFailures;
          
          // Add error message to chat
          addDirectMessage(`Protocol step ${stepIndex + 1} failed: ${stepError.message}`);
          
          // Check if we've hit the retry limit (3 attempts)
          if (newFailureCount >= 3) {
            console.log(`[ChatContainer] Protocol step ${stepIndex + 1} failed ${newFailureCount} times, aborting execution`);
            addDirectMessage("Protocol execution aborted after 3 failed attempts.");
            
            // Clean up protocol context
            handleProtocolReset();
            return;
          } else if (isNoResponseError) {
            // Retry the same step after a short delay
            addDirectMessage(`Retrying step ${stepIndex + 1} (attempt ${newFailureCount + 1} of 3)...`);
            
            setTimeout(() => {
              executeStep(stepIndex, newFailureCount);
            }, 2000);
            return;
          } else {
            // Different error, abort execution
            addDirectMessage("Protocol execution aborted due to step failure.");
            return;
          }
        }
      } catch (error) {
        console.error(`[ChatContainer] Error in step execution flow for step ${stepIndex + 1}:`, error);
        addDirectMessage(`Protocol execution error: ${error.message}`);
        
        // Clean up protocol context on fatal error
        handleProtocolReset();
        return;
      }
    };
    
    // Store the executeStep function in the ref so it can be accessed from other functions
    executeStepRef.current = executeStep;
  }, [addDirectMessage, executeProtocolStep, handleProtocolReset]);

  const onSendMessage = async () => {
    if (message.trim() === '' && attachedFiles.length === 0) return;
    
    const currentMessage = message;
    const currentFiles = [...attachedFiles];
    
    setMessage('');
    clearAttachedFiles();
    
    // Check if this is a protocol command
    if (checkForProtocolCommands(currentMessage)) {
      return; // Protocol command was handled
    }
    
    // Regular message handling
    await handleSendMessage(currentMessage, currentFiles);
  };
  
  const onFileAttached = (fileId: string, fileInfo: AttachedFile) => {
    const newFiles = handleFileAttached(fileId, fileInfo);
    const updatedMessages = updateMessagesWithFilePreview(messages, newFiles);
    setMessages(updatedMessages);
  };
  
  const onFileRemoved = (fileId: string) => {
    const updatedFiles = handleFileRemoved(fileId);
    const updatedMessages = removeFilePreviewFromMessages(messages, updatedFiles);
    setMessages(updatedMessages);
  };

  const handleStartRecording = () => {
    setIsRecordingDialogOpen(true);
    startRecording();
  };
  
  const handleStopRecording = async () => {
    const newMessages = await stopRecording();
    if (newMessages) {
      setIsRecordingDialogOpen(false);
      setMessages(prev => [...prev, ...newMessages]);
      
      // Find voice input and AI response messages by their roles
      const voiceMessage = newMessages.find(msg => msg.metadata?.messageRole === 'voice_input');
      const aiMessage = newMessages.find(msg => msg.metadata?.messageRole === 'voice_response');
      
      if (!voiceMessage || !aiMessage) {
        console.error("[ChatContainer] Could not find voice input or AI response messages");
        return;
      }
      
      // Log messages with clear labels
      console.log("[ChatContainer] Voice Recording Messages:", {
        voiceMessage: {
          id: voiceMessage.id,
          type: voiceMessage.messageType,
          content: voiceMessage.content,
          hasVoiceData: !!voiceMessage.voiceData?.length,
          transcript: voiceMessage.transcript
        },
        aiResponse: {
          id: aiMessage.id,
          type: aiMessage.messageType,
          content: aiMessage.content,
          hasProtocolContext: !!aiMessage.protocolContext,
          hasExecutionPlan: !!aiMessage.execution_plan
        }
      });
      
      // Check if we have an AI response message that might trigger a protocol
      if (aiMessage && aiMessage.execution_plan) {
        console.log("[ChatContainer] AI message contains execution plan:", {
          executionPlan: aiMessage.execution_plan
        });
        
        console.log("[ChatContainer] Starting protocol with voice data:", {
          messageId: voiceMessage.id,
          hasVoiceData: !!voiceMessage.voiceData,
          transcript: voiceMessage.transcript
        });
        
        const result = await protocolStarting(voiceMessage, aiMessage);
        
        if (result) {
          console.log("[ChatContainer] Protocol started successfully:", {
            contextId: result.contextId,
            protocolMessage: result.message
          });
          
          // Protocol started successfully
          setMessages(prev => [...prev, result.message]);
          // Update the active protocol context ID
          setActiveProtocolContextId(result.contextId);
          
          // Add a message indicating protocol has started
          const stepCount = aiMessage.execution_plan?.steps?.length || 1;
          addDirectMessage(
            `🎤 Voice protocol initialized and started:\n` +
            `• Message ID: ${voiceMessage.id}\n` +
            `• Protocol ID: ${result.contextId}\n` +
            `• Steps: ${stepCount}\n` +
            `• Transcript: "${voiceMessage.transcript || 'No transcript available'}"`
          );
        }
      }
    }
  };

  const handleCancelRecording = () => {
    cancelRecording();
    setIsRecordingDialogOpen(false);
  };

  // Add clearChatHistory function
  const clearChatHistory = () => {
    const initialMessage = messages[0]; // Keep the initial welcome message
    setMessages([initialMessage]);
    
    // Clear active protocol context if exists
    if (activeProtocolContextId) {
      handleProtocolReset();
    }
    
    // Clear pending protocol data
    if (pendingProtocolData) {
      setPendingProtocolData(null);
    }
    
    // Show confirmation toast
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared",
    });
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button 
          onClick={toggleExpand}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Open chat"
        >
          <Maximize2 size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-border/40 flex justify-between items-center">
        <QueenLogo size="sm" variant="sidebar" />
        {activeProtocolContextId && (
          <div className="text-xs font-mono text-muted-foreground px-2">
            Protocol Active: {activeProtocolContextId.substring(0, 8)}...
          </div>
        )}
        <div className="flex space-x-2">
          <button 
            onClick={toggleExpand}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary/80"
            aria-label="Minimize chat"
          >
            <Minimize2 size={16} />
          </button>
          <button 
            onClick={toggleExpand}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary/80"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessages 
          messages={messages} 
          setMessages={setMessages} 
        />
        
        <div className="mt-auto sticky bottom-0 bg-background">
          <ChatInput 
            message={message}
            setMessage={setMessage}
            onSendMessage={onSendMessage}
            onStartRecording={handleStartRecording}
            isMicSupported={isMicSupported}
            attachedFiles={attachedFiles}
            onFileAttached={onFileAttached}
            onFileRemoved={onFileRemoved}
            onClearHistory={clearChatHistory}
          />
        </div>
      </div>
      
      {/* Voice recording dialog */}
      <VoiceRecordingDialog 
        isOpen={isRecordingDialogOpen}
        onOpenChange={setIsRecordingDialogOpen}
        isRecording={isRecording}
        isProcessing={isProcessing}
        recordingComplete={recordingComplete}
        mediaBlobUrl={mediaBlobUrl}
        onFinish={handleStopRecording}
        onCancel={handleCancelRecording}
      />
    </div>
  );
};

export default ChatContainer;
