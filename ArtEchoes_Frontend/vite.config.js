import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5174, // Set the port to 5174
    proxy: {
      "/api": {
        target: "http://192.168.1.100:5000", // Your backend server address
        changeOrigin: true,
        secure: false,
      },
      "/profile-pictures": {
        target: "http://192.168.1.100:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
