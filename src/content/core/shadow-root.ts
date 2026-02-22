import { BareWrite } from "./barewrite";

export function setupShadowRoot() {
  const existingHost = document.getElementById("barewrite");
  const host =
    existingHost instanceof BareWrite ? existingHost : new BareWrite();

  host.id = "barewrite";
  host.style.setProperty("all", "initial");
  host.style.setProperty("position", "fixed");
  host.style.setProperty("inset", "0");
  host.style.setProperty("z-index", "2147483647");
  host.style.setProperty("contain", "layout style paint");
  host.style.setProperty("isolation", "isolate");
  host.style.setProperty("pointer-events", "none");

  if (!host.isConnected) {
    const rootParent = document.documentElement || document.body;
    rootParent.appendChild(host);
  }

  const mountPoint = host.shadowRoot!.getElementById("mount-point");
  if (mountPoint) {
    mountPoint.setAttribute(
      "style",
      "all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",
    );
  }

  return { host, mountPoint };
}
