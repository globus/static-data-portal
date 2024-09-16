import React, { useEffect, useReducer } from "react";
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

export default function Transfer() {
  const auth = useGlobusAuth();
  const [transferSettings, dispatch] = useReducer(
    transferSettingsReducer,
    initialState,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const collection = useCollection(
    STATIC.data.attributes.globus.transfer.collection_id,
  );

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
              <Box mb={1}>
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
