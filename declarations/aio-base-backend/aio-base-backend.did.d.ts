import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface AccountInfo {
  'updated_at' : [] | [bigint],
  'metadata' : [] | [string],
  'created_at' : bigint,
  'principal_id' : string,
  'token_info' : TokenInfo,
}
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
export interface ChatHistory {
  'updated_at' : bigint,
  'social_pair_key' : string,
  'messages' : Array<ChatMessage>,
  'created_at' : bigint,
}
export interface ChatMessage {
  'content' : string,
  'mode' : MessageMode,
  'timestamp' : bigint,
  'send_by' : string,
}
export interface Contact {
  'id' : bigint,
  'status' : ContactStatus,
  'updated_at' : bigint,
  'nickname' : [] | [string],
  'metadata' : [] | [string],
  'name' : string,
  'created_at' : bigint,
  'owner_principal_id' : string,
  'is_online' : boolean,
  'contact_type' : ContactType,
  'devices' : Array<string>,
  'contact_principal_id' : string,
  'avatar' : [] | [string],
}
export type ContactStatus = { 'Blocked' : null } |
  { 'Active' : null } |
  { 'Deleted' : null } |
  { 'Pending' : null };
export type ContactType = { 'Family' : null } |
  { 'System' : null } |
  { 'Business' : null } |
  { 'Friend' : null };
export interface CreateOrderArgs {
  'sku' : string,
  'redirect_base' : string,
  'shipping_address' : string,
  'buyer_email' : [] | [string],
  'currency' : string,
  'order_id' : string,
  'amount' : number,
}
export interface CreditActivity {
  'status' : TransferStatus,
  'activity_type' : CreditActivityType,
  'metadata' : [] | [string],
  'timestamp' : bigint,
  'principal_id' : string,
  'amount' : bigint,
}
export type CreditActivityType = { 'Spend' : null } |
  { 'Stack' : null } |
  { 'Earn' : null } |
  { 'Reward' : null } |
  { 'Unstack' : null };
export type DeviceCapability = { 'Storage' : null } |
  { 'Network' : null } |
  { 'Compute' : null } |
  { 'Custom' : string } |
  { 'Sensor' : null } |
  { 'Audio' : null } |
  { 'Video' : null };
export interface DeviceFilter {
  'status' : [] | [DeviceStatus],
  'owner' : [] | [Principal],
  'device_type' : [] | [DeviceType],
  'capability' : [] | [DeviceCapability],
}
export interface DeviceInfo {
  'id' : string,
  'status' : DeviceStatus,
  'updated_at' : bigint,
  'capabilities' : Array<DeviceCapability>,
  'owner' : Principal,
  'metadata' : Array<[string, string]>,
  'name' : string,
  'device_type' : DeviceType,
  'created_at' : bigint,
  'last_seen' : bigint,
}
export interface DeviceListResponse {
  'total' : bigint,
  'offset' : bigint,
  'limit' : bigint,
  'devices' : Array<DeviceInfo>,
}
export type DeviceStatus = { 'Online' : null } |
  { 'Disabled' : null } |
  { 'Maintenance' : null } |
  { 'Offline' : null };
export type DeviceType = { 'IoT' : null } |
  { 'Server' : null } |
  { 'Embedded' : null } |
  { 'Other' : string } |
  { 'Desktop' : null } |
  { 'Mobile' : null };
export interface EmissionPolicy {
  'subscription_multipliers' : Array<[SubscriptionPlan, number]>,
  'last_update_time' : bigint,
  'base_rate' : bigint,
  'kappa_factor' : number,
  'staking_bonus' : number,
}
export interface Frame { 'pixels' : Array<PixelRow>, 'duration_ms' : number }
export type GrantAction = { 'NewUser' : null } |
  { 'NewDeveloper' : null };
