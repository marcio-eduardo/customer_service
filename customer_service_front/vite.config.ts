// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // Importe o módulo 'path' do Node.js

// Em projetos do tipo "module", precisamos definir __dirname manualmente
const __dirname = path.resolve();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Define '@' para apontar para a pasta 'src'
    },
  },
})