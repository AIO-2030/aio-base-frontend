
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MCPServerFormValues } from '@/types/agent';
import CommunicationTypeSection from './sections/CommunicationTypeSection';
import MCPCapabilitiesSection from './sections/MCPCapabilitiesSection';
import ImplementationDetailsSection from './sections/ImplementationDetailsSection';

interface MCPServerTechnicalInfoProps {
  form: UseFormReturn<MCPServerFormValues>;
}

const MCPServerTechnicalInfo = ({
  form
}: MCPServerTechnicalInfoProps) => {
  return (
    <div className="space-y-6">
      <CommunicationTypeSection form={form} />
      <MCPCapabilitiesSection form={form} />
      <ImplementationDetailsSection form={form} />
    </div>
  );
};

export default MCPServerTechnicalInfo;
