// vite.config.js
import { defineConfig } from "file:///C:/Users/Ronan/Desktop/BI%20Project/frontend/node_modules/vite/dist/node/index.js";
import reactRefresh from "file:///C:/Users/Ronan/Desktop/BI%20Project/frontend/node_modules/@vitejs/plugin-react-refresh/index.js";
import react from "file:///C:/Users/Ronan/Desktop/BI%20Project/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import rollupReplace from "file:///C:/Users/Ronan/Desktop/BI%20Project/frontend/node_modules/@rollup/plugin-replace/dist/es/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Ronan\\Desktop\\BI Project\\frontend";
var vite_config_default = defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__vite_injected_original_dirname, "./src")
      }
    ]
  },
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        "process.env.NODE_ENV": JSON.stringify("development")
      }
    }),
    react(),
    reactRefresh()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSb25hblxcXFxEZXNrdG9wXFxcXEJJIFByb2plY3RcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFJvbmFuXFxcXERlc2t0b3BcXFxcQkkgUHJvamVjdFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvUm9uYW4vRGVza3RvcC9CSSUyMFByb2plY3QvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3RSZWZyZXNoIGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1yZWZyZXNoXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHJvbGx1cFJlcGxhY2UgZnJvbSBcIkByb2xsdXAvcGx1Z2luLXJlcGxhY2VcIjtcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgLy8gXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgICAgZmluZDogXCJAXCIsXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcblxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJvbGx1cFJlcGxhY2Uoe1xyXG4gICAgICBwcmV2ZW50QXNzaWdubWVudDogdHJ1ZSxcclxuICAgICAgdmFsdWVzOiB7XHJcbiAgICAgICAgX19ERVZfXzogSlNPTi5zdHJpbmdpZnkodHJ1ZSksXHJcbiAgICAgICAgXCJwcm9jZXNzLmVudi5OT0RFX0VOVlwiOiBKU09OLnN0cmluZ2lmeShcImRldmVsb3BtZW50XCIpLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICByZWFjdCgpLFxyXG4gICAgcmVhY3RSZWZyZXNoKCksXHJcbiAgXSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFQsU0FBUyxvQkFBb0I7QUFDM1YsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLG1CQUFtQjtBQUoxQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBRUUsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLGNBQWM7QUFBQSxNQUNaLG1CQUFtQjtBQUFBLE1BQ25CLFFBQVE7QUFBQSxRQUNOLFNBQVMsS0FBSyxVQUFVLElBQUk7QUFBQSxRQUM1Qix3QkFBd0IsS0FBSyxVQUFVLGFBQWE7QUFBQSxNQUN0RDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
