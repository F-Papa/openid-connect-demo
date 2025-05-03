import "./index.css";
import Home from "./home/Home";
import Standard from "./standard/Standard";
import Implicit from "./implicit/Implicit";
import ImplicitRedirect from "./implicit/Redirect";
import CodeRedirect from "./standard/Redirect";

import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";

export const BACKEND_URL = "http://localhost:4000";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/auth/code",
    Component: Standard,
  },
  {
    path: "/auth/code/redirect",
    Component: CodeRedirect,
  },
  {
    path: "/auth/implicit",
    Component: Implicit,
  },
  {
    path: "/auth/implicit/redirect",
    Component: ImplicitRedirect,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
