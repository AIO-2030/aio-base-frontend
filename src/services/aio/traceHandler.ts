
/**
 * AIO-MCP Protocol Trace Handler
 * Implements trace_id management and call tracking according to AIO-MCP Protocol v1.2.1
 */

interface AIOTraceCall {
  id: number;
  protocol: 'aio' | 'mcp';
  agent: string;
  type: 'stdio' | 'http' | 'mcp';
  method: string;
  inputs: Array<{
    type: string;
    value: any;
  }>;
  outputs?: Array<{
    type: string;
    value: any;
  }>;
  status: 'ok' | 'error' | 'pending';
  partial?: boolean;
  error?: string;
  timestamp: Date;
}

interface AIOTrace {
  trace_id: string;
  calls: AIOTraceCall[];
  status: 'active' | 'completed' | 'error';
  started_at: Date;
  completed_at?: Date;
}

/**
 * Active traces in the current session
 */
const activeTraces: Map<string, AIOTrace> = new Map();

/**
 * Generate a new trace ID according to AIO-MCP Protocol spec
 */
export function generateTraceId(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AIO-TR-${datePart}-${randomPart}`;
}

/**
 * Create a new trace and return the trace_id
 */
export function createTrace(): string {
  const trace_id = generateTraceId();
  
  activeTraces.set(trace_id, {
    trace_id,
    calls: [],
    status: 'active',
    started_at: new Date()
  });
  
  console.log(`[AIO-TRACE] Created new trace: ${trace_id}`);
  return trace_id;
}

/**
 * Add a call to an existing trace
 */
export function addCall(
  trace_id: string, 
  agent: string, 
  protocol: 'aio' | 'mcp', 
  type: 'stdio' | 'http' | 'mcp', 
  method: string, 
  inputs: Array<{type: string; value: any}>
): number {
  const trace = activeTraces.get(trace_id);
  
  if (!trace) {
    console.error(`[AIO-TRACE] Trace not found: ${trace_id}`);
    throw new Error(`Trace not found: ${trace_id}`);
  }
  
  const id = trace.calls.length + 1;
  
  trace.calls.push({
    id,
    protocol,
    agent,
    type,
    method,
    inputs,
    status: 'pending',
    timestamp: new Date()
  });
  
  console.log(`[AIO-TRACE] Added call #${id} to trace ${trace_id}: ${agent}::${method}`);
  return id;
}

/**
 * Update a call with output results and status
 */
export function updateCall(
  trace_id: string, 
  call_id: number, 
  outputs: Array<{type: string; value: any}> | undefined, 
  status: 'ok' | 'error', 
  error?: string,
  partial?: boolean
): void {
  const trace = activeTraces.get(trace_id);
  
  if (!trace) {
    console.error(`[AIO-TRACE] Trace not found: ${trace_id}`);
    return;
  }
  
  const call = trace.calls.find(call => call.id === call_id);
  
  if (!call) {
    console.error(`[AIO-TRACE] Call #${call_id} not found in trace ${trace_id}`);
    return;
  }
  
  call.outputs = outputs;
  call.status = status;
  call.error = error;
  call.partial = partial;
  
  console.log(`[AIO-TRACE] Updated call #${call_id} in trace ${trace_id} with status: ${status}`);
  
  // If all calls are completed, update trace status
  const allCallsCompleted = trace.calls.every(call => call.status !== 'pending');
  const hasErrors = trace.calls.some(call => call.status === 'error');
  
  if (allCallsCompleted) {
    trace.status = hasErrors ? 'error' : 'completed';
    trace.completed_at = new Date();
    console.log(`[AIO-TRACE] Trace ${trace_id} is now ${trace.status}`);
  }
}

/**
 * Complete a trace with a final status
 */
export function completeTrace(trace_id: string): AIOTrace | undefined {
  const trace = activeTraces.get(trace_id);
  
  if (!trace) {
    console.error(`[AIO-TRACE] Trace not found: ${trace_id}`);
    return undefined;
  }
  
  // Update status based on call results
  const hasErrors = trace.calls.some(call => call.status === 'error');
  trace.status = hasErrors ? 'error' : 'completed';
  trace.completed_at = new Date();
  
  console.log(`[AIO-TRACE] Completed trace ${trace_id} with status: ${trace.status}`);
  
  return trace;
}

/**
 * Get a specific trace by trace_id
 */
export function getTrace(trace_id: string): AIOTrace | undefined {
  return activeTraces.get(trace_id);
}

/**
 * Get all active traces
 */
export function getAllTraces(): AIOTrace[] {
  return Array.from(activeTraces.values());
}

/**
 * Format a trace call for display or export
 */
export function formatTraceForDisplay(trace_id: string): string {
  const trace = activeTraces.get(trace_id);
  
  if (!trace) {
    return `Trace ${trace_id} not found`;
  }
  
  return JSON.stringify(trace, null, 2);
}

/**
 * Handle network errors with appropriate trace updates
 */
export function handleNetworkError(trace_id: string, call_id: number, error: any): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  updateCall(
    trace_id,
    call_id,
    [{
      type: 'error',
      value: errorMessage
    }],
    'error',
    errorMessage
  );
  
  console.error(`[AIO-TRACE] Network error in trace ${trace_id}, call #${call_id}: ${errorMessage}`);
}
