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
  CardBody,
  Text,
  Spinner,
  InputLeftAddon,
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  LockClosedIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk";

import { useGlobusAuth } from "@globus/react-auth-context";
import throttle from "lodash/throttle";
import { QuestionIcon } from "@chakra-ui/icons";

type Endpoint = Record<string, any>;

function PanelContents({ scope, onSelect }) {
  const auth = useGlobusAuth();
  const [results, setResults] = useState<Endpoint[]>([]);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [hideNoPermissions, setHideNoPermissions] = useState(scope === "all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const _search = useCallback(
    throttle(async (query = {}) => {
      setIsRefreshing(true);
      const response = await transfer.endpointSearch(
        {
          query: {
            ...query,
            /**
             * In the context of the data portal, we only want to return
             * results that will support Globus Transfer behaviors.
             */
            filter_non_functional: false,
            limit: 20,
          },
        },
        { manager: auth.authorization },
      );
      const data = await response.json();
      setResults(data && "DATA" in data ? data.DATA : []);
      setIsRefreshing(false);
    }, 500),
    [],
  );

  function search() {
    const params = {
      filter_scope: hideNoPermissions ? "hide-no-permissions" : scope,
    };
    if (keyword) {
      params.filter_fulltext = keyword;
    }
    _search(params);
  }

  useEffect(() => {
    if (scope !== "all" || hideNoPermissions) {
      /**
       * Search immediately if the selected tab does not require a keyword.
       */
      search();
    }
  }, []);

  async function handleSearch(e: React.FormEvent<HTMLInputElement>) {
    const query = e.currentTarget.value;
    setKeyword(query ?? null);
    search();
  }

  function handleSelect(endpoint: Endpoint) {
    onSelect(endpoint);
  }

  return (
    <>
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
        </InputGroup>
        {scope === "all" && (
          <FormControl display="flex" alignItems="center" my="2">
            <Switch
              id="hide-no-permissions"
              isChecked={hideNoPermissions}
              onChange={() => {
                setHideNoPermissions(!hideNoPermissions);
                search();
              }}
              mr={2}
            />
            <FormLabel htmlFor="hide-no-permissions" mb="0">
              Hide Collections with No Permissions
            </FormLabel>
            <Tooltip label="By default, we'll hide collections you don't have Transfer-related permissions on. If you can't find what you're looking for, you can search all public collections.">
              <Icon as={QuestionIcon} />
            </Tooltip>
          </FormControl>
        )}
        <Box my={2}>
          {isRefreshing && (
            <Text fontSize="sm">
              <Spinner size="xs" /> Fetching results...
            </Text>
          )}
        </Box>
      </Box>

      {results.length === 0 && !isRefreshing && (
        <Box my={2}>
          <Text fontSize="sm">No results found.</Text>
        </Box>
      )}

      {results.map((result) => (
        <Card
          size="sm"
          variant="outline"
          key={result.id}
          onClick={() => handleSelect(result)}
          _hover={{ cursor: "pointer", borderColor: "blue.500" }}
          mb={1}
        >
          <CardHeader pb={0}>
            <Flex>
              <Box>
                <Text>{result.display_name || result.name}</Text>
                <Text fontSize="xs">{result.entity_type}</Text>
              </Box>
              <Spacer />
              {result.high_assurance && (
                <Tooltip hasArrow label="High Assurance" placement="auto">
                  <Icon as={LockClosedIcon} />
                </Tooltip>
              )}
            </Flex>
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
    </>
  );
}

export function CollectionSearch({
  onSelect = () => {},
}: {
  onSelect: (endpoint: Endpoint) => void;
}) {
  return (
    <Tabs>
      <TabList>
        <Tab isActive>All</Tab>
        <Tab>My Collections</Tab>
        <Tab>Recently Used</Tab>
        <Tab>In Use</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box mb={4}>
            <Text>Search Globus collections visible to you.</Text>
          </Box>
          <PanelContents scope="all" onSelect={onSelect} />
        </TabPanel>
        <TabPanel>
          <Box mb={4}>
            <Text>Search Globus collections you own.</Text>
          </Box>
          <PanelContents scope="my-endpoints" onSelect={onSelect} />
        </TabPanel>
        <TabPanel>
          <Box mb={4}>
            <Text>Search Globus collections you&apos;ve recently used.</Text>
          </Box>
          <PanelContents scope="recently-used" onSelect={onSelect} />
        </TabPanel>
        <TabPanel>
          <Box mb={4}>
            <Text>
              Search Globus collections that have active tasks owned by you.
            </Text>
          </Box>
          <PanelContents scope="in-use" onSelect={onSelect} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
