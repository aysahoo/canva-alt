import { useState, useCallback } from "react";
import { CanvasElement, Position } from "../types/canvas";
import { Tool } from "../types/tools";
import { generateId } from "../utils/helpers";

interface UseCanvasInteractionsProps {
  selectedTool: Tool;
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  selectedElementId: string | null;
  onElementSelect: (elementId: string | null) => void;
  canvasSize: { width: number; height: number };
  zoom: number;
  panOffset: { x: number; y: number };
  setPanOffset: (offset: { x: number; y: number }) => void;
}

export function useCanvasInteractions({
  selectedTool,
  elements,
  onElementsChange,
  selectedElementId,
  onElementSelect,
  canvasSize,
  zoom,
  panOffset,
  setPanOffset
}: UseCanvasInteractionsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [dragElement, setDragElement] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });

  const getCanvasPosition = useCallback((e: React.MouseEvent): Position => {
    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
  }, [zoom]);

  const findElementAt = useCallback((position: Position): CanvasElement | null => {
    // Check elements in reverse order (top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (
        position.x >= element.position.x &&
        position.x <= element.position.x + element.size.width &&
        position.y >= element.position.y &&
        position.y <= element.position.y + element.size.height
      ) {
        return element;
      }
    }
    return null;
  }, [elements]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const position = getCanvasPosition(e);

    if (selectedTool === "pan") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (selectedTool === "select") {
      const clickedElement = findElementAt(position);
      if (clickedElement) {
        onElementSelect(clickedElement.id);
        setIsDragging(true);
        setDragElement(clickedElement.id);
        setDragStart({
          x: position.x - clickedElement.position.x,
          y: position.y - clickedElement.position.y
        });
      } else {
        onElementSelect(null);
      }
      return;
    }

    // Create new element
    if (selectedTool === "text") {
      const newElement: CanvasElement = {
        id: generateId(),
        type: "text",
        position,
        size: { width: 200, height: 40 },
        rotation: 0,
        opacity: 1,
        content: "New Text",
        fontSize: 24,
        fontFamily: "Arial",
        color: "#000000",
        textAlign: "left",
        fontWeight: "normal",
        fontStyle: "normal"
      };
      onElementsChange([...elements, newElement]);
      onElementSelect(newElement.id);
    } else if (selectedTool === "shape") {
      setIsCreating(true);
      setDragStart(position);
      const newElement: CanvasElement = {
        id: generateId(),
        type: "shape",
        position,
        size: { width: 0, height: 0 },
        rotation: 0,
        opacity: 1,
        shapeType: "rectangle",
        fill: "#3b82f6",
        stroke: "#1e40af",
        strokeWidth: 2
      };
      onElementsChange([...elements, newElement]);
      onElementSelect(newElement.id);
    }
  }, [selectedTool, getCanvasPosition, findElementAt, onElementSelect, elements, onElementsChange, panOffset, setPanStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (!isDragging && !isCreating) return;

    const position = getCanvasPosition(e);

    if (isDragging && dragElement) {
      const newPosition = {
        x: Math.max(0, Math.min(position.x - dragStart.x, canvasSize.width - 50)),
        y: Math.max(0, Math.min(position.y - dragStart.y, canvasSize.height - 50))
      };

      onElementsChange(elements.map(el =>
        el.id === dragElement
          ? { ...el, position: newPosition }
          : el
      ));
    } else if (isCreating && selectedElementId) {
      const width = Math.abs(position.x - dragStart.x);
      const height = Math.abs(position.y - dragStart.y);
      const newPosition = {
        x: Math.min(dragStart.x, position.x),
        y: Math.min(dragStart.y, position.y)
      };

      onElementsChange(elements.map(el =>
        el.id === selectedElementId
          ? { ...el, position: newPosition, size: { width, height } }
          : el
      ));
    }
  }, [isDragging, isCreating, dragElement, selectedElementId, getCanvasPosition, dragStart, elements, onElementsChange, canvasSize, isPanning, panStart, setPanOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsCreating(false);
    setDragElement(null);
    setIsPanning(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === "image") {
      const position = getCanvasPosition(e);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newElement: CanvasElement = {
              id: generateId(),
              type: "image",
              position,
              size: { width: 200, height: 150 },
              rotation: 0,
              opacity: 1,
              src: e.target?.result as string,
              alt: file.name
            };
            onElementsChange([...elements, newElement]);
            onElementSelect(newElement.id);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  }, [selectedTool, getCanvasPosition, elements, onElementsChange, onElementSelect]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick
  };
}
