/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Essencial para projetos Vite, pois o index.html está na raiz
    "./src/**/*.{js,ts,jsx,tsx}", // Para escanear todos os arquivos relevantes na pasta src
  ],
  theme: {
    extend: {
      colors: {
        'tas-verde-vibrante': '#3AB54A',
        'tas-verde-vibrante-dark': '#2f8e3b', // Para o hover do botão
        'tas-azul-serenity': '#4A90E2',
        'tas-branco-neutro': '#EAEAEA',
        'tas-cinza-escuro': '#333333',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Se você estiver usando a fonte Inter
      },
    },
  },
  plugins: [],
}
