import { Route } from "@solidjs/router";
import styles from './Navbar.module.css';
import { Router } from "@solidjs/router";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import AvailableData from "../pages/AvailableData";
import NearbyProviders from "../pages/NearbyProviders";
import ProviderInfo from "../pages/ProviderInfo";

export const Navbar = () => {
  return (
    <Router>
    <nav class={styles.navbar}>
      <div class={styles.logo}>
        <Route path="/">DataSub</Route>
      </div>
      <div class={styles.links}>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />   
      <Route path="/available-data" component={AvailableData} />
      <Route path="/nearby-providers" component={NearbyProviders} />
      <Route path="/provider/:id" component={ProviderInfo} />
      </div>
      </nav>
    </Router>
  );
}; 