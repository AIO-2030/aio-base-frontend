import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MCPServerFormValues } from '@/types/agent';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Server } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { isValidJson } from '@/util/formatters';

interface CommunicationTypeSectionProps {
  form: UseFormReturn<MCPServerFormValues>;
}

const CommunicationTypeSection = ({ form }: CommunicationTypeSectionProps) => {
  // Real-time JSON validation
  const validateJson = (value: string) => {
    if (!value) return true;
    return isValidJson(value) || "Invalid JSON format. Please check your syntax.";
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Server className="h-5 w-5" />
          Protocol Configuration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how your MCP server communicates according to the AIO-MCP protocol
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField 
            control={form.control} 
            name="type" 
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Communication Type</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="stdio" id="stdio" />
                      <label htmlFor="stdio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        stdio
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="http" id="http" />
                      <label htmlFor="http" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        http
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sse" id="sse" />
                      <label htmlFor="sse" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        sse (Server-Sent Events)
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  The primary communication method for your MCP server
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>

        <div>
          <FormField 
            control={form.control} 
            name="communityBody" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Body (JSON format)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={`{
  "method": "math_agent::tools.call",
  "params": {
    "tool": "calculate_area",
    "args": { "x": 3, "y": 4 }
  }
}`} 
                    className="min-h-[200px] font-mono"
                    {...field} 
                    onBlur={(e) => {
                      // Format JSON on blur if valid
                      const value = e.target.value;
                      if (isValidJson(value)) {
                        try {
                          const formatted = JSON.stringify(JSON.parse(value), null, 2);
                          field.onChange(formatted);
                        } catch (error) {
                          // Keep as is if error
                        }
                      }
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Provide the JSON format body for community interaction (must be valid JSON)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>
      </div>

      <Separator />
    </>
  );
};

export default CommunicationTypeSection;
