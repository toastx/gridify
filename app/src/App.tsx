import { Router, Route } from "@solidjs/router";
import Home from "./pages/Home";
import RegisterDevice from "./pages/RegisterDevice";
import CreateGrid from "./pages/CreateGrid";
import GridMonitor from "./pages/GridMonitor";
import SelectGrid from "./pages/SelectGrid";

function App() {
  return (
    
      <div class="app">
      <main>
      <Router>
          <Route path="/" component={Home} />
          <Route path="/register" component={RegisterDevice} />
          <Route path="/create-grid" component={CreateGrid} />
          <Route path="/monitor" component={GridMonitor} />
          <Route path="/select-grid" component={SelectGrid} />
      </Router>
        </main>
      </div>
    
  );
}

export default App;