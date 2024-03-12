type Action = { type: string; payload?: any };
type State = {
  view: {
    columns: string[];
    show_hidden: boolean;
  };
};

export const initialState: State = {
  view: {
    show_hidden: false,
    columns: ["name", "last_modified", "size"],
  },
};

export type Dispatcher = (action: Action) => void;

export default function fileBrowserReducer(
  state: State,
  action: Action,
): State {
  switch (action.type) {
    case "SET_VIEW_COLUMNS": {
      return {
        ...state,
        view: {
          ...state.view,
          columns: action.payload,
        },
      };
    }
    case "SET_VIEW_SHOW_HIDDEN": {
      return {
        ...state,
        view: {
          ...state.view,
          show_hidden: action.payload,
        },
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
