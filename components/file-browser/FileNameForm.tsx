import React, { ReactNode, useState } from "react";
import {
  FormControl,
  FormLabel,
  Flex,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function FileNameForm({
  onSubmit,
  toggleShowForm,
  label,
  initialValue = "",
  icon,
}: {
  onSubmit: (input: string) => void;
  toggleShowForm: (showForm: boolean) => void;
  label: string;
  initialValue?: string;
  icon?: ReactNode;
}) {
  const [name, setName] = useState(initialValue);

  return (
    <Flex align="end">
      <FormControl isRequired>
        <FormLabel>
          {icon}
          <Text as="span" ml="2">
            {label}
          </Text>
        </FormLabel>
        <Input
          onChange={(e) => {
            setName(e.target.value || "");
          }}
          value={name}
        />
      </FormControl>
      <IconButton
        aria-label="Submit"
        icon={<CheckIcon />}
        onClick={() => {
          onSubmit(name);
          toggleShowForm(false);
        }}
        isDisabled={!name}
        size="sm"
        type="submit"
        mx="2"
        my="2"
      />
      <IconButton
        aria-label="Cancel"
        onClick={() => {
          toggleShowForm(false);
        }}
        icon={<XMarkIcon />}
        size="sm"
        my="2"
      />
    </Flex>
  );
}
