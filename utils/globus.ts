import type { FileDocument } from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

/**
 * This module provides utilities for working with the Globus API.
 * All these methods are candidates for being moved to the Globus SDK.
 */
const KB = 1000;
const MB = KB * 1000;
const GB = MB * 1000;
const TB = GB * 1000;
const PB = TB * 1000;
/**
 * Returns a readable string for the given bytes.
 */
export function readable(bytes: number, truncate = 2) {
  let unit = "B";
  let bytesInUnit = 1;
  if (bytes < KB) {
    return `${bytes} ${unit}`;
  } else if (bytes < MB) {
    unit = "KB";
    bytesInUnit = KB;
  } else if (bytes < GB) {
    unit = "MB";
    bytesInUnit = MB;
  } else if (bytes < TB) {
    unit = "GB";
    bytesInUnit = GB;
  } else if (bytes < PB) {
    unit = "TB";
    bytesInUnit = TB;
  } else {
    unit = "PB";
    bytesInUnit = PB;
  }
  const value = bytes / bytesInUnit;
  return `${value.toFixed(truncate)} ${unit}`;
}

export function isDirectory(entry: FileDocument) {
  return entry.type === "dir";
}
