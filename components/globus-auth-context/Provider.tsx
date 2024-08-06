import React, {
  useState,
  useReducer,
  useEffect,
  type PropsWithChildren,
} from "react";

import Context from "./Context";
import { initialState } from "./GlobusAuthState";
import { reducer } from "./reducer";

import { authorization } from "@globus/sdk/cjs";

export const GlobusAuthorizationManagerProvider = ({
  redirect,
  scopes,
  client,
  children,
}: PropsWithChildren<{
  redirect: string;
  scopes: string;
  client: string;
}>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [instance, setInstance] = useState<
    ReturnType<typeof authorization.create> | undefined
  >(undefined);

  const handleAuthenticated = ({
    isAuthenticated,
  }: {
    isAuthenticated: boolean;
  }) => {
    dispatch({ type: "AUTHENTICATED", payload: isAuthenticated });
  };

  const handleRevoke = () => {
    dispatch({ type: "REVOKE" });
  };

  useEffect(() => {
    const i = authorization.create({
      redirect,
      scopes,
      client,
      useRefreshTokens: true,
      events: {
        authenticated: handleAuthenticated,
        revoke: handleRevoke,
      },
    });

    setInstance(i);

    return () => {
      i.events.revoke.removeListener(handleRevoke);
      i.events.authenticated.removeListener(handleAuthenticated);
    };
  }, [redirect, scopes, client]);

  return (
    <Context.Provider
      value={{
        ...state,
        authorization: instance,
        events: instance?.events,
      }}
    >
      {children}
    </Context.Provider>
  );
};
