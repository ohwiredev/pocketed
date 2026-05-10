import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        id: "com.pocketed.app",
        name: "Pocketed",
        short_name: "Pocketed",
        description: "Your AI Powered Video Library",
        theme_color: "#1d565a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/home",
        icons: [
          {
            src: "/icons/manifest-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/manifest-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/manifest-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/manifest-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-wide.jpg",
            sizes: "1280x720",
            type: "image/jpeg",
            form_factor: "wide",
          },
          {
            src: "/screenshot-mobile.jpg",
            sizes: "720x1280",
            type: "image/jpeg",
          },
        ],
        share_target: {
          action: "/save",
          method: "GET",
          enctype: "application/x-www-form-urlencoded",
          params: {
            url: "url",
          },
        },
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
