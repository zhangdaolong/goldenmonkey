import { mkdir, writeFile } from 'fs/promises';
import { createRequire } from 'module';
import { generateKeyPairSync } from 'crypto';
import { join } from 'path';
import { tmpdir } from 'os';
import { readManifest } from './manifest-helper.js';
import { getVersion } from './version-helper.js';

const require = createRequire(import.meta.url);
const crx3 = require('crx3');

const {
  ASSET_CRX,
  ASSETS_DIR = 'dist-assets',
  DIST = 'dist',
  GITHUB_REPOSITORY = 'zhangdaolong/goldenmonkey',
  TEMP_DIR = 'tmp',
  CRX_MV3,
  CRX_ALLOW_EPHEMERAL_KEY,
} = process.env;

const version = getVersion();

async function getKeyPath() {
  const keyPath = join(tmpdir(), 'goldmonkey-crx-key.pem');
  if (process.env.CRX_PRIVATE_KEY) {
    await writeFile(keyPath, process.env.CRX_PRIVATE_KEY);
    return keyPath;
  }
  if (!CRX_ALLOW_EPHEMERAL_KEY) {
    throw new Error('CRX_PRIVATE_KEY must be provided');
  }
  // No secret configured: generate a temporary key so the CRX can still be built.
  // NOTE: the extension ID will differ on every build when using a temporary key.
  console.warn('> CRX_PRIVATE_KEY not set, using a temporary key (extension ID will change)');
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  });
  await writeFile(keyPath, privateKey);
  return keyPath;
}

async function main() {
  const keyPath = await getKeyPath();
  const crxName = ASSET_CRX || `goldmonkey-${CRX_MV3 ? 'mv3' : 'mv2'}-v${version}.crx`;
  const crxPath = join(ASSETS_DIR, crxName);
  await mkdir(ASSETS_DIR, { recursive: true });

  const { appId } = await crx3([join(DIST, 'manifest.json')], {
    keyPath,
    crxPath,
  });
  console.info(`> Sign CRX: ${crxPath} (appid: ${appId})`);

  // The update manifest is only needed for the self-hosted MV2 build
  if (CRX_MV3) return;

  const manifest = readManifest();
  const url = `https://github.com/${GITHUB_REPOSITORY}/releases/download/v${version}/${crxName}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<gupdate xmlns="http://www.google.com/update2/response" protocol="2.0">
  <app appid="${appId}">
    <updatecheck codebase="${url}" version="${version}" prodversionmin="${manifest.minimum_chrome_version || '86.0'}" />
  </app>
</gupdate>`;
  const xmlDir = join(TEMP_DIR, 'updates');
  await mkdir(xmlDir, { recursive: true });
  await writeFile(join(xmlDir, 'updates-crx.xml'), xml);
  console.info(`> Write update manifest: ${join(xmlDir, 'updates-crx.xml')}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
