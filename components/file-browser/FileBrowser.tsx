import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

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

export default function FileBrowser({
  variant,
  collection,
  path,
}: {
  variant: "source" | "destination";
  collection: string;
  path?: string;
}) {
  const auth = useGlobusAuth();

  const [fileBrowser, fileBrowserDispatch] = useReducer(
    fileBrowserReducer,
    initialState,
  );

  const transferSettingsDispatch = useContext(TransferSettingsDispatchContext);

  const isSource = variant === "source";

  const [browserPath, setBrowserPath] = useState(path);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDirectory, setShowAddDirectory] = useState(false);
  const [endpoint, setEndpoint] = useState<Record<string, any> | null>(null);
  const [lsResponse, setLsResponse] = useState<Record<string, any> | null>(
    null,
  );
  const [items, setItems] = useState<FileDocument[] | []>([]);
  const [error, setError] = useState<DirectoryListingError | unknown | null>(
    null,
  );
  const toast = useToast();

  useEffect(() => {
    async function fetchEndpoint() {
      if (!auth.isAuthenticated) {
        return;
      }
      const response = await transfer.endpoint.get(collection, {
        headers: {
          Authorization: `Bearer ${auth.authorization?.tokens.transfer?.access_token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError("code" in data ? data : null);
        return;
      }
      setEndpoint(data);
    }
    fetchEndpoint();
  }, [auth, collection]);

  const fetchItems = useCallback(async () => {
    if (!auth.isAuthenticated) {
      return;
    }
    setIsLoading(true);
    const isSource = variant === "source";
    if (isSource) {
      transferSettingsDispatch({
        type: "RESET_ITEMS",
      });
    }
    const response = await transfer.fileOperations.ls(collection, {
      headers: {
        Authorization: `Bearer ${auth.authorization?.tokens.transfer?.access_token}`,
      },
      query: {
        path: browserPath ?? undefined,
        show_hidden: fileBrowser.view.show_hidden ? "true" : "false",
      },
    });
    const data = await response.json();
    setIsLoading(false);
    setLsResponse(data);
    if (!response.ok) {
      setError("code" in data ? data : null);
      return;
    }
    setItems("DATA" in data ? data.DATA : []);
    const transferPath = "absolute_path" in data ? data.absolute_path : null;
    /**
     * If there is no browser path specified, we've loaded the "default path"
     * for the collection, so set the browser path to the returned absolute path.
     */
    if (!browserPath && transferPath) {
      setBrowserPath(transferPath);
    }
    transferSettingsDispatch({
      type: isSource ? "SET_SOURCE_PATH" : "SET_DESTINATION_PATH",
      payload: transferPath,
    });
  }, [
    auth,
    browserPath,
    collection,
    transferSettingsDispatch,
    variant,
    fileBrowser.view.show_hidden,
  ]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addDirectory = async (name: string) => {
    setIsLoading(true);
    const response = await transfer.fileOperations.mkdir(collection, {
      payload: { path: `${browserPath}${name}` },
      headers: {
        Authorization: `Bearer ${auth.authorization?.tokens.transfer?.access_token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      showErrorToast(data);
    } else {
      fetchItems();
    }
    fetchItems();
  };
  const rename = async (
    file: FileDocument,
    absolutePath: string,
    updatedName: string,
  ) => {
    const response = await transfer.fileOperations.rename(collection, {
      payload: {
        old_path: `${absolutePath}${file.name}/`,
        new_path: `${absolutePath}${updatedName}/`,
      },
      headers: {
        Authorization: `Bearer ${auth.authorization?.tokens.transfer?.access_token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      showErrorToast(data);
    } else {
      setItems(
        items.map((item) =>
          item.name === file.name ? { ...item, name: updatedName } : item,
        ),
      );
    }
  };

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

          {error ? <FileBrowserError error={error} /> : null}

          {!isLoading && !error && lsResponse && (
            <>
              <Box p={2}>
                <ChevronRightIcon />
                <Code>{lsResponse.absolute_path}</Code>
              </Box>
              <Flex justify="end">
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
                    onClick={() => fetchItems()}
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
                              onSubmit={addDirectory}
                              toggleShowForm={setShowAddDirectory}
                              icon={<Icon as={FolderPlusIcon} />}
                              label="Folder Name"
                            />
                          </Td>
                        </Tr>
                      )}
                      {items.map((item, i) => (
                        <FileEntry
                          key={i}
                          item={item}
                          isSource={isSource}
                          endpoint={endpoint}
                          absolutePath={lsResponse.absolute_path}
                          openDirectory={() => {
                            setBrowserPath(
                              `${lsResponse.absolute_path}${item.name}/`,
                            );
                            setShowAddDirectory(false);
                          }}
                          handleRename={async (updatedName: string) => {
                            await rename(
                              item,
                              lsResponse.absolute_path,
                              updatedName,
                            );
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
