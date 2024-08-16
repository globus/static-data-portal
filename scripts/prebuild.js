/**
 * Node.js script to be run before `npm run build`
 */

const { stat, cp, rm } = require("node:fs/promises");
const { join } = require("node:path");

/**
 * Sync the user-provided `content` directory with the `pages` and `public` directory.
 */
async function syncContentDirectory() {
  const CONTENT_DIR = join(__dirname, "..", "content");
  const contentDirStat = await stat(CONTENT_DIR).catch(() => false);
  if (!contentDirStat || !contentDirStat.isDirectory()) {
    return;
  }
  /**
   * If there is an `assets` directory, we'll copy its contents to the `public` directory
   * before copying the rest of the `content` directory to `pages`.
   */
  const ASSETS_DIR = join(CONTENT_DIR, "assets");
  const assetsDirStat = await stat(ASSETS_DIR).catch(() => false);

  if (assetsDirStat && assetsDirStat.isDirectory()) {
    await cp(ASSETS_DIR, join(__dirname, "..", "public"), {
      recursive: true,
      force: true,
    });
    /**
     * Remove the `assets` directory from the `content` directory (workspace).
     */
    await rm(ASSETS_DIR, { recursive: true });
  }
  await cp(CONTENT_DIR, join(__dirname, "..", "pages"), {
    recursive: true,
    force: true,
  });
}

syncContentDirectory();
