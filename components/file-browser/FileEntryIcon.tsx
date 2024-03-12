import React from "react";
import { Icon } from "@chakra-ui/react";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";

import type { FileDocument } from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

export default function FileEntryIcon({ entry }: { entry: FileDocument }) {
  if (entry.type === "dir") {
    return <Icon as={FolderIcon} />;
  }
  return <Icon as={DocumentIcon} />;
}
