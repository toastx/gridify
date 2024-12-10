import { createSignal, createEffect } from "solid-js";
import styles from "./GridMonitor.module.css";

interface GridNode {
  id: string;
  type: "consumer" | "provider";
  capacity: number;
  currentUsage: number;
  status: "active" | "inactive";
  position: { x: number; y: number };
}

function GridMonitor() {
  const [gridNodes, setGridNodes] = createSignal<GridNode[]>([]);
  const [totalCapacity, setTotalCapacity] = createSignal(0);
  const [currentUsage, setCurrentUsage] = createSignal(0);

  const drawGrid = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();

    // Draw nodes
    gridNodes().forEach(node => {
      ctx.beginPath();
      ctx.fillStyle = node.type === "provider" ? "#1e40af" : "#64748b";
      ctx.arc(node.position.x, node.position.y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw connection lines
      ctx.strokeStyle = "#94a3b8";
      ctx.beginPath();
      gridNodes().forEach(otherNode => {
        if (node.id !== otherNode.id) {
          ctx.moveTo(node.position.x, node.position.y);
          ctx.lineTo(otherNode.position.x, otherNode.position.y);
        }
      });
      ctx.stroke();
    });
  };

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Grid Monitor</h1>

      <div class={styles.stats}>
        <div class={styles.stat}>
          <span class={styles.statLabel}>Total Capacity</span>
          <span class={styles.statValue}>{totalCapacity()} kW</span>
        </div>
        <div class={styles.stat}>
          <span class={styles.statLabel}>Current Usage</span>
          <span class={styles.statValue}>{currentUsage()} kW</span>
        </div>
      </div>

      <div class={styles.gridContainer}>
        <canvas
          class={styles.gridCanvas}
          width="800"
          height="600"
          ref={(canvas) => {
            if (canvas) {
              drawGrid(canvas);
            }
          }}
        />
      </div>

      <div class={styles.nodeList}>
        {gridNodes().map(node => (
          <div class={styles.nodeItem}>
            <div class={styles.nodeInfo}>
              <span class={styles.nodeType}>{node.type}</span>
              <span class={styles.nodeCapacity}>{node.capacity} kW</span>
            </div>
            <div class={styles.nodeStatus} data-status={node.status}>
              {node.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridMonitor; 