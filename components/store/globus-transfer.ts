import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { FileDocument } from "@globus/sdk/services/transfer/service/file-operations";

type Endpoint = Record<string, any>;

type State = {
  items: FileDocument[];
  source?: Endpoint | null;
  source_path?: string | null;
  destination?: Endpoint | null;
  destination_path?: string | null;
};

type Actions = {
  setDestination: (destination: Endpoint | null) => void;
  setDestinationPath: (path: string | null) => void;
  setSource: (source: Endpoint | null) => void;
  setSourcePath: (path: string | null) => void;
  removeItem: (item: FileDocument) => void;
  addItem: (item: FileDocument) => void;
  reset: () => void;
  resetItems: () => void;
  resetDestination: () => void;
};

const initialState = {
  items: [],
  transfer: undefined,
};

export const useGlobusTransferStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setDestination: (destination: Endpoint | null) => {
        return set((state) => ({
          ...state,
          destination,
        }));
      },
      setDestinationPath: (path: string | null) => {
        return set((state) => ({
          ...state,
          destination_path: path,
        }));
      },
      setSource: (source: Endpoint | null) => {
        return set((state) => ({
          ...state,
          source,
        }));
      },
      setSourcePath: (path: string | null) => {
        return set((state) => ({
          ...state,
          source_path: path,
        }));
      },
      addItem: (item) => {
        return set((state) => ({
          ...state,
          items: [...state.items, item],
        }));
      },
      removeItem: (item) => {
        return set((state) => ({
          ...state,
          items: state.items.filter((i) => i.name !== item.name),
        }));
      },
      resetDestination: () => {
        return set((state) => ({
          ...state,
          destination: undefined,
          destination_path: undefined,
        }));
      },
      resetItems: () => {
        return set((state) => ({
          ...state,
          items: [],
        }));
      },
      reset: () => {
        return set(initialState);
      },
    }),
    {
      name: "globus-transfer",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
