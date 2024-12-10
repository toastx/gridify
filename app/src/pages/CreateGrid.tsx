import { createSignal } from "solid-js";
import styles from "./CreateGrid.module.css";
import { createGrid } from "./utils/utils";
function CreateGrid() {
  const [gridName, setGridName] = createSignal("");
  const [gridCapacity, setGridCapacity] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [devices, setDevices] = createSignal<string[]>([]);

  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
   
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
          <label class={styles.label}>Total Capacity (kW)</label>
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