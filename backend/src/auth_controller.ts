import * as dotenv from "dotenv";
import { Request, Response } from "express";
import crypto, { verify } from "crypto";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
const APP_URL = process.env.APP_URL || "";
const REALM = process.env.REALM || "";
const IDP_URL = process.env.IDP_URL || "";
const USER = process.env.AUTH_USER || "";
const PASSWORD = process.env.PASSWORD || "";
const PKCE = process.env.PKCE || "";

let CODE_VERIFIER: string | null;
const FRONTEND_URL = "http://localhost:3000";
let TOKEN_RESPONSE: Record<string, unknown>;

const PKCE_ENABLED = "1";

if (PKCE === PKCE_ENABLED) {
  console.log("PKCE is Enabled");
} else {
  console.log("PKCE is Disabled");
}

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

type Grant =
  | "authorization_code"
  | "password"
  | "implicit"
  | "client_credentials"
  | "refresh_token";

function isString(arg: unknown): arg is string {
  return typeof arg === "string";
}

export const implicitFlowPage = async (_req: Request, res: Response) => {
  res.send(
    `<script>var type = window.location.hash.substring(1); alert(type);</script>`,
  );
};

export const exchangeCode = async (req: Request, res: Response) => {
  const code = req.query.code;

  if (isString(code)) {
    const exchangeReq = exchangeCodeRequest(code);
    TOKEN_RESPONSE = (await fetch(exchangeReq).then(
      (response: globalThis.Response) => response.json(),
    )) as Record<string, unknown>;

    console.log("----------------## TOKEN RESPONSE ##----------------");
    console.log(JSON.stringify(TOKEN_RESPONSE, null, 3));
    console.log("--------------## END TOKEN RESPONSE ##--------------");
    return res.redirect(
      `${FRONTEND_URL}/auth/code/redirect?access_token=${TOKEN_RESPONSE.access_token}&code=${code}&verifier=${CODE_VERIFIER}&challenge=${challengeFromVerifier(<string>CODE_VERIFIER)}`,
    );
  }
  res.status(400).send("Invalid code");
};

export const redirectToIdentityProviderImplicit = async (
  _req: Request,
  res: Response,
) => {
  redirectToIdentityProvider(res, "implicit");
};

export const redirectToIdpStandard = (_req: Request, res: Response) => {
  redirectToIdentityProvider(res, "authorization_code");
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

const redirectToIdentityProvider = (
  res: Response,
  grant_type: "authorization_code" | "implicit",
) => {
  let authUrl = new URL(
    `${IDP_URL}/realms/${REALM}/protocol/openid-connect/auth`,
  );

  const searchParams = authUrl.searchParams;
  searchParams.append("client_id", CLIENT_ID);

  if (grant_type === "authorization_code") {
    if (PKCE === PKCE_ENABLED) {
      CODE_VERIFIER = createRandomPckeVerifier();
      searchParams.set("code_challenge_method", "S256");
      searchParams.set("code_challenge", challengeFromVerifier(CODE_VERIFIER));
    }
    searchParams.set("response_type", "code");
    searchParams.set("redirect_uri", `${APP_URL}/auth/redirect/code`);
  } else {
    searchParams.set("response_type", "token");
    searchParams.set("redirect_uri", `${FRONTEND_URL}/auth/implicit/redirect`);
  }

  res.redirect(authUrl.toString());
};

const exchangeCodeRequest = (code: string): globalThis.Request => {
  const redirect_uri = `${APP_URL}/auth/redirect/code` as const;

  console.log("----------------## AUTHENTICATION CODE ##----------------");
  console.log(code);
  console.log("--------------## END AUTHENTICATION CODE ##--------------");

  const grant: Grant = "authorization_code";
  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", grant);
  searchParams.append("client_id", CLIENT_ID);
  searchParams.append("client_secret", CLIENT_SECRET);
  searchParams.append("redirect_uri", redirect_uri);
  searchParams.append("code", code);

  if (isString(CODE_VERIFIER) && PKCE === PKCE_ENABLED) {
    searchParams.append("code_verifier", CODE_VERIFIER);
  }

  return new Request(
    `${IDP_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      body: searchParams,
    },
  );
};
const refreshTokenRequest = (refreshToken: string): globalThis.Request => {
  const redirect_uri = `${APP_URL}/auth/redirect/code` as const;

  const grant: Grant = "refresh_token";
  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", grant);
  searchParams.append("client_id", CLIENT_ID);
  searchParams.append("client_secret", CLIENT_SECRET);
  searchParams.append("redirect_uri", redirect_uri);
  searchParams.append("refresh_token", refreshToken);

  return new Request(
    `${IDP_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      body: searchParams,
    },
  );
};

export const requestTokenDirect = async (_req: Request, res: Response) => {
  const url = `${IDP_URL}/realms/${REALM}/protocol/openid-connect/token`;
  const grant: Grant = "password";

  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", grant);
  searchParams.append("password", PASSWORD);
  searchParams.append("client_id", CLIENT_ID);
  searchParams.append("client_secret", CLIENT_SECRET);
  searchParams.append("username", USER);

  const request = new Request(url, {
    method: "POST",
    body: searchParams,
  });

  const response = await fetch(request)
    .then((response) => response.json())
    .then((response) => response);

  res.send(response);
};

export const requestTokenForClient = async (_req: Request, res: Response) => {
  const url = `${IDP_URL}/realms/${REALM}/protocol/openid-connect/token`;
  const grant: Grant = "client_credentials";

  const searchParams = new URLSearchParams();
  searchParams.append("grant_type", grant);
  searchParams.append("client_id", CLIENT_ID);
  searchParams.append("client_secret", CLIENT_SECRET);

  const request = new Request(url, {
    method: "POST",
    body: searchParams,
  });

  const response = await fetch(request)
    .then((response) => response.json())
    .then((response) => response);

  res.send(response);
};
