import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/js',
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 5173, // 可根据需要更改端口号
    open: true  // 启动时自动在浏览器中打开
  }
});