/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Confiança Moderna (Light) - Final
        'tas-primary': '#293B44',        // Azul da Navbar e elementos primários
        'tas-primary-hover': '#22313A',  // Hover para o azul primário

        'tas-secondary': '#00875A',      // Verde Esmeralda
        'tas-secondary-hover': '#007a50',// Hover para o verde secundário

        'tas-accent': '#FFC107',         // Âmbar/Dourado (ATUALIZADO)
        'tas-accent-hover': '#ebb206',   // Hover para o âmbar (ATUALIZADO)

        'tas-bg-page': '#DFE0E1',        // Fundo da Página
        'tas-bg-card': '#F2F2F2',        // Fundo dos Cards

        'tas-text-on-card': '#212529',   // Texto principal nos cards
        'tas-text-secondary-on-card': '#6C757D', // Texto secundário nos cards
        
        'tas-text-on-primary': '#FFFFFF', // Texto sobre fundos da cor primária (ATUALIZADO)

        // Cores de Status
        'tas-status-success': '#28A745',
        'tas-status-warning': '#FF8C00',
        'tas-status-error': '#DC3545',
        'tas-status-info': '#17A2B8',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
