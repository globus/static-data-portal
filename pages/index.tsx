import React, { useCallback, useEffect, useReducer } from "react";
import {
  Box,
  Center,
  Container,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Icon,
  InputRightElement,
  Button,
  useToast,
  SimpleGrid,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Card,
  CardBody,
  Spacer,
  Link,
} from "@chakra-ui/react";
import {
  PlayCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

import { transfer, webapp } from "@globus/sdk/cjs";

import FileBrowser from "@/components/file-browser/FileBrowser";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";

import { CollectionSearch } from "@/components/CollectionSearch";

import {
  TransferSettingsContext,
  TransferSettingsDispatchContext,
} from "@/components/transfer-settings-context/Context";

import transferSettingsReducer, {
  initialState,
} from "@/components/transfer-settings-context/reducer";

import { STATIC } from "@/utils/static";
import { isDirectory } from "@/utils/globus";

export default function Home() {
  const auth = useGlobusAuth();
  const [transferSettings, dispatch] = useReducer(
    transferSettingsReducer,
    initialState,
  );
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTransferHeaders = useCallback(() => {
    return {
      Authorization: `Bearer ${auth.authorization?.tokens.transfer?.access_token}`,
    };
  }, [auth.authorization?.tokens.transfer?.access_token]);

  async function handleStartTransfer() {
    if (
      !transferSettings.source ||
      !transferSettings.source_path ||
      !transferSettings.destination_path ||
      !transferSettings.destination
    ) {
      return;
    }

    const id = await (
      await transfer.taskSubmission.submissionId({
        headers: {
          ...getTransferHeaders(),
        },
      })
    ).json();

    const response = await transfer.taskSubmission.submitTransfer({
      payload: {
        submission_id: id.value,
        label: `Transfer from ${STATIC.data.attributes.content.title}`,
        source_endpoint: transferSettings.source.id,
        destination_endpoint: transferSettings.destination.id,
        DATA: transferSettings.items.map((item) => {
          return {
            DATA_TYPE: "transfer_item",
            source_path: `${transferSettings.source_path}${item.name}`,
            destination_path: `${transferSettings.destination_path}${item.name}`,
            recursive: isDirectory(item),
          };
        }),
      },
      headers: {
        ...getTransferHeaders(),
      },
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: data.code,
        description: (
          <>
            {data.message}
            {"task_id" in data && (
              <Flex>
                <Spacer />
                <Link
                  href={webapp.urlFor("TASK", [data.task_id]).toString()}
                  isExternal
                >
                  View task in Globus Web App{" "}
                  <Icon as={ArrowTopRightOnSquareIcon} />
                </Link>
              </Flex>
            )}
          </>
        ),
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        title: `Error (${data.code})`,
        description: data.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    async function fetchCollection() {
      if (!auth.isAuthenticated) {
        return;
      }
      const response = await transfer.endpoint.get(
        STATIC.data.attributes.globus.transfer.collection_id,
        {
          headers: {
            ...getTransferHeaders(),
          },
        },
      );
      const data = await response.json();
      dispatch({ type: "SET_SOURCE", payload: data });
      dispatch({ type: "SET_SOURCE_PATH", payload: data.default_directory });
    }
    fetchCollection();
  }, [auth.isAuthenticated, getTransferHeaders]);

  if (!auth.isAuthenticated) {
    return (
      <>
        <Center h="100%">
          <Text color="gray.400" as="em" fontSize="2xl" fontWeight="extrabold">
            {STATIC.data.attributes.content.tagline}
          </Text>
        </Center>
      </>
    );
  }

  const { source, destination } = transferSettings;

  return (
    <>
      <TransferSettingsContext.Provider value={transferSettings}>
        <TransferSettingsDispatchContext.Provider value={dispatch}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={1}>
            <Box p={2}>
              <Box p={2}>
                <InputGroup>
                  <InputLeftAddon>Source</InputLeftAddon>
                  <Input
                    value={source ? source.display_name || source.name : "..."}
                    variant="filled"
                    isReadOnly
                  />
                </InputGroup>
              </Box>
              <FileBrowser
                variant="source"
                collection={
                  STATIC.data.attributes.globus.transfer.collection_id
                }
                path={STATIC.data.attributes.globus.transfer?.path}
              />
            </Box>
            {destination ? (
              <Box p={2}>
                <Box p={2}>
                  <InputGroup>
                    <InputLeftAddon>Destination</InputLeftAddon>
                    <Input
                      value={destination.display_name || destination.name}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        isRound
                        aria-label="Clear"
                        colorScheme="gray"
                        icon={<Icon as={XCircleIcon} boxSize={6} />}
                        onClick={() => {
                          dispatch({ type: "SET_DESTINATION", payload: null });
                          dispatch({
                            type: "SET_DESTINATION_PATH",
                            payload: null,
                          });
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <FileBrowser
                  variant="destination"
                  collection={destination.id}
                />
              </Box>
            ) : (
              <Box p={4}>
                <Container>
                  <Card variant="filled" size="sm">
                    <CardBody>
                      <Text pb={2}>
                        You are viewing data made available by{" "}
                        {source?.display_name}.
                        <br /> To transfer data to another location,{" "}
                        <Button onClick={onOpen} variant="link">
                          search for a destination
                        </Button>
                        .
                      </Text>
                    </CardBody>
                  </Card>
                </Container>

                <Drawer
                  placement="right"
                  onClose={onClose}
                  isOpen={isOpen}
                  size="lg"
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                      Search for a destination
                    </DrawerHeader>
                    <DrawerBody>
                      <CollectionSearch
                        onSelect={(endpoint) => {
                          dispatch({
                            type: "SET_DESTINATION",
                            payload: endpoint,
                          });
                          dispatch({
                            type: "SET_DESTINATION_PATH",
                            payload: endpoint.default_directory,
                          });
                        }}
                      />
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </Box>
            )}
          </SimpleGrid>

          {source && destination && (
            <Box position="sticky" bottom={0} bgColor="gray.100">
              <Flex py={2} px={20} align="center">
                <Text fontSize="sm">
                  <Text as="strong">{transferSettings.items.length}</Text> items
                  selected
                </Text>
                <Spacer />
                <Button
                  onClick={() => handleStartTransfer()}
                  isDisabled={!source || !destination}
                  leftIcon={<Icon as={PlayCircleIcon} boxSize={6} />}
                >
                  Start Transfer
                </Button>
              </Flex>
            </Box>
          )}
        </TransferSettingsDispatchContext.Provider>
      </TransferSettingsContext.Provider>
    </>
  );
}
