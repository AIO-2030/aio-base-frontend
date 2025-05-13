
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import AgentBasicInfo from '@/components/form/AgentBasicInfo';
import AgentTechnicalInfo from '@/components/form/AgentTechnicalInfo';
import AgentIOExamples from '@/components/form/AgentIOExamples';
import AgentFileUpload from '@/components/form/AgentFileUpload';
import { AgentFormValues, agentFormSchema } from '@/types/agent';
import AddAgentHeader from '@/components/form/AddAgentHeader';
import AddAgentFormContainer from '@/components/form/AddAgentFormContainer';
import FormCard from '@/components/form/FormCard';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { useFileUploads } from '@/hooks/useFileUploads';
import { useAgentSubmission } from '@/hooks/useAgentSubmission';

const AddAgent = () => {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      author: '',
      gitRepo: '',
      homepage: '',
      serverEndpoint: '',
      inputParams: '',
      outputExample: '',
    },
  });
  
  // Use our custom file upload hook
  const { 
    imageFile, 
    execFile, 
    setImage, 
    setExecFile, 
    handleImageUploadComplete, 
    handleExecFileUploadComplete,
    isUploading,
    setIsUploading
  } = useFileUploads();

  // Use our agent submission hook
  const { isSubmitting, handleSubmit } = useAgentSubmission({
    imageFile,
    execFile
  });

  // Handle form submission - directly submit both data and files
  const onSubmit = async (data: AgentFormValues) => {
    await handleSubmit(data);
  };

  return (
    <AddAgentFormContainer>
      <AddAgentHeader title="Add My Agent" />

      <FormCard>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <AgentBasicInfo form={form} />

            {/* File Upload Section - we'll make it simpler */}
            <AgentFileUpload
              form={form}
              image={imageFile.file}
              setImage={setImage}
              execFile={execFile.file}
              setExecFile={setExecFile}
              onImageUploadComplete={handleImageUploadComplete}
              onExecFileUploadComplete={handleExecFileUploadComplete}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              showUploadBeforeSubmit={false} // New prop to hide "upload before submit" message
            />

            {/* Technical Information Section */}
            <AgentTechnicalInfo form={form} />

            {/* I/O Examples Section */}
            <AgentIOExamples form={form} />

            <div className="pt-4">
              <FormSubmitButton 
                isSubmitting={isSubmitting || isUploading} 
                label="Submit Agent" 
                submittingLabel="Submitting..." 
              />
            </div>
          </form>
        </Form>
      </FormCard>
    </AddAgentFormContainer>
  );
};

export default AddAgent;
