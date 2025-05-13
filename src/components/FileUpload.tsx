import React, { useState, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { SERVER_PATHS } from '../contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Response interfaces
export interface FileUploadResponse {
  success: boolean;
  filepath?: string;
  filename?: string;
  downloadUrl?: string;
  message: string;
}

export type FileType = 'agent' | 'mcp' | 'img';

interface FileUploadProps {
  type: FileType;
  onUploadComplete?: (response: FileUploadResponse) => void;
  onUploadError?: (error: Error) => void;
  onUploadProgress?: (progress: number) => void;
  customFilename?: string;
  accept?: string;
  validateFile?: (file: File) => { valid: boolean; message?: string };
  showUploadNowButton?: boolean;
  isUploading?: boolean;
  setIsUploading?: (value: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  customFilename,
  accept = '.sh,.bin,.js,.py,.exe,application/octet-stream',
  validateFile,
  showUploadNowButton = true,
  isUploading: externalIsUploading,
  setIsUploading: setExternalIsUploading
}) => {
  const api = useApi();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [isLocalUploading, setIsLocalUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'pending' | 'uploading' | 'success' | 'error'>('pending');
  const [progress, setProgress] = useState(0);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>('');

  const logFileOp = useCallback((operation: string, message: string, data?: any) => {
    if (data) {
      console.log(`[FILE_SERVICE][${operation}] ${message}`, data);
    } else {
      console.log(`[FILE_SERVICE][${operation}] ${message}`);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file if validator provided
      if (validateFile) {
        const validation = validateFile(file);
        if (!validation.valid) {
          toast({
            title: "Invalid File",
            description: validation.message || "Please upload a valid file",
            variant: "destructive",
          });
          return;
        }
      }
      
      setSelectedFile(file);
      setUploadStep('pending');
    }
  };

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setIsLocalUploading(true);
    if (setExternalIsUploading) {
      setExternalIsUploading(true);
    }
    setUploadStep('uploading');
    setProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Get upload URL
      const uploadUrl = api.getFullUploadUrl(type);

      console.log('[FileUpload] Starting upload to:', uploadUrl);

      // Create promise to handle XHR response
      const uploadPromise = new Promise<FileUploadResponse>((resolve, reject) => {
        // Set up XHR
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.withCredentials = false; // Important: set to false when using "*" for CORS

        // Add progress handling
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded * 100) / event.total);
            setProgress(percentComplete);
            onUploadProgress?.(percentComplete);
          }
        };

        // Add success handling
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                filepath: response.path || '',
                filename: selectedFile.name,
                downloadUrl: `${api.baseUrl}/download?type=${type}&filename=${encodeURIComponent(selectedFile.name)}`,
                message: 'File uploaded successfully'
              });
            } catch (error) {
              // If response is not JSON but contains success indicators
              if (xhr.responseText.includes('success') || xhr.responseText.includes('uploaded')) {
                resolve({
                  success: true,
                  filepath: '',
                  filename: selectedFile.name,
                  downloadUrl: `${api.baseUrl}/download?type=${type}&filename=${encodeURIComponent(selectedFile.name)}`,
                  message: xhr.responseText || 'File uploaded successfully'
                });
              } else {
                reject(new Error('Invalid response format from server'));
              }
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
          }
        };

        // Add error handling
        xhr.onerror = () => {
          console.error('XHR error:', xhr.status, xhr.statusText);
          reject(new Error(`Network error occurred during upload: ${xhr.statusText}`));
        };

        // Add timeout handling
        xhr.timeout = 1800000; // 30 minutes
        xhr.ontimeout = () => {
          console.error('Upload timed out');
          reject(new Error('Upload timed out after 30 minutes'));
        };

        // Send the form data
        xhr.send(formData);
      });

      // Wait for upload to complete
      const response = await uploadPromise;
      setUploadedFilePath(response.filepath || '');
      setUploadStep('success');
      
      toast({
        title: "File Upload Successful",
        description: `File '${response.filename}' uploaded successfully.`,
      });
      
      onUploadComplete?.(response);
      return response;

    } catch (error) {
      setUploadStep('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      console.error('[FileUpload] Upload failed:', {
        error: errorMessage,
        url: api.getFullUploadUrl(type)
      });
      
      toast({
        title: "File Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      onUploadError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    } finally {
      setIsLocalUploading(false);
      if (setExternalIsUploading) {
        setExternalIsUploading(false);
      }
    }
  }, [type, customFilename, api, selectedFile, onUploadComplete, onUploadError, onUploadProgress, setExternalIsUploading, toast]);

  const handleUploadComplete = () => {
    setShowFileUploader(false);
    if (uploadStep === 'success') {
      onUploadComplete?.({
        success: true,
        filepath: uploadedFilePath,
        filename: selectedFile?.name,
        message: 'File uploaded successfully'
      });
    }
  };

  const isUploading = isLocalUploading || externalIsUploading;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`file-${type}`)?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Choose File
          </Button>
          <input
            id={`file-${type}`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-sm text-muted-foreground">
            {selectedFile ? selectedFile.name : 'No file chosen'}
          </span>
        </div>

        {selectedFile && showUploadNowButton && (
          <div className="flex items-center mt-2">
            <Button 
              type="button" 
              onClick={() => setShowFileUploader(true)}
              variant="secondary"
              size="sm"
            >
              Upload Now
            </Button>
            <span className="ml-2 text-xs text-muted-foreground">
              Upload file to server before submitting the form
            </span>
          </div>
        )}
      </div>

      {/* File upload dialog */}
      <Dialog open={showFileUploader} onOpenChange={setShowFileUploader}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Your file needs to be uploaded before submitting.
              {uploadStep === 'error' && 
                <p className="text-destructive mt-2">
                  There was a problem uploading your file. Please try again or cancel to go back.
                </p>
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Selected File: {selectedFile?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Size: {selectedFile && Math.round(selectedFile.size / 1024)} KB
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFileUploader(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                
                <Button 
                  onClick={handleFileUpload}
                  disabled={isUploading || uploadStep === 'success'}
                >
                  {isUploading ? 'Uploading...' : uploadStep === 'success' ? 'Upload Complete' : 'Upload File'}
                </Button>
              </div>
            </div>
            
            {uploadStep === 'uploading' && (
              <div className="w-full bg-muted rounded-full h-2.5 my-4">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="text-center text-sm text-muted-foreground mt-1">
                  {progress}%
                </div>
              </div>
            )}
            
            {uploadStep === 'success' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md my-4">
                <p className="text-green-800 dark:text-green-300">
                  File uploaded successfully! Filepath: {uploadedFilePath}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Click "Continue" to proceed with submission.
                </p>
              </div>
            )}
            
            {uploadStep === 'error' && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md my-4">
                <p className="text-red-800 dark:text-red-300">
                  Failed to upload file. Please try again or cancel.
                </p>
              </div>
            )}
          </div>
          
          {uploadStep === 'success' && (
            <div className="flex justify-end">
              <Button onClick={handleUploadComplete}>
                Continue with Submission
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload; 