import React, { useEffect, useState } from "react";
import {
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";

type Path = string;

export default function PathInput({
  initialPath,
  onPathChange,
}: {
  initialPath: Path;
  onPathChange: (path: Path) => void;
}) {
  const [path, setPath] = useState<Path>(initialPath);

  useEffect(() => {
    setPath(initialPath);
  }, [initialPath]);

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerPathChange();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.currentTarget.value);
  };

  const triggerPathChange = () => {
    onPathChange(path);
  };

  const hasChanged = path !== initialPath;

  return (
    <InputGroup>
      <InputLeftAddon>Path</InputLeftAddon>
      <Input
        pr="4rem"
        value={path}
        onChange={handleChange}
        onKeyDown={handleKeydown}
      />

      {hasChanged && (
        <InputRightElement width="4rem">
          <Button size="xs" onClick={triggerPathChange}>
            GO
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
}
