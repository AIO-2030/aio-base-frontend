import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import FileUpload, { FileUploadResponse } from '@/components/FileUpload';
import { MCPServerFormValues } from '@/types/agent';

interface MCPServerFileUploadProps {
  form: UseFormReturn<MCPServerFormValues>;
  serverFile: File | null;
  setServerFile: (file: File | null) => void;
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

const validateFileNameMatches = (file: File, serverName: string) => {
  if (!serverName) {
    return {
      valid: false,
      message: 'Server name is required before uploading a file'
    };
  }

  const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
  if (fileNameWithoutExt !== serverName) {
    return {
      valid: false,
      message: `File name must match server name (${serverName})`
    };
  }

  return { valid: true };
};

const MCPServerFileUpload: React.FC<MCPServerFileUploadProps> = ({
  form,
  serverFile,
  setServerFile,
}) => {
  const handleUploadComplete = (response: FileUploadResponse) => {
    if (response.success && response.filepath) {
      console.log('[MCPServerFileUpload] File uploaded successfully:', response);
      setServerFile(null); // Reset file state after successful upload
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('[MCPServerFileUpload] Upload error:', error);
    form.setError('name', {
      type: 'manual',
      message: `Upload failed: ${error.message}`
    });
  };

  const handleUploadProgress = (progress: number) => {
    console.log('[MCPServerFileUpload] Upload progress:', progress);
  };

  const validateFile = (file: File) => {
    const execValidation = validateExecutableFile(file);
    if (!execValidation.valid) {
      return execValidation;
    }

    const nameValidation = validateFileNameMatches(file, form.getValues('name'));
    if (!nameValidation.valid) {
      return nameValidation;
    }

    return { valid: true };
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">MCP Server Executable</h3>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          <Alert>
            <AlertDescription>
              Upload your MCP server executable file. The filename should match the server name
              for proper identification. Supported formats: .exe, .bin, .sh
            </AlertDescription>
          </Alert>

          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Server Executable</FormLabel>
                <FileUpload
                  type="mcp"
                  customFilename={form.getValues('name')}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  onUploadProgress={handleUploadProgress}
                  validateFile={validateFile}
                  accept=".sh,.bin,.exe,.js,.py"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MCPServerFileUpload;
