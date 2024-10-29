import { Collection } from "@/hooks/useTransfer";
import { FileDocument } from "@globus/sdk/cjs/services/transfer/service/file-operations";

export const CLIENT_INFO = {
  product: "@globus/static-data-portal",
  // x-release-please-start-version
  version: "2.0.0",
  // x-release-please-end
};

export function getAssetURLs(
  endpoint: Collection,
  item: FileDocument,
  absolutePath: string,
) {
  const view = `${endpoint.https_server}${absolutePath}${encodeURIComponent(item.name)}`;
  return {
    view,
    download: `${view}?download`,
  };
}
