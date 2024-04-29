import React, { ReactNode, useState } from "react";
import { HStack, IconButton, Input } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function FileNameForm({
  onSubmit,
  toggleShowForm,
  initialValue = "",
  icon,
}: {
  onSubmit: (input: string) => void;
  toggleShowForm: (showForm: boolean) => void;
  initialValue?: string;
  icon?: ReactNode;
}) {
  const [name, setName] = useState(initialValue);
  return (
    <HStack>
      {icon}
      <Input
        id="name-input"
        onChange={(e) => {
          setName(e.target.value || "");
        }}
        value={name}
      />
      <IconButton
        aria-label="Submit"
        icon={<CheckIcon />}
        onClick={() => {
          onSubmit(name);
          toggleShowForm(false);
        }}
        isDisabled={!name}
        type="submit"
      />
      <IconButton
        aria-label="Cancel"
        onClick={() => {
          toggleShowForm(false);
        }}
        icon={<CloseIcon />}
      />
    </HStack>
  );
}
