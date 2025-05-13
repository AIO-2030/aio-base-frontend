import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co blob:;
        connect-src 'self' blob: 
          http://localhost:* https://localhost:*
          http://127.0.0.1:* https://127.0.0.1:*
          http://8.141.81.75:* https://8.141.81.75:*
          https://icp0.io https://*.icp0.io
          https://icp-api.io https://ic0.app https://*.ic0.app
          https://openapi.emchub.ai https://*.emchub.ai
          https://api.siliconflow.cn https://cdn.gpteng.co
          http://162.218.231.180:* https://162.218.231.180:*
          http://18.167.51.1:* https://18.167.51.1:*
          ws: wss:;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob:;
        font-src 'self';
        object-src 'none';
        media-src 'self' blob: mediastream:;
        frame-src 'self';
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim(),
      'Permissions-Policy': 'microphone=(self)',
      // CORS headers for all environments
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Origin, Accept',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "declarations": path.resolve(__dirname, "./declarations"),
      "@dfinity/identity": "@dfinity/identity"
    },
  },
  define: {
    // Make environment variables accessible to client code safely
    'process.env.CANISTER_ID_AIO_BASE_BACKEND': JSON.stringify(process.env.CANISTER_ID_AIO_BASE_BACKEND || 'ryjl3-tyaaa-aaaaa-aaaba-cai'),
    'process.env.CANISTER_ID_AIO_BASE_FRONTEND': JSON.stringify(process.env.CANISTER_ID_AIO_BASE_FRONTEND || 'r7inp-6aaaa-aaaaa-aaabq-cai'),
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'ic'),
    'window.__CANISTER_ID_AIO_BASE_BACKEND': JSON.stringify(process.env.CANISTER_ID_AIO_BASE_BACKEND || 'ryjl3-tyaaa-aaaaa-aaaba-cai'),
    'window.__CANISTER_ID_AIO_BASE_FRONTEND': JSON.stringify(process.env.CANISTER_ID_AIO_BASE_FRONTEND || 'r7inp-6aaaa-aaaaa-aaabq-cai'),
  },
  optimizeDeps: {
    include: [
      "@dfinity/agent",
      "@dfinity/auth-client",
      "@dfinity/principal",
      "@dfinity/candid",
      "@dfinity/identity"
    ]
  },
  build: {
    // Increase the warning limit to avoid warnings for larger chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Implement manual chunks to better organize and split the code
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@tanstack/react-query'
          ],
          dfinity: [
            '@dfinity/agent',
            '@dfinity/auth-client',
            '@dfinity/principal',
            '@dfinity/candid',
            '@dfinity/identity'
          ],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          utils: [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'lucide-react',
            'zod',
            'date-fns'
          ],
          forms: [
            'react-hook-form',
            '@hookform/resolvers'
          ]
        }
      }
    }
  }
}));
