
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AgentFormValues } from '@/types/agent';

interface ServerEndpointFieldProps {
  form: UseFormReturn<AgentFormValues>;
}

const ServerEndpointField = ({ form }: ServerEndpointFieldProps) => {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="serverEndpoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Server Endpoint URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://your-agent-endpoint.com"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Optional URL endpoint for your agent's server
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServerEndpointField;
