import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { CanvasElement } from "../types/canvas";

interface CanvasRendererProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  canvasSize: { width: number; height: number };
  zoom: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

export const CanvasRenderer = forwardRef<HTMLCanvasElement, CanvasRendererProps>(
  ({ elements, selectedElementId, canvasSize, zoom, onMouseDown, onMouseMove, onMouseUp, onClick }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current!);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = canvasSize.width * zoom;
      canvas.height = canvasSize.height * zoom;
      
      // Scale context for zoom
      ctx.scale(zoom, zoom);

      // Clear canvas
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Render elements
      elements.forEach((element) => {
        ctx.save();
        
        // Apply transformations
        ctx.globalAlpha = element.opacity;
        ctx.translate(element.position.x + element.size.width / 2, element.position.y + element.size.height / 2);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.translate(-element.size.width / 2, -element.size.height / 2);

        switch (element.type) {
          case "text":
            renderText(ctx, element);
            break;
          case "shape":
            renderShape(ctx, element);
            break;
          case "image":
            renderImage(ctx, element);
            break;
        }

        ctx.restore();

        // Draw selection outline
        if (element.id === selectedElementId) {
          drawSelectionOutline(ctx, element, zoom);
        }
      });
    }, [elements, selectedElementId, canvasSize, zoom]);

    const renderText = (ctx: CanvasRenderingContext2D, element: any) => {
      ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
      ctx.fillStyle = element.color;
      ctx.textAlign = element.textAlign;
      ctx.textBaseline = "top";
      
      const lines = element.content.split("\n");
      lines.forEach((line: string, index: number) => {
        const x = element.textAlign === "center" ? element.size.width / 2 : 
                  element.textAlign === "right" ? element.size.width : 0;
        ctx.fillText(line, x, index * element.fontSize * 1.2);
      });
    };

    const renderShape = (ctx: CanvasRenderingContext2D, element: any) => {
      ctx.fillStyle = element.fill;
      ctx.strokeStyle = element.stroke;
      ctx.lineWidth = element.strokeWidth;

      switch (element.shapeType) {
        case "rectangle":
          if (element.fill !== "transparent") {
            ctx.fillRect(0, 0, element.size.width, element.size.height);
          }
          if (element.strokeWidth > 0) {
            ctx.strokeRect(0, 0, element.size.width, element.size.height);
          }
          break;
        case "circle":
          const radius = Math.min(element.size.width, element.size.height) / 2;
          const centerX = element.size.width / 2;
          const centerY = element.size.height / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          if (element.fill !== "transparent") {
            ctx.fill();
          }
          if (element.strokeWidth > 0) {
            ctx.stroke();
          }
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(0, element.size.height / 2);
          ctx.lineTo(element.size.width, element.size.height / 2);
          ctx.stroke();
          break;
      }
    };

    const renderImage = (ctx: CanvasRenderingContext2D, element: any) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, element.size.width, element.size.height);
      };
      img.src = element.src;
    };

    const drawSelectionOutline = (ctx: CanvasRenderingContext2D, element: CanvasElement, zoom: number) => {
      ctx.save();
      ctx.resetTransform();
      ctx.scale(zoom, zoom);
      
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([5 / zoom, 5 / zoom]);
      
      ctx.strokeRect(
        element.position.x - 2 / zoom,
        element.position.y - 2 / zoom,
        element.size.width + 4 / zoom,
        element.size.height + 4 / zoom
      );
      
      ctx.restore();
    };

    return (
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClick}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
);

CanvasRenderer.displayName = "CanvasRenderer";
