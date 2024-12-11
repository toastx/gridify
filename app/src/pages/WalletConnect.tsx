import { PublicKey, Transaction } from "@solana/web3.js";
import { createContext, createSignal, useContext, JSX, onCleanup } from "solid-js";

interface WalletContextType {
  wallet: () => any;
  connectWallet: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  isConnected: () => boolean;
  publicKey: () => PublicKey | null;
}
declare global {
  interface Window {
    solana: {
      signTransaction(transaction: Transaction): Promise<Transaction>;
      SignAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      publicKey: PublicKey;
      isConnected: boolean;
    };
  }
}

const WalletContext = createContext<WalletContextType>();

export function WalletProvider(props: { children: JSX.Element }) {
  const [wallet, setWallet] = createSignal<any>(null);
  const [isConnected, setIsConnected] = createSignal(false);
  const [publicKey, setPublicKey] = createSignal<PublicKey | null>(null);

  const connectWallet = async () => {
    try {
      
      if (window.solana) {
        const response = await window.solana.connect();
        console.log("Wallet connected:", response);
        setWallet(response);
        setIsConnected(true);
        setPublicKey(new PublicKey(response.publicKey.toString()));
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  const signTransaction = async (transaction: any) => {
    if (!wallet()) {
      throw new Error("Wallet not connected");
    }
    return await window.solana.signTransaction(transaction);
  };

  const handleDisconnect = () => {
    console.log("Wallet disconnected");
    setWallet(null);
    setIsConnected(false);
    setPublicKey(null);
  };

  const handleAccountChanged = (newPublicKey: PublicKey | null) => {
    if (newPublicKey) {
      setPublicKey(newPublicKey);
    } else {
      handleDisconnect(); 
    }
  };


  if (window.solana) {
    window.solana.on("disconnect", handleDisconnect);
    window.solana.on("accountChanged", handleAccountChanged);
  }


  onCleanup(() => {
    if (window.solana) {
      window.solana.on("disconnect", handleDisconnect);
      window.solana.on("accountChanged", handleAccountChanged);
    }
  });

  return (
    <WalletContext.Provider
      value={{ wallet, connectWallet, signTransaction, isConnected, publicKey }}
    >
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
