import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const customStartClientPlugin: Plugin = {
  name: "custom-start-client",
  enforce: "pre",
  resolveId(source) {
    if (source === "@tanstack/react-start/client") {
      return resolve(__dirname, "src/custom-start-client.tsx");
    }
    return null;
  },
};

export default defineConfig({
  nitro: true,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [customStartClientPlugin],
  },
});
