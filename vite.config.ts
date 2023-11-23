import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import manifest from './manifest';
import addHmr from './utils/plugins/add-hmr';
import customDynamicImport from './utils/plugins/custom-dynamic-import';
import makeManifest from './utils/plugins/make-manifest';
import watchRebuild from './utils/plugins/watch-rebuild';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const pagesDir = resolve(srcDir, 'pages');
const assetsDir = resolve(srcDir, 'assets');
const sharedDir = resolve(srcDir, 'shared');
const outDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');

const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = true;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      alias: {
        '@assets': assetsDir,
        '@pages': pagesDir,
        '@shared': sharedDir,
      },
    },
    plugins: [
      react(),
      makeManifest(manifest, {
        isDev,
        clientId: env.VITE_REFRESH_CLIENT_ID,
      }),
      customDynamicImport(),
      addHmr({ background: enableHmrInBackgroundScript, view: true }),
      watchRebuild(),
    ],
    publicDir,
    build: {
      outDir,
      minify: isProduction,
      modulePreload: false,
      reportCompressedSize: isProduction,
      rollupOptions: {
        input: {
          devtools: resolve(pagesDir, 'devtools', 'index.html'),
          panel: resolve(pagesDir, 'panel', 'index.html'),
          content: resolve(pagesDir, 'content', 'index.ts'),
          background: resolve(pagesDir, 'background', 'index.ts'),
          popup: resolve(pagesDir, 'popup', 'index.html'),
          newtab: resolve(pagesDir, 'newtab', 'index.html'),
          options: resolve(pagesDir, 'options', 'index.html'),
        },
        output: {
          entryFileNames: 'src/pages/[name]/index.js',
          chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
          assetFileNames: isDev ? 'assets/[ext]/[name].[ext]' : 'assets/[ext]/[name].[hash].[ext]',
        },
      },
    },
  };
});
