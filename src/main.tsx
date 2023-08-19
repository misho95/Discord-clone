import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/homepage";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import ProtectedRout from "./protected.rout";
import Profile from "./pages/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRout>
        <HomePage />
      </ProtectedRout>
    ),
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
