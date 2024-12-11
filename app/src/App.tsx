import { Routes, Route, Router } from "@solidjs/router";
import { WalletProvider } from "./pages/WalletConnect";
import Home from "./pages/Home";
import RegisterDevice from "./pages/RegisterDevice";
import CreateGrid from "./pages/CreateGrid";
import GridMonitor from "./pages/GridMonitor";
import SelectGrid from "./pages/SelectGrid";
import NavBar from "./pages/NavBar";
import Admin from "./pages/admin"



function App() {
  return (
    
    <div>
      <WalletProvider>
      <NavBar/>
        <main >
        <Router>
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/admin" component={Admin} />    
          <Route path="/register" component={RegisterDevice} />
          <Route path="/create-grid" component={CreateGrid} />
          <Route path="/monitor" component={GridMonitor} />
          <Route path="/select-grid" component={SelectGrid} />
          </Routes>
        </Router>
        </main>
      </WalletProvider>
      </div>
    
  );
}

export default App;