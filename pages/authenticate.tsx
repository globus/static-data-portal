import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Center, Spinner, Text } from "@chakra-ui/react";

export default function Authenticate() {
  const auth = useGlobusAuth();
  const router = useRouter();
  const instance = auth.authorization;

  /**
   * Attempt to handle the incoming OAuth2 redirect.
   */
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
    }
    attempt();
  }, [instance]);

  /**
   * Once the user is authenticated, refresh the tokens and redirect to the transfer page.
   */
  useEffect(() => {
    async function redirect() {
      if (!instance || !auth.isAuthenticated) {
        return;
      }
      await instance.refreshTokens();
      return router.replace("/transfer");
    }
    redirect();
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
