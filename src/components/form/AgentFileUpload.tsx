import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AgentFormValues } from '@/types/agent';
import ImgFileUpload from '@/components/form/ImgFileUpload';
import FileUpload from '@/components/FileUpload';
import ServerEndpointField from '@/components/form/ServerEndpointField';
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';

interface AgentFileUploadProps {
  form: UseFormReturn<AgentFormValues>;
  image: File | null;
  setImage: (file: File | null) => void;
  execFile: File | null;
  setExecFile: (file: File | null) => void;
  onImageUploadComplete?: (filePath: string) => void;
  onExecFileUploadComplete?: (filePath: string) => void;
  isUploading?: boolean;
  setIsUploading?: (value: boolean) => void;
  showUploadBeforeSubmit?: boolean;
}

const validateExecutableFile = (file: File) => {
  const allowedExtensions = ['.sh', '.bin', '.exe', '.js', '.py'];
  const maxSize = 100 * 1024 * 1024; // 100MB

  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size exceeds 100MB limit (${Math.round(file.size / 1024 / 1024)}MB)`
    };
  }

  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      message: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
    };
  }

  return { valid: true };
};

const validateFileNameMatches = (file: File, agentName: string) => {
  if (!agentName) {
    return {
      valid: false,
      message: 'Agent name is required before uploading a file'
    };
  }

  const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
  if (fileNameWithoutExt !== agentName) {
    return {
      valid: false,
      message: `File name must match agent name (${agentName})`
    };
  }

  return { valid: true };
};

const AgentFileUpload = ({ 
  form, 
  image, 
  setImage, 
  execFile, 
  setExecFile,
  onImageUploadComplete,
  onExecFileUploadComplete,
  isUploading,
  setIsUploading,
  showUploadBeforeSubmit = true
}: AgentFileUploadProps) => {
  // Get the current agent name from the form
  const agentName = form.watch('name');

  const validateAgentFile = (file: File) => {
    const execValidation = validateExecutableFile(file);
    if (!execValidation.valid) {
      return execValidation;
    }

    const nameValidation = validateFileNameMatches(file, agentName);
    if (!nameValidation.valid) {
      return nameValidation;
    }

    return { valid: true };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">File Uploads and Server Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormItem>
            <FormLabel>Agent Image</FormLabel>
            <FormDescription>Upload an image for your agent (optional)</FormDescription>
            <FormControl>
              <ImgFileUpload 
                image={image} 
                setImage={setImage} 
                onUploadComplete={onImageUploadComplete}
                agentName={agentName}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                showUploadNowButton={showUploadBeforeSubmit}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div>
          <FormItem>
            <FormLabel>Executable File</FormLabel>
            <FormDescription>Upload an executable file for your agent (optional)</FormDescription>
            <FormControl>
              <FileUpload 
                type="agent"
                customFilename={agentName ? `${agentName}.js` : undefined}
                onUploadComplete={(response) => {
                  if (response.success && response.filepath && onExecFileUploadComplete) {
                    onExecFileUploadComplete(response.filepath);
                  }
                  setExecFile(null);
                }}
                validateFile={validateAgentFile}
                accept=".sh,.bin,.js,.py,application/octet-stream"
                showUploadNowButton={showUploadBeforeSubmit}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      </div>
      
      {/* Server Endpoint field */}
      <ServerEndpointField form={form} />
      
      <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
        <strong>Important:</strong> The executable file name must match your agent name, and it must be compatible with Linux.
      </div>
    </div>
  );
};

export default AgentFileUpload;
