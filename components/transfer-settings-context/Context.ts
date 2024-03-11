import { createContext } from "react";
import { Dispatcher, initialState } from "./reducer";

export const TransferSettingsContext = createContext(initialState);
export const TransferSettingsDispatchContext = createContext<Dispatcher>(
  () => {},
);
