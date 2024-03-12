import React, { useCallback, useContext, useEffect, useState } from "react";
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
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  Tbody,
  IconButton,
  List,
  ListItem,
  ButtonGroup,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  FolderIcon,
  DocumentIcon,
  ArrowUpOnSquareIcon,
  ArrowPathIcon,
  ArrowUturnUpIcon,
} from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk/cjs";

import type {
  DirectoryListingError,
  FileDocument,
} from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";
import { TransferSettingsDispatchContext } from "./transfer-settings-context/Context";
import { readable } from "@/utils/globus";

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
  const dispatch = useContext(TransferSettingsDispatchContext);

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
      dispatch({
        type: "RESET_ITEMS",
      });
    }
    const response = await transfer.fileOperations.ls(collection, {
      headers: {
        Authorization: `Bearer ${auth.authorization?.tokens.transfer?.access_token}`,
      },
      query: {
        path: browserPath ?? undefined,
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
    dispatch({
      type: isSource ? "SET_SOURCE_PATH" : "SET_DESTINATION_PATH",
      payload: transferPath,
    });
  }, [auth, browserPath, collection, dispatch, variant]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <>
      {isLoading && (
        <Box mt={4}>
          <Center>
            <Spinner />
          </Center>
        </Box>
      )}

      {error && <FileBrowserError error={error} />}

      {!isLoading && !error && lsResponse && (
        <>
          <Box p={2}>
            <ChevronRightIcon color="gray.500" />
            <Code colorScheme="purple">{lsResponse.absolute_path}</Code>
          </Box>
          <Flex justify="end">
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
                  <Th>Last Modified</Th>
                  <Th>Size</Th>
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
                              dispatch({
                                type: "ADD_ITEM",
                                payload: item.name,
                              });
                            } else {
                              dispatch({
                                type: "REMOVE_ITEM",
                                payload: item.name,
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
    </>
  );
}

const FileBrowserError = ({
  error,
}: {
  error: DirectoryListingError | unknown;
}) => {
  const auth = useGlobusAuth();

  const isWellFormedError = (
    error: unknown,
  ): error is DirectoryListingError => {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error
    );
  };

  const isDirectoryListingError = isWellFormedError(error);

  if (isDirectoryListingError && error.code === "ConsentRequired") {
    return (
      <Alert status="warning">
        <Box>
          <HStack>
            <AlertIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            <Text my={2}>
              You'll need to grant access to this resource in order to proceed.
            </Text>
            <Button
              onClick={() =>
                // @ts-ignore
                auth.authorization?.handleConsentRequiredError(error)
              }
              colorScheme="brand"
              size="sm"
            >
              Consent
            </Button>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (
    isDirectoryListingError &&
    error.code === "PermissionDenied" &&
    "authorization_parameters" in error
  ) {
    /* eslint-disable camelcase */
    const {
      session_message,
      session_required_identities,
      session_required_mfa,
      session_required_single_domain,
    } = error.authorization_parameters as Record<string, any>;

    return (
      <Alert status="error">
        <Box>
          <HStack>
            <AlertIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            {session_message && <Text my={2}>{session_message}</Text>}
            <List>
              {session_required_mfa && (
                <ListItem>Requires Multi-Factor Authentication</ListItem>
              )}
              {session_required_identities && (
                <ListItem>
                  <Text as="strong">Required Identities:</Text>{" "}
                  {session_required_identities.join(", ")}
                </ListItem>
              )}
              {session_required_single_domain &&
                session_required_single_domain?.length && (
                  <ListItem>
                    <Text as="strong">Required Single Domain:</Text>{" "}
                    {session_required_single_domain}
                  </ListItem>
                )}
            </List>
            {/* <Button
              onClick={() => auth.authorization?.login()}
              colorScheme="brand"
              size="sm"
            >
              Continue
            </Button> */}
            <Code
              bgColor="red.50"
              display="block"
              whiteSpace="pre-wrap"
              my={2}
              p={1}
            >
              {JSON.stringify(error, null, 2)}
            </Code>
          </AlertDescription>
        </Box>
      </Alert>
    );
    /* eslint-enable camelcase */
  }

  if (isDirectoryListingError && error.code === "AuthenticationFailed") {
    return (
      <Alert status="error">
        <Box>
          <HStack>
            <AlertIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            <Text my={2}>
              Please try logging in again to refresh your credentials.
            </Text>
            <Button
              onClick={() => auth.authorization?.login()}
              colorScheme="brand"
              size="sm"
            >
              Log In
            </Button>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (isDirectoryListingError) {
    return (
      <Alert status="error" flexDirection="column">
        <Box>
          <HStack>
            <AlertIcon />
            <Text>{error.message}</Text>
          </HStack>
          <Code
            bgColor="red.50"
            display="block"
            whiteSpace="pre-wrap"
            my={2}
            p={1}
          >
            {JSON.stringify(error, null, 2)}
          </Code>
        </Box>
      </Alert>
    );
  }

  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Unknown Error</AlertTitle>
      <AlertDescription>
        <Code
          bgColor="red.50"
          display="block"
          whiteSpace="pre-wrap"
          my={2}
          p={1}
        >
          {JSON.stringify(error, null, 2)}
        </Code>
      </AlertDescription>
    </Alert>
  );
};

const FileEntryIcon = ({ entry }: { entry: FileDocument }) => {
  if (entry.type === "dir") {
    return <Icon as={FolderIcon} />;
  }
  return <Icon as={DocumentIcon} />;
};
