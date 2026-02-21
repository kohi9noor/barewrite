import { useEditorDetection } from "./hooks/useEditorDetection";
import { useDialogManager } from "./hooks/useDialogManager";
import { DraggableDialog } from "./components/DraggableDialog";

const App = () => {
  useEditorDetection();
  const { isOpen, position, closeDialog } = useDialogManager();

  return (
    <>
      <DraggableDialog isOpen={isOpen} position={position} onClose={closeDialog} />
    </>
  );
};

export default App;
