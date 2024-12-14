import { createSignal, createEffect } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import styles from "./SelectGrid.module.css";
import { registerDevice, sendTransaction } from "./utils/utils";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "./WalletConnect";


interface Grid {
  name: string;
  address: string;
  capacity: string;
  location: string;
  status: string;
}

function SelectGrid() {
  
  const [grids, setGrids] = createSignal<Grid[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useWallet()
  const { device } = location.state as { 
    device: { name: string; address: string } 
  };

  

  const fetchGrids = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/grids");
      const data = await response.json();
      console.log(data)
      setGrids(data["grids"]);
    } catch (err) {
      setError("Failed to fetch grids. Server might be offline.");
    } finally {
      setLoading(false);
    }
  };

  const handleGridSelect = async (grid: string) => {
    try {
      
      console.log(wallet)
      let tx = await registerDevice(new PublicKey(grid), wallet)
      let txn = await wallet.signTransaction(tx.transaction);
      let url = await sendTransaction(txn);

      let new_device = {
        "name": device.name,
        "address": device.address,
        "grid":grid,
        "status": "active",
        "owner":wallet.publicKey()?.toString
      }
      let new_device_key = tx.deviceAccountPublicKey
  
      let post_obj = {
        new_device_key,
        new_device
      }

      const response = await fetch("http://127.0.0.1:5000/post_device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post_obj),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        alert(data.message);
      } else {
        console.error("Error:", response.statusText);
      }

      
      console.log(`Registering device ${device.address} to grid ${grid}`);
      navigate('/monitor', { state: grids() });
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
              onClick={() => grid.status === 'active' && handleGridSelect(grid.address)}
            >
              <span class={styles.gridName}>{grid.name}</span>
              <span class={styles.gridName}>{grid.location}</span>
              <span class={styles.gridName}>{grid.capacity}</span>
              <span class={styles.gridStatus}>{grid.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SelectGrid; 