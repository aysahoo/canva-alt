import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "./ColorPicker";
import { ImageUpload } from "./ImageUpload";
import { CanvasElement } from "../types/canvas";
import { Settings } from "lucide-react";

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
}

export function PropertiesPanel({ selectedElement, onElementUpdate }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h3 className="font-medium">Properties</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select an element</p>
            <p className="text-xs">to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<CanvasElement>) => {
    onElementUpdate(selectedElement.id, updates);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <h3 className="font-medium">Properties</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Position & Size */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Position & Size</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="x" className="text-xs">X</Label>
              <Input
                id="x"
                type="number"
                value={Math.round(selectedElement.position.x)}
                onChange={(e) => handleUpdate({
                  position: { ...selectedElement.position, x: Number(e.target.value) }
                })}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">Y</Label>
              <Input
                id="y"
                type="number"
                value={Math.round(selectedElement.position.y)}
                onChange={(e) => handleUpdate({
                  position: { ...selectedElement.position, y: Number(e.target.value) }
                })}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="width" className="text-xs">Width</Label>
              <Input
                id="width"
                type="number"
                value={Math.round(selectedElement.size.width)}
                onChange={(e) => handleUpdate({
                  size: { ...selectedElement.size, width: Number(e.target.value) }
                })}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">Height</Label>
              <Input
                id="height"
                type="number"
                value={Math.round(selectedElement.size.height)}
                onChange={(e) => handleUpdate({
                  size: { ...selectedElement.size, height: Number(e.target.value) }
                })}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Rotation</h4>
          <div className="space-y-2">
            <Slider
              value={[selectedElement.rotation]}
              onValueChange={([value]) => handleUpdate({ rotation: value })}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              {selectedElement.rotation}°
            </div>
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Opacity</h4>
          <div className="space-y-2">
            <Slider
              value={[selectedElement.opacity * 100]}
              onValueChange={([value]) => handleUpdate({ opacity: value / 100 })}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              {Math.round(selectedElement.opacity * 100)}%
            </div>
          </div>
        </div>

        {/* Text Properties */}
        {selectedElement.type === "text" && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Text</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="content" className="text-xs">Content</Label>
                <Textarea
                  id="content"
                  value={selectedElement.content}
                  onChange={(e) => handleUpdate({ content: e.target.value })}
                  className="h-20"
                />
              </div>
              <div>
                <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                <Select 
                  value={selectedElement.fontFamily} 
                  onValueChange={(value) => handleUpdate({ fontFamily: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fontWeight" className="text-xs">Weight</Label>
                  <Select 
                    value={selectedElement.fontWeight} 
                    onValueChange={(value: "normal" | "bold") => handleUpdate({ fontWeight: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fontStyle" className="text-xs">Style</Label>
                  <Select 
                    value={selectedElement.fontStyle} 
                    onValueChange={(value: "normal" | "italic") => handleUpdate({ fontStyle: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="italic">Italic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="textAlign" className="text-xs">Alignment</Label>
                <Select 
                  value={selectedElement.textAlign} 
                  onValueChange={(value: "left" | "center" | "right") => handleUpdate({ textAlign: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Color</Label>
                <ColorPicker
                  color={selectedElement.color}
                  onChange={(color) => handleUpdate({ color })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Shape Properties */}
        {selectedElement.type === "shape" && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Shape</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Fill Color</Label>
                <ColorPicker
                  color={selectedElement.fill}
                  onChange={(color) => handleUpdate({ fill: color })}
                  allowTransparent
                />
              </div>
              <div>
                <Label className="text-xs">Stroke Color</Label>
                <ColorPicker
                  color={selectedElement.stroke}
                  onChange={(color) => handleUpdate({ stroke: color })}
                  allowTransparent
                />
              </div>
              <div>
                <Label htmlFor="strokeWidth" className="text-xs">Stroke Width</Label>
                <Input
                  id="strokeWidth"
                  type="number"
                  value={selectedElement.strokeWidth}
                  onChange={(e) => handleUpdate({ strokeWidth: Number(e.target.value) })}
                  min={0}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        )}

        {/* Image Properties */}
        {selectedElement.type === "image" && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Image</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="alt" className="text-xs">Alt Text</Label>
                <Input
                  id="alt"
                  value={selectedElement.alt}
                  onChange={(e) => handleUpdate({ alt: e.target.value })}
                  className="h-8"
                />
              </div>
              <ImageUpload
                onImageUpload={(src) => handleUpdate({ src })}
                buttonText="Replace Image"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
