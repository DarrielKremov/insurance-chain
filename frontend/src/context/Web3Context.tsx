import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import type { MetaMaskInpageProvider } from '@metamask/providers';

const SUPPORTED_CHAINS = {
  SEPOLIA: 11155111,
  LOCALHOST: 31337
} as const;

interface Web3ContextData {
  isConnected: boolean;
  isLoading: boolean;
  isValidNetwork: boolean;
  initialized: boolean;
  error: string | null;
  account: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const Web3Context = createContext<Web3ContextData>({
  isConnected: false,
  isLoading: true,
  isValidNetwork: false,
  initialized: false,
  error: null,
  account: null,
  chainId: null,
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {}
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  const isValidNetwork = (chainId: number | null): boolean => 
    chainId !== null && Object.values(SUPPORTED_CHAINS).includes(chainId as 11155111 | 31337);

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;
    setIsLoading(true);
    setError(null);
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
    } catch (error) {
      setError('Failed to switch network');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const network = await browserProvider.getNetwork();
      const newSigner = await browserProvider.getSigner();
      
      setProvider(browserProvider);
      setSigner(newSigner);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (error) {
      setError('Failed to connect to MetaMask');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setError(null);
    alert('Account connection cleared. Disconnect from MetaMask to change accounts. Press connect button again to reconnect with same account.');
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await connect();
        } catch (error) {
          console.error('Failed to initialize:', error);
        }
      }
      setInitialized(true);
      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: unknown) => {
      if (Array.isArray(accounts)) {
        setAccount(accounts[0] || null);
      }
    };

    const handleChainChanged = (newChainId: unknown) => {
      setChainId(Number(newChainId));
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{
      isConnected: !!account,
      isLoading,
      isValidNetwork: isValidNetwork(chainId),
      initialized,
      error,
      account,
      chainId,
      provider,
      signer,
      connect,
      disconnect,
      switchNetwork
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};