import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),  ],
  server: {
    host: "0.0.0.0", // This ensures the server is available externally.
    port: 5173, // Use the PORT environment variable (if provided) or default to 5173. 
    allowedHosts: ['devtinder-frontend-dcn7.onrender.com'],

    
  },
})
