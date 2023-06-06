import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  define: {
    "process.env.BUILD": "false",
  },
  plugins: [
    react(),
    svgr({
      exportAsDefault: true,
    }),
  ],
});
