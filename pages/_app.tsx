import "@/styles/globals.css";
import React from "react";
import Head from "next/head";
import {
  ChakraProvider,
  Link,
  Container,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import theme from "@/theme";
import { STATIC, getEnvironment, getRedirectUri } from "@/utils/static";
import Header from "@/components/Header";
import { GlobusAuthorizationManagerProvider } from "@/components/globus-auth-context/Provider";

import type { AppProps } from "next/app";

const env = getEnvironment();
if (env) {
  // @ts-ignore
  globalThis.GLOBUS_SDK_ENVIRONMENT = env;
}

const redirect = getRedirectUri();
const client = STATIC.data.attributes.globus.application.client_id;
const scopes = "urn:globus:auth:scope:transfer.api.globus.org:all";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{STATIC.data.attributes.content.title}</title>
        <meta
          name="description"
          content="A Globus-powered research data portal."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: { position: "bottom-right", duration: null },
        }}
      >
        <GlobusAuthorizationManagerProvider
          redirect={redirect}
          client={client}
          scopes={scopes}
        >
          <Flex direction="column" flex="1" h="100vh">
            <Header title={STATIC.data.attributes.content.title} />
            <Flex as="main" role="main" direction="column" flex="1">
              <Component {...pageProps} />
            </Flex>
            <Box as="footer">
              <Container maxW="container.xl" pb={2}>
                <Flex justify="space-between">
                  <Link href="https://www.globus.org/" isExternal>
                    <Text fontSize="sm">Powered by Globus</Text>
                  </Link>
                  <Text fontSize="xs">
                    Photo by{" "}
                    <Link
                      isExternal
                      href="https://unsplash.com/@nasa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                    >
                      NASA
                    </Link>{" "}
                    on{" "}
                    <Link
                      isExternal
                      href="https://unsplash.com/photos/photo-of-outer-space-Q1p7bh3SHj8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                    >
                      Unsplash
                    </Link>
                  </Text>
                </Flex>
              </Container>
            </Box>
          </Flex>
        </GlobusAuthorizationManagerProvider>
      </ChakraProvider>
    </>
  );
}
