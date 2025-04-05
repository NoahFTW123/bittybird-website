import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 5174,
    allowedHosts: ["www.bittybird.co"],
    proxy: {
      '/api': 'https://api.bittybird.co', // Proxy API requests to the Express server
    },
  },
  build: {
    outDir: "dist",
    cssCodeSplit: true,
  },
});

