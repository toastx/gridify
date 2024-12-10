import { createSignal, createEffect } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import styles from "./SelectGrid.module.css";


interface Grid {
  id: string;
  name: string;
  status: string;
}

function SelectGrid() {
 
  const [grids, setGrids] = createSignal<Grid[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const location = useLocation();
  const navigate = useNavigate();
  const device = location.state as {
      name: string;
      address: any; device?: { address: string, name: string } 
};

  const fetchGrids = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/grids");
      const data = await response.json();
      setGrids(data);
    } catch (err) {
      setError("Failed to fetch grids. Server might be offline.");
      // Temporary mock data while endpoint is not active
      setGrids([
        { id: "grid_1", name: "Main Grid", status: "active" },
        { id: "grid_2", name: "Backup Grid", status: "active" },
        { id: "grid_3", name: "Test Grid", status: "maintenance" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGridSelect = async (gridId: string) => {
    try {
      // Here you would typically make an API call to register the device to the grid
      console.log(`Registering device ${device.address} to grid ${gridId}`);
      // Navigate to success page or dashboard
      navigate('/dashboard', { state: { success: true }});
    } catch (err) {
      setError("Failed to register device to grid.");
    }
  };

  createEffect(() => {
    if (!device) {
      navigate('/register');
      return;
    }
    fetchGrids();
  });

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Select Grid</h1>
      <p class={styles.subtitle}>Choose a grid for your device</p>

      <div class={styles.deviceInfo}>
        <span class={styles.deviceName}>{device?.name || 'Unknown Device'}</span>
        <span class={styles.deviceAddress}>{device?.address}</span>
      </div>

      {error() && <p class={styles.error}>{error()}</p>}

      <div class={styles.gridList}>
        {loading() ? (
          <div class={styles.loading}>Loading grids...</div>
        ) : (
          grids().map((grid) => (
            <div 
              class={styles.gridItem} 
              classList={{ [styles.inactive]: grid.status !== 'active' }}
              onClick={() => grid.status === 'active' && handleGridSelect(grid.id)}
            >
              <span class={styles.gridName}>{grid.name}</span>
              <span class={styles.gridStatus}>{grid.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SelectGrid; 