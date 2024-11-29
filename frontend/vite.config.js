import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  envDir: "..",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
