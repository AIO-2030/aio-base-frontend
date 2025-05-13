import React, { useMemo } from 'react';
import { Workflow } from 'lucide-react';
import {
  createContentFingerprint,
  getCachedResult,
  isContentBeingProcessed,
  startContentProcessing,
  storeProcessedResult,
  hasReachedMaxAttempts,
  hasComplexExecutionPlan
} from '@/util/json/processingTracker';
import { safeJsonParse, removeJsonComments } from '@/util/formatters';

interface ProcessedStep {
  id: number;
  mcp: string;
  action: string;
  dependencies: string[];
  synthetic?: boolean;
}

interface ExecutionStepsSectionProps {
  content: string;
  hideTitle?: boolean;
  executionPlan?: {
    steps?: Array<{
      mcp?: string | string[];
      action?: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
}

const ExecutionStepsSection: React.FC<ExecutionStepsSectionProps> = ({ 
  content, 
  executionPlan, 
  hideTitle = false 
}) => {
  const processedContent = useMemo(() => {
    // If executionPlan is provided directly, use it
    if (executionPlan?.steps) {
      // Limit the number of steps to process to prevent browser hanging
      const maxStepsToDisplay = 10;
      const stepsToProcess = executionPlan.steps.slice(0, maxStepsToDisplay);
      
      const processedSteps: ProcessedStep[] = stepsToProcess.map((step: any, index: number) => ({
        id: index + 1,
        mcp: step.mcp || 'Unspecified MCP',
        action: step.action || 'Undefined Action',
        dependencies: step.dependencies || [],
        synthetic: step.synthetic || false
      }));
      
      // Add indicator if steps were truncated
      if (executionPlan.steps.length > maxStepsToDisplay) {
        processedSteps.push({
          id: maxStepsToDisplay + 1,
          mcp: 'Additional Steps',
          action: `${executionPlan.steps.length - maxStepsToDisplay} more steps...`,
          dependencies: [],
          synthetic: true
        });
      }
      
      return processedSteps;
    }

    // Otherwise try to extract from content
    if (!content) return null;

    const contentFingerprint = createContentFingerprint(content);
    
    // Check for cached result first
    const cachedResult = getCachedResult(content);
    if (cachedResult) {
      console.log('[ExecutionStepsSection] Using cached result');
      return cachedResult;
    }
    
    // Check if content is already being processed and max attempts reached
    if (isContentBeingProcessed(content) && hasReachedMaxAttempts(content)) {
      console.log('[ExecutionStepsSection] Max processing attempts reached');
      return null;
    }
    
    // Mark content as being processed
    startContentProcessing(content);
    
    try {
      const cleanContent = removeJsonComments(content);
      const parsed = safeJsonParse(cleanContent);
      
      if (parsed?.execution_plan?.steps) {
        // Limit the number of steps to process to prevent browser hanging
        const maxStepsToDisplay = 10; 
        const stepsToProcess = parsed.execution_plan.steps.slice(0, maxStepsToDisplay);
        
        const processedSteps: ProcessedStep[] = stepsToProcess.map((step: any, index: number) => ({
          id: index + 1,
          mcp: step.mcp || 'Unspecified MCP',
          action: step.action || 'Undefined Action',
          dependencies: step.dependencies || []
        }));
        
        // Add indicator if steps were truncated
        if (parsed.execution_plan.steps.length > maxStepsToDisplay) {
          processedSteps.push({
            id: maxStepsToDisplay + 1,
            mcp: 'Additional Steps',
            action: `${parsed.execution_plan.steps.length - maxStepsToDisplay} more steps...`,
            dependencies: [],
            synthetic: true
          });
        }
        
        // Store processed result in cache
        storeProcessedResult(content, processedSteps);
        
        return processedSteps;
      }
    } catch (error) {
      console.error('[ExecutionStepsSection] Processing error:', error);
    }
    
    return null;
  }, [content, executionPlan]);

  if (!processedContent) return null;

  return (
    <div className="p-4 mt-auto">
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-2 text-[#9b87f5]">
          <Workflow size={16} />
          <h3 className="font-semibold">Execution Plan</h3>
        </div>
      )}
      <div className="prose prose-invert max-w-none">
        <ol>
          {processedContent.map((step) => (
            <li key={step.id} className={step.synthetic ? "opacity-70" : ""}>
              <strong>{step.mcp}::{step.action}</strong>
              {step.dependencies.length > 0 && (
                <div>
                  <small>Dependencies: {step.dependencies.join(', ')}</small>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ExecutionStepsSection;
