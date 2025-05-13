
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { submitAgent } from '@/services/api/agentService';
import { AgentFormValues } from '@/types/agent';
import { UploadedFile } from '@/hooks/useFileUploads';

// Add logger utility for agent submission
const logSubmission = (area: string, message: string, data?: any) => {
  if (data) {
    console.log(`[AgentSubmission][${area}] ${message}`, data);
  } else {
    console.log(`[AgentSubmission][${area}] ${message}`);
  }
};

interface UseAgentSubmissionProps {
  imageFile: UploadedFile;
  execFile: UploadedFile;
}

export function useAgentSubmission({ imageFile, execFile }: UseAgentSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: AgentFormValues) => {
    try {
      setIsSubmitting(true);
      logSubmission('SUBMIT', 'Starting agent submission process', {
        formData: data,
        hasImageFile: !!imageFile.file,
        hasExecFile: !!execFile.file,
      });

      // Prepare the agent data
      const agentData = {
        name: data.name,
        description: data.description,
        author: data.author,
        gitRepo: data.gitRepo,
        homepage: data.homepage,
        serverEndpoint: data.serverEndpoint,
        inputParams: data.inputParams,
        outputExample: data.outputExample,
        // Pass existing URLs if files were previously uploaded
        imagePath: imageFile.downloadUrl || '',
        execFilePath: execFile.downloadUrl || '',
      };

      logSubmission('SUBMIT', 'Submitting agent with data', agentData);

      // Send files and data in a single request
      const response = await submitAgent(
        agentData,
        // Only pass files if they haven't already been uploaded
        imageFile.uploadedPath ? undefined : imageFile.file,
        execFile.uploadedPath ? undefined : execFile.file
      );

      logSubmission('SUBMIT', 'Submission response', response);

      if (response.success) {
        toast({
          title: 'Agent Submitted',
          description: `Your agent has been submitted successfully with ID: ${response.id}`,
        });

        // Redirect back to agent store after successful submission
        setTimeout(() => {
          navigate('/home/agent-store');
        }, 2000);
        
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logSubmission('SUBMIT', 'Error submitting agent', error);
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit agent. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}
