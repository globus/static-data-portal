import React, { useEffect, useReducer, useState } from "react";
import {
  Box,
  Center,
  Container,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Icon,
  InputRightElement,
  Button,
  SimpleGrid,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Card,
  CardBody,
  Link,
  Flex,
  InputRightAddon,
} from "@chakra-ui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import FileBrowser from "@/components/file-browser/FileBrowser";
import { useGlobusAuth } from "@globus/react-auth-context";

import { CollectionSearch } from "@/components/CollectionSearch";

import {
  TransferSettingsContext,
  TransferSettingsDispatchContext,
} from "@/components/transfer-settings-context/Context";

import transferSettingsReducer, {
  initialState,
} from "@/components/transfer-settings-context/reducer";

import { STATIC } from "@/utils/static";
import { useCollection } from "@/hooks/useTransfer";
import SourceSelector from "@/components/SourceSelector";

export type TransferCollectionConfiguration = {
  /**
   * The UUID of the Globus collection to list and transfer files from.
   */
  collection_id: string;
  /**
   * The path on the collection to list and transfer files from.
   */
  path?: string;
};

export function getCollectionsConfiguration() {
  return "collections" in STATIC.data.attributes.globus.transfer
    ? STATIC.data.attributes.globus.transfer.collections
    : [STATIC.data.attributes.globus.transfer];
}

export default function Transfer() {
  const auth = useGlobusAuth();
  const [transferSettings, dispatch] = useReducer(
    transferSettingsReducer,
    initialState,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * The static.json configured collection(s).
   */
  const collections = getCollectionsConfiguration();

  const [selectedSourceCollection, setSourceCollection] = useState(
    collections[0],
  );

  const collection = useCollection(selectedSourceCollection.collection_id);

  useEffect(() => {
    const data = collection.isSuccess ? collection.data : null;
    dispatch({ type: "SET_SOURCE", payload: data });
    dispatch({
      type: "SET_SOURCE_PATH",
      payload: data ? data.default_directory : null,
    });
  }, [collection.isSuccess, collection.data]);

  if (!auth.isAuthenticated) {
    return (
      <Container>
        <Center mt={4}>
          <Text>
            You must{" "}
            <Link onClick={async () => await auth.authorization?.login()}>
              sign in
            </Link>{" "}
            to transfer data using the portal.
          </Text>
        </Center>
      </Container>
    );
  }

  const { source, destination } = transferSettings;

  return (
    <>
      <TransferSettingsContext.Provider value={transferSettings}>
        <TransferSettingsDispatchContext.Provider value={dispatch}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={1}>
            <Box p={2}>
              <Flex mb={2} align="center" gap={2} pos="relative">
                <InputGroup>
                  <InputLeftAddon>Source</InputLeftAddon>
                  <Input
                    value={source ? source.display_name || source.name : "..."}
                    variant="filled"
                    isReadOnly
                  />
                </InputGroup>
                {collections.length > 1 && (
                  <Box position="absolute" right={4}>
                    <SourceSelector
                      onSelect={(collection) => {
                        setSourceCollection(collection);
                      }}
                      selected={selectedSourceCollection}
                    />
                  </Box>
                )}
              </Flex>
              <FileBrowser
                variant="source"
                collection={selectedSourceCollection.collection_id}
                path={selectedSourceCollection?.path}
              />
            </Box>
            {destination ? (
              <Box p={2}>
                <Box mb={1}>
                  <InputGroup>
                    <InputLeftAddon>Destination</InputLeftAddon>
                    <Input
                      defaultValue={
                        destination.display_name || destination.name
                      }
                      isReadOnly
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
                        <Text as="em">{source?.display_name}</Text>.
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
        </TransferSettingsDispatchContext.Provider>
      </TransferSettingsContext.Provider>
    </>
  );
}
