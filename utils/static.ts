import _STATIC from "../static.json";
import { ThemeSettings } from "@/theme";

/**
 * The base type for a `static.json` file.
 */
export type Base = {
  _static: {
    generator: {
      /**
       * The name of the generator used to build the `static.json` file.
       * This should be a reference to the package name of the generator.
       * @example "@globus/static-data-portal"
       */
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

/**
 * The type used for `data` by the [@globus/static-data-portal generator](https://github.com/globus/static-data-portal).
 */
export type Data = {
  /**
   * The version of the `data` object, which is used to determine how
   * the generator will render its `attributes`.
   * @example "1.0.0"
   */
  version: string;
  attributes: {
    theme?: ThemeSettings;
    content: {
      /**
       * The title of the research data portal.
       */
      title: string;
      /**
       * A privacy policy to be rendered at `/privacy-policy`.
       * This is especially useful for associating the published URL with your registered Globus Auth application.
       */
      privacy_policy?: string;
      /**
       * Terms and conditions to be rendered at `/terms-and-conditions`.
       * This is especially useful for associating the published URL with your registered Globus Auth application.
       */
      terms_of_service?: string;
      /**
       * The URL of the portal's header image.
       */
      image?: string;
      tagline?: string;
    };
    globus: {
      /**
       * The Globus platform environment.
       * @private
       */
      environment?: string;
      /**
       * Information about your registered Globus Auth Application (Client)
       * @see https://docs.globus.org/api/auth/developer-guide/#developing-apps
       */
      application: {
        /**
         * The UUID of the client application.
         */
        client_id: string;
        /**
         * The redirect URI for the Globus Auth login page to complete the OAuth2 flow.
         * The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback.
         * To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host.
         * @example "https://example.com/data-portal/authenticate"
         */
        redirect_uri?: string;
      };
      /**
       * Configuration for Transfer-related functionality in the portal.
       */
      transfer: {
        /**
         * The UUID of the Globus collection to list and transfer files from.
         */
        collection_id: string;
        /**
         * The path on the collection to list and transfer files from.
         */
        path?: string;
      };
    };
  };
};

export type Static = Base & {
  data: Data;
};

/**
 * Reference to the `static.json` file.
 * @private
 */
export const STATIC: Static = _STATIC;

const {
  data: { attributes },
} = STATIC;

export function getEnvironment() {
  return attributes.globus.environment || null;
}

/**
 * @returns The redirect URI for the Globus Auth login page.
 * @private
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
