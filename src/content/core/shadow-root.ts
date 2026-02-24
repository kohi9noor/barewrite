import { BareWrite } from "./barewrite";

export function setupShadowRoot() {
  const existingHost = document.getElementById("barewrite");

  const host =
    existingHost instanceof BareWrite ? existingHost : new BareWrite();

  host.id = "barewrite";

  if (!host.isConnected) {
    const rootParent = document.documentElement || document.body;
    rootParent.appendChild(host);
  }

  const mountPoint = host.shadowRoot!.getElementById("mount-point");
  if (mountPoint) {
    mountPoint.setAttribute(
      "style",
      "position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",
    );
  }

  return { host, mountPoint };
}
