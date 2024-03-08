import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  type PropsWithChildren,
} from "react";

import Context from "./Context";
import { initialState } from "./GlobusAuthState";
import { reducer } from "./reducer";

import { authorization, logger } from "@globus/sdk/cjs";

logger.setLogger(console);
logger.setLogLevel("debug");

export const Provider = ({
  redirectUri,
  requestedScopes,
  clientId,
  children,
}: PropsWithChildren<{
  redirectUri: string;
  requestedScopes: string;
  clientId: string;
}>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [instance, setInstance] = useState<ReturnType<
    typeof authorization.create
  > | null>(null);

  useEffect(() => {
    const instance = authorization.create({
      redirect_uri: redirectUri,
      requested_scopes: requestedScopes,
      client_id: clientId,
    });
    setInstance(instance);
  }, [redirectUri, requestedScopes, clientId]);

  const didInitialize = useRef(false);

  useEffect(() => {
    if (!instance || didInitialize.current) {
      return;
    }
    didInitialize.current = true;
    instance.handleCodeRedirect();
    /**
     * Bootstrap the context with the current authentication state.
     */
    if (instance.authenticated) {
      dispatch({ type: "AUTHENTICATED", payload: instance.authenticated });
    }
  }, [instance]);

  /**
   * Register event listeners for the authorization instance.
   */
  useEffect(() => {
    if (!instance) return;

    const handleRevoke = () => {
      dispatch({ type: "REVOKE" });
    };

    instance.events.revoke.addListener(handleRevoke);

    const handleAuthenticated = ({
      isAuthenticated,
    }: {
      isAuthenticated: boolean;
    }) => {
      dispatch({ type: "AUTHENTICATED", payload: isAuthenticated });
    };
    // @ts-ignore

    instance.events.authenticated.addListener(handleAuthenticated);

    return () => {
      instance.events.revoke.removeListener(handleRevoke);
      // @ts-ignore

      instance.events.authenticated.removeListener(handleAuthenticated);
    };
  }, [instance]);

  return (
    <Context.Provider
      value={{
        ...state,
        // @ts-ignore
        authorization: instance,
        // @ts-ignore

        events: instance?.events,
      }}
    >
      {children}
    </Context.Provider>
  );
};
