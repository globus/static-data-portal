import React, { useEffect, useReducer, useState } from "react";

import {
  Table,
  TableContainer,
  Tr,
  Th,
  Td,
  Thead,
  Icon,
  Button,
  Box,
  Spinner,
  Center,
  Tbody,
  ButtonGroup,
  Flex,
  Spacer,
  useToast,
  Text,
} from "@chakra-ui/react";
import {
  ArrowPathIcon,
  ArrowUturnUpIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import { useShallow } from "zustand/react/shallow";
import { transfer } from "@globus/sdk";

import { useGlobusAuth } from "@globus/react-auth-context";
import { useGlobusTransferStore } from "../store/globus-transfer";

import FileBrowserViewMenu from "./FileBrowserViewMenu";
import FileBrowserError from "./FileBrowserError";

import { FileBrowserContext, FileBrowserDispatchContext } from "./Context";
import fileBrowserReducer, { initialState } from "./reducer";
import FileNameForm from "./FileNameForm";
import FileEntry from "./FileEntry";

import type {
  DirectoryListingError,
  FileDocument,
} from "@globus/sdk/services/transfer/service/file-operations";

import { useCollection, useListDirectory } from "@/hooks/useTransfer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StartTransferButton from "./StartTransferButton";
import PathInput from "./PathInput";
import { hasHTTPSSupport } from "./HTTPSActions";

export default function FileBrowser({
  variant,
  collection: id,
  path: initialPath,
}: {
  variant: "source" | "destination";
  collection: string;
  path?: string;
}) {
  const auth = useGlobusAuth();
  const queryClient = useQueryClient();
  const transferStore = useGlobusTransferStore();

  const [fileBrowser, fileBrowserDispatch] = useReducer(
    fileBrowserReducer,
    initialState,
  );

  const isSource = variant === "source";

  const [browserPath, setBrowserPath] = useState<string>();
  const [showAddDirectory, setShowAddDirectory] = useState(false);
  const [error, setError] = useState<DirectoryListingError | unknown | null>(
    null,
  );

  useEffect(() => {
    setBrowserPath(initialPath);
  }, [initialPath]);

  const toast = useToast();

  let endpoint = null;
  const c = useCollection(id);

  if (c.isError) {
    const error = c.data && "code" in c.data ? c.data : null;
    setError(error);
  }

  if (c.isSuccess) {
    endpoint = c.data;
  }

  const {
    data,
    isSuccess,
    isLoading,
    isError,
    isFetching,
    error: lsError,
    refetch,
  } = useListDirectory(id, browserPath, {
    query: {
      show_hidden: fileBrowser.view.show_hidden ? "true" : "false",
    },
  });

  useEffect(() => {
    setError(lsError);
  }, [lsError]);

  const absolutePath =
    isSuccess && data && "absolute_path" in data ? data.absolute_path : null;

  useEffect(() => {
    const path = browserPath || absolutePath;
    if (isSource) {
      transferStore.setSourcePath(path);
    } else {
      transferStore.setDestinationPath(path);
    }
  }, [
    transferStore.setSourcePath,
    transferStore.setDestinationPath,
    isSource,
    browserPath,
    absolutePath,
  ]);

  /**
   * Change the browser directory based on user interaction.
   */
  function changeBrowserDirectory(path: string) {
    /**
     * If the user is changing the directory on the source, where items might
     * be selected for transfer, reset the selected items.
     */
    if (isSource) {
      transferStore.resetItems();
    }
    setShowAddDirectory(false);
    setBrowserPath(path);
  }

  const addDirectoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await transfer.fileOperations.mkdir(
        id,
        {
          payload: { path: `${absolutePath || ""}${name}` },
        },
        { manager: auth.authorization },
      );
      const data = await response.json();
      if (!response.ok) {
        showErrorToast(data);
      }
      return data;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["collections", id, "ls"],
      }),
  });

  const renameMutation = useMutation({
    mutationFn: async ({
      file,
      path,
      name,
    }: {
      file: FileDocument;
      path: string;
      name: string;
    }) => {
      const response = await transfer.fileOperations.rename(
        id,
        {
          payload: {
            old_path: `${path}${file.name}/`,
            new_path: `${path}${name}/`,
          },
        },
        { manager: auth.authorization },
      );
      const data = await response.json();
      if (!response.ok) {
        showErrorToast(data);
      }
      return data;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["collections", id, "ls"],
      }),
  });

  const showErrorToast = (data: DirectoryListingError) => {
    toast({
      title: `Error (${data.code})`,
      description: data.message,
      status: "error",
      isClosable: true,
    });
  };

  return (
    <>
      <FileBrowserContext.Provider value={fileBrowser}>
        <FileBrowserDispatchContext.Provider value={fileBrowserDispatch}>
          <PathInput
            initialPath={absolutePath || browserPath || ""}
            onPathChange={(path) => changeBrowserDirectory(path)}
          />
          <Flex justify="end" my={2}>
            <FileBrowserViewMenu />
            <Spacer />
            <ButtonGroup>
              {!isSource && (
                <Button
                  size="xs"
                  leftIcon={<Icon as={FolderPlusIcon} />}
                  onClick={() => {
                    setShowAddDirectory(true);
                  }}
                  isDisabled={isError || isLoading}
                >
                  New Folder
                </Button>
              )}
              <Button
                colorScheme="gray"
                size="xs"
                leftIcon={<Icon as={ArrowUturnUpIcon} />}
                isDisabled={!absolutePath}
                onClick={() => {
                  if (!absolutePath) return;
                  const pathParts = absolutePath.split("/");
                  if (absolutePath.endsWith("/")) {
                    /**
                     * Account for trailing slash in path.
                     */
                    pathParts.pop();
                  }
                  pathParts.pop();
                  changeBrowserDirectory(pathParts.join("/") + "/");
                }}
              >
                Up One Folder
              </Button>
              <Button
                colorScheme="gray"
                size="xs"
                leftIcon={<Icon as={ArrowPathIcon} />}
                onClick={() => refetch()}
                isLoading={isFetching}
              >
                Refresh
              </Button>
            </ButtonGroup>
          </Flex>

          {isLoading && (
            <Box h="65vh" borderWidth={2} borderRadius={8}>
              <Center mt={4}>
                <Spinner />
              </Center>
            </Box>
          )}

          {isError && <FileBrowserError error={error} />}

          {isSuccess && data && (
            <>
              <Box h="65vh" overflowY="auto" borderWidth={2} borderRadius={8}>
                <TableContainer minH="100%">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        {isSource && <Td />}
                        {isSource && hasHTTPSSupport(endpoint) && <Td />}
                        <Th>Name</Th>
                        {fileBrowser.view.columns.includes("last_modified") && (
                          <Th>Last Modified</Th>
                        )}
                        {fileBrowser.view.columns.includes("size") && (
                          <Th>Size</Th>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {showAddDirectory && (
                        <Tr>
                          <Td colSpan={3}>
                            <FileNameForm
                              onSubmit={(name) =>
                                addDirectoryMutation.mutate(name)
                              }
                              toggleShowForm={setShowAddDirectory}
                              icon={<Icon as={FolderPlusIcon} />}
                              label="Folder Name"
                            />
                          </Td>
                        </Tr>
                      )}
                      {"DATA" in data &&
                        data.DATA.sort((a, b) => {
                          return a.name.localeCompare(b.name);
                        }).map((item, i) => {
                          const base = absolutePath || "/";
                          return (
                            <FileEntry
                              key={i}
                              item={item}
                              isSource={isSource}
                              endpoint={endpoint}
                              absolutePath={base}
                              openDirectory={() => {
                                changeBrowserDirectory(`${base}${item.name}/`);
                              }}
                              handleRename={async (updatedName: string) => {
                                renameMutation.mutate({
                                  file: item,
                                  path: base,
                                  name: updatedName,
                                });
                              }}
                            />
                          );
                        })}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Box position="sticky" bottom="0">
                  {isSource ? (
                    <SelectedItemsTracker />
                  ) : (
                    <Flex p={2} bgColor="gray.100" justify="end">
                      <StartTransferButton />
                    </Flex>
                  )}
                </Box>
              </Box>
            </>
          )}
        </FileBrowserDispatchContext.Provider>
      </FileBrowserContext.Provider>
    </>
  );
}

function SelectedItemsTracker() {
  const items = useGlobusTransferStore(useShallow((state) => state.items));
  return (
    <Box p={2} bgColor="gray.100">
      <Text fontSize="sm">
        {items.length > 0 ? (
          <>
            <Flex>
              <Text>
                <Text as="strong">{items.length}</Text> item
                {items.length > 1 ? "s" : ""} selected for transfer.
              </Text>
              <Spacer />
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  useGlobusTransferStore.getState().resetItems();
                }}
              >
                Clear Selected
              </Button>
            </Flex>
          </>
        ) : (
          <Text as="em">No items selected for transfer.</Text>
        )}
      </Text>
    </Box>
  );
}
