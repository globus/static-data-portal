import React from "react";
import { Icon } from "@chakra-ui/react";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk";

import type { FileDocument } from "@globus/sdk/services/transfer/service/file-operations";

export default function FileEntryIcon({ entry }: { entry: FileDocument }) {
  if (transfer.utils.isDirectory(entry)) {
    return <Icon as={FolderIcon} />;
  }
  return <Icon as={DocumentIcon} />;
}
