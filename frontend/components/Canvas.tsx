import { useRef, useEffect, useState, useCallback } from "react";
import { CanvasElement, Position, Size } from "../types/canvas";
import { Tool } from "../types/tools";
import { CanvasRenderer } from "./CanvasRenderer";
import { useCanvasInteractions } from "../hooks/useCanvasInteractions";

interface CanvasProps {
  selectedTool: Tool;
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  selectedElementId: string | null;
  onElementSelect: (elementId: string | null) => void;
  zoom: number;
}

export function Canvas({
  selectedTool,
  elements,
  onElementsChange,
  selectedElementId,
  onElementSelect,
  zoom
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick
  } = useCanvasInteractions({
    selectedTool,
    elements,
    onElementsChange,
    selectedElementId,
    onElementSelect,
    canvasSize,
    zoom,
    panOffset,
    setPanOffset
  });

  // Update canvas size when container resizes
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: Math.max(800, rect.width - 40),
          height: Math.max(600, rect.height - 40)
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-auto bg-muted/20 p-5"
      style={{
        cursor: selectedTool === "pan" ? "grab" : "default"
      }}
    >
      <div 
        className="relative bg-white shadow-lg"
        style={{
          width: canvasSize.width * zoom,
          height: canvasSize.height * zoom,
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
        }}
      >
        <CanvasRenderer
          ref={canvasRef}
          elements={elements}
          selectedElementId={selectedElementId}
          canvasSize={canvasSize}
          zoom={zoom}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
}
