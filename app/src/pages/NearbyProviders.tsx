import { createSignal } from 'solid-js';
import styles from './NearbyProviders.module.css';
import { A } from '@solidjs/router';

const NearbyProviders = () => {
    const [location, setLocation] = createSignal('');

    return (
        <div class={styles.container}>
            <div class={styles.header}>
            <h1>Find Data Providers Near You</h1>
            <div class={styles.search}>
                <input
                type="text"
                placeholder="Enter your location"
                value={location()}
                onInput={(e) => setLocation(e.currentTarget.value)}
                class={styles.searchInput}
                />
                <button class={styles.searchButton}>Search</button>
            </div>
            </div>

            <div class={styles.providers}>
            <div class={styles.provider}>
                <div class={styles.providerInfo}>
                <h3>DataTech Solutions</h3>
                <p class={styles.distance}>2.5 miles away</p>
                <p>Specializing in financial and market data</p>
                <div class={styles.tags}>
                    <span class={styles.tag}>Financial</span>
                    <span class={styles.tag}>Real-time</span>
                    <span class={styles.tag}>API</span>
                </div>
                </div>
                <A href="/provider/1" class={styles.viewButton}>View Details</A>
            </div>

            <div class={styles.provider}>
                <div class={styles.providerInfo}>
                <h3>Analytics Hub</h3>
                <p class={styles.distance}>3.8 miles away</p>
                <p>Consumer behavior and market research data</p>
                <div class={styles.tags}>
                    <span class={styles.tag}>Consumer</span>
                    <span class={styles.tag}>Research</span>
                    <span class={styles.tag}>Reports</span>
                </div>
                </div>
                <A href="/provider/2" class={styles.viewButton}>View Details</A>
            </div>
            </div>
        </div>
        );
};

export default NearbyProviders; 