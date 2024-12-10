import { createContext, useContext, createSignal, JSX } from "solid-js";
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Transaction } from "@solana/web3.js";
import { VersionedTransaction } from "@solana/web3.js";




// Create the context with a default value that prevents `undefined`
const WalletContext = createContext<AnchorWallet | undefined>(undefined);

export const WalletProvider = (props: { children: JSX.Element }) => {
  const [walletConnected, setWalletConnected] = createSignal(false);
  const [publicKey, setPublicKey] = createSignal("");

  const connectWallet = async () => {
    try {
      const { solana } = window as any;
      if (!solana) {
        alert("Please install Phantom wallet!");
        window.open("https://phantom.app/", "_blank");
        return;
      }

      const response = await solana.connect();
      setPublicKey(response.publicKey.toString());
      setWalletConnected(true);
    } catch (error) {
      console.error("Connection error:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <WalletContext.Provider value={{ publicKey: new PublicKey(publicKey()), signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
      ,signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>; }}>
      {props.children}
    </WalletContext.Provider>
  );
};

// Custom hook to access the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
