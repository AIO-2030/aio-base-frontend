
import * as mockApi from '../mockApi';
import { isUsingMockApi } from './apiConfig';

/**
 * Fetch assets owned by a specific user
 * @param userId User identifier
 * @returns Promise resolving to user assets
 */
export const getUserAssets = async (userId: string): Promise<mockApi.UserAssets> => {
  console.log('Fetching user assets for user:', userId);
  
  if (isUsingMockApi()) {
    return mockApi.getUserAssets(userId);
  }
  
  // Real implementation would query the appropriate canisters
  return mockApi.getUserAssets(userId);
};

/**
 * Fetch token balance and rewards for a user
 * @param userId User identifier
 * @returns Promise resolving to user tokens information
 */
export const getUserTokens = async (userId: string): Promise<mockApi.UserTokens> => {
  console.log('Fetching token information for user:', userId);
  
  if (isUsingMockApi()) {
    return mockApi.getUserTokens(userId);
  }
  
  // Real implementation would query the token ledger canister
  return mockApi.getUserTokens(userId);
};

/**
 * Claim tokens to a wallet address
 * @param userId User identifier
 * @param walletAddress Destination wallet address
 * @param amount Amount of tokens to claim
 * @returns Promise resolving to claim response
 */
export const claimTokens = async (
  userId: string, 
  walletAddress: string, 
  amount: number
): Promise<mockApi.ClaimResponse> => {
  console.log(`Claiming ${amount} tokens for user ${userId} to wallet ${walletAddress}`);
  
  if (isUsingMockApi()) {
    return mockApi.claimTokens(userId, walletAddress, amount);
  }
  
  // Real implementation would interact with the token ledger canister
  return mockApi.claimTokens(userId, walletAddress, amount);
};
