import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import zipPack from "vite-plugin-zip-pack";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), zipPack()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
