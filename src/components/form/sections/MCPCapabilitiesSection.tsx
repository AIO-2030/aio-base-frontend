
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MCPServerFormValues } from '@/types/agent';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Database, Book, Wrench, Cpu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MCPCapabilitiesSectionProps {
  form: UseFormReturn<MCPServerFormValues>;
}

const MCPCapabilitiesSection = ({ form }: MCPCapabilitiesSectionProps) => {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" />
          MCP Capabilities
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select which MCP protocol modules your server implements (per AIO-MCP v1.2.1 specification)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TooltipProvider>
          <FormField 
            control={form.control} 
            name="resources" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-1">
                    <Database className="h-4 w-4 text-blue-600" />
                    Resources Module
                    <Tooltip>
                      <TooltipTrigger className="cursor-help ml-1">ⓘ</TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p>Provides access to context resources like documents or data files</p>
                          <code className="block text-xs bg-slate-800 p-2 rounded">
                            {"reader::resources.list\nreader::resources.get"}
                          </code>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormDescription>
                    Provides context resources (resources.list, resources.get)
                  </FormDescription>
                </div>
              </FormItem>
            )} 
          />

          <FormField 
            control={form.control} 
            name="prompts" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-1">
                    <Book className="h-4 w-4 text-purple-600" />
                    Prompts Module
                    <Tooltip>
                      <TooltipTrigger className="cursor-help ml-1">ⓘ</TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p>Provides templated prompts for generating consistent AI outputs</p>
                          <code className="block text-xs bg-slate-800 p-2 rounded">
                            {"summarizer::prompts.list\nsummarizer::prompts.get"}
                          </code>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormDescription>
                    Provides prompt templates (prompts.list, prompts.get)
                  </FormDescription>
                </div>
              </FormItem>
            )} 
          />

          <FormField 
            control={form.control} 
            name="tools" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-1">
                    <Wrench className="h-4 w-4 text-amber-600" />
                    Tools Module
                    <Tooltip>
                      <TooltipTrigger className="cursor-help ml-1">ⓘ</TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p>Provides tool calling capabilities for specific functions</p>
                          <code className="block text-xs bg-slate-800 p-2 rounded">
                            {"math_agent::tools.list\nmath_agent::tools.call"}
                          </code>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormDescription>
                    Provides tool calling capability (tools.list, tools.call)
                  </FormDescription>
                </div>
              </FormItem>
            )} 
          />

          <FormField 
            control={form.control} 
            name="sampling" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-1">
                    <Cpu className="h-4 w-4 text-green-600" />
                    Sampling Module
                    <Tooltip>
                      <TooltipTrigger className="cursor-help ml-1">ⓘ</TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p>Provides LLM text generation and completion capabilities</p>
                          <code className="block text-xs bg-slate-800 p-2 rounded">
                            {"llm_agent::sampling.start\nllm_agent::sampling.step"}
                          </code>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormDescription>
                    Provides LLM sampling (sampling.start, sampling.step)
                  </FormDescription>
                </div>
              </FormItem>
            )} 
          />
        </TooltipProvider>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm mt-4">
        <strong>Note:</strong> According to the AIO-MCP v1.2.1 protocol, each MCP server should implement at least one of these modules. The capabilities you select here will determine how your server integrates with the AIO ecosystem.
      </div>

      <Separator />
    </>
  );
};

export default MCPCapabilitiesSection;
