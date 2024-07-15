/**
 * Node.js script to be run before `npm run build`
 */

const { stat, cp } = require("node:fs/promises");
const { join } = require("node:path");

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
   * Copy the contents of the directory to the `pages` directory.
   */
  await cp(CONTENT_DIR, join(__dirname, "..", "pages"), {
    recursive: true,
    force: true,
  });
}

syncContentDirectory();
