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
  HStack,
  Text,
  Checkbox,
  Button,
  Box,
  Spinner,
  Center,
  Tbody,
  IconButton,
  ButtonGroup,
  Flex,
  Tooltip,
  Spacer,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  ArrowUpOnSquareIcon,
  ArrowPathIcon,
  ArrowUturnUpIcon,
} from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk/cjs";

import type {
  DirectoryListingError,
  FileDocument,
} from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

import { useGlobusAuth } from "../globus-auth-context/useGlobusAuth";
import { TransferSettingsDispatchContext } from "../transfer-settings-context/Context";
import { readable } from "@/utils/globus";

import FileBrowserViewMenu from "./FileBrowserViewMenu";
import FileBrowserError from "./FileBrowserError";
import FileEntryIcon from "./FileEntryIcon";

import { FileBrowserContext, FileBrowserDispatchContext } from "./Context";
import fileBrowserReducer, { initialState } from "./reducer";

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
  const [endpoint, setEndpoint] = useState<Record<string, any> | null>(null);
  const [lsResponse, setLsResponse] = useState<Record<string, any> | null>(
    null,
  );
  const [items, setItems] = useState<FileDocument[] | []>([]);
  const [error, setError] = useState<DirectoryListingError | unknown | null>(
    null,
  );

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
                <ChevronRightIcon color="gray.500" />
                <Code colorScheme="purple">{lsResponse.absolute_path}</Code>
              </Box>
              <Flex justify="end">
                <FileBrowserViewMenu />
                <Spacer />
                <ButtonGroup>
                  <Button
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
                    size="xs"
                    leftIcon={<Icon as={ArrowPathIcon} />}
                    onClick={() => fetchItems()}
                  >
                    Refresh
                  </Button>
                </ButtonGroup>
              </Flex>
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
                    {items.map((item, i) => (
                      <Tr key={i}>
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
                            {item.type === "dir" ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  setBrowserPath(
                                    `${lsResponse.absolute_path}${item.name}/`,
                                  );
                                }}
                              >
                                {item.name}
                              </Button>
                            ) : (
                              <Text>{item.name}</Text>
                            )}
                          </HStack>
                        </Td>
                        {fileBrowser.view.columns.includes("last_modified") && (
                          <Td>
                            {item.last_modified ? (
                              <Tooltip
                                label={item.last_modified}
                                variant="outline"
                                hasArrow
                              >
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
                        {fileBrowser.view.columns.includes("size") && (
                          <Td>
                            {item.size ? (
                              <Tooltip
                                label={`${item.size} B`}
                                variant="outline"
                                hasArrow
                              >
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
                            {endpoint &&
                              endpoint.https_server &&
                              item.type === "file" && (
                                <IconButton
                                  as="a"
                                  aria-label="Open"
                                  href={`${endpoint.https_server}${lsResponse.absolute_path}${item.name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="xs"
                                  icon={<Icon as={ArrowUpOnSquareIcon} />}
                                />
                              )}
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        </FileBrowserDispatchContext.Provider>
      </FileBrowserContext.Provider>
    </>
  );
}
