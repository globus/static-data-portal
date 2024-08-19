import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const basePath = publicRuntimeConfig.basePath || "";

export function getPublicPath(path?: string) {
  return `${basePath}${path}`;
}

export function isRelativePath(path?: string) {
  return path?.startsWith("/");
}

export function getAbsoluteURL(path?: string) {
  return isRelativePath(path) ? getPublicPath(path) : path;
}
