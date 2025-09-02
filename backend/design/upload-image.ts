import { api, APIError } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const imagesBucket = new Bucket("design-images", { public: true });

interface UploadImageRequest {
  name: string;
  data: string; // Base64 encoded image data
  contentType: string;
}

interface UploadImageResponse {
  url: string;
  id: string;
}

// Uploads an image to object storage and returns the public URL.
export const uploadImage = api<UploadImageRequest, UploadImageResponse>(
  { expose: true, method: "POST", path: "/images/upload" },
  async (req) => {
    try {
      // Validate content type
      if (!req.contentType.startsWith("image/")) {
        throw APIError.invalidArgument("Only image files are allowed");
      }

      // Convert base64 to buffer
      const base64Data = req.data.replace(/^data:image\/[a-z]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Generate unique filename
      const timestamp = Date.now();
      const extension = req.contentType.split("/")[1];
      const filename = `${timestamp}-${req.name}.${extension}`;

      // Upload to bucket
      await imagesBucket.upload(filename, buffer, {
        contentType: req.contentType,
      });

      // Return public URL
      const url = imagesBucket.publicUrl(filename);
      
      return {
        url,
        id: filename,
      };
    } catch (error) {
      throw APIError.internal("Failed to upload image", error);
    }
  }
);
