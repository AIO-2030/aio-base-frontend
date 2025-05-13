
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AgentFormValues } from '@/types/agent';

interface AgentIOExamplesProps {
  form: UseFormReturn<AgentFormValues>;
}

const AgentIOExamples = ({ form }: AgentIOExamplesProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="inputParams"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Input Parameters Example (JSON)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder='{"param1": "value1", "param2": "value2"}' 
                className="font-mono"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="outputExample"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Output Example (JSON)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder='{"result": "success", "data": {"key": "value"}}' 
                className="font-mono"
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

export default AgentIOExamples;
