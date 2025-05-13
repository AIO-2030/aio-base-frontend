
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  id: string;
  label: string;
  accept: string;
  buttonText: string;
  noFileText: string;
  onChange: (file: File | null) => void;
  validateFile?: (file: File) => { valid: boolean; message?: string };
  showPreview?: boolean;
  currentFile: File | null;
}

const FileUploader = ({
  id,
  label,
  accept,
  buttonText,
  noFileText,
  onChange,
  validateFile,
  showPreview = false,
  currentFile
}: FileUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (validateFile) {
        const validationResult = validateFile(selectedFile);
        if (!validationResult.valid) {
          toast({
            title: "Invalid File",
            description: validationResult.message || "The file is invalid",
            variant: "destructive",
          });
          return;
        }
      }
      
      onChange(selectedFile);

      if (showPreview) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          setPreview(loadEvent.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="block">{label}</Label>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById(id)?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> {buttonText}
          </Button>
          <Input 
            id={id} 
            type="file" 
            accept={accept} 
            className="hidden" 
            onChange={handleFileChange}
          />
          <span className="text-sm text-muted-foreground">
            {currentFile ? currentFile.name : noFileText}
          </span>
        </div>
        
        {showPreview && preview && (
          <div className="mt-2 overflow-hidden rounded-md border">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full object-cover"
            />
          </div>
        )}
        
        {!showPreview && currentFile && (
          <div className="mt-2 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Selected file: {currentFile.name}</p>
            <p className="text-xs text-muted-foreground">Size: {(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
