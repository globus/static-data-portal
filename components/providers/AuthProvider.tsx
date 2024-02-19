import React from "react";
import { AuthProvider as ReactOIDCAuthProvider } from "react-oidc-context";
import { CONFIG as AUTH_CONFIG } from "@globus/sdk/esm/lib/services/auth";

import STATIC from "@/static.json";

/**
 * @todo Once <Globus Auth>/.well-known/openid-configuration is updated to support
 * CORS we should be able to source this information from there.
 */
const metadata = {
  issuer: `https://${AUTH_CONFIG.HOSTS.production}`,
  authorization_endpoint: `https://${AUTH_CONFIG.HOSTS.production}/v2/oauth2/authorize`,
  userinfo_endpoint: `https://${AUTH_CONFIG.HOSTS.production}/v2/oauth2/userinfo`,
  token_endpoint: `https://${AUTH_CONFIG.HOSTS.production}/v2/oauth2/token`,
  revocation_endpoint: `https://${AUTH_CONFIG.HOSTS.production}/v2/oauth2/token/revoke`,
  jwks_uri: `https://${AUTH_CONFIG.HOSTS.production}/jwk.json`,
  response_types_supported: ["code", "token", "token id_token", "id_token"],
  id_token_signing_alg_values_supported: ["RS512"],
  scopes_supported: ["openid", "email", "profile"],
  token_endpoint_auth_methods_supported: ["client_secret_basic"],
  claims_supported: [
    "at_hash",
    "aud",
    "email",
    "exp",
    "name",
    "nonce",
    "preferred_username",
    "iat",
    "iss",
    "sub",
  ],
  subject_types_supported: ["public"],
};

const OIDC_CONFIG = {
  authority: `https://${AUTH_CONFIG.HOSTS.production}`,
  client_id: STATIC.globus.application.client_id,
  redirect_uri: STATIC.globus.application.redirect_uri,
  metadata,
};

export default function AuthProvider({ ...props }) {
  return <ReactOIDCAuthProvider {...OIDC_CONFIG} {...props} />;
}
