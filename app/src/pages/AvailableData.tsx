import styles from './AvailableData.module.css';

const AvailableData = () => {
  return (
    <div class={styles.availableData}>
      <div class={styles.header}>
        <h1>Available Data Sets</h1>
        <p>Choose from our wide range of data providers</p>
      </div>

      <div class={styles.filters}>
        <select class={styles.filter}>
          <option value="">Category</option>
          <option value="financial">Financial</option>
          <option value="market">Market Research</option>
          <option value="consumer">Consumer Behavior</option>
        </select>
        <select class={styles.filter}>
          <option value="">Price Range</option>
          <option value="low">$0 - $100</option>
          <option value="mid">$101 - $500</option>
          <option value="high">$501+</option>
        </select>
      </div>

      <div class={styles.grid}>
        <div class={styles.card}>
          <div class={styles.cardHeader}>
            <h3>Stock Market Data</h3>
            <span class={styles.price}>$299/mo</span>
          </div>
          <p>Real-time stock market data from major exchanges worldwide</p>
          <ul class={styles.features}>
            <li>Real-time updates</li>
            <li>Historical data</li>
            <li>API access</li>
          </ul>
          <button class={styles.subscribeBtn}>Subscribe Now</button>
        </div>

        <div class={styles.card}>
          <div class={styles.cardHeader}>
            <h3>Consumer Insights</h3>
            <span class={styles.price}>$199/mo</span>
          </div>
          <p>Detailed consumer behavior analytics and trends</p>
          <ul class={styles.features}>
            <li>Demographics data</li>
            <li>Shopping patterns</li>
            <li>Monthly reports</li>
          </ul>
          <button class={styles.subscribeBtn}>Subscribe Now</button>
        </div>
      </div>
    </div>
  );
};

export default AvailableData;