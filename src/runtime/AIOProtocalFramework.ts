import { createProtocolMessage } from '@/services/types/aiTypes';
import { AIOProtocolStepInfo, AIOProtocolCallingContext, ProtocolTraceLog, ProtocolTraceCall } from './AIOProtocolHandler';

export class AIOProtocalFramework {
  private static instance: AIOProtocalFramework;
  private traceBuffer: Map<string, ProtocolTraceLog> = new Map();
  private readonly TRACE_BUFFER_SIZE = 100; // Maximum number of traces to keep in memory
  private readonly TRACE_SUBMIT_INTERVAL = 5000; // Submit traces every 5 seconds

  private constructor() {
    // Start the trace submission timer
    setInterval(() => this.submitTraces(), this.TRACE_SUBMIT_INTERVAL);
  }

  public static getInstance(): AIOProtocalFramework {
    if (!AIOProtocalFramework.instance) {
      AIOProtocalFramework.instance = new AIOProtocalFramework();
    }
    return AIOProtocalFramework.instance;
  }

  /**
   * Generates a unique trace ID
   * @returns A unique trace ID in the format AIO-TR-YYYYMMDD-XXXX
   */
  private generateTraceId(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `AIO-TR-${dateStr}-${random}`;
  }

  /**
   * Records a trace for a protocol step execution
   * @param contextId The context ID
   * @param stepInfo The step information
   * @param inputValue The input value
   * @param outputValue The output value
   * @param status The execution status
   * @param errorMessage Optional error message
   */
  public recordTrace(
    contextId: string,
    stepInfo: AIOProtocolStepInfo,
    inputValue: any,
    outputValue: any,
    status: 'ok' | 'error',
    errorMessage?: string
  ): void {
    // Get or create trace log for this context
    let traceLog = this.traceBuffer.get(contextId);
    if (!traceLog) {
      traceLog = {
        trace_id: this.generateTraceId(),
        calls: []
      };
      this.traceBuffer.set(contextId, traceLog);
    }

    // Create the trace call
    const traceCall: ProtocolTraceCall = {
      id: traceLog.calls.length + 1,
      protocol: stepInfo.mcp ? 'mcp' : 'aio',
      agent: stepInfo.mcp?.split('::')[0] || 'unknown',
      type: stepInfo.mcp ? 'mcp' : 'stdio',
      method: stepInfo.mcp || stepInfo.action || 'unknown',
      input: {
        type: this.determineValueType(inputValue),
        value: inputValue
      },
      output: {
        type: this.determineValueType(outputValue),
        value: outputValue
      },
      status,
      error_message: errorMessage
    };

    // Add the trace call
    traceLog.calls.push(traceCall);

    // Trim buffer if it exceeds maximum size
    if (traceLog.calls.length > this.TRACE_BUFFER_SIZE) {
      traceLog.calls.splice(0, traceLog.calls.length - this.TRACE_BUFFER_SIZE);
    }
  }

  /**
   * Determines the type of a value
   * @param value The value to analyze
   * @returns The determined type
   */
  private determineValueType(value: any): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') return 'text';
    if (typeof value === 'object') {
      if (Array.isArray(value)) return 'array';
      if (value instanceof Blob) return 'blob';
      if (value instanceof File) return 'file';
      return 'object';
    }
    return typeof value;
  }

  /**
   * Submits all buffered traces to the backend
   */
  private async submitTraces(): Promise<void> {
    for (const [contextId, traceLog] of this.traceBuffer.entries()) {
      if (traceLog.calls.length === 0) continue;

      try {
        // TODO: Replace with actual backend submission
        console.log(`[AIOProtocalFramework] Submitting trace ${traceLog.trace_id} with ${traceLog.calls.length} calls`);
        
        // Clear the buffer after successful submission
        this.traceBuffer.set(contextId, {
          trace_id: this.generateTraceId(),
          calls: []
        });
      } catch (error) {
        console.error('[AIOProtocalFramework] Error submitting traces:', error);
      }
    }
  }

  /**
   * Maps a step info to a protocol message and returns the adapted step info
   * @param stepInfo The step info to map
   * @returns The adapted step info
   */
  public mapStepCallStep(stepInfo: AIOProtocolStepInfo): AIOProtocolStepInfo {
    try {
      // Create a protocol message using the step info
      const protocolMessage = createProtocolMessage();

      // Parse the protocol message content to get the schema
      const protocolContent = JSON.parse(protocolMessage.content);
      
      // Adapt the step info with the protocol message schema
      const adaptedStepInfo: AIOProtocolStepInfo = {
        ...stepInfo,
        inputSchema: protocolContent.inputSchema || stepInfo.inputSchema,
        mcp: stepInfo.mcp || protocolContent.method.split('::')[0],
        action: stepInfo.action || protocolContent.method.split('::')[1]
      };

      return adaptedStepInfo;
    } catch (error) {
      console.error('[AIOProtocalFramework] Error mapping step:', error);
      return stepInfo; // Return original step info if mapping fails
    }
  }
}
