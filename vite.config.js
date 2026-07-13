import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/tools/chord-palette/',
  plugins: [react()],
});
