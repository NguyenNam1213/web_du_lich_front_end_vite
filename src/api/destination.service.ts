import { AxiosResponse } from "axios";
import instance from "./api";

export const DestinationService = {
  // Upload destination image
  uploadImage(
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    return instance.post("/destinations/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
      onUploadProgress,
    });
  },
};

