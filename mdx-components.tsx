import React from "react";
import { Box, Code, Heading, Link, List, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ul(props) {
      return (
        <List styleType="disc" mb={2} paddingInlineStart="2em" {...props} />
      );
    },
    li(props) {
      return <Box as="li" mb={1} {...props} />;
    },
    pre(props: any) {
      return (
        <Code
          w="100%"
          py={3}
          px={1}
          border="1px solid"
          borderColor="gray.300"
          borderRadius={2}
          overflowX="auto"
          {...props}
        />
      );
    },
    code(props) {
      return <Code as="code" fontSize="inherit" {...props} />;
    },
    p(props) {
      return <Text as="p" my={2} lineHeight="tall" {...props} />;
    },
    h1(props) {
      return <Heading as="h1" size="xl" my={5} {...props} />;
    },
    h2(props) {
      return <Heading as="h2" size="lg" my={4} {...props} />;
    },
    h3(props) {
      return <Heading as="h3" size="md" my={3} {...props} />;
    },
    h4(props) {
      return <Heading as="h4" size="sm" my={2} {...props} />;
    },
    h5(props) {
      return <Heading as="h5" size="sm" my={1} {...props} />;
    },
    a({ href, ...rest }) {
      if (!href) {
        return <Link {...rest} href="#" />;
      }
      const isRelative = href.startsWith("/");
      if (isRelative) {
        /**
         * If the link is relative, use Next.js's `Link` component.
         */
        return <Link {...rest} as={NextLink} href={href} />;
      }
      /**
       * If the link is external, mark it as such.
       */
      return (
        <Link {...rest} href={href} position="relative" pr={4} isExternal>
          {rest.children}
          <ExternalLinkIcon
            as="sup"
            position="absolute"
            top={0}
            right={0}
            fontSize="xs"
          />
        </Link>
      );
    },
  };
}
