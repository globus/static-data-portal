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
} from "@chakra-ui/react";
import {
  BuildingLibraryIcon,
  CheckBadgeIcon,
  FunnelIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
// import throttle from "lodash/throttle";
import { useEndpointSearch } from "@/hooks/useTransfer";

import { CollectionPreview } from "./CollectionPreview";

type Endpoint = Record<string, any>;

export function CollectionBrowserModal({ onSelect }: { onSelect: Function }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scope, setScope] = useState("all");
  const [keyword, setKeyword] = useState<string | null>(null);
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [hideNoPermissions /* setHideNoPermissions */] = useState(
    scope === "all",
  );
  const [selectedCollection, setSelectedCollection] =
    useState<Endpoint | null>();

  const params: Record<string, any> = {
    /**
     * In the context of the data portal, we only want to return
     * results that will support Globus Transfer behaviors.
     */
    filter_non_functional: false,
    limit: 50,
    filter_scope:
      scope === "all" && hideNoPermissions ? "hide-no-permissions" : scope,
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
    <>
      <Button onClick={onOpen} variant="link">
        search for a destination
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent h="60vh">
          <ModalHeader>Select a Destination</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0} borderTopWidth={1} overflow="hidden">
            <Grid
              templateRows="repeat(1, 1fr)"
              templateColumns="10em 1fr 1fr"
              gap={0}
              h={"100%"}
            >
              <GridItem
                colSpan={1}
                borderEndWidth={1}
                p={2}
                backgroundColor={"gray.50"}
                h={"100%"}
              >
                <VStack align="start" spacing={1}>
                  <Button
                    size="sm"
                    variant="ghost"
                    isActive={scope === "all"}
                    onClick={() => {
                      setScope("all");
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
                    isActive={scope === "my-endpoints"}
                    onClick={() => {
                      setScope("my-endpoints");
                    }}
                  >
                    My Collections
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    w="100%"
                    justifyContent="start"
                    isActive={scope === "recently-used"}
                    onClick={() => {
                      setScope("recently-used");
                    }}
                  >
                    Recently Used
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    w="100%"
                    justifyContent="start"
                    isActive={scope === "in-use"}
                    onClick={() => {
                      setScope("in-use");
                    }}
                  >
                    In Use
                  </Button>
                </VStack>
              </GridItem>
              <GridItem colSpan={1} borderEndWidth={1} ps={2} overflow="hidden">
                <InputGroup mt={2} pe={2}>
                  <InputLeftAddon>
                    <Icon as={MagnifyingGlassIcon} />
                  </InputLeftAddon>
                  <Input
                    aria-label="Search for a collection"
                    onInput={(e) => handleSearch(e)}
                    placeholder="e.g. Globus Tutorial Collection"
                  />
                </InputGroup>
                {/* {scope === "all" && (
                  <FormControl my={1}>
                    <HStack>
                      <Switch
                        id="hide-no-permissions"
                        isChecked={hideNoPermissions}
                        onChange={() => {
                          setHideNoPermissions(!hideNoPermissions);
                        }}
                        size="sm"
                      />
                      <FormLabel
                        htmlFor="hide-no-permissions"
                        mb={0}
                        mr={0}
                        fontSize="sm"
                      >
                        Hide Guest and GCP Collections with No Permissions
                      </FormLabel>
                      <Tooltip label="By default, we'll hide collections you don't have Transfer-related permissions on. If you can't find what you're looking for, you can search all public collections.">
                        <Icon as={QuestionMarkCircleIcon} fontSize="sm" />
                      </Tooltip>
                    </HStack>
                  </FormControl>
                )} */}

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
                          <Text
                            fontSize="xs"
                            ml={4}
                            fontWeight="bold"
                            color="gray.500"
                          >
                            Globus Connect Personal
                          </Text>
                          <MenuItemOption value="GCP_mapped_collection">
                            Mapped Collections
                          </MenuItemOption>
                          <MenuItemOption value="GCP_gues_collection">
                            Guest Collections
                          </MenuItemOption>
                          <Text
                            fontSize="xs"
                            ml={4}
                            fontWeight="bold"
                            color="gray.500"
                          >
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

                <Box overflow="auto" h={"calc(100% - 65px)"} pb={1} px={0}>
                  <Box pe={2}>
                    {results.map((result: any) => {
                      const parentEntityName = result.mapped_collection_id
                        ? result.mapped_collection_display_name
                        : result.non_functional_endpoint_display_name;

                      return (
                        <Card
                          size="sm"
                          variant="outline"
                          key={result.id}
                          _hover={{
                            cursor: "pointer",
                            borderColor: "blue.500",
                          }}
                          mb={1}
                          bgColor={
                            result.id === selectedCollection?.id
                              ? "blue.50"
                              : "white"
                          }
                          onDoubleClick={() => {
                            onSelect(result);
                            onClose();
                          }}
                          onClick={() => setSelectedCollection(result)}
                        >
                          <CardHeader
                            pt={2}
                            pb={result.description ? 0 : 2}
                            fontSize="sm"
                          >
                            <Flex alignItems="center">
                              <HStack gap={1}>
                                <Text fontWeight="semibold">
                                  {result.display_name || result.name}
                                </Text>
                                {result.orginazation_verfied && (
                                  <Tooltip
                                    hasArrow
                                    label="Organization Verified"
                                    placement="auto"
                                  >
                                    <Icon as={CheckBadgeIcon} />
                                  </Tooltip>
                                )}
                              </HStack>
                              <Spacer />
                              <HStack>
                                {result.my_effective_roles.length && (
                                  <Tooltip
                                    hasArrow
                                    label="Assigned Roles"
                                    placement="auto"
                                  >
                                    <Icon as={UserCircleIcon} />
                                  </Tooltip>
                                )}
                                {result.high_assurance && (
                                  <Tooltip
                                    hasArrow
                                    label="High Assurance"
                                    placement="auto"
                                  >
                                    <Icon as={LockClosedIcon} />
                                  </Tooltip>
                                )}
                                {result.subscription_id && (
                                  <Tooltip
                                    hasArrow
                                    label="Subscribed"
                                    placement="auto"
                                  >
                                    <Icon as={BuildingLibraryIcon} />
                                  </Tooltip>
                                )}
                              </HStack>
                            </Flex>
                            {parentEntityName && (
                              <Text fontSize="xs">on {parentEntityName}</Text>
                            )}
                          </CardHeader>
                          {result.description && (
                            <CardBody pt={1}>
                              <Text noOfLines={1} fontSize={"xs"} mb={1}>
                                {result.description}
                              </Text>
                            </CardBody>
                          )}
                        </Card>
                      );
                    })}
                  </Box>
                </Box>
              </GridItem>
              <GridItem h={"100%"} p={2}>
                {selectedCollection && (
                  <CollectionPreview collection={selectedCollection} />
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
                  onSelect(selectedCollection);
                  onClose();
                }}
                size="sm"
                disabled={!selectedCollection}
              >
                Open Collection
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
