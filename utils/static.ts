import _STATIC from "../static.json";
import getConfig from "next/config";

type Static = {
  _static: {
    generator: string;
  };
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
    };
  };
};

/**
 * Reference to the `static.json` file.
 */
export const STATIC: Static = _STATIC;

const config = getConfig();
/**
 * @returns The redirect URI for the Globus Auth login page.
 */
export function getRedirectUri() {
  /**
   * If the `redirect_uri` is specified in the `static.json`, use it.
   */
  if (STATIC.globus.application?.redirect_uri) {
    return STATIC.globus.application.redirect_uri;
  }
  /**
   * If Next.js is configured with a `basePath`, make sure it is included.
   */
  const path = (config.basePath ?? "") + "/authenticate";
  if (!globalThis.location) {
    /**
     * Accounts for SSR...
     */
    return path;
  }
  return `${globalThis.location.protocol}//${globalThis.location.host}${path}`;
}
