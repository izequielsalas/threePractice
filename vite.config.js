// vite.config.js - Fixed version
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
  // Remove the jsxInject line - it was causing duplicate imports
})