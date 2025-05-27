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

        'tas-accent': '#b49264',         // Âmbar/Dourado
        'tas-accent-hover': '#8f7551',   // Hover para o âmbar

        'tas-bg-page': '#DFE0E1',        // Fundo da Página
        'tas-bg-card': '#F2F2F2',        // Fundo dos Cards

        'tas-text-on-card': '#212529',   // Texto principal nos cards
        'tas-text-secondary-on-card': '#6C757D', // Texto secundário nos cards
        
        'tas-text-on-primary': '#DFE0E1', // Texto sobre fundos da cor primária (ex: Navbar)

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
