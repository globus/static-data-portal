import React from "react";
import {
  Box,
  Text,
  Flex,
  Spacer,
  Button,
  VStack,
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

export const CollectionPreview = ({ collection }: { collection: any }) => {
  const authz = useGlobusAuth();

  const { data: ownerData, isFetching: isFetchingOwner } = useQuery({
    enabled: authz.isAuthenticated,
    queryKey: ["identities", collection.owner_id],
    queryFn: () => fetchIdentity(authz, collection.advertised_owner_id),
  });

  const orgainzationVerified = collection.organization_verified;

  const parentType = collection.mapped_collection_id
    ? "Mapped Collection"
    : "Enpdoint";

  const parentEntityName = collection.mapped_collection_id
    ? collection.mapped_collection_display_name
    : collection.non_functional_endpoint_display_name;

  return (
    <VStack align="start">
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
        {parentEntityName && <Text fontSize="xs">on {parentEntityName}</Text>}
      </Box>

      <HStack>
        {orgainzationVerified && (
          <Tag variant="outline" colorScheme="green">
            <TagLeftIcon as={CheckBadgeIcon} />
            <TagLabel>Organization Verfied</TagLabel>
          </Tag>
        )}
        {collection.high_assurance && (
          <Tag variant="outline" colorScheme="green">
            <TagLeftIcon as={LockClosedIcon} />
            <TagLabel>High Assurance</TagLabel>
          </Tag>
        )}
        {collection.subscription_id && (
          <Tag variant="outline" colorScheme="green">
            <TagLeftIcon as={BuildingLibraryIcon} />
            <TagLabel>Subscribed</TagLabel>
          </Tag>
        )}
        {collection.my_effective_roles.length && (
          <Tag variant="outline" colorScheme="green">
            <TagLeftIcon as={UserCircleIcon} />
            <TagLabel>Assigned Roles</TagLabel>
          </Tag>
        )}
      </HStack>
      <Flex w="100%" align="center">
        {collection.contact_email && (
          <Text fontSize="xs">
            Contact:&nbsp;
            <Link href={`mailto:${collection.contact_email}`}>
              {collection.contact_email}
            </Link>
          </Text>
        )}
        <Spacer />
        <Button
          as="a"
          href={webapp.urlFor("COLLECTION", [collection.id]).toString()}
          position="relative"
          rel="noopener noreferrer"
          target="_blank"
          size="xs"
          variant="outline"
          colorScheme="gray"
          rightIcon={<Icon as={ArrowTopRightOnSquareIcon} />}
        >
          View in Globus{" "}
        </Button>
      </Flex>

      {collection.my_effective_roles.length && (
        <Box fontSize="sm">
          <Text fontSize="xs" fontWeight="bold">
            Your Assigned Roles
          </Text>
          <HStack>
            {collection.my_effective_roles.map((role: string) => (
              <Badge key={role} variant="subtle" size="xs" colorScheme="gray">
                {role.split("_").join(" ")}
              </Badge>
            ))}
          </HStack>
        </Box>
      )}

      <Divider />

      <Box overflowX="auto">
        <Box fontSize="sm">
          <Text fontSize="xs" fontWeight="bold">
            Entity Type
          </Text>
          <Text fontFamily="mono">{collection.entity_type}</Text>
        </Box>

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

        <Box fontSize="sm">
          <Text fontSize="xs" fontWeight="bold">
            Owner
          </Text>
          {isFetchingOwner ? (
            <Text fontFamily="mono">{collection.ownerId}</Text>
          ) : (
            <Popover trigger="hover">
              <PopoverTrigger>
                <Text>
                  {ownerData.identity?.name || ownerData.identity?.username}
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
          )}
        </Box>

        {collection.keywords && (
          <>
            <Box>
              <Text fontSize="xs" fontWeight="bold">
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
          </>
        )}

        {collection.description && (
          <>
            <Divider />
            <Box>
              <Text fontSize="xs" fontWeight="bold">
                Description
              </Text>
              <Text mb={5}>{collection.description}</Text>
            </Box>
          </>
        )}
      </Box>
    </VStack>
  );
};
