import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: [
      "react-helmet-async",
      "react-syntax-highlighter",
      "react-slick",
      "react-dnd",
      "react-dnd-html5-backend",
      "react-popper",
      "@popperjs/core",
    ],
  },
});
