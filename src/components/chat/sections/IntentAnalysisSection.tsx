import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
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

interface ProcessedAnalysis {
  primaryGoal: string;
  secondaryGoals: string[];
  modalities: string[];
  capabilityMapping: Record<string, any>;
}

interface IntentAnalysisSectionProps {
  content: string;
  hideTitle?: boolean;
  intentAnalysis?: {
    [x: string]: any;
  };
}

const IntentAnalysisSection: React.FC<IntentAnalysisSectionProps> = ({ 
  content, 
  hideTitle = false,
  intentAnalysis 
}) => {
  const processedContent = useMemo(() => {
    // If intentAnalysis is provided directly, use it
    if (intentAnalysis) {
      const result: ProcessedAnalysis = {
        primaryGoal: intentAnalysis.request_understanding?.primary_goal || 'Undefined',
        secondaryGoals: intentAnalysis.request_understanding?.secondary_goals || [],
        modalities: intentAnalysis.modality_analysis?.modalities || [],
        capabilityMapping: intentAnalysis.capability_mapping || {}
      };
      return result;
    }

    if (!content) return null;

    const contentFingerprint = createContentFingerprint(content);
    
    // Check for cached result first
    const cachedResult = getCachedResult(content);
    if (cachedResult) {
      console.log('[IntentAnalysisSection] Using cached result');
      return cachedResult;
    }
    
    // Check if content is already being processed and max attempts reached
    if (isContentBeingProcessed(content) && hasReachedMaxAttempts(content)) {
      console.log('[IntentAnalysisSection] Max processing attempts reached');
      return null;
    }
    
    // Mark content as being processed
    startContentProcessing(content);
    
    try {
      const cleanContent = removeJsonComments(content);
      const parsed = safeJsonParse(cleanContent);
      
      if (parsed?.intent_analysis) {
        const processedAnalysis: ProcessedAnalysis = {
          primaryGoal: parsed.intent_analysis.request_understanding?.primary_goal || 'Undefined',
          secondaryGoals: parsed.intent_analysis.request_understanding?.secondary_goals || [],
          modalities: parsed.intent_analysis.modality_analysis?.modalities || [],
          capabilityMapping: parsed.intent_analysis.capability_mapping || {}
        };
        
        // Store processed result in cache
        storeProcessedResult(content, processedAnalysis);
        
        return processedAnalysis;
      }
    } catch (error) {
      console.error('[IntentAnalysisSection] Processing error:', error);
    }
    
    return null;
  }, [content, intentAnalysis]);

  if (!processedContent) return null;

  return (
    <div className="p-4 mt-auto">
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-2 text-[#9b87f5]">
          <Info size={16} />
          <h3 className="font-semibold">Intent Analysis</h3>
        </div>
      )}
      <div className="prose prose-invert max-w-none">
        <h4 style={{ color: 'blue' }}>Primary Goal: </h4>
        <ul>
          <li>{processedContent.primaryGoal}</li>
        </ul>
          {processedContent.secondaryGoals.length > 0 && (
            <div>
              <h5 style={{ color: 'blue' }}>Secondary Goals:</h5>
            <ul>
              {processedContent.secondaryGoals.slice(0, 5).map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
              {processedContent.secondaryGoals.length > 5 && (
                <li key="more">And {processedContent.secondaryGoals.length - 5} more...</li>
              )}
            </ul>
          </div>
        )}
        {processedContent.modalities.length > 0 && (
          <div>
            <h5>Modalities:</h5>
            <ul>
              {processedContent.modalities.map((modality, index) => (
                <li key={index}>{modality}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntentAnalysisSection;
