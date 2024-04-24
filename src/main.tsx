import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.scss";

// biome-ignore lint/style/noNonNullAssertion: the root will always be defined since we set it in the html document
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

