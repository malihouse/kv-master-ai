import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscator from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    obfuscator({
      // 这里的配置可以让混淆程度更高
      compact: true,
      controlFlowFlattening: true, // 控制流扁平化（增加逻辑复杂度）
      deadCodeInjection: false,     // 注入死代码（会增大体积，按需开启）
      identifierNamesGenerator: 'hexadecimal', // 变量名改为十六进制
      stringArray: true,
      rotateStringArray: true,
      selfDefending: true, // 自我保护，格式化后的代码将无法运行
    }),
  ],
  build: {
    minify: 'terser', // 确保使用 terser 进行压缩
  }
})