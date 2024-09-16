import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  Icon,
  List,
  ListItem,
  Card,
  CardHeader,
  Stack,
  CardBody,
  Text,
  InputRightElement,
  Spinner,
  InputLeftAddon,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk";

import { useGlobusAuth } from "@globus/react-auth-context";
import throttle from "lodash/throttle";

type Endpoint = Record<string, any>;

export function CollectionSearch({
  onSelect = () => {},
}: {
  onSelect: (endpoint: Endpoint) => void;
}) {
  const auth = useGlobusAuth();
  const [results, setResults] = useState<Endpoint[]>([]);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const search = useCallback(
    throttle(async (query) => {
      const response = await transfer.endpointSearch(
        {
          query: {
            /**
             * In the context of the data portal, we only want to return
             * results that will support Globus Transfer behaviors.
             */
            filter_non_functional: false,
            filter_fulltext: query,
            limit: 20,
          },
        },
        { manager: auth.authorization },
      );
      const data = await response.json();
      setResults(data && "DATA" in data ? data.DATA : []);
      setIsRefreshing(false);
    }, 300),
    [],
  );

  useEffect(() => {
    if (!keyword) {
      setResults([]);
      return;
    }
    setIsRefreshing(true);
    search(keyword);
  }, [search, keyword]);

  async function handleSearch(e: React.FormEvent<HTMLInputElement>) {
    const query = e.currentTarget.value;
    setKeyword(query ?? null);
  }

  function handleSelect(endpoint: Endpoint) {
    onSelect(endpoint);
  }

  return (
    <Stack>
      <Box position="sticky" top="0" zIndex={1} bgColor="white">
        <InputGroup>
          <InputLeftAddon>
            <Icon as={MagnifyingGlassIcon} />
          </InputLeftAddon>
          <Input
            aria-label="Search for a collection"
            onInput={(e) => handleSearch(e)}
            placeholder="e.g. Globus Tutorial Collection"
          />
          {isRefreshing && (
            <InputRightElement>
              <Spinner />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>
      {results.map((result) => (
        <Card
          size="sm"
          variant="outline"
          key={result.id}
          onClick={() => handleSelect(result)}
          _hover={{ cursor: "pointer", borderColor: "blue.500" }}
        >
          <CardHeader pb={0}>
            <Text>{result.display_name || result.name}</Text>
            <Text fontSize="xs">{result.entity_type}</Text>
          </CardHeader>
          <CardBody>
            <List>
              <Text fontSize="xs">
                <ListItem>ID: {result.id}</ListItem>
                <ListItem>Owner: {result.owner_id}</ListItem>
                {result.description && (
                  <ListItem>
                    <Text noOfLines={1}>Description: {result.description}</Text>
                  </ListItem>
                )}
                {result.tlsftp_server && (
                  <ListItem>
                    {transfer.utils.getDomainFromEndpoint(result)}
                  </ListItem>
                )}
              </Text>
            </List>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}
