import React from "react";
import {
  Code,
  Text,
  Button,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Collapse,
  ButtonProps,
} from "@chakra-ui/react";

import { useGlobusAuth } from "@globus/react-auth-context";
import {
  isConsentRequiredError,
  isErrorWellFormed,
  isAuthorizationRequirementsError,
} from "@globus/sdk/core/errors";

import { type DirectoryListingError } from "@globus/sdk/services/transfer/service/file-operations";
import { useGlobusTransferStore } from "../store/globus-transfer";

const ErrorToggle = ({
  error,
  ...rest
}: {
  error: any;
} & ButtonProps) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        colorScheme="gray"
        onClick={onToggle}
        {...rest}
      >
        View Error Response
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Code
          bgColor="red.50"
          display="block"
          whiteSpace="pre-wrap"
          my={2}
          p={1}
        >
          {JSON.stringify(error, null, 2)}
        </Code>
      </Collapse>
    </>
  );
};

export default function FileBrowserError({
  error,
}: {
  error: DirectoryListingError | unknown;
}) {
  const auth = useGlobusAuth();
  const transferStore = useGlobusTransferStore();

  const isWellFormed = isErrorWellFormed(error);

  if (isWellFormed && isConsentRequiredError(error)) {
    return (
      <>
        <Alert status="warning">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Box>
          <Text my={2}>
            You&apos;ll need to grant access to this resource in order to
            proceed.
          </Text>
          <Button
            onClick={async () => {
              transferStore.resetItems();
              await auth.authorization?.handleConsentRequiredError(error);
            }}
            size="sm"
          >
            Continue
          </Button>
        </Box>
      </>
    );
  }

  if (isWellFormed && isAuthorizationRequirementsError(error)) {
    /* eslint-disable camelcase */
    const { session_message } = error.authorization_parameters as Record<
      string,
      any
    >;

    return (
      <>
        <Alert status="warning">
          <AlertIcon />
          <AlertDescription>
            {session_message || error.message}
          </AlertDescription>
        </Alert>
        <Box my={2}>
          <Button
            onClick={() => {
              transferStore.resetItems();
              auth.authorization?.handleAuthorizationRequirementsError(error);
            }}
            size="sm"
          >
            Continue
          </Button>
        </Box>
        <ErrorToggle error={error} />
      </>
    );
    /* eslint-enable camelcase */
  }

  if (isWellFormed && error.code === "AuthenticationFailed") {
    return (
      <>
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Text my={2}>
          Please try{" "}
          <Button
            variant="link"
            onClick={async () => {
              transferStore.resetItems();
              await auth.authorization?.login();
            }}
          >
            logging in
          </Button>{" "}
          again to refresh your credentials.
        </Text>
      </>
    );
  }

  if (isWellFormed) {
    return (
      <>
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Box>
          <ErrorToggle error={error} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Unknown Error</AlertTitle>
      </Alert>
      <Box>
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
    </>
  );
}
