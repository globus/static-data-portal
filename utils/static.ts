import _STATIC from "../static.json";

type Base = {
  _static: {
    generator: {
      name: string;
    };
    /**
     * GitHub Action-injected environment variables.
     * @see https://github.com/from-static/actions
     */
    host?: {
      base_url: string;
      origin: string;
      host: string;
      base_path: string;
    };
  };
  data: {
    version: string;
    attributes: Record<string, unknown>;
  };
};

type Data = {
  version: string;
  attributes: {
    content: {
      title: string;
      privacy_policy: string;
      terms_of_service: string;
    };
    globus: {
      application: {
        client_id: string;
        /**
         * The redirect URI for the Globus Auth login page.
         * If not provided, defaults to `{host}/authenticate`.
         */
        redirect_uri?: string;
      };
      transfer: {
        collection_id: string;
        path?: string;
      };
    };
  };
};

type Static = Base & {
  data: Data;
};

/**
 * Reference to the `static.json` file.
 */
export const STATIC: Static = _STATIC;

const {
  data: { attributes },
} = STATIC;

/**
 * @returns The redirect URI for the Globus Auth login page.
 */
export function getRedirectUri() {
  /**
   * If the `redirect_uri` is specified in the `static.json`, use it.
   */
  if (attributes.globus.application?.redirect_uri) {
    return attributes.globus.application.redirect_uri;
  }
  /**
   * If this is a static-managed deployment, use the `base_url` from the `static.json`.
   */
  if (STATIC._static.host?.base_url) {
    return `${STATIC._static.host?.base_url}/authenticate`;
  }
  /**
   * If all else fails, try to construct the redirect URI from the current location.
   * The fallback here is mostly to account for SSR.
   * @todo This could likely be configured to get `basePath` and host information for the Next.js configuration or environment.
   */
  const baseURL = globalThis.location
    ? `${globalThis.location.protocol}//${globalThis.location.host}`
    : "";
  return `${baseURL}/authenticate`;
}
