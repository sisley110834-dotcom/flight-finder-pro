import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Plain client-side SPA: `vite build` emits static files to dist/.
// Deep links (e.g. /app) are served index.html via the rewrite in vercel.json.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom"],
  },
});
