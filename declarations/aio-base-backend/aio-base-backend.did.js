export const idlFactory = ({ IDL }) => {
  const SchemaProperty = IDL.Rec();
  const TokenInfo = IDL.Record({
    'kappa_multiplier' : IDL.Float64,
    'staked_credits' : IDL.Nat64,
    'credit_balance' : IDL.Nat64,
    'token_balance' : IDL.Nat64,
  });
  const AccountInfo = IDL.Record({
    'updated_at' : IDL.Opt(IDL.Nat64),
    'metadata' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Nat64,
    'principal_id' : IDL.Text,
    'token_info' : TokenInfo,
  });
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
  const DeviceStatus = IDL.Variant({
    'Online' : IDL.Null,
    'Disabled' : IDL.Null,
    'Maintenance' : IDL.Null,
    'Offline' : IDL.Null,
  });
  const DeviceCapability = IDL.Variant({
    'Storage' : IDL.Null,
    'Network' : IDL.Null,
    'Compute' : IDL.Null,
    'Custom' : IDL.Text,
    'Sensor' : IDL.Null,
    'Audio' : IDL.Null,
    'Video' : IDL.Null,
  });
  const DeviceType = IDL.Variant({
    'IoT' : IDL.Null,
    'Server' : IDL.Null,
    'Embedded' : IDL.Null,
    'Other' : IDL.Text,
    'Desktop' : IDL.Null,
    'Mobile' : IDL.Null,
  });
  const DeviceInfo = IDL.Record({
    'id' : IDL.Text,
    'status' : DeviceStatus,
    'updated_at' : IDL.Nat64,
    'capabilities' : IDL.Vec(DeviceCapability),
    'owner' : IDL.Principal,
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'name' : IDL.Text,
    'device_type' : DeviceType,
    'created_at' : IDL.Nat64,
    'last_seen' : IDL.Nat64,
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
  const RechargePrincipalAccount = IDL.Record({
    'subaccount_id' : IDL.Opt(IDL.Text),
    'principal_id' : IDL.Text,
  });
  const LoginStatus = IDL.Variant({
    'Authenticated' : IDL.Null,
    'Unauthenticated' : IDL.Null,
  });
  const LoginMethod = IDL.Variant({
    'II' : IDL.Null,
    'Google' : IDL.Null,
    'Wallet' : IDL.Null,
  });
  const UserProfile = IDL.Record({
    'updated_at' : IDL.Nat64,
    'nickname' : IDL.Text,
    'metadata' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'wallet_address' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Nat64,
    'user_id' : IDL.Text,
    'email' : IDL.Opt(IDL.Text),
    'picture' : IDL.Opt(IDL.Text),
    'login_status' : LoginStatus,
    'login_method' : LoginMethod,
    'principal_id' : IDL.Text,
    'devices' : IDL.Vec(IDL.Text),
  });
  const TokenGrantStatus = IDL.Variant({
    'Active' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const NewMcpGrant = IDL.Record({
    'status' : TokenGrantStatus,
    'claimed_amount' : IDL.Nat64,
    'mcp_name' : IDL.Text,
    'recipient' : IDL.Text,
    'start_time' : IDL.Nat64,
    'amount' : IDL.Nat64,
  });
  const CreateOrderArgs = IDL.Record({
    'sku' : IDL.Text,
    'redirect_base' : IDL.Text,
    'shipping_address' : IDL.Text,
    'buyer_email' : IDL.Opt(IDL.Text),
    'currency' : IDL.Text,
    'order_id' : IDL.Text,
    'amount' : IDL.Float64,
  });
  const InvoiceResp = IDL.Record({
    'invoice_id' : IDL.Text,
    'invoice_url' : IDL.Text,
  });
  const SourceMeta = IDL.Record({
    'title' : IDL.Opt(IDL.Text),
    'tags' : IDL.Opt(IDL.Vec(IDL.Text)),
    'description' : IDL.Opt(IDL.Text),
  });
  const PixelRow = IDL.Vec(IDL.Nat16);
  const Frame = IDL.Record({
    'pixels' : IDL.Vec(PixelRow),
    'duration_ms' : IDL.Nat32,
  });
  const PixelArtSource = IDL.Record({
    'height' : IDL.Nat32,
    'metadata' : IDL.Opt(SourceMeta),
    'palette' : IDL.Vec(IDL.Text),
    'pixels' : IDL.Vec(PixelRow),
    'frames' : IDL.Opt(IDL.Vec(Frame)),
    'width' : IDL.Nat32,
  });
  const ProjectId = IDL.Text;
  const TokenGrant = IDL.Record({
    'status' : TokenGrantStatus,
    'claimed_amount' : IDL.Nat64,
    'recipient' : IDL.Text,
    'start_time' : IDL.Nat64,
    'amount' : IDL.Nat64,
  });
  const VersionId = IDL.Text;
  SchemaProperty.fill(
    IDL.Record({
      'description' : IDL.Opt(IDL.Text),
      'properties' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, SchemaProperty))),
      'default' : IDL.Opt(IDL.Text),
      'required' : IDL.Opt(IDL.Vec(IDL.Text)),
      'property_type' : IDL.Text,
      'items' : IDL.Opt(SchemaProperty),
      'enum_values' : IDL.Opt(IDL.Vec(IDL.Text)),
    })
  );
  const InputSchema = IDL.Record({
    'schema_type' : IDL.Text,
    'properties' : IDL.Vec(IDL.Tuple(IDL.Text, SchemaProperty)),
    'required' : IDL.Opt(IDL.Vec(IDL.Text)),
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
  const DeviceListResponse = IDL.Record({
    'total' : IDL.Nat64,
    'offset' : IDL.Nat64,
    'limit' : IDL.Nat64,
    'devices' : IDL.Vec(DeviceInfo),
  });
  const IOValue = IDL.Record({
    'value' : IDL.Variant({
      'Null' : IDL.Null,
      'Text' : IDL.Text,
      'Object' : IDL.Text,
      'Boolean' : IDL.Bool,
      'Array' : IDL.Text,
      'Number' : IDL.Float64,
    }),
    'data_type' : IDL.Text,
  });
  const ProtocolCall = IDL.Record({
    'id' : IDL.Nat32,
    'protocol' : IDL.Text,
    'status' : IDL.Text,
    'method' : IDL.Text,
    'output' : IOValue,
    'agent' : IDL.Text,
    'error_message' : IDL.Opt(IDL.Text),
    'input' : IOValue,
    'call_type' : IDL.Text,
  });
  const TraceLog = IDL.Record({
    'context_id' : IDL.Text,
    'calls' : IDL.Vec(ProtocolCall),
    'trace_id' : IDL.Text,
  });
  const MessageMode = IDL.Variant({
    'Gif' : IDL.Null,
    'Emoji' : IDL.Null,
    'Text' : IDL.Null,
    'Image' : IDL.Null,
    'PixelArt' : IDL.Null,
    'Voice' : IDL.Null,
  });
  const ChatMessage = IDL.Record({
    'content' : IDL.Text,
    'mode' : MessageMode,
    'timestamp' : IDL.Nat64,
    'send_by' : IDL.Text,
  });
  const ContactStatus = IDL.Variant({
    'Blocked' : IDL.Null,
    'Active' : IDL.Null,
    'Deleted' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const ContactType = IDL.Variant({
    'Family' : IDL.Null,
    'System' : IDL.Null,
    'Business' : IDL.Null,
    'Friend' : IDL.Null,
  });
  const Contact = IDL.Record({
    'id' : IDL.Nat64,
    'status' : ContactStatus,
    'updated_at' : IDL.Nat64,
    'nickname' : IDL.Opt(IDL.Text),
    'metadata' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'owner_principal_id' : IDL.Text,
    'is_online' : IDL.Bool,
    'contact_type' : ContactType,
    'devices' : IDL.Vec(IDL.Text),
    'contact_principal_id' : IDL.Text,
    'avatar' : IDL.Opt(IDL.Text),
  });
  const TransferStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const CreditActivityType = IDL.Variant({
    'Spend' : IDL.Null,
    'Stack' : IDL.Null,
    'Earn' : IDL.Null,
    'Reward' : IDL.Null,
    'Unstack' : IDL.Null,
  });
  const CreditActivity = IDL.Record({
    'status' : TransferStatus,
    'activity_type' : CreditActivityType,
    'metadata' : IDL.Opt(IDL.Text),
    'timestamp' : IDL.Nat64,
    'principal_id' : IDL.Text,
    'amount' : IDL.Nat64,
  });
  const SubscriptionPlan = IDL.Variant({
    'Premium' : IDL.Null,
    'Enterprise' : IDL.Null,
    'Free' : IDL.Null,
    'Basic' : IDL.Null,
  });
  const EmissionPolicy = IDL.Record({
    'subscription_multipliers' : IDL.Vec(
      IDL.Tuple(SubscriptionPlan, IDL.Float64)
    ),
    'last_update_time' : IDL.Nat64,
    'base_rate' : IDL.Nat64,
    'kappa_factor' : IDL.Float64,
    'staking_bonus' : IDL.Float64,
  });
  const RewardEntry = IDL.Record({
    'status' : IDL.Text,
    'block_id' : IDL.Nat64,
    'mcp_name' : IDL.Text,
    'reward_amount' : IDL.Nat64,
    'principal_id' : IDL.Principal,
  });
  const StackStatus = IDL.Variant({
    'Unstacked' : IDL.Null,
    'Stacked' : IDL.Null,
  });
  const McpStackRecord = IDL.Record({
    'mcp_name' : IDL.Text,
    'stack_time' : IDL.Nat64,
    'stack_amount' : IDL.Nat64,
    'stack_status' : StackStatus,
    'principal_id' : IDL.Text,
  });
  const NotificationItem = IDL.Record({
    'social_pair_key' : IDL.Text,
    'to_who' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'message_id' : IDL.Nat64,
  });
  const OrderStatus = IDL.Variant({
    'New' : IDL.Null,
    'Invalid' : IDL.Null,
    'Paid' : IDL.Null,
    'Delivered' : IDL.Null,
    'Complete' : IDL.Null,
    'Confirmed' : IDL.Null,
    'Created' : IDL.Null,
    'Expired' : IDL.Null,
  });
  const Order = IDL.Record({
    'sku' : IDL.Text,
    'status' : OrderStatus,
    'shipment_no' : IDL.Opt(IDL.Text),
    'shipping_address' : IDL.Text,
    'updated_at_ns' : IDL.Nat64,
    'buyer_email' : IDL.Opt(IDL.Text),
    'created_at_ns' : IDL.Nat64,
    'currency' : IDL.Text,
    'order_id' : IDL.Text,
    'amount' : IDL.Float64,
    'bitpay_invoice_url' : IDL.Opt(IDL.Text),
    'bitpay_invoice_id' : IDL.Opt(IDL.Text),
  });
  const Version = IDL.Record({
    'version_id' : VersionId,
    'source' : PixelArtSource,
    'editor' : IDL.Principal,
    'created_at' : IDL.Nat64,
    'message' : IDL.Opt(IDL.Text),
  });
  const Project = IDL.Record({
    'updated_at' : IDL.Nat64,
    'owner' : IDL.Principal,
    'history' : IDL.Vec(Version),
    'created_at' : IDL.Nat64,
    'current_version' : Version,
    'project_id' : ProjectId,
  });
  const RechargeRecord = IDL.Record({
    'user' : IDL.Principal,
    'timestamp' : IDL.Nat64,
    'credits_obtained' : IDL.Nat64,
    'icp_amount' : IDL.Float64,
  });
  const StackPositionRecord = IDL.Record({
    'id' : IDL.Nat64,
    'mcp_name' : IDL.Text,
    'stack_amount' : IDL.Nat64,
  });
  const TokenActivityType = IDL.Variant({
    'Stack' : IDL.Null,
    'Grant' : IDL.Null,
    'Vest' : IDL.Null,
    'Unstack' : IDL.Null,
    'Transfer' : IDL.Null,
    'Claim' : IDL.Null,
  });
  const TokenActivity = IDL.Record({
    'to' : IDL.Text,
    'status' : TransferStatus,
    'activity_type' : TokenActivityType,
    'metadata' : IDL.Opt(IDL.Text),
    'from' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'amount' : IDL.Nat64,
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
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const TraceItem = IDL.Record({
    'id' : IDL.Text,
    'status' : TransferStatus,
    'updated_at' : IDL.Nat64,
    'owner' : IDL.Text,
    'metadata' : IDL.Opt(IDL.Text),
    'calls' : IDL.Vec(CallItem),
    'created_at' : IDL.Nat64,
    'error' : IDL.Opt(IDL.Text),
    'to_account' : Account,
    'trace_id' : IDL.Text,
    'from_account' : Account,
    'amount' : IDL.Nat64,
  });
  const GrantAction = IDL.Variant({
    'NewUser' : IDL.Null,
    'NewDeveloper' : IDL.Null,
  });
  const GrantPolicy = IDL.Record({
    'grant_duration' : IDL.Nat64,
    'grant_amount' : IDL.Nat64,
    'grant_action' : GrantAction,
  });
  const DeviceFilter = IDL.Record({
    'status' : IDL.Opt(DeviceStatus),
    'owner' : IDL.Opt(IDL.Principal),
    'device_type' : IDL.Opt(DeviceType),
    'capability' : IDL.Opt(DeviceCapability),
  });
  return IDL.Service({
    'add_account' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : AccountInfo, 'Err' : IDL.Text })],
        [],
      ),
    'add_agent_item' : IDL.Func(
        [AgentItem, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'add_device' : IDL.Func(
        [DeviceInfo],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'add_mcp_item' : IDL.Func(
        [McpItem, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'add_recharge_principal_account_api' : IDL.Func(
        [RechargePrincipalAccount],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'add_token_balance' : IDL.Func(
        [IDL.Text, IDL.Nat64],
        [IDL.Variant({ 'Ok' : AccountInfo, 'Err' : IDL.Text })],
        [],
      ),
    'add_user_device' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : UserProfile, 'Err' : IDL.Text })],
        [],
      ),
    'admin_set_bitpay_pos_token' : IDL.Func([IDL.Text], [], []),
    'cal_unclaim_rewards' : IDL.Func([IDL.Text], [IDL.Nat64], ['query']),
    'calculate_emission' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        ['query'],
      ),
    'check_is_newuser' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'claim_grant' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'claim_mcp_grant' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'claim_rewards' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'clear_notifications_for_pair' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'convert_aio_to_credits' : IDL.Func(
        [IDL.Text, IDL.Nat64],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'create_aio_index_from_json' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'create_and_claim_newmcp_grant' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'create_and_claim_newuser_grant' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'create_contact_from_principal_id' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text)],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'create_mcp_grant' : IDL.Func(
        [NewMcpGrant],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'create_order_and_invoice' : IDL.Func(
        [CreateOrderArgs],
        [IDL.Variant({ 'Ok' : InvoiceResp, 'Err' : IDL.Text })],
        [],
      ),
    'create_pixel_project' : IDL.Func(
        [IDL.Text, PixelArtSource, IDL.Opt(IDL.Text)],
        [IDL.Variant({ 'Ok' : ProjectId, 'Err' : IDL.Text })],
        [],
      ),
    'create_token_grant' : IDL.Func(
        [TokenGrant],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_account' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_aio_index' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_contact' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text })],
        [],
      ),
    'delete_device' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_inverted_index_by_mcp' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_mcp_item' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_pixel_project' : IDL.Func(
        [IDL.Text, ProjectId],
        [IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text })],
        [],
      ),
    'delete_recharge_principal_account_api' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'delete_user_profile' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text })],
        [],
      ),
    'dispatch_mining_rewards' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'export_aio_index_to_json' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        ['query'],
      ),
    'export_pixel_for_device' : IDL.Func(
        [ProjectId, IDL.Opt(VersionId)],
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
    'generate_social_pair_key' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Text],
        ['query'],
      ),
    'get_account_info' : IDL.Func([IDL.Text], [IDL.Opt(AccountInfo)], []),
    'get_accounts_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(AccountInfo)],
        ['query'],
      ),
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
    'get_all_accounts' : IDL.Func([], [IDL.Vec(AccountInfo)], ['query']),
    'get_all_agent_items' : IDL.Func([], [IDL.Vec(AgentItem)], ['query']),
    'get_all_aio_indices' : IDL.Func([], [IDL.Vec(AioIndex)], ['query']),
    'get_all_devices' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [DeviceListResponse],
        ['query'],
      ),
    'get_all_inverted_index_items' : IDL.Func([], [IDL.Text], ['query']),
    'get_all_keywords' : IDL.Func([], [IDL.Text], ['query']),
    'get_all_mcp_grants' : IDL.Func([], [IDL.Vec(NewMcpGrant)], ['query']),
    'get_all_mcp_items' : IDL.Func([], [IDL.Vec(McpItem)], ['query']),
    'get_all_mcp_names' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'get_all_token_grants' : IDL.Func([], [IDL.Vec(TokenGrant)], ['query']),
    'get_all_traces' : IDL.Func([], [IDL.Vec(TraceLog)], ['query']),
    'get_balance_summary' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'unclaimed_balance' : IDL.Nat64,
            'total_amount' : IDL.Nat64,
            'success_count' : IDL.Nat64,
            'total_count' : IDL.Nat64,
          }),
        ],
        ['query'],
      ),
    'get_chat_message_count' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Nat64],
        ['query'],
      ),
    'get_chat_messages_paginated' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(ChatMessage)],
        ['query'],
      ),
    'get_contact_by_id' : IDL.Func([IDL.Nat64], [IDL.Opt(Contact)], ['query']),
    'get_contact_by_principal_ids' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Opt(Contact)],
        ['query'],
      ),
    'get_contacts_by_owner' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Contact)],
        ['query'],
      ),
    'get_contacts_by_owner_paginated' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(Contact)],
        ['query'],
      ),
    'get_credit_activities' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(CreditActivity)],
        ['query'],
      ),
    'get_credit_activities_by_time_period' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(CreditActivity)],
        ['query'],
      ),
    'get_credit_activities_by_type' : IDL.Func(
        [IDL.Text, CreditActivityType],
        [IDL.Vec(CreditActivity)],
        ['query'],
      ),
    'get_credit_activities_paginated' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(CreditActivity)],
        ['query'],
      ),
    'get_credit_activity_statistics' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'total_amount' : IDL.Nat64,
            'success_count' : IDL.Nat64,
            'total_count' : IDL.Nat64,
          }),
        ],
        ['query'],
      ),
    'get_credits_per_icp_api' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_device_by_id' : IDL.Func([IDL.Text], [IDL.Opt(DeviceInfo)], ['query']),
    'get_devices_by_owner' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(DeviceInfo)],
        ['query'],
      ),
    'get_emission_policy' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : EmissionPolicy, 'Err' : IDL.Text })],
        ['query'],
      ),
    'get_kappa' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Float64, 'Err' : IDL.Text })],
        [],
      ),
    'get_mcp_grant' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Opt(NewMcpGrant)],
        ['query'],
      ),
    'get_mcp_grants_by_mcp' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(NewMcpGrant)],
        ['query'],
      ),
    'get_mcp_grants_by_recipient' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(NewMcpGrant)],
        ['query'],
      ),
    'get_mcp_grants_by_status' : IDL.Func(
        [TokenGrantStatus],
        [IDL.Vec(NewMcpGrant)],
        ['query'],
      ),
    'get_mcp_grants_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_mcp_grants_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(NewMcpGrant)],
        ['query'],
      ),
    'get_mcp_item' : IDL.Func([IDL.Text], [IDL.Opt(McpItem)], ['query']),
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
    'get_mcp_rewards_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(RewardEntry)],
        ['query'],
      ),
    'get_mcp_stack_records_paginated' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(McpStackRecord)],
        [],
      ),
    'get_notifications_for_receiver' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(NotificationItem)],
        ['query'],
      ),
    'get_order_by_id' : IDL.Func([IDL.Text], [IDL.Opt(Order)], ['query']),
    'get_pixel_current_source' : IDL.Func(
        [ProjectId],
        [IDL.Opt(PixelArtSource)],
        ['query'],
      ),
    'get_pixel_project' : IDL.Func([ProjectId], [IDL.Opt(Project)], ['query']),
    'get_pixel_project_count_by_owner' : IDL.Func(
        [IDL.Principal],
        [IDL.Nat64],
        ['query'],
      ),
    'get_pixel_projects_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(Project)],
        ['query'],
      ),
    'get_pixel_version' : IDL.Func(
        [ProjectId, VersionId],
        [IDL.Opt(Version)],
        ['query'],
      ),
    'get_recent_chat_messages' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(ChatMessage)],
        ['query'],
      ),
    'get_recharge_history_api' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(RechargeRecord)],
        ['query'],
      ),
    'get_recharge_principal_account_api' : IDL.Func(
        [],
        [IDL.Opt(RechargePrincipalAccount)],
        ['query'],
      ),
    'get_stacked_record_group_by_stack_amount' : IDL.Func(
        [],
        [IDL.Vec(StackPositionRecord)],
        ['query'],
      ),
    'get_token_activities' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TokenActivity)],
        ['query'],
      ),
    'get_token_activities_by_time_period' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TokenActivity)],
        ['query'],
      ),
    'get_token_activities_by_type' : IDL.Func(
        [IDL.Text, TokenActivityType],
        [IDL.Vec(TokenActivity)],
        ['query'],
      ),
    'get_token_activities_paginated' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TokenActivity)],
        ['query'],
      ),
    'get_token_activity_statistics' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'total_amount' : IDL.Nat64,
            'success_count' : IDL.Nat64,
            'total_count' : IDL.Nat64,
          }),
        ],
        ['query'],
      ),
    'get_token_grant' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'get_token_grants_by_recipient' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TokenGrant)],
        ['query'],
      ),
    'get_token_grants_by_status' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TokenGrant)],
        ['query'],
      ),
    'get_token_grants_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_token_grants_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TokenGrant)],
        ['query'],
      ),
    'get_total_aiotoken_claimable' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_total_contacts_by_owner' : IDL.Func(
        [IDL.Text],
        [IDL.Nat64],
        ['query'],
      ),
    'get_total_pixel_project_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_total_stacked_credits' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_total_user_profiles' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_trace' : IDL.Func([IDL.Text], [IDL.Opt(TraceLog)], ['query']),
    'get_trace_by_context' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(TraceLog)],
        ['query'],
      ),
    'get_traces_by_agentname_paginated' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TraceLog)],
        ['query'],
      ),
    'get_traces_by_method' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TraceLog)],
        ['query'],
      ),
    'get_traces_by_operation' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(TraceItem)],
        ['query'],
      ),
    'get_traces_by_protocol' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TraceLog)],
        ['query'],
      ),
    'get_traces_by_status' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TraceLog)],
        ['query'],
      ),
    'get_traces_by_status_paginated' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TraceLog)],
        ['query'],
      ),
    'get_traces_by_time_period' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(TraceItem)],
        ['query'],
      ),
    'get_traces_by_transfer_status' : IDL.Func(
        [IDL.Text, TransferStatus],
        [IDL.Vec(TraceItem)],
        ['query'],
      ),
    'get_traces_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(TraceLog)],
        ['query'],
      ),
    'get_traces_sorted' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Bool],
        [IDL.Vec(TraceItem)],
        ['query'],
      ),
    'get_traces_statistics' : IDL.Func(
        [],
        [
          IDL.Record({
            'error_count' : IDL.Nat64,
            'success_count' : IDL.Nat64,
            'total_count' : IDL.Nat64,
          }),
        ],
        ['query'],
      ),
    'get_traces_statistics_by_account' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)],
        [
          IDL.Record({
            'total_amount' : IDL.Nat,
            'success_amount' : IDL.Nat,
            'failed_amount' : IDL.Nat,
            'total_count' : IDL.Nat64,
          }),
        ],
        ['query'],
      ),
    'get_traces_with_advanced_filters' : IDL.Func(
        [
          IDL.Text,
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Vec(TransferStatus)),
          IDL.Opt(IDL.Nat64),
          IDL.Opt(IDL.Nat64),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Vec(Account)),
        ],
        [IDL.Vec(TraceItem)],
        ['query'],
      ),
    'get_traces_with_filters' : IDL.Func(
        [
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Vec(IDL.Text)),
        ],
        [IDL.Vec(TraceLog)],
        ['query'],
      ),
    'get_user_agent_items' : IDL.Func([], [IDL.Vec(AgentItem)], ['query']),
    'get_user_agent_items_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(AgentItem)],
        ['query'],
      ),
    'get_user_credit_balance_api' : IDL.Func(
        [IDL.Text],
        [IDL.Nat64],
        ['query'],
      ),
    'get_user_mcp_items' : IDL.Func([], [IDL.Vec(McpItem)], ['query']),
    'get_user_mcp_items_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(McpItem)],
        ['query'],
      ),
    'get_user_profile_by_email' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'get_user_profile_by_principal' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'get_user_profile_by_user_id' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'get_user_profiles_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(UserProfile)],
        ['query'],
      ),
    'grant_token' : IDL.Func(
        [TokenGrant],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'init_emission_policy' : IDL.Func([], [], []),
    'init_grant_policy' : IDL.Func([IDL.Opt(GrantPolicy)], [], []),
    'list_pixel_projects_by_owner' : IDL.Func(
        [IDL.Principal, IDL.Nat32, IDL.Nat32],
        [IDL.Vec(Project)],
        ['query'],
      ),
    'list_recharge_principal_accounts_api' : IDL.Func(
        [],
        [IDL.Vec(RechargePrincipalAccount)],
        ['query'],
      ),
    'log_credit_usage' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text, IDL.Opt(IDL.Text)],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'perdic_mining' : IDL.Func(
        [IDL.Bool],
        [IDL.Variant({ 'Ok' : IDL.Vec(RewardEntry), 'Err' : IDL.Text })],
        [],
      ),
    'pop_notification' : IDL.Func([IDL.Text], [IDL.Opt(NotificationItem)], []),
    'recharge_and_convert_credits_api' : IDL.Func(
        [IDL.Float64],
        [IDL.Nat64],
        [],
      ),
    'record_trace_call' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IOValue,
          IOValue,
          IDL.Text,
          IDL.Opt(IDL.Text),
        ],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'remove_user_device' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : UserProfile, 'Err' : IDL.Text })],
        [],
      ),
    'revert_Index_find_by_keywords_strategy' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Text],
        ['query'],
      ),
    'save_pixel_version' : IDL.Func(
        [
          IDL.Text,
          ProjectId,
          PixelArtSource,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [IDL.Variant({ 'Ok' : VersionId, 'Err' : IDL.Text })],
        [],
      ),
    'search_aio_indices_by_keyword' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(AioIndex)],
        ['query'],
      ),
    'search_contacts_by_name' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(Contact)],
        ['query'],
      ),
    'search_devices' : IDL.Func(
        [DeviceFilter],
        [IDL.Vec(DeviceInfo)],
        ['query'],
      ),
    'send_chat_message' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, MessageMode],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'simulate_credit_from_icp_api' : IDL.Func(
        [IDL.Float64],
        [IDL.Nat64],
        ['query'],
      ),
    'stack_credit' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64],
        [IDL.Variant({ 'Ok' : AccountInfo, 'Err' : IDL.Text })],
        [],
      ),
    'stop_mining_rewards' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'store_inverted_index' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'subscribe_plan' : IDL.Func(
        [IDL.Text, SubscriptionPlan],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'transfer_token' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64],
        [IDL.Variant({ 'Ok' : AccountInfo, 'Err' : IDL.Text })],
        [],
      ),
    'unstack_credit' : IDL.Func(
        [IDL.Text, IDL.Nat64],
        [IDL.Variant({ 'Ok' : AccountInfo, 'Err' : IDL.Text })],
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
    'update_contact_devices' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [IDL.Variant({ 'Ok' : Contact, 'Err' : IDL.Text })],
        [],
      ),
    'update_contact_nickname' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : Contact, 'Err' : IDL.Text })],
        [],
      ),
    'update_contact_online_status' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Bool],
        [IDL.Variant({ 'Ok' : Contact, 'Err' : IDL.Text })],
        [],
      ),
    'update_contact_status' : IDL.Func(
        [IDL.Text, IDL.Text, ContactStatus],
        [IDL.Variant({ 'Ok' : Contact, 'Err' : IDL.Text })],
        [],
      ),
    'update_device' : IDL.Func(
        [IDL.Text, DeviceInfo],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_device_last_seen' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_device_status' : IDL.Func(
        [IDL.Text, DeviceStatus],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_emission_policy' : IDL.Func(
        [EmissionPolicy],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_exchange_ratio' : IDL.Func(
        [IDL.Float64],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_icp_usd_price_api' : IDL.Func(
        [IDL.Float64],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_mcp_item' : IDL.Func(
        [IDL.Text, McpItem],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_recharge_principal_account_api' : IDL.Func(
        [RechargePrincipalAccount],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'update_user_devices' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text)],
        [IDL.Variant({ 'Ok' : UserProfile, 'Err' : IDL.Text })],
        [],
      ),
    'update_user_nickname' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : UserProfile, 'Err' : IDL.Text })],
        [],
      ),
    'upsert_contact' : IDL.Func(
        [Contact],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'upsert_user_profile' : IDL.Func(
        [UserProfile],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        [],
      ),
    'use_credit' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text, IDL.Opt(IDL.Text)],
        [IDL.Variant({ 'Ok' : AccountInfo, 'Err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
