import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 3809,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  test: {
    environment: "jsdom",

    globals: true,

    setupFiles: "./vitest.setup.ts",

    css: true,

    coverage: {
      provider: "v8",

      reporter: ["text", "json", "html"],

      include: ["src/**/*.{ts,tsx}"],

      exclude: ["src/main.tsx", "src/vite-env.d.ts"],
    },
  },
});
