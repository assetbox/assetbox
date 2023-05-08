import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

import postcss from "./postcss.config.js";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss,
  },
});
