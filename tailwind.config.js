module.exports = {
  darkMode: 'class', // Solo activa modo oscuro por clase, no por preferencia del sistema
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3faf9',
          100: '#e6f7f3',
          500: '#0f766e'
        }
      }
    }
  },
  plugins: []
}
