import * as dotenv from "dotenv";

export interface ServiceConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  APP_URL: string;
  REALM: string;
  LOGIN_URL: string;
  IDP_URL: string;
  USER: string;
  PASSWORD: string;
  FRONTEND_URL: string;
  IS_PKCE_ENABLED: boolean;
}

export function configFromEnv(): ServiceConfig {
  dotenv.config();

  return {
    APP_URL: process.env.APP_URL || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "",
    CLIENT_SECRET: process.env.CLIENT_SECRET || "",
    CLIENT_ID: process.env.CLIENT_ID || "",
    REALM: process.env.REALM || "",
    IDP_URL: process.env.IDP_URL || "",
    LOGIN_URL: process.env.LOGIN_URL || "",
    USER: process.env.USER || "",
    PASSWORD: process.env.PASSWORD || "",
    IS_PKCE_ENABLED: (process.env.PKCE || "") === "1",
  };
}
