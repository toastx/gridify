
import styles from "./NavBar.module.css";
import { useWallet } from './WalletConnect';

function NavBar() {
  const wallet = useWallet();
  

  return (
    <nav class={styles.navbar}>
      <div class={styles.navContent}>
        <h1 class={styles.logo}>Gridify</h1>
        <div class={styles.walletSection}>
          {wallet.isConnected && (
            <span class={styles.publicKey}>
              {wallet.publicKey.toString().slice(0, 4)}...{wallet.publicKey.toString().slice(-4)}
            </span>
          )}
          <button 
            class={styles.connectButton} 
            onClick={wallet.connectWallet}
            disabled={wallet.isConnected}
          >
            {wallet.isConnected ? "Connected ✓" : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar; 