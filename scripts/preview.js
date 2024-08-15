/**
 * Node.js script to be run before `npm run build`
 */
const { stat } = require("node:fs/promises");
const { join } = require("node:path");
const { execSync } = require("node:child_process");

/**
 * Sync the user-provided `content` directory with the `pages` directory.
 */
async function syncContentDirectory() {
  const CONTENT_DIR = join(__dirname, "..", "content");
  const exists = await stat(CONTENT_DIR).catch(() => false);
  if (!exists || !exists.isDirectory()) {
    return;
  }
  /**
   * **Symlink** the contents of the directory to the `pages` directory.
   */
  execSync(`cp -sRf ${CONTENT_DIR}/* ./pages`);
}

syncContentDirectory();
