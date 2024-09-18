import React from "react";

import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  type MenuItemProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  getCollectionsConfiguration,
  type TransferCollectionConfiguration,
} from "@/pages/transfer";

import { useCollection } from "@/hooks/useTransfer";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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
          </PopoverTrigger>
          <PopoverContent minW="max-content">
            <Box py={2} px={4} minW={{ base: "max-content", md: "40vw" }}>
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
                        selected.collection_id === collection.collection_id
                      }
                    />
                  );
                })}
              </VStack>
            </Box>
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
  collection: TransferCollectionConfiguration;
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
