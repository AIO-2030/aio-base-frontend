
import React from 'react';
import { FileImage, FileText, FileVideo, FileAudio, File, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getStoredFileAsBase64, getStoredFile } from '@/services/fileStorageService';
import { Button } from '@/components/ui/button';
import { AttachedFile } from './ChatFileUploader';

interface FilePreviewProps {
  file: AttachedFile;
  compact?: boolean;
  inMessage?: boolean;
  inAIResponse?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  file, 
  compact = false, 
  inMessage = false,
  inAIResponse = false 
}) => {
  const getFileIcon = (fileType: string, size = 20) => {
    if (fileType.startsWith('image/')) {
      return <FileImage size={size} />;
    } else if (fileType.includes('pdf')) {
      return <FileText size={size} />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo size={size} />;
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio size={size} />;
    } else {
      return <File size={size} />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const downloadFile = () => {
    const base64Data = getStoredFileAsBase64(file.id);
    if (!base64Data) return;

    const link = document.createElement('a');
    link.href = base64Data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // For image preview
  const renderImagePreview = () => {
    const base64Data = getStoredFileAsBase64(file.id);
    if (!base64Data) return null;

    return (
      <div className={`overflow-hidden rounded-md ${compact ? 'h-16 w-16' : inAIResponse ? 'max-h-32' : 'max-h-40'}`}>
        <img 
          src={base64Data} 
          alt={file.name} 
          className={`object-cover ${compact ? 'h-16 w-16' : inAIResponse ? 'max-h-32 max-w-full' : 'max-h-40 max-w-full'}`}
          onError={(e) => {
            console.error("Error loading image:", e);
            // Replace with file icon if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  };

  // Determine card class based on context
  const cardClassName = inMessage 
    ? `${compact ? 'p-0' : 'p-1'} border-0 shadow-none bg-transparent` 
    : inAIResponse
    ? 'border border-border/60 shadow-sm bg-secondary/30'
    : 'border shadow-sm';

  if (compact) {
    return (
      <Card className={cardClassName}>
        <CardContent className={`flex items-center space-x-2 ${inMessage ? 'p-0' : 'p-2'}`}>
          {file.type.startsWith('image/') 
            ? renderImagePreview()
            : <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-md">
                {getFileIcon(file.type, 24)}
              </div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-accent"
            onClick={downloadFile}
          >
            <Download size={16} />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cardClassName}>
      <CardContent className={`space-y-2 ${inMessage ? 'p-1' : inAIResponse ? 'p-3' : 'p-3'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getFileIcon(file.type)}
            <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-accent"
            onClick={downloadFile}
          >
            <Download size={16} />
          </Button>
        </div>
        
        {file.type.startsWith('image/') && (
          <div className="mt-2">
            {renderImagePreview()}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-1">
          {formatFileSize(file.size)}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilePreview;
