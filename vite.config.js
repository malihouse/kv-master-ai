import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. 补上这个关键插件

export default defineConfig({
  // 2. 确保这两个插件都在这里
  plugins: [
    tailwindcss(), 
    react()
  ],
  build: {
    // 3. 保持你的代码混淆设置
    minify: 'terser',
    terserOptions: {
      mangle: {
        toplevel: true, 
      },
      compress: {
        drop_console: true,
      },
    },
  }
})