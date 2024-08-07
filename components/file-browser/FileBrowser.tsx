import React, { useContext, useEffect, useReducer, useState } from "react";

import {
  Table,
  TableContainer,
  Tr,
  Th,
  Td,
  Thead,
  Code,
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
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  ArrowPathIcon,
  ArrowUturnUpIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk/cjs";

import { useGlobusAuth } from "../globus-auth-context/useGlobusAuth";
import { TransferSettingsDispatchContext } from "../transfer-settings-context/Context";

import FileBrowserViewMenu from "./FileBrowserViewMenu";
import FileBrowserError from "./FileBrowserError";

import { FileBrowserContext, FileBrowserDispatchContext } from "./Context";
import fileBrowserReducer, { initialState } from "./reducer";
import FileNameForm from "./FileNameForm";
import FileEntry from "./FileEntry";

import type {
  DirectoryListingError,
  FileDocument,
} from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";
import { useCollection, useListDirectory } from "@/hooks/useTransfer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

  const [fileBrowser, fileBrowserDispatch] = useReducer(
    fileBrowserReducer,
    initialState,
  );

  const transferSettingsDispatch = useContext(TransferSettingsDispatchContext);

  const isSource = variant === "source";

  const [browserPath, setBrowserPath] = useState(initialPath);
  const [showAddDirectory, setShowAddDirectory] = useState(false);
  const [error, setError] = useState<DirectoryListingError | unknown | null>(
    null,
  );
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
    /**
     * If there is no browser path specified, we've loaded the "default path"
     * for the collection, so set the browser path to the returned absolute path.
     */
    if (!browserPath && absolutePath) {
      setBrowserPath(absolutePath);
    }
  }, [browserPath, absolutePath]);

  useEffect(() => {
    transferSettingsDispatch({
      type: isSource ? "SET_SOURCE_PATH" : "SET_DESTINATION_PATH",
      payload: browserPath,
    });
  }, [transferSettingsDispatch, isSource, browserPath]);

  const addDirectoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await transfer.fileOperations.mkdir(
        id,
        {
          payload: { path: `${browserPath}${name}` },
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
          {isLoading && (
            <Box mt={4}>
              <Center>
                <Spinner />
              </Center>
            </Box>
          )}

          {isError && <FileBrowserError error={error} />}

          {isSuccess && data && (
            <>
              <Box p={2}>
                <ChevronRightIcon />
                <Code>{browserPath}</Code>
              </Box>
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
                    >
                      New Folder
                    </Button>
                  )}
                  <Button
                    colorScheme="gray"
                    size="xs"
                    leftIcon={<Icon as={ArrowUturnUpIcon} />}
                    onClick={() => {
                      if (!browserPath) return;
                      const pathParts = browserPath.split("/");
                      pathParts.pop();
                      pathParts.pop();
                      setBrowserPath(pathParts.join("/") + "/");
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
              <Box h="60vh" overflowY="auto" p={2}>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        {isSource && <Td />}
                        <Th>Name</Th>
                        {fileBrowser.view.columns.includes("last_modified") && (
                          <Th>Last Modified</Th>
                        )}
                        {fileBrowser.view.columns.includes("size") && (
                          <Th>Size</Th>
                        )}
                        {isSource && <Td />}
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
                      {data?.DATA?.map((item, i) => (
                        <FileEntry
                          key={i}
                          item={item}
                          isSource={isSource}
                          endpoint={endpoint}
                          absolutePath={data.absolute_path}
                          openDirectory={() => {
                            setBrowserPath(
                              `${data.absolute_path}${item.name}/`,
                            );
                            setShowAddDirectory(false);
                          }}
                          handleRename={async (updatedName: string) => {
                            renameMutation.mutate({
                              file: item,
                              path: data.absolute_path,
                              name: updatedName,
                            });
                          }}
                        />
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </FileBrowserDispatchContext.Provider>
      </FileBrowserContext.Provider>
    </>
  );
}
