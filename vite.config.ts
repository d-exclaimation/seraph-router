import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: "src/export.ts",
      name: "index",
      formats: ["es", "cjs"],
      fileName: "export",
    },
    copyPublicDir: false,
  },
});
