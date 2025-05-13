
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MCPServerFormValues } from '@/types/agent';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MCPServerBasicInfoProps {
  form: UseFormReturn<MCPServerFormValues>;
}

const MCPServerBasicInfo = ({
  form
}: MCPServerBasicInfoProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="block text-sm font-medium">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      id="name" 
                      placeholder="e.g., mysql-mcp" 
                      className="w-full p-2 border border-gray-300 rounded-md bg-stone-900"
                      {...field}
                    />
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
                  <FormLabel htmlFor="author" className="block text-sm font-medium">
                    Author
                  </FormLabel>
                  <FormControl>
                    <Input 
                      id="author" 
                      placeholder="Your name or organization" 
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-950"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description" className="block text-sm font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      id="description" 
                      placeholder="Describe what your MCP server does" 
                      className="w-full p-2 border border-gray-300 rounded-md h-[104px] bg-gray-950"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="remoteEndpoint"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="remoteEndpoint" className="block text-sm font-medium">
              Remote Call Endpoint URL
            </FormLabel>
            <FormControl>
              <Input 
                id="remoteEndpoint" 
                placeholder="https://your-remote-endpoint.com" 
                className="w-full p-2 border border-gray-300 rounded-md bg-slate-950"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500">
              Optional URL endpoint for remote MCP server calls
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MCPServerBasicInfo;
