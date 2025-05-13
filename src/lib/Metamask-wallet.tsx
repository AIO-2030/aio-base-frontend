import { useState, useEffect } from 'react';

// Extend Window interface to include ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Define types for token management
interface ERC20Token {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
}

/**
 * Custom hook for MetaMask integration
 */
export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = (): boolean => {
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
  };

  // Function to connect wallet
  const connectWallet = async (): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainIdHex);
        return accounts[0];
      }
      return null;
    } catch (err: any) {
      console.error('Failed to connect to MetaMask:', err);
      setError(err.message || 'Failed to connect');
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to add ERC20 token to MetaMask
  const addToken = async (token: ERC20Token): Promise<boolean> => {
    try {
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed');
      }

      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.image,
          },
        },
      });

      return Boolean(wasAdded);
    } catch (err: any) {
      console.error('Error adding token:', err);
      setError(err.message || 'Failed to add token');
      return false;
    }
  };

  // Function to disconnect
  const disconnectWallet = (): void => {
    setAccount(null);
    setChainId(null);
  };

  // Listen for account changes and setup initial state
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(chainIdHex);
          }
        } catch (err) {
          console.error("Error checking MetaMask connection:", err);
        }
      }
    };

    checkConnection();

    // Setup event listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(chainIdHex);
        window.location.reload();
      };

      const handleDisconnect = () => {
        setAccount(null);
        setChainId(null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, []);

  return {
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    addToken,
    isMetaMaskInstalled,
  };
};

// Helper function to check if device is mobile
export const isMobileDevice = (): boolean => {
  return 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    (navigator as any).msMaxTouchPoints > 0;
};

// Deep link to MetaMask mobile app
export const openMetaMaskMobile = (): void => {
  // Create deep link with current URL (without http/https prefix)
  const currentUrl = window.location.href.replace(/^https?:\/\//, '');
  const deepLink = `https://metamask.app.link/dapp/${currentUrl}`;
  window.open(deepLink, '_blank');
};

// Helper to format address for display
export const shortenAddress = (address: string | null | undefined): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Main hook to use in components
export const useMetaMaskConnect = () => {
  const {
    account,
    connectWallet,
    isConnecting,
    isMetaMaskInstalled,
    addToken,
  } = useMetaMask();
  
  const handleConnectWallet = async () => {
    if (isMetaMaskInstalled()) {
      await connectWallet();
    } else {
      if (isMobileDevice()) {
        openMetaMaskMobile();
      } else {
        window.open('https://metamask.io/download/', '_blank');
      }
    }
  };

  // Function to add a token to MetaMask
  const handleAddToken = async (token: ERC20Token) => {
    if (!account) {
      await connectWallet();
    }
    return await addToken(token);
  };
  
  return {
    account,
    isConnecting,
    handleConnectWallet,
    handleAddToken,
    shortenAddress,
  };
};
