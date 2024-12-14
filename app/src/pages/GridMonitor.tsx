import { createSignal, createEffect, For } from "solid-js";
import styles from "./GridMonitor.module.css";
import { useLocation } from "@solidjs/router";


interface GridNode {
  id: string;
  type: "consumer" | "provider";
  capacity: number;
  currentUsage: number;
  status: "active" | "inactive";
  position: { x: number; y: number };
}

interface Grid {
  name: string;
  address: string;
  capacity: string;
  location: string;
  status: string;
}

interface Device {
  name: String,
  address: String,
  grid: String,
  status: String,
  owner:String
}

function GridMonitor() {
  
  const [devices, setDevices] = createSignal<Device[]>([]);
  const [grids, setGrids] = createSignal<Grid[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [hoveredDevice, setHoveredDevice] = createSignal<Device | null>(null);
  const [tooltipPosition, setTooltipPosition] = createSignal<{ x: number; y: number } | null>(null);
  const location = useLocation()
  

  const fetchDevices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/devices");
      const data = await response.json();
      
      setDevices(data["devices"]);
    } catch (err) {
      setError("Failed to fetch grids. Server might be offline.");
    } finally {
      
    }
  };

  const fetchGrids = async () => {
    
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/grids");
      const data = await response.json();
      
      setGrids(data["grids"]);
    } catch (err) {
      setError("Failed to fetch grids. Server might be offline.");
    } finally {
      setLoading(false);
    }
  };

  const drawGrid = (canvas: HTMLCanvasElement, grid: Grid, devices: Device[]) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const cellSize = 50;
  
    // Draw grid cells
    for (let y = 0; y < canvas.height / cellSize; y++) {
      for (let x = 0; x < canvas.width / cellSize; x++) {
        const cellX = x * cellSize;
        const cellY = y * cellSize;
  
        ctx.strokeStyle = "#e2e8f0";
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);
      }
    }
  
    // Filter devices for the current grid
    const gridDevices = devices.filter((device) => device.grid === grid.address);
    console.log(gridDevices)
    // If no devices belong to this grid, exit early
    if (gridDevices.length === 0) return;
  
    // Draw devices on the grid
    gridDevices.forEach((device, index) => {
      // To prevent overlapping devices, we position them based on index
      const row = index % (canvas.height / cellSize);  // Row in the grid
      const col = Math.floor(index / (canvas.height / cellSize));  // Column in the grid
  
      // Calculate the position of the device within the grid
      const cellX = col * cellSize;
      const cellY = row * cellSize;
  
      // Draw the device as a green rectangle
      ctx.fillStyle = "green";
      ctx.fillRect(cellX, cellY, cellSize, cellSize);
    });
  };
  
  

  createEffect(() => {
    fetchDevices();
    fetchGrids();
  });
  
  
  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Grid Monitor</h1>

      {loading() ? (
        <div class={styles.loading}>Loading grids...</div>
      ) : error() ? (
        <div class={styles.error}>{error()}</div>
      ) : (
        <div class={styles.gridContainer}>
          <For each={grids()}>
            {(grid: Grid) => (
              <div class={styles.gridWrapper}>
                <h2 class={styles.gridTitle}>{grid.name}</h2>
                <canvas
                  class={styles.gridCanvas}
                  width="800"
                  height="600"
                  ref={(canvas) => {
                    if (canvas) {
                      drawGrid(canvas, grid, devices());  // Pass grid and devices
                    }
                  }}
                />
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
  
  
}
export default GridMonitor;