import { type Collection } from "@/hooks/useTransfer";
import { type FileDocument } from "@globus/sdk/services/transfer/service/file-operations";

export const CLIENT_INFO = {
  product: "@globus/static-data-portal",
  // x-release-please-start-version
  version: "3.0.3",
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
