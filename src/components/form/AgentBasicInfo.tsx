
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AgentFormValues } from '@/types/agent';
import { Button } from '@/components/ui/button';

interface AgentBasicInfoProps {
  form: UseFormReturn<AgentFormValues>;
}

const DESCRIPTION_TEMPLATE = `# About this Agent

This agent implements the AIO protocol specification v1.2, communicating via standard input/output (stdio). It accepts text and file inputs and produces outputs according to the AIO protocol.

# Usage Instructions

1. Format your input according to the AIO protocol JSON-RPC 2.0 specification.
2. Send the JSON input to the agent via stdin.
3. Receive the JSON output from the agent via stdout.
4. The agent will process each input and return corresponding outputs.

# Input Types Supported

- **text**: Plain text input
- **file**: Base64-encoded file data
- **image**: Base64-encoded image data

# Output Types

- **text**: Plain text results
- **file**: Base64-encoded file data`;

const AgentBasicInfo = ({ form }: AgentBasicInfoProps) => {
  const applyTemplate = () => {
    form.setValue('description', DESCRIPTION_TEMPLATE);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter agent name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="author"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author</FormLabel>
            <FormControl>
              <Input placeholder="Enter author name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <div className="flex items-center justify-between mb-2">
              <FormDescription>
                Describe what your agent does and how it can be used.
              </FormDescription>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={applyTemplate}
              >
                Apply Template
              </Button>
            </div>
            <FormControl>
              <Textarea 
                placeholder="Describe what your agent does" 
                size="lg"
                className="min-h-24"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AgentBasicInfo;
