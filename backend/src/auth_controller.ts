import { Request, Response } from "express";
import assert from "assert";
import crypto from "crypto";
import { configFromEnv } from "./load-config";
import { GRANT_TYPE } from "./types";
import { isString, logWithEmphasis } from "./utils";

// NOTE: Code verifier and is stored in a global variable for the sake of example.
// This would not work with concurrent login attempts
let CODE_VERIFIER: string | null;
let TOKEN_RESPONSE: Record<string, unknown>;

const config = configFromEnv();

const createRandomPckeVerifier = () =>
  crypto
    .randomBytes(64)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

/** Creates a PCKE challenge from the verifier by hashing it */
const challengeFromVerifier = (ver: string): string =>
  crypto
    .createHash("sha256")
    .update(ver)
    .digest("base64")
    .replace(/\+/g, "-") // URL-safe Base64
    .replace(/\//g, "_")
    .replace(/=/g, "");

export const getAccessTokenFromCode = async (req: Request, res: Response) => {
  const code = req.query.code;

  if (!isString(code)) {
    res.status(400).send("Invalid code");
  }
  const tokenResponse = await exchangeCode(<string>code);
  logWithEmphasis("token response", tokenResponse);

  assert(isString(CODE_VERIFIER));

  const redirectUrl = new URL(`${config.FRONTEND_URL}/auth/code/redirect`);
  const searchParams = redirectUrl.searchParams;

  searchParams.set("access_token", <string>tokenResponse.access_token);

  // NOTE: These three params are of no longer use.
  // They are only sent to the frontend to visualize them for demonstration purposes.
  searchParams.set("code", <string>code);
  searchParams.set("verifier", CODE_VERIFIER);
  searchParams.set("challenge", challengeFromVerifier(CODE_VERIFIER));

  return res.redirect(redirectUrl.toString());
};

const exchangeCode = async (code: string): Promise<Record<string, unknown>> => {
  const exchangeReq = codeExchangeRequest(<string>code);
  const response = await fetch(exchangeReq).then((response) => response.json());
  return response as Record<string, unknown>;
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken: unknown = req.query.refresh_token;
  if (isString(refreshToken)) {
    const refreshReq = refreshTokenRequest(refreshToken);
    TOKEN_RESPONSE = (await fetch(refreshReq).then((response) =>
      response.json(),
    )) as Record<string, unknown>;

    return res.send(TOKEN_RESPONSE);
  }
  res.status(400).send("Invalid Code");
};

export const redirectToIdentityProviderLogin = (
  res: Response,
  grant_type: GRANT_TYPE,
) => {
  let authUrl = new URL(
    `${config.LOGIN_URL}/realms/${config.REALM}/protocol/openid-connect/auth`,
  );

  const searchParams = authUrl.searchParams;
  searchParams.append("client_id", config.CLIENT_ID);

  if (grant_type === GRANT_TYPE.AUTHORIZATION_CODE) {
    if (config.IS_PKCE_ENABLED) {
      CODE_VERIFIER = createRandomPckeVerifier();
      searchParams.set("code_challenge_method", "S256");
      searchParams.set("code_challenge", challengeFromVerifier(CODE_VERIFIER));
    }
    searchParams.set("response_type", "code");
    searchParams.set("redirect_uri", `${config.APP_URL}/auth/redirect/code`);
  } else {
    searchParams.set("response_type", "token");
    searchParams.set(
      "redirect_uri",
      `${config.FRONTEND_URL}/auth/implicit/redirect`,
    );
  }

  res.redirect(authUrl.toString());
};

const codeExchangeRequest = (code: string): globalThis.Request => {
  const redirectUri = `${config.APP_URL}/auth/redirect/code` as const;

  logWithEmphasis("authentication code", code);

  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", GRANT_TYPE.AUTHORIZATION_CODE);
  searchParams.append("client_id", config.CLIENT_ID);
  searchParams.append("client_secret", config.CLIENT_SECRET);
  searchParams.append("redirect_uri", redirectUri);
  searchParams.append("code", code);

  if (config.IS_PKCE_ENABLED) {
    assert(isString(CODE_VERIFIER));
    searchParams.append("code_verifier", CODE_VERIFIER);
  }

  const requestUrl = `${config.IDP_URL}/realms/${config.REALM}/protocol/openid-connect/token`;
  return new Request(requestUrl, { method: "POST", body: searchParams });
};
const refreshTokenRequest = (refreshToken: string): globalThis.Request => {
  const redirectUri = `${config.APP_URL}/auth/redirect/code` as const;

  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", GRANT_TYPE.REFRESH_TOKEN);
  searchParams.append("client_id", config.CLIENT_ID);
  searchParams.append("client_secret", config.CLIENT_SECRET);
  searchParams.append("redirect_uri", redirectUri);
  searchParams.append("refresh_token", refreshToken);

  const requestUrl = `${config.IDP_URL}/realms/${config.REALM}/protocol/openid-connect/token`;
  return new Request(requestUrl, { method: "POST", body: searchParams });
};

export const requestTokenDirect = async (_req: Request, res: Response) => {
  const url = `${config.IDP_URL}/realms/${config.REALM}/protocol/openid-connect/token`;

  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", GRANT_TYPE.PASSWORD);
  searchParams.append("password", config.PASSWORD);
  searchParams.append("client_id", config.CLIENT_ID);
  searchParams.append("client_secret", config.CLIENT_SECRET);
  searchParams.append("username", config.USER);

  const request = new Request(url, { method: "POST", body: searchParams });
  const response = await fetch(request).then((response) => response.json());

  res.send(response);
};

export const requestTokenForClient = async (_req: Request, res: Response) => {
  const url = `${config.IDP_URL}/realms/${config.REALM}/protocol/openid-connect/token`;

  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", GRANT_TYPE.CLIENT_CREDENTIALS);
  searchParams.append("client_id", config.CLIENT_ID);
  searchParams.append("client_secret", config.CLIENT_SECRET);

  const request = new Request(url, { method: "POST", body: searchParams });
  const response = await fetch(request).then((response) => response.json());

  res.send(response);
};
