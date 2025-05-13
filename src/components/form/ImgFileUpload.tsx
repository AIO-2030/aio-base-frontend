
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImageFile } from '@/services/ImgFileUpload';
import { X, Upload, Image } from 'lucide-react';

interface ImgFileUploadProps {
  image: File | null;
  setImage: (file: File | null) => void;
  onUploadComplete?: (filePath: string) => void;
  agentName?: string;
  isUploading?: boolean;
  setIsUploading?: (value: boolean) => void;
  showUploadNowButton?: boolean; // New prop to control upload button visibility
}

const ImgFileUpload: React.FC<ImgFileUploadProps> = ({ 
  image, 
  setImage, 
  onUploadComplete,
  agentName,
  isUploading,
  setIsUploading,
  showUploadNowButton = true // Default to true for backward compatibility
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setImage(file);
    } else {
      setPreviewUrl(null);
      setImage(null);
    }
  };
  
  const handleClearFile = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }
    
    setUploading(true);
    if (setIsUploading) {
      setIsUploading(true);
    }
    setUploadProgress(0);
    
    try {
      let customFilename;
      if (agentName && agentName.trim() !== '') {
        const fileExt = image.name.split('.').pop() || 'png';
        customFilename = `${agentName.trim()}.${fileExt}`;
      }
      
      const result = await uploadImageFile(image, customFilename);
      setUploadProgress(100);
      
      if (result.success && result.filepath && onUploadComplete) {
        onUploadComplete(result.filepath);
        alert('Image uploaded successfully');
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  const CustomFileUpload = () => (
    <label htmlFor="image-upload" className="cursor-pointer">
      <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
        <Upload size={16} />
        <span>Choose File</span>
      </div>
    </label>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="image-upload" className="sr-only">
          Agent Image
        </Label>
        <div className="relative flex-1">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="opacity-0 absolute inset-0 w-0 h-0"
            aria-hidden="false"
          />
          <div className="flex items-center gap-2">
            <CustomFileUpload />
            <span className="text-sm text-muted-foreground">
              {image ? image.name : "No file selected"}
            </span>
          </div>
        </div>
        
        {image && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClearFile}
            title="Clear selected image"
          >
            <X size={18} />
          </Button>
        )}
      </div>
      
      {previewUrl && (
        <div className="relative w-full max-w-xs h-40 border rounded-md overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Image preview" 
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      {/* Only show upload button if showUploadNowButton is true */}
      {image && !uploading && showUploadNowButton && (
        <Button 
          onClick={handleUpload} 
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Image
        </Button>
      )}
      
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Uploading ({uploadProgress}%)...
          </p>
        </div>
      )}
      
      {!image && !previewUrl && (
        <div className="flex items-center justify-center w-full max-w-xs h-32 border border-dashed rounded-md bg-slate-50">
          <div className="text-center text-muted-foreground">
            <Image size={24} className="mx-auto mb-2" />
            <p className="text-sm">Select an image file</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImgFileUpload;
