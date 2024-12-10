import { createSignal, createEffect, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import styles from "./RegisterDevice.module.css";

interface BluetoothDevice {
  name: string;
  address: string;
}

function RegisterDevice() {
  const [devices, setDevices] = createSignal<BluetoothDevice[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const scanDevices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/ble");
      const data = await response.json();
      console.log(data["ble_devices"]);
      setDevices(data["ble_devices"]);
    } catch (err) {
      setError("Failed to scan devices. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceSelect = (device: BluetoothDevice) => {
    navigate('/select-grid', { state: { device } });
  };

  // Start scanning when component mounts
  createEffect(() => {
    scanDevices();
  });

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Register Device</h1>
      <p class={styles.subtitle}>Select a nearby device to register</p>

      <button 
        class={styles.scanButton} 
        onClick={scanDevices} 
        disabled={loading()}
      >
        {loading() ? 'Scanning...' : 'Scan Again'}
      </button>

      {error() && <p class={styles.error}>{error()}</p>}

      <div class={styles.deviceList}>
        {devices().length === 0 ? (
          <p class={styles.noDevices}>No devices found. Try scanning again.</p>
        ) : (
          <For each={devices()}>
            {(device) => (
              <div 
                class={styles.deviceItem} 
                onClick={() => handleDeviceSelect(device)}
              >
                <span class={styles.deviceName}>{device.name || 'Unknown Device'}</span>
                <span class={styles.deviceAddress}>{device.address}</span>
              </div>
            )}
          </For>
        )}
      </div>
    </div>
  );
}

export default RegisterDevice; 