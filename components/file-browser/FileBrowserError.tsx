import React from "react";
import {
  Code,
  HStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
} from "@chakra-ui/react";

import { useGlobusAuth } from "../globus-auth-context/useGlobusAuth";

import type { DirectoryListingError } from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

export default function FileBrowserError({
  error,
}: {
  error: DirectoryListingError | unknown;
}) {
  const auth = useGlobusAuth();

  const isWellFormedError = (
    error: unknown,
  ): error is DirectoryListingError => {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error
    );
  };

  const isDirectoryListingError = isWellFormedError(error);

  if (isDirectoryListingError && error.code === "ConsentRequired") {
    return (
      <Alert status="warning">
        <Box>
          <HStack>
            <AlertIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            <Text my={2}>
              You'll need to grant access to this resource in order to proceed.
            </Text>
            <Button
              onClick={() =>
                // @ts-ignore
                auth.authorization?.handleConsentRequiredError(error)
              }
              colorScheme="brand"
              size="sm"
            >
              Consent
            </Button>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (
    isDirectoryListingError &&
    error.code === "PermissionDenied" &&
    "authorization_parameters" in error
  ) {
    /* eslint-disable camelcase */
    const {
      session_message,
      session_required_identities,
      session_required_mfa,
      session_required_single_domain,
    } = error.authorization_parameters as Record<string, any>;

    return (
      <Alert status="error">
        <Box>
          <HStack>
            <AlertIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            {session_message && <Text my={2}>{session_message}</Text>}
            <List>
              {session_required_mfa && (
                <ListItem>Requires Multi-Factor Authentication</ListItem>
              )}
              {session_required_identities && (
                <ListItem>
                  <Text as="strong">Required Identities:</Text>{" "}
                  {session_required_identities.join(", ")}
                </ListItem>
              )}
              {session_required_single_domain &&
                session_required_single_domain?.length && (
                  <ListItem>
                    <Text as="strong">Required Single Domain:</Text>{" "}
                    {session_required_single_domain}
                  </ListItem>
                )}
            </List>
            {/* <Button
              onClick={() => auth.authorization?.login()}
              colorScheme="brand"
              size="sm"
            >
              Continue
            </Button> */}
            <Code
              bgColor="red.50"
              display="block"
              whiteSpace="pre-wrap"
              my={2}
              p={1}
            >
              {JSON.stringify(error, null, 2)}
            </Code>
          </AlertDescription>
        </Box>
      </Alert>
    );
    /* eslint-enable camelcase */
  }

  if (isDirectoryListingError && error.code === "AuthenticationFailed") {
    return (
      <Alert status="error">
        <Box>
          <HStack>
            <AlertIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            <Text my={2}>
              Please try logging in again to refresh your credentials.
            </Text>
            <Button
              onClick={() => auth.authorization?.login()}
              colorScheme="brand"
              size="sm"
            >
              Log In
            </Button>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (isDirectoryListingError) {
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
  }

  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Unknown Error</AlertTitle>
      <AlertDescription>
        <Code
          bgColor="red.50"
          display="block"
          whiteSpace="pre-wrap"
          my={2}
          p={1}
        >
          {JSON.stringify(error, null, 2)}
        </Code>
      </AlertDescription>
    </Alert>
  );
}
