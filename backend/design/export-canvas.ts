import { api } from "encore.dev/api";

interface ExportCanvasRequest {
  canvasData: string; // Base64 encoded canvas image data
  format: "png" | "jpg";
  filename: string;
}

interface ExportCanvasResponse {
  downloadUrl: string;
}

// Processes canvas export data and returns a download URL.
export const exportCanvas = api<ExportCanvasRequest, ExportCanvasResponse>(
  { expose: true, method: "POST", path: "/canvas/export" },
  async (req) => {
    // For this implementation, we'll return the data URL directly
    // In a production app, you might want to store the exported image
    // and return a proper download URL
    
    const mimeType = req.format === "png" ? "image/png" : "image/jpeg";
    const downloadUrl = `data:${mimeType};base64,${req.canvasData}`;
    
    return {
      downloadUrl,
    };
  }
);
