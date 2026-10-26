const pkg = require('../package.json');

/**
 * Derive extension version.
 *
 * Priority:
 * 1. process.env.VERSION
 * 2. the pushed git tag (e.g. `v2.49.7` -> `2.49.7`), so that the GitHub
 *    release created for the tag is the one that receives the build assets
 * 3. pkg.version and pkg.beta fields:
 *    manifest.version = `${pkg.version}.${pkg.beta}`
 */
function getVersion() {
  if (process.env.VERSION) return process.env.VERSION;
  const { GITHUB_REF_TYPE, GITHUB_REF_NAME } = process.env;
  if (GITHUB_REF_TYPE === 'tag' && /^v\d+(\.\d+)+$/.test(GITHUB_REF_NAME || '')) {
    return GITHUB_REF_NAME.slice(1);
  }
  return `${pkg.version.match(/\d+\.\d+/)[0]}.${pkg.beta || 0}`;
}

function isBeta() {
  return process.env.BETA || pkg.beta > 0;
}

exports.getVersion = getVersion;
exports.isBeta = isBeta;
