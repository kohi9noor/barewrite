import { useState, useEffect, useCallback } from "react";

interface DialogManagerState {
  isOpen: boolean;
  position: { x: number; y: number };
  selectedEditor: HTMLElement | null;
  editorType: string | null;
}

interface EditorSelectedEvent extends CustomEvent {
  detail: {
    element: HTMLElement;
    editorType: string;
    clickX: number;
    clickY: number;
  };
}

export function useDialogManager() {
  const [state, setState] = useState<DialogManagerState>({
    isOpen: false,
    position: { x: 100, y: 100 },
    selectedEditor: null,
    editorType: null,
  });

  const openDialog = useCallback(
    (element: HTMLElement, editorType: string, x: number, y: number) => {
      setState({
        isOpen: true,
        position: { x, y },
        selectedEditor: element,
        editorType,
      });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  useEffect(() => {
    const handleEditorSelected = (event: Event) => {
      console.log("Editor selected event received:", event);
      const customEvent = event as EditorSelectedEvent;
      const { element, editorType, clickX, clickY } = customEvent.detail;
      console.log("Opening dialog with:", { clickX, clickY, editorType });
      setState({
        isOpen: true,
        position: { x: clickX, y: clickY },
        selectedEditor: element,
        editorType,
      });
    };

    document.addEventListener(
      "barewrite:editor-selected",
      handleEditorSelected,
    );

    return () => {
      document.removeEventListener(
        "barewrite:editor-selected",
        handleEditorSelected,
      );
    };
  }, []);

  return {
    isOpen: state.isOpen,
    position: state.position,
    selectedEditor: state.selectedEditor,
    editorType: state.editorType,
    closeDialog,
  };
}
