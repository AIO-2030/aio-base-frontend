
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MCPServerFormValues } from '@/types/agent';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { GitBranch, Code } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ImplementationDetailsSectionProps {
  form: UseFormReturn<MCPServerFormValues>;
}

const ImplementationDetailsSection = ({ form }: ImplementationDetailsSectionProps) => {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Code className="h-5 w-5" />
          Implementation Details
        </h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Provide details about how your MCP server is implemented and how it should be invoked
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gitRepo"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="gitRepo" className="flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  Git Repository
                </FormLabel>
                <FormControl>
                  <input
                    type="url"
                    id="gitRepo"
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    placeholder="https://github.com/your-username/mcp-server"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="homepage"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="homepage">Homepage (Optional)</FormLabel>
                <FormControl>
                  <input
                    type="url"
                    id="homepage"
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    placeholder="https://your-project-site.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="communityBody"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="communityBody" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                Example MCP Protocol Request (JSON)
              </FormLabel>
              <FormControl>
                <Textarea
                  id="communityBody"
                  className="font-mono text-sm h-64 resize-y"
                  placeholder={`{
  "method": "your_mcp_server::module.method",
  "params": {
    // Your parameters here
  },
  "id": 1,
  "trace_id": "AIO-TR-20250326-XXXX"
}`}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Provide a sample JSON request that demonstrates how to call your MCP server using the AIO-MCP protocol.
                This should follow the namespaced format of {`"server_name::module.method"`}.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="p-3 bg-gray-100 border border-gray-200 rounded-md text-gray-800 text-sm mt-4">
        <strong>Protocol Note:</strong> Your implementation must correctly handle the AIO-MCP trace_id for request tracking and accountability,
        and should properly implement the namespaced method calls as specified in the AIO-MCP v1.2.1 protocol.
      </div>

      <Separator className="mt-6" />
    </>
  );
};

export default ImplementationDetailsSection;
