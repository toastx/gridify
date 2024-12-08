import { Router, Route } from "@solidjs/router";
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AvailableData from './pages/AvailableData';
import NearbyProviders from './pages/NearbyProviders';
import ProviderInfo from './pages/ProviderInfo';

function App() {
  return (
      
      <div class="app">
        
        <main>
        <Router>
            <Route path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/available-data" component={AvailableData} />
            <Route path="/nearby-providers" component={NearbyProviders} />
            <Route path="/provider/:id" component={ProviderInfo} />
          </Router>
        </main>
      </div>
    
  );
}

export default App;