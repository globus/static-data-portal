import React from "react";
import { Heading, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
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
    a(props) {
      if (props?.href?.startsWith("http")) {
        return (
          <Link {...props} isExternal>
            {props.children} <ExternalLinkIcon mx="2px" />
          </Link>
        );
      }
      return <Link {...props} />;
    },
  };
}
