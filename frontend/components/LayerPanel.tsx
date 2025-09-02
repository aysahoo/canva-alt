import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  SquareStack,
  Type,
  Square,
  Image
} from "lucide-react";
import { CanvasElement } from "../types/canvas";

interface LayerPanelProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementDelete: (elementId: string) => void;
  onLayerOrderChange: (elementId: string, direction: "up" | "down" | "front" | "back") => void;
}

export function LayerPanel({
  elements,
  selectedElementId,
  onElementSelect,
  onElementDelete,
  onLayerOrderChange
}: LayerPanelProps) {
  const getElementIcon = (element: CanvasElement) => {
    switch (element.type) {
      case "text":
        return Type;
      case "shape":
        return Square;
      case "image":
        return Image;
      default:
        return Square;
    }
  };

  const getElementName = (element: CanvasElement) => {
    switch (element.type) {
      case "text":
        return element.content.slice(0, 20) || "Text";
      case "shape":
        return `${element.shapeType.charAt(0).toUpperCase() + element.shapeType.slice(1)}`;
      case "image":
        return element.alt || "Image";
      default:
        return "Element";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SquareStack className="h-4 w-4" />
          <h3 className="font-medium">Layers</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {[...elements].reverse().map((element, index) => {
            const Icon = getElementIcon(element);
            const isSelected = element.id === selectedElementId;
            const actualIndex = elements.length - 1 - index;
            
            return (
              <div
                key={element.id}
                className={`
                  flex items-center gap-2 p-2 rounded cursor-pointer group
                  ${isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}
                `}
                onClick={() => onElementSelect(element.id)}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm truncate">
                  {getElementName(element)}
                </span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerOrderChange(element.id, "up");
                    }}
                    disabled={actualIndex === elements.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerOrderChange(element.id, "down");
                    }}
                    disabled={actualIndex === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementDelete(element.id);
                    }}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {elements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <SquareStack className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No layers yet</p>
              <p className="text-xs">Add elements to see them here</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
