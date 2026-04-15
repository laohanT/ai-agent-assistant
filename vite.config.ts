// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      // 配置路径别名，方便导入
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // 保持和 CRA 一致的端口
    open: true, // 自动打开浏览器
  },
  build: {
    outDir: "build", // 保持和 CRA 一致的输出目录
  },
});

console.log("我怎么可能没被用呢？");
