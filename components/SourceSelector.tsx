import React from "react";

import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItem,
  type MenuItemProps,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Spacer,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  getCollectionsConfiguration,
  type TransferCollectionConfiguration,
} from "@/pages/transfer";

import { useCollection } from "@/hooks/useTransfer";
import { STATIC } from "@/utils/static";
import { ChevronDownIcon, XCircleIcon } from "@heroicons/react/24/outline";

export type RecommendedCollection = {
  label?: string;
  collection_id: TransferCollectionConfiguration["collection_id"];
  path?: TransferCollectionConfiguration["path"];
};

const RECOMMEDED =
  "recommended" in STATIC.data.attributes.globus.transfer &&
  Array.isArray(STATIC.data.attributes.globus.transfer.recommended)
    ? STATIC.data.attributes.globus.transfer.recommended
    : [];

const hasRecommended = RECOMMEDED.length > 0;

export default function SourceCollectionSelector({
  onSelect,
  selected,
}: {
  onSelect: (collection: TransferCollectionConfiguration) => void;
  selected: TransferCollectionConfiguration;
}) {
  const collections = getCollectionsConfiguration();

  return (
    <Popover placement="bottom-end" gutter={14}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton
              variant="ghost"
              size="sm"
              isRound
              aria-label="Clear"
              colorScheme="gray"
              icon={<Icon as={ChevronDownIcon} boxSize={6} />}
            />

            {/* <Button size="xs" colorScheme="gray" variant="ghost">
          Change Source
        </Button> */}
          </PopoverTrigger>
          <PopoverContent minW="max-content">
            <Tabs>
              <TabList>
                <Tab>Sources</Tab>
                {hasRecommended && <Tab>Recommended</Tab>}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box minW={{ base: "max-content", md: "40vw" }}>
                    <VStack align="start" spacing={4}>
                      {collections.map((collection) => {
                        return (
                          <CollectionMenuItem
                            key={collection.collection_id}
                            collection={collection}
                            onClick={() => {
                              onSelect(collection);
                              onClose();
                            }}
                            isDisabled={
                              selected.collection_id ===
                              collection.collection_id
                            }
                          />
                        );
                      })}
                    </VStack>
                  </Box>
                </TabPanel>
                {hasRecommended && (
                  <TabPanel>
                    <Box minW={{ base: "max-content", md: "40vw" }}>
                      <VStack align="start" spacing={4}>
                        {RECOMMEDED.map((collection) => {
                          return (
                            <CollectionMenuItem
                              key={collection.collection_id}
                              collection={collection}
                              onClick={() => {
                                onSelect(collection);
                                onClose();
                              }}
                              isDisabled={
                                selected.collection_id ===
                                collection.collection_id
                              }
                            />
                          );
                        })}
                      </VStack>
                    </Box>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}

const CollectionMenuItem = ({
  collection,
  ...props
}: MenuItemProps & {
  collection: TransferCollectionConfiguration | RecommendedCollection;
}) => {
  const c = useCollection(collection.collection_id);
  return (
    <Flex width="100%" alignItems="start" gap="2">
      {collection?.label ? (
        <Text>{collection.label}</Text>
      ) : (
        <VStack align="start" spacing={0}>
          <Text>{c.data?.display_name ?? collection.collection_id}</Text>
          <Text as="pre" fontSize="xs" noOfLines={1}>
            {collection.path}
          </Text>
        </VStack>
      )}

      <Spacer />
      <Button variant="ghost" size="xs" {...props}>
        Open
      </Button>
    </Flex>
  );
};
