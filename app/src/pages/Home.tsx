import styles from './Home.module.css';

const Home = () => {
  return (
    <div class={styles.home}>
      <section class={styles.hero}>
        <h1>Access Quality Data on Demand</h1>
        <p>Subscribe to various data providers and get the insights you need</p>
        <button class={styles.cta}>Explore Data</button>
      </section>
      <section class={styles.features}>
        <h2>Why Choose Us</h2>
        <div class={styles.featureGrid}>
          <div class={styles.feature}>
            <h3>Verified Providers</h3>
            <p>All our data providers are thoroughly vetted</p>
          </div>
          <div class={styles.feature}>
            <h3>Flexible Plans</h3>
            <p>Choose from various subscription models</p>
          </div>
          <div class={styles.feature}>
            <h3>Real-time Access</h3>
            <p>Get instant access to data when you need it</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 