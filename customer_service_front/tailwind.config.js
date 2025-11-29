/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Importante: Habilitar modo 'class' se fosse usar classes para dark mode, 
  // mas aqui usaremos data-attributes para temas.
  theme: {
    extend: {
      colors: {
        // Mapeamento para Variáveis CSS (Suporte a múltiplos temas)
        'tas-primary': 'var(--tas-primary)',
        'tas-primary-hover': 'var(--tas-primary-hover)',

        'tas-secondary': 'var(--tas-secondary)',
        'tas-secondary-hover': 'var(--tas-secondary-hover)',

        'tas-accent': 'var(--tas-accent)',
        'tas-accent-hover': 'var(--tas-accent-hover)',

        'tas-bg-page': 'var(--tas-bg-page)',
        'tas-bg-card': 'var(--tas-bg-card)',

        'tas-text-on-card': 'var(--tas-text-on-card)',
        'tas-text-secondary': 'var(--tas-text-secondary)',
        'tas-text-secondary-on-card': 'var(--tas-text-secondary)', // Ajustei o nome para bater com o CSS

        'tas-text-on-primary': 'var(--tas-text-on-primary)',

        // Cores de Status
        'tas-status-success': 'var(--tas-status-success)',
        'tas-status-warning': 'var(--tas-status-warning)',
        'tas-status-error': 'var(--tas-status-error)',
        'tas-status-info': 'var(--tas-status-info)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
