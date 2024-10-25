import React from "react";

import { ButtonGroup, Icon, IconButton, Tooltip } from "@chakra-ui/icons";

import type { FileDocument } from "@globus/sdk/services/transfer/service/file-operations";
import type { Collection } from "../../hooks/useTransfer";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { getAssetURLs } from "@/utils/globus";

export function hasHTTPSSupport(
  endpoint: Collection | null,
): endpoint is Collection {
  return Boolean(endpoint?.https_server);
}

export default function HTTPSActions({
  item,
  endpoint,
  absolutePath,
}: {
  item: FileDocument;
  endpoint: Collection | null;
  absolutePath: string;
}) {
  /**
   * HTTPS actions are only available for files, on collections that support HTTPS.
   */
  if (!hasHTTPSSupport(endpoint) || item.type !== "file") {
    return;
  }
  const urls = getAssetURLs(endpoint, item, absolutePath);
  return (
    <ButtonGroup>
      <Tooltip hasArrow label={`Open file "${item.name}" in a new tab`}>
        <IconButton
          as="a"
          aria-label={`Open "${item.name}" in a new tab`}
          target="_blank"
          href={urls.view}
          size="xs"
          variant="outline"
          rel="noopener noreferrer"
          icon={<Icon as={ArrowTopRightOnSquareIcon} />}
        />
      </Tooltip>
      <Tooltip hasArrow label={`Download file "${item.name}" via HTTPS`}>
        <IconButton
          as="a"
          aria-label={`Download "${item.name}" via HTTPS`}
          href={`${endpoint?.https_server}${absolutePath}${item.name}?download`}
          target="_blank"
          rel="noopener noreferrer"
          size="xs"
          variant="outline"
          icon={<Icon as={ArrowDownTrayIcon} />}
        />
      </Tooltip>
    </ButtonGroup>
  );
}
