import styles from './Profile.module.css';

const Profile = () => {
  return (
    <div class={styles.profile}>
      <div class={styles.header}>
        <h1>My Profile</h1>
      </div>
      
      <div class={styles.content}>
        <div class={styles.section}>
          <h2>Account Information</h2>
          <div class={styles.info}>
            <div class={styles.field}>
              <label>Email</label>
              <p>user@example.com</p>
            </div>
            <div class={styles.field}>
              <label>Subscription Status</label>
              <p>Active</p>
            </div>
          </div>
        </div>

        <div class={styles.section}>
          <h2>My Subscriptions</h2>
          <div class={styles.subscriptions}>
            <div class={styles.subscription}>
              <h3>Financial Data Package</h3>
              <p>Next billing: July 1, 2024</p>
              <button class={styles.manageBtn}>Manage Subscription</button>
            </div>
            <div class={styles.subscription}>
              <h3>Market Analytics</h3>
              <p>Next billing: August 15, 2024</p>
              <button class={styles.manageBtn}>Manage Subscription</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
