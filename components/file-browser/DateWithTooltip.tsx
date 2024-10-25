import React from "react";
import { Tooltip, Text } from "@chakra-ui/react";

export function DateWithTooltip({ value }: { value: string }) {
  return (
    <Tooltip label={value} variant="outline" hasArrow>
      <Text _hover={{ cursor: "help" }}>
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))}
      </Text>
    </Tooltip>
  );
}
