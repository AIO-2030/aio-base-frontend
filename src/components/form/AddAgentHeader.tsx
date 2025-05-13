
import React from 'react';
import BackButton from '@/components/form/BackButton';

interface AddAgentHeaderProps {
  title: string;
}

const AddAgentHeader = ({ title }: AddAgentHeaderProps) => {
  return (
    <div className="flex items-center mb-8">
      <BackButton to="/home/agent-store" />
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default AddAgentHeader;
