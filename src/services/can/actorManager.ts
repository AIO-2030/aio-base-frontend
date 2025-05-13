import { Actor, HttpAgent, ActorSubclass } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { aio_base_backend } from "declarations/aio-base-backend";
import { isLocalNet, getCanisterId } from "@/util/env";
import { plugStorage, usePlug } from "@/lib/plug-wallet";
import type { _SERVICE } from "declarations/aio-base-backend/aio-base-backend.did.d.ts";

// Canister IDs - replace with actual values for your environment
const CANISTER_ID = {
  LOCAL: 'bd3sg-teaaa-aaaaa-qaaba-cai', // Example local canister ID
  PROD: 'ryjl3-tyaaa-aaaaa-aaaba-cai',  // Example production canister ID
};

// Identity provider URL
const IDENTITY_PROVIDER = isLocalNet()
  ? `http://localhost:4943`
  : "https://identity.ic0.app";

// IC hosts for different environments
const IC_HOST = {
  LOCAL: "http://localhost:4943",
  PROD: "https://ic0.app"
};

// Actor singleton for re-use
let actor: ActorSubclass<_SERVICE> | null = null;
let authClient: AuthClient | null = null;

export const getActor = async (): Promise<ActorSubclass<_SERVICE>> => {
  console.info("Getting actor instance!!!!");
  return aio_base_backend;
}

export const getPrincipalFromPlug = async (): Promise<string | null> => {
  try {
    // First check if we have a cached principal
    const cachedPrincipal = plugStorage.getPrincipal();
    if (cachedPrincipal) {
      console.info("Using cached principal ID", cachedPrincipal);
      return cachedPrincipal;
    }
    // No cached principal, try to connect to Plug wallet
    console.info("No cached principal, attempting to reconnect with Plug wallet");

    try {
      // Use the usePlug function to reconnect
      const plugInstance = usePlug();

      if (plugInstance.principalId) {
        plugStorage.setPrincipal(plugInstance.principalId);
        return plugInstance.principalId;
      }
    } catch (error) {
      console.error("Error reconnecting to Plug wallet:", error);
    }

    // Return null if we couldn't get a principal
    return null;
  } catch (error) {
    console.error("Error getting principal from Plug:", error);
    return null;
  }
}
