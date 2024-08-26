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
      if (!instance) {
        return;
      }
      /**
       * Attempt to handle incoming OAuth2 redirect.
       */
      await instance.handleCodeRedirect({
        /**
         * We'll handle the redirect ourselves...
         */
        shouldReplace: false,
      });
      /**
       * @todo This current processing means that the token created from `handleCodeRedirect`
       * is immediately refreshed...
       */
      if (auth.isAuthenticated) {
        await instance.refreshTokens();
      }
      return router.replace("/transfer");
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
