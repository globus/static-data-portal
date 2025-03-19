import React from "react";
import {
  Box,
  Text,
  Flex,
  Spacer,
  Button,
  Heading,
  HStack,
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Divider,
  Icon,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Badge,
  AbsoluteCenter,
  Spinner,
  Alert,
  Code,
  AlertTitle,
  AlertIcon,
  PropsOf,
} from "@chakra-ui/react";
import {
  BuildingLibraryIcon,
  LockClosedIcon,
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { transfer, auth, webapp } from "@globus/sdk";
import { useQuery } from "@tanstack/react-query";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Collection, useCollection } from "@/hooks/useTransfer";
import { rest } from "lodash";

async function fetchIdentity(authz: any, id: string) {
  const response = await auth.identities.get(
    id,
    {},
    {
      manager: authz.authorization,
    },
  );
  return await response.json();
}

function _CollectionPreview({
  collection,
  ...rest
}: PropsOf<typeof Flex> & { collection: Collection }) {
  const authz = useGlobusAuth();

  const showOwnerString = !collection.owner_string.endsWith(
    "@clients.auth.globus.org",
  );

  // const { data: ownerData } = useQuery({
  //   enabled:
  //     authz.isAuthenticated &&
  //     showOwnerString,
  //   queryKey: ["identities", collection.owner_string],
  //   queryFn: () => fetchIdentity(authz, collection.owner_string),
  // });

  // @ts-expect-error `organization_verified` is not in the Collection type (yet)
  const orgainzationVerified = collection.organization_verified;

  const parentType = collection.mapped_collection_id
    ? "Mapped Collection"
    : "Enpdoint";

  const parentEntityName = collection.mapped_collection_id
    ? collection.mapped_collection_display_name
    : collection.non_functional_endpoint_display_name;

  return (
    <Flex direction="column" {...rest}>
      <Box position="sticky" top={0} zIndex={1} py={2} bg="white">
        <Box>
          <HStack>
            <Heading size="sm">
              {collection.display_name || collection.name}
            </Heading>
            {orgainzationVerified && (
              <Tooltip hasArrow label="Organization Verified" placement="auto">
                <Icon as={CheckBadgeIcon} />
              </Tooltip>
            )}
          </HStack>
          <Flex>
            {parentEntityName && (
              <Text fontSize="xs">on {parentEntityName}</Text>
            )}
            <Spacer />
            <Button
              as="a"
              href={webapp.urlFor("COLLECTION", [collection.id]).toString()}
              position="relative"
              rel="noopener noreferrer"
              target="_blank"
              size="xs"
              variant="link"
              colorScheme="gray"
              rightIcon={<Icon as={ArrowTopRightOnSquareIcon} />}
            >
              View in Globus{" "}
            </Button>
          </Flex>
        </Box>

        <HStack>
          {orgainzationVerified && (
            <Tag variant="outline" colorScheme="green" size="sm">
              <TagLeftIcon as={CheckBadgeIcon} />
              <TagLabel>Organization Verfied</TagLabel>
            </Tag>
          )}
          {collection.high_assurance && (
            <Tag variant="outline" colorScheme="green" size="sm">
              <TagLeftIcon as={LockClosedIcon} />
              <TagLabel>High Assurance</TagLabel>
            </Tag>
          )}
          {collection.subscription_id && (
            <Tag variant="outline" colorScheme="green" size="sm">
              <TagLeftIcon as={BuildingLibraryIcon} />
              <TagLabel>Subscribed</TagLabel>
            </Tag>
          )}
        </HStack>

        {collection.contact_email && (
          <Text fontSize="xs" mt={2}>
            Contact:&nbsp;
            <Link href={`mailto:${collection.contact_email}`}>
              {collection.contact_email}
            </Link>
          </Text>
        )}

        {collection.my_effective_roles?.length > 0 && (
          <Box my={2}>
            <Divider my={2} />
            <Box fontSize="sm">
              <HStack mb={1}>
                <Icon as={UserCircleIcon} />
                <Text fontSize="xs" fontWeight="bold">
                  Your Assigned Roles
                </Text>
              </HStack>
              <HStack>
                {collection.my_effective_roles.map((role: string) => (
                  <Badge key={role} size="xs" colorScheme="gray">
                    {role.split("_").join(" ")}
                  </Badge>
                ))}
              </HStack>
            </Box>
          </Box>
        )}
        <Divider my={2} />
      </Box>

      <Spacer />

      <Box>
        {collection.keywords && (
          <Box pb={2}>
            <Text fontSize="xs" fontWeight="bold" mb={1}>
              Keywords
            </Text>
            <HStack>
              {collection.keywords.split(",").map((keyword: string) => (
                <Tag key={keyword} size="sm" variant="outline">
                  {keyword}
                </Tag>
              ))}
            </HStack>
          </Box>
        )}

        {parentEntityName && (
          <Box fontSize="sm">
            <Text fontSize="xs" fontWeight="bold">
              {parentType}
            </Text>
            <Text>{parentEntityName}</Text>
          </Box>
        )}

        <Box fontSize="sm">
          <Text fontSize="xs" fontWeight="bold">
            Domain
          </Text>
          <Text fontFamily="mono">
            {transfer.utils.getDomainFromEndpoint(collection) ?? "–"}
          </Text>
        </Box>

        {showOwnerString && (
          <Box fontSize="sm">
            <Text fontSize="xs" fontWeight="bold">
              Owner
            </Text>
            <Text>{collection.owner_string}</Text>
          </Box>
        )}

        {/* {ownerData && (
          <Box fontSize="sm">
            <Text fontSize="xs" fontWeight="bold">
              Owner
            </Text>
            <Popover trigger="hover">
              <PopoverTrigger>
                <Text>
                  {ownerData?.identity.name || ownerData?.identity.username}
                </Text>
              </PopoverTrigger>
              <PopoverContent fontSize="xs">
                <PopoverArrow />
                <PopoverBody>
                  {Object.keys(ownerData?.identity || {}).map((key) => (
                    <Box fontSize="sm" key={key}>
                      <Text fontSize="xs" fontWeight="bold">
                        {key}
                      </Text>
                      <Text fontFamily="mono">
                        {ownerData.identity?.[key] ?? "–"}{" "}
                      </Text>
                    </Box>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )} */}

        <Box fontSize="sm">
          <Text fontSize="xs" fontWeight="bold">
            Entity Type
          </Text>
          <Text fontFamily="mono">{collection.entity_type}</Text>
        </Box>
      </Box>

      {collection.description && (
        <Box flexGrow={1}>
          <Divider my={2} />
          <Box>
            <Text fontSize="xs" fontWeight="bold">
              Description
            </Text>
            <Text pb={2} whiteSpace="pre-wrap">
              {collection.description}
            </Text>
          </Box>
        </Box>
      )}
    </Flex>
  );
}

