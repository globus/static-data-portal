import React, { MouseEventHandler, useContext, useState } from "react";
import {
  Button,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Spinner,
  Td,
  Text,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import type { FileDocument } from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";
import FileNameForm from "./FileNameForm";
import { readable } from "@/utils/globus";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import FileEntryIcon from "./FileEntryIcon";
import { TransferSettingsDispatchContext } from "../transfer-settings-context/Context";

export default function FileEntry({
  item,
  isSource,
  httpsServer,
  absolutePath,
  includeSize,
  includeLastModified,
  openDirectory,
  handleRename,
}: {
  item: FileDocument;
  httpsServer: string | null;
  isSource: boolean;
  absolutePath: string;
  includeSize: boolean;
  includeLastModified: boolean;
  openDirectory: () => void;
  handleRename: (name: string) => void;
}) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const menuRef = React.useRef<HTMLTableRowElement>(null);
  const transferSettingsDispatch = useContext(TransferSettingsDispatchContext);
  const displayContextMenu: MouseEventHandler<
    HTMLButtonElement | HTMLParagraphElement
  > = (event) => {
    if (!isSource && !showEditView) {
      event.preventDefault();
      setContextMenuOpen(true);
      if (menuRef.current?.parentElement) {
        const { parentElement } = menuRef.current;
        parentElement.style.top = `${event.pageY}px`;
        parentElement.style.left = `${event.pageX}px`;
      }
    }
  };
  const isDirectory = item.type === "dir";
  const getLineItem = () => {
    if (isLoading) {
      return <Spinner ml={2} />;
    } else if (showEditView) {
      return (
        <FileNameForm
          onSubmit={async (name: string) => {
            setIsLoading(true);
            await handleRename(name);
            setIsLoading(false);
          }}
          toggleShowForm={setShowEditView}
          initialValue={item.name}
        />
      );
    } else if (isDirectory) {
      return (
        <Button variant="link" onClick={openDirectory}>
          {item.name}
        </Button>
      );
    } else {
      return <Text>{item.name}</Text>;
    }
  };

  return (
    <Tr onContextMenu={displayContextMenu}>
      {isSource && (
        <Td>
          <Checkbox
            onChange={(e) => {
              if (e.target.checked) {
                transferSettingsDispatch({
                  type: "ADD_ITEM",
                  payload: item,
                });
              } else {
                transferSettingsDispatch({
                  type: "REMOVE_ITEM",
                  payload: item,
                });
              }
            }}
          />
        </Td>
      )}
      <Td>
        <HStack>
          <FileEntryIcon entry={item} />
          {getLineItem()}
        </HStack>
      </Td>
      {includeLastModified && (
        <Td>
          {item.last_modified ? (
            <Tooltip label={item.last_modified} variant="outline" hasArrow>
              <Text _hover={{ cursor: "help" }}>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(item.last_modified))}
              </Text>
            </Tooltip>
          ) : (
            <Text>&mdash;</Text>
          )}
        </Td>
      )}
      {includeSize && (
        <Td>
          {item.size ? (
            <Tooltip label={`${item.size} B`} variant="outline" hasArrow>
              <Text _hover={{ cursor: "help" }}>
                {item.size && readable(item.size)}
              </Text>
            </Tooltip>
          ) : (
            <Text>&mdash;</Text>
          )}
        </Td>
      )}
      {isSource && (
        <Td>
          {httpsServer && item.type === "file" && (
            <IconButton
              as="a"
              aria-label="Open"
              href={`${httpsServer}${absolutePath}${item.name}`}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              icon={<Icon as={ArrowUpOnSquareIcon} />}
            />
          )}
        </Td>
      )}
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
    </Tr>
  );
}
