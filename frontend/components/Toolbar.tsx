import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Type, 
  Square, 
  Circle, 
  Minus, 
  Image, 
  Hand,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { Tool } from "../types/tools";
import { CanvasElement } from "../types/canvas";
import { ExportDialog } from "./ExportDialog";

interface ToolbarProps {
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  canvasZoom: number;
  onZoomChange: (zoom: number) => void;
  elements: CanvasElement[];
}

export function Toolbar({ 
  selectedTool, 
  onToolChange, 
  canvasZoom, 
  onZoomChange,
  elements 
}: ToolbarProps) {
  const tools = [
    { id: "select" as Tool, icon: MousePointer, label: "Select" },
    { id: "text" as Tool, icon: Type, label: "Text" },
    { id: "shape" as Tool, icon: Square, label: "Rectangle" },
    { id: "image" as Tool, icon: Image, label: "Image" },
    { id: "pan" as Tool, icon: Hand, label: "Pan" },
  ];

  const handleZoomIn = () => {
    onZoomChange(Math.min(canvasZoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(canvasZoom / 1.2, 0.1));
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="flex items-center gap-2"
          >
            <tool.icon className="h-4 w-4" />
            {tool.label}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleZoomReset}
          className="min-w-16"
        >
          {Math.round(canvasZoom * 100)}%
        </Button>
        <Button variant="ghost" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <ExportDialog elements={elements} />
    </div>
  );
}
