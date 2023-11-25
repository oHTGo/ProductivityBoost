import * as fs from 'fs';
import * as path from 'path';
import type { PluginOption } from 'vite';
import colorLog from '../log';
import ManifestParser from '../manifest-parser';

const { resolve } = path;

const distDir = resolve(__dirname, '..', '..', 'dist');
const publicDir = resolve(__dirname, '..', '..', 'public');

export default function makeManifest(
  manifest: chrome.runtime.ManifestV3,
  config: { isDev: boolean; clientId?: string },
): PluginOption {
  const { isDev, clientId } = config;

  function makeManifest(to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, 'manifest.json');

    if (clientId) {
      manifest.oauth2!.client_id = clientId;
    }

    fs.writeFileSync(manifestPath, ManifestParser.convertManifestToString(manifest));
    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
  }

  return {
    name: 'make-manifest',
    buildStart() {
      if (isDev) {
        makeManifest(distDir);
      }
    },
    buildEnd() {
      if (isDev) {
        return;
      }
      makeManifest(publicDir);
    },
  };
}
