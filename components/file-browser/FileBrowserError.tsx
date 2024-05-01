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
import {
  isErrorWellFormed,
  isConsentRequiredError,
  isAuthorizationRequirementsError,
} from "@globus/sdk/cjs/lib/core/errors";
import type { DirectoryListingError } from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

export default function FileBrowserError({
  error,
}: {
  error: DirectoryListingError | unknown;
}) {
  const auth = useGlobusAuth();

  const isWellFormed = isErrorWellFormed(error);

  if (isWellFormed && isConsentRequiredError(error)) {
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
                auth.authorization?.handleConsentRequiredError(error)
              }
              size="sm"
            >
              Consent
            </Button>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (isWellFormed && isAuthorizationRequirementsError(error)) {
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
            <AlertTitle>{session_message || error.message}</AlertTitle>
          </HStack>
          <AlertDescription>
            <List p={2}>
              {session_required_mfa && (
                <ListItem>Requires Multi-Factor Authentication</ListItem>
              )}
              {session_required_identities?.length && (
                <ListItem>
                  <Text as="strong">Required Identities:</Text>{" "}
                  {session_required_identities.join(", ")}
                </ListItem>
              )}
              {session_required_single_domain &&
                session_required_single_domain?.length && (
                  <ListItem>
                    <Text as="strong">Required Domain(s):</Text>{" "}
                    {session_required_single_domain}
                  </ListItem>
                )}
            </List>
            <Button
              onClick={() =>
                auth.authorization?.handleAuthorizationRequirementsError(error)
              }
              size="sm"
            >
              Address
            </Button>
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

  if (isWellFormed && error.code === "AuthenticationFailed") {
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
            <Button onClick={() => auth.authorization?.login()} size="sm">
              Log In
            </Button>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (isWellFormed) {
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
