import React, { useEffect, useState } from "react";
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
  SimpleGrid,
  Card,
  CardBody,
  Link,
  Flex,
} from "@chakra-ui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useCollection } from "@globus/react-query/services/transfer";
import { CollectionBrowser } from "@globus/react-components";
import { useShallow } from "zustand/react/shallow";

import { STATIC } from "@/utils/static";
import SourceSelector from "@/components/SourceSelector";
import { useGlobusTransferStore } from "@/components/store/globus-transfer";
import FileBrowser from "@/components/file-browser/FileBrowser";

export type TransferCollectionConfiguration = {
  /**
   * The UUID of the Globus collection to list and transfer files from.
   */
  collection_id: string;
  /**
   * The path on the collection to list and transfer files from.
   */
  path?: string;
  /**
   * A human-readable label for the Source Selector. If not provided,
   * the Collection's `display_name` (and `path`) will be used.
   */
  label?: string;
};

export function getCollectionsConfiguration() {
  return "collections" in STATIC.data.attributes.globus.transfer
    ? STATIC.data.attributes.globus.transfer.collections
    : [STATIC.data.attributes.globus.transfer];
}

export default function Transfer() {
  const auth = useGlobusAuth();
  const transferStore = useGlobusTransferStore();

  /**
   * The static.json configured collection(s).
   */
  const collections = getCollectionsConfiguration();

  const [selectedSourceCollection, setSourceCollection] = useState(
    collections[0],
  );

  const collection = useCollection(selectedSourceCollection.collection_id);

  const { source, destination } = useGlobusTransferStore(
    useShallow((state) => {
      return {
        source: state.source,
        destination: state.destination,
      };
    }),
  );

  useEffect(() => {
    const data = collection.isSuccess ? collection.data : null;
    transferStore.setSource(data);
    transferStore.setSourcePath(data ? data.default_directory : null);
  }, [
    collection.isSuccess,
    collection.data,
    transferStore.setSource,
    transferStore.setSourcePath,
  ]);

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

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={1}>
        <Box p={2}>
          <Flex mb={2} align="center" gap={2} pos="relative">
            <InputGroup>
              <InputLeftAddon>Source</InputLeftAddon>
              <Input
                value={
                  source
                    ? source.display_name || source.name || undefined
                    : "..."
                }
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
                    destination.display_name || destination.name || ""
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
                      transferStore.resetDestination();
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
            <FileBrowser variant="destination" collection={destination.id} />
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
                    <CollectionBrowser
                      onSelect={({ collection, path }) => {
                        // @ts-expect-error `collection` might be a partial document.
                        transferStore.setDestination(collection);
                        if (path) {
                          transferStore.setDestinationPath(path);
                        }
                      }}
                    />
                    .
                  </Text>
                </CardBody>
              </Card>
            </Container>
          </Box>
        )}
      </SimpleGrid>
    </>
  );
}
