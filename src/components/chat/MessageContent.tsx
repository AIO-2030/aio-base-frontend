import React, { useMemo } from 'react';
import { Mic, Info, MessageCircle, TerminalSquare } from 'lucide-react';
import { AIMessage } from '@/services/types/aiTypes';
import FilePreview from './FilePreview';
import MessageAudioPlayer from './MessageAudioPlayer';
import { cn } from '@/lib/utils';
import AIResponseCard from './AIResponseCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { 
  isAIOProtocolMessage,
  extractResponseFromRawJson
} from '@/util/formatters';

// Add logging utility
const logCheckpoint = (message: string, data?: any) => {
  console.log(`[MessageContent] ${message}`, data ? data : '');
};

interface MessageContentProps {
  message: AIMessage;
  onPlaybackChange: (messageId: string, audioElement: HTMLAudioElement | null) => void;
}

const MessageContent = ({ message, onPlaybackChange }: MessageContentProps) => {
  // Debug logging for message structure
  React.useEffect(() => {
    if (message.sender === 'ai' || message.sender === 'mcp') {
      logCheckpoint('Processing AI message', {
        id: message.id,
        hasIntentAnalysis: !!message.intent_analysis,
        hasExecutionPlan: !!message.execution_plan,
        hasProtocolContext: !!message.protocolContext,
        contentPreview: message.content?.substring(0, 100)
      });
      
      if (message.intent_analysis || message.execution_plan) {
        logCheckpoint('AI Response structure', {
          intentKeys: Object.keys(message.intent_analysis || {}),
          executionSteps: message.execution_plan?.steps?.length || 0
        });
      }
      
      if (message.protocolContext) {
        logCheckpoint('Protocol Context', message.protocolContext);
      }
    }
  }, [message]);

  // Check if this is a protocol message
  const isProtocolMessage = React.useMemo(() => {
    return isAIOProtocolMessage(message);
  }, [message]);

  // Check if the content appears to be a structured AI message
  const isStructuredResponse = useMemo(() => {
    if (!message.content || message.sender !== 'ai') {
      return false;
    }

    return !!message._rawJsonContent || 
           !!message.intent_analysis || 
           !!message.execution_plan ||
           !!message._displayContent;
  }, [message.content, message.sender, message._rawJsonContent, message.intent_analysis, message.execution_plan, message._displayContent]);

  // Render structured AI response with both button and response content
  const renderStructuredResponse = () => {
    logCheckpoint('Rendering structured AI response');
    
    try {
      // Use pre-processed content
      const responseContent = message._displayContent || message.content;
      
      // Return the structured response component
      return (
        <AIResponseCard 
          content={responseContent}
          intentAnalysis={message.intent_analysis}
          executionPlan={message.execution_plan}
          rawJson={message._rawJsonContent}
        />
      );
    } catch (error) {
      console.error("Error rendering structured response:", error);
      // Ultimate fallback
      return (
        <div className="prose prose-invert max-w-none">
          {message._displayContent || message.content || "Error displaying response"}
        </div>
      );
    }
  };

  // Render protocol message in modal
  const renderProtocolModal = () => {
    if (!isProtocolMessage) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <div className="flex items-center gap-2">
              <TerminalSquare size={16} />
              <span>View Protocol Results</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TerminalSquare size={20} className="text-primary" />
              <h3 className="text-lg font-semibold">Protocol Execution Results</h3>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Step {message.protocolContext?.currentStep} of {message.protocolContext?.totalSteps}
              </div>
              <div className="text-sm">
                Operation: {message.protocolContext?.metadata?.operation || 'N/A'}
              </div>
              {message.protocolContext?.metadata?.mcp && (
                <div className="text-sm">
                  MCP: {message.protocolContext.metadata.mcp}
                </div>
              )}
              {message.protocolContext?.status && (
                <div className="text-sm">
                  Status: <span className={cn(
                    "font-medium",
                    message.protocolContext.status === 'completed' && "text-green-500",
                    message.protocolContext.status === 'failed' && "text-red-500",
                    message.protocolContext.status === 'running' && "text-blue-500"
                  )}>
                    {message.protocolContext.status}
                  </span>
                </div>
              )}
              {message.protocolContext?.error && (
                <div className="text-sm text-red-500">
                  Error: {message.protocolContext.error}
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Result:</h4>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap break-words">
                  {message.content}
                </pre>
              </div>
            </div>

            {message.protocolContext?.isComplete && (
              <div className="text-sm text-green-500 mt-2">
                Protocol execution completed successfully
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Main render function
  const renderMessageContent = () => {
    // Add additional debug logging
    logCheckpoint('Beginning message rendering', {
      id: message.id,
      sender: message.sender,
      contentPreview: message.content?.substring(0, 50),
      hasRawJson: !!message._rawJsonContent
    });
    
    // Handle protocol messages
    if (isProtocolMessage) {
      return renderProtocolModal();
    }
    
    // Handle voice messages specifically
    if (message.isVoiceMessage) {
      logCheckpoint('Rendering voice message');
      return (
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground mb-1">
            <Mic size={14} className="mr-1" />
            <span className="text-xs">Voice Message</span>
          </div>
          
          {message.transcript && (
            <div className="text-sm italic text-muted-foreground mb-2">
              "{message.transcript}"
            </div>
          )}
          
          <MessageAudioPlayer
            messageId={message.id}
            audioProgress={message.audioProgress}
            isPlaying={message.isPlaying}
            onPlaybackChange={onPlaybackChange}
          />
          
          {typeof message.content === 'string' && !message.content.startsWith('🎤') && (
            <div className="whitespace-pre-wrap">
              {message.content}
            </div>
          )}
        </div>
      );
    }
    
    // Handle messages with file attachments
    if (message.attachedFiles && message.attachedFiles.length > 0) {
      logCheckpoint('Rendering message with attachments');
      return (
        <div className="space-y-3">
          {typeof message.content === 'string' && (
            <div className="whitespace-pre-wrap">
              {message.content}
            </div>
          )}
          
          <div className="grid gap-2">
            {message.attachedFiles.map((file) => (
              <FilePreview key={file.id} file={file} />
            ))}
          </div>
        </div>
      );
    }
    
    // Explicitly check if this is an AI message
    const isAIMessage = message.sender === 'ai' || message.sender === 'mcp';
    if (!isAIMessage) {
      logCheckpoint('Rendering user message');
      return (
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
      );
    }
    
    // Check if this is a message with JSON content that should show analysis button
    const shouldShowAnalysisButton = 
      isAIMessage && 
      (message._rawJsonContent || isStructuredResponse);
    console.log('[MessageContent] shouldShowAnalysisButton:', shouldShowAnalysisButton);
    console.log('[MessageContent] message._rawJsonContent:', message._rawJsonContent);
    console.log('[MessageContent] isStructuredResponse:', isStructuredResponse);
      
    if (shouldShowAnalysisButton) {
      logCheckpoint('Rendering message with analysis button');
      return renderStructuredResponse();
    }
    
    // Enhanced detection for plain text with URLs
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const hasUrls = message.content && urlPattern.test(message.content);
    
    // Check if content has code blocks or JSON-like structures
    const hasCodeBlocks = message.content && message.content.includes('```');
    const hasJsonStructure = message.content && 
                            (message.content.includes('{') || 
                             message.content.trim().startsWith('{'));
    
    // Improved detection for plain text with URLs
    const isPlainTextWithUrls = hasUrls && !hasCodeBlocks && !hasJsonStructure;
    
    // For plain text responses with URLs (prioritize this check)
    if (isAIMessage && isPlainTextWithUrls) {
      logCheckpoint('Rendering plain text with URLs');
      return (
        <div className="whitespace-pre-wrap break-words">
          {message._displayContent || message.content}
        </div>
      );
    }
    
    // For standard plain text without complex structure or formatting
    const isSimplePlainText = isAIMessage && 
                             !hasJsonStructure && 
                             !hasCodeBlocks && 
                             !isStructuredResponse;
    
    if (isSimplePlainText) {
      logCheckpoint('Rendering simple plain text');
      return (
        <div className="whitespace-pre-wrap break-words">
          {message._displayContent || message.content}
        </div>
      );
    }
    
    // Final fallback for any other type of message
    logCheckpoint('Rendering fallback text message');
    return (
      <div className="whitespace-pre-wrap break-words">
        {message._displayContent || message.content || "Could not render message content"}
      </div>
    );
  };
  
  // Render the content
  return renderMessageContent();
};

export default MessageContent;
