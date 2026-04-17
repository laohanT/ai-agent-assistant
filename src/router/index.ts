import React from "react";
import { createBrowserRouter, RouteProps } from "react-router-dom";
import App from "../App";
import AIChat from "../pages/aiChat";
import AIPdfChat from "../pages/aiPdfChat";
export const routes = [
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: AIChat,
        handle: {
          name: "AI智能助手",
        },
      },
      {
        path: "ai-pdf-chat",
        Component: AIPdfChat,
        handle: {
          name: "RAG 文档助手",
        },
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

export default router;
