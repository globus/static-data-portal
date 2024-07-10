import "@/styles/globals.css";
import React from "react";
import Head from "next/head";
import Image from "next/image";
import {
  ChakraProvider,
  Link,
  Container,
  Box,
  Flex,
  Text,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { info } from "@globus/sdk/cjs";
import theme from "@/theme";
import { STATIC, getEnvironment, getRedirectUri } from "@/utils/static";
import { CLIENT_INFO } from "@/utils/globus";
import Header from "@/components/Header";
import { GlobusAuthorizationManagerProvider } from "@/components/globus-auth-context/Provider";

import type { AppProps } from "next/app";

const env = getEnvironment();
if (env) {
  // @ts-ignore
  globalThis.GLOBUS_SDK_ENVIRONMENT = env;
}

info.addClientInfo(CLIENT_INFO);

const redirect = getRedirectUri();
const client = STATIC.data.attributes.globus.application.client_id;
const scopes = "urn:globus:auth:scope:transfer.api.globus.org:all";

const hasCustomImage = STATIC.data.attributes.content.image !== undefined;

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
            <Header />
            <Flex as="main" role="main" direction="column" flex="1">
              <Component {...pageProps} />
            </Flex>
            <Box as="footer">
              <Container maxW="container.xl" pb={2}>
                <Flex justify="space-between">
                  <Link href="https://www.globus.org/" isExternal>
                    <HStack>
                      <Text fontSize="sm">Powered by Globus</Text>{" "}
                      <Icon
                        as={Image}
                        src="/icons/globus.svg"
                        viewBox="0 0 256 256"
                        boxSize={6}
                        color="gray.500"
                      />
                    </HStack>
                  </Link>
                  {!hasCustomImage && (
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
                  )}
                </Flex>
              </Container>
            </Box>
          </Flex>
        </GlobusAuthorizationManagerProvider>
      </ChakraProvider>
    </>
  );
}
