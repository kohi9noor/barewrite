import { useRef, useCallback, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface DialogProps {
  isOpen: boolean;
  position: Position;
  onClose: () => void;
}

export const DraggableDialog = ({ isOpen, position, onClose }: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef(position);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dialogRef.current) return;

    const rect = dialogRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isDraggingRef.current = true;
    dialogRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !dialogRef.current) return;

    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;

    currentPosRef.current = { x: newX, y: newY };

    dialogRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    if (dialogRef.current) {
      dialogRef.current.style.cursor = "default";
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 10000,
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        border: "1px solid #e5e7eb",
        minWidth: "300px",
        maxWidth: "500px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        willChange: "transform",
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          background: "linear-gradient(to right, #3b82f6, #2563eb)",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px 8px 0 0",
          cursor: "move",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
          WebkitUserSelect: "none" as any,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Barewrite
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
          aria-label="Close dialog"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="1" y1="1" x2="17" y2="17" />
            <line x1="17" y1="1" x2="1" y2="17" />
          </svg>
        </button>
      </div>

      <div
        style={{
          padding: "16px",
          backgroundColor: "#f9fafb",
          borderRadius: "0 0 8px 8px",
          minHeight: "100px",
        }}
      >
        <p style={{ margin: 0, color: "#4b5563", fontSize: "14px" }}>
          Dialog content goes here
        </p>
      </div>
    </div>
  );
};
