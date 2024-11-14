import React, { MouseEventHandler, useContext, useState } from "react";
import {
  Button,
  Checkbox,
  HStack,
  Menu,
  MenuItem,
  MenuList,
  Spinner,
  Td,
  Text,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { transfer } from "@globus/sdk";

import type { FileDocument } from "@globus/sdk/services/transfer/service/file-operations";
import FileNameForm from "./FileNameForm";
import FileEntryIcon from "./FileEntryIcon";
import { FileBrowserContext } from "./Context";

import { useGlobusTransferStore } from "../store/globus-transfer";

import type { Collection } from "../../hooks/useTransfer";
import { DateWithTooltip } from "./DateWithTooltip";
import HTTPSActions, { hasHTTPSSupport } from "./HTTPSActions";

export default function FileEntry({
  item,
  isSource,
  endpoint,
  absolutePath,
  openDirectory,
  handleRename,
}: {
  item: FileDocument;
  endpoint: Collection | null;
  isSource: boolean;
  absolutePath: string;
  openDirectory: () => void;
  handleRename: (name: string) => void;
}) {
  const transferStore = useGlobusTransferStore();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const menuRef = React.useRef<HTMLTableRowElement>(null);
  const fileBrowser = useContext(FileBrowserContext);
  const displayContextMenu: MouseEventHandler<
    HTMLButtonElement | HTMLParagraphElement
  > = (event) => {
    event.preventDefault();
    if (showEditView) {
      return;
    }
    setContextMenuOpen(true);
    if (menuRef.current?.parentElement) {
      const { parentElement } = menuRef.current;
      parentElement.style.top = `${event.pageY}px`;
      parentElement.style.left = `${event.pageX}px`;
    }
  };
  const includeLastModified =
    fileBrowser.view.columns.includes("last_modified");
  const includeSize = fileBrowser.view.columns.includes("size");

  const isFile = item.type === "file";
  const isDirectory = transfer.utils.isDirectory(item);

  return (
    <Tr
      onContextMenu={displayContextMenu}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 60px",
      }}
    >
      {isSource && (
        <Td>
          <Checkbox
            isChecked={transferStore.items.includes(item)}
            onChange={(e) => {
              if (e.target.checked) {
                transferStore.addItem(item);
              } else {
                transferStore.removeItem(item);
              }
            }}
          />
        </Td>
      )}
      {isSource && hasHTTPSSupport(endpoint) && (
        <Td>
          <HTTPSActions
            item={item}
            endpoint={endpoint}
            absolutePath={absolutePath}
          />
        </Td>
      )}
      <Td>
        {!isSource && (
          <Menu
            isOpen={contextMenuOpen}
            onClose={() => {
              setContextMenuOpen(false);
            }}
          >
            <MenuList ref={menuRef}>
              <MenuItem onClick={() => setShowEditView(true)}>Rename</MenuItem>
            </MenuList>
          </Menu>
        )}
        <HStack>
          {!showEditView && <FileEntryIcon entry={item} />}
          {isLoading ? (
            <Spinner ml={2} />
          ) : showEditView ? (
            <FileNameForm
              onSubmit={async (name: string) => {
                setIsLoading(true);
                await handleRename(name);
                setIsLoading(false);
              }}
              label={isDirectory ? "Folder Name" : "File Name"}
              icon={<FileEntryIcon entry={item} />}
              toggleShowForm={setShowEditView}
              initialValue={item.name}
            />
          ) : isDirectory ? (
            <Button textColor="black" variant="link" onClick={openDirectory}>
              {item.name}
            </Button>
          ) : (
            <Text textColor="black">{item.name}</Text>
          )}
        </HStack>
      </Td>
      {includeLastModified && (
        <Td>
          {item.last_modified ? (
            <DateWithTooltip value={item.last_modified} />
          ) : (
            <Text>&mdash;</Text>
          )}
        </Td>
      )}
      {includeSize && (
        <Td>
          {isFile && item.size ? (
            <Tooltip label={`${item.size} B`} variant="outline" hasArrow>
              <Text _hover={{ cursor: "help" }}>
                {item.size && transfer.utils.readableBytes(item.size)}
              </Text>
            </Tooltip>
          ) : (
            <Text>&mdash;</Text>
          )}
        </Td>
      )}
    </Tr>
  );
}
