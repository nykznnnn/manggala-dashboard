import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";

import {
  ClientsProvider,
} from "./context/ClientsContext";

import AuthProvider from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ClientsProvider>
          <App />
        </ClientsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);