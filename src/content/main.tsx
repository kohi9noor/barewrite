import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setupShadowRoot } from "./core/shadow-root";
import App from "./app";

const { host, mountPoint } = setupShadowRoot();

if (!mountPoint) {
  throw new Error("Barewrite mount point was not found in shadow root.");
}

createRoot(mountPoint).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const observer = new MutationObserver(() => {
  if (!host.isConnected) {
    const rootParent = document.documentElement || document.body;
    rootParent.appendChild(host);
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
