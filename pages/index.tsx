import React, { useCallback, useEffect, useState } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";

import { transfer } from "@globus/sdk/cjs";

import FileBrowser from "@/components/FileBrowser";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";

import { CollectionSearch } from "@/components/CollectionSearch";
import { TransferContext } from "@/components/transfer-context/Context";

import STATIC from "@/static.json";

export default function Home() {
  const auth = useGlobusAuth();
  const toast = useToast();

  const [source, setSource] = useState<Record<string, any> | null>(null);
  const [destination, setDestination] = useState<Record<string, any> | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTransferHeaders = useCallback(() => {
    return {
      Authorization: `Bearer ${auth.authorization?.tokens.transfer?.access_token}`,
    };
  }, [auth.authorization?.tokens.transfer?.access_token]);

  async function handleStartTransfer() {
    if (!source || !destination) {
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
        label: "Transfer from Next.js",
        source_endpoint: source.id,
        destination_endpoint: destination.id,
        DATA: [
          {
            DATA_TYPE: "transfer_item",
            source_path: "/~/My New Folder",
            destination_path: "/~/",
          },
        ],
      },
      headers: {
        ...getTransferHeaders(),
      },
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: data.code,
        description: data.message,
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
        STATIC.globus.transfer.collection_id,
        {
          headers: {
            ...getTransferHeaders(),
          },
        },
      );
      const data = await response.json();
      setSource(data);
    }
    fetchCollection();
  }, [auth.isAuthenticated, getTransferHeaders]);

  if (!auth.isAuthenticated) {
    return (
      <>
        <Center h="100%">
          <Text color="gray.400" as="em" fontSize="2xl" fontWeight="extrabold">
            It's how research data management is done!
          </Text>
        </Center>
      </>
    );
  }

  return (
    <>
      <TransferContext.Provider value={{ collection: source }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={1}>
          <Box p={2}>
            <Box p={2}>
              <InputGroup>
                <InputLeftAddon>Source</InputLeftAddon>
                <Input
                  value={source ? source.display_name || source.name : "..."}
                  isReadOnly
                />
              </InputGroup>
            </Box>

            <FileBrowser
              variant="source"
              collection={STATIC.globus.transfer.collection_id}
            />
          </Box>
          {destination ? (
            <Box p={2}>
              <Box p={2}>
                <InputGroup>
                  <InputLeftAddon>Destination</InputLeftAddon>
                  <Input value={destination.display_name || destination.name} />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      isRound
                      aria-label="Clear"
                      icon={<Icon as={XCircleIcon} boxSize={6} />}
                      onClick={() => setDestination(null)}
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>
              <FileBrowser variant="destination" collection={destination.id} />
            </Box>
          ) : (
            <Center>
              <Container>
                <Card variant="filled" size="sm">
                  <CardBody>
                    <Text pb={2}>
                      You are viewing data made available by{" "}
                      {source?.display_name}.
                      <br /> To transfer data to another location,{" "}
                      <Button
                        onClick={onOpen}
                        colorScheme="brand"
                        variant="link"
                      >
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
                      onSelect={(endpoint) =>
                        // @ts-ignore
                        endpoint && setDestination(endpoint)
                      }
                    />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Center>
          )}
        </SimpleGrid>
        {source && destination && (
          <Flex justify="end" m="2">
            <Tooltip hasArrow label="Coming soon!" bg="green.600">
              <Button
                disabled
                colorScheme="brand"
                onClick={() => handleStartTransfer}
                isDisabled={!source || !destination}
              >
                Start Transfer
              </Button>
            </Tooltip>
          </Flex>
        )}
      </TransferContext.Provider>
    </>
  );
}
