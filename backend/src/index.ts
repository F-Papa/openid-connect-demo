import express from "express";

import dotenv from "dotenv";
import {
  requestTokenDirect,
  requestTokenForClient,
  redirectToIdentityProviderLogin,
  refreshAccessToken,
  getAccessTokenFromCode,
} from "./auth_controller";
import { GRANT_TYPE } from "./types";

dotenv.config();

const PORT = process.env.PORT || "";

const app = express();

// region: Authentication Code (Standard) Flow
app.get("/auth/code", async (_res, res) =>
  redirectToIdentityProviderLogin(res, GRANT_TYPE.AUTHORIZATION_CODE),
);
app.get("/auth/redirect/code", getAccessTokenFromCode);

// region: Implicit Flow
app.get("/auth/implicit", async (_req, res) =>
  redirectToIdentityProviderLogin(res, GRANT_TYPE.IMPLICIT),
);

// NOTE: These flows have not been integrated with the frontend demo app yet.
app.get("/auth/direct", requestTokenDirect); // Password Flow
app.get("/auth/client", requestTokenForClient); // Client Credentials Flow
app.get("/auth/refresh", refreshAccessToken); // Refresh Token Flow

app.listen(PORT, () => {
  console.log("Started on port", PORT);
});
