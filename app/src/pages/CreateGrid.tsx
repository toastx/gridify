import { createSignal } from "solid-js";
import styles from "./CreateGrid.module.css";
import { createGrid,fetchGrids,sendTransaction } from "./utils/utils";
import { useWallet } from "./WalletConnect";


function CreateGrid() {
  const [gridName, setGridName] = createSignal("");
  const [gridCapacity, setGridCapacity] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [devices, setDevices] = createSignal<string[]>([]);
  const wallet = useWallet();

  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    const tx = await createGrid(wallet);
    let txn = await wallet.signTransaction(tx.transaction);
    let url = await sendTransaction(txn);

    let grid = {
      "name": gridName(),
      "address": tx.gridAccountPublicKey,
      "location": location(),
      "capacity": gridCapacity(),
      "status":"active"
    }
    let owner = wallet.publicKey()

    let post_obj = {
      owner,
      grid
    }

    const response = await fetch("http://127.0.0.1:5000/post_grid", {
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

    
    
    

  };

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Create New Grid</h1>

      <form class={styles.form} onSubmit={handleSubmit}>
        <div class={styles.formGroup}>
          <label class={styles.label}>Grid Name</label>
          <input
            type="text"
            value={gridName()}
            onInput={(e) => setGridName(e.currentTarget.value)}
            class={styles.input}
            required
          />
        </div>

        <div class={styles.formGroup}>
          <label class={styles.label}>Total Capacity</label>
          <input
            type="number"
            value={gridCapacity()}
            onInput={(e) => setGridCapacity(e.currentTarget.value)}
            class={styles.input}
            required
          />
        </div>

        <div class={styles.formGroup}>
          <label class={styles.label}>Location</label>
          <input
            type="text"
            value={location()}
            onInput={(e) => setLocation(e.currentTarget.value)}
            class={styles.input}
            required
          />
        </div>

        <button type="submit" class={styles.button}>
          Create Grid
        </button>
      </form>
    </div>
  );
}

export default CreateGrid; 