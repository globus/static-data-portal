import React from "react";
import { TransferSettingsContext } from "./Context";

export const useTransferSettings = () => {
  return React.useContext(TransferSettingsContext);
};
