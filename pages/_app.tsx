import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/styles/globals.css";
import React, { PropsWithChildren, useEffect } from "react";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { info } from "@globus/sdk/cjs";
import theme from "@/theme";
import { STATIC, getEnvironment, getRedirectUri } from "@/utils/static";
import { CLIENT_INFO } from "@/utils/globus";
import { GlobusAuthorizationManagerProvider } from "@/components/globus-auth-context/Provider";

import type { AppProps } from "next/app";

import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";

const env = getEnvironment();
if (env) {
  // @ts-ignore
  globalThis.GLOBUS_SDK_ENVIRONMENT = env;
}

info.addClientInfo(CLIENT_INFO);

const redirect = getRedirectUri();
const client = STATIC.data.attributes.globus.application.client_id;
const scopes = "urn:globus:auth:scope:transfer.api.globus.org:all";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Many errors encountered during queries need to be manually addressed,
       * so we disable automatic retries by default.
       */
      retry: false,
    },
  },
});
function reset() {
  queryClient.cancelQueries();
  queryClient.removeQueries();
  queryClient.clear();
}

const QueryProvider = ({ children }: PropsWithChildren) => {
  const auth = useGlobusAuth();
  useEffect(() => {
    auth.authorization?.events.revoke.addListener(reset);
    auth.authorization?.events.authenticated.addListener(reset);
    return () => {
      auth.authorization?.events.revoke.removeListener(reset);
      auth.authorization?.events.authenticated.removeListener(reset);
    };
  }, [auth.authorization]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

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
          <QueryProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QueryProvider>
        </GlobusAuthorizationManagerProvider>
      </ChakraProvider>
    </>
  );
}
