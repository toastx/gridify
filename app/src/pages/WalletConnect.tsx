import { PublicKey, Transaction } from "@solana/web3.js";
import { createContext, createSignal, useContext, JSX } from "solid-js";

interface WalletContextType {
  wallet: () => any;
  connectWallet: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  isConnected: boolean;
  publicKey: PublicKey;
}
declare global {
  interface Window {
      solana: {
        signTransaction(transaction: Transaction): Promise<Transaction>;
        SignAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
        publicKey: PublicKey;
        isConnected: boolean;
      };
  }
}

const WalletContext = createContext<WalletContextType>();

export function WalletProvider(props: { children: JSX.Element }) {
  const [wallet, setWallet] = createSignal<any>(null);

  const connectWallet = async () => {
    try {
      if (!window.solana) {
        alert('Please install Phantom wallet');
        return;
      }
      const response = await window.solana.connect();
      setWallet(response);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  const signTransaction = async (transaction: any) => {
    if (!wallet()) {
      throw new Error('Wallet not connected');
    }
    return await window.solana.signTransaction(transaction);
  };
  const isConnected = window.solana.isConnected;
  const publicKey = window.solana.publicKey;

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, signTransaction, isConnected, publicKey }}>
      {props.children}
    </WalletContext.Provider>
  );
}

// Hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