export const CollectionPreview = ({
  collection,
  ...rest
}: PropsOf<typeof _CollectionPreview> & {
  /**
   * The Collection or partial Collection object to preview.
   */
  collection: { id: string } | Collection;
}) => {
  const {
    data: collectionFetchData,
    isFetching: isFetchingCollection,
    isError,
    error,
  } = useCollection(
    collection.id,
    "DATA_TYPE" in collection ? collection : undefined,
  );

  return isFetchingCollection ? (
    <Box position="relative" height="100%">
      <AbsoluteCenter>
        <HStack>
          <Spinner size="xs" />
          <Text fontSize="xs" color="gray.500">
            Loading Collection Information
          </Text>
        </HStack>
      </AbsoluteCenter>
    </Box>
  ) : isError ? (
    <Box p={2}>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error Fetching Collection Information</AlertTitle>
      </Alert>
      <Code
        bgColor="red.50"
        display="block"
        whiteSpace="pre-wrap"
        my={2}
        p={2}
        overflow="auto"
      >
        {JSON.stringify(error, null, 2)}
      </Code>
    </Box>
  ) : collectionFetchData ? (
    <_CollectionPreview collection={collectionFetchData} {...rest} />
  ) : (
    <Box position="relative" height="100%">
      <AbsoluteCenter>
        <HStack>
          <Text fontSize="xs" color="gray.500">
            Unable to preview selected collection.
          </Text>
        </HStack>
      </AbsoluteCenter>
    </Box>
  );
};
