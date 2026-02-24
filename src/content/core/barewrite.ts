import styleText from "../style/main.css?inline";

/**
 * @description
 * This is the custom element that will be used to create the shadow root for the react app.
 * It is defined as a class that extends HTMLElement and is registered as a custom element with the name "bare-write".
 */

export class BareWrite extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = styleText;

    /**
     *
     * The mount point is where the react app will be rendered.
     * its a div element with id "mount-point" that is appended to the shadow root.
     *
     */
    const mountPoint = document.createElement("div");

    mountPoint.id = "mount-point";

    shadow.appendChild(style);

    shadow.appendChild(mountPoint);
  }
}

if (!customElements.get("bare-write")) {
  customElements.define("bare-write", BareWrite);
}
