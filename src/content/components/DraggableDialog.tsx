import { useRef, useState, useEffect } from "react";
import { XIcon } from "lucide-react";

interface DraggableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: string; y: string };
}

const DraggableDialog = (props: DraggableDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Sync position prop if it changes externally
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.top = props.position.y;
      dialogRef.current.style.left = props.position.x;
    }
  }, [props.position]);

  return (
    <div
      ref={dialogRef}
      style={{
        position: "absolute",
        width: "360px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        zIndex: 9999,
        transition: props.isOpen
          ? "opacity 300ms"
          : "opacity 300ms, visibility 300ms",
        opacity: props.isOpen ? 1 : 0,
        pointerEvents: props.isOpen ? "auto" : "none",
        top: props.position.y,
        left: props.position.x,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <DialogHeader onClose={props.onClose} dialogRef={dialogRef} />
      <div style={{ padding: "16px" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>
          Dialog Content
        </p>
      </div>
    </div>
  );
};

const DialogHeader = ({
  onClose,
  dialogRef,
}: {
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dialogRef.current) return;

    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;

    const rect = dialogRef.current.getBoundingClientRect();
    const initialLeft = rect.left;
    const initialTop = rect.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dialogRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      dialogRef.current.style.left = `${initialLeft + deltaX}px`;
      dialogRef.current.style.top = `${initialTop + deltaY}px`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isHovered || isDragging ? "#d1d5db" : "#e5e7eb",
        height: "40px",
        padding: "0 12px",
        color: "black",
        borderBottom: "1px solid #d1d5db",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      <img
        src={chrome.runtime.getURL("logo.svg")}
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
      />
      <button
        onClick={onClose}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          opacity: 0.6,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        <XIcon size={16} />
      </button>
    </div>
  );
};

export default DraggableDialog;
