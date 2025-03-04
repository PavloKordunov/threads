import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    include: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
  },
  "react/prop-types": "off",
  server: {
    port: 3000,
    proxy: {
      "/api" : {
        target: "http://localhost:5000",
        changeOrigin: 'true',
        secure: "false"
      }
    }
  }
})
