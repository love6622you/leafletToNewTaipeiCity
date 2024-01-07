import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint'; // 新增
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslint()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 設置 '@' 指向 'src' 目錄
    },
  },
});
