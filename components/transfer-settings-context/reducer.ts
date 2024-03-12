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
  destination: null,
  destination_path: null,
  items: [],
};

export type Dispatcher = (action: Action) => void;

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
      return { ...state, destination: action.payload };
    }
    case "SET_DESTINATION_PATH": {
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
