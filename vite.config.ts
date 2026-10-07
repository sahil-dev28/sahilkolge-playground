import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { buildAgentMarkdown } from "./src/agent-markdown.ts";

// Emits /llms.txt at build and serves it in dev. Dev reads data at server start; restart after editing data.ts.
function llmsTxt(): Plugin {
  return {
    name: "llms-txt",
    configureServer(server) {
      server.middlewares.use("/llms.txt", (_req, res) => {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(buildAgentMarkdown());
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "llms.txt", source: buildAgentMarkdown() });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), llmsTxt()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
