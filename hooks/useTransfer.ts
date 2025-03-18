import { useQuery } from "@tanstack/react-query";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { type AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

/**
 * Used to wrap @globus/sdk methods to ensure HTTP encountered errors throw a rejected promise.
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
 */
async function dispatch<R extends Response>(
  request: Promise<R>,
): Promise<Awaited<ReturnType<R["json"]>>> {
  const response = await request;
  if (response.ok) {
    return await response.json();
  }
  throw await response.json();
}

async function fetchCollection(
  authorization: AuthorizationManager | undefined,
  id: string,
) {
  return await dispatch(
    transfer.endpoint.get(id, {}, { manager: authorization }),
  );
}

/**
 * @see https://docs.globus.org/api/transfer/endpoints_and_collections/#endpoint_or_collection_document
 */
export type Collection = Awaited<
  ReturnType<Awaited<ReturnType<typeof transfer.endpoint.get>>["json"]>
>;

export function useCollection(
  id: string,
  placeholderData?: Partial<Collection>,
) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["collections", id],
    queryFn: async () => await fetchCollection(auth.authorization, id),
    // placeholderData,
  });
}

export function useEndpointSearch(query = {}) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["endpoints", "search", JSON.stringify(query)],
    queryFn: async () => {
      return await dispatch(
        transfer.endpointSearch(
          {
            query,
          },
          {
            manager: auth.authorization,
          },
        ),
      );
    },
  });
}

async function ls(
  authorization: AuthorizationManager | undefined,
  id: string,
  path?: string,
  options: Parameters<typeof transfer.fileOperations.ls>[1] = {},
) {
  return await dispatch(
    transfer.fileOperations.ls(
      id,
      { query: { path, ...options.query } },
      { manager: authorization },
    ),
  );
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
    queryFn: async () => await ls(auth.authorization, id, path, options),
  });
}

export function useCollectionBookmarks() {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["bookmarks"],
    queryFn: async () => {
      return await dispatch(
        transfer.collectionBookmarks.getAll(
          {},
          {
            manager: auth.authorization,
          },
        ),
      );
    },
  });
}
