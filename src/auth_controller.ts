import * as dotenv from "dotenv";
import { Request, Response } from "express";
import crypto from "crypto";

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

const PKCE_ENABLED = "1";

if (PKCE === PKCE_ENABLED) {
  console.log("PKCE is Enabled");
} else {
  console.log("PKCE is Disabled");
}

const randomVerifier = () =>
  crypto
    .randomBytes(64)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

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

export const implicitFlowPage = async (req: Request, res: Response) => {
  res.send(
    `<script>var type = window.location.hash.substring(1); alert(type);</script>`
  );
};

export const exchangeCode = async (req: Request, res: Response) => {
  const code: unknown = req.query.code;

  if (isString(code)) {
    const exchangeReq = exchangeCodeRequest(code);
    const tokenResponse = await fetch(exchangeReq).then((response) =>
      response.json()
    );

    return res.send(tokenResponse);
  }
  res.status(400).send("Invalid code");
};

export const redirectToIdpImplicit = async (req: Request, res: Response) => {
  redirectToIdp(res, "implicit");
};

export const redirectToIdpStandard = (req: Request, res: Response) => {
  redirectToIdp(res, "authorization_code");
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken: unknown = req.query.refresh_token;
  if (isString(refreshToken)) {
    const refreshReq = refreshTokenRequest(refreshToken);
    const tokenResponse = await fetch(refreshReq).then((response) =>
      response.json()
    );

    return res.send(tokenResponse);
  }
  res.status(400).send("Invalid Code");
};

const redirectToIdp = (
  res: Response,
  grant_type: "authorization_code" | "implicit"
) => {
  let authUrl = new URL(
    `${IDP_URL}/realms/${REALM}/protocol/openid-connect/auth`
  );

  authUrl.searchParams.append("client_id", CLIENT_ID);

  if (grant_type === "authorization_code") {
    if (PKCE === PKCE_ENABLED) {
      CODE_VERIFIER = randomVerifier();
      authUrl.searchParams.append("code_challenge_method", "S256");
      authUrl.searchParams.append(
        "code_challenge",
        challengeFromVerifier(CODE_VERIFIER)
      );
    }

    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append(
      "redirect_uri",
      `${APP_URL}/auth/redirect/code`
    );
  } else {
    authUrl.searchParams.append("response_type", "token");
    authUrl.searchParams.append(
      "redirect_uri",
      `${APP_URL}/auth/redirect/implicit`
    );
  }

  res.redirect(authUrl.toString());
};

const exchangeCodeRequest = (code: string): globalThis.Request => {
  const redirect_uri = `${APP_URL}/auth/redirect/code` as const;

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
    }
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
    }
  );
};

export const requestTokenDirect = async (req: Request, res: Response) => {
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

export const requestTokenForClient = async (req: Request, res: Response) => {
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
