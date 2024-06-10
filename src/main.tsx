import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/providers/AuthProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
