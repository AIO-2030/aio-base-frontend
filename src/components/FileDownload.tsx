
import React, { useState, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Button } from './ui/button';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDownloadResponse {
  success: boolean;
  data?: Blob;
  filename?: string;
  message: string;
}

interface FileDownloadProps {
  filepath: string;
  filename?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  onDownloadComplete?: (response: FileDownloadResponse) => void;
  onDownloadError?: (error: Error) => void;
  onDownloadProgress?: (progress: number) => void;
}

const FileDownload: React.FC<FileDownloadProps> = ({
  filepath,
  filename,
  className,
  variant = "default",
  size = "default",
  children,
  onDownloadComplete,
  onDownloadError,
  onDownloadProgress
}) => {
  const api = useApi();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const logFileOp = useCallback((operation: string, message: string, data?: any) => {
    if (data) {
      console.log(`[FILE_SERVICE][${operation}] ${message}`, data);
    } else {
      console.log(`[FILE_SERVICE][${operation}] ${message}`);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!filepath) {
      logFileOp('DOWNLOAD', 'Download aborted: No filepath provided');
      return;
    }

    setDownloading(true);
    setProgress(0);

    try {
      // Parse filepath to extract file information
      const pathParts = filepath.split('/');
      let fileType = 'unknown';
      
      if (filepath.includes('/mcp/')) {
        fileType = 'mcp';
      } else if (filepath.includes('/agent/')) {
        fileType = 'agent';
      } else if (filepath.includes('/whitepaper/')) {
        fileType = 'whitepaper';
      } else {
        fileType = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'unknown';
      }

      const downloadFilename = filename || pathParts[pathParts.length - 1] || 'unknown';
      const downloadUrl = `${api.baseUrl}/download?type=${fileType}&filename=${encodeURIComponent(downloadFilename)}`;

      // Create XHR request with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('GET', downloadUrl);
      xhr.responseType = 'blob';

      // Handle progress
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded * 100) / event.total);
          setProgress(percentComplete);
          onDownloadProgress?.(percentComplete);
        }
      };

      // Create promise to handle response
      const downloadPromise = new Promise<FileDownloadResponse>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const contentDisposition = xhr.getResponseHeader('content-disposition');
            const downloadedFilename = contentDisposition
              ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
              : downloadFilename;

            resolve({
              success: true,
              data: xhr.response,
              filename: downloadedFilename,
              message: 'File downloaded successfully'
            });
          } else {
            reject(new Error(xhr.statusText || 'Download failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error occurred'));
      });

      xhr.send();

      const response = await downloadPromise;
      
      // Create download link
      if (response.data && response.filename) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      onDownloadComplete?.(response);
      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
      logFileOp('DOWNLOAD', 'Exception during download', error);
      onDownloadError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    } finally {
      setDownloading(false);
    }
  }, [filepath, filename, api.baseUrl, onDownloadComplete, onDownloadError, onDownloadProgress, logFileOp]);

  return (
    <Button 
      onClick={() => handleDownload().catch(console.error)}
      disabled={downloading}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {progress < 100 ? `${progress}%` : 'Processing...'}
        </>
      ) : (
        <>
          {children || (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default FileDownload;
