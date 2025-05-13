
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AgentFormValues } from '@/types/agent';

interface AgentTechnicalInfoProps {
  form: UseFormReturn<AgentFormValues>;
}

const AgentTechnicalInfo = ({
  form
}: AgentTechnicalInfoProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Technical Information</h2>
      
      <FormField 
        control={form.control} 
        name="gitRepo" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Git Repository URL</FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/yourusername/your-agent" {...field} />
            </FormControl>
            <FormDescription>
              Link to the source code repository for your agent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="homepage" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Homepage URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://youragent.com" {...field} />
            </FormControl>
            <FormDescription>
              Public website or documentation for your agent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
};

export default AgentTechnicalInfo;
