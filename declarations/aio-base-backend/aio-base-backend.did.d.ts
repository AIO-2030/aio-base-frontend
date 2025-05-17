import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AgentItem {
  'id' : bigint,
  'input_params' : [] | [string],
  'image_url' : [] | [string],
  'owner' : string,
  'exec_file_url' : [] | [string],
  'name' : string,
  'homepage' : [] | [string],
  'description' : string,
  'platform' : [] | [Platform],
  'git_repo' : string,
  'author' : string,
  'version' : string,
  'output_example' : [] | [string],
}
export interface AioIndex {
  'id' : string,
  'methods' : Array<Method>,
  'source' : Source,
  'transport' : Array<string>,
  'description' : string,
  'scenarios' : Array<string>,
  'author' : string,
  'version' : string,
  'keywords' : Array<string>,
  'github' : string,
}
export interface CallItem {
  'id' : bigint,
  'protocol' : string,
  'status' : string,
  'method' : string,
  'agent' : string,
  'inputs' : Array<IOData>,
  'outputs' : Array<IOData>,
  'call_type' : string,
}
export interface IOData { 'value' : string, 'data_type' : string }
export interface InputSchema {
  'schema_type' : string,
  'properties' : Array<[string, SchemaProperty]>,
}
export interface InvertedIndexItem {
  'standard_match' : string,
  'keyword_group' : string,
  'mcp_name' : string,
  'method_name' : string,
  'source_field' : string,
  'keyword' : string,
  'confidence' : number,
}
export interface McpItem {
  'id' : bigint,
  'tools' : boolean,
  'remote_endpoint' : [] | [string],
  'mcp_type' : string,
  'owner' : string,
  'resources' : boolean,
  'name' : string,
  'homepage' : [] | [string],
  'description' : string,
  'git_repo' : string,
  'author' : string,
  'community_body' : [] | [string],
  'sampling' : boolean,
  'prompts' : boolean,
  'exec_file' : [] | [string],
}
export interface Method {
  'name' : string,
  'description' : string,
  'required_params' : [] | [Array<string>],
  'input_schema' : [] | [InputSchema],
}
export type Platform = { 'Linux' : null } |
  { 'Both' : null } |
  { 'Windows' : null };
export interface SchemaProperty {
  'description' : [] | [string],
  'default' : [] | [string],
  'property_type' : string,
  'enum_values' : [] | [Array<string>],
}
export interface Source {
  'author' : string,
  'version' : string,
  'github' : string,
}
export interface TraceItem {
  'id' : bigint,
  'updated_at' : bigint,
  'owner' : string,
  'metadata' : [] | [string],
  'calls' : Array<CallItem>,
  'created_at' : bigint,
  'trace_id' : string,
}
export type TraceStatus = { 'Ok' : null } |
  { 'Fail' : null } |
  { 'Recall' : null };
export interface WorkItem {
  'id' : bigint,
  'status' : WorkStatus,
  'title' : string,
  'updated_at' : bigint,
  'owner' : string,
  'metadata' : [] | [string],
  'tags' : Array<string>,
  'description' : string,
  'created_at' : bigint,
  'assigned_to' : [] | [string],
}
export type WorkStatus = { 'Todo' : null } |
  { 'Cancelled' : null } |
  { 'InProgress' : null } |
  { 'Completed' : null };
export interface _SERVICE {
  'add_agent_item' : ActorMethod<
    [AgentItem, string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'add_mcp_item' : ActorMethod<
    [McpItem, string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'add_trace' : ActorMethod<
    [TraceItem],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'create_aio_index_from_json' : ActorMethod<
    [string, string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_aio_index' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_inverted_index_by_mcp' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'export_aio_index_to_json' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'find_inverted_index_by_confidence' : ActorMethod<[number], string>,
  'find_inverted_index_by_group' : ActorMethod<[string], string>,
  'find_inverted_index_by_keyword' : ActorMethod<[string], string>,
  'find_inverted_index_by_keywords' : ActorMethod<
    [Array<string>, number],
    string
  >,
  'find_inverted_index_by_mcp' : ActorMethod<[string], string>,
  'get_agent_item' : ActorMethod<[bigint], [] | [AgentItem]>,
  'get_agent_item_by_name' : ActorMethod<[string], [] | [AgentItem]>,
  'get_agent_items_paginated' : ActorMethod<[bigint, bigint], Array<AgentItem>>,
  'get_aio_index' : ActorMethod<[string], [] | [AioIndex]>,
  'get_aio_indices_count' : ActorMethod<[], bigint>,
  'get_aio_indices_paginated' : ActorMethod<[bigint, bigint], Array<AioIndex>>,
  'get_all_agent_items' : ActorMethod<[], Array<AgentItem>>,
  'get_all_aio_indices' : ActorMethod<[], Array<AioIndex>>,
  'get_all_inverted_index_items' : ActorMethod<[], string>,
  'get_all_keywords' : ActorMethod<[], string>,
  'get_all_mcp_items' : ActorMethod<[], Array<McpItem>>,
  'get_mcp_item' : ActorMethod<[bigint], [] | [McpItem]>,
  'get_mcp_item_by_name' : ActorMethod<[string], [] | [McpItem]>,
  'get_mcp_items_paginated' : ActorMethod<[bigint, bigint], Array<McpItem>>,
  'get_trace' : ActorMethod<[bigint], [] | [TraceItem]>,
  'get_trace_by_id' : ActorMethod<[string], [] | [TraceItem]>,
  'get_traces_paginated' : ActorMethod<[bigint, bigint], Array<TraceItem>>,
  'get_user_agent_items' : ActorMethod<[], Array<AgentItem>>,
  'get_user_agent_items_paginated' : ActorMethod<
    [bigint, bigint],
    Array<AgentItem>
  >,
  'get_user_mcp_items' : ActorMethod<[], Array<McpItem>>,
  'get_user_mcp_items_paginated' : ActorMethod<
    [bigint, bigint],
    Array<McpItem>
  >,
  'get_user_traces' : ActorMethod<[], Array<TraceItem>>,
  'get_user_traces_paginated' : ActorMethod<[bigint, bigint], Array<TraceItem>>,
  'greet' : ActorMethod<[string], string>,
  'revert_Index_find_by_keywords_strategy' : ActorMethod<
    [Array<string>],
    string
  >,
  'search_aio_indices_by_keyword' : ActorMethod<[string], Array<AioIndex>>,
  'store_inverted_index' : ActorMethod<
    [string, string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_agent_item' : ActorMethod<
    [bigint, AgentItem],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_aio_index' : ActorMethod<
    [string, string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_mcp_item' : ActorMethod<
    [bigint, McpItem],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
