import React, { ReactNode, useState } from "react";
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Icon,
  HStack,
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
    <form
      onSubmit={() => {
        onSubmit(name);
        toggleShowForm(false);
      }}
    >
      <HStack>
        {icon}
        <FormControl variant="floating" isRequired>
          <Input
            onChange={(e) => {
              setName(e.target.value || "");
            }}
            value={name}
            placeholder=" "
          />
          <FormLabel>{label}</FormLabel>
        </FormControl>
        <IconButton
          aria-label="Submit"
          icon={<Icon as={CheckIcon} />}
          isDisabled={!name}
          size="sm"
          type="submit"
        />
        <IconButton
          aria-label="Cancel"
          onClick={() => {
            toggleShowForm(false);
          }}
          icon={<Icon as={XMarkIcon} />}
          size="sm"
          colorScheme="gray"
        />
      </HStack>
    </form>
  );
}
