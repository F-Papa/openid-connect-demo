import express from "express";

import dotenv from "dotenv";
import {
  requestTokenDirect,
  requestAccessToken,
  implicitFlowPage,
  requestTokenForClient,
  redirectToIdpStandard,
  redirectToIdpImplicit,
} from "./auth_controller";

dotenv.config();

const PORT = process.env.PORT || "";

const app = express();

//region: Auth

app.get("/auth/code", redirectToIdpStandard); // Authentication Code (Standard) Flow

app.get("/auth/implicit", redirectToIdpImplicit); // Implicit Flow

app.get("/auth/direct", requestTokenDirect); // Password Flow

app.get("/auth/client", requestTokenForClient); // Client Credentials Flow

//region: Redirects

app.get("/auth/redirect/implicit", implicitFlowPage); // Redirect for Implicit Flow

app.get("/auth/redirect/code", requestAccessToken); // Redirect for Authorization Code Flow

app.listen(PORT, () => {
  console.log("Started on port", PORT);
});
