import React, { useContext } from "react";

import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
} from "@chakra-ui/react";

import { FileBrowserContext, FileBrowserDispatchContext } from "./Context";

export default function FileBrowserViewMenu() {
  const state = useContext(FileBrowserContext);
  const dispatch = useContext(FileBrowserDispatchContext);
  return (
    <Menu closeOnSelect={false}>
      <MenuButton colorScheme="gray" as={Button} size="xs">
        View Settings
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          type="checkbox"
          defaultValue={[state.view.show_hidden ? "show_hidden" : ""]}
          onChange={(value) => {
            dispatch({
              type: "SET_VIEW_SHOW_HIDDEN",
              payload: value.includes("show_hidden"),
            });
          }}
        >
          <MenuItemOption value="show_hidden">Show Hidden Items</MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup
          title="Columns"
          type="checkbox"
          defaultValue={state.view.columns}
          onChange={(value) => {
            dispatch({ type: "SET_VIEW_COLUMNS", payload: value });
          }}
        >
          <MenuItemOption value="name" isDisabled>
            Name
          </MenuItemOption>
          <MenuItemOption value="last_modified">Last Modified</MenuItemOption>
          <MenuItemOption value="size">Size</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
