import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Text,
  Spinner,
  InputLeftAddon,
  Tooltip,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  VStack,
  Grid,
  GridItem,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  PropsOf,
  Skeleton,
  Badge,
} from "@chakra-ui/react";
import {
  BuildingLibraryIcon,
  FunnelIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Collection,
  useCollection,
  useCollectionBookmarks,
  useEndpointSearch,
} from "@/hooks/useTransfer";

import { CollectionPreview } from "./CollectionPreview";

/**
 * Sections supported by the Collection Browser
 */
type Section =
  | "all"
  | "my-endpoints"
  | "bookmarks"
  | "in-use"
  | "recently-used";

export function CollectionBrowserModal({
  header = "Browse Collections",
  cta = "Open Collection",
  onSelect,
}: {
  header?: React.ReactNode;
  cta?: React.ReactNode;
  onSelect: (selection: {
    /**
     * The Collection the user has selected from the browser.
     */
    collection: Collection;
    /**
     * In some cases (Bookmarks), the user's selection also
     * indicates a preferred path within the Collection.
     */
    path?: string;
  }) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [section, setSection] = useState<Section>("my-endpoints");

  const [previewCollection, setPreviewCollection] =
    useState<PropsOf<typeof CollectionPreview>["collection"]>();

  return (
    <>
      <Button onClick={onOpen} variant="link">
        search for a destination
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        isCentered
        blockScrollOnMount
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent h={["100vh", "100vh", "65vh"]} minH="400px">
          {header && <ModalHeader>{header}</ModalHeader>}
          <ModalCloseButton />
          <ModalBody p={0} borderTopWidth={1} overflow="hidden">
            <Grid
              templateRows={["1fr 1f", "1fr 1fr", "1fr"]}
              templateColumns={["1fr", "1fr", "10em 1fr 1fr"]}
              gap={0}
              h={"100%"}
            >
              <GridItem
                colSpan={1}
                borderEndWidth={1}
                p={2}
                backgroundColor={"gray.50"}
              >
                <VStack align="start" spacing={1}>
                  <Button
                    size="sm"
                    variant="ghost"
                    isActive={section === "all"}
                    onClick={() => {
                      setSection("all");
                    }}
                    w="100%"
                    justifyContent="start"
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    w="100%"
                    justifyContent="start"
                    isActive={section === "my-endpoints"}
                    onClick={() => {
                      setSection("my-endpoints");
                    }}
                  >
                    My Collections
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    w="100%"
                    justifyContent="start"
                    isActive={section === "bookmarks"}
                    onClick={() => {
                      setSection("bookmarks");
                    }}
                  >
                    My Bookmarks
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    w="100%"
                    justifyContent="start"
                    isActive={section === "recently-used"}
                    onClick={() => {
                      setSection("recently-used");
                    }}
                  >
                    Recently Used
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    w="100%"
                    justifyContent="start"
                    isActive={section === "in-use"}
                    onClick={() => {
                      setSection("in-use");
                    }}
                  >
                    In Use
                  </Button>
                </VStack>
              </GridItem>
              <GridItem borderEndWidth={1} ps={2} overflow="hidden">
                {section === "bookmarks" ? (
                  <BookmarksPanel
                    onResultClick={({ collection }) => {
                      setPreviewCollection(collection);
                    }}
                    onResultDoubleClick={({ collection, path }) => {
                      onSelect({
                        // @ts-ignore @todo Need to determine if partial collections should be allowed.
                        collection,
                        path,
                      });
                    }}
                  />
                ) : (
                  <CollectionSearchPanel
                    onResultClick={({ collection }) => {
                      setPreviewCollection(collection);
                    }}
                    onResultDoubleClick={({ collection }) => {
                      onSelect({
                        collection,
                      });
                      onClose();
                    }}
                    scope={section === "all" ? "hide-no-permissions" : section}
                  />
                )}
              </GridItem>
              <GridItem overflowX="auto">
                {previewCollection && (
                  <CollectionPreview collection={previewCollection} p={2} />
                )}
              </GridItem>
            </Grid>
          </ModalBody>

          <ModalFooter borderTopWidth={1}>
            <HStack>
              <Button variant="ghost" onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button
                mr={3}
                onClick={() => {
                  onSelect({
                    collection: previewCollection,
                  });
                  onClose();
                }}
                size="sm"
                disabled={!previewCollection}
              >
                {cta}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

/**
 * The `<CollectionSearchPanel>` is an interface to Globus Transfer's "Endpoint Search"
 *
 * The UI is pre-filtered to a provided `scope`.
 *
 * @see https://docs.globus.org/api/transfer/endpoint_and_collection_search/
 */
function CollectionSearchPanel({
  scope,
  onResultClick,
  onResultDoubleClick,
}: {
  /**
   * @see https://docs.globus.org/api/transfer/endpoint_and_collection_search/#search_scope
   */
  scope: string;
  onResultClick: ({ collection }: { collection: Collection }) => void;
  onResultDoubleClick: ({ collection }: { collection: Collection }) => void;
}) {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>();

  const params: Record<string, any> = {
    /**
     * In the context of the data portal, we only want to return
     * results that will support Globus Transfer behaviors.
     */
    filter_non_functional: false,
    limit: 50,
    filter_scope: scope,
  };

  if (entityTypeFilter !== "all") {
    params.filter_entity_type = entityTypeFilter;
    delete params.filter_non_functional;
  }

  if (keyword) {
    params.filter_fulltext = keyword;
  }

  const { isFetching, data } = useEndpointSearch(params);

  const results = data?.DATA ?? [];

  async function handleSearch(e: React.FormEvent<HTMLInputElement>) {
    const query = e.currentTarget.value;
    setKeyword(query ?? null);
  }

  return (
    <Flex direction="column" h="100%">
      <InputGroup mt={2} pe={2}>
        <InputLeftAddon>
          <Icon as={MagnifyingGlassIcon} />
        </InputLeftAddon>
        <Input
          aria-label="Search for a collection"
          onInput={(e) => handleSearch(e)}
          placeholder="e.g. Globus Tutorial Collection"
          type="search"
        />
      </InputGroup>
      <Box pe={2}>
        <Flex align="center">
          <Box my={2}>
            <Text fontSize="xs" color="gray.500">
              {isFetching && <Spinner size="xs" />}
              {results.length > 0 && !isFetching && (
                <Text>Showing {results.length} Collections</Text>
              )}
              {results.length === 0 && !isFetching && (
                <Text>No results found.</Text>
              )}
            </Text>
          </Box>
          <Spacer />
          <Menu placement="bottom-end">
            <MenuButton
              as={Button}
              leftIcon={<Icon as={FunnelIcon} />}
              size="xs"
              variant="ghost"
            >
              Filter
            </MenuButton>
            <MenuList fontSize="sm">
              <MenuOptionGroup
                defaultValue="all"
                title="Entity Type"
                type="radio"
                onChange={(value) => {
                  setEntityTypeFilter(value as string);
                }}
              >
                <MenuItemOption value="all">All</MenuItemOption>
                <Text fontSize="xs" ml={4} fontWeight="bold" color="gray.500">
                  Globus Connect Personal
                </Text>
                <MenuItemOption value="GCP_mapped_collection">
                  Mapped Collections
                </MenuItemOption>
                <MenuItemOption value="GCP_gues_collection">
                  Guest Collections
                </MenuItemOption>
                <Text fontSize="xs" ml={4} fontWeight="bold" color="gray.500">
                  Globus Conect Server
                </Text>
                <MenuItemOption value="GCSv5_mapped_collection">
                  Mapped Collections
                </MenuItemOption>
                <MenuItemOption value="GCSv5_guest_collection">
                  Guest Collections
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      <Box overflowY="auto" flexGrow={1}>
        <Box pe={2}>
          {results.map((result: any) => (
            <CollectionResult
              key={result.id}
              result={result}
              isSelected={selectedCollection?.id === result.id}
              onClick={() => {
                setSelectedCollection(result);
                onResultClick({ collection: result });
              }}
              onDoubleClick={() => {
                onResultDoubleClick({ collection: result });
              }}
            />
          ))}
        </Box>
      </Box>
    </Flex>
  );
}

function BookmarksPanel({
  onResultClick,
  onResultDoubleClick,
}: Pick<
  PropsOf<typeof BookmarkResult>,
  "onResultClick" | "onResultDoubleClick"
>) {
  const { isFetching, data } = useCollectionBookmarks();
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string>();
  return (
    <Flex direction="column" h="100%" mt={2} pe={2}>
      {isFetching && <Spinner />}
      <Box>
        {data?.DATA.map((bookmark: any) => (
          <BookmarkResult
            key={bookmark.id}
            bookmark={bookmark}
            isSelected={selectedBookmarkId === bookmark.id}
            onResultClick={(result) => {
              setSelectedBookmarkId(bookmark.id);
              onResultClick(result);
            }}
            onResultDoubleClick={onResultDoubleClick}
          />
        ))}
      </Box>
    </Flex>
  );
}

function BookmarkResult({
  bookmark,
  isSelected,
  onResultClick,
  onResultDoubleClick,
}: {
  bookmark: any;
  isSelected: boolean;
  onResultClick: ({
    collection,
    path,
  }: {
    collection: Collection | { id: string };
    path: string;
  }) => void;
  onResultDoubleClick: ({
    collection,
    path,
  }: {
    collection: Collection | { id: string };
    path: string;
  }) => void;
}) {
  const { isLoading, data, isError } = useCollection(bookmark.endpoint_id);
  const collection = data || { id: bookmark.endpoint_id };

  return (
    <Skeleton isLoaded={!isLoading}>
      <Card
        size="sm"
        variant="outline"
        _hover={{
          cursor: "pointer",
          borderColor: "blue.500",
        }}
        mb={1}
        bgColor={isSelected ? "blue.50" : "white"}
        onClick={() => {
          onResultClick({
            collection,
            path: bookmark.path,
          });
        }}
        onDoubleClick={() => {
          onResultDoubleClick({
            collection,
            path: bookmark.path,
          });
        }}
      >
        <CardHeader pt={2} pb={2} fontSize="sm">
          <Flex alignItems="center">
            <HStack gap={1}>
              <Text fontWeight="semibold">{bookmark.name}</Text>
            </HStack>
            <Spacer />
            {isError && <Badge colorScheme="red">Error</Badge>}
          </Flex>
          <Text fontSize="xs">{bookmark.path}</Text>
        </CardHeader>
      </Card>
    </Skeleton>
  );
}

function CollectionResult({
  result,
  isSelected,
  ...rest
}: PropsOf<typeof Card> & {
  result: Collection;
  isSelected: boolean;
}) {
  const parentEntityName = result.mapped_collection_id
    ? result.mapped_collection_display_name
    : result.non_functional_endpoint_display_name;

  const { description } = result;

  const icons = [
    result.my_effective_roles?.length && (
      <Tooltip hasArrow label="Assigned Roles" placement="auto">
        <Icon as={UserCircleIcon} />
      </Tooltip>
    ),
    result.high_assurance && (
      <Tooltip hasArrow label="High Assurance" placement="auto">
        <Icon as={LockClosedIcon} />
      </Tooltip>
    ),
    result.subscription_id && (
      <Tooltip hasArrow label="Subscribed" placement="auto">
        <Icon as={BuildingLibraryIcon} />
      </Tooltip>
    ),
  ];

  const hostText = parentEntityName && `on ${parentEntityName}`;

  return (
    <Card
      size="sm"
      variant="outline"
      _hover={{
        cursor: "pointer",
        borderColor: "blue.500",
      }}
      mb={1}
      bgColor={isSelected ? "blue.50" : "white"}
      {...rest}
    >
      <CardHeader pt={2} pb={description ? 0 : 2} fontSize="sm">
        <Flex alignItems="center">
          <HStack gap={1}>
            <Text fontWeight="semibold">
              {result.display_name || result.name}
            </Text>
          </HStack>
          <Spacer />
          <HStack>{icons}</HStack>
        </Flex>
        {hostText && <Text fontSize="xs">{hostText}</Text>}
      </CardHeader>
      {description && (
        <CardBody pt={1}>
          <Text noOfLines={1} fontSize={"xs"} mb={1}>
            {description}
          </Text>
        </CardBody>
      )}
    </Card>
  );
}
