export const idlFactory = ({ IDL }) => {
  const Platform = IDL.Variant({
    'Linux' : IDL.Null,
    'Both' : IDL.Null,
    'Windows' : IDL.Null,
  });
  const AgentItem = IDL.Record({
    'id' : IDL.Nat64,
    'input_params' : IDL.Opt(IDL.Text),
    'image_url' : IDL.Opt(IDL.Text),
    'owner' : IDL.Text,
    'exec_file_url' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'homepage' : IDL.Opt(IDL.Text),
    'description' : IDL.Text,
    'platform' : IDL.Opt(Platform),
    'git_repo' : IDL.Text,
    'author' : IDL.Text,
    'version' : IDL.Text,
    'output_example' : IDL.Opt(IDL.Text),
  });
  const McpItem = IDL.Record({
    'id' : IDL.Nat64,
    'tools' : IDL.Bool,
    'remote_endpoint' : IDL.Opt(IDL.Text),
    'mcp_type' : IDL.Text,
    'owner' : IDL.Text,
    'resources' : IDL.Bool,
    'name' : IDL.Text,
    'homepage' : IDL.Opt(IDL.Text),
    'description' : IDL.Text,
    'git_repo' : IDL.Text,
    'author' : IDL.Text,
    'community_body' : IDL.Opt(IDL.Text),
    'sampling' : IDL.Bool,
    'prompts' : IDL.Bool,
    'exec_file' : IDL.Opt(IDL.Text),
  });
  const IOData = IDL.Record({ 'value' : IDL.Text, 'data_type' : IDL.Text });
  const CallItem = IDL.Record({
    'id' : IDL.Nat64,
    'protocol' : IDL.Text,
    'status' : IDL.Text,
    'method' : IDL.Text,
    'agent' : IDL.Text,
    'inputs' : IDL.Vec(IOData),
    'outputs' : IDL.Vec(IOData),
    'call_type' : IDL.Text,
  });
  const TraceItem = IDL.Record({
    'id' : IDL.Nat64,
    'updated_at' : IDL.Nat64,
    'owner' : IDL.Text,
    'metadata' : IDL.Opt(IDL.Text),
    'calls' : IDL.Vec(CallItem),
    'created_at' : IDL.Nat64,
    'trace_id' : IDL.Text,
  });
  const SchemaProperty = IDL.Record({
    'description' : IDL.Opt(IDL.Text),
    'default' : IDL.Opt(IDL.Text),
    'property_type' : IDL.Text,
    'enum_values' : IDL.Opt(IDL.Vec(IDL.Text)),
  });
  const InputSchema = IDL.Record({
    'schema_type' : IDL.Text,
    'properties' : IDL.Vec(IDL.Tuple(IDL.Text, SchemaProperty)),
  });
  const Method = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'required_params' : IDL.Opt(IDL.Vec(IDL.Text)),
    'input_schema' : IDL.Opt(InputSchema),
  });
  const Source = IDL.Record({
    'author' : IDL.Text,
    'version' : IDL.Text,
    'github' : IDL.Text,
  });
  const AioIndex = IDL.Record({
    'id' : IDL.Text,
    'methods' : IDL.Vec(Method),
    'source' : Source,
    'transport' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'scenarios' : IDL.Vec(IDL.Text),
    'author' : IDL.Text,
    'version' : IDL.Text,
    'keywords' : IDL.Vec(IDL.Text),
    'github' : IDL.Text,
  });
  return IDL.Service({
    'add_agent_item' : IDL.Func(
        [AgentItem, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'add_mcp_item' : IDL.Func(
        [McpItem, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'add_trace' : IDL.Func(
        [TraceItem],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'create_aio_index_from_json' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_aio_index' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_inverted_index_by_mcp' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'export_aio_index_to_json' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        ['query'],
      ),
    'find_inverted_index_by_confidence' : IDL.Func(
        [IDL.Float32],
        [IDL.Text],
        ['query'],
      ),
    'find_inverted_index_by_group' : IDL.Func(
        [IDL.Text],
        [IDL.Text],
        ['query'],
      ),
    'find_inverted_index_by_keyword' : IDL.Func(
        [IDL.Text],
        [IDL.Text],
        ['query'],
      ),
    'find_inverted_index_by_keywords' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Float32],
        [IDL.Text],
        ['query'],
      ),
    'find_inverted_index_by_mcp' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'get_agent_item' : IDL.Func([IDL.Nat64], [IDL.Opt(AgentItem)], ['query']),
    'get_agent_item_by_name' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(AgentItem)],
        ['query'],
      ),
    'get_agent_items_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(AgentItem)],
        ['query'],
      ),
    'get_aio_index' : IDL.Func([IDL.Text], [IDL.Opt(AioIndex)], ['query']),
    'get_aio_indices_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_aio_indices_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(AioIndex)],
        ['query'],
      ),
    'get_all_agent_items' : IDL.Func([], [IDL.Vec(AgentItem)], ['query']),
    'get_all_aio_indices' : IDL.Func([], [IDL.Vec(AioIndex)], ['query']),
    'get_all_inverted_index_items' : IDL.Func([], [IDL.Text], ['query']),
    'get_all_keywords' : IDL.Func([], [IDL.Text], ['query']),
    'get_all_mcp_items' : IDL.Func([], [IDL.Vec(McpItem)], ['query']),
    'get_mcp_item' : IDL.Func([IDL.Nat64], [IDL.Opt(McpItem)], ['query']),
    'get_mcp_item_by_name' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(McpItem)],
        ['query'],
      ),
    'get_mcp_items_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(McpItem)],
        ['query'],
      ),
    'get_trace' : IDL.Func([IDL.Nat64], [IDL.Opt(TraceItem)], ['query']),
    'get_trace_by_id' : IDL.Func([IDL.Text], [IDL.Opt(TraceItem)], ['query']),
    'get_traces_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TraceItem)],
        ['query'],
      ),
    'get_user_agent_items' : IDL.Func([], [IDL.Vec(AgentItem)], ['query']),
    'get_user_agent_items_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(AgentItem)],
        ['query'],
      ),
    'get_user_mcp_items' : IDL.Func([], [IDL.Vec(McpItem)], ['query']),
    'get_user_mcp_items_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(McpItem)],
        ['query'],
      ),
    'get_user_traces' : IDL.Func([], [IDL.Vec(TraceItem)], ['query']),
    'get_user_traces_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TraceItem)],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'search_aio_indices_by_keyword' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(AioIndex)],
        ['query'],
      ),
    'store_inverted_index' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_agent_item' : IDL.Func(
        [IDL.Nat64, AgentItem],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_aio_index' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_mcp_item' : IDL.Func(
        [IDL.Nat64, McpItem],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
