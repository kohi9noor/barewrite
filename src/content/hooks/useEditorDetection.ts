import { useEffect } from "react";
import { injectIndicator } from "../utils/editorDetection";
import { isVisible } from "../utils/domUtils";

export function useEditorDetection(): void {
  useEffect(() => {
    const injected = new WeakSet<HTMLElement>();

    function scan(): void {
      const editors = document.querySelectorAll(
        "div[contenteditable='true'], textarea",
      );

      editors.forEach((editor) => {
        if (injected.has(editor as HTMLElement)) return;
        if (!isVisible(editor as HTMLElement)) return;

        injected.add(editor as HTMLElement);
        injectIndicator(editor as HTMLElement);
      });
    }

    /**
     * MutationObserver
     * We use it to detect when new contenteditable elements or textares
     * are added to the dom, so that we can inject the indicator into them,
     * and also to detect when they are removed, so that we can clean up the indicators.
     */

    const observer = new MutationObserver(scan);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    scan();

    return () => observer.disconnect();
  }, []);
}