export interface GrantPolicy {
  'grant_duration' : bigint,
  'grant_amount' : bigint,
  'grant_action' : GrantAction,
}
export interface IOData { 'value' : string, 'data_type' : string }
export interface IOValue {
  'value' : { 'Null' : null } |
    { 'Text' : string } |
    { 'Object' : string } |
    { 'Boolean' : boolean } |
    { 'Array' : string } |
    { 'Number' : number },
  'data_type' : string,
}
export interface InputSchema {
  'schema_type' : string,
  'properties' : Array<[string, SchemaProperty]>,
  'required' : [] | [Array<string>],
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
export interface InvoiceResp { 'invoice_id' : string, 'invoice_url' : string }
export type LoginMethod = { 'II' : null } |
  { 'Google' : null } |
  { 'Wallet' : null };
export type LoginStatus = { 'Authenticated' : null } |
  { 'Unauthenticated' : null };
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
export interface McpStackRecord {
  'mcp_name' : string,
  'stack_time' : bigint,
  'stack_amount' : bigint,
  'stack_status' : StackStatus,
  'principal_id' : string,
}
export type MessageMode = { 'Gif' : null } |
  { 'Emoji' : null } |
  { 'Text' : null } |
  { 'Image' : null } |
  { 'PixelArt' : null } |
  { 'Voice' : null };
export interface Method {
  'name' : string,
  'description' : string,
  'required_params' : [] | [Array<string>],
  'input_schema' : [] | [InputSchema],
}
export interface NewMcpGrant {
  'status' : TokenGrantStatus,
  'claimed_amount' : bigint,
  'mcp_name' : string,
  'recipient' : string,
  'start_time' : bigint,
  'amount' : bigint,
}
export interface NotificationItem {
  'social_pair_key' : string,
  'to_who' : string,
  'timestamp' : bigint,
  'message_id' : bigint,
}
export interface Order {
  'sku' : string,
  'status' : OrderStatus,
  'shipment_no' : [] | [string],
  'shipping_address' : string,
  'updated_at_ns' : bigint,
  'buyer_email' : [] | [string],
  'created_at_ns' : bigint,
  'currency' : string,
  'order_id' : string,
  'amount' : number,
  'bitpay_invoice_url' : [] | [string],
  'bitpay_invoice_id' : [] | [string],
}
export type OrderStatus = { 'New' : null } |
  { 'Invalid' : null } |
  { 'Paid' : null } |
  { 'Delivered' : null } |
  { 'Complete' : null } |
  { 'Confirmed' : null } |
  { 'Created' : null } |
  { 'Expired' : null };
export interface PixelArtData {
  'height' : number,
  'device_format' : string,
  'chat_format' : string,
  'source_id' : [] | [string],
  'palette' : Array<string>,
  'source_type' : string,
  'width' : number,
}
export interface PixelArtSource {
  'height' : number,
  'metadata' : [] | [SourceMeta],
  'palette' : Array<string>,
  'pixels' : Array<PixelRow>,
  'frames' : [] | [Array<Frame>],
  'width' : number,
}
export type PixelRow = Uint16Array | number[];
export type Platform = { 'Linux' : null } |
  { 'Both' : null } |
  { 'Windows' : null };
export interface Project {
  'updated_at' : bigint,
  'owner' : Principal,
  'history' : Array<Version>,
  'created_at' : bigint,
  'current_version' : Version,
  'project_id' : ProjectId,
}
export type ProjectId = string;
export interface ProtocolCall {
  'id' : number,
  'protocol' : string,
  'status' : string,
  'method' : string,
  'output' : IOValue,
  'agent' : string,
  'error_message' : [] | [string],
  'input' : IOValue,
  'call_type' : string,
}
export interface RechargePrincipalAccount {
  'subaccount_id' : [] | [string],
  'principal_id' : string,
}
export interface RechargeRecord {
  'user' : Principal,
  'timestamp' : bigint,
  'credits_obtained' : bigint,
  'icp_amount' : number,
}
export interface RewardEntry {
  'status' : string,
  'block_id' : bigint,
  'mcp_name' : string,
  'reward_amount' : bigint,
  'principal_id' : Principal,
}
export type RiskLevel = { 'Low' : null } |
  { 'High' : null } |
  { 'Medium' : null };
export interface SchemaProperty {
  'description' : [] | [string],
  'properties' : [] | [Array<[string, SchemaProperty]>],
  'default' : [] | [string],
  'required' : [] | [Array<string>],
  'property_type' : string,
  'items' : [] | [SchemaProperty],
  'enum_values' : [] | [Array<string>],
}
export interface Source {
  'author' : string,
  'version' : string,
  'github' : string,
}
export interface SourceMeta {
  'title' : [] | [string],
  'tags' : [] | [Array<string>],
  'description' : [] | [string],
}
export interface StackPositionRecord {
  'id' : bigint,
  'mcp_name' : string,
  'stack_amount' : bigint,
}
export type StackStatus = { 'Unstacked' : null } |
  { 'Stacked' : null };
export type SubscriptionPlan = { 'Premium' : null } |
  { 'Enterprise' : null } |
  { 'Free' : null } |
  { 'Basic' : null };
export interface TokenActivity {
  'to' : string,
  'status' : TransferStatus,
  'activity_type' : TokenActivityType,
  'metadata' : [] | [string],
  'from' : string,
  'timestamp' : bigint,
  'amount' : bigint,
}
export type TokenActivityType = { 'Stack' : null } |
  { 'Grant' : null } |
  { 'Vest' : null } |
  { 'Unstack' : null } |
  { 'Transfer' : null } |
  { 'Claim' : null };
export interface TokenGrant {
  'status' : TokenGrantStatus,
  'claimed_amount' : bigint,
  'recipient' : string,
  'start_time' : bigint,
  'amount' : bigint,
}
export type TokenGrantStatus = { 'Active' : null } |
  { 'Cancelled' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export interface TokenInfo {
  'kappa_multiplier' : number,
  'staked_credits' : bigint,
  'credit_balance' : bigint,
  'token_balance' : bigint,
}
export interface TraceItem {
  'id' : string,
  'status' : TransferStatus,
  'updated_at' : bigint,
  'owner' : string,
  'metadata' : [] | [string],
  'calls' : Array<CallItem>,
  'created_at' : bigint,
  'error' : [] | [string],
  'to_account' : Account,
  'trace_id' : string,
  'from_account' : Account,
  'amount' : bigint,
}
export interface TraceLog {
  'context_id' : string,
  'calls' : Array<ProtocolCall>,
  'trace_id' : string,
}
export interface TraceStatistics {
  'total_amount' : bigint,
  'success_amount' : bigint,
  'failed_amount' : bigint,
  'total_count' : bigint,
}
export type TraceStatus = { 'Ok' : null } |
  { 'Fail' : null } |
  { 'Recall' : null };
export type TransferStatus = { 'Failed' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export interface UserProfile {
  'updated_at' : bigint,
  'nickname' : string,
  'metadata' : [] | [string],
  'name' : [] | [string],
  'wallet_address' : [] | [string],
  'created_at' : bigint,
  'user_id' : string,
  'email' : [] | [string],
  'picture' : [] | [string],
  'login_status' : LoginStatus,
  'login_method' : LoginMethod,
  'principal_id' : string,
  'devices' : Array<string>,
}
export interface Version {
  'version_id' : VersionId,
  'source' : PixelArtSource,
  'editor' : Principal,
  'created_at' : bigint,
  'message' : [] | [string],
}
export type VersionId = string;
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
  'add_account' : ActorMethod<
    [string],
    { 'Ok' : AccountInfo } |
      { 'Err' : string }
  >,
  'add_agent_item' : ActorMethod<
    [AgentItem, string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'add_device' : ActorMethod<
    [DeviceInfo],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'add_mcp_item' : ActorMethod<
    [McpItem, string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'add_recharge_principal_account_api' : ActorMethod<
    [RechargePrincipalAccount],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'add_token_balance' : ActorMethod<
    [string, bigint],
    { 'Ok' : AccountInfo } |
      { 'Err' : string }
  >,
  'add_user_device' : ActorMethod<
    [string, string],
    { 'Ok' : UserProfile } |
      { 'Err' : string }
  >,
  'admin_set_bitpay_pos_token' : ActorMethod<[string], undefined>,
  'cal_unclaim_rewards' : ActorMethod<[string], bigint>,
  'calculate_emission' : ActorMethod<
    [string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'check_is_newuser' : ActorMethod<[string], boolean>,
  'claim_grant' : ActorMethod<[string], { 'Ok' : bigint } | { 'Err' : string }>,
  'claim_mcp_grant' : ActorMethod<
    [string, string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'claim_rewards' : ActorMethod<
    [string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'clear_notifications_for_pair' : ActorMethod<
    [string, string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'convert_aio_to_credits' : ActorMethod<
    [string, bigint],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'create_aio_index_from_json' : ActorMethod<
    [string, string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'create_and_claim_newmcp_grant' : ActorMethod<
    [string, string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'create_and_claim_newuser_grant' : ActorMethod<
    [string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'create_contact_from_principal_id' : ActorMethod<
    [string, string, [] | [string]],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'create_mcp_grant' : ActorMethod<
    [NewMcpGrant],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'create_order_and_invoice' : ActorMethod<
    [CreateOrderArgs],
    { 'Ok' : InvoiceResp } |
      { 'Err' : string }
  >,
  'create_pixel_project' : ActorMethod<
    [string, PixelArtSource, [] | [string]],
    { 'Ok' : ProjectId } |
      { 'Err' : string }
  >,
  'create_token_grant' : ActorMethod<
    [TokenGrant],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_account' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_aio_index' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_contact' : ActorMethod<
    [string, string],
    { 'Ok' : boolean } |
      { 'Err' : string }
  >,
  'delete_device' : ActorMethod<[string], { 'Ok' : null } | { 'Err' : string }>,
  'delete_inverted_index_by_mcp' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_mcp_item' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_pixel_project' : ActorMethod<
    [string, ProjectId],
    { 'Ok' : boolean } |
      { 'Err' : string }
  >,
  'delete_recharge_principal_account_api' : ActorMethod<
    [],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'delete_user_profile' : ActorMethod<
    [string],
    { 'Ok' : boolean } |
      { 'Err' : string }
  >,
  'dispatch_mining_rewards' : ActorMethod<
    [],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'export_aio_index_to_json' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'export_pixel_for_device' : ActorMethod<
    [ProjectId, [] | [VersionId]],
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
  'generate_social_pair_key' : ActorMethod<[string, string], string>,
  'get_account_info' : ActorMethod<[string], [] | [AccountInfo]>,
  'get_accounts_paginated' : ActorMethod<[bigint, bigint], Array<AccountInfo>>,
  'get_agent_item' : ActorMethod<[bigint], [] | [AgentItem]>,
  'get_agent_item_by_name' : ActorMethod<[string], [] | [AgentItem]>,
  'get_agent_items_paginated' : ActorMethod<[bigint, bigint], Array<AgentItem>>,
  'get_aio_index' : ActorMethod<[string], [] | [AioIndex]>,
  'get_aio_indices_count' : ActorMethod<[], bigint>,
  'get_aio_indices_paginated' : ActorMethod<[bigint, bigint], Array<AioIndex>>,
  'get_all_accounts' : ActorMethod<[], Array<AccountInfo>>,
  'get_all_agent_items' : ActorMethod<[], Array<AgentItem>>,
  'get_all_aio_indices' : ActorMethod<[], Array<AioIndex>>,
  'get_all_devices' : ActorMethod<[bigint, bigint], DeviceListResponse>,
  'get_all_inverted_index_items' : ActorMethod<[], string>,
  'get_all_keywords' : ActorMethod<[], string>,
  'get_all_mcp_grants' : ActorMethod<[], Array<NewMcpGrant>>,
  'get_all_mcp_items' : ActorMethod<[], Array<McpItem>>,
  'get_all_mcp_names' : ActorMethod<[], Array<string>>,
  'get_all_token_grants' : ActorMethod<[], Array<TokenGrant>>,
  'get_all_traces' : ActorMethod<[], Array<TraceLog>>,
  'get_balance_summary' : ActorMethod<
    [string],
    {
      'unclaimed_balance' : bigint,
      'total_amount' : bigint,
      'success_count' : bigint,
      'total_count' : bigint,
    }
  >,
  'get_chat_message_count' : ActorMethod<[string, string], bigint>,
  'get_chat_messages_paginated' : ActorMethod<
    [string, string, bigint, bigint],
    Array<ChatMessage>
  >,
  'get_contact_by_id' : ActorMethod<[bigint], [] | [Contact]>,
  'get_contact_by_principal_ids' : ActorMethod<
    [string, string],
    [] | [Contact]
  >,
  'get_contacts_by_owner' : ActorMethod<[string], Array<Contact>>,
  'get_contacts_by_owner_paginated' : ActorMethod<
    [string, bigint, bigint],
    Array<Contact>
  >,
  'get_credit_activities' : ActorMethod<[string], Array<CreditActivity>>,
  'get_credit_activities_by_time_period' : ActorMethod<
    [string, bigint, bigint],
    Array<CreditActivity>
  >,
  'get_credit_activities_by_type' : ActorMethod<
    [string, CreditActivityType],
    Array<CreditActivity>
  >,
  'get_credit_activities_paginated' : ActorMethod<
    [string, bigint, bigint],
    Array<CreditActivity>
  >,
  'get_credit_activity_statistics' : ActorMethod<
    [string],
    {
      'total_amount' : bigint,
      'success_count' : bigint,
      'total_count' : bigint,
    }
  >,
  'get_credits_per_icp_api' : ActorMethod<[], bigint>,
  'get_device_by_id' : ActorMethod<[string], [] | [DeviceInfo]>,
  'get_devices_by_owner' : ActorMethod<[string], Array<DeviceInfo>>,
  'get_emission_policy' : ActorMethod<
    [],
    { 'Ok' : EmissionPolicy } |
      { 'Err' : string }
  >,
  'get_kappa' : ActorMethod<[string], { 'Ok' : number } | { 'Err' : string }>,
  'get_mcp_grant' : ActorMethod<[string, string], [] | [NewMcpGrant]>,
  'get_mcp_grants_by_mcp' : ActorMethod<[string], Array<NewMcpGrant>>,
  'get_mcp_grants_by_recipient' : ActorMethod<[string], Array<NewMcpGrant>>,
  'get_mcp_grants_by_status' : ActorMethod<
    [TokenGrantStatus],
    Array<NewMcpGrant>
  >,
  'get_mcp_grants_count' : ActorMethod<[], bigint>,
  'get_mcp_grants_paginated' : ActorMethod<
    [bigint, bigint],
    Array<NewMcpGrant>
  >,
  'get_mcp_item' : ActorMethod<[string], [] | [McpItem]>,
  'get_mcp_item_by_name' : ActorMethod<[string], [] | [McpItem]>,
  'get_mcp_items_paginated' : ActorMethod<[bigint, bigint], Array<McpItem>>,
  'get_mcp_rewards_paginated' : ActorMethod<
    [bigint, bigint],
    Array<RewardEntry>
  >,
  'get_mcp_stack_records_paginated' : ActorMethod<
    [string, bigint, bigint],
    Array<McpStackRecord>
  >,
  'get_notifications_for_receiver' : ActorMethod<
    [string],
    Array<NotificationItem>
  >,
  'get_order_by_id' : ActorMethod<[string], [] | [Order]>,
  'get_pixel_current_source' : ActorMethod<[ProjectId], [] | [PixelArtSource]>,
  'get_pixel_project' : ActorMethod<[ProjectId], [] | [Project]>,
  'get_pixel_project_count_by_owner' : ActorMethod<[Principal], bigint>,
  'get_pixel_projects_paginated' : ActorMethod<
    [bigint, bigint],
    Array<Project>
  >,
  'get_pixel_version' : ActorMethod<[ProjectId, VersionId], [] | [Version]>,
  'get_recent_chat_messages' : ActorMethod<
    [string, string],
    Array<ChatMessage>
  >,
  'get_recharge_history_api' : ActorMethod<
    [string, bigint, bigint],
    Array<RechargeRecord>
  >,
  'get_recharge_principal_account_api' : ActorMethod<
    [],
    [] | [RechargePrincipalAccount]
  >,
  'get_stacked_record_group_by_stack_amount' : ActorMethod<
    [],
    Array<StackPositionRecord>
  >,
  'get_token_activities' : ActorMethod<[string], Array<TokenActivity>>,
  'get_token_activities_by_time_period' : ActorMethod<
    [string, bigint, bigint],
    Array<TokenActivity>
  >,
  'get_token_activities_by_type' : ActorMethod<
    [string, TokenActivityType],
    Array<TokenActivity>
  >,
  'get_token_activities_paginated' : ActorMethod<
    [string, bigint, bigint],
    Array<TokenActivity>
  >,
  'get_token_activity_statistics' : ActorMethod<
    [string],
    {
      'total_amount' : bigint,
      'success_count' : bigint,
      'total_count' : bigint,
    }
  >,
  'get_token_grant' : ActorMethod<[string], boolean>,
  'get_token_grants_by_recipient' : ActorMethod<[string], Array<TokenGrant>>,
  'get_token_grants_by_status' : ActorMethod<[string], Array<TokenGrant>>,
  'get_token_grants_count' : ActorMethod<[], bigint>,
  'get_token_grants_paginated' : ActorMethod<
    [bigint, bigint],
    Array<TokenGrant>
  >,
  'get_total_aiotoken_claimable' : ActorMethod<[], bigint>,
  'get_total_contacts_by_owner' : ActorMethod<[string], bigint>,
  'get_total_pixel_project_count' : ActorMethod<[], bigint>,
  'get_total_stacked_credits' : ActorMethod<[], bigint>,
  'get_total_user_profiles' : ActorMethod<[], bigint>,
  'get_trace' : ActorMethod<[string], [] | [TraceLog]>,
  'get_trace_by_context' : ActorMethod<[string], [] | [TraceLog]>,
  'get_traces_by_agentname_paginated' : ActorMethod<
    [string, bigint, bigint],
    Array<TraceLog>
  >,
  'get_traces_by_method' : ActorMethod<[string], Array<TraceLog>>,
  'get_traces_by_operation' : ActorMethod<[string, string], Array<TraceItem>>,
  'get_traces_by_protocol' : ActorMethod<[string], Array<TraceLog>>,
  'get_traces_by_status' : ActorMethod<[string], Array<TraceLog>>,
  'get_traces_by_status_paginated' : ActorMethod<
    [string, bigint, bigint],
    Array<TraceLog>
  >,
  'get_traces_by_time_period' : ActorMethod<[string, string], Array<TraceItem>>,
  'get_traces_by_transfer_status' : ActorMethod<
    [string, TransferStatus],
    Array<TraceItem>
  >,
  'get_traces_paginated' : ActorMethod<[bigint, bigint], Array<TraceLog>>,
  'get_traces_sorted' : ActorMethod<
    [string, string, boolean],
    Array<TraceItem>
  >,
  'get_traces_statistics' : ActorMethod<
    [],
    { 'error_count' : bigint, 'success_count' : bigint, 'total_count' : bigint }
  >,
  'get_traces_statistics_by_account' : ActorMethod<
    [string, [] | [bigint], [] | [bigint]],
    {
      'total_amount' : bigint,
      'success_amount' : bigint,
      'failed_amount' : bigint,
      'total_count' : bigint,
    }
  >,
  'get_traces_with_advanced_filters' : ActorMethod<
    [
      string,
      [] | [Array<string>],
      [] | [Array<TransferStatus>],
      [] | [bigint],
      [] | [bigint],
      [] | [bigint],
      [] | [bigint],
      [] | [Array<Account>],
    ],
    Array<TraceItem>
  >,
  'get_traces_with_filters' : ActorMethod<
    [[] | [Array<string>], [] | [Array<string>], [] | [Array<string>]],
    Array<TraceLog>
  >,
  'get_user_agent_items' : ActorMethod<[], Array<AgentItem>>,
  'get_user_agent_items_paginated' : ActorMethod<
    [bigint, bigint],
    Array<AgentItem>
  >,
  'get_user_credit_balance_api' : ActorMethod<[string], bigint>,
  'get_user_mcp_items' : ActorMethod<[], Array<McpItem>>,
  'get_user_mcp_items_paginated' : ActorMethod<
    [bigint, bigint],
    Array<McpItem>
  >,
  'get_user_profile_by_email' : ActorMethod<[string], [] | [UserProfile]>,
  'get_user_profile_by_principal' : ActorMethod<[string], [] | [UserProfile]>,
  'get_user_profile_by_user_id' : ActorMethod<[string], [] | [UserProfile]>,
  'get_user_profiles_paginated' : ActorMethod<
    [bigint, bigint],
    Array<UserProfile>
  >,
  'grant_token' : ActorMethod<
    [TokenGrant],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'greet' : ActorMethod<[string], string>,
  'init_emission_policy' : ActorMethod<[], undefined>,
  'init_grant_policy' : ActorMethod<[[] | [GrantPolicy]], undefined>,
  'list_pixel_projects_by_owner' : ActorMethod<
    [Principal, number, number],
    Array<Project>
  >,
  'list_recharge_principal_accounts_api' : ActorMethod<
    [],
    Array<RechargePrincipalAccount>
  >,
  'log_credit_usage' : ActorMethod<
    [string, bigint, string, [] | [string]],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'perdic_mining' : ActorMethod<
    [boolean],
    { 'Ok' : Array<RewardEntry> } |
      { 'Err' : string }
  >,
  'pop_notification' : ActorMethod<[string], [] | [NotificationItem]>,
  'recharge_and_convert_credits_api' : ActorMethod<[number], bigint>,
  'record_trace_call' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      IOValue,
      IOValue,
      string,
      [] | [string],
    ],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'remove_user_device' : ActorMethod<
    [string, string],
    { 'Ok' : UserProfile } |
      { 'Err' : string }
  >,
  'revert_Index_find_by_keywords_strategy' : ActorMethod<
    [Array<string>],
    string
  >,
  'save_pixel_version' : ActorMethod<
    [string, ProjectId, PixelArtSource, [] | [string], [] | [string]],
    { 'Ok' : VersionId } |
      { 'Err' : string }
  >,
  'search_aio_indices_by_keyword' : ActorMethod<[string], Array<AioIndex>>,
  'search_contacts_by_name' : ActorMethod<[string, string], Array<Contact>>,
  'search_devices' : ActorMethod<[DeviceFilter], Array<DeviceInfo>>,
  'send_chat_message' : ActorMethod<
    [string, string, string, MessageMode],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'simulate_credit_from_icp_api' : ActorMethod<[number], bigint>,
  'stack_credit' : ActorMethod<
    [string, string, bigint],
    { 'Ok' : AccountInfo } |
      { 'Err' : string }
  >,
  'stop_mining_rewards' : ActorMethod<[], { 'Ok' : null } | { 'Err' : string }>,
  'store_inverted_index' : ActorMethod<
    [string, string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'subscribe_plan' : ActorMethod<
    [string, SubscriptionPlan],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'transfer_token' : ActorMethod<
    [string, string, bigint],
    { 'Ok' : AccountInfo } |
      { 'Err' : string }
  >,
  'unstack_credit' : ActorMethod<
    [string, bigint],
    { 'Ok' : AccountInfo } |
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
  'update_contact_devices' : ActorMethod<
    [string, string, Array<string>],
    { 'Ok' : Contact } |
      { 'Err' : string }
  >,
  'update_contact_nickname' : ActorMethod<
    [string, string, string],
    { 'Ok' : Contact } |
      { 'Err' : string }
  >,
  'update_contact_online_status' : ActorMethod<
    [string, string, boolean],
    { 'Ok' : Contact } |
      { 'Err' : string }
  >,
  'update_contact_status' : ActorMethod<
    [string, string, ContactStatus],
    { 'Ok' : Contact } |
      { 'Err' : string }
  >,
  'update_device' : ActorMethod<
    [string, DeviceInfo],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_device_last_seen' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_device_status' : ActorMethod<
    [string, DeviceStatus],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_emission_policy' : ActorMethod<
    [EmissionPolicy],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_exchange_ratio' : ActorMethod<
    [number],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_icp_usd_price_api' : ActorMethod<
    [number],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_mcp_item' : ActorMethod<
    [string, McpItem],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_recharge_principal_account_api' : ActorMethod<
    [RechargePrincipalAccount],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'update_user_devices' : ActorMethod<
    [string, Array<string>],
    { 'Ok' : UserProfile } |
      { 'Err' : string }
  >,
  'update_user_nickname' : ActorMethod<
    [string, string],
    { 'Ok' : UserProfile } |
      { 'Err' : string }
  >,
  'upsert_contact' : ActorMethod<
    [Contact],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'upsert_user_profile' : ActorMethod<
    [UserProfile],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'use_credit' : ActorMethod<
    [string, bigint, string, [] | [string]],
    { 'Ok' : AccountInfo } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
