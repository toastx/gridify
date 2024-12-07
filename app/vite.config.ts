import { defineConfig } from "vite";
import solid from "vite-plugin-solid";


export default defineConfig(async () => ({
  plugins: [solid()],
  server: {
    port: 1420,
  },
}));
