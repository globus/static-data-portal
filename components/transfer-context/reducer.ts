type Action = { type: string; payload: any };
type State = {
  source: string;
  source_path: string;
  destination: string;
  destination_path: string;
  items: string[];
};

export default function transferReducer(state: State, action: Action) {
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
