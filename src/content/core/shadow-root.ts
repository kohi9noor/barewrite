import { BareWrite } from "./barewrite";

export function setupShadowRoot() {
  const host = new BareWrite();
  host.id = "barewrite";
  document.body.appendChild(host);
  return host.shadowRoot!.getElementById("mount-point");
}
