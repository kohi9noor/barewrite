import "./style/main.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setupShadowRoot } from "./core/shadow-root";
import App from "./app";
const container = setupShadowRoot()!;
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
