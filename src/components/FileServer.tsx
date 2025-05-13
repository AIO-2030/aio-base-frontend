import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { uploadExecutableFile, downloadExecutableFile, checkFileExists, getFileDownloadUrl } from '@/services/ExecFileUpload';
import { SERVER_PATHS } from '@/services/apiService';

// Add logger utility for FileServer component
const logFS = (area: string, message: string, data?: any) => {
  if (data) {
    console.log(`[FileServer][${area}] ${message}`, data);
  } else {
    console.log(`[FileServer][${area}] ${message}`);
  }
};

const FileServer: React.FC = () => {
  logFS('INIT', 'Component initializing');
  
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'agent' | 'mcp'>('agent');
  const [customFilename, setCustomFilename] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // For download tab
  const [filePath, setFilePath] = useState<string>('');
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    logFS('FILE_SELECTION', 'File input changed');
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      logFS('FILE_SELECTION', 'File selected', { 
        name: selectedFile.name, 
        size: selectedFile.size, 
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toISOString()
      });
      
      setFile(selectedFile);
      
      if (!customFilename) {
        logFS('FILE_SELECTION', `Setting default custom filename: ${selectedFile.name}`);
        setCustomFilename(selectedFile.name);
      } else {
        logFS('FILE_SELECTION', 'Custom filename already set, keeping current value', { customFilename });
      }
    } else {
      logFS('FILE_SELECTION', 'No file selected or selection canceled');
    }
  }, [customFilename]);

  const handleUpload = useCallback(async () => {
    logFS('UPLOAD', 'Upload process started');
    
    if (!file) {
      logFS('UPLOAD', 'No file selected, showing error');
      setUploadStatus('Please select a file first');
      setUploadSuccess(false);
      return;
    }

    logFS('UPLOAD', 'Starting upload for file', { 
      name: file.name, 
      size: file.size, 
      type: fileType,
      customName: customFilename
    });
    
    setIsUploading(true);
    setUploadProgress(0);
    
    logFS('UPLOAD', 'Starting progress simulation');
    // Simulate progress (in a real app, you'd use upload progress events)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev >= 95 ? prev : prev + 5;
        logFS('UPLOAD', `Progress simulation: ${newProgress}%`);
        
        if (prev >= 95) {
          logFS('UPLOAD', 'Progress simulation reached maximum (95%), waiting for actual completion');
          clearInterval(progressInterval);
          return prev;
        }
        return newProgress;
      });
    }, 100);

    try {
      logFS('UPLOAD', 'Calling uploadExecutableFile service');
      const result = await uploadExecutableFile(file, fileType, customFilename);
      
      logFS('UPLOAD', 'Upload service call completed', result);
      clearInterval(progressInterval);
      
      logFS('UPLOAD', 'Setting progress to 100% to indicate completion');
      setUploadProgress(100);
      
      if (result.success) {
        logFS('UPLOAD', 'Upload successful', { 
          filename: result.filename,
          filepath: result.filepath,
          downloadUrl: result.downloadUrl
        });
        
        setUploadStatus(`File uploaded successfully: ${result.filename}`);
        setUploadSuccess(true);
        setUploadedFilePath(result.filepath || '');
      } else {
        logFS('UPLOAD', 'Upload failed', { errorMessage: result.message });
        setUploadStatus(`Upload failed: ${result.message}`);
        setUploadSuccess(false);
      }
    } catch (error) {
      logFS('UPLOAD', 'Exception occurred during upload', error);
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploadSuccess(false);
    } finally {
      logFS('UPLOAD', 'Upload process completed, resetting uploading state');
      setIsUploading(false);
    }
  }, [file, fileType, customFilename]);

  const handleCheckExists = useCallback(async () => {
    logFS('CHECK_EXISTS', 'Starting file existence check');
    
    if (!filePath) {
      logFS('CHECK_EXISTS', 'No file path provided, showing error');
      setDownloadStatus('Please enter a file path');
      return;
    }

    logFS('CHECK_EXISTS', `Checking if file exists at path: ${filePath}`);
    
    try {
      const exists = await checkFileExists(filePath);
      logFS('CHECK_EXISTS', `File existence check result: ${exists ? 'exists' : 'does not exist'}`);
      
      setFileExists(exists);
      setDownloadStatus(exists ? 'File exists and is ready for download' : 'File does not exist');
    } catch (error) {
      logFS('CHECK_EXISTS', 'Exception during file existence check', error);
      setFileExists(false);
      setDownloadStatus(`Error checking file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [filePath]);

  const handleDownload = useCallback(async () => {
    logFS('DOWNLOAD', 'Starting file download process');
    
    if (!filePath) {
      logFS('DOWNLOAD', 'No file path provided, showing error');
      setDownloadStatus('Please enter a file path');
      return;
    }

    logFS('DOWNLOAD', `Downloading file from path: ${filePath}`);
    
    try {
      logFS('DOWNLOAD', 'Calling downloadExecutableFile service');
      const result = await downloadExecutableFile(filePath);
      logFS('DOWNLOAD', 'Download service call completed', { 
        success: result.success,
        filename: result.filename,
        hasData: !!result.data,
        message: result.message
      });
      
      if (result.success && result.data) {
        // Create a download link
        logFS('DOWNLOAD', 'Creating object URL for downloaded blob');
        const url = window.URL.createObjectURL(result.data);
        
        logFS('DOWNLOAD', 'Setting up download link', { 
          filename: result.filename,
          blobSize: result.data.size,
          blobType: result.data.type
        });
        
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || 'downloaded-file';
        document.body.appendChild(a);
        
        logFS('DOWNLOAD', 'Triggering download by clicking link');
        a.click();
        
        logFS('DOWNLOAD', 'Cleaning up: revoking object URL and removing link element');
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setDownloadStatus(`File downloaded: ${result.filename}`);
        logFS('DOWNLOAD', 'Download successful', { filename: result.filename });
      } else {
        logFS('DOWNLOAD', 'Download failed', { errorMessage: result.message });
        setDownloadStatus(`Download failed: ${result.message}`);
      }
    } catch (error) {
      logFS('DOWNLOAD', 'Exception during download', error);
      setDownloadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [filePath]);

  logFS('RENDER', 'Rendering component with current state', {
    hasFile: !!file,
    fileType,
    isUploading,
    uploadProgress,
    uploadSuccess,
    filePath,
    fileExists
  });

  return (
    <Card className="w-[800px] mx-auto my-8">
      <CardHeader>
        <CardTitle>File Server</CardTitle>
        <CardDescription>
          Upload and download executable files for agents and MCP servers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="download">Download Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileType" className="text-right">
                  File Type
                </Label>
                <Select 
                  value={fileType} 
                  onValueChange={(value) => setFileType(value as 'agent' | 'mcp')}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent">Agent Executable</SelectItem>
                    <SelectItem value="mcp">MCP Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetDir" className="text-right">
                  Target Directory
                </Label>
                <Input
                  id="targetDir"
                  value={fileType === 'agent' ? SERVER_PATHS.AGENT_EXEC_DIR : SERVER_PATHS.MCP_EXEC_DIR}
                  disabled
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customFilename" className="text-right">
                  Custom Filename
                </Label>
                <Input
                  id="customFilename"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  placeholder="Optional custom filename"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  File
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                />
              </div>
              
              {isUploading && (
                <div className="py-2">
                  <Label className="text-sm">Upload Progress</Label>
                  <Progress value={uploadProgress} className="h-2 mt-2" />
                </div>
              )}
              
              {uploadStatus && (
                <Alert variant={uploadSuccess ? "default" : "destructive"}>
                  <AlertDescription>{uploadStatus}</AlertDescription>
                </Alert>
              )}
              
              {uploadSuccess && uploadedFilePath && (
                <div className="text-sm mt-2">
                  <p>File Path: {uploadedFilePath}</p>
                  <p>Use this path to download the file later.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="download" className="space-y-4">
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filePath" className="text-right">
                  File Path
                </Label>
                <Input
                  id="filePath"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="Enter the path to the file"
                  className="col-span-3"
                />
              </div>
              
              {downloadStatus && (
                <Alert variant={fileExists ? "default" : "destructive"}>
                  <AlertDescription>{downloadStatus}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Tabs defaultValue="upload">
          <TabsContent value="upload">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          </TabsContent>
          <TabsContent value="download" className="flex space-x-4">
            <Button onClick={handleCheckExists} variant="outline">
              Check If File Exists
            </Button>
            <Button onClick={handleDownload} disabled={fileExists === false}>
              Download File
            </Button>
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  );
};

export default FileServer;
