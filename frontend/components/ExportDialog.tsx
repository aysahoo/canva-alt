import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CanvasElement } from "../types/canvas";
import backend from "~backend/client";

interface ExportDialogProps {
  elements: CanvasElement[];
}

export function ExportDialog({ elements }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [filename, setFilename] = useState("design");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!elements.length) {
      toast({
        title: "Nothing to export",
        description: "Add some elements to the canvas first",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      // Create a temporary canvas to render the design
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size (you might want to make this configurable)
      canvas.width = 800;
      canvas.height = 600;

      // Fill with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render all elements
      for (const element of elements) {
        ctx.save();
        
        // Apply transformations
        ctx.globalAlpha = element.opacity;
        ctx.translate(element.position.x + element.size.width / 2, element.position.y + element.size.height / 2);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.translate(-element.size.width / 2, -element.size.height / 2);

        switch (element.type) {
          case "text":
            ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
            ctx.fillStyle = element.color;
            ctx.textAlign = element.textAlign;
            ctx.textBaseline = "top";
            
            const lines = element.content.split("\n");
            lines.forEach((line, index) => {
              const x = element.textAlign === "center" ? element.size.width / 2 : 
                        element.textAlign === "right" ? element.size.width : 0;
              ctx.fillText(line, x, index * element.fontSize * 1.2);
            });
            break;
          case "shape":
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
            break;
          case "image":
            // For images, we'd need to load them first
            // This is a simplified version
            const img = new Image();
            img.crossOrigin = "anonymous";
            await new Promise((resolve) => {
              img.onload = () => {
                ctx.drawImage(img, 0, 0, element.size.width, element.size.height);
                resolve(void 0);
              };
              img.onerror = resolve;
              img.src = element.src;
            });
            break;
        }

        ctx.restore();
      }

      // Convert canvas to blob
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Convert blob to base64
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = (reader.result as string).split(",")[1];
          
          try {
            const response = await backend.design.exportCanvas({
              canvasData: base64Data,
              format,
              filename
            });

            // Create download link
            const link = document.createElement("a");
            link.href = response.downloadUrl;
            link.download = `${filename}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
              title: "Export successful",
              description: `Your design has been exported as ${filename}.${format}`,
            });

            setIsOpen(false);
          } catch (error) {
            console.error("Export error:", error);
            toast({
              title: "Export failed",
              description: "Failed to export your design. Please try again.",
              variant: "destructive",
            });
          }
        };
        reader.readAsDataURL(blob);
      }, mimeType, 0.9);

    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export your design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={(value: "png" | "jpg") => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || !filename.trim()}
            className="w-full"
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
