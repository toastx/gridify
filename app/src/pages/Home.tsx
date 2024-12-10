import { A } from "@solidjs/router";
import styles from "./Home.module.css";

function Home() {
  return (
    <div class={styles.container}>
      <div class={styles.navigation}>
        <A href="/register" class={styles.navButton}>
          Register Device
        </A>
        <A href="/create-grid" class={styles.navButton}>
          Create Grid
        </A>
        <A href="/monitor" class={styles.navButton}>
          Monitor Grid
        </A>
      </div>

      <div class={styles.hero}>
        <h1 class={styles.title}>Grid Management System</h1>
        <p class={styles.subtitle}>
          Efficiently manage and monitor your distributed energy grid network
        </p>
      </div>

      <div class={styles.features}>
        <div class={styles.feature}>
          <div class={styles.featureIcon}>⚡</div>
          <h3>Real-time Monitoring</h3>
          <p>Track energy consumption and distribution across your grid network</p>
        </div>
        <div class={styles.feature}>
          <div class={styles.featureIcon}>🔌</div>
          <h3>Device Management</h3>
          <p>Register and manage both consumer and provider devices</p>
        </div>
        <div class={styles.feature}>
          <div class={styles.featureIcon}>📊</div>
          <h3>Grid Analytics</h3>
          <p>Analyze usage patterns and optimize energy distribution</p>
        </div>
      </div>
    </div>
  );
}

export default Home; 