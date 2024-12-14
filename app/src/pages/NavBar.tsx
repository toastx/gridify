import { useNavigate } from "@solidjs/router";
import styles from "./NavBar.module.css";
import { useWallet } from "./WalletConnect";

function NavBar() {
  const navigate = useNavigate()
  const wallet = useWallet();

  return (
    <div class={styles.navbar}>
      <div class={styles.navContent}>
        <h1 onClick={() => navigate("/")} class={styles.logo}>Gridify</h1>
        <div class={styles.walletSection}>
          {wallet.isConnected() && wallet.publicKey() && (
            <span class={styles.publicKey}>
              {wallet.publicKey()!.toString().slice(0, 4)}...
              {wallet.publicKey()!.toString().slice(-4)}
            </span>
          )}
          {!wallet.isConnected() && (
            <button
            class={styles.connectButton}
            onClick={wallet.connectWallet}
            >
              Connect Wallet
          </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
