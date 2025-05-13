
import { AIMessage } from '@/services/types/aiTypes';
import { formatProtocolMetadata } from '@/util/formatters';
import { Zap, Code, Server, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProtocolMessageProps {
  message: AIMessage;
  className?: string;
}

const ProtocolMessage = ({ message, className }: ProtocolMessageProps) => {
  const protocolContext = message.protocolContext;
  
  if (!protocolContext) {
    return null;
  }
  
  // Use available properties according to the type definition
  const currentStep = protocolContext.currentStep || 0;
  const totalSteps = protocolContext.totalSteps || 0;
  const isComplete = protocolContext.isComplete || false;
  const status = protocolContext.status || 'pending';
  const isFinalStep = status === 'completed' && currentStep === totalSteps;
  
  // Extract metadata for display if available
  const metadata = protocolContext.metadata || {};
  const operation = metadata.operation as string;
  const mcp = metadata.mcp as string;
  
  return (
    <div className={cn(
      "space-y-2", 
      isFinalStep ? "border-l-4 border-green-500 pl-3" : "",
      className
    )}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center text-primary">
          <Zap size={14} className="mr-1" />
          <span className="font-medium">
            Protocol Step {currentStep}/{totalSteps}: {isComplete ? "Complete" : "Processing"}
          </span>
        </div>
        
        {isFinalStep && (
          <div className="flex items-center text-green-600 font-medium">
            <CheckCircle2 size={14} className="mr-1" />
            Final Response
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 text-xs">
        {operation && (
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
            <Code size={12} />
            <span>Operation: {operation}</span>
          </div>
        )}
        
        {mcp && (
          <div className="flex items-center gap-1 bg-secondary/20 px-2 py-1 rounded-md">
            <Server size={12} />
            <span>MCP: {mcp}</span>
          </div>
        )}
      </div>
      
      {typeof message.content === 'string' && (
        <div className={cn(
          "whitespace-pre-wrap text-sm border-l-2 pl-3 py-1",
          isFinalStep ? "border-green-500 font-medium" : "border-primary/20"
        )}>
          {isFinalStep ? "🎯 " + message.content : message.content}
        </div>
      )}
      
      <div className="mt-2 border-t border-border pt-2 text-xs font-mono text-muted-foreground">
        <pre className="whitespace-pre-wrap">
          {formatProtocolMetadata(message._displayContent)}
        </pre>
      </div>
    </div>
  );
};

export default ProtocolMessage;
