
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface UploadedFile {
  file: File | null;
  uploadedPath: string;
  downloadUrl: string;
}

export interface UseFileUploadsReturn {
  imageFile: UploadedFile;
  execFile: UploadedFile;
  setImage: (file: File | null) => void;
  setExecFile: (file: File | null) => void;
  handleImageUploadComplete: (filePath: string) => void;
  handleExecFileUploadComplete: (filePath: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

/**
 * Custom hook to manage file uploads for agents
 */
export function useFileUploads(): UseFileUploadsReturn {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Image state
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Executable file state
  const [execFile, setExecFile] = useState<File | null>(null);
  const [uploadedExecFilePath, setUploadedExecFilePath] = useState<string>('');
  const [execFileUrl, setExecFileUrl] = useState<string>('');

  // Logger utility
  const logUpload = (area: string, message: string, data?: any) => {
    if (data) {
      console.log(`[FileUpload][${area}] ${message}`, data);
    } else {
      console.log(`[FileUpload][${area}] ${message}`);
    }
  };

  // Generate proper download URLs whenever file paths change
  useEffect(() => {
    const generateUrls = async () => {
      // Generate image URL
      if (uploadedImagePath) {
        logUpload('URL_GEN', 'Generating image download URL', { path: uploadedImagePath });

        try {
          // For images, we need the special type=img format
          const pathParts = uploadedImagePath.split('/');
          const filename = pathParts[pathParts.length - 1] || 'unknown';
          const baseUrl = import.meta.env.VITE_DOWNLOAD_BASE_URL || 'http://localhost:8001';

          // Create URL with the special format required - using 'img' as type
          const imgUrl = `${baseUrl}?type=img&filename=${encodeURIComponent(filename)}`;

          logUpload('URL_GEN', 'Generated image download URL', { imgUrl });
          setImageUrl(imgUrl);
        } catch (error) {
          logUpload('URL_GEN', 'Error generating image URL', error);
          // Leave empty if generation fails
          setImageUrl('');
        }
      }

      // Generate executable URL
      if (uploadedExecFilePath) {
        logUpload('URL_GEN', 'Generating executable download URL', { path: uploadedExecFilePath });

        try {
          // Extract type and filename from path
          const pathParts = uploadedExecFilePath.split('/');
          let fileType = 'agent';

          // Ensure we use the right file type
          if (uploadedExecFilePath.includes('/agent/')) {
            fileType = 'agent';
          }

          const filename = pathParts[pathParts.length - 1] || 'unknown';
          const baseUrl = import.meta.env.VITE_DOWNLOAD_BASE_URL || 'http://localhost:8001';

          // Create URL with the correct format
          const exeUrl = `${baseUrl}?type=${fileType}&filename=${encodeURIComponent(filename)}`;

          logUpload('URL_GEN', 'Generated executable download URL', { exeUrl });
          setExecFileUrl(exeUrl);
        } catch (error) {
          logUpload('URL_GEN', 'Error generating executable URL', error);
          // Leave empty if generation fails
          setExecFileUrl('');
        }
      }
    };

    generateUrls();
  }, [uploadedImagePath, uploadedExecFilePath]);

  const handleImageUploadComplete = (filePath: string) => {
    logUpload('UPLOAD', 'Image upload completed', { filePath });
    setUploadedImagePath(filePath);
    setIsUploading(false);
    
    toast({
      title: "Image Uploaded",
      description: "Your image has been uploaded successfully."
    });
  };

  const handleExecFileUploadComplete = (filePath: string) => {
    logUpload('UPLOAD', 'Executable upload completed', { filePath });
    setUploadedExecFilePath(filePath);
    setIsUploading(false);
    
    toast({
      title: "Executable Uploaded",
      description: "Your executable file has been uploaded successfully."
    });
  };

  return {
    imageFile: {
      file: image,
      uploadedPath: uploadedImagePath,
      downloadUrl: imageUrl,
    },
    execFile: {
      file: execFile,
      uploadedPath: uploadedExecFilePath,
      downloadUrl: execFileUrl,
    },
    setImage,
    setExecFile,
    handleImageUploadComplete,
    handleExecFileUploadComplete,
    isUploading,
    setIsUploading,
  };
}
