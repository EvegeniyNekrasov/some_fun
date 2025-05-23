import { type AliasOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { version } from "./package.json";

const root = path.resolve(__dirname, "src");

export default defineConfig({
    plugins: [
        TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": root,
        } as AliasOptions,
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:6969",
                changeOrigin: true,
            },
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
});
