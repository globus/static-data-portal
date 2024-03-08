import { useEffect } from "react";

import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";

/**
 * @todo
 */
export default function TokenListener() {
  const auth = useGlobusAuth();

  useEffect(() => {}, [auth.events]);

  return null;
}
