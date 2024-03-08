import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk/cjs";

import type {
  DirectoryListingError,
  FileDocument,
} from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";

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
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<FileDocument[] | []>([]);
  const [error, setError] = useState<DirectoryListingError | null>(null);

  useEffect(() => {
    async function fetchItems() {
      if (!auth.isAuthenticated) {
        return;
      }
      setIsLoading(true);
      const response = await transfer.fileOperations.ls(collection, {
        headers: {
          Authorization: `Bearer ${auth.authorization?.getTokenForService("TRANSFER")}`,
        },
        query: {
          path: path ?? undefined,
        },
      });
      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setError("code" in data ? data : null);
        return;
      }

      setItems("DATA" in data ? data.DATA : []);
    }
    fetchItems();
  }, [auth, collection, path]);

  return (
    <>
      {isLoading && (
        <Center h="100%">
          <Spinner />
        </Center>
      )}
      {error && <FileBrowserError error={error} />}

      {!isLoading && !error && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Td />
                <Th>Name</Th>
                <Th>Last Modified</Th>
                <Th>Size</Th>
              </Tr>
            </Thead>
            {items.map((item, i) => (
              <Tr key={i}>
                <Td>{variant === "source" && <Checkbox />}</Td>
                <Td>
                  <HStack>
                    <FileEntryIcon entry={item} />
                    <Text>{item.name}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Code>{item.last_modified}</Code>
                </Td>
                <Td>
                  <Code>{item.size}</Code>
                </Td>
              </Tr>
            ))}
          </Table>
        </TableContainer>
      )}
    </>
  );
}

const FileBrowserError = ({ error }: { error: DirectoryListingError }) => {
  const auth = useGlobusAuth();

  if (error.code === "ConsentRequired") {
    return (
      <Alert status="warning">
        <Box>
          <HStack>
            <AlertIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            <Text my={2}>
              You'll need to grant access to this collection in order to
              proceed.
            </Text>
            <Button
              onClick={() =>
                // @ts-ignore
                auth.authorization?.handleConsentRequiredError(error)
              }
              colorScheme="teal"
              rightIcon={<ExternalLinkIcon />}
            >
              Consent
            </Button>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

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
};

const FileEntryIcon = ({ entry }: { entry: FileDocument }) => {
  if (entry.type === "dir") {
    return <Icon as={FolderIcon} />;
  }
  return <Icon as={DocumentIcon} />;
};
