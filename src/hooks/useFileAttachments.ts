
import { useState } from 'react';
import { AIMessage } from '@/services/types/aiTypes';
import { AttachedFile } from '@/components/chat/ChatFileUploader';
import { toast } from '@/components/ui/use-toast';

export function useFileAttachments() {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const handleFileAttached = (fileId: string, fileInfo: AttachedFile) => {
    const newFiles = [...attachedFiles, fileInfo];
    setAttachedFiles(newFiles);
    
    toast({
      title: "File attached",
      description: `${fileInfo.name} has been attached to your message.`,
    });
    
    return newFiles;
  };
  
  const handleFileRemoved = (fileId: string) => {
    const updatedFiles = attachedFiles.filter(file => file.id !== fileId);
    setAttachedFiles(updatedFiles);
    return updatedFiles;
  };

  const clearAttachedFiles = () => {
    setAttachedFiles([]);
  };

  const updateMessagesWithFilePreview = (
    messages: AIMessage[], 
    files: AttachedFile[]
  ): AIMessage[] => {
    if (files.length === 0) {
      return messages;
    }
    
    const updatedMessages = [...messages];
    
    if (files.length === 1) {
      const aiResponse: AIMessage = {
        id: `file-preview-${Date.now()}`,
        sender: 'ai',
        content: "I've received your file. Here's what you uploaded:",
        timestamp: new Date(),
        referencedFiles: files
      };
      
      return [...updatedMessages, aiResponse];
    } else {
      const lastAiMessageIndex = updatedMessages.findIndex(msg => 
        msg.sender === 'ai' && msg.referencedFiles && msg.referencedFiles.length > 0
      );
      
      if (lastAiMessageIndex !== -1) {
        updatedMessages[lastAiMessageIndex] = {
          ...updatedMessages[lastAiMessageIndex],
          referencedFiles: files,
          content: "I've received your files. Here's what you uploaded:"
        };
      } else {
        updatedMessages.push({
          id: `file-preview-${Date.now()}`,
          sender: 'ai',
          content: "I've received your files. Here's what you uploaded:",
          timestamp: new Date(),
          referencedFiles: files
        });
      }
      
      return updatedMessages;
    }
  };

  const removeFilePreviewFromMessages = (
    messages: AIMessage[],
    files: AttachedFile[]
  ): AIMessage[] => {
    if (files.length > 0) {
      return messages;
    }
    
    const updatedMessages = [...messages];
    const lastAiMessageIndex = updatedMessages.findIndex(msg => 
      msg.sender === 'ai' && msg.referencedFiles && msg.referencedFiles.length > 0
    );
    
    if (lastAiMessageIndex !== -1) {
      updatedMessages.splice(lastAiMessageIndex, 1);
    }
    
    return updatedMessages;
  };

  return {
    attachedFiles,
    handleFileAttached,
    handleFileRemoved,
    clearAttachedFiles,
    updateMessagesWithFilePreview,
    removeFilePreviewFromMessages
  };
}
