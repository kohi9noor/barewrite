/**
 * Editor detection and indicator injection utilities
 */

export function getEditableCandidates(): HTMLElement[] {
  const nodes = Array.from(
    document.querySelectorAll(
      "textarea, div[contenteditable='true'], [role='textbox']",
    ),
  ) as HTMLElement[];

  return nodes;
}

export function detectEditorType(el: HTMLElement): string {
  if (el.closest("[data-slate-editor]")) return "slate";
  if (el.closest(".ProseMirror")) return "prosemirror";
  if (el.closest(".DraftEditor-root")) return "draftjs";
  if (el.closest(".ql-editor")) return "quill";
  if (el.closest(".CodeMirror")) return "codemirror";
  if (el.closest(".tox-edit-area")) return "tinymce";
  if (el.closest(".ck-editor__editable")) return "ckeditor";
  if (el.closest(".trix-content")) return "trix";
  if (el.closest(".editor-container")) return "generic";
  return "generic";
}

export function injectIndicator(target: HTMLElement): void {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.transform = "translate(-50%, -50%)";
  host.style.borderRadius = "100%";
  host.style.pointerEvents = "auto";
  host.style.zIndex = "2147483647";
  host.style.cursor = "pointer";
  host.style.width = "14px";
  host.style.height = "14px";
  host.style.border = "2px solid #8F9779";
  host.style.backgroundColor = "#EEF1E8";
  host.style.boxSizing = "border-box";

  const updatePosition = () => {
    if (!target.isConnected) {
      cleanup();
      return;
    }

    const rect = target.getBoundingClientRect();
    host.style.left = `${Math.max(8, rect.right - 10)}px`;
    host.style.top = `${Math.max(8, rect.top + rect.height / 2)}px`;
  };

  let rafId = 0;
  const schedulePositionUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      updatePosition();
    });
  };

  const cleanup = () => {
    window.removeEventListener("scroll", updatePosition, true);
    window.removeEventListener("resize", updatePosition, true);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    observer.disconnect();
    host.remove();
  };

  const observer = new MutationObserver(schedulePositionUpdate);

  const rootParent = document.documentElement || document.body;
  rootParent.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });

  const indicator = document.createElement("div");
  indicator.style.width = "10px";
  indicator.style.height = "10px";
  indicator.style.borderRadius = "50%";
  indicator.style.margin = "auto";
  shadowRoot.appendChild(indicator);

  updatePosition();
  window.addEventListener("scroll", updatePosition, true);
  window.addEventListener("resize", updatePosition, true);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  host.addEventListener("click", () => {
    const editorType = detectEditorType(target);
    const rect = target.getBoundingClientRect();

    const viewPortWidth = window.innerWidth;
    const viewPortHeight = window.innerHeight;

    const event = new CustomEvent("barewrite:editor-selected", {
      detail: {
        element: target,
        editorType,
        clientX: Math.min(viewPortWidth - 1, Math.max(0, rect.right)),
        clientY: Math.min(
          viewPortHeight - 1,
          Math.max(0, rect.top + rect.height / 2),
        ),
      },
      bubbles: true,
    });

    document.dispatchEvent(event);
  });
}
