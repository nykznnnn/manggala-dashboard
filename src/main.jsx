import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ClientsProvider } from "./context/ClientsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClientsProvider>
      <App />
    </ClientsProvider>
  </React.StrictMode>
);