
import React, { ReactNode } from 'react';

interface AddAgentFormContainerProps {
  children: ReactNode;
}

const AddAgentFormContainer = ({ children }: AddAgentFormContainerProps) => {
  return (
    <div className="py-8 max-w-3xl mx-auto">
      {children}
    </div>
  );
};

export default AddAgentFormContainer;
