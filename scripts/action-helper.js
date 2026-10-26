const core = require('@actions/core');
const { getVersion, isBeta } = require('./version-helper');
const { exec } = require('./common');

const version = process.env.VERSION || getVersion();
const beta = isBeta();
const ci = process.argv.includes('ci');

const CWS_EXT_ID_BETA = 'opokoaglpekkimldnlggpoagmjegichg';
const CWS_EXT_ID_RELEASE = 'jinjaccalgkegednnccohejagnlnfdag';

const envs = {
  VERSION: version,
  RELEASE_NAME: [
    beta && 'BETA',
    `v${version}`,
  ].filter(Boolean).join(' '),
  RELEASE_PREFIX: [
    'Goldmonkey',
    beta && 'beta',
  ].filter(Boolean).join('-'),
  PRERELEASE: !!beta,
  TEMP_DIR: 'tmp',
  ASSETS_DIR: 'dist-assets',
  GIT_DESCRIBE: ci ? exec('git', ['describe', '--abbrev=7']) : `v${version}`,
  ACTION_BUILD_URL: process.env.ACTION_BUILD_URL,
  DISCORD_WEBHOOK_RELEASE: process.env.DISCORD_WEBHOOK_RELEASE,
};

envs.CWS_EXT_ID = envs.PRERELEASE ? CWS_EXT_ID_BETA : CWS_EXT_ID_RELEASE;
envs.SOURCE_ZIP = `${envs.RELEASE_PREFIX}-${envs.VERSION}-source.zip`;
// MV2 build (Firefox / legacy Chromium)
envs.ASSET_ZIP = `topwar-assistant-firefox-mv2-v${envs.VERSION}.zip`;
// MV3 build (Chrome / Edge / Chromium) - load unpacked in chrome://extensions
envs.ASSET_CWS_ZIP = `topwar-assistant-chrome-v${envs.VERSION}.zip`;
envs.ASSET_CWS_BETA_ZIP = `topwar-assistant-chrome-v${envs.VERSION}-beta.zip`;
envs.ASSET_SELF_HOSTED_ZIP = `topwar-assistant-firefox-selfhosted-v${envs.VERSION}.zip`;
envs.ASSET_CRX = `topwar-assistant-chrome-mv2-v${envs.VERSION}.crx`;

Object.entries(envs).forEach(([key, value]) => {
  core.exportVariable(key, value);
});
