import { useWallet } from "./WalletConnect";
import styles from "./NavBar.module.css";

function NavBar() {
  const wallet = useWallet();
  const { walletConnected = false, publicKey = "", connectWallet = () => {} } = wallet ?? {};

  return (
    <nav class={styles.navbar}>
      <div class={styles.navContent}>
        <h1 class={styles.logo}>Gridify</h1>
        <div class={styles.walletSection}>
          {walletConnected && (
            <span class={styles.publicKey}>
              {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
            </span>
          )}
          <button 
            class={styles.connectButton} 
            onClick={connectWallet}
            disabled={walletConnected}
          >
            {walletConnected ? "Connected ✓" : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar; 