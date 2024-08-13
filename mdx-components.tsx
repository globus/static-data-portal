import React from "react";
import { Heading, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1(props) {
      return <Heading as="h1" size="xl" {...props} />;
    },
    h2(props) {
      return <Heading as="h2" size="lg" {...props} />;
    },
    h3(props) {
      return <Heading as="h3" size="md" {...props} />;
    },
    h4(props) {
      return <Heading as="h4" size="sm" {...props} />;
    },
    h5(props) {
      return <Heading as="h5" size="sm" {...props} />;
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
        <Link {...rest} href={href} isExternal>
          {rest.children} <ExternalLinkIcon mx="2px" />
        </Link>
      );
    },
  };
}
