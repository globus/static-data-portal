import { useQuery } from "@tanstack/react-query";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { type AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

/**
 * Used to wrap `Response` objects returned from the @globus/sdk to
 * ensure HTTP encountered errors throw a rejected promise.
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
 */
async function handleResponse(response: Response) {
  if (response.ok) {
    return await response.json();
  }
  return Promise.reject(await response.json());
}

export async function fetchCollection(
  authorization: AuthorizationManager | undefined,
  id: string,
) {
  return handleResponse(
    await transfer.endpoint.get(id, {}, { manager: authorization }),
  );
}

/**
 * @see https://docs.globus.org/api/transfer/endpoints_and_collections/#endpoint_or_collection_document
 */
export type Collection = Awaited<ReturnType<typeof fetchCollection>>;

export function useCollection(id: string, placeholderData?: Collection) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["collections", id],
    queryFn: () => fetchCollection(auth.authorization, id),
    placeholderData,
  });
}

export function useEndpointSearch(query = {}) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["endpoints", "search", JSON.stringify(query)],
    queryFn: async () => {
      return handleResponse(
        await transfer.endpointSearch(
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
  return handleResponse(
    await transfer.fileOperations.ls(
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
    queryFn: () => ls(auth.authorization, id, path, options),
  });
}

export function useCollectionBookmarks() {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["bookmarks"],
    queryFn: async () => {
      return handleResponse(
        await transfer.collectionBookmarks.getAll(
          {},
          {
            manager: auth.authorization,
          },
        ),
      );
    },
  });
}
