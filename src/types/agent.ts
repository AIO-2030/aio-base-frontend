
import { z } from 'zod';

export const agentFormSchema = z.object({
  name: z.string().min(3, 'Agent name must be at least 3 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  author: z.string().min(2, 'Author name required'),
  gitRepo: z.string().url('Must be a valid URL'),
  homepage: z.string().url('Must be a valid URL').optional(),
  serverEndpoint: z.string().url('Must be a valid URL').optional(),
  inputParams: z.string().optional(),
  outputExample: z.string().optional(),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;

// Custom JSON validator
const jsonStringValidator = (value: string) => {
  if (!value) return true;
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
};

// Updated schema for MCP Server based on the protocol requirements
export const mcpServerFormSchema = z.object({
  name: z.string().min(3, 'Server name must be at least 3 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  author: z.string().min(2, 'Author name required'),
  gitRepo: z.string().url('Must be a valid URL'),
  homepage: z.string().url('Must be a valid URL').optional(),
  remoteEndpoint: z.string().url('Must be a valid URL').optional(),
  type: z.enum(['stdio', 'http', 'sse']).default('stdio'),
  communityBody: z.string()
    .refine(jsonStringValidator, {
      message: 'Must be valid JSON format',
    })
    .optional(),
  // MCP capabilities - optional flags
  resources: z.boolean().default(false),
  prompts: z.boolean().default(false), 
  tools: z.boolean().default(false),
  sampling: z.boolean().default(false),
});

export type MCPServerFormValues = z.infer<typeof mcpServerFormSchema>;
