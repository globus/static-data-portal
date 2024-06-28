import { FileDocument } from "@globus/sdk/cjs/lib/services/transfer/service/file-operations";

type Action = { type: string; payload?: any };
type State = {
  source: Record<string, any> | null;
  source_path: string | null;
  destination: Record<string, any> | null;
  destination_path: string | null;
  items: FileDocument[];
};

export const initialState: State = {
  source: null,
  source_path: null,
  destination: JSON.parse(
    globalThis?.sessionStorage?.getItem?.("destination") ?? "null",
  ),
  destination_path:
    globalThis?.sessionStorage?.getItem?.("destination_path") ?? null,
  items: [],
};

export type Dispatcher = (action: Action) => void;

// This function is used to persist the destination and destination_path
// values in sessionStorage but could be extended to any State value that
// needs to be persisted by calling it in the reducer for that value.
function persistStateValues(key: keyof State, value: State[keyof State]) {
  if (!globalThis) return;

  if (value === null || value === undefined) {
    globalThis.sessionStorage.removeItem(key);
    return;
  }
  globalThis.sessionStorage.setItem(key, JSON.stringify(value));
}

export default function transferSettingsReducer(
  state: State,
  action: Action,
): State {
  switch (action.type) {
    case "SET_SOURCE": {
      return { ...state, source: action.payload };
    }
    case "SET_SOURCE_PATH": {
      return { ...state, source_path: action.payload };
    }
    case "SET_DESTINATION": {
      persistStateValues("destination", action.payload);
      return { ...state, destination: action.payload };
    }
    case "SET_DESTINATION_PATH": {
      persistStateValues("destination_path", action.payload);
      return { ...state, destination_path: action.payload };
    }
    case "RESET_ITEMS": {
      return { ...state, items: [] };
    }
    case "ADD_ITEM": {
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item !== action.payload),
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
