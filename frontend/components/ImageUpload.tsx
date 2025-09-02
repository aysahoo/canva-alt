import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

interface ImageUploadProps {
  onImageUpload: (src: string) => void;
  buttonText?: string;
}

export function ImageUpload({ onImageUpload, buttonText = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const base64Content = base64Data.split(",")[1];

        try {
          const response = await backend.design.uploadImage({
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            data: base64Content,
            contentType: file.type,
          });

          onImageUpload(response.url);
          toast({
            title: "Image uploaded",
            description: "Your image has been uploaded successfully",
          });
        } catch (error) {
          console.error("Upload error:", error);
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File reading error:", error);
      toast({
        title: "File error",
        description: "Failed to read the selected file",
        variant: "destructive",
      });
      setIsUploading(false);
    }

    // Reset input
    event.target.value = "";
  };

  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById("image-upload")?.click()}
        disabled={isUploading}
        className="w-full h-8"
      >
        <Upload className="h-3 w-3 mr-2" />
        {isUploading ? "Uploading..." : buttonText}
      </Button>
    </div>
  );
}
