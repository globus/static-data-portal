import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";
import { Center, Spinner, Text } from "@chakra-ui/react";

export default function Authenticate() {
  const auth = useGlobusAuth();
  const router = useRouter();
  const instance = auth.authorization;

  useEffect(() => {
    async function attempt() {
      if (auth.isAuthenticated) {
        /**
         * If the user is authenticated, refresh the tokens and redirect to the home page.
         */
        await instance?.refreshTokens();
        return router.replace("/transfer");
      } else {
        /**
         * Attempt to handle incoming OAuth2 redirect.
         */
        await instance?.handleCodeRedirect({
          /**
           * We'll handle the redirect ourselves...
           */
          shouldReplace: false,
        });
      }
    }
    attempt();
  }, [router, instance, auth.isAuthenticated]);

  return (
    <>
      <Center mt={4}>
        <Spinner mr="2" />
        <Text>Attempting to validate credentials...</Text>
      </Center>
    </>
  );
}
