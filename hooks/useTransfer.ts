import { useQuery } from "@tanstack/react-query";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { type AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

export async function fetchCollection(
  authorization: AuthorizationManager | undefined,
  id: string,
) {
  const response = await transfer.endpoint.get(
    id,
    {},
    { manager: authorization },
  );
  return response.json();
}

export function useCollection(id: string) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["collections", id],
    queryFn: () => fetchCollection(auth.authorization, id),
  });
}

async function ls(
  authorization: AuthorizationManager | undefined,
  id: string,
  path?: string,
  options: Parameters<typeof transfer.fileOperations.ls>[1] = {},
) {
  const response = await transfer.fileOperations.ls(
    id,
    {
      query: {
        path: path ?? undefined,
        ...(options?.query || {}),
      },
    },
    {
      manager: authorization,
    },
  );
  if (response.ok) {
    return await response.json();
  }
  let error;
  try {
    error = await response.json();
  } catch {}
  return Promise.reject(error);
}

export function useListDirectory(
  id: string,
  path?: string,
  options?: Parameters<typeof transfer.fileOperations.ls>[1],
) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["collections", id, "ls", path, options],
    queryFn: () => ls(auth.authorization, id, path, options),
  });
}
