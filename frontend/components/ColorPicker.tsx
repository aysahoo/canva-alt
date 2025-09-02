import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  allowTransparent?: boolean;
}

export function ColorPicker({ color, onChange, allowTransparent = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    "#000000", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6", "#FFFFFF",
    "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16", "#22C55E", "#10B981",
    "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF",
    "#EC4899", "#F43F5E"
  ];

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
  };

  const handleTransparent = () => {
    onChange("transparent");
    setIsOpen(false);
  };

  const displayColor = color === "transparent" ? "#ffffff" : color;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-8 p-1 flex items-center gap-2"
        >
          <div
            className="w-4 h-4 rounded border border-border"
            style={{
              backgroundColor: displayColor,
              backgroundImage: color === "transparent" 
                ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                : undefined,
              backgroundSize: color === "transparent" ? "8px 8px" : undefined,
              backgroundPosition: color === "transparent" ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined
            }}
          />
          <span className="text-xs flex-1 text-left">
            {color === "transparent" ? "Transparent" : color}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-1">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  handleColorChange(presetColor);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          
          {allowTransparent && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTransparent}
              className="w-full h-7 text-xs"
            >
              Transparent
            </Button>
          )}
          
          <div className="flex gap-2">
            <Input
              type="color"
              value={displayColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 h-8 text-xs"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
