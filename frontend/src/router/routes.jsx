import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import App from "../App";
import SubscribePage from "../pages/SubscribePage";

export const pages = [
  {
    path: "/",
    label: "Home",
    element: <LandingPage />,
  },
  {
    path: "/subscribe",
    label: "Subscribe",
    element: <SubscribePage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: pages,
  },
]);
