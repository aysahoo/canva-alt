import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Canvas } from "../components/Canvas";
import { Toolbar } from "../components/Toolbar";
import { LayerPanel } from "../components/LayerPanel";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { CanvasElement } from "../types/canvas";
import { Tool } from "../types/tools";
import { Home } from "lucide-react";

interface DesignEditorProps {
  onNavigateHome: () => void;
}

export function DesignEditor({ onNavigateHome }: DesignEditorProps) {
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [canvasZoom, setCanvasZoom] = useState(1);

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  const handleElementUpdate = (elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const handleElementDelete = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleLayerOrderChange = (elementId: string, direction: "up" | "down" | "front" | "back") => {
    setElements(prev => {
      const elementIndex = prev.findIndex(el => el.id === elementId);
      if (elementIndex === -1) return prev;

      const newElements = [...prev];
      const element = newElements[elementIndex];

      switch (direction) {
        case "up":
          if (elementIndex < newElements.length - 1) {
            [newElements[elementIndex], newElements[elementIndex + 1]] = 
            [newElements[elementIndex + 1], newElements[elementIndex]];
          }
          break;
        case "down":
          if (elementIndex > 0) {
            [newElements[elementIndex], newElements[elementIndex - 1]] = 
            [newElements[elementIndex - 1], newElements[elementIndex]];
          }
          break;
        case "front":
          newElements.splice(elementIndex, 1);
          newElements.push(element);
          break;
        case "back":
          newElements.splice(elementIndex, 1);
          newElements.unshift(element);
          break;
      }

      return newElements;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNavigateHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <div className="w-px h-6 bg-border" />
          <h1 className="font-semibold text-lg">Design Editor</h1>
        </div>
        <Toolbar 
          selectedTool={selectedTool} 
          onToolChange={setSelectedTool}
          canvasZoom={canvasZoom}
          onZoomChange={setCanvasZoom}
          elements={elements}
        />
      </div>
      
      <div className="flex-1 flex">
        <div className="w-64 border-r border-border">
          <LayerPanel 
            elements={elements}
            selectedElementId={selectedElementId}
            onElementSelect={setSelectedElementId}
            onElementDelete={handleElementDelete}
            onLayerOrderChange={handleLayerOrderChange}
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Canvas
            selectedTool={selectedTool}
            elements={elements}
            onElementsChange={setElements}
            selectedElementId={selectedElementId}
            onElementSelect={setSelectedElementId}
            zoom={canvasZoom}
          />
        </div>
        
        <div className="w-80 border-l border-border">
          <PropertiesPanel
            selectedElement={selectedElement}
            onElementUpdate={handleElementUpdate}
          />
        </div>
      </div>
    </div>
  );
}
