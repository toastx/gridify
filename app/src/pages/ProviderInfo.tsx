import { useParams } from '@solidjs/router';
import styles from './ProviderInfo.module.css';

const ProviderInfo = () => {
const params = useParams();

return (
<div class={styles.container}>
    <div class={styles.header}>
    <h1>DataTech Solutions</h1>
    <p class={styles.subtitle}>Premium Data Provider</p>
    </div>

    <div class={styles.content}>
    <div class={styles.mainInfo}>
        <section class={styles.section}>
        <h2>About Provider</h2>
        <p>
            DataTech Solutions is a leading provider of financial and market data,
            serving businesses worldwide with real-time analytics and insights.
        </p>
        </section>

        <section class={styles.section}>
        <h2>Available Data Sets</h2>
        <div class={styles.dataSets}>
            <div class={styles.dataSet}>
            <h3>Financial Markets Bundle</h3>
            <p>Real-time financial data from global markets</p>
            <ul class={styles.features}>
                <li>Stock market data</li>
                <li>Forex rates</li>
                <li>Commodity prices</li>
            </ul>
            <div class={styles.pricing}>
                <span class={styles.price}>$499/month</span>
                <button class={styles.subscribeBtn}>Subscribe</button>
            </div>
            </div>

            <div class={styles.dataSet}>
            <h3>Market Analytics Package</h3>
            <p>Comprehensive market analysis and reports</p>
            <ul class={styles.features}>
                <li>Market trends</li>
                <li>Competitor analysis</li>
                <li>Industry reports</li>
            </ul>
            <div class={styles.pricing}>
                <span class={styles.price}>$299/month</span>
                <button class={styles.subscribeBtn}>Subscribe</button>
            </div>
            </div>
        </div>
        </section>
    </div>

    <aside class={styles.sidebar}>
        <div class={styles.contactInfo}>
        <h3>Contact Information</h3>
        <p>📍 123 Data Street, Tech City</p>
        <p>📞 (555) 123-4567</p>
        <p>✉️ contact@datatech.com</p>
        </div>

        <div class={styles.ratings}>
        <h3>Ratings</h3>
        <div class={styles.rating}>
            <span>Data Quality</span>
            <div class={styles.stars}>★★★★★</div>
        </div>
        <div class={styles.rating}>
            <span>Support</span>
            <div class={styles.stars}>★★★★☆</div>
        </div>
        <div class={styles.rating}>
            <span>Reliability</span>
            <div class={styles.stars}>★★★★★</div>
        </div>
        </div>
    </aside>
    </div>
</div>
);
};

export default ProviderInfo; 