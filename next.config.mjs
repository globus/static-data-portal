import STATIC from "./static.json" assert { type: "json" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  /**
   * If the `static.json` file contains a `host` object, use the `base_path` value
   * as the `basePath` for the Next.js application.
   */
  basePath: STATIC._static?.host?.base_path || undefined,
};

export default nextConfig;
