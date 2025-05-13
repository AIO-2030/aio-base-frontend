
import { getActor } from './actorManager';
import { loggedCanisterCall } from './callUtils';
import type { TraceItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';

/**
 * Get a trace by ID
 * @param id Trace ID
 * @returns Promise resolving to trace or undefined
 */
export const getTrace = async (id: bigint): Promise<TraceItem | undefined> => {
  return loggedCanisterCall('getTrace', { id }, async () => {
    const result = await (await getActor()).get_trace(id);
    return result.length > 0 ? result[0] : undefined;
  });
};

/**
 * Get a trace by trace ID string
 * @param id Trace ID string
 * @returns Promise resolving to trace or undefined
 */
export const getTraceById = async (id: string): Promise<TraceItem | undefined> => {
  return loggedCanisterCall('getTraceById', { id }, async () => {
    const result = await (await getActor()).get_trace_by_id(id);
    return result.length > 0 ? result[0] : undefined;
  });
};

/**
 * Get traces for the current user
 * @returns Promise resolving to array of traces
 */
export const getUserTraces = async (): Promise<TraceItem[]> => {
  return loggedCanisterCall('getUserTraces', {}, async () => {
    return (await getActor()).get_user_traces();
  });
};

/**
 * Get paginated traces for the current user
 * @param offset Pagination offset
 * @param limit Number of items to return
 * @returns Promise resolving to array of traces
 */
export const getUserTracesPaginated = async (offset: bigint, limit: bigint): Promise<TraceItem[]> => {
  return loggedCanisterCall('getUserTracesPaginated', { offset, limit }, async () => {
    return (await getActor()).get_user_traces_paginated(offset, limit);
  });
};

/**
 * Get paginated traces
 * @param offset Pagination offset
 * @param limit Number of items to return
 * @returns Promise resolving to array of traces
 */
export const getTracesPaginated = async (offset: bigint, limit: bigint): Promise<TraceItem[]> => {
  return loggedCanisterCall('getTracesPaginated', { offset, limit }, async () => {
    return (await getActor()).get_traces_paginated(offset, limit);
  });
};

/**
 * Add a new trace
 * @param traceItem Trace to add
 * @returns Promise resolving to result
 */
export const addTrace = async (traceItem: TraceItem): Promise<{Ok: bigint} | {Err: string}> => {
  return loggedCanisterCall('addTrace', { traceItem }, async () => {
    return (await getActor()).add_trace(traceItem);
  });
};
