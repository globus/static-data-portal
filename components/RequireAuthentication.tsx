import React, { PropsWithChildren } from "react";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";

export function RequireAuthentication({
  children,
  fallback,
}: PropsWithChildren<{
  fallback?: (auth: ReturnType<typeof useGlobusAuth>) => React.ReactNode;
}>) {
  const auth = useGlobusAuth();
  if (auth.isAuthenticated) {
    return children;
  }
  if (fallback) {
    return fallback(auth);
  }
  return (
    <Box>
      <Center>
        <Text>
          You must be authenticated in to view this content
          {auth.authorization?.login && (
            <>
              &nbsp;&mdash;&nbsp;
              <Button
                onClick={() => auth.authorization?.login()}
                variant="link"
              >
                sign in
              </Button>
            </>
          )}
          .
        </Text>
      </Center>
    </Box>
  );
}
