/**
 * Node.js script to be run before `npm run build`
 */

const { stat, cp, rm } = require("node:fs/promises");
const { join } = require("node:path");
const { glob } = require("glob");

/**
 * `OVERRIDES` is an array of files that we want to ensure are overriden by the user's
 * custom files regardless of the extension they provide.
 *
 * For example, if a users provides a `index.md` file for their landing page, we want to
 * make sure that takes precedence over the default `index.mdx` file in the generator.
 */
const OVERRIDES = [
  {
    file: "index.mdx",
    pattern: "index.@(js|ts|md)?(x)",
  },
  {
    file: "privacy-policy.mdx",
    pattern: "privacy-policy.@(js|ts|md)?(x)",
  },
  {
    file: "terms-and-conditions.mdx",
    pattern: "terms-and-conditions.@(js|ts|md)?(x)",
  },
];

/**
 * Process all of the configured overrides.
 */
function handleOverrides() {
  return Promise.all(
    OVERRIDES.map(async ({ file, pattern }) => {
      /**
       * Check to see if the user has provided a file that matches the pattern.
       */
      const hasCustomFile = await glob(pattern, {
        cwd: join(__dirname, "..", "content"),
      }).then((files) => files.length > 0);
      if (hasCustomFile) {
        const defaultFile = join(__dirname, "..", "pages", file);
        /**
         * Check to see if the default (configured) file exists.
         * This ensures commands like `preview` don't need "pristine" working directories to function.
         */
        if (await stat(defaultFile).catch(() => false)) {
          /**
           * If so, remove the default (configured) file from the `pages` directory.
           */

          await rm(join(__dirname, "..", "pages", file));
        }
      }
    }),
  );
}

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

  await handleOverrides();

  await cp(CONTENT_DIR, join(__dirname, "..", "pages"), {
    recursive: true,
    force: true,
  });
}

syncContentDirectory();
