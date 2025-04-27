
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Info, Play, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import IntentAnalysisSection from './sections/IntentAnalysisSection';
import ExecutionStepsSection from './sections/ExecutionStepsSection';
import ResponseSection from './sections/ResponseSection';
import { 
  extractJsonFromMarkdownSections, 
  safeJsonParse, 
  removeJsonComments, 
  cleanJsonString,
  fixMalformedJson,
  fixBackslashEscapeIssues,
  aggressiveBackslashFix
} from '@/util/formatters';
import { Box, Tab, Tabs } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AIOProtocolHandler } from '@/runtime/AIOProtocolHandler';
import { useChat } from '@/contexts/ChatContext';
import { extractJsonFromCodeBlock } from '@/util/json/codeBlockExtractor';

interface AIResponseCardProps {
  content: string;
  intentAnalysis?: Record<string, any>;
  executionPlan?: {
    steps?: Array<{
      mcp?: string | string[];
      action?: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  isModal?: boolean;
  rawJson?: string;
}

interface ParsedData {
  intent_analysis?: Record<string, any>;
  execution_plan?: {
    steps?: Array<{
      mcp?: string | string[];
      action?: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  response?: string;
  _sourceContent?: string;
  _sourceRawJson?: string;
}

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
};

const AIResponseCard: React.FC<AIResponseCardProps> = ({ 
  content, 
  intentAnalysis, 
  executionPlan,
  isModal = false,
  rawJson
}) => {
  const [value, setValue] = React.useState(0);
  const { initProtocolContext, setActiveProtocolContextId, handleProtocolStep, activeProtocolContextId } = useChat();
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [parsedData, setParsedData] = React.useState<ParsedData | null>(null);
  
  const processedContentRef = React.useRef<{content?: string, rawJson?: string, processed: boolean}>({ processed: false });
  const shouldInitProtocolRef = React.useRef<boolean>(false);
  
  React.useEffect(() => {
    console.log('[AIResponseCard] Processing input data');
    
    if (parsedData && 
        parsedData._sourceContent === content && 
        parsedData._sourceRawJson === rawJson) {
      console.log('[AIResponseCard] Skipping re-parse, data already processed');
      return;
    }
    
    if (processedContentRef.current.content === content && 
        processedContentRef.current.rawJson === rawJson &&
        processedContentRef.current.processed) {
      console.log('[AIResponseCard] Skipping re-parse based on ref check');
      return;
    }
    
    processedContentRef.current = {
      content,
      rawJson,
      processed: true
    };
    
    if (!content && !rawJson) {
      console.log('[AIResponseCard] No content or rawJson available');
      setParsedData(null);
      return;
    }
    
    let result: ParsedData | null = null;
    console.log('[AIResponseCard] Attempting to parse AI response data');
    
    const isCreateVideoIntent = content?.includes('"primary_goal": "create_video"') || 
                              rawJson?.includes('"primary_goal": "create_video"');
    
    if (isCreateVideoIntent) {
      console.log('[AIResponseCard] Detected create_video intent, using simplified processing');
      const extractedResponse = content || rawJson || "";
      result = {
        intent_analysis: {
          request_understanding: {
            primary_goal: "create_video"
          }
        },
        response: "Processing video creation request. Please use the Execute button if you wish to proceed.",
        _sourceContent: content,
        _sourceRawJson: rawJson
      };
      
      setParsedData(result);
      return;
    }
    
    if (content && (
      content.includes("**Analysis:**") || 
      content.includes("**Execution Plan:**") || 
      content.includes("**Response:**")
    )) {
      console.log('[AIResponseCard] Found markdown sections, extracting structured data');
      const extractedData = extractJsonFromMarkdownSections(content);
      console.log('[AIResponseCard] Extracted data from markdown:', extractedData);
      if (extractedData && Object.keys(extractedData).length > 0) {
        console.log('[AIResponseCard] Successfully extracted data from markdown sections');
        result = extractedData as ParsedData;
      }
    }
    
    if (!result && rawJson) {
      try {
        console.log('[AIResponseCard] Attempting to extract from rawJson');
        let cleanJson = extractJsonFromCodeBlock(rawJson);
        
        try {
          const parsed = JSON.parse(cleanJson);
          console.log('[AIResponseCard] Successfully parsed JSON directly');
          result = parsed as ParsedData;
        } catch (e) {
          console.log('[AIResponseCard] Direct parse failed, trying with fixes');
          const cleanedJson = cleanJsonString(rawJson);
          const fixedJson = fixMalformedJson(cleanedJson);
          const parsed = safeJsonParse(fixedJson);
          
          if (parsed) {
            console.log('[AIResponseCard] Successfully parsed JSON using fixers');
            result = parsed as ParsedData;
          }
        }
      } catch (e) {
        console.log('[AIResponseCard] Error extracting from rawJson:', e);
      }
    }
    
    if (!result && content) {
      console.log('[AIResponseCard] Attempting to parse from content');
      try {
        let cleanContent = extractJsonFromCodeBlock(content);
        
        try {
          const parsed = JSON.parse(cleanContent);
          console.log('[AIResponseCard] Successfully parsed content JSON directly');
          result = parsed as ParsedData;
        } catch (e) {
          console.log('[AIResponseCard] Content direct parse failed, trying with fixes');
          const cleanedContent = cleanJsonString(content);
          const fixedContent = fixMalformedJson(cleanedContent);
          const parsed = safeJsonParse(fixedContent);
          
          if (parsed) {
            console.log('[AIResponseCard] Successfully parsed content JSON using fixers');
            result = parsed as ParsedData;
          }
        }
      } catch (e) {
        console.log('[AIResponseCard] Error parsing from content:', e);
      }
    }
    
    if (!result && content && content.trim() !== "") {
      console.log('[AIResponseCard] Creating minimal structured data from content');
      const contentLower = content.toLowerCase();
      let primaryGoal = "general_chat";
      
      if (contentLower.includes("hello") || contentLower.includes("hi there") || contentLower.includes("hey") ||
          contentLower.includes("greetings") || contentLower.includes("welcome")) {
        primaryGoal = "greeting";
      } else if (contentLower.includes("how can i assist") || contentLower.includes("how can i help") ||
                contentLower.includes("checking in") || contentLower.includes("what do you need")) {
        primaryGoal = "check_in";
      }
      
      result = {
        intent_analysis: {
          request_understanding: {
            primary_goal: primaryGoal
          },
          text_representation: content
        },
        response: content
      };
    }
    
    if (result && !result.intent_analysis?.text_representation && content) {
      if (!result.intent_analysis) {
        result.intent_analysis = {};
      }
      result.intent_analysis.text_representation = content;
    }
    
    if (result && !result.response && content) {
      result.response = content;
    }
    
    if (result) {
      result._sourceContent = content;
      result._sourceRawJson = rawJson;
    }
    
    console.log('[AIResponseCard] Final parsed result:', result);
    setParsedData(result);
  }, [content, rawJson]);
  
  const handleProtocolInit = () => {
    if (!parsedData || activeProtocolContextId) {
      return null;
    }
    
    const { intent_analysis, execution_plan } = parsedData;
    const operationKeywords: string[] = [];
    
    if (intent_analysis?.request_understanding?.primary_goal) {
      operationKeywords.push(intent_analysis.request_understanding.primary_goal);
    }
    
    if (execution_plan?.steps) {
      execution_plan.steps.forEach((step: any) => {
        if (step.action) {
          operationKeywords.push(step.action);
        }
      });
    }
    
    if (operationKeywords.length > 0) {
      console.log('[AIResponseCard] Initializing protocol context with keywords:', operationKeywords);
      const contextId = initProtocolContext(
        content,
        operationKeywords,
        execution_plan
      );
      
      if (contextId) {
        console.log('[AIResponseCard] Initialized protocol context:', contextId);
        setActiveProtocolContextId(contextId);
        return contextId;
      }
    }
    
    return null;
  };
  
  const getProcessedIntentAnalysis = () => {
    if (intentAnalysis && Object.keys(intentAnalysis).length > 0) {
      return JSON.stringify(processIntentAnalysisData(intentAnalysis));
    }
    
    if (parsedData?.intent_analysis) {
      return JSON.stringify(processIntentAnalysisData(parsedData.intent_analysis));
    }
    
    return content ? JSON.stringify({ primary_goal: "greeting" }) : "{}";
  };
  
  const processIntentAnalysisData = (data: Record<string, any>) => {
    const processedAnalysis = { ...data };
    
    delete processedAnalysis.text_representation;
    
    if (processedAnalysis.request_understanding) {
      if (!processedAnalysis.primary_goal && processedAnalysis.request_understanding.primary_goal) {
        processedAnalysis.primary_goal = processedAnalysis.request_understanding.primary_goal;
      }
      
      const fieldsToCheck = ['secondary_goals', 'constraints', 'preferences', 'background_info'];
      fieldsToCheck.forEach(field => {
        if (!processedAnalysis[field] && processedAnalysis.request_understanding[field]) {
          processedAnalysis[field] = processedAnalysis.request_understanding[field];
        }
      });
      
      delete processedAnalysis.request_understanding;
    }
    
    return processedAnalysis;
  };

  const shouldShowModalButton = (): boolean => {
    if (content?.includes("**Analysis:**") || 
        content?.includes("**Execution Plan:**") || 
        content?.includes("**Response:**")) {
      return true;
    }
    
    if (intentAnalysis || 
        executionPlan?.steps?.length || 
        parsedData?.execution_plan?.steps?.length || 
        parsedData?.intent_analysis) {
      return true;
    }
    
    if (content && content.trim() !== "" && 
        (content.includes("Hello") || 
         content.includes("Hi") || 
         content.includes("Hey") || 
         content.includes("assist") || 
         content.includes("help"))) {
      return true;
    }
    
    if (rawJson && rawJson.trim() !== "") {
      return true;
    }
    
    return false;
  };

  const getEffectiveExecutionPlan = () => {
    if (executionPlan && Object.keys(executionPlan).length > 0) {
      return executionPlan;
    }
    
    if (parsedData?.execution_plan) {
      return parsedData.execution_plan;
    }
    
    if (content) {
      if (content.includes('"primary_goal": "create_video"')) {
        return {
          steps: [{
            mcp: 'VideoGenerationMCP',
            action: 'create_video',
            synthetic: true
          }]
        };
      }
      
      const responsePatterns = [
        /respond/i, /reply/i, /answer/i, /chat/i, /greeting/i, /hello/i, /hi there/i,
        /checking in/i, /how can I assist/i, /how can I help/i
      ];
      
      if (responsePatterns.some(pattern => pattern.test(content))) {
        return {
          steps: [{
            mcp: 'TextUnderstandingMCP',
            action: 'respond',
            synthetic: true
          }]
        };
      }
    }
    
    if (parsedData?.intent_analysis) {
      const primaryGoal = parsedData.intent_analysis.primary_goal || 
                          parsedData.intent_analysis.request_understanding?.primary_goal;
      
      if (primaryGoal) {
        return {
          steps: [{
            mcp: 'IntentAnalysisMCP',
            action: primaryGoal,
            synthetic: true
          }]
        };
      }
    }
    
    if (content) {
      return {
        steps: [{
          mcp: 'TextUnderstandingMCP',
          action: 'respond',
          synthetic: true
        }]
      };
    }
    
    return undefined;
  };

  const effectiveExecutionPlan = React.useMemo(() => getEffectiveExecutionPlan(), 
    [executionPlan, parsedData, content]);

  const handleExecuteProtocol = async () => {
    let contextId = activeProtocolContextId;
    if (!contextId) {
      contextId = handleProtocolInit();
    }
    
    if (!contextId) {
      console.error('[AIResponseCard] No active protocol context');
      return;
    }

    setIsExecuting(true);
    try {
      await handleProtocolStep(contextId, "/api/aio/protocol");
    } catch (error) {
      console.error('[AIResponseCard] Error executing protocol step:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  const responseContent = parsedData?.response || content;
  const intentAnalysisJson = getProcessedIntentAnalysis();
  const executionPlanJson = JSON.stringify(effectiveExecutionPlan || {});

  // Store empty string as fallback content for components that require it
  const fallbackContent = "";

  if (isModal) {
    return (
      <div className="w-full bg-card text-card-foreground">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="basic tabs example"
              sx={{
                '& .MuiTab-root': {
                  color: 'white',
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderBottom: '2px solid white'
                  }
                }
              }}
            >
              <Tab label="Response" id="simple-tab-0" sx={{ color: 'white' }} />
              <Tab label="Intent Analysis" id="simple-tab-1" sx={{ color: 'white' }} />
              <Tab label="Execution Plan" id="simple-tab-2" sx={{ color: 'white' }} />
              {rawJson && <Tab label="Raw JSON" id="simple-tab-3" sx={{ color: 'white' }} />}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ResponseSection 
              content={responseContent} 
              hideTitle
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <IntentAnalysisSection 
              content={fallbackContent}
              intentAnalysis={parsedData?.intent_analysis} 
              hideTitle={true}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ExecutionStepsSection 
              content={fallbackContent}
              executionPlan={parsedData?.execution_plan} 
              hideTitle={true}
            />
          </TabPanel>
          {rawJson && (
            <TabPanel value={value} index={3}>
              <div className="max-h-[500px] overflow-auto">
                <SyntaxHighlighter language="json" style={oneDark}>
                  {rawJson}
                </SyntaxHighlighter>
              </div>
            </TabPanel>
          )}
        </Box>
      </div>
    );
  }

  return (
    <>
      <div className="prose prose-invert max-w-none whitespace-pre-wrap">
        {responseContent}
      </div>
      
      {shouldShowModalButton() && (
        <div className="flex items-center gap-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Info size={14} />
                View Analysis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="w-full pt-2">
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={value} 
                      onChange={handleChange} 
                      aria-label="basic tabs example"
                      sx={{
                        '& .MuiTab-root': {
                          color: 'white',
                          '&.Mui-selected': {
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderBottom: '2px solid white'
                          }
                        }
                      }}
                    >
                      <Tab label="Response" id="simple-tab-0" sx={{ color: 'white' }} />
                      <Tab label="Intent Analysis" id="simple-tab-1" sx={{ color: 'white' }} />
                      <Tab label="Execution Plan" id="simple-tab-2" sx={{ color: 'white' }} />
                      {rawJson && <Tab label="Raw JSON" id="simple-tab-3" sx={{ color: 'white' }} />}
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <ResponseSection 
                      content={responseContent} 
                      hideTitle
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <IntentAnalysisSection 
                      content={fallbackContent}
                      intentAnalysis={parsedData?.intent_analysis} 
                      hideTitle={true}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <ExecutionStepsSection 
                      content={fallbackContent}
                      executionPlan={parsedData?.execution_plan} 
                      hideTitle={true}
                    />
                  </TabPanel>
                  {rawJson && (
                    <TabPanel value={value} index={3}>
                      <div className="max-h-[500px] overflow-auto">
                        <SyntaxHighlighter language="json" style={oneDark}>
                          {rawJson}
                        </SyntaxHighlighter>
                      </div>
                    </TabPanel>
                  )}
                </Box>
              </div>
            </DialogContent>
          </Dialog>
          
          {effectiveExecutionPlan?.steps?.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleExecuteProtocol}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                  Executing...
                </>
              ) : (
                <>
                  <Zap size={14} />
                  Execute
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default AIResponseCard;
